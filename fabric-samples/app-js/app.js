const {Gateway, Wallets} = require('fabric-network');
const path = require('path');
const {buildCAClient,enrollAdmin,registerAndEnrollUser} = require ("./utils/CAUtil");
const {buildCCPOrg2,buildWallet} = require("./utils/AppUtil");
const express = require("express");

const channelName = "blockchain2025";
const chaincodeName = "blockchain";
const mspOrg2 = 'User';
const walletPath = path.join(__dirname,"wallet");
const org2UserID = 'Admin';
let contract;

const app = express();

app.use(express.json())

app.use((req,res,next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next()
})


app.post("/userRegistration", async (req, res) => {
    try {
        const result = await contract.submitTransaction("userRegistration", req.body.login, req.body.password);
        res.send(result.toString());
    } catch (error) {
        res.status(500).send(error)
    }
})

app.post("/addCertificate", async (req, res) => {
    try {
        const result = await contract.submitTransaction("addCertificate", req.body.login, req.body.password);
        res.send(result.toString());
    } catch (error) {
        res.status(500).send(error)
    }
})

app.post("/vehicleRegistration", async (req, res) => {
    try {
        const result = await contract.submitTransaction("vehicleRegistration", req.body.login, req.body.password);
        res.send(result.toString());
    } catch (error) {
        res.status(500).send(error)
    }
})

app.post("/extensionOfRights", async (req, res) => {
    try {
        const result = await contract.submitTransaction("extensionOfRights", req.body.login, req.body.password);
        res.send(result.toString());
    } catch (error) {
        res.status(500).send(error)
    }
})

app.post("/payFine", async (req, res) => {
    try {
        const result = await contract.submitTransaction("payFine", req.body.login, req.body.password);
        res.send(result.toString());
    } catch (error) {
        res.status(500).send(error)
    }
})

app.post("/issuanceFine", async (req, res) => {
    try {
        const result = await contract.submitTransaction("issuanceFine", req.body.login, req.body.password);
        res.send(result.toString());
    } catch (error) {
        res.status(500).send(error)
    }
})

app.post("/autoCertificateVerification", async (req, res) => {
    try {
        const result = await contract.submitTransaction("autoCertificateVerification", req.body.login, req.body.password);
        res.send(result.toString());
    } catch (error) {
        res.status(500).send(error)
    }
})

app.post("/autoRegVehicle", async (req, res) => {
    try {
        const result = await contract.submitTransaction("autoRegVehicle", req.body.login, req.body.password);
        res.send(result.toString());
    } catch (error) {
        res.status(500).send(error)
    }
})

app.post("/autoExtensionOfRights", async (req, res) => {
    try {
        const result = await contract.submitTransaction("autoExtensionOfRights", req.body.login, req.body.password);
        res.send(result.toString());
    } catch (error) {
        res.status(500).send(error)
    }
})

app.post("/getCertificates", async (req, res) => {
    try {
        const result = await contract.evaluateTransaction("getCertificates", req.body.login, req.body.password);
        res.send(result.toString());
    } catch (error) {
        res.status(500).send(error)
    }
})

app.post("/getBank", async (req, res) => {
    try {
        const result = await contract.evaluateTransaction("getBank", req.body.login, req.body.password);
        res.send(result.toString());
    } catch (error) {
        res.status(500).send(error)
    }
})

app.post("/getUser", async (req, res) => {
    try {
        const result = await contract.evaluateTransaction("getUser", req.body.login, req.body.password);
        res.send(result.toString());
    } catch (error) {
        res.status(500).send(error)
    }
})

app.post("/getRequestCertificate", async (req, res) => {
    try {
        const result = await contract.evaluateTransaction("getRequestCertificate", req.body.login, req.body.password);
        res.send(result.toString());
    } catch (error) {
        res.status(500).send(error)
    }
})

app.post("/getRequestVehicle", async (req, res) => {
    try {
        const result = await contract.evaluateTransaction("getRequestVehicle", req.body.login, req.body.password);
        res.send(result.toString());
    } catch (error) {
        res.status(500).send(error)
    }
})

app.post("/getRequestCertificatePeriod", async (req, res) => {
    try {
        const result = await contract.evaluateTransaction("getRequestCertificatePeriod", req.body.login, req.body.password);
        res.send(result.toString());
    } catch (error) {
        res.status(500).send(error)
    }
})


async function main() {
    try{
        const ccp = buildCCPOrg2();
        const caClient = buildCAClient(require('fabric-ca-client'),ccp,'ca.org2.example.com');
        const wallet = await buildWallet(Wallets,walletPath);

        await enrollAdmin(caClient,wallet,mspOrg2)
        await registerAndEnrollUser(caClient,wallet,mspOrg2,org2UserID,'org2.department1');

        const gateway = new Gateway()
        const gatewayOpt = {
            identity: org2UserID,
            wallet,
            discovery: {
                enabled: true,
                asLocalhost: true,
            },
        };

        await gateway.connect(ccp,gatewayOpt)

        const network = await gateway.getNetwork(channelName);
        contract = network.getContract(chaincodeName);

    } catch (e) {
        console.error(`--------------FAILED TO RUN APPLICATIONS: ${e}`)
    }
    finally {
        console.log(`call contract init....`)
        try {
            const result = await contract.evaluateTransaction('init')
            console.log(result.toString())
        } catch (e) {
            console.log(`error + ${e}`);
        }
    }
}

main()

app.listen(3002, () => console.log('Listening on port 3002'))
