import Reminder from "../reminder"
import { injectable } from "inversify"

@injectable()
export class ReminderDB implements IReminderDB {
    reminders: Array<Reminder>

    constructor() {
        this.reminders = new Array<Reminder>()
    }

    async getAllReminders(): Promise<Array<Reminder>> {
        return [...this.reminders]
    }

    async stopReminder(id: string) {
        Promise.resolve().then(_ => {
            for (let reminder of this.reminders) {
                if (reminder.id === id) {
                    reminder.stop()
                }
            }
        })
    }

    async addReminder(reminder: Reminder): Promise<void> {
        this.reminders.push(reminder)
    }

    async removeReminder(id: string): Promise<void> {
        try {
            for (let reminder of this.reminders) {
                if (reminder.id === id) {
                    await reminder.stop()
                    this.reminders.splice(this.reminders.indexOf(reminder), 1)
                    return
                }
            }

            throw new Error(`id of ${id} does not exist.`)

        } catch (error) {
            throw error
        }
    }
}

export interface IReminderDB {
    reminders: Array<Reminder>
    getAllReminders(): Promise<Array<Reminder>>
    stopReminder(id: string): Promise<void>
    addReminder(reminder: Reminder): Promise<void>
    removeReminder(id: string): Promise<void>
}
