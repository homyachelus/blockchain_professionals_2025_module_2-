set -e

cd /mnt/c/Users/Admin/Desktop/github/blockchain_professionals_2025_module_2-/fabric-samples/test-network

./network.sh up -ca
./network.sh up createChannel -ca -c blockchain2025

cd ../asset-transfer-basic/chaincode-typescript

npm run build

cd ../../test-network

./network.sh deployCCAAS -ccn blockchain -ccl typescript -ccv 1.0 -ccs 1 -ccp ../asset-transfer-basic/chaincode-typescript/ -c blockchain2025

cd ../app-js
npm run start &
wait

# gnome-terminal --bash -c "cd ../../frontend; sleep 15"
# npm run dev
# wait