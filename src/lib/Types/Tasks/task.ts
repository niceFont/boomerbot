import uuid = require("uuid")


export class Task {
    id: string
    private timer: NodeJS.Timer
    private interval: number
    private callback: () => void

    constructor(interval: number, callback: () => void) {
        this.callback = callback
        this.interval = interval
        this.id = uuid.v4().slice(0, 4)
    }

    async start(): Promise<void> {
        try {
            this.timer = setInterval(this.callback, this.interval)
        } catch (error) {
            throw error
        }
    }

    async stop(): Promise<void> {
        try {
            clearInterval(this.timer)
        } catch (error) {
            throw error
        }
    }
}