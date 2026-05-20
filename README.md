# Блокчейн Конкурсное задание 2025. Hyperledger-Fabric

## Установка зависимостей (на интернете)

### Докер

Перед работой обязательно нужно установить докер и запутсить его перед началом работы:
```shell
curl -fsSL https://get.docker.com | sh
#если докер нужно заново запустить но он установлен (если компьютер перегружен и тд) пиши:
sudo service docker start
```

Чтобы понять что докер запущен просто достаточно того что он не выдал ошибку "Cannot connect to the Docker daemon", все остальное - запущен

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

## Проблемки

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