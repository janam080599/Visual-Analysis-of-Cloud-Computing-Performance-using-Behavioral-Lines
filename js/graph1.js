// set the dimensions and margins of the graph
var margin = {top: 60, right: 110, bottom: 70, left: 30},
    width = 1300 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

document.addEventListener('DOMContentLoaded', function () {
// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          `translate(${margin.left}, ${margin.top})`);


// Parse the Data
d3.csv("../data/trace_csv2.csv").then( function(data) {
    // console.log(data);

  // List of groups = header of the csv files
  const keys = data.columns.slice(1)

  // color palette
  const color = d3.scaleOrdinal()
    .domain(keys)
    .range(["#877341","#59348b","#fabc9a","#92c1da"]);
    

  //stack the data?
  const stackedData = d3.stack()
    .keys(keys)
    (data)

  // Add X axis
  const x = d3.scaleLinear()
    .domain(d3.extent(data, function(d) { return d.time; }))
    .range([ 0, width ]);
  const xAxis = svg.append("g")
  .attr('transform',`translate(0,${height})`)
    .call(d3.axisBottom(x).ticks(30))
    .attr("stroke", "#444444")
    // .attr("stroke-width", 1.3)
    .style("font-size","15px")

  // Add X axis label:
  svg.append("text")
  .style("font-size", "25px")
  .style("font-weight",500)
  .style('fill', '#444444')
      .attr("text-anchor", "end")
      .attr("x", width)
      .attr("y", height+50 )
      .text("Hours");

  // Add Y axis
  const y = d3.scaleLinear()
    .domain([0, 270])
    .range([ height, 0 ]);

  // Add a clipPath: everything out of this area won't be drawn.
  const clip = svg.append("defs").append("svg:clipPath")
      .attr("id", "clip")
      .append("svg:rect")
      .attr("width", width )
      .attr("height", height )
      .attr("x", 0)
      .attr("y", 0);

  // Add brushing
  const brush = d3.brushX()                 
      .extent( [ [0,0], [width,height] ] ) 
      .on("end", updateChart) 


  const areaChart = svg.append('g')
    .attr("clip-path", "url(#clip)")

  // Area generator
  const area = d3.area()
    .x(function(d) { return x(d.data.time); })
    .y0(function(d) { return y(d[0]); })
    .y1(function(d) { return y(d[1]); })

  // Show the areas
  areaChart
    .selectAll("mylayers")
    .data(stackedData)
    .join("path")
      .attr("class", function(d) { return "myArea " + d.key })
      .style("fill", function(d) { return color(d.key); })
      .attr("d", area)

  // Add the brushing
  areaChart
    .append("g")
      .attr("class", "brush")
      .call(brush);

  let idleTimeout
  function idled() { idleTimeout = null; }

  // A function that update the chart for given boundaries
  function updateChart(event,d) {

    extent = event.selection

    // console.log(extent.toString());

    // console.log(x.invert(extent[0]),x.invert(extent[1]));
    // console.log('hdchbchbduchbdihcbdfhbcufdcbufdybcufdbcuf');

    // If no selection, back to initial coordinate. Otherwise, update X axis domain
    if(!extent){
      if (!idleTimeout) return idleTimeout = setTimeout(idled, 350); // This allows to wait a little bit
      // console.log('hdchbchbduchbdihcbdfhbcufdcbufdybcufdbcuf');
      x.domain(d3.extent(data, function(d) { return d.time; }))
    }else{
      // console.log('hdchbchbduchbdihcbdfhbcufdcbufdybcufdbcuf');
      var start_time_limit = x.invert(extent[0])
      var end_time_limit = x.invert(extent[1])
      // console.log(start_time_limit, end_time_limit);
      graph2(start_time_limit, end_time_limit);
      x.domain([ start_time_limit, end_time_limit ])
      areaChart.select(".brush").call(brush.move, null) // This remove the grey brush area as soon as the selection has been done
    }

    // Update axis and area position
    xAxis.transition().duration(1000).call(d3.axisBottom(x).ticks(20))
    areaChart
      .selectAll("path")
      .transition().duration(1000)
      .attr("d", area)
    }

    // What to do when one group is hovered
    const highlight = function(event,d){
      // reduce opacity of all groups
      d3.selectAll(".myArea").style("opacity", .1)
      // expect the one that is hovered
      d3.select("."+d).style("opacity", 1)
    }

    // And when it is not hovered anymore
    const noHighlight = function(event,d){
      d3.selectAll(".myArea").style("opacity", 1)
    }

    // Add one dot in the legend for each name.
    const size = 20
    svg.selectAll("myrect")
      .data(keys)
      .join("rect")
        .attr("x", 1000)
        .attr("y", function(d,i){ return 25 + i*(size+5)}) 
        .attr("width", size)
        .attr("height", size)
        .style("fill", function(d){ return color(d)})
        .on("mouseover", highlight)
        .on("mouseleave", noHighlight)

    // Add one dot in the legend for each name.
    svg.selectAll("mylabels")
      .data(keys)
      .join("text")
        .attr("x", 1000 + size*1.2)
        .attr("y", function(d,i){ return 25 + i*(size+5) + (size/2)}) // 100 is where the first dot appears. 25 is the distance between dots
        .style("fill", function(d){ return color(d)})
        .text(function(d){ return d})
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")
        .on("mouseover", highlight)
        .on("mouseleave", noHighlight)

})

});