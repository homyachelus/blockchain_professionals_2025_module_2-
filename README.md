# Блокчейн Конкурсное задание 2025. Hyperledger-Fabric

## Установка зависимостей (на интернете)

### Докер

Перед работой обязательно нужно установить докер и запутсить его перед началом работы:
```shell
curl -fsSL https://get.docker.com | sh
#если докер нужно заново запустить но он установлен (если компьютер перегружен и тд) пиши:
sudo service docker start
```

Чтобы понять что докер запущен нужно написать `docker ps` просто достаточно того что он не выдал ошибку "Cannot connect to the Docker daemon", все остальное - запущен

Для остановки докера: `docker stop $(docker ps -q)`

### Hyperledger-Fabric

Установка hyperledger-fabric осуществляется через команды:
```shell
curl -sSLO https://raw.githubusercontent.com/hyperledger/fabric/main/scripts/install-fabric.sh && chmod +x install-fabric.sh
  
./install-fabric.sh d s b
```

### Бэкэнд

Для бэкэнда нужно создать папку **app-js** в ней устанавливаем:
```shell
npm init
npm install express fabric-ca-client fabric-common fabric-contract-api fabric-network fabric-protos fabric-shim
```

### Контракт

Далее папка для контракта. Путь: `fabric-samples/asset-transfer-basic/chaincode-typescript`, тут устанавливаем:
```shell
npm init -y
npm install --save-dev typescript @types/node
npx tsc --init #если tsconfig.json нет
npm install fabric-contract-api
```

### Реакт

Установка реакта осущесвляется командой:
```shell
npm create vite@latest frontend -- --template react-ts
cd frontend
npm install
```

## Редактирование fabric-samples
1) Первый файл `fabric-samples/test-network/compose/compose-test-net.yaml`. 
Тут просто в строке - CORE_PEER_LOCALMSPID=Org1MSP меняем Org1MSP на свою организацию, то же самое с Org2MSP

2) Далее `fabric-samples/test-network/configtx/configtx.yaml` Тут меняем в нескольних местах:
```yaml
  - &Org2                                                                                   #+
    # DefaultOrg defines the organization which is used in the sampleconfig
    # of the fabric.git development environment
    Name: Org2MSP                                                                           #+
    # ID to load the MSP definition as
    ID: Org2MSP                                                                             #+
    MSPDir: ../organizations/peerOrganizations/org2.example.com/msp
    # Policies defines the set of policies at this level of the config tree
    # For organization policies, their canonical path is usually
    #   /Channel/<Application|Orderer>/<OrgName>/<PolicyName>
    Policies:
      Readers:
        Type: Signature
        Rule: "OR('Org2MSP.admin', 'Org2MSP.peer', 'Org2MSP.client')"                       #+
      Writers:
        Type: Signature
        Rule: "OR('Org2MSP.admin', 'Org2MSP.client')"                                       #+
      Admins:
        Type: Signature
        Rule: "OR('Org2MSP.admin')"                                                         #+
      Endorsement:
        Type: Signature
        Rule: "OR('Org2MSP.peer')"                                                          #+

#--------------------------------------------------------------------------------------------------------------

  - &User                                                                                   #-
    # DefaultOrg defines the organization which is used in the sampleconfig
    # of the fabric.git development environment
    Name: User                                                                              #-
    # ID to load the MSP definition as
    ID: User                                                                                #-
    MSPDir: ../organizations/peerOrganizations/org2.example.com/msp
    # Policies defines the set of policies at this level of the config tree
    # For organization policies, their canonical path is usually
    #   /Channel/<Application|Orderer>/<OrgName>/<PolicyName>
    Policies:
      Readers:
        Type: Signature
        Rule: "OR('User.admin', 'User.peer', 'User.client')"                                #-
      Writers:
        Type: Signature
        Rule: "OR('User.admin', 'User.client')"                                             #-
      Admins:
        Type: Signature
        Rule: "OR('User.admin')"                                                            #-
      Endorsement:
        Type: Signature
        Rule: "OR('User.peer')"                                                             #-
``` 

А также в самом низу:
```yaml
      Organizations:
        - *Org1
        - *Org2
#-------------------------
      Organizations:
        - *Bank
        - *User
```

3) Следующий файл `fabric-samples/test-network/organizations/ccp-generate.sh` добавляем в функции json_ccp и yaml_ccp строку `-e "s#\${ORGNAME}#$6#" \`
А также добавляем $ORGNAME в echo и пишем выше ORGNAME=Bank и ORGNAME=User:
```yaml
ORG=1
P0PORT=7051
CAPORT=7054
PEERPEM=organizations/peerOrganizations/org1.example.com/tlsca/tlsca.org1.example.com-cert.pem
CAPEM=organizations/peerOrganizations/org1.example.com/ca/ca.org1.example.com-cert.pem
ORGNAME=Bank                 #+
                                                        
echo "$(json_ccp $ORG $P0PORT $CAPORT $PEERPEM $CAPEM $ORGNAME)" > organizations/peerOrganizations/org1.example.com/connection-org1.json
echo "$(yaml_ccp $ORG $P0PORT $CAPORT $PEERPEM $CAPEM $ORGNAME)" > organizations/peerOrganizations/org1.example.com/connection-org1.yaml
                                                        #^

