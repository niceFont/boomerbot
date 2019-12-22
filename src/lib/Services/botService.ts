import Service from "./service";
import { TeamSpeak, TeamSpeakClient, ClientType } from "ts3-nodejs-library";
import { BotAction } from "../Types/Actions/botActions";
import { inject, injectable } from "inversify";
import Types from "../inversifyTypes";
import { TaskDB } from "../DataAccessObjects/taskDB";
import { Task } from "../Types/Tasks/task";

@injectable()
export class BotService implements IBotService {

    private taskDB: TaskDB

    constructor(@inject(Types.TaskDB) taskDB: TaskDB) {
        this.taskDB = taskDB
    }

    async dispatch(action: BotAction, teamspeak: TeamSpeak): Promise<void> {
        try {
            switch (action.command.identifier) {
                case "afkPurge":
                    await this.startAfkPurger(action, teamspeak)
                default:
                    break
            }
        } catch (error) {

        }
    }
    async startAfkPurger(action: BotAction, teamspeak: TeamSpeak): Promise<void> {
        try {
            const afkTask = new Task(1000, async () => {
                try {
                    const clients = await teamspeak.clientList()

                    for (let client of clients) {
                        if (client.idleTime / 1000 / 60 >= 30 && client.type === ClientType.Regular) {
                            await teamspeak.clientKick(client.clid, 5, "Away")
                        }
                    }
                } catch (error) {
                    console.log(error)
                }
            })

            await this.taskDB.addTask(afkTask)
            await afkTask.start()
        } catch (error) {
            throw new Error(error);
        }
    }

}


export interface IBotService extends Service {

}