var map;

var FRESH_FOOD_API_KEY = 'AIzaSyDsjuLdIGto0uSxxpQYqfRnj8yS5RBVbF8';
var atlCenter = {lat: 33.757053, lng: -84.410121,title: 'Atlanta, GA' }; 
var placesList = []; 

// InfoWindow is made global since we will be using only 1 info window
// and open it at differnt positions of the clicked marker - 
// see 'best practices' quote at https://developers.google.com/maps/documentation/javascript/infowindows  a third of the way thru on the page 

function initMap() {
    
    console.log('Creating map, marker and initwindow');
    map = new google.maps.Map(document.getElementById('map'), {
        center: atlCenter,
        zoom:12
    });

    var atlInfoWindowContent = '<p> Welcome to Atlanta </p>';
 
    infowindow = new google.maps.InfoWindow({content: atlInfoWindowContent});
    var atlMarker = new google.maps.Marker({position:atlCenter, map:map, title: 'Atlanta, GA'});
    atlMarker.addListener('click', function (){ 
        infowindow.open(map, atlMarker); 
    } );
    

   populateMap();

    // console.log(`initMap rececived ${placesList['values'].length} values from populateMap`);
} 


function populateMap() {

    // console.log(`*** Start populate Map : Places list has ${placesList['values'].length} entries`);

    // get Json data from Yamini's file via AJAX requests
    getJSONfromURL();

    // convert lat long to float values (for easier plotting)
    convertLatLngToFloat();

    // populat map with markers
    // Do this for the 1st 10 only (file has 377 entries)
    
    // use following line to display all markers
    // hint: sub 1 from len since first element of array 
    // is the labels of the spreadsheet
    var nMarkersToDisplay = placesList['values'].length -1; 

    // use follow to display just a few elements (for debugging/demo)
    //var nMarkersToDisplay = 10; 

    var placeArrayValueLen = placesList['values'][0].length;
    for (var i = 1; i <= nMarkersToDisplay; i++) {
        var placeDesc = 'hello\n'+ 
        placesList['values'][i][placeArrayValueLen-2] +', '
        placesList['values'][i][placeArrayValueLen-1]; 
        infowindow = new google.maps.InfoWindow({content: placeDesc});

        var placeMarkerPos = {
            lat: placesList['values'][i][placeArrayValueLen-2], 
            lng: placesList['values'][i][placeArrayValueLen-1]
        };
        var placeMarker = new google.maps.Marker({
            position:placeMarkerPos, 
            map:map, 
            title: placesList['values'][i][0]
        });
        
        placeMarker.addListener('click', function (){ 
            infowindow.close(); 
            infowindow.setPosition({
                lat: placeMarker.getPosition().lat,
                lng: placeMarker.getPosition().lng
            }); 
            infowindow.open(map, placeMarker); 

            console.log('Opening infowindow at '+ placeMarkerPos.lat+', '+placeMarkerPos.lng);
        } );
    
    }

    console.log(`*** Ending populate Map : Places list has ${placesList['values'].length} entries`);
    
}

function convertLatLngToFloat(){
//    var printLen = 10; 
    var i = 0; 
    var placeArrayValueLen = placesList['values'][0].length; 
    // console.log(`convertLatLngToFloat: lenght of values array is ${placeArrayValueLen}`);

    for (i = 1; i < placesList['values'].length; i++){
        // convert latitude to float (for plotting)
        // console.log(`convertLatLngToFloat: converting value no: ${placeArrayValueLen-2} for index ${i}`);
        placesList['values'][i][placeArrayValueLen-2] = parseFloat(placesList['values'][i][placeArrayValueLen-2]);
        
        // convert longitude to float (for plotting)
        placesList['values'][i][placeArrayValueLen-1] = parseFloat(placesList['values'][i][placeArrayValueLen-1]);
    
        // console.log (`value ${i} is ${ placesList['values'][i]  } \n\n`);
    
    }
}

function getJSONfromURL() {
    
    // console.log('Start: getJSONfromURL')
    var http = new XMLHttpRequest();
    var url = 'https://sheets.googleapis.com/v4/spreadsheets/1GptBaQgTj1eHvy2xDbZLMSL9_T1f0JRSRPXvCCiP29c/values/Combined?key=AIzaSyDTsO-I9sKJzTabbfpNfL0KIVIyUMEmRNI';

    
    http.onreadystatechange = function(){
        
        if (this.readyState==4 && this.status == 200){
            
            console.log(`getJsonfromURL: http: readystate = ${this.readyState}, http stats: ${this.status}`);
            
            placesList = JSON.parse(this.responseText);
            console.log(`getJSONfromURL: received - ${placesList['values'].length}`);
        }
        
    };

    // console.log(`getJSONfromURL: sending http`); 
    http.open("GET", url, false);
    http.send();
    
}
