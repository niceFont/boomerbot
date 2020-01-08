import Service from "./service";
import { TeamSpeak, TeamSpeakClient, ClientType } from "ts3-nodejs-library";
import { BotAction } from "../Types/Actions/botActions";
import { inject, injectable } from "inversify";
import Types from "../inversifyTypes";
import { TaskDB, ITaskDB } from "../DataAccessObjects/taskDB";
import { Task } from "../Types/Tasks/task";
import { IBotSettings, BotSettings } from "../DataAccessObjects/botSettings";
import { CommandIdentifiers } from "../types";
import { IReminderDB, ReminderDB } from "../DataAccessObjects/reminderDB";

@injectable()
export class BotService implements IBotService {

    private taskDB: ITaskDB
    private reminderDB: IReminderDB
    private settings: IBotSettings

    constructor(
        @inject(Types.TaskDB) taskDB: TaskDB,
        @inject(Types.BotSettings) settings: BotSettings,
        @inject(Types.ReminderDB) reminderDB: ReminderDB
    ) {
        this.settings = settings
        this.taskDB = taskDB
        this.reminderDB = reminderDB
    }

    async dispatch(action: BotAction, teamspeak: TeamSpeak): Promise<void> {
        try {
            switch (action.command.identifier) {
                case CommandIdentifiers.AFK_PURGE:
                    await this.startAfkPurger(teamspeak)
                    break
                case CommandIdentifiers.GARBAGE_COLLECT:
                    await this.startGarbageCollector(teamspeak)
                    break
                default:
                    break
            }
        } catch (error) {

        }
    }
    async startGarbageCollector(teamspeak: TeamSpeak): Promise<void> {
        try {
            const garbageCollector = new Task(5000, async () => {
                Promise.resolve().then(async _ => {
                    try {
                        for (let reminder of this.reminderDB.getAllReminders()) {
                            if (reminder.completed) this.reminderDB.removeReminder(reminder.id)
                        }
                    } catch (error) {
                        console.log(error)
                    }
                })
            })
            await Promise.all([
                this.taskDB.addTask(garbageCollector),
                garbageCollector.start()
            ])
        } catch (error) {
            console.log(error)
        }
    }

    async startAfkPurger(teamspeak: TeamSpeak): Promise<void> {
        try {
            const afkTask = new Task(1000, () => {
                Promise.resolve().then(async () => {
                    try {
                        const clients = await teamspeak.clientList()
                        let idleTime: number
                        for (let client of clients) {
                            idleTime = client.idleTime / 1000 / 60

                            if (idleTime / 1000 / 60 >= this.settings.afkLimit && client.type === ClientType.Regular) {
                                teamspeak.clientKick(client.clid, 5, "Away")
                            }
                        }
                    } catch (error) {
                        console.log(error)
                    }
                })
            })

            await Promise.all([
                this.taskDB.addTask(afkTask),
                afkTask.start()
            ])
        } catch (error) {
            throw new Error(error);
        }
    }



}


export interface IBotService extends Service {
    startAfkPurger(teamspeak: TeamSpeak): Promise<void>
    startGarbageCollector(teamspeak: TeamSpeak): Promise<void>
}