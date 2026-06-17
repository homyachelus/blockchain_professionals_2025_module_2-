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


app.post("/userRegistration", registerAndEnrollUser, async (req, res) => {
    console.log(`call contract init...8.`)
    try {
        console.log(`call contract init...5.`)
        console.log(` ${req.body.login, req.body.password, req.body.role, req.body.fio, JSON.stringify(req.body.driverType)}`);
        console.log(` ${req.body.login}`);
        const result = await contract.submitTransaction("userRegistration", req.body.login, req.body.password, req.body.role, req.body.fio, JSON.stringify(req.body.driverType));
        res.send(result.toString());
    } catch (error) {
        console.log(`call contract init...7.`)
        res.status(500).send(error.toString())
    }
    console.log(`call contract init...9.`)
})

app.post("/addCertificate", registerAndEnrollUser, async (req, res) => {
    try {
        console.log("start add")
        const result = await contract.submitTransaction("addCertificate",req.body.login, req.body.num, req.body.certificatePeriod, req.body.category);
        res.send(result.toString());
        console.log("stop add")
    } catch (error) {
        console.log("error: ", error)
        res.status(500).send(error)
        console.log("stop error")
    }
})

app.post("/payFine", registerAndEnrollUser, async (req, res) => {
    try {
        console.log("start pay")
        const result = await contract.submitTransaction("payFine", req.body.login);
        res.send(result.toString());
        console.log("stop pay")
    } catch (error) {
        console.log("error: ", error)
        res.status(500).send(error)
        console.log("stop error")
    }
})

app.post("/vehicleRegistration", registerAndEnrollUser, async (req, res) => {
    try {
        console.log("start reg vich")
        const result = await contract.submitTransaction("vehicleRegistration", req.body.category, req.body.marketValue, req.body.serviceLife, req.body.login);
        res.send(result.toString());
        console.log("stop reg vich")
    } catch (error) {
        console.log("start error")
        console.log(error)
        res.status(500).send(error)
        console.log("stop error")
    }
})

app.post("/extensionOfRights", registerAndEnrollUser, async (req, res) => {
    try {
        console.log("start ex")
        const result = await contract.submitTransaction("extensionOfRights", req.body.selectedPeriod, req.body.login);
        res.send(result.toString());
        console.log("stop ex")
    } catch (error) {
        console.log("start error")
        console.log(error)
        res.status(500).send(error)
        console.log("stop error")

    }
})

app.post("/issuanceFine", registerAndEnrollUser, async (req, res) => {
    try {
        console.log("start issue")
        const result = await contract.submitTransaction("issuanceFine", req.body.num);
        res.send(result.toString());
        console.log("stop issue")
    } catch (error) {
        console.log("start error")
        console.log(error)
        res.status(500).send(error)
        console.log("stop error")
    }
})






app.post("/autoCertificateVerification", registerAndEnrollUser, async (req, res) => {
    try {
        console.log("start autoCertific")
        const result = await contract.submitTransaction("autoCertificateVerification", req.body.num, req.body.userLogin);
        res.send(result.toString());
        console.log("stop autoCertific")
    } catch (error) {
        console.log("start error")
        console.log(error)
        res.status(500).send(error.message)
        console.log("stop error")
    }
})

app.post("/autoRegVehicle", registerAndEnrollUser, async (req, res) => {
    try {
        console.log("start veh")
        const result = await contract.submitTransaction("autoRegVehicle", req.body.userLogin);
        res.send(result.toString());
        console.log("stop veh")
    } catch (error) {
        console.log("start error")
        console.log(error)
        res.status(500).send(error)
        console.log("stop error")
    }
})

app.post("/autoExtensionOfRights", registerAndEnrollUser, async (req, res) => {
    try {
        console.log("start exten")
        const result = await contract.submitTransaction("autoExtensionOfRights", req.body.userLogin);
        res.send(result.toString());
        console.log("stop exten")
    } catch (error) {
        console.log("start error")
        console.log(error)
        res.status(500).send(error)
        console.log("stop error")
    }
})

app.post("/addCategory", registerAndEnrollUser, async (req, res) => {
    try {
        console.log("start exten")
        const result = await contract.submitTransaction("addCategory", req.body.login, req.body.category);
        res.send(result.toString());
        console.log("stop exten")
    } catch (error) {
        console.log("start error")
        console.log(error)
        res.status(500).send(error)
        console.log("stop error")
    }
})

app.post("/getCertificates", registerAndEnrollUser, async (req, res) => {
    try {
        const result = await contract.evaluateTransaction("getCertificates", req.body.num);
        if (!result || result.length === 0) {
            res.send(JSON.stringify({click: 0}));
        } else {
            res.send(result.toString());
        }
    } catch (error) {
        res.status(500).send(error)
    }
})

