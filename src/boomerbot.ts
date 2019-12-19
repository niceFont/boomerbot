import dotenv from "dotenv"
dotenv.config()
import TeamspeakConnection from "./teamspeak/teamspeak";
import { TeamSpeak } from "ts3-nodejs-library";
import Command from "./lib/commands";
import ClientDispatcher from "./lib/Dispatchers/clientDispatcher";
import Action from "./lib/actions";
import UserExceptionsHandler from "./lib/Exceptions/Handlers/userExceptionsHandler";
import AdminDispatcher from "./lib/Dispatchers/adminDispatcher";


class BoomerBot {

    teamspeak: TeamSpeak
    clientDispatcher: ClientDispatcher
    adminDispatcher: AdminDispatcher
    userExceptionHandler: UserExceptionsHandler

    constructor(teamspeak: TeamSpeak) {
        this.teamspeak = teamspeak
        this.clientDispatcher = new ClientDispatcher(teamspeak)
        this.adminDispatcher = new AdminDispatcher(teamspeak)
        this.userExceptionHandler = new UserExceptionsHandler(teamspeak)
    }

    async connect(): Promise<void> {
        try {
            this.teamspeak = await TeamspeakConnection
        } catch (error) {
            console.log(error)
        }
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
                                await this.clientDispatcher.dispatch(action)
                            case 1:
                                await this.adminDispatcher.dispatch(action)
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


