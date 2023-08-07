// Reports API status and keeps track of user-selected Amenities filters

// Set headers and data type for all HTTP requests
$.ajaxSetup({
    headers: {'Content-Type': 'application/json'},
    dataType: 'json'
});

// Fetch list of Places from API
const places = $('.container .places');
const url = 'http://localhost:5001/api/v1/places_search/';
function getPlaces(data={}) {
    $.post(url, JSON.stringify(data), function(data){

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
};

// Get and display list of places
getPlaces();

// Function to check and report API availability status
function checkStatus() {
  $('header #api_status').removeClass('available');
  var ret = $.get('http://localhost:5001/api/v1/status', function(api){
    if (api.status === 'OK') {
      $('header #api_status').addClass('available');
      console.log('\tAPI: ' + $('header #api_status').hasClass('available'));
    }
  });
};

// Check and report API availability status
checkStatus();

// Function to update selected Amenities filters when user clicks a checkbox
const selectedAmenities = [];
const selectedAmenitiesID = [];
$('DIV.amenities :checkbox').change(function(){
  if (this.checked) {
    selectedAmenities.push($(this).attr('data-name'));
    selectedAmenitiesID.push($(this).attr('data-id'));
  } else {
    index = selectedAmenities.indexOf($(this).attr('data-name'));
    selectedAmenities.splice(index, 1);
    index = selectedAmenitiesID.indexOf($(this).attr('data-id'));
    selectedAmenitiesID.splice(index, 1);
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

// Function to update selected locations filters when user clicks a checkbox
const states = $('DIV.locations h2 :checkbox');
const cities = $('DIV.locations LI.city :checkbox');
const selectedStates = [], selectedCities = [];
const selectedStatesID = [], selectedCitiesID = [];
function filterLocations(){
  selectedStates.length = selectedCities.length = 0;
  selectedStatesID.length = selectedCitiesID.length = 0;
  states.each(function(){
    if(this.checked){
      selectedStates.push($(this).attr('data-name'));
      selectedStatesID.push($(this).attr('data-id'));
    }
  });
  cities.each(function(){
    if(this.checked){
      selectedCities.push($(this).attr('data-name'));
      selectedCitiesID.push($(this).attr('data-id'));
    }
  });

  // Create selected locations string
  let output = '';
  if(selectedStates.length){
    $('DIV.locations h3').text('States');
    output = selectedStates.sort().join(', ');
  } else {
    $('DIV.locations h3').text('Cities');
    output = selectedCities.sort().join(', ');
  }

  // Truncate string if it's too long
  if (output.length > 26) {
    output = output.substring(0, 23).concat('...');
  }

  // Display list of selected Amenities
  $('DIV.locations h4').text(output);

  // Check and report current API status
  checkStatus();
};

// Function to update selected cities when user clicks a city's checkbox
$(cities).change(function(){
  // Uncheck parent state when a city in state is unchecked
  const state = $(this).attr('id')
  if (this.checked == false){
    $(states).each(function(){
      if($(this).attr('data-name') == state){
        $(this).prop("checked", false);
        // end .each method loop
        return false;
      }
    });
  }

  filterLocations();
});

// Function to [un]check all cities in a state when user clicks its checkbox
$(states).change(function(){
  let check = false;
  if (this.checked){
    check = true;
  }

  $('DIV.locations #' + $(this).attr('data-name')).each(function(){
    $(this).prop("checked", check);
  });

  filterLocations();
});

// Filter Places when user clicks Search button
$('.filters button').click(function() {
  // Check API status
  checkStatus();

  // Remove all currently loaded places from webpage
  places.html('');

  // Request Places from API by user selected amenities
  const data = {'amenities' : selectedAmenitiesID,
                'states' : selectedStatesID,
                'cities' : selectedCitiesID};
  getPlaces(data);
});
