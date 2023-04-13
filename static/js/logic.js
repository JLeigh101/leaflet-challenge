//store the URL for the GeoJSON data
const url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';

// Add a Leaflet tile layer.
let streets = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

// Create a Leaflet map object.
var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 3,
    layers: [streets]
});


//define basemaps as the streetmap
let baseMaps = {
    "streets": streets
};

//define the earthquake layergroup and tectonic plate layergroups for the map
let earthquake_data = new L.LayerGroup();
let tectonics = new L.LayerGroup();

//define the overlays and link the layergroups to separate overlays
let overlays = {
    "Earthquakes": earthquake_data,
    "Tectonic Plates": tectonics
};

//add a control layer and pass in baseMaps and overlays
L.control.layers(baseMaps, overlays).addTo(myMap);

//this styleInfo function will dictate the stying for all of the earthquake points on the map
function styleInfo(feature) {
    return {
        color: "red",
        radius: chooseRadius(feature.properties.mag), //define a function that uses magnitude to define the radius (if magnitude is 0, do a dot)
        fillColor: chooseColor(feature.geometry.coordinates[2]) //define a function that uses magnitude to define the color
    }
};

//define a function to choose the fillColor of the earthquake based on earthquake depth
function chooseColor(depth) {
    if (depth <= 10) return "red";
    else if (depth > 10 & depth <= 20) return "pink";
    else if (depth > 20 & depth <= 30) return "orange";
    else if (depth > 30 & depth <= 40) return "yellow";
    else if (depth > 40 & depth <= 50) return "blue";
    else return "green";
};

function chooseRadius(magnitude) {
    if (magnitude <= 1) return 5;
    else if (magnitude > 1 & magnitude <= 2) return 10;
    else if (magnitude > 2 & magnitude <= 3) return 20;
    else if (magnitude > 3 & magnitude <= 4) return 30;
    else if (magnitude > 4 & magnitude <= 5) return 40;
};

//
d3.json(url).then(function (data) { //pull the earthquake JSON data with d3
    L.geoJson(data, {
        pointToLayer: function (feature, latlon) {  //feature variable will be unused in this case, latlon is the latlon data for each earthquake
            return L.circleMarker(latlon);
        },
        style: styleInfo
    }).addTo(earthquake_data); // add the earthquake data to the earthquake_data layergroup / overlay
    earthquake_data.addTo(myMap);

    //this function pulls the tectonic plate data and draws a purple line over the plates
    d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json").then(function (data) {
        L.geoJson(data, {
            color: "purple",
            weight: 3
        }).addTo(tectonics); //add the tectonic data to the tectonic layergroup / overlay
        tectonics.addTo(myMap);
    });


});



//collect data with d3
d3.json(url).then(function (data) {
    console.log(data);
    let features = data.features;
    console.log(features);

    let results = features.filter(id => id.id == "nc73872510"); //replace the id string with the argument of the function once created
    let first_result = results[0];
    console.log(first_result);
    let geometry = first_result.geometry;
    console.log(geometry);
    let coordinates = geometry.coordinates;
    console.log(coordinates);
    console.log(coordinates[0]); // longitude
    console.log(coordinates[1]); // latitude
    console.log(coordinates[2]); // depth of earthquake
    let magnitude = first_result.properties.mag;
    console.log(magnitude);
    //define depth variable
    let depth = geometry.coordinates[2];
    console.log(depth);


});

//process steps:
//create a dictionary variable to store lat, lon, and depth based on id
    //data->features->
        //geometry.coordinates[0] = lon
        //geometry.coordinates[1] = lat
        //geometry.coordinates[2] = depth
    //data->features->id = unique id for reference