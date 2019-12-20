import { TeamSpeak, TeamSpeakClient, TextMessageTargetMode } from "ts3-nodejs-library"
import UserException from "../userException"

/**
 * @class
 */
export class UserExceptionsHandler implements IUserExceptionsHandler {
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

export interface IUserExceptionsHandler {
    teamspeak: TeamSpeak
    logError(err: UserException): Promise<void>
}


