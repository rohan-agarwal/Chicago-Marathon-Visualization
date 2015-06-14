///////////////////////////////////////////////////////////////////////////////////////
/// AID
///////////////////////////////////////////////////////////////////////////////////////
d3.csv("data/timeline.csv", function(tm) {

    console.log(tm);

    // globals
    var w = 350;
    var h = 200;
    var padding = 20;

    // add to DOM
    var aidGraph = d3.select("#aid")
        .append("svg")
        .attr("width", w)
        .attr("height", h)

    // scale
    var xScale = d3.scale.linear()
        .domain([0, d3.max(tm, function(d, i) {
            return i;
        })])
        .range([padding * 2, w - padding * 2]);

    var yScale = d3.scale.linear()
        .domain([0, 5])
        .range([h - padding, padding]);

    // add rectangles
    aidGraph.selectAll("rect")
        .data(tm)
        .enter()
        .append("rect")
        .attr("x", function(d, i) {
            return xScale(i);
        })
        .attr("y", function(d) {
            return yScale(d.time1);
        })
        .attr("width", w / tm.length - 5)
        .attr("height", function(d) {
            return h - yScale(d.time1) - padding;
        })
        .attr("fill", "teal")

    // axis
    var yAxis = d3.svg.axis()
        .scale(yScale)
        .ticks(4)
        .orient("left");

    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom")
        .ticks(20)
        .tickFormat(function(d, i) {
            return String(i+1);
        })

    aidGraph.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + (h - padding) + ")")
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "start");

    aidGraph.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" + 1.5 * padding + ",0)")
        .call(yAxis);
});

///////////////////////////////////////////////////////////////////////////////////////
/// AID
///////////////////////////////////////////////////////////////////////////////////////

d3.json('http://api.openweathermap.org/data/2.5/forecast?q=Chicago,il&APPID=4b46c726f3fde8d6f5f563d3d1c6f6e9&units=imperial', function(error, json) {

    if (error) return console.warn(error);
    //console.log(json);

    var dta = json.list;
    var w = 350;
    var h = 140;
    var padding = 20;

    var dummy = [1];



    var xScale = d3.scale.linear()
        .domain([0, d3.max(dta, function(d, i) {
            return i;
        })])
        .range([2 * padding, w - 2 * padding]);

    var yScale = d3.scale.linear()
        .domain([0, d3.max(dta, function(d) {
            return d.main.temp;
        })])
        .range([h - padding, padding]);

    var tempGraph = d3.select("#temperature")
        .append("svg")
        .attr("width", w)
        .attr("height", h);

    tempGraph.selectAll("circle")
        .data(dta)
        .enter()
        .append("circle")
        .attr("cx", function(d, i) {
            return xScale(i);
        })
        .attr("cy", function(d) {
            return yScale(d.main.temp);
        })
        .attr("r", 2)
        .attr("fill", "teal");

    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left")
        .ticks(5);

    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom")
        .ticks(2)
        .tickFormat(function(d) {
            return dta[d].dt_txt;
        });

    tempGraph.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + (h - padding) + ")")
        .call(xAxis);

    tempGraph.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" + 1.5 * padding + ",0)")
        .call(yAxis);



    var yScale2 = d3.scale.linear()
        .domain([0, d3.max(dta, function(d) {
            return d.wind.speed;
        })])
        .range([h - padding, padding]);

    ///////////////////////////////////////////////////////////////////////////////////////
    /// AID
    ///////////////////////////////////////////////////////////////////////////////////////

    var windGraph = d3.select("#wind")
        .append("svg")
        .attr("width", w)
        .attr("height", h);

    windGraph.selectAll("circle")
        .data(dta)
        .enter()
        .append("circle")
        .attr("cx", function(d, i) {
            return xScale(i);
        })
        .attr("cy", function(d) {
            return yScale2(d.wind.speed);
        })
        .attr("r", 2)
        .attr("fill", "teal");

    var yAxis2 = d3.svg.axis()
        .scale(yScale2)
        .orient("left")
        .ticks(5);

    windGraph.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" + 1.5 * padding + ",0)")
        .call(yAxis);

    windGraph.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + (h - padding) + ")")
        .call(xAxis);
});