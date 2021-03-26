# Into the Moss Website

## Podcast publishing workflow

Podcasts are published via [RSS feed](https://rss.com/blog/how-do-rss-feeds-work/) using the XML file at [intothemoss.co.uk/feed.xml](https://intothemoss.co.uk/feed.xml). This is the feed registered with the podcast providers (Google/Apple/Stitcher/etc.).

The XML file is built using the [ID3 metadata](https://help.podbean.com/support/solutions/articles/25000021709-what-is-an-id3-tag-) in each MP3. The `buildXML.sh` script loops through each MP3 file in the /episodes/audio folder, parsing the relevant ID3 tags (title, description, link etc) and adding them to the feed item. 
Because of this, it's important to tag each MP3 correctly. Use the [ID3 Editor](http://www.pa-software.com/id3editor/) and ensure the following fields are filled in:
- Title
- Album (i.e. Season)
- Comment (must include date in format: DD Mon YYYY)
- URL (including season/episode number)
- Identifier (in Podcast tab, format: itmYYYYMMDD)
- Description (in Podcast tab)

Other fields (like image) may be filled, but are not essential for the feed build.

![ID3 fields 1]('./images/ID3Tag1.png')
![ID3 fields 2]('./images/ID3Tag2.png')

The `main` branch of this repository is pulled by the intothemoss.co.uk host server every Thursday at 18:30 via the following cron task:
```bash
30 18 * * 4 su -s /bin/sh root -c 'cd /var/www/html/intothemoss.co.uk/ && /usr/bin/git pull origin main'
```
