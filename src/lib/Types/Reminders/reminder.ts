import uuid from "uuid";
import { TeamSpeakClient } from "ts3-nodejs-library"

class Reminder {
    id: string
    timeout: number
    message: string
    timer: NodeJS.Timer
    invoker: TeamSpeakClient

    constructor(timeout: number, message: string) {
        this.timeout = timeout
        this.message = message
        this.id = uuid.v4().slice(0, 3)
    }

    async start(callback: () => void): Promise<void> {
        this.timer = setTimeout(callback, this.timeout)
    }

    async stop(): Promise<void> {
        clearTimeout(this.timer)
    }

    async setMessage(message: string): Promise<void> {
        this.message = message
    }

    async setTimeout(timeout: number): Promise<void> {
        if (this.timer) clearTimeout(this.timer)
        this.timeout = timeout
    }
}


export default Reminder