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

