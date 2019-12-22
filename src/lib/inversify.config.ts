import "reflect-metadata"
import { Container, decorate, injectable, inject } from "inversify"
import Types from "./inversifyTypes"
import { TMDB, ITMDB } from "./DataAccessObjects/TMDB"
import { ReminderDB, IReminderDB } from "./DataAccessObjects/reminderDB"
import { IClientService, ClientService } from "./Services/clientService"
import { ITaskDB, TaskDB } from "./DataAccessObjects/taskDB"
import { IBotService, BotService } from "./Services/botService"

export const clientServiceContainer = new Container()
clientServiceContainer.bind<ITMDB>(Types.TMDB).to(TMDB)
clientServiceContainer.bind<IReminderDB>(Types.ReminderDB).to(ReminderDB)
clientServiceContainer.bind<IClientService>(Types.ClientService).to(ClientService)


export const botServiceContainer = new Container()
botServiceContainer.bind<ITaskDB>(Types.TaskDB).to(TaskDB)
botServiceContainer.bind<IBotService>(Types.BotService).to(BotService)
