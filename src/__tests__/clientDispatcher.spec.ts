import ClientDispatcher from "../lib/Dispatchers/clientDispatcher";
import Action from "../lib/actions"
import { TeamSpeak, TeamSpeakClient } from "ts3-nodejs-library"
import Command from "../lib/commands";

describe("ClientDispatcher", () => {
    let greetfn = jest.fn()
    ClientDispatcher.prototype.greet = greetfn
    ClientDispatcher.prototype.tmdb.getGenres = jest.fn(async () => ({ genres: [] }))
    let instance: ClientDispatcher


    instance = new ClientDispatcher(new TeamSpeak({}))



    expect(instance).toBeInstanceOf(ClientDispatcher)
    const action = new Action(new Command("greet", 0, "greet"), [], null, null);
    (async () => {
        await instance.dispatch(action)
        expect(greetfn).toBeCalled()

    })()

})