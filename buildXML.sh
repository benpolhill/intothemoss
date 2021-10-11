#!/bin/bash

F=./feed.xml

# Prod:
URL="https://intothemoss.co.uk"

# Dev:
#URL="./"

rm $F

echo "<?xml version=\"1.0\" encoding=\"UTF-8\"?>
<rss version=\"2.0\" xmlns:itunes=\"http://www.itunes.com/dtds/podcast-1.0.dtd\" xmlns:content=\"http://purl.org/rss/1.0/modules/content/\">
    <channel>
        <title>Into the Moss</title>
        <description>A sunken raft of weeds woven into a verdant morass of sound, song and story. Broadcast on London&apos;s Resonance FM every Thursday, Into the Moss is a 14 minute drift through original music, soundscapes and liminal yarns.</description>
        <itunes:image href=\"$URL/images/intothemoss.jpg\"/>
        <language>en-uk</language>
        <itunes:category text=\"Fiction\">
            <itunes:category text=\"Drama\"/>
        </itunes:category>
        <itunes:category text=\"Fiction\">
            <itunes:category text=\"Comedy Fiction\"/>
        </itunes:category>
        <link>$URL</link>
        <copyright>&#xA9; Into the Moss 2020-2021</copyright>
        <itunes:author>Into the Moss</itunes:author>
        <itunes:owner>
            <itunes:name>James Baxter, James Ferris, Ben Polhill</itunes:name>
            <itunes:email>intothemossradio@gmail.com</itunes:email>
        </itunes:owner>
        <itunes:explicit>false</itunes:explicit>" >> $F

for f in $(ls -r ./episodes/audio/*.mp3); do
    echo "Processing $f"
    file=${f##*/}
    index="${file%.*}"
    size=$(wc -c $f | awk '{print $1}')
    guid=$(ffprobe -loglevel error -show_entries format_tags=TGID -of default=noprint_wrappers=1:nokey=1 $f)
    title=$(ffprobe -loglevel error -show_entries format_tags=title -of default=noprint_wrappers=1:nokey=1 $f)
    echo "$guid: \"$title\""
    comment=$(ffprobe -loglevel error -show_entries format_tags=comment -of default=noprint_wrappers=1:nokey=1 $f)
    released=`echo "$comment" | grep -Eo "[0-9]+\s[A-Z][a-z][a-z]\s[0-9]{4}"`
    echo "released: $released"
    desc=$(ffprobe -loglevel error -show_entries format_tags=TDES -of default=noprint_wrappers=1:nokey=1 $f)
    desc=$(echo "${desc//\'/&apos;}")
    desc=$(echo "${desc// & / &amp; }")
    album=$(ffprobe -loglevel error -show_entries format_tags=album -of default=noprint_wrappers=1:nokey=1 $f)
    season="${album: -1}"
    episode=$(ffprobe -loglevel error -show_entries format_tags=track -of default=noprint_wrappers=1:nokey=1 $f | sed 's|\(.*\)/.*|\1|')
    seasonpad=$(printf "%02d" $season)
    episodepad=$(printf "%02d" $episode)
    duration=`printf "%0.2f\n" $(ffprobe $f -show_entries format=duration -v quiet -of csv="p=0")`
    echo "        <item>
            <itunes:episode>$episode</itunes:episode>
            <itunes:season>$season</itunes:season>
            <title>$title</title>
            <description>$desc</description>
            <enclosure url=\"$URL/episodes/audio/$file\" length=\"$size\" type=\"audio/mpeg\" />
            <link>$URL/episodes/s$seasonpad/$episodepad</link>
            <itunes:image href=\"$URL/episodes/images/jpg/1400/$index.jpg\"/>
            <guid>$guid</guid>
            <pubDate>Thu, $released 18:30:00 +0000</pubDate>
            <itunes:duration>$duration</itunes:duration>
            <itunes:explicit>false</itunes:explicit>
        </item>" >> $F
done

echo "    </channel>
</rss>" >> $F
