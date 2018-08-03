import os
import sys
from sqlalchemy import Column, ForeignKey, Integer, String, Float
from sqlalchemy import DateTime, func
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, sessionmaker
from sqlalchemy import create_engine
from absl import flags as gflags
from absl import app

FLAGS = gflags.FLAGS

gflags.DEFINE_string('html_file', '', 'Path to html of blog post, required.')
gflags.DEFINE_string('title', '', 'Path to title, required.')
gflags.DEFINE_string('country', '', 'Path to country, optional.')
gflags.DEFINE_string('location', '', 'Path to location, optional.')
gflags.DEFINE_string('lat', '', 'Lat of location.')
gflags.DEFINE_string('lng', '', 'Lat of location.')
gflags.DEFINE_string('description_file', '', 'Location description file.')
gflags.DEFINE_string('command', 'create_db', 'Command to run, either create_db, summarize, server, add_location, or add_post.')
gflags.DEFINE_integer('server_port', 8002, 'Port to run db server on')

 
Base = declarative_base()

class Location(Base):
  __tablename__ = 'locations'
  id = Column(Integer, primary_key=True)  
  title = Column(String(250), nullable=False)
  description = Column(String(1000), nullable=True)
  lat = Column(Float(), nullable=False)
  lng = Column(Float(), nullable=False)
  country = Column(String(250), nullable=True)

class Post(Base):
  __tablename__ = 'posts'
  id = Column(Integer, primary_key=True)
  content = Column(String(), nullable=False)
  country = Column(String(250))
  location = Column(Integer, ForeignKey("locations.id"), nullable=True)
  title = Column(String(500), nullable = False)
  create_date = Column(DateTime, default=func.now())

class Photo(Base):
  __tablename__ = 'photos'
  id = Column(Integer, primary_key=True)
  filename = Column(String(), nullable = False)
  post = Column(String(250), ForeignKey("posts.id"), nullable=True)
  location = Column(String(250), ForeignKey("locations.id"), nullable=True)

class PhotoComment(Base):
  __tablename__ = 'photo_comments'
  id = Column(Integer, primary_key=True) 
  photo = Column(Integer, ForeignKey("photos.id"), nullable=False)
  parent_comment = Column(Integer, ForeignKey("photo_comments.id"), nullable=True)
  author = Column(String(250), nullable = False)
  comment = Column(String(), nullable = False)  
  create_date = Column(DateTime, default=func.now())


def location_geojson(city, lat, lng):
  with open('locations.json', 'r') as fn:
    geo_json = geojson.load(fn)
  geo_json['features'].append(feature)
  with open('locations.json', 'w') as fn:
    geojson.dump(geo_json, fn, indent = 1)

def _create_engine():
  return create_engine('sqlite:///posts.db')

def _create_session(engine):
  return sessionmaker(bind=engine)()
 
def create_tables(engine):
  Base.metadata.create_all(engine)

def get_locations():
  import geojson
  session = _create_session(_create_engine())
  locations = session.query(Location).all()
  def feature(location):
    geometry = geojson.Point((float(location.lat),float(location.lng)))
    properties = {"city": location.title}
    return geojson.Feature(geometry = geometry, properties = properties)
  return geojson.dumps(geojson.FeatureCollection(map(feature,locations)))

def run_server():
  from flask import Flask
  import json
  app = Flask(__name__)

  @app.route('/countries')
  def index():
    return get_locations()
  app.run(debug=True, port = FLAGS.server_port)

def handle_required(value,msg):
  if not value:
    sys.exit(msg)
  return value

def handle_nullable(value):
  return value if value else None

def handle_file_content(filename, msg=None):
  if not msg and not handle_nullable(filename):
    return None
  with open(handle_required(filename, msg), 'r') as fn:
    content = fn.read()
  handle_required(content, "File is empty")
  return content

def main(argv):
  if FLAGS.command == 'server':
    run_server()
    return
  engine = _create_engine()
  if FLAGS.command == 'create_db':
    create_tables(engine)
    return
  session = _create_session(engine)
  if FLAGS.command == 'summarize':
    print '\nPosts:'
    print '\n'.join(map(lambda x: x.title, session.query(Post).all()))
    print '\nLocations:'
    print '\n'.join(map(lambda x: x.title, session.query(Location).all()))
    return
  if FLAGS.command == 'add_location':
    country = handle_nullable(FLAGS.country)
    title = handle_required(FLAGS.location, "--location required")    
    lat = float(handle_required(FLAGS.lat, "--lat required"))
    lng = float(handle_required(FLAGS.lng, "--lng required"))
    description = handle_file_content(FLAGS.description_file)
    location_item = Location(
      country=country,
      title=title,
      lat=lat,
      lng=lng,
      description=description,
      )
    session.add(location_item)
    session.commit()
    return
  content = handle_file_content(FLAGS.html_file, "--html_file required.")
  country = FLAGS.country if FLAGS.country else None
  location = FLAGS.location if FLAGS.location else None
  title = handle_required(FLAGS.title, "--title required")
  post = Post(content = content, country = country, location = location, title = title)
  session.add(post)
  session.commit()

  

if __name__ == '__main__':
  app.run(main)