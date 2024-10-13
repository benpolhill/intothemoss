# Into the Moss Website

## Prerequisites (Mac)

* Homebrew
* Python 3.8 or above

Install homebrew as per the [instructions here](https://brew.sh/).
You'll probably already have Python 3.* on your system. Check with
```bash
python --version
```

* ffmpeg
* Imagemagick

With Homebrew installed, you can install all the above with:
```bash
brew install ffmpeg && brew install imagemagick
```
## Initial setup 

Do this once, before releasing any episodes:
```
git config --global user.name "intothemoss"
git config --global user.email "intothemoss@gmail.com"
git clone https://github.com/benpolhill/intothemoss.git
cd intothemoss
rsync -av root@dept2.co/var/www/intothemoss/audio/ ./audio
```

## Podcast release workflow
### 1. Encode the MP3

The podcast MP3 should be encoded for optimised streaming. Use VBR quality 5. This can be done with [FFmpeg](https://ffmpeg.org/download.html) using this command:
```bash
ffmpeg -i 001.wav -q:a 5 001.mp3
```
`-q:a` will encode VBR; 0 is high 9 is low. Or save as max-quality CBR:
```
ffmpeg -i 001.wav -ab 320k 001.mp3
```
The MP3 is then saved in `/audio/[EPISODE_NUMBER].mp3`. EPISODE_NUMBER is three digits, i.e. 022.mp3.
### 2. Save episode artwork

The images should be exported as Jpeg at 1400x1400, with quality set around 10, so file size is kept below 200K. The image is saved in `/assets/images/jpg/1400/[EPISODE_NUMBER].jpg` 

### 3. Run the deployment script 

```bash
./deploy.sh 
```
The podcasts are published via [RSS feed](https://rss.com/blog/how-do-rss-feeds-work/) using the XML file at [intothemoss.com/feed.xml](https://intothemoss.com/feed.xml). This is the feed registered with the podcast providers (Google/Apple/Stitcher/etc.).