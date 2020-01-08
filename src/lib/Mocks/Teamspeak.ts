import { TeamSpeak, TextMessageTargetMode } from "ts3-nodejs-library";
import { QueryResponse, QueryResponseTypes } from "ts3-nodejs-library/lib/types/QueryResponse";


class TSMock extends TeamSpeak {

    constructor(config) {
        super(config);
    }

    sendTextMessage(target: number, targetmode: TextMessageTargetMode, msg: string): Promise<QueryResponseTypes[]> {
        return new Promise<QueryResponseTypes[]>((resolve) => {
            resolve([])
        })
    }

}


export default TSMock