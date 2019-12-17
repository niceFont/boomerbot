import dotenv from "dotenv"
dotenv.config()
import TeamspeakConnection from "./teamspeak/teamspeak";
import { TeamSpeak } from "ts3-nodejs-library";
import Command from "./lib/commands";
import ClientDispatcher from "./lib/Dispatchers/clientDispatcher";
import Action from "./lib/actions";
import UserExceptionsHandler from "./lib/Exceptions/Handlers/userExceptionsHandler";
import AdminDispatcher from "./lib/Dispatchers/adminDispatcher";



(async () => {
    let teamspeak: TeamSpeak
    try {
        teamspeak = await TeamspeakConnection
    } catch (error) {
        console.log(error)
    }
    const clientDispatcher = new ClientDispatcher(teamspeak)
    const adminDispatcher = new AdminDispatcher(teamspeak)
    const userExceptionHandler = new UserExceptionsHandler(teamspeak)

    try {
        await Promise.all([
            teamspeak.registerEvent("server"),
            teamspeak.registerEvent("channel", 0),
            teamspeak.registerEvent("textserver"),
            teamspeak.registerEvent("textchannel"),
            teamspeak.registerEvent("textprivate")
        ])
        teamspeak.on("ready", async () => {
            console.log("BoomerBot successfully connected to the server.")
            try {
                await teamspeak.sendTextMessage(1, 3, "Boomer has arrived")
            } catch (err) {
                console.error(err)
            }
        })


        teamspeak.on("close", async () => {
            console.log("BoomerBot disconnect, trying to reconnect...")
            await teamspeak.reconnect(-1, 5000)
            console.log("Successfully reconnected")
        })

        teamspeak.on("error", async (err) => {
            console.error(err)
        })

        teamspeak.on("textmessage", async event => {
            console.log(`${event.invoker.nickname} just sent a message`)
        })

        teamspeak.on("textmessage", async event => {
            try {
                if (event.msg.startsWith("!boomer")) {
                    const action = await Action.extractActionFromMessage(event)

                    switch (action.command.privilage) {
                        case 0:
                            await clientDispatcher.dispatch(action)
                        case 1:
                            await adminDispatcher.dispatch(action)
                    }
                }
            } catch (error) {
                userExceptionHandler.logError(error)
            }
        })

        teamspeak.on("clientconnect", async (event) => {
            const { client_totalconnections } = await event.client.getDBInfo()
            if (client_totalconnections <= 1) {
                await teamspeak.sendTextMessage(event.client.cid, 3, `Welcome to the server ${event.client.nickname}!`)
            }
        })
    } catch (err) {
        console.log(err)
        userExceptionHandler.logError(err)
    }
})()


