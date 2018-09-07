from taxeedee_service.taxeedee_pb2 import Content
from more_itertools import peekable

def parse_post(filename):
	return parse_structured_post(filename)

def parse_unstructured_post(filename):
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
			'structured_content': content,
		}

def parse_structured_post(filename):
	unstructured_parse = parse_unstructured_post(filename)
	content = Content()
	ilines = peekable(iter(unstructured_parse['structured_content'].split('\n')))	
	unstructured_parse['structured_content'] = content

	def parse_node():
		while True:
			line = ilines.next()
			if line:
				break
		line = line.strip()
		splits = line.split('### ')
		if len(splits) is not 2:
			raise Exception('Unexpected line ' + line)
		header = splits[1]
		node = content.nodes.add()
		lines = []
		while True:
			try:
				if '### ' in ilines.peek():
					break
				line = ilines.next()
				if len(line) == 0:
					continue
				lines.append(line)
			except StopIteration:
				break
		if header == 'paragraph':
			node.paragraph.text = '\n'.join(lines)
		elif header == 'photo':
			url, title = lines
			node.photo.url = url.strip()
			node.photo.title = title
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
