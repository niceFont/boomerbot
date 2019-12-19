import { TeamSpeak, QueryProtocol } from "ts3-nodejs-library"

export const config = {
    host: "127.0.0.1",
    serverport: 9987,
    queryport: 10011,
    username: "serveradmin",
    password: "4mVtnzm7",
    nickname: "BoomerBot",
    protocol: QueryProtocol.RAW,
}

const connection = TeamSpeak.connect(config)



export default connection