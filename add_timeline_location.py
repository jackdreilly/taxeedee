import requests
import parse_post
import shutil
import json
import multiprocessing
import csv

def process(line):
  if not line.strip():
    return False
  bits = list(csv.reader([line.strip()]))[0]
  if len(bits) > 3:
    return line
  if len(bits) < 3:
    raise Exception("Bad line: " + line)
  city, country, date = bits
  url = 'https://maps.googleapis.com/maps/api/geocode/json?address={0}&key={1}'
  key = 'AIzaSyCbd76u4PHOI8tnBN5_lgthIO-bbQ-c-TQ'
  address = '{0}, {1}'.format(city, country)
  response = json.loads(requests.get(url.format(address, key)).text)
  lat = response['results'][0]['geometry']['location']['lat']
  lng = response['results'][0]['geometry']['location']['lng']
  value =  bits + [lat, lng]
  print value
  return value

def add_location(file_name=None):
    if file_name is None:
      file_name = 'locations/locations.csv'
    with open(file_name) as file:
        lines = list(file)
    
    pool = multiprocessing.Pool(30)

    lines = pool.map(process, lines)
    shutil.copyfile(file_name, file_name + '.old')
    with open(file_name, 'w') as fn:
      writer = csv.writer(fn)
      for line in lines:
        if not line:
          continue
        writer.writerow(line)

if __name__ == '__main__':
    import sys
    add_location(sys.argv[1] if len(sys.argv) > 1 else None)
