import Reminder from "../Types/Reminders/reminder"
import { TeamSpeak, TeamSpeakClient } from "ts3-nodejs-library"
import { injectable } from "inversify"

@injectable()
export class ReminderDB implements IReminderDB {
    reminders: Array<Reminder>

    constructor() {
        this.reminders = new Array<Reminder>()
    }

    getAllReminders(): Array<Reminder> {
        return [...this.reminders]
    }

    async getAllRemindersFrom(clid: number): Promise<Array<Reminder>> {
        try {
            return await Promise.resolve().then(_ => {
                return this.reminders.filter(reminder => reminder.invoker.clid === clid)
            })
        } catch (error) {

        }
    }

    async getReminderByID(id: string): Promise<Reminder> {
        try {
            return await Promise.resolve().then(_ => {
                try {
                    for (let reminder of this.reminders) {
                        if (reminder.id === id) return reminder
                    }

                    throw new Error(`No reminder with ${id} found`)

                } catch (error) {
                    throw error
                }
            })
        } catch (error) {
            throw error
        }
    }

    async stopReminder(id: string) {
        try {
            await Promise.resolve().then(async _ => {
                try {
                    for (let reminder of this.reminders) {
                        if (reminder.id === id) {
                            reminder.stop()
                            await this.removeReminder(reminder.id)
                        }
                    }
                } catch (error) {
                    throw error
                }
            })
        } catch (error) {
            throw error
        }
    }

    addReminder(reminder: Reminder): void {
        this.reminders.push(reminder)
    }

    async removeReminder(id: string): Promise<void> {
        try {
            await Promise.resolve().then(async _ => {
                try {
                    for (let reminder of this.reminders) {
                        if (reminder.id === id) {
                            reminder.stop()
                            this.reminders.splice(this.reminders.indexOf(reminder), 1)
                            return
                        }
                    }
                    throw new Error(`id of ${id} does not exist.`)
                } catch (error) {
                    throw error
                }
            })
        } catch (error) {
            throw error
        }
    }
}

export interface IReminderDB {
    reminders: Array<Reminder>
    getAllReminders(): Array<Reminder>
    getAllRemindersFrom(clid: number): Promise<Array<Reminder>>
    stopReminder(id: string): Promise<void>
    addReminder(reminder: Reminder): void
    removeReminder(id: string): Promise<void>
}
