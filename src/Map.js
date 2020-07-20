import React from 'react';
import {Map, Polyline, Marker, InfoWindow, GoogleApiWrapper} from 'google-maps-react';
import './Map.css';
import JsonMap from './JsonMap';
import Interpolate from './Color';

function PostLocation(post) {
  return {
    lat: post.location.position.lat,
    lng: post.location.position.lng,    
  }
}

function PostViewport(post, google) {
  const bounds = new google.maps.LatLngBounds();
  const center = PostLocation(post);
  const size = 0.1;
  center.lat = center.lat - 1 * size;
  center.lng = center.lng - 1 * size;
  bounds.extend(center);
  center.lat = center.lat + 2 * size;
  center.lng = center.lng + 2 * size;
  bounds.extend(center);
  return bounds;
}

function Refactor(factor) {
  const expanded= (factor * 3) % 1;
  return 2 * Math.abs(0.5 - expanded);
}

function TravelLine(start, end, key, google, factor) {
  const lineSymbol = {
          path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW
  };
  const path = [start, end];
  const color = Interpolate(Refactor(factor));
  return <Polyline
    key={key}
    path={path}
    geodesic={true}
    clickable={false}
    icons={[{icon: lineSymbol, offset: '100%'}]}
    strokeColor={color}
    strokeOpacity={0.75}
    strokeWeight={3}
  />  
}
 
export class PostMap extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      showingInfoWindow: false,
    };    
  }

  onMapClicked = (props) => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
      })
    }
  }

  activePost() {
    if (this.props.active) {
      for (let i in this.props.posts) {
        const post = this.props.posts[i];
        if (post.id === this.props.active) {
          return post;
        }
      }
    }
    return undefined;
  }

  componentDidUpdate(prevProps) {
    if (prevProps.active !== this.props.active) {
      this.setState({showingInfoWindow: true});
    }
  }

  markers() {
    const positionMap = new JsonMap();
    const onClick = this.props.onClick;
    return this.props.posts.map(post => {
      const position = PostLocation(post);
      const visible = !positionMap.contains(position);
      positionMap.put(position, true);
      return  <Marker
                      position={position}
                      visible={visible}
                      icon={undefined}
                      title={post.location.city}
                      name={post.title}
                      key={post.id}
                      onClick={(props, marker, e) => {
                        this.setState({showingInfoWindow: true});
                        onClick(post.id);
                      }}
                      />;
    });
  }

  us() {
    if (!this.props.timeline) {
      return undefined;
    }
    const location = this.props.timeline[this.props.timeline.length - 1];
    const position = {
      lat: location.lat,
      lng: location.lng,
    };
    return <Marker
                      position={position}
                      icon={'/us.png'}
                      key={'us'}
                      />;
  }

  infoWindow() {
    const post = this.activePost();
    if (!post) {
      return undefined;
    }
    return <InfoWindow
          position={PostLocation(post)}
          visible={this.state.showingInfoWindow}
          maxWidth="200"
          >
            <div className="info-window">
              <h1><a 
                href={`/post/${post.id}`}>
                Click to read "{post.title}"
                </a>
              </h1>
            </div>
        </InfoWindow>;
  }

  travelLines() {
    if (!this.props.timeline) {
      return undefined;
    }
    const lines = [];
    for (let i = 0; i < this.props.timeline.length - 1; ++i) {
      const start = this.props.timeline[i];
      const end = this.props.timeline[i+1];
      const factor = i / (this.props.timeline.length - 1);
      lines.push(TravelLine(start, end, JSON.stringify(start), this.props.google, factor));
    }
    return lines;
  }

  bounds() {
    const post = this.activePost();
    if (!post) {
      return undefined;
    }
    const bounds = PostViewport(post, this.props.google);
    return bounds;
  }

  render() {
    return (
      <Map 
        google={this.props.google} 
        zoom={2}
        initialCenter={{lat: 30, lng: 30}}
        bounds={this.bounds()}
        onClick={this.onMapClicked}
      >
        {this.markers()}
        {this.travelLines()}
        {this.infoWindow()}
        {this.us()}
      </Map>
    );
  }
}
 
export default GoogleApiWrapper({
  apiKey: ('AIzaSyCG8gjOkOPOU4zGLypA0CKM1-jgq3c8FVs')
})(PostMap)