import Dispatcher from "./dispatcher";
import { TeamSpeak } from "ts3-nodejs-library";
import Action from "../actions";
import UserException from "../Exceptions/userException";
import TMDBHandler from "../ApiHandlers/TMDB";

/**
 * @class
 * @implements {Dispatcher}
 */
class ClientDispatcher implements Dispatcher {
    teamspeak: TeamSpeak
    tmdb: TMDBHandler

    constructor(TeamspeakConnection: TeamSpeak) {
        this.teamspeak = TeamspeakConnection
        this.tmdb = new TMDBHandler(process.env.TMDB_API_KEY)
    }

    async dispatch(action: Action): Promise<void> {

        try {
            switch (action.command.identifier) {
                case "greet":
                    await this.greet(action)
                case "movie":
                    await this.getRandomMovie(action)
                default:
            }
        } catch (error) {
            throw error
        }


    }
    async getRandomMovie(action: Action): Promise<void> {
        try {

            if (!action.commandArguments.length) throw new Error("No Genre provided.")
            const genreList = await this.tmdb.getGenres()
            for (let genre of genreList.genres) {
                if (genre.name.toLowerCase() === action.commandArguments[0]) {
                    const movies = await this.tmdb.getMoviesByGenre(genre)
                    const randomNumber = Math.abs(Math.floor(Math.random() * movies.results.length - 1))
                    const randomMovie = movies.results[randomNumber].original_title
                    await this.teamspeak.sendTextMessage(action.invoker.cid, action.targetmode, randomMovie)
                    return
                }
            }

            await this.teamspeak.sendTextMessage(action.invoker.cid, action.targetmode, "Genre Not Found")
            return
        } catch (error) {
            console.log(error)
            throw new UserException("Error: " + error.message, action.invoker, action.targetmode);
        }
    }


    async greet(action: Action): Promise<void> {
        try {
            await this.teamspeak.sendTextMessage(action.invoker.cid, action.targetmode, `Hello ${action.invoker.nickname} :)`)
        } catch (error) {
            throw new UserException("Error: " + error.message, action.invoker, action.targetmode)
        }
    }



}


export default ClientDispatcher