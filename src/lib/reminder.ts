import uuid from "uuid";
import { TeamSpeakClient } from "ts3-nodejs-library"

class Reminder {
    id: string
    time: number
    message: string
    timer: NodeJS.Timer
    invoker: TeamSpeakClient

    constructor(time: number, message: string) {
        this.time = time
        this.message = message
        this.id = uuid.v4().slice(0, 3)
    }

    async start(callback: () => void): Promise<void> {
        this.timer = setTimeout(callback, this.time)
    }

    async stop(): Promise<void> {
        clearTimeout(this.timer)
    }

    async setMessage(message: string): Promise<void> {
        this.message = message
    }

    async setTime(time: number): Promise<void> {
        if (this.timer) clearTimeout(this.timer)
        this.time = time
    }
}


export default Reminder