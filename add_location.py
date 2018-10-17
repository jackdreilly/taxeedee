import requests
import parse_post
import shutil

def add_location(file_name):
    with open(file_name) as file:
        lines = list(file)
    try:
      map(float, lines[0].split(' '))
      return
    except:
      url = 'https://maps.googleapis.com/maps/api/geocode/json?address={0}&key={1}'
      key = 'AIzaSyCbd76u4PHOI8tnBN5_lgthIO-bbQ-c-TQ'
      address = '{0}, {1}'.format(lines[2], lines[3])
      import json
      response = json.loads(requests.get(url.format(address, key)).text)
      lat = response['results'][0]['geometry']['location']['lat']
      lng = response['results'][0]['geometry']['location']['lng']
      shutil.copyfile(file_name, file_name + '.old')
      with open(file_name, 'r') as fn:
        data = fn.read()
      with open(file_name, 'w') as fn:
        fn.write('{0} {1}\n'.format(lat, lng))
        fn.write(data)

if __name__ == '__main__':
    import sys
    add_location(sys.argv[1])
