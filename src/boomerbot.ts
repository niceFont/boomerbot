import dotenv from "dotenv"
dotenv.config()

import "reflect-metadata"
import { TeamSpeak } from "ts3-nodejs-library";
import { IClientService, ClientService } from "./lib/Services/clientService";
import { AdminService, IAdminService } from "./lib/Services/adminService";
import Action from "./lib/Types/Actions/userActions";
import { UserExceptionsHandler, IUserExceptionsHandler } from "./lib/Exceptions/Handlers/userExceptionsHandler";
import { clientServiceContainer, botServiceContainer } from "./lib/inversify.config";
import Types from "./lib/inversifyTypes";
import { BotSettings } from "./lib/types";
import { promises as fs } from "fs"
import { IBotService } from "./lib/Services/botService";
import { BotAction } from "./lib/Types/Actions/botActions";


class BoomerBot {

    settings: BotSettings
    teamspeak: TeamSpeak
    clientService: IClientService
    adminService: IAdminService
    botService: IBotService
    userExceptionHandler: IUserExceptionsHandler

    constructor(teamspeak: TeamSpeak) {
        this.teamspeak = teamspeak
        this.clientService = clientServiceContainer.get<IClientService>(Types.ClientService)
        this.adminService = new AdminService()
        this.botService = botServiceContainer.get<IBotService>(Types.BotService)
        this.userExceptionHandler = new UserExceptionsHandler(teamspeak)
    }

    async loadSettingsFile(): Promise<void> {
        try {
            const buffer = await fs.readFile(__dirname + "/../bot-settings.json")
            this.settings = JSON.parse(buffer.toString())
        } catch (error) {
            throw new Error(error.message)
        }
    }

    async loadSettings(): Promise<void> {
        try {
            await this.loadSettingsFile()

            if (this.settings.afkPurge) {
                const afkAction = new BotAction({ identifier: "afkPurge", privilage: 1, name: "afkPurge" }, [])
                await this.botService.dispatch(afkAction, this.teamspeak)
            }
        } catch (error) {

        }
    }


    async start(): Promise<void> {

        try {
            console.log("[Setup] Registering Teamspeak Events...")
            await Promise.all([
                this.teamspeak.registerEvent("server"),
                this.teamspeak.registerEvent("channel", 0),
                this.teamspeak.registerEvent("textserver"),
                this.teamspeak.registerEvent("textchannel"),
                this.teamspeak.registerEvent("textprivate")
            ])
            console.log("[Setup] Loading settings from File...")
            await this.loadSettings()

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
                        const action = await Action.getActionFromMessage(event)

                        switch (action.command.privilage) {
                            case 0:
                                await this.clientService.dispatch(action, this.teamspeak)
                            case 1:
                                await this.adminService.dispatch(action, this.teamspeak)
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


