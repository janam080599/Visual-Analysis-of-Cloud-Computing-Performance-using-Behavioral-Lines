// set the dimensions and margins of the graph
var margin = {top: 60, right: 230, bottom: 50, left: 70},
    width = 1200 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;


var inst_array=[];
document.addEventListener('DOMContentLoaded', function () {
// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          `translate(${margin.left}, ${margin.top})`);

d3.csv("data/machine_trimmed.csv").then( function(vals) {

    console.log(vals);
    // vals.forEach((item, i) => {
    //     console.log(item);
    // });
});

d3.csv("../data/bins (1).csv").then( function(data1) {

    data1.forEach(function(d) {
            inst_array.push(d.inst_id);
    })


});

// Parse the Data
d3.csv("data/inst_groups.csv").then( function(data) {

    // console.log(data);


    var sumstat = d3.group(data, d => d.inst_id);

    console.log(sumstat);


var xExtent = d3.extent(data, d => d.start_time);

    console.log(xExtent);
    xScale = d3.scaleLinear().domain(xExtent).range([margin.left, 1200])

//scale yAxis
var yMax=d3.max(data,d=>d.cpu_usage)
// console.log(yMax+ "Y_Max");
yScale = d3.scaleLinear().domain([0, yMax]).range([600-margin.bottom, 0])

xAxis = d3.axisBottom()
    .scale(xScale)

d3.select("svg")
    .append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0,580)")
    .call(xAxis)


//yAxis and yAxis label
yAxis = d3.axisLeft()
    .scale(yScale)
    .ticks(10)

d3.select('svg')
    .append("g")
    .attr("class", "axis")
    .attr("transform", `translate(${margin.left},20)`) //use variable in translate
    .call(yAxis)

    // console.log(sumstat[0][key][group_bin]);

    // var groupName = sumstat.map(d => d.key["group_bin"])
    // var color = d3.scaleOrdinal().domain(groupName).range(colorbrewer.Set2[6])

//  d3.select("svg")
//     // .selectAll(".line")
//     // .append("g")
//     .enter()
//     .append("path")
//     .attr("class", "line")
//     .data(sumstat)
//     .attr("d", function (d) {
//         console.log(d[1][0]);
//         return d3.line()
//             .x(d => xScale(d[1][0].start_time))
//             .y(d => yScale(d[1][0].cpu_usage)).curve(d3.curveCardinal)
//             (d.values)
//     })
//     .attr("fill", "none")
//     .attr("stroke", "red")
//     .attr("stroke-width", 2)
    // console.log(sumstat.keys());

    var g = svg.append("g");

    var lineAndDots = g.append("g")
    .attr("class", "line-and-dots");


    var set_color = {A:"red",B:"green",C:"blue",D:"yellow"}

    for(var k=0; k <200; k++){

        temp_data=data.filter(function(d){ return d.inst_id == inst_array[k]});
        // var color=set_color[""]
        var inst_data=temp_data;
        console.log(k + " . ");
        // console.log(inst_data);

        lineAndDots.append("path")
        .datum(inst_data)
        .attr("fill", "none")
        .attr("stroke", function(d){ console.log(d[0].group_bin); return set_color[d[0].group_bin] })
        .attr("stroke-width", 1)
        .attr("d", d3.line()
            .x(function(d) {console.log(d.start_time); return xScale(+d.start_time) })
            .y(function(d) { console.log(d.cpu_usage);return yScale(+d.cpu_usage)})
            )

        lineAndDots.selectAll("line-circle")
    		.data(inst_data)
    	.enter().append("circle")
        .attr("class", "data-circle")
        .attr("fill", function(d){return set_color[d.group_bin] })
        .attr("r", 3)
        .attr("cx", function(d) { return xScale(+d.start_time); })
        .attr("cy", function(d) { return yScale(+d.cpu_usage); });

    }

//append circle
// d3.select("svg")
//     .selectAll("circle")
//     .append("g")
//     .data(data)
//     .enter()
//     .append("circle")
//     .attr("r", 1)
//     .attr("cx", d => xScale(d.start_time))
//     .attr("cy", d => yScale(d.cpu_usage))
//     .style("fill", "blue")

});
});
