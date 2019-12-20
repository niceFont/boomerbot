import dotenv from "dotenv"
dotenv.config()

import "reflect-metadata"
import { TeamSpeak } from "ts3-nodejs-library";
import { IClientService, ClientService } from "./lib/Services/clientService";
import { AdminService, IAdminService } from "./lib/Services/adminService";
import Action from "./lib/actions";
import { UserExceptionsHandler, IUserExceptionsHandler } from "./lib/Exceptions/Handlers/userExceptionsHandler";
import clientServiceContainer from "./lib/inversify.config";
import Types from "./lib/inversifyTypes";


class BoomerBot {

    teamspeak: TeamSpeak
    clientDispatcher: IClientService
    adminDispatcher: IAdminService
    userExceptionHandler: IUserExceptionsHandler

    constructor(teamspeak: TeamSpeak) {
        this.teamspeak = teamspeak
        this.clientDispatcher = clientServiceContainer.get<IClientService>(Types.ClientService)
        this.adminDispatcher = new AdminService()
        this.userExceptionHandler = new UserExceptionsHandler(teamspeak)
    }


    async start(): Promise<void> {


        try {
            await Promise.all([
                this.teamspeak.registerEvent("server"),
                this.teamspeak.registerEvent("channel", 0),
                this.teamspeak.registerEvent("textserver"),
                this.teamspeak.registerEvent("textchannel"),
                this.teamspeak.registerEvent("textprivate")
            ])
            this.teamspeak.on("ready", async () => {
                console.log("BoomerBot successfully connected to the server.")
                try {
                    await this.teamspeak.sendTextMessage(1, 3, "Boomer has arrived")
                } catch (err) {
                    console.error(err)
                }
            })


            this.teamspeak.on("close", async () => {
                console.log("BoomerBot disconnect, trying to reconnect...")
                await this.teamspeak.reconnect(-1, 5000)
                console.log("Successfully reconnected")
            })

            this.teamspeak.on("error", async (err) => {
                console.error(err)
            })

            this.teamspeak.on("textmessage", async event => {
                console.log(`${event.invoker.nickname} just sent a message`)
            })

            this.teamspeak.on("textmessage", async event => {
                try {
                    if (event.msg.startsWith("!boomer")) {
                        const action = await Action.extractActionFromMessage(event)

                        switch (action.command.privilage) {
                            case 0:
                                await this.clientDispatcher.dispatch(action, this.teamspeak)
                            case 1:
                                await this.adminDispatcher.dispatch(action, this.teamspeak)
                        }
                    }
                } catch (error) {
                    this.userExceptionHandler.logError(error)
                }
            })

            this.teamspeak.on("clientconnect", async (event) => {
                const { client_totalconnections } = await event.client.getDBInfo()
                if (client_totalconnections <= 1) {
                    await this.teamspeak.sendTextMessage(event.client.cid, 3, `Welcome to the server ${event.client.nickname}!`)
                }
            })
        } catch (err) {
            console.log(err)
            this.userExceptionHandler.logError(err)
        }

    }
}

export default BoomerBot


