import { TeamSpeak } from "ts3-nodejs-library";
import IAction from "../Types/Actions/action";

export default interface Service {
    dispatch(action: IAction, teamspeak: TeamSpeak): Promise<void>
}