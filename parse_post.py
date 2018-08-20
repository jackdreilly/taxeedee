def parse_post(filename):
	with open(filename,'r') as fn:
		url = fn.readline().strip()
		title = fn.readline().strip()
		city = fn.readline().strip()
		country = fn.readline().strip()
		content = fn.read()
		return {
			'url': url,
			'title': title,
			'city': city,
			'country': country,
			'content': content,
		}