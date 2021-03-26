# Into the Moss Website

## Podcast publishing workflow

Podcasts are published via [RSS feed](https://rss.com/blog/how-do-rss-feeds-work/) using the XML file at [intothemoss.co.uk/feed.xml](https://intothemoss.co.uk/feed.xml). This is the feed registered with the podcast providers (Google/Apple/Stitcher/etc.).
The XML file is built using the [ID3 metadata](https://help.podbean.com/support/solutions/articles/25000021709-what-is-an-id3-tag-) in each MP3. The `buildXML.sh` script loops through the MP3 files in the /episodes/audio folder and parses the relevant ID3 tags (title, description, link etc.), adding them to the feed item. 

The `main` branch of this repository is pulled by the intothemoss.co.uk host server every Thursday at 18:30 via a cron task. 