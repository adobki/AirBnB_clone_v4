// Reports API status and keeps track of user-selected Amenities filters

// Set headers and data type for all HTTP requests
$.ajaxSetup({
    headers: {'Content-Type': 'application/json'},
    dataType: 'json'
});

// Fetch list of Places from API
const places = $('.container .places');
const url = 'http://localhost:5001/api/v1/places_search/';
$.post(url, JSON.stringify({}), function(data){

  // Sort keys in Places dictionary by name
  sortedKeys = []
  data.forEach((place, index) => {
    sortedKeys.push([place.name, index]);
    sortedKeys.sort();
  });

  // Prepare HTML code for each place and display them sorted by name
  sortedKeys.forEach((sortedPlace) => {
      place = data[sortedPlace[1]]

      // Set plural form of verbs where applicable
      let plural_guest = '';
      if (place.max_guest != 1) {
        plural_guest = 's';
      }
      let plural_room = '';
      if (place.number_rooms != 1) {
        plural_room = 's';
      }
      let plural_baths = '';
      if (place.number_bathrooms != 1) {
        plural_baths = 's';
      }

      // Prepare HTML code for each place
      place = `	<article>
          <div class="title_box">
            <h2>${place.name}</h2>
            <div class="price_by_night">$${place.price_by_night}</div>
          </div>
          <div class="information">
            <div class="max_guest">${place.max_guest} Guest${plural_guest}</div>
                <div class="number_rooms">${place.number_rooms} Bedroom${plural_room}</div>
                <div class="number_bathrooms">${place.number_bathrooms} Bathroom${plural_baths}</div>
          </div>
          <div class="user">
          </div>
          <div class="description">
            ${place.description}
          </div>
        </article>`;

      // Display current place on the webpage
      places.html(places.html() + place);
  });
});

// Function to check and report API availability status
function checkStatus() {
  $('header #api_status').removeClass('available');
  $.get('http://localhost:5001/api/v1/status', function(api){
    if (api.status === 'OK') {
      $('header #api_status').addClass('available');
    }
  });
};

// Check and report API availability status
checkStatus();

// Function to update selected Amenities filters when user clicks a checkbox
const selectedAmenities = [];
$('DIV.amenities :checkbox').change(function(){
  if (this.checked) {
    selectedAmenities.push($(this).attr('data-name'));
  } else {
    index = selectedAmenities.indexOf($(this).attr('data-name'));
    selectedAmenities.splice(index, 1);
  }

  // Truncate text if it's too long
  let output = selectedAmenities.sort().join(', ');
  if (output.length > 26) {
    output = output.substring(0, 23).concat('...');
  }

  // Display list of selected Amenities
  $('DIV.amenities h4').text(output);

  // Check and report current API status
  checkStatus();
});
