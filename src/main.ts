import BoomerBot from "./boomerbot"
import { TeamSpeak, QueryProtocol } from "ts3-nodejs-library"

(async () => {
    try {
        const config = {
            host: "127.0.0.1",
            serverport: 9987,
            queryport: 10011,
            username: "serveradmin",
            password: "4mVtnzm7",
            nickname: "BoomerBot",
            protocol: QueryProtocol.RAW,
        }
        const ts3Connection = await TeamSpeak.connect(config)
        const bot: BoomerBot = new BoomerBot(ts3Connection)

        await bot.start()
        console.log("Bboomer is ready")

    } catch (error) {
        console.error(error)
    }

})()