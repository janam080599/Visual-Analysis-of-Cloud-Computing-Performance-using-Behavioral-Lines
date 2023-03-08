// set the dimensions and margins of the graph
const margin = {top: 150, right: 30, bottom: 30, left: 260},
    width = 1000 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

document.addEventListener('DOMContentLoaded', function () {
// append the svg object to the body of the page
const svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

//Read the data
d3.csv("../data/dataLG.csv").then( function(data) {

  // group the data: I want to draw one line per group
  const sumstat = d3.group(data, d => d.name); // nest function allows to group the calculation per level of a factor

  // Add X axis --> it is a date format
  const x = d3.scaleLinear()
    .domain([1880,2015])
    .range([ 0, width ]);
  svg.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x).ticks(5));

  // Add Y axis
  const y = d3.scaleLinear()
    .domain([0, d3.max(data, function(d) { return +d.n; })])
    .range([ height, 0 ]);
  svg.append("g")
    .call(d3.axisLeft(y));

  for(var i = 0; i < 8;i++){
  svg.append('line')
    .style("stroke", "black")
    .style("stroke-width", 1)
    .attr("x1", 135*i)
    .attr("y1", 0)
    .attr("x2", 135*i)
    .attr("y2", height); 
  }

  // color palette
  const color = d3.scaleOrdinal()
    .range(['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00','#ffff33','#a65628','#f781bf','#999999'])

  // Draw the line
  svg.selectAll(".line")
      .data(sumstat)
      .join("path")
        .attr("fill", "none")
        .attr("stroke", function(d){ return color(d[0]) })
        .attr("stroke-width", 1.5)
        .attr("d", function(d){
          return d3.line()
            .x(function(d) { return x(d.year); })
            .y(function(d) { return y(+d.n); })
            (d[1])
        })

})

});