
export interface MovieCollection {
    page: number;
    total_results: number;
    total_pages: number;
    results: Movie[];
}

export interface Movie {
    popularity: number;
    vote_count: number;
    video: boolean;
    poster_path: string;
    id: number;
    adult: boolean;
    backdrop_path: string;
    original_language: OriginalLanguage;
    original_title: string;
    genre_ids: number[];
    title: string;
    vote_average: number;
    overview: string;
    release_date: string;
}

export enum OriginalLanguage {
    En = "en",
    Ko = "ko",
}


export type Genre = {
    id: number,
    name: string
}

export interface GenreCollection {
    genres: Array<Genre>
}


export interface BotSettings {
    afkPurge: boolean,
    afkLimit: number
}

export enum CommandIdentifiers {
    AFK_PURGE = "afkPurge",
    GREET = "greet",
    KICK_ME = "kickme",
    KICK = "kick",
    SNAP = "snap",
    MOVIE = "movie",
    REMINDER = "reminder",
    GARBAGE_COLLECT = "GarbageCollect"
}
