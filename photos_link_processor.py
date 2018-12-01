import requests
import constants
import shutil
import multiprocessing
import re


def photo_processor(file_name):
    processed_filename = file_name + ".processed"
    shutil.copyfile(file_name, file_name + '.old')
    with open(file_name) as file:
        lines = list(file)
    pool = multiprocessing.Pool()
    processed_lines = pool.map(processed, lines)
    with open(file_name, 'w') as file:
        file.writelines(processed_lines)


def video_token(url):
  x = re.match(r'https://drive.google.com/open\?id=(.*)$', url.strip())
  if x:
    return 'https://drive.google.com/file/d/%s/preview\n' % x.group(1)
  return False
  

def processed(line):
    if 'app.goo.gl' in line and constants.URL_DELIM not in line:
        url = requests.get(
            'http://us-central1-taxeedee-212808.cloudfunctions.net/cloud?url=%s' % line.strip()).text.strip()
        print url
        return constants.URL_DELIM.join((url, line))
    video = video_token(line)
    if video:
      print video
      return video
    return line

if __name__ == '__main__':
    import sys
    photo_processor(sys.argv[1])
