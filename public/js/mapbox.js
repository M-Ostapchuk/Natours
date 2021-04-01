export function displayMap(locations) {
  mapboxgl.accessToken =
    'pk.eyJ1IjoibWF4N29zdCIsImEiOiJja2l0YTdqZWQwbWpsMnZtbTVocnl6cnB5In0.9D-gFiX1QyGq6pjwNHMywQ';
  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
    center: locations[0].coordinates, // starting position [lng, lat]
    interactive: false,
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach((loc) => {
    const marker = new mapboxgl.Marker().setLngLat(loc.coordinates).addTo(map);

    new mapboxgl.Popup({ offset: 15 })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Days: ${loc.day} <br /> ${loc.description}</p>`)
      .addTo(map);

    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 200,
      left: 200,
      right: 200,
    },
  });
}
