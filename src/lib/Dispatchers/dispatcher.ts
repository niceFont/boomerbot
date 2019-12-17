import Action from "../actions";
import { TeamSpeak } from "ts3-nodejs-library";

export default interface Dispatcher {
    teamspeak: TeamSpeak,
    dispatch(action: Action): void
}