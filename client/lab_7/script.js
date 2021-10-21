async function dataHandler() {
  const endPoint = 'https://data.princegeorgescountymd.gov/resource/umjn-t2iz.json';

  const request = await fetch(endPoint);
  const arrayName = await request.json();

  const cities = [];

  // Leaflet MAp
  const mymap = L.map('mapid').setView([38.989, -76.93], 11.5);
  L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={AccessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    AccessToken: 'pk.eyJ1IjoiYXNoYWZpcTEiLCJhIjoiY2t1d3h4bjg4NTVtczMxdDR1cTJiMmFueiJ9.5QibvrZ20I5fcUUkKoRw9A'
  }).addTo(mymap);

  fetch(endPoint)
    .then((blob) => blob.json())
    .then((data) => cities.push(...data));

  function findMatches(wordToMatch, cities) {
    return cities.filter((place) => {
      const regex = new RegExp(wordToMatch, 'gi');
      return (place.zip.match(regex));
    });
  }
  // removes markers from the map
  function removeMarkers(mymap){
    mymap.eachLayer(function(layer){
      if(Object.keys(layer.options).length === 0)
      {
        console.log(layer);
        mymap.removeLayer(layer);
      }
    })
  }

  function displayMatches(event) {
    const matchArray = findMatches(event.target.value, cities, mymap);
    // limit the suggestions the user can see
    const limitedList = matchArray.slice(0, 5);
    removeMarkers(mymap);
    limitedList.forEach((place) => {
      const point = place.geocoded_column_1;
      if (!point || !point.coordinates) {
        console.log(place);
        return;
      }
      const latlong = point.coordinates;
      const marker = latlong.reverse();
      L.marker(marker).addTo(mymap);
    });
    // display search suggestions
    const html = limitedList.map((place) => { return `
        <li>
        <div class="result">
        <div class="bold">${place.name}</div>
        <div class="normal">${place.address_line_1}</div></div>
        </li>
        <br>
            `
        }).join('');

    suggestions.innerHTML = html;
  }

  const searchInput = document.querySelector('.search');

  const suggestions = document.querySelector('.suggestions');

  searchInput.addEventListener('change', displayMatches);
  searchInput.addEventListener('keyup', (evt) => {
    // to hide the suggestions list and rmoves markers
    if (!evt.target.value) {
      document.querySelector('.suggestions').innerHTML = '';
      removeMarkers(mymap);
    } else {
      displayMatches(evt);
    }
  });
}
window.onload = dataHandler;
