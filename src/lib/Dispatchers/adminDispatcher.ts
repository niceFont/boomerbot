import Dispatcher from "./dispatcher";
import { TeamSpeak } from "ts3-nodejs-library";
import Action from "../actions";
import UserException from "../Exceptions/userException";
/**
 * @class
 * @implements {Dispatcher}
 */
class AdminDispatcher implements Dispatcher {
    teamspeak: TeamSpeak

    /**
     * @constructor
     * @param teamspeak - Connected Teamspeak Instance
     */
    constructor(teamspeak: TeamSpeak) {
        this.teamspeak = teamspeak
    }

    /**
     * @param {Action} action - Action fired on TextMessage
     */
    async dispatch(action: Action): Promise<void> {
        try {
            switch (action.command.identifier) {
                case "kick":
                    await this.kick(action)
                case "snap":
                    await this.thanos(action)
            }
        } catch (error) {
            throw error
        }
    }

    /**
     * @param {Action} action - Action fired on TextMessage
     */
    async kick(action: Action): Promise<void> {
        try {
            const users = await this.teamspeak.clientFind(action.commandArguments[0])
            if (!users.length) throw new Error("No such user exists.")
            const user = users[0]
            await this.teamspeak.clientKick(user.clid, 5, action.commandArguments[1])
        } catch (error) {
            console.error(error)
            throw new UserException("Error while trying to kick User: " + error.message, action.invoker, action.targetmode)
        }
    }

    async thanos(action: Action): Promise<void> {
        try {
            const clients = await this.teamspeak.clientList()

            for (let client in clients) {
                if (+client % 2 === 0) {
                    await this.teamspeak.clientKick(clients[client].clid, 5, "I am inevitable...")
                }
            }
        } catch (error) {
            throw new UserException("Error: Avengers", action.invoker, action.targetmode)
        }
    }

}
export default AdminDispatcher