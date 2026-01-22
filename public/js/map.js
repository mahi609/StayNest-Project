mapboxgl.accessToken = maptoken;

const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/standard",
  projection: "globe",
  zoom: 9,
  center: listing.geometry.coordinates
});

map.addControl(new mapboxgl.NavigationControl());
map.scrollZoom.disable();

new mapboxgl.Marker({ color: 'red', rotation: 45 })
  .setLngLat(listing.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup().setHTML(
      `<h6>${listing.title}</h6><p>${listing.location}</p>`
    )
  )
  .addTo(map);

map.on("style.load", () => {
  map.setFog({});
});
