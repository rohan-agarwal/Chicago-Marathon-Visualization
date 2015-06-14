function updateData(i) {
    // globals
    var w = 400;
    var h = 200;
    var padding = 20;
    var newData = [];
    // Get the data again
    d3.csv("data/timeline.csv", function(error, data) {
        // Select the section we want to apply our changes to
        var aidGraph = d3.select("#aid").transition().duration(750);
        // scale
        var yScale = d3.scale.linear()
            .domain([0, 5])
            .range([h - padding, padding]);
        // add rectangles
        aidGraph.selectAll("rect")
            .attr("y", function(d) {
                return yScale(d["time" + String(i)]);
            })
            .attr("height", function(d) {
                return h - yScale(d["time" + String(i)]) - padding;
            });

        var aid = d3.select("#map").select("svg").selectAll("g")

        var scale = d3.scale.linear()
            .domain([d3.min(data, function(d) {
                return d["time" + String(i)];
            }), d3.max(data, function(d) {
                return d["time" + String(i)];
            })])
            .range([0, 0.8]);

        aid.selectAll("circle")
            .attr("r", 20)
            .attr("fill", "red")
            .attr("opacity", function(d) {
                return scale(d["time" + String(i)]);
            });
    });
}

// Map setup
var map = L.map('map')
    .setView([41.875725, -87.624211], 13);
mapLink =
    '<a href="http://openstreetmap.org">OpenStreetMap</a>';
L.tileLayer(
    'http://api.tiles.mapbox.com/v4/mapbox.streets-basic/{z}/{x}/{y}.png?access_token=pk.eyJ1Ijoicm9oYW5hZ2Fyd2FsIiwiYSI6IjloUk9faHMifQ.uSderee5Yd38xUSMC7t9pw', {
        attribution: '&copy; ' + mapLink + ' Contributors',
        maxZoom: 18,
    }).addTo(map);

// Creating path
var coords = [];

var polyline;

d3.csv("data/path.csv", function(error, data) {

    if (error) return console.warn(error);
    //console.log(data);

    coords = data.map(function(d) {
        return [parseFloat(d.Latitude), parseFloat(d.Longitude)];
    });

    polyline = L.polyline(coords, {
            color: 'blue',
            weight: '2',
            opacity: .7,
        })
        .addTo(map);
});

map._initPathRoot()

// SVG for distant weather
var svg = d3.select("#map").select("svg"),
    g = svg.append("g");

// SVG for aid stations
var svg = d3.select("#map").select("svg"),
    h = svg.append("g");

// Locations of aid stations
var dataset = []
d3.csv("data/timeline.csv", function(error, data) {

    if (error) return console.warn(error);
    //console.log(data);

    data.forEach(function(d) {
        d.LatLng = new L.LatLng(d.Latitude, d.Longitude);
    });

    var aid = h.selectAll(".node")
        .data(data)
        .enter()
        .append("g")
        .attr("class", "node");

    var scale = d3.scale.linear()
        .domain([d3.min(data, function(d) {
            return d.time1;
        }), d3.max(data, function(d) {
            return d.time1;
        })])
        .range([0, 0.8]);

    aid.append("circle")
        .attr("r", 20)
        .attr("fill", "red")
        .attr("opacity", function(d) {
            return scale(d.time1);
        });

    aid.append("image")
        .attr("xlink:href", "http://cdn.mysitemyway.com/etc-mysitemyway/icons/legacy-previews/icons/blue-jelly-icons-signs/090638-blue-jelly-icon-signs-first-aid.png")
        .attr("x", -11)
        .attr("y", -11)
        .attr("width", 24)
        .attr("height", 24);

    map.on("viewreset", update);
    update();

    function update() {
        aid.attr("transform", function(d) {
            return "translate(" +
                map.latLngToLayerPoint(d.LatLng).x + "," +
                map.latLngToLayerPoint(d.LatLng).y + ")";
        })
    }
});

// Distant weather data
d3.json('http://api.openweathermap.org/data/2.5/find?lat=41.881955&lon=-87.785581&cnt=50&APPID=4b46c726f3fde8d6f5f563d3d1c6f6e9&units=imperial', function(error, json) {

    if (error) return console.warn(error);
    //console.log(json);

    //selecting list of city data
    var cit = json.list;

    cit.forEach(function(d) {
        d.LatLng = new L.LatLng(d.coord.lat, d.coord.lon);
    });

    var wtr = g.selectAll(".node")
        .data(cit)
        .enter()
        .append("g")
        .attr("class", "node");

    wtr.append("image")
        .attr("xlink:href", function(d) {
            return "http://openweathermap.org/img/w/" + d.weather[0].icon + ".png";
        })
        .attr("x", -8)
        .attr("y", -8)
        .attr("width", 48)
        .attr("height", 48);

    var chi = cit[31].main.temp;

    wtr.append("text")
        .attr("font-family", "sans-serif")
        .attr("font-size", "12px")
        .attr("font-weight", "bold")
        .attr("fill", function(d) {
            // Hardcoded array location for Chicago
            if (d.main.temp == chi)
                return "black";
            if (d.main.temp < chi)
                return "blue";
            if (d.main.temp > chi)
                return "red";
        })
        .text(function(d) {
            return d.main.temp + "F";
        })


    map.on("viewreset", update);
    update();

    function update() {
        wtr.attr("transform", function(d) {
            return "translate(" +
                map.latLngToLayerPoint(d.LatLng).x + "," +
                map.latLngToLayerPoint(d.LatLng).y + ")";
        })
    }
});