// Run when page is loaded to add repos?
$(document).ready(function() {

  fetch('assets/js/candy.json')
    .then(response => response.json())
    .then(json => {
       console.log(json);
       var candygen = new CandyGen(json);
    })

});

