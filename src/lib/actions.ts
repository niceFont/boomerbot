import Command from "./commands"
import { TextMessageEvent, TeamSpeakClient, TextMessageTargetMode } from "ts3-nodejs-library"
import UserException from "./Exceptions/userException"

class Action {
    command: Command
    commandArguments: Array<string>
    invoker: TeamSpeakClient
    targetmode: TextMessageTargetMode

    constructor(command: Command, commandArgs: Array<string>, invoker: TeamSpeakClient, targetMode: TextMessageTargetMode) {
        this.command = command
        this.commandArguments = commandArgs
        this.invoker = invoker
        this.targetmode = targetMode
    }

    static async extractActionFromMessage(event: TextMessageEvent): Promise<Action> {
        try {
            const arr = event.msg.slice(8).split(" ")

            const command = await Command.getCommandInfo(arr[0])

            if (!command) throw new UserException("Given Command is undefined", event.invoker, event.targetmode)
            return new Action(command, arr.slice(1), event.invoker, event.targetmode)

        } catch (err) {
            throw err
        }
    }
}


export default Action