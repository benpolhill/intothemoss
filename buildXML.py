# Generated via GPT-4, multiple iterations. Last updated 2023-05-27
# https://chat.openai.com/share/4b9083d7-31f7-49cc-851b-eb1de3615fa4

import os
import glob
import datetime
import xml.etree.ElementTree as ET
from mutagen.id3 import ID3
from mutagen.mp3 import MP3
from xml.dom import minidom

def get_latest_file():
    return sorted(glob.glob('./audio/*.mp3'))[-1]

def get_file_info(latest_file):
    return ID3(latest_file)

def get_audio_info(latest_file):
    return MP3(latest_file)

def get_file_length(latest_file):
    return str(os.path.getsize(latest_file))

def tgid_to_datetime(tgid):
    date_str = tgid[3:]
    date = datetime.datetime.strptime(date_str, "%Y%m%d")
    date = date.replace(hour=18, minute=30)
    date = date.replace(tzinfo=datetime.timezone.utc)
    return date

def create_new_item(file_info, namespaces, latest_file, audio_info, episode, season, title, desc, url, length, image, link, guid, pubdate, duration, explicit):
    new_item = ET.Element('item')

    new_item.append(create_element(namespaces['itunes'], 'episode', episode))
    new_item.append(create_element(namespaces['itunes'], 'season', season))
    new_item.append(create_element(None, 'title', title))
    new_item.append(create_element(None, 'description', desc))

    enclosure_tag = ET.Element('enclosure')
    enclosure_tag.set('url', url)
    enclosure_tag.set('length', length)
    enclosure_tag.set('type', "audio/mpeg")
    new_item.append(enclosure_tag)

    new_item.append(create_element(None, 'link', link))
    new_item.append(create_image(namespaces['itunes'], image))
    new_item.append(create_element(None, 'guid', guid))
    new_item.append(create_element(None, 'pubDate', pubdate))
    new_item.append(create_element(namespaces['itunes'], 'duration', duration))
    new_item.append(create_element(namespaces['itunes'], 'explicit', explicit))

    return new_item

def create_element(namespace, tag, text):
    if namespace:
        element = ET.Element(ET.QName(namespace, tag))
    else:
        element = ET.Element(tag)
    element.text = text
    return element

def create_enclosure(url, length):
    enclosure = ET.Element('enclosure')
    enclosure.set('url', url)
    enclosure.set('length', length)
    enclosure.set('type', "audio/mpeg")
    return enclosure

def create_image(namespace, image):
    image_tag = ET.Element(ET.QName(namespace, 'image'))
    image_tag.set('href', image)
    return image_tag

def check_item_exists(root, url):
    for item in root.iter('item'):
        enclosure = item.find('enclosure')
        if enclosure is not None and enclosure.get('url') == url:
            return True
    return False

def update_xml_tree(root, new_item, url):
    if check_item_exists(root, url):
        print(f"An item with URL {url} already exists in the feed.")
        return
    # find the channel element
    for channel in root.iter('channel'):
        # find the first item index in the channel
        first_item_index = next(i for i, child in enumerate(channel) if child.tag == 'item')
        # insert the new item before the first existing item in the channel
        channel.insert(first_item_index, new_item)
        break

def write_to_file(root, filename):
    pretty_xml = minidom.parseString(ET.tostring(root, encoding='utf-8')).toprettyxml(indent="    ")
    pretty_xml = '\n'.join([s for s in pretty_xml.splitlines() if s.strip()]) # remove empty lines
    with open(filename, "w") as f:
        f.write(pretty_xml)

def main():
    # Identify the most recent file
    latest_file = get_latest_file()

    # Use ID3 instead of EasyID3 to access non-standard tags
    info = get_file_info(latest_file)

    # Load the MP3 file
    audio = get_audio_info(latest_file)

    # Get information from the file
    episode = info.get('TRCK').text[0] if info.get('TRCK') else info.get('track').text[0] if info.get('track') else ''
    episode_id = latest_file.split('/')[-1].replace('.mp3', '')
    season = info.get('TPOS').text[0] if info.get('TPOS') else ''
    title = info.get('TIT2').text[0] if info.get('TIT2') else ''
    desc = info.get('TDES').text[0] if info.get('TDES') else ''
    url = f"https://intothemoss.com/audio/{episode_id}.mp3"
    length = get_file_length(latest_file)
    image = f"https://intothemoss.com/assets/images/jpg/1400/{episode_id}.jpg"
    link = "https://intothemoss.com/episodes/" + episode_id
    guid = info.get('TGID').text[0] if info.get('TGID') else ''
    pubdate = tgid_to_datetime(info['TGID'][0]).strftime("%a, %d %b %Y %H:%M:%S %z")
    duration = audio.info.length
    # Round to two decimal places and convert to a string
    duration = "{:.2f}".format(duration)
    explicit = "false"

    # define and register namespaces
    namespaces = {'itunes': 'http://www.itunes.com/dtds/podcast-1.0.dtd'}
    for prefix, uri in namespaces.items():
        ET.register_namespace(prefix, uri)

    # create a new item
    new_item = create_new_item(info, namespaces, latest_file, audio, episode, season, title, desc, url, length, image, link, guid, pubdate, duration, explicit)

    # parse xml
    tree = ET.parse('./feed.xml')
    root = tree.getroot()

    # update XML tree with the new item
    update_xml_tree(root, new_item, url)

    # write the new xml to file
    write_to_file(root, "feed.xml")


if __name__ == "__main__":
    main()
