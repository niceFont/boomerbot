import IAction from "./action";
import Command from "../Commands/command";
import { TextMessageEvent } from "ts3-nodejs-library";


export class BotAction implements IAction {
    command: Command
    commandArguments: Array<string>;

    constructor(command: Command, commandArguments: Array<string>) {
        this.command = command
        this.commandArguments = commandArguments
    }

    static getActionFromMessage(event: TextMessageEvent): Promise<IAction> {
        throw new Error("Method not implemented.");
    }
}