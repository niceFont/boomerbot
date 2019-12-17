import { TeamSpeakClient, TextMessageTargetMode } from "ts3-nodejs-library";
import Exception from "./exception"

class UserException extends Exception {
    invoker: TeamSpeakClient
    targetMode: TextMessageTargetMode

    constructor(message: string, invoker: TeamSpeakClient, targetMode: TextMessageTargetMode) {
        super(message)
        this.invoker = invoker
        this.targetMode = targetMode
    }
}

export default UserException