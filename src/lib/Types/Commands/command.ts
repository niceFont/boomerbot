import { promises as fs } from "fs"


class Command {

    name: string
    identifier: string
    privilage: number


    constructor(identifier: string, privilage: number, name?: string) {
        this.identifier = identifier
        this.privilage = privilage
        if (name) this.name = name
        else this.name = identifier
    }



    static async getCommandInfo(commandIdentifier: string): Promise<Command> {

        try {
            const buffer = await fs.readFile(__dirname + "/../../bot-commands.json")

            const commands = JSON.parse(buffer.toString())
            if (commandIdentifier in commands) return new Command(commandIdentifier, commands[commandIdentifier].privilages)
            else null

        } catch (err) {
            console.error(err)
        }
    }
}

export default Command