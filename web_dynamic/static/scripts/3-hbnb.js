// Reports API status and keeps track of user-selected Amenities filters

// Function to check and report API availability status
$(function() {
  const url = 'http://localhost:5001/api/v1/places_search/';
  const header = '{"Content-Type": "application/json"}';
//  const header = {'Content-Type': 'application/json'};
//  const header = {};
  $.post(url, header, function(data){
//    if (api.status === 'OK') {
//      $('header #api_status').addClass('available');
//    }
    console.log(data);
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
