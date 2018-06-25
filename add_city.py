import geojson

def add_city(city, lat, lng):
	geometry = geojson.Point((float(lat),float(lng)))
	properties = {"city": city}
	feature = geojson.Feature(geometry = geometry, properties = properties)
	with open('locations.json', 'r') as fn:
		geo_json = geojson.load(fn)
	geo_json['features'].append(feature)
	with open('locations.json', 'w') as fn:
		geojson.dump(geo_json, fn, indent = 1)

if __name__ == '__main__':
	import sys
	add_city(*sys.argv[1:])
