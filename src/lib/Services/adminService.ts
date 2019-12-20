import Service from "./service";
import { TeamSpeak } from "ts3-nodejs-library";
import Action from "../actions";
import UserException from "../Exceptions/userException";
import { injectable, inject } from "inversify";
import Types from "../inversifyTypes";

/**
 * @class
 * @implements {Service}
 */
export class AdminService implements IAdminService {

    /**
     * @constructor
     * @param teamspeak - Connected Teamspeak Instance
     */
    constructor() {
    }

    /**
     * @param {Action} action - Action fired on TextMessage
     */
    async dispatch(action: Action, teamspeak: TeamSpeak): Promise<void> {
        try {
            switch (action.command.identifier) {
                case "kick":
                    await this.kick(action, teamspeak);
                case "snap":
                    await this.thanos(action, teamspeak);
            }
        } catch (error) {
            throw error
        }
    }

    /**
     * @param {Action} action - Action fired on TextMessage
     */
    async kick(action: Action, teamspeak: TeamSpeak): Promise<void> {
        try {
            const users = await teamspeak.clientFind(action.commandArguments[0])
            if (!users.length) throw new Error("No such user exists.")
            const user = users[0]
            await teamspeak.clientKick(user.clid, 5, action.commandArguments[1])
        } catch (error) {
            console.error(error)
            throw new UserException("Error while trying to kick User: " + error.message, action.invoker, action.targetmode)
        }
    }

    async thanos(action: Action, teamspeak: TeamSpeak): Promise<void> {
        try {
            const clients = await teamspeak.clientList()

            for (let client in clients) {
                if (+client % 2 === 0) {
                    await teamspeak.clientKick(clients[client].clid, 5, "I am inevitable...")
                }
            }
        } catch (error) {
            throw new UserException("Error: Avengers", action.invoker, action.targetmode)
        }
    }

}

export interface IAdminService extends Service {
    thanos(action: Action, teamspeak: TeamSpeak): Promise<void>
    kick(action: Action, teamspeak: TeamSpeak): Promise<void>
}