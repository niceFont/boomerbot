import Dispatcher from "./dispatcher";
import { TeamSpeak } from "ts3-nodejs-library";
import Action from "../actions";
import UserException from "../Exceptions/userException";
import TMDBHandler from "../ApiHandlers/TMDB";
import ReminderDB from "../reminderDB";
import Reminder from "../reminder";
import { injectable, inject } from "inversify";
import Types from "../inversifyTypes";

/**
 * @class
 * @implements {Dispatcher}
 */

@injectable()
class ClientDispatcher implements Dispatcher {
    teamspeak: TeamSpeak
    reminderDB: ReminderDB
    tmdb: TMDBHandler

    constructor(@inject(Types.TeamSpeak) teamSpeak: TeamSpeak) {
        this.teamspeak = teamSpeak
        this.tmdb = new TMDBHandler(process.env.TMDB_API_KEY)
        this.reminderDB = new ReminderDB()
    }

    async dispatch(action: Action): Promise<void> {

        try {
            switch (action.command.identifier) {
                case "greet":
                    await this.greet(action)
                    break
                case "movie":
                    await this.getRandomMovie(action)
                    break
                case "reminder":
                    if (action.commandArguments[0] === "add") {
                        await this.addReminder(action)
                    }
                    if (action.commandArguments[0] === "list") {
                        await this.listAllReminders(action)
                    }
                    if (action.commandArguments[0] === "remove") {
                        await this.removeReminder(action)
                    }
                    break
                default:
                    return
            }
        } catch (error) {
            throw error
        }


    }
    async removeReminder(action: Action): Promise<void> {
        try {

            if (!action.commandArguments.length) throw new Error("No arguments provided.")
            if (typeof action.commandArguments[1] === "undefined") throw new Error("Missing Id in arguments.")

            await this.reminderDB.removeReminder(action.commandArguments[1])

            await this.teamspeak.sendTextMessage(action.invoker.cid, action.targetmode, "Reminder has been successfully removed")
        } catch (error) {
            throw new UserException("Error: " + error.message, action.invoker, action.targetmode)
        }
    }

    async listAllReminders(action: Action): Promise<void> {
        try {
            const reminders = await this.reminderDB.getAllReminders()
            if (!reminders.length) throw new Error("No reminders were found.")

            for (let reminder of reminders) {
                const message = `${reminder.id}         ${reminder.message}         ${reminder.time / 1000}`
                await this.teamspeak.sendTextMessage(action.invoker.cid, action.targetmode, message)
            }
        } catch (error) {
            throw new UserException("Error: " + error.message, action.invoker, action.targetmode)
        }
    }

    async getRandomMovie(action: Action): Promise<void> {
        try {

            if (!action.commandArguments.length) throw new Error("No Genre provided.")
            for (let genre of this.tmdb.genreList.genres) {
                if (genre.name.toLowerCase() === action.commandArguments[0]) {
                    const movies = await this.tmdb.getMoviesByGenre(genre)
                    const randomNumber = Math.abs(Math.floor(Math.random() * movies.results.length - 1))
                    const randomMovie = movies.results[randomNumber].original_title
                    await this.teamspeak.sendTextMessage(action.invoker.cid, action.targetmode, randomMovie)
                    return
                }
            }

            await this.teamspeak.sendTextMessage(action.invoker.cid, action.targetmode, "Genre Not Found")
            return
        } catch (error) {
            console.log(error)
            throw new UserException("Error: " + error.message, action.invoker, action.targetmode);
        }
    }


    async greet(action: Action): Promise<void> {
        try {
            await this.teamspeak.sendTextMessage(action.invoker.cid, action.targetmode, `Hello ${action.invoker.nickname} :)`)
        } catch (error) {
            console.log(error.message)
            throw new UserException("Error: " + error.message, action.invoker, action.targetmode)
        }
    }

    async addReminder(action: Action): Promise<void> {
        try {
            if (!action.commandArguments.length) throw new Error("Missing arguments after reminder")
            if (typeof action.commandArguments[1] === "undefined") throw new Error("Missing timer in argument list")
            if (typeof action.commandArguments[2] === "undefined") throw new Error("Missing message in argument list")

            const time = parseInt(action.commandArguments[1]) * 60 * 1000

            const reminder = new Reminder(time, action.commandArguments[2])
            await this.reminderDB.addReminder(reminder)
            await reminder.start(async () => {
                await this.teamspeak.sendTextMessage(action.invoker.cid, action.targetmode, `Reminder from ${action.invoker.nickname}: ${reminder.message}`)
                await this.reminderDB.removeReminder(reminder.id)
            })
            await this.teamspeak.sendTextMessage(action.invoker.cid, action.targetmode, "Reminder has been successfully created.")
        } catch (error) {
            throw new UserException("Error: " + error.message, action.invoker, action.targetmode)
        }
    }


}


export default ClientDispatcher