import "reflect-metadata"
import { Container, decorate, injectable, inject } from "inversify"
import Types from "./inversifyTypes"
import { TMDB, ITMDB } from "./DataAccessObjects/TMDB"
import { ReminderDB, IReminderDB } from "./DataAccessObjects/reminderDB"
import { IClientService, ClientService } from "./Services/clientService"

const clientServiceContainer = new Container()
clientServiceContainer.bind<ITMDB>(Types.TMDB).to(TMDB)
clientServiceContainer.bind<IReminderDB>(Types.ReminderDB).to(ReminderDB)
clientServiceContainer.bind<IClientService>(Types.ClientService).to(ClientService)

export default clientServiceContainer
