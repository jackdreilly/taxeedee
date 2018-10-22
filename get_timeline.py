import csv

def get_timeline():
  with open('locations/locations.csv', 'r') as fn:
    lines = list(csv.reader(fn))
  def process(line):
    city, country, date, lat, lng = line
    return {
      'city': city,
      'country': country,
      'date': date,
      'lat': float(lat),
      'lng': float(lng),
    }
  return [process(line) for line in lines]