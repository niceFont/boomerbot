import { injectable } from "inversify";
import { Task } from "../Types/Tasks/task";


@injectable()
export class TaskDB implements ITaskDB {
    private taskList: Array<Task>

    constructor() {
        this.taskList = new Array<Task>()
    }

    async addTask(task: Task): Promise<void> {
        try {
            this.taskList.push(task)
        } catch (error) {
            throw error
        }
    }

    async removeTask(id: string): Promise<void> {
        try {
            const task = await this.getTask(id)
            this.taskList.splice(this.taskList.indexOf(task))
        } catch (error) {
            throw error
        }
    }

    async stopTask(id: string): Promise<void> {
        try {
            const task = await this.getTask(id)
            await task.stop()
        } catch (error) {
            throw error
        }
    }

    async restartTask(id: string): Promise<void> {
        try {
            const task = await this.getTask(id)
            await task.start()
        } catch (error) {
            throw error
        }
    }

    async getAllTasks(): Promise<Array<Task>> {
        try {
            return this.taskList
        } catch (error) {
            throw error
        }
    }

    async getTask(id: string): Promise<Task> {
        try {
            for (let task of this.taskList) {
                if (task.id === id) {
                    return task
                }
            }
            throw new Error(`No task with id ${id} found`)

        } catch (error) {
            throw error
        }
    }
}


export interface ITaskDB {
    addTask(task: Task): Promise<void>
    removeTask(id: string): Promise<void>
    stopTask(id: string): Promise<void>
    restartTask(id: string): Promise<void>
}