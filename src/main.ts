import BoomerBot from "./boomerbot"
import TeamspeakConnection from "./teamspeak/teamspeak"

(async () => {
    try {
        const bot = new BoomerBot(await TeamspeakConnection)

        await bot.start()
        console.log("Bot started")

    } catch (error) {
        console.error(error)
    }

})()