ORG=2
P0PORT=9051
CAPORT=8054
PEERPEM=organizations/peerOrganizations/org2.example.com/tlsca/tlsca.org2.example.com-cert.pem
CAPEM=organizations/peerOrganizations/org2.example.com/ca/ca.org2.example.com-cert.pem
ORGNAME=User                  #+

echo "$(json_ccp $ORG $P0PORT $CAPORT $PEERPEM $CAPEM $ORGNAME)" > organizations/peerOrganizations/org2.example.com/connection-org2.json
echo "$(yaml_ccp $ORG $P0PORT $CAPORT $PEERPEM $CAPEM $ORGNAME)" > organizations/peerOrganizations/org2.example.com/connection-org2.yaml
                                                        #^
```

4) В файле `fabric-samples/test-network/organizations/ccp-template.json` меняем `org${ORG}` на `${ORGNAME}`:
```json
"name": "test-network-${ORGNAME}",   +
    "version": "1.0.0",
    "client": {
        "organization": "${ORGNAME}",      +
        "connection": {
            "timeout": {
                "peer": {
                    "endorser": "300"
                }
            }
        }
    },
    "organizations": {
        "${ORGNAME}": {      +
            "mspid": "${ORGNAME}",         +
            "peers": [
                "peer0.org${ORG}.example.com"
            ],
            "certificateAuthorities": [
                "ca.org${ORG}.example.com"
            ]
        }
    },
```

5) В `fabric-samples/test-network/organizations/ccp-template.yaml` тоже самое:
```yaml
name: test-network-${ORGNAME}       #+
version: 1.0.0
client:
  organization: ${ORGNAME}          #+
  connection:
    timeout:
      peer:
        endorser: '300'
organizations:
  ${ORGNAME}:                       #+
    mspid: ${ORGNAME}               #+
```

6) В `fabric-samples/test-network/scripts/deployCC.sh` меняем на свое название канала: **CHANNEL_NAME=${1:-"blockchain2025"}** и:
```shell
checkCommitReadiness 1 "\"Org1MSP\": true" "\"Org2MSP\": false"   #+
checkCommitReadiness 2 "\"Org1MSP\": true" "\"Org2MSP\": false"   #+

## now approve also for org2
approveForMyOrg 2

## check whether the chaincode definition is ready to be committed
## expect them both to have approved
checkCommitReadiness 1 "\"Org1MSP\": true" "\"Org2MSP\": true"   #+
checkCommitReadiness 2 "\"Org1MSP\": true" "\"Org2MSP\": true"   #+

#-------------------------------------------------------------------------

checkCommitReadiness 1 "\"Bank\": true" "\"User\": false"   #-
checkCommitReadiness 2 "\"Bank\": true" "\"User\": false"   #-

## now approve also for org2
approveForMyOrg 2

## check whether the chaincode definition is ready to be committed
## expect them both to have approved
checkCommitReadiness 1 "\"Bank\": true" "\"User\": true"   #-
checkCommitReadiness 2 "\"Bank\": true" "\"User\": true"   #-
```

7) В `fabric-samples/test-network/scripts/deployCCAAS.sh` тоже самое что и deployCC.sh
8) В `fabric-samples/test-network/scripts/envVar.sh` просто меняем Org1MSP export **CORE_PEER_LOCALMSPID=Org1MSP** и **CORE_PEER_LOCALMSPID=Org1MSP** на своё
9) И напоследок в файле `fabric-samples/test-network/network.sh` с помощью Ctrl+R ищем CHANNEL_NAME="$2" и пишем название своего канала

Чтобы проверить что все работает нужно попробоавать создать сеть и канал(тот что написал в файлах deployCC и deployCCAAS):
```shell
./network.sh up -ca 
./network.sh up createChannel -ca -c blockchain2025
```

При успехе будет - *Anchor peer set for org 'User' on channel 'blockchain2025' Channel 'blockchain2025' joined*

При исправлении каких-либо ошибок и тд нужно удалить все старые запуски так как это все сохраняется даже после выхода из программы.
Делается это с помощью `./network.sh down` и только потом заново нужно писать команды выше ^

## Контракт

Перед началом написания контаркта сначала нужно понять что деплой НА ЧЕМПИОНАТЕ ЗАПУСКАЕТСЯ через папку deployCCAAS, тк она работает таким образом что 
разработчик сам запускает докер контейнер вручную без использования Peer-узла - он использует интернет, а вот CCAAS он не нужен

Так что для этого нам нужно сделать изменения для папки `chaincode-typescript`, в которой мы пишем контракт. 
В папке `typescript.json` нужно чтобы было **"strict": false**, если там есть такие параметры как verbatimModuleSyntax и exactOptionalPropertyTypes их тоже меняем на false

Далее создаем файл *contract.ts* в папке src и если нету файла *index.ts* тоже его создаем, а если он есть то все удаляем, позже его заполним

* https://hyperledger-fabric.readthedocs.io/ru/latest/smartcontract/smartcontract.html

Любой контракт на typescript использует методы объекта ctx.stub как.
По этому пути находятся основные методы: fabric-samples\chaincode\node_modules\fabric-shim-api\types\index.d.ts

В функции init обычно инициализируются начальные данные из задания.

Теперь нужно оформить докерфайл в папке **chaincode-typescript** Это очень важно, и без этого деплой не будет работать 

**версию лучше поменять на 22*

```dockerfile
#Было:
COPY --chown=node:node package*.json ./
RUN npm i
COPY --chown=node:node . /usr/src/app
ENV npm_config_cache=/usr/src/app
RUN npm run package

