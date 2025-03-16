#!/bin/bash

ROOT_DIR=$(pwd)
IMGS_DIR="$ROOT_DIR/assets/images"
AUDIO_DIR="$ROOT_DIR/audio"

echo "ROOT_DIR: $ROOT_DIR"
echo "IMGS_DIR: $IMGS_DIR"
echo "AUDIO_DIR: $AUDIO_DIR"

# Function to get the latest audio file
get_latest_audio_file() {
  find $AUDIO_DIR -type f -name "*.mp3" | sort -n | tail -1
}

# Function to get the previous audio file
get_previous_audio_file() {
  find $AUDIO_DIR -type f -name "*.mp3" | sort -n | tail -2 | head -1
}

# Check if an argument is provided
if [ -z "$1" ]; then
  audio_file_path=$(get_latest_audio_file)
  prev_audio_file_path=$(get_previous_audio_file)
else
  audio_file_path="$AUDIO_DIR/$1.mp3"
  prev_audio_file_path=$(find $AUDIO_DIR -type f -name "*.mp3" | grep -B1 "$audio_file_path" | head -1)
  if [ ! -f "$audio_file_path" ]; then
    echo "Specified audio file $audio_file_path does not exist."
    exit 1
  fi
fi

# Get the episode ID
EP_ID=$(basename "$audio_file_path" .mp3)


# Ensure buildXML.py runs successfully
if python buildXML.py; then
    echo "XML build successful."
else
    echo "Failed to build XML."
    exit 1
fi

cd $IMGS_DIR
cwebp -resize 1000 1000 -q 50 jpg/1400/$EP_ID.jpg -o webp/1000/$EP_ID.webp
cwebp -resize 150 150 -q 50 jpg/1400/$EP_ID.jpg -o webp/150/$EP_ID.webp
cwebp -resize 300 300 -q 50 jpg/1400/$EP_ID.jpg -o webp/300/$EP_ID.webp
convert jpg/1400/$EP_ID.jpg -resize 300x300 -quality 60 jpg/300/$EP_ID.jpg
convert jpg/1400/$EP_ID.jpg -resize 300x300 -quality 60 jpg/150/$EP_ID.jpg

cd $ROOT_DIR
echo "Syncing audio dir..."
#rsync -arv audio/ root@dept2.co:/var/www/intothemoss/audio
npm run build
git add .
git commit -m "deploy episode $EP_ID"
git push
