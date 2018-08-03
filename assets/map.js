var map;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 0, lng: 0 },
        zoom: 1
    });
    map.data.loadGeoJson("http://localhost:8002/countries")
    map.data.addListener('click', function(event) {
        const infoWindow = new google.maps.InfoWindow({
    		content: event.feature.getProperty("city"),
  		});
  		const position = event.feature.getGeometry().get();
  		infoWindow.setPosition(position);
  		infoWindow.setOptions({pixelOffset: new google.maps.Size(0,-30)});
  		infoWindow.open(map);
    });
}