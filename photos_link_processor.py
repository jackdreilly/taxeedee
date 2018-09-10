import requests


def photo_processor(file_name):
  with open(file_name) as file:
    with open(file_name + ".processed", 'w') as file_out:
      for line in file:
        if 'app.goo.gl' in line:
          processed_line = processed(line)
          print processed_line
          file_out.write(processed_line + '\n')
        else:
          file_out.write(line)

def processed(line):
  return requests.get('http://us-central1-taxeedee-212808.cloudfunctions.net/cloud?url=%s' % line.strip()).text

if __name__ == '__main__':
  import sys
  photo_processor(sys.argv[1])