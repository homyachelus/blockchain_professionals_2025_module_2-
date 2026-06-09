set -e

cd /mnt/c/Users/Admin/Desktop/github/blockchain_professionals_2025_module_2-/fabric-samples/test-network

# при использовании wsl эта строка может вызвать ошибку
# тк если контейнеров нет значит команда ничего не возвращает, т е - ошибка
docker stop $(docker ps -q) || true &
wait

./network.sh down

cd ../app-js
rm -rf wallet || true