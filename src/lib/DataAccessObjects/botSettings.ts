import { promises as fs } from 'fs';
import { injectable } from 'inversify';

@injectable()
export class BotSettings implements IBotSettings {
    afkPurge: boolean;
    afkLimit: number;
    afkWarn: boolean;
    settingsPath = __dirname + "/../../../bot-settings.json"

    constructor() {
        this.readSettingsFromFile()
            .then()
            .catch(err => { throw err })
    }

    async readSettingsFromFile(): Promise<void> {
        try {
            const buffer = await fs.readFile(this.settingsPath)
            const settings = JSON.parse(buffer.toString())
            Object.assign(this, settings)
        } catch (error) {
            throw error
        }
    }

}


export interface IBotSettings {
    afkPurge: boolean
    afkLimit: number
    afkWarn: boolean
    readSettingsFromFile(): Promise<void>
}