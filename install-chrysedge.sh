#!/bin/bash

VERSION="0.0.8"

# exit when any command fails
set -e

echo "Installing Chryscloud Edge docker images"
command -v docker-compose >/dev/null 2>&1 || { echo >&2 "Chrysalis Edge requires docker-compose, please install and retry"; }

DIR="$(pwd)/data"

echo "Creating data and videos folder"
mkdir -p data
mkdir -p videos

# Get the docker compose file
wget -N https://raw.githubusercontent.com/chryscloud/api_doc/master/docker-compose.yml

# Replace in config.json with default params for the current platform
sed -i.bak -e "s|TO_REPLACE_PATH_TO_USER_FOLDER|$DIR|g" docker-compose.yml
sed -i.bak -e "s|TO_REPLACE_VERSION|$VERSION|g" docker-compose.yml

# pull images
docker-compose pull

# pull initial image for faster start
docker pull chryscloud/chrysedgeproxy:0.0.8

echo "Installation successfull"

echo "Run Chrys Edge with: docker-compose up or to start as a daemon process: docker-compose up -d"
