import { ClientService } from "../lib/Services/clientService";
import clientServiceContainer from "../lib/inversify.config";
import Types from "../lib/inversifyTypes";
import sinon from "sinon";

describe("ClientService", () => {

    const clientService = clientServiceContainer.get<ClientService>(Types.ClientService);

    let greetStub: sinon.SinonStub

    beforeEach(() => {
        greetStub = sinon.stub(clientService, "greet")
    })

    afterEach(() => {
        greetStub.restore()
    })

    it("should call greet method", () => {


    })
})