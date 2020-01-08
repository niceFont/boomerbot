import uuid from "uuid";
import { TeamSpeakClient } from "ts3-nodejs-library"

class Reminder {
    id: string
    timeout: number
    message: string
    timer: NodeJS.Timer
    invoker: TeamSpeakClient
    completed = false

    constructor(timeout: number, message: string) {
        this.timeout = timeout
        this.message = message
        this.id = uuid.v4().slice(0, 3)
    }

    start(callback: () => Promise<void>): void {
        this.timer = setTimeout(() => {
            callback().catch(console.error)
            this.completed = true
        }, this.timeout)
    }

    stop(): void {
        clearTimeout(this.timer)
        this.completed = true
    }

    setMessage(message: string): void {
        this.message = message
    }

    setTimeout(timeout: number): void {
        if (this.timer) clearTimeout(this.timer)
        this.timeout = timeout
    }
}


export default Reminder