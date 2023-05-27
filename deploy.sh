#!/bin/bash

ROOT_DIR=`pwd`
IMGS_DIR=assets/images
EP_ID=$1
if [ -z "$1" ]; then
    echo "Episode number? [0xx]:"
    read EP_ID
fi

python buildXML.py
cd $IMGS_DIR
cwebp -resize 1000 1000 -q 50 jpg/1400/$EP_ID.jpg -o webp/1000/$EP_ID.webp
cwebp -resize 150 150 -q 50 jpg/1400/$EP_ID.jpg -o webp/150/$EP_ID.webp
cwebp -resize 300 300 -q 50 jpg/1400/$EP_ID.jpg -o webp/300/$EP_ID.webp
convert jpg/1400/$EP_ID.jpg -resize 300x300 -quality 60 jpg/300/$EP_ID.jpg
convert jpg/1400/$EP_ID.jpg -resize 300x300 -quality 60 jpg/150/$EP_ID.jpg
cd $ROOT_DIR
echo "Syncing audio dir..."
rsync -arv audio/ root@dept2.co:/var/www/intothemoss/audio
npm run build
git add .
git commit -m "deploy episode $EP_ID"
git push


