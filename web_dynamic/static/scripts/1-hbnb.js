// Keeps track of user-selected Amenities filters

const selectedAmenities = [];

$('DIV.amenities :checkbox').change(function(){
//$('DIV.amenities :checkbox').on('click', function(event){
//  event.stopPropagation();
//  event.stopImmediatePropagation();
  if (this.checked) {
    selectedAmenities.push($(this).attr('data-name'));
  } else {
    index = selectedAmenities.indexOf($(this).attr('data-name'));
    selectedAmenities.splice(index, 1);
  }

  // Truncate text if it's too long
  let output = selectedAmenities.sort().join(', ');
  if (output.length > 26) {
    output = output.substring(0, 19).concat('...');
  }

  // Display list of selected Amenities
  $('DIV.amenities h4').text(output);
});
