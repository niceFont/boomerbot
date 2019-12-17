import { TeamSpeak, TeamSpeakClient, TextMessageTargetMode } from "ts3-nodejs-library"
import UserException from "../userException"

/**
 * @class
 */
class UserExceptionsHandler {
    teamspeak: TeamSpeak

    constructor(teamspeak: TeamSpeak) {
        this.teamspeak = teamspeak
    }

    async logError(error: UserException): Promise<void> {
        try {
            await this.teamspeak.sendTextMessage(error.invoker.cid, error.targetMode, error.message)
        } catch (err) {
            console.log(err)
        }
    }
}

export default UserExceptionsHandler

