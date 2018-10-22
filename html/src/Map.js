import React from 'react';
import {Map, Polyline, Marker, GoogleApiWrapper} from 'google-maps-react';
import './Map.css';
 
function PostMap(props) {

    const lineSymbol = {
          path: props.google.maps.SymbolPath.FORWARD_CLOSED_ARROW
    };
    const posts = props.posts;
    const defaultCenter = {lat: 30, lng: 30,};
    const bounds = new props.google.maps.LatLngBounds();
    for (var i in posts) {
      const post = posts[i];
      if (post.id === props.active) {

        const center = {
              lat: post.location.position.lat, 
              lng: post.location.position.lng,
            };
        const size = 0.1;
        bounds.extend(center);
        center.lat = center.lat - 1 * size;
        bounds.extend(center);
        center.lat = center.lat + 2 * size;
        bounds.extend(center);
        center.lng = center.lng - 1 * size;
        bounds.extend(center);
        center.lng = center.lng + 2 * size;
        
        break;
      }
    }
    return (
      <Map google={props.google} zoom={3} initialCenter={defaultCenter} bounds={bounds}>
        {
          posts.map((post, i) => {
            const end = {
              lat: post.location.position.lat, 
              lng: post.location.position.lng,
            };
            if (i < (posts.length - 1)) {
              const next_post = posts[i+1];
              const start = {
                lat: next_post.location.position.lat, 
                lng: next_post.location.position.lng,
              };
              if (start.lat === end.lat && start.lng === end.lng) {
                return undefined;
              } 
            }
            let icon = post.id === props.active ? 'http://maps.google.com/mapfiles/ms/icons/blue.png' : undefined;
            icon = undefined;
            return <Marker
                      position={end}
                      icon={icon}
                      title={post.location.city}
                      name={post.title}
                      key={post.id}
                      onClick={event => props.onClick(post.id)}
                      />;})
        }
        {
          posts.map((post, i) => {
            if (i === (posts.length -1)) {
              return undefined;
            }
            const end = {
              lat: post.location.position.lat, 
              lng: post.location.position.lng,
            };
            const next_post = posts[i+1];
            const start = {
              lat: next_post.location.position.lat, 
              lng: next_post.location.position.lng,
            };
            if (start.lat === end.lat && start.lng === end.lng) {
              return undefined;
            }
            
            const path = [start, end];
            const id = post.id;
            return <Polyline
              key={id}
              path={path}
              geodesic={true}
              clickable={false}
              icons={[{icon: lineSymbol, offset: '100%'}]}
              strokeColor="#333333"
              strokeOpacity={0.5}
              strokeWeight={2}
            />
          })
        }
      </Map>
    );
}
 
export default GoogleApiWrapper({
  apiKey: ('AIzaSyCbd76u4PHOI8tnBN5_lgthIO-bbQ-c-TQ')
})(PostMap)