#Стало:
COPY --chown=node:node package*.json ./
RUN npm install
COPY --chown=node:node . /usr/src/app
ENV npm_config_cache=/usr/src/app
RUN npm run build
```

```dockerfile
#Этот блок полностью удаляем:

# Setup tini to work better handle signals
ENV TINI_VERSION v0.19.0
ENV PLATFORM=amd64
ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini-${PLATFORM} /tini
RUN chmod +x /tini
```

```dockerfile
#Было:
RUN npm ci --omit=dev && npm cache clean --force
#Стало:
COPY --chown=node:node --from=builder /usr/src/app/node_modules ./node_modules
```

```dockerfile
#Было:
ENTRYPOINT [ "/tini", "--", "/usr/src/app/docker-entrypoint.sh" ]
#Стало:
ENTRYPOINT [ "/usr/src/app/docker-entrypoint.sh" ]
```

Заполнять index.ts нужно так:
```typescript
import {SafeRoadTraffic} from "./contract";
export {SafeRoadTraffic} from "./contract";

export const contracts: any[] = [SafeRoadTraffic];
```
где SafeRoadTraffic - название контракта

Тут в package.json: 
```
"scripts": {
    "lint": "eslint src",
    "pretest": "npm run lint",
    "test": "",
    "start": "fabric-chaincode-node start",     +
    "build": "tsc",                             +
```

## Бэкэнд

В созданной нами папке fabric-samples/app-js создаем файл app.js и папку utils в которую копируем 2 файла по пути `fabric-samples/test-application/javascript`.
Далее в package.json меняем строки:
```json
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
```

На:
```json
"scripts": {
    "start": "node ./app.js",
},
```

Далее в app.js пишем ЗАУЧЕННЫЙ код!:
```javascript
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
```

После него описываем функции таким образом:

```javascript
app.post("/userRegistration", registerAndEnrollUser, async (req, res) => {
    try {
        const result = await contract.submitTransaction("userRegistration", req.body.login, req.body.password);
        res.send(result.toString());
    } catch (error) {
        res.status(500).send(error)
    }
})
```
> submitTransaction - для функций, которые изменяют блокчейн, evaluateTransaction - функции для чтения

И далее опять заученный код:

```javascript
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
```

## Фронтенд

В папке src создаем папку api, где создаем api.ts и описываем там функции для импользования во фронте:

```typescript
export const getUser = async() => {
    const raw = await fetch("https:/localhost:3002/getUser", {
        method: "POST",
        headers: {"Content-type": "application/json"},
        body:JSON.stringify({})
    })
    return await raw.json()
}
```

Если ошибка типа "функция ничего не возвращает":
Failed to execute 'json' on 'Response': Unexpected end of JSON input

То нужно в конце нее в контракте добавить:
return JSON.stringify(request);

Обычно это встречается в get-функциях

Если возникают ошибки в консоли типа ошибки 500, то смотри в терминал бекэнда, там написана причина 

Перехват ошибки во фронте в блоке try {..} catch(e) {..}:
```typescript
const cleanMessage = e.message.includes("message=")
    ? e.message.split("message=")[1] // [0]-до "message=" [1]-после "message="
    : e.message;

alert(cleanMessage);
```

Для обновления LocalStorage:
```typescript
const [user, setUser] = useState<User | undefined>(
    () => {const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            try {
                return JSON.parse(savedUser);
            } catch (e) {
                return undefined;
            }
        }
        return undefined;
    });
```

## Автозапуск

Автозапуск находится в корне проекта в файле start.sh и stop.sh

При работе на реалном убунту используем:
`gnome-terminal --bash -c "cd ../../frontend; sleep 15"`

Я писала на wsl и вручную открывала терминал где запускала npm run dev

Для запуска нужно сначала раздать права файлам если будут подобные ошибки(один раз за все время) и потом запускать:
```shell
chmod +x ./stop.sh
chmod +x ./start.sh

./stop.sh
./start.sh
```

## Проблемы

1) Если докер новой версии и он не воспринимает docker-compose через дифис:
```shell
The command 'docker-compose' could not be found in this WSL 2 distro.
We recommend to activate the WSL integration in Docker Desktop settings.
```
Просто применяется команда:
```shell
sudo ln -s /usr/libexec/docker/cli-plugins/docker-compose /usr/local/bin/docker-compose
```

Лучше заранее ее сделать при установке докера, лишним не будет
