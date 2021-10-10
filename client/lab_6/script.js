async function windowActions() {
  const endPoint = 'https://data.princegeorgescountymd.gov/resource/umjn-t2iz.json';

  const request = await fetch(endPoint);
  const arrayName = await request.json();

  const cities = [];

  fetch(endPoint)
    .then((blob) => blob.json())
    .then((data) => cities.push(...data));

  function findMatches(wordToMatch, cities) {
    return cities.filter((place) => {
      const regex = new RegExp(wordToMatch, 'gi');
      return (
        place.name.match(regex)
        || place.zip.match(regex)
        || place.category.match(regex)
      );
    });
  }
  function displayMatches(event) {
    const matchArray = findMatches(event.target.value, cities);
    const html = matchArray
      .map((place) => `
      <li>
      <div class="name">${place.name}</div>
      <div class="category">${place.category}</div>
      <div class="address">${place.address_line_1}</div>
      <div class="city">${place.city}</div>
      <div class="zip">${place.zip}</div>
      </li>
      <br>
          `)
      .join('');
    suggestions.innerHTML = html;
  }
  const searchInput = document.querySelector('.search');

  const suggestions = document.querySelector('.suggestions');

  searchInput.addEventListener('change', displayMatches);
  searchInput.addEventListener('keyup', (evt) => {
    // to hide the suggestions list
    if (!evt.target.value) {
      document.querySelector('.suggestions').innerHTML = '';
    } else {
      displayMatches(evt);
    }
  });
}
window.onload = windowActions;
