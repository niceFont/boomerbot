import Action from "../actions";
import { TeamSpeak } from "ts3-nodejs-library";

export default interface Service {
    dispatch(action: Action, teamspeak: TeamSpeak): Promise<void>
}