app.post("/getBank", registerAndEnrollUser, async (req, res) => {
    try {
        const result = await contract.evaluateTransaction("getBank");
        if (!result || result.length === 0) {
            res.send(JSON.stringify({click: 0}));
        } else {
            res.send(result.toString());
        }
    } catch (error) {
        res.status(500).send(error)
    }
})

app.post("/getUser", registerAndEnrollUser, async (req, res) => {
    try {
        const result = await contract.evaluateTransaction("getUser", req.body.login);
        if (!result || result.length === 0) {
            res.send(JSON.stringify({click: 0}));
        } else {
            res.send(result.toString());
        }
    } catch (error) {
        res.status(500).send(error)
    }
})

app.post("/getAllUsers", registerAndEnrollUser, async (req, res) => {
    try {
        console.log("start get")
        const result = await contract.evaluateTransaction("getAllUsers");
        if (!result || result.length === 0) {
            res.send(JSON.stringify({click: 0}));
        } else {
            res.send(result.toString());
        }
        console.log("stop get")
    } catch (error) {
        console.log("start error")
        console.log(error)
        res.status(500).send(error)
        console.log("stop error")
    }
})

app.post("/getAllCertificateRequests", registerAndEnrollUser, async (req, res) => {
    try {
        console.log("start get")
        const result = await contract.evaluateTransaction("getAllCertificateRequests");
        res.send(result.toString());
        console.log("stop get")
    } catch (error) {
        console.log("start error")
        console.log(error)
        res.status(500).send([]);
        console.log("stop error")
    }
});

app.post("/getAllRequestVehicle", registerAndEnrollUser, async (req, res) => {
    try {
        console.log("start get")
        const result = await contract.evaluateTransaction("getAllRequestVehicle");
        res.send(result.toString());
        console.log("stop get")
    } catch (error) {
        console.log("start error")
        console.log(error)
        res.status(500).send([]);
        console.log("stop error")
    }
});

app.post("/getAllRequestCertificatePeriod", registerAndEnrollUser, async (req, res) => {
    try {
        console.log("start get")
        const result = await contract.evaluateTransaction("getAllRequestCertificatePeriod");
        if (!result || result.length === 0) {
            res.send(JSON.stringify({click: 0}));
        } else {
            res.send(result.toString());
        }
        console.log("stop get")
    } catch (error) {
        console.log("start error")
        console.log(error)
        res.status(500).send([]);
        console.log("stop error")
    }
});

app.post("/changeCategory", registerAndEnrollUser, async (req, res) => {
    try {
        console.log("start get")
        const result = await contract.submitTransaction("changeCategory", req.body.login, req.body.category);
        res.send(result.toString());
        console.log("stop get")
    } catch (error) {
        console.log("start error")
        console.log(error)
        res.status(500).send([]);
        console.log("stop error")
    }
});

app.post("/getRequestCertificate", registerAndEnrollUser, async (req, res) => {
    try {
        console.log("start get")
        const result = await contract.evaluateTransaction("getRequestCertificate", req.body.num);
        if (!result || result.length === 0) {
            res.send(JSON.stringify({click: 0}));
        } else {
            res.send(result.toString());
        }
        console.log("stop get")
    } catch (error) {
        console.log("start error")
        console.log(error)
        res.status(500).send(error)
        console.log("stop error")
    }
})

app.post("/getRequestVehicle", registerAndEnrollUser, async (req, res) => {
    try {
        console.log("start req")
        const result = await contract.evaluateTransaction("getRequestVehicle", req.body.login);
        if (!result || result.length === 0) {
            res.send(JSON.stringify({click: 0}));
        } else {
            res.send(result.toString());
        }
        console.log("stop req")
    } catch (error) {
        console.log("start error")
        console.log(error)
        res.status(500).send(error)
        console.log("stop error")
    }
})

app.post("/getRequestCertificatePeriod", registerAndEnrollUser, async (req, res) => {
    try {
        console.log("start req")
        const result = await contract.evaluateTransaction("getRequestCertificatePeriod", req.body.login);
        if (!result || result.length === 0) {
            res.send(JSON.stringify({click: 0}));
        } else {
            res.send(result.toString());
        }
        console.log("stop req")
    } catch (error) {
        console.log("start error")
        console.log(error)
        res.status(500).send(error)
        console.log("stop error")
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
            const result = await contract.submitTransaction('init')
            console.log(`call contract init...2.`)
            console.log(result.toString())
        } catch (e) {
            console.log(`call contract init...3.`)
            console.log(`error + ${e}`);
        }
        console.log(`call contract init...4.`)
    }
}

main()

app.listen(3002, () => console.log('Listening on port 3002'))
