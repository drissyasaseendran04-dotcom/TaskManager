#!/usr/bin/env bash
set -euo pipefail


# Build server image and client image, then create a tar of images for distribution
ROOT=$(cd "$(dirname "$0")" && pwd)
cd "$ROOT"


echo "Building server image..."
docker build -t task-manager-server:1.0 ./server


echo "Building client image..."
docker build -t task-manager-client:1.0 ./client


echo "Saving images to images.tar..."
docker save task-manager-server:1.0 task-manager-client:1.0 -o images.tar


echo "Done: images.tar created"