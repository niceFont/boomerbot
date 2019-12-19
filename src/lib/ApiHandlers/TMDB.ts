import axios from "axios";
import { GenreCollection, Genre, MovieCollection } from "../types";


/**
 * @class
 */
class TMDBHandler {
    apiKey: string
    page = 0
    maxPage = 10
    genreList: GenreCollection
    /**
     * @constructor
     * @param {string} apiKey - Api key provided by User 
     */
    constructor(apiKey: string) {
        this.apiKey = apiKey
        this.getGenres()
            .then(genres => {
                this.genreList = genres
            })
            .catch(err => console.error(err))
    }

    /**
     * 
     */
    async getGenres(): Promise<GenreCollection> {
        try {
            const response = await axios.get(`https://api.themoviedb.org/3/genre/movie/list?api_key=${this.apiKey}&language=en-US`)
            return response.data
        } catch (error) {
            console.error(error)
        }

    }

    async getMoviesByGenre(genre: Genre): Promise<MovieCollection> {
        try {
            this.page = (this.page % this.maxPage) + 1
            const movies = await axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=${this.apiKey}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=${this.page}&with_genres=${genre.id}`)
            return movies.data
        } catch (error) {
            throw error.message
        }


    }

}

export default TMDBHandler