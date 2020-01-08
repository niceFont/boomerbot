import Service from "./service";
import { TeamSpeak } from "ts3-nodejs-library";
import UserException from "../Exceptions/userException";
import { ITMDB } from "../DataAccessObjects/TMDB";
import { IReminderDB } from "../DataAccessObjects/reminderDB";
import Reminder from "../Types/Reminders/reminder";
import { injectable, inject } from "inversify";
import Types from "../inversifyTypes";
import UserAction from "../Types/Actions/userActions";
import { Command } from "ts3-nodejs-library/lib/transport/Command";

/**
 * @class
 * @implements {Service}
 */
@injectable()
export class ClientService implements IClientService {
    protected reminderDB: IReminderDB
    protected tmdb: ITMDB

    constructor(
        @inject(Types.TMDB) tmdb: ITMDB,
        @inject(Types.ReminderDB) reminderDB: IReminderDB
    ) {
        this.tmdb = tmdb
        this.reminderDB = reminderDB
    }

    async dispatch(action: UserAction, teamspeak: TeamSpeak): Promise<void> {

        try {
            switch (action.command.identifier) {
                case "greet":
                    await this.greet(action, teamspeak)
                    break
                case "movie":
                    await this.getRandomMovie(action, teamspeak)
                    break
                case "reminder":
                    if (action.commandArguments[0] === "add") {
                        await this.addReminder(action, teamspeak)
                    }
                    if (action.commandArguments[0] === "list") {
                        await this.listAllReminders(action, teamspeak)
                    }
                    if (action.commandArguments[0] === "remove") {
                        await this.removeReminder(action, teamspeak)
                    }
                    break
                default:
                    return
            }
        } catch (error) {
            throw error
        }


    }

    async removeReminder(action: UserAction, teamspeak: TeamSpeak): Promise<void> {
        try {

            if (!action.commandArguments.length) throw new Error("No arguments provided.")
            if (typeof action.commandArguments[1] === "undefined") throw new Error("Missing Id in arguments.")

            await this.reminderDB.removeReminder(action.commandArguments[1])

            await teamspeak.sendTextMessage(action.invoker.cid, action.targetmode, "Reminder has been successfully removed")
        } catch (error) {
            throw new UserException("Error: " + error.message, action.invoker, action.targetmode)
        }
    }

    async listAllReminders(action: UserAction, teamspeak: TeamSpeak): Promise<void> {
        try {
            await Promise.resolve().then(async _ => {

                const reminders = await this.reminderDB.getAllRemindersFrom(action.invoker.clid)
                if (!reminders.length) throw new Error("No reminders were found.")

                for (let reminder of reminders) {
                    const message = `${reminder.id}         ${reminder.message}         ${reminder.timeout / 1000}`
                    await teamspeak.sendTextMessage(action.invoker.cid, action.targetmode, message)
                }
            })
        } catch (error) {
            throw new UserException("Error: " + error.message, action.invoker, action.targetmode)
        }
    }

    async getRandomMovie(action: UserAction, teamspeak: TeamSpeak): Promise<void> {
        try {
            if (!action.commandArguments.length) throw new Error("No Genre provided.")
            await Promise.resolve().then(async () => {
                for (let genre of this.tmdb.genreList.genres) {
                    if (genre.name.toLowerCase() === action.commandArguments[0]) {
                        const movies = await this.tmdb.getMoviesByGenre(genre)
                        const randomNumber = Math.abs(Math.floor(Math.random() * movies.results.length - 1))
                        const randomMovie = movies.results[randomNumber]
                        const message = `${randomMovie.original_title} ${randomMovie.release_date.slice(0, 4)}  score: ${randomMovie.vote_average}  `
                        await teamspeak.sendTextMessage(action.invoker.cid, action.targetmode, message)
                        return
                    }
                }
                await teamspeak.sendTextMessage(action.invoker.cid, action.targetmode, "Genre Not Found")
            })
        } catch (error) {
            throw new UserException("Error: " + error.message, action.invoker, action.targetmode);
        }
    }


    async greet(action: UserAction, teamspeak: TeamSpeak): Promise<void> {
        try {
            await teamspeak.sendTextMessage(action.invoker.cid, action.targetmode, `Hello ${action.invoker.nickname} :)`)
        } catch (error) {
            console.log(error.message)
            throw new UserException("Error: " + error.message, action.invoker, action.targetmode)
        }
    }

    async addReminder(action: UserAction, teamspeak: TeamSpeak): Promise<void> {
        try {
            if (!action.commandArguments.length) throw new Error("Missing arguments after reminder")
            if (typeof action.commandArguments[1] === "undefined") throw new Error("Missing timer in argument list")
            if (typeof action.commandArguments[2] === "undefined") throw new Error("Missing message in argument list")

            const time = parseInt(action.commandArguments[1]) * 60 * 1000
            const reminder = new Reminder(time, action.commandArguments[2])
            this.reminderDB.addReminder(reminder)
            reminder.start(async () => {
                try {
                    await teamspeak.sendTextMessage(action.invoker.cid, 1, `Reminder from ${action.invoker.nickname}: ${reminder.message}`)
                    await this.reminderDB.removeReminder(reminder.id)
                } catch (error) {
                    console.log(error)
                }
            })
            await teamspeak.sendTextMessage(action.invoker.cid, action.targetmode, `Reminder has been successfully created. You will be reminded in ${action.commandArguments[1]} minute(s).`)
        } catch (error) {
            throw new UserException("Error: " + error.message, action.invoker, action.targetmode)
        }
    }
}

export interface IClientService extends Service {
    addReminder(action: UserAction, teamspeak: TeamSpeak): Promise<void>
    listAllReminders(action: UserAction, teamspeak: TeamSpeak): Promise<void>
    removeReminder(action: UserAction, teamspeak: TeamSpeak): Promise<void>
    greet(action: UserAction, teamspeak: TeamSpeak): Promise<void>
    getRandomMovie(action: UserAction, teamspeak: TeamSpeak): Promise<void>
}

