//store the URL for the GeoJSON data
const url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';

// Add a tile layer.
let streets = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

// Create a map object.
var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 3,
    layers: [streets]
});



let baseMaps = {
    "streets": streets
};


let earthquake_data = new L.LayerGroup();
let tectonics = new L.LayerGroup();

let overlays = {
    "Earthquakes": earthquake_data,
    "Tectonic Plates": tectonics
};

L.control.layers(baseMaps, overlays).addTo(myMap);

function styleInfo(feature) {
    return {
        color: "red",
        radius: 5, //define a function that uses magnitude to define the radius (if magnitude is 0, do a dot)
        fillColor: "blue" //define a function that uses magnitude to define the color
    }
};

d3.json(url).then(function (data) {
    L.geoJson(data, {
        pointToLayer: function (feature, latlon) {
            return L.circleMarker(latlon);
        },
        style: styleInfo
    }).addTo(earthquake_data);
    earthquake_data.addTo(myMap);

    d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json").then(function (data) {
        L.geoJson(data, {
            color: "purple",
            weight: 3
        }).addTo(tectonics);
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
    console.log(coordinates[0]);
    console.log(coordinates[1]);
    console.log(coordinates[2]);




});

//process steps:
//create a dictionary variable to store lat, lon, and depth based on id
    //data->features->
        //geometry.coordinates[0] = lat
        //geometry.coordinates[1] = lon
        //geometry.coordinates[2] = magnitude
    //data->features->id = unique id for reference