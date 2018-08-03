#!python
from jinja2 import FileSystemLoader, Environment
from absl import app
from absl import flags as gflags
import os
import SimpleHTTPServer
import SocketServer
import shutil

FLAGS = gflags.FLAGS

gflags.DEFINE_string('build_dir', 'build', 'Path to output html')
gflags.DEFINE_string('template_dir', 'templates', 'Path to templates')
gflags.DEFINE_string('build_filenames_file', 'build.filenames.txt', 'List of filenames to build html for.')
gflags.DEFINE_string('assets_dir', './assets', 'Path to assets to be symlinked')
gflags.DEFINE_string('locations_file', './build_scripts/map/locations.json', 'Path to location data to be symlinked')
gflags.DEFINE_integer('port', 8000, 'Port for http server')

def render_from_template(directory, template_name, **kwargs):
    loader = FileSystemLoader(directory)
    env = Environment(loader=loader)
    template = env.get_template(template_name)
    return template.render(**kwargs)

def main(argv):
	shutil.rmtree(FLAGS.build_dir)
	shutil.copytree(FLAGS.assets_dir, os.path.join(FLAGS.build_dir, 'assets'))
	shutil.copyfile(FLAGS.locations_file, os.path.join(FLAGS.build_dir, 'locations.json'))
	with open(FLAGS.build_filenames_file, 'r') as fn:
		for filename in fn:
			filename = filename.strip()
			input_filename = filename
			output_filename = os.path.join(FLAGS.build_dir, filename)
			rendered = render_from_template(FLAGS.template_dir, input_filename)
			with open(output_filename, 'w') as w_fn:
				w_fn.write(rendered.encode('utf-8'))
	os.chdir(FLAGS.build_dir)
	PORT = FLAGS.port
	Handler = SimpleHTTPServer.SimpleHTTPRequestHandler
	httpd = SocketServer.TCPServer(('', PORT), Handler)
	print "serving at port", PORT
	httpd.serve_forever()

if __name__ == '__main__':
	app.run(main)