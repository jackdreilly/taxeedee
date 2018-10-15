from taxeedee_service.taxeedee_pb2 import Content
from more_itertools import peekable

SECTION_DELIM = '### '
URL_DELIM = ' @@@ '

def parse_post(filename):
	return parse_structured_post(filename)

def parse_url(line):
	safe_url = None
	url = line
	if len(url.split(URL_DELIM)) > 1:
			url, safe_url = map(lambda s: s.strip(), url.split(URL_DELIM))
	return url, safe_url


def parse_unstructured_post(filename):
	with open(filename,'r') as fn:
		url, safe_url = parse_url(fn.readline().strip())
		title = fn.readline().strip()
		city = fn.readline().strip()
		country = fn.readline().strip()
		content = fn.read()
		return {
			'url': url,
			'safe_url': safe_url,
			'title': title,
			'city': city,
			'country': country,
			'structured_content': content,
		}

def parse_structured_post(filename):
	unstructured_parse = parse_unstructured_post(filename)
	content = Content()
	ilines = peekable(iter(unstructured_parse['structured_content'].split('\n')))	
	unstructured_parse['structured_content'] = content

	def parse_node():
		while True:
			line = ilines.next().strip()
			if line:
				break
		line = line.strip()
		splits = line.split(SECTION_DELIM)
		if len(splits) is not 2:
			raise Exception('Unexpected line ' + line + ' of length ' + str(len(line)))
		header = splits[1]
		node = content.nodes.add()
		lines = []
		while True:
			try:
				if SECTION_DELIM in ilines.peek().strip():
					break
				line = ilines.next().strip()
				if len(line) == 0:
					continue
				lines.append(line)
			except StopIteration:
				break
		if header == 'paragraph':
			node.paragraph.text = '\n'.join(lines)
		elif header == 'photo':
			url, title = lines
			url, safe_url = parse_url(url)
			node.photo.url = url.strip()
			node.photo.title = title
			if safe_url:
				node.photo.safe_url = safe_url
		elif header == 'video':
			node.video.url = lines[0].strip()
		else:
			raise Exception('Unsupported header: ' + header)

	while True:
		try:
			parse_node()
		except StopIteration:
			break
	return unstructured_parse
