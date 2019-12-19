import Reminder from "./reminder"

class ReminderDB {
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


export default ReminderDB