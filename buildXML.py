import os
import glob
import datetime
import xml.etree.ElementTree as ET
from mutagen.id3 import ID3
from mutagen.mp3 import MP3
from xml.dom import minidom

# Identify the most recent file
latest_file = sorted(glob.glob('./audio/*.mp3'))[-1]

# Use ID3 instead of EasyID3 to access non-standard tags
info = ID3(latest_file)

# Load the MP3 file
audio = MP3(latest_file)

# Convert TGID into a datetime object
def tgid_to_datetime(tgid):
    date_str = tgid[3:]  # Get the date part from the TGID
    date = datetime.datetime.strptime(date_str, "%Y%m%d")  # Convert to a datetime object
    date = date.replace(hour=18, minute=30)  # Set the time to 18:30
    date = date.replace(tzinfo=datetime.timezone.utc)  # Make it a timezone-aware datetime object
    return date

episode = info.get('TRCK').text[0] if info.get('TRCK') else info.get('track').text[0] if info.get('track') else ''
episode_id = latest_file.split('/')[-1].replace('.mp3', '')
season = info.get('TPOS').text[0] if info.get('TPOS') else ''
title = info.get('TIT2').text[0] if info.get('TIT2') else ''
desc = info.get('TDES').text[0] if info.get('TDES') else ''
url = f"https://intothemoss.com/audio/{episode_id}.mp3"
length_int = os.path.getsize(latest_file)
length = str(length_int)
image = f"https://intothemoss.com/assets/images/jpg/1400/{episode_id}.jpg"
link = "https://intothemoss.com/episodes/" + episode_id
guid = info.get('TGID').text[0] if info.get('TGID') else ''
pubdate = tgid_to_datetime(info['TGID'][0]).strftime("%a, %d %b %Y %H:%M:%S %z")
duration = audio.info.length
# Round to two decimal places and convert to a string
duration = "{:.2f}".format(duration)
explicit = "false"

# parse xml
tree = ET.parse('./feed.xml')
root = tree.getroot()

# define and register namespaces
namespaces = {'itunes': 'http://www.itunes.com/dtds/podcast-1.0.dtd'}
for prefix, uri in namespaces.items():
    ET.register_namespace(prefix, uri)

# create a new item
new_item = ET.Element('item')

episode_tag = ET.Element(ET.QName(namespaces['itunes'], 'episode'))
episode_tag.text = episode
new_item.append(episode_tag)

season_tag = ET.Element(ET.QName(namespaces['itunes'], 'season'))
season_tag.text = season
new_item.append(season_tag)

title_tag = ET.Element('title')
title_tag.text = title
new_item.append(title_tag)

desc_tag = ET.Element('description')
desc_tag.text = desc
new_item.append(desc_tag)

enclosure_tag = ET.Element('enclosure')
enclosure_tag.set('url', url)
enclosure_tag.set('length', length)
enclosure_tag.set('type', "audio/mpeg")
new_item.append(enclosure_tag)

link_tag = ET.Element('link')
link_tag.text = link
new_item.append(link_tag)

image_tag = ET.Element(ET.QName(namespaces['itunes'], 'image'))
image_tag.set('href', image)
new_item.append(image_tag)

guid_tag = ET.Element('guid')
guid_tag.text = guid
new_item.append(guid_tag)

pubDate_tag = ET.Element('pubDate')
pubDate_tag.text = pubdate
new_item.append(pubDate_tag)

duration_tag = ET.Element(ET.QName(namespaces['itunes'], 'duration'))
duration_tag.text = duration
new_item.append(duration_tag)

explicit_tag = ET.Element(ET.QName(namespaces['itunes'], 'explicit'))
explicit_tag.text = explicit
new_item.append(explicit_tag)

# find the channel element
for channel in root.iter('channel'):
    # find the first item index in the channel
    first_item_index = next(i for i, child in enumerate(channel) if child.tag == 'item')
    # insert the new item before the first existing item in the channel
    channel.insert(first_item_index, new_item)
    break

# write the new xml to file
pretty_xml = minidom.parseString(ET.tostring(root, encoding='utf-8')).toprettyxml(indent="    ")
pretty_xml = '\n'.join([s for s in pretty_xml.splitlines() if s.strip()]) # remove empty lines

with open("feed.xml", "w") as f:
    f.write(pretty_xml)

