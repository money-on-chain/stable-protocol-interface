#!/bin/bash

PROJECT_NAME=$1

if [ -z "$PROJECT_NAME" ]; then
    echo "Error: No project name specified."
    exit 1
fi

echo "Preparing to run project: $PROJECT_NAME"

copy_assets() {
    SOURCE_DIR=$1
    TARGET_DIR=$2

    if [ ! -d "$SOURCE_DIR" ]; then
        echo "Directory $SOURCE_DIR does not exist. Skipping..."
        return
    fi

    mkdir -p "$TARGET_DIR"
    cp -a "$SOURCE_DIR/." "$TARGET_DIR/"
}

#Common paths
PUBLIC_DIR="public/projects/$PROJECT_NAME"
SRC_DIR="src"
ASSETS_DIR="$SRC_DIR/assets/projects/$PROJECT_NAME"
COMMON_DIR="$SRC_DIR/assets"

#Copy
copy_assets "$PUBLIC_DIR" "public"
copy_assets "$ASSETS_DIR/css" "$COMMON_DIR/css"
copy_assets "$ASSETS_DIR/icons" "$COMMON_DIR/icons"
copy_assets "$ASSETS_DIR/fonts" "$COMMON_DIR/fonts"
copy_assets "$SRC_DIR/contracts/projects/$PROJECT_NAME" "$SRC_DIR/contracts"

echo "Done preparing project: $PROJECT_NAME!"