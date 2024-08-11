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

# Extract file names
audio_file_name=$(basename "$audio_file_path")
prev_audio_file_name=$(basename "$prev_audio_file_path")

echo "audio_file_name: $audio_file_name"
echo "prev_audio_file_name: $prev_audio_file_name"

# Fetch track, disc, and date from the previous audio file and increment track by 1
prev_track=$(ffprobe -v quiet -print_format json -show_entries format_tags=track "$prev_audio_file_path" | jq -r .format.tags.track)
next_track=$((prev_track + 1))
prev_season=$(ffprobe -v quiet -print_format json -show_entries format_tags=disc "$prev_audio_file_path" | jq -r .format.tags.disc)
default_date=$(date +'%Y%m%d')

echo -n "Season number? [$prev_season] "
read season
season=${season:-$prev_season}

echo -n "Episode number? [$next_track] "
read track
track=${track:-$next_track}

while true; do
    echo -n "Publish date? [$default_date] "
    read date_input
    date_input=${date_input:-$default_date}

    if [[ $date_input =~ ^[0-9]{8}$ ]]; then
        break
    else
        echo "Date must be in YYYYMMDD format."
    fi
done

# Format date for the metadata
if [[ "$OSTYPE" == "darwin"* ]]; then
    formatted_date=$(date -j -f "%Y%m%d" "$date_input" +'%d %m %Y')
    year=$(date -j -f "%Y%m%d" "$date_input" +'%Y')
else
    formatted_date=$(date -d "$date_input" +'%d %m %Y')
    year=$(date -d "$date_input" +'%Y')
fi

# Other prompts
echo -n "Enter title: "
read title

echo -n "Enter description: "
read description

# Other metadata
img_file_path="$IMGS_DIR/jpg/1400"
tracknum=${audio_file_name%.*}
artist="M"
album_artist="w"
genre="Ambient"
comment="First broadcast $(date +'%d %b %Y') on M"
copyright="© M $(date +'%Y')"
season="$season"
album="Season $season"
tgid="itm$date_input"

# Setting metadata to a temp file
ffmpeg -i "$audio_file_path" -i "$img_file_path/$tracknum.jpg" -map 0 -map 1 -c copy \
    -metadata:s:v title="Album cover" -metadata:s:v comment="Cover (front)" \
    -metadata track="$track" -metadata title="$title" -metadata artist="$artist" \
    -metadata album="$album" -metadata TDES="$description" -metadata genre="$genre" \
    -metadata comment="$comment" -metadata copyright="$copyright" -metadata album_artist="$album_artist" \
    -metadata disc="$season" -metadata TGID="$tgid" -metadata date="$(date +'%Y')" \
    "$AUDIO_DIR/_${audio_file_name}"

# Overwrite the original file with the temp file
mv "$AUDIO_DIR/_${audio_file_name}" "$AUDIO_DIR/$audio_file_name"

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
