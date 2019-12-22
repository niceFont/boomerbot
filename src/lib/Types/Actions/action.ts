import { TextMessageEvent } from "ts3-nodejs-library";
import Command from "../Commands/command";



interface IAction {
    command: Command
    commandArguments: Array<string>
}

export default IAction