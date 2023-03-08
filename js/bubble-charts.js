
function bubbleChart() {
  // const width = 1200;
  // const height = 600;
  // console.log(rawData);
  let margin = {top: 150, right: 0, bottom: 70, left: 110},
      width = 800 - margin.left - margin.right,
      height = 1000 - margin.top - margin.bottom;
  // location to centre the bubbles
  const centre = { x: width/2, y: height/2 };

  // strength to apply to the position forces
  const forceStrength = 0.03;

  // these will be set in createNodes and chart functions
  let svg = null;
  let bubbles = null;
  let labels = null;
  let nodes = [];

  // charge is dependent on size of the bubble, so bigger towards the middle
  function charge(d) {
    return Math.pow(d.radius, 2.0) * 0.01
  }

  // create a force simulation and add forces to it
  const simulation = d3.forceSimulation()
  // .force("center", d3.forceCenter().x(width / 2).y(height / 2)) // Attraction to the center of the svg area
    .force("charge", d3.forceManyBody().strength(charge)) // Nodes are attracted one each other of value is > 0
    .force("collide", d3.forceCollide().strength(.99).radius(d => bubbleRad(d)+ 1).iterations(1.5)) // Force that avoids circle overlapping
    .force('attract', d3.forceRadial(0.3, centre.x, centre.y).strength(0.001))
    // .force('charge', d3.forceManyBody().strength(charge))
    .force('center', d3.forceCenter(centre.x/2, centre.y/2))
    .on("tick", ticked2)
      .alphaTarget(0.1);
    // .force('x', d3.forceX().strength(forceStrength).x(centre.x))
    // .force('y', d3.forceY().strength(forceStrength).y(centre.y))
    // .force('collision', d3.forceCollide().radius(d => d.radius + 1));

    function ticked2() {
        myNodes.attr("cx", d => d.x).attr("cy", d => d.y);
      }

      // ticked2();
      // invalidation.then(() => simulation.stop());
  //   simulation
  // .nodes(rawData)
  // .on("tick", function(dd) {
  //   node
  //     .attr("cx", function(dd) {
  //       return dd.x;
  //     })
  //     .attr("cy", function(dd) {
  //       return dd.y;
  //     })
  // });
  // force simulation starts up automatically, which we don't want as there aren't any nodes yet

  // simulation
  //   .nodes(bubbleData)
  //   .on("tick", function(d) {
  //       console.log('moved');
  //     // myNodes
  //     //   .attr("cx", function(d) {
  //     //     return d.x;
  //     //   })
  //     //   .attr("cy", function(d) {
  //     //     return d.y;
  //     //   })
  //   });
  simulation.stop();

  // What happens when a circle is dragged?
function dragstarted(e,d) {
  if (!e.active) simulation.alphaTarget(.03).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(e,d) {
  d.fx = e.x;
  d.fy = e.y;
}

function dragended(e, d) {
  if (!e.active) simulation.alphaTarget(.03);
  d.fx = null;
  d.fy = null;
}

  // set up colour scale
  // const fillColour = d3.scaleOrdinal()
  // 	.domain(["1", "2", "3", "5", "99"])
  // 	.range(["#0074D9", "#7FDBFF", "#39CCCC", "#3D9970", "#AAAAAA"]);

  // data manipulation function takes raw data from csv and converts it into an array of node objects
  // each node will store data and visualisation values to draw a bubble
  // rawData is expected to be an array of data objects, read in d3.csv
  // function returns the new node array, with a node for each element in the rawData input
  function createNodes(rawData) {
    // use max size in the data as the max in the scale's domain
    // note we have to ensure that size is a number
    const maxSize = d3.max(rawData, d => +d.cpu_usage);

    // size bubbles based on area
    const radiusScale = d3.scaleSqrt()
      .domain([0, maxSize])
      .range([0, 80])

    // use map() to convert raw data into node data
    const myNodes = rawData.map(d => ({
      ...d,
      radius: radiusScale(+d.cpu_usage),
      size: +d.cpu_usage,
      x: Math.random() * 800,
      y: Math.random() * 400
    }))

    return myNodes;
  }

  // main entry point to bubble chart, returned by parent closure
  // prepares rawData for visualisation and adds an svg element to the provided selector and starts the visualisation process
  let chart = function chart(selector, rawData) {
    // convert raw data into nodes data
    rawData = rawData.filter(d => d.inst_id!='')
    nodes = createNodes(rawData);
    // create svg element inside provided selector
    svg = d3.select(selector)
      .append('svg')
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform",
            `translate(${margin.left}, ${margin.top})`);
      // .attr('width', width)
      // .attr('height', height)

    // bind nodes data to circle elements
    const elements = svg.selectAll('.bubble')
      .data(nodes, d => d.cpu_usage)
      .enter()
      .append('g')

    // let minA=100;
    // let minB=100;
    // let minC=100;
    // let minD=100;
    // let maxA=-1;
    // let maxB=-1;
    // let maxC=-1;
    // let maxD=-1;
    var tooltip = d3.select("body")
    .append("div").style("width","250px").style("padding","5px")
    .style("opacity", 0).style("border", "3px solid black").style("text-align","center")
    .style("border-radius", "17%").style("font-weight","600").style("background","#F7F9F9")
    .attr("class", "tooltip");
    let set_color = {A:"#e15759",B:"#8080c1",C:"#76b7b2",D:"#f18e2c"}
    let to_remove;
    let compare_inst=[];
    bubbles = elements
      .append('circle')
      .classed('bubble', true)
      .attr('id',d=> ''+d.inst_id+'_bubble')
      .attr('r', function(d){ return bubbleRad(d)})//d => d.radius/2)
      .attr('fill', d => set_color[d.bins])
      .attr("fill-opacity", 0.6)
      .attr('stroke', d => set_color[d.bins])
      .attr("stroke-width", 5)
      .call(d3.drag() // call specific function when circle is dragged
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended))
    .on("click", function(e,d){
        console.log(compare_inst);

        if(compare_inst.length==2){
            // $('#'+compare_inst[0]).innerhtml('');


            // compare_inst[0]=compare_inst[1];
            // compare_inst.push(d['inst_id']);
            to_remove = compare_inst.shift();
            console.log(to_remove, compare_inst.length);

            // console.log('dddddddddddddddddd');
            console.log(d);
            $("#" + to_remove['inst_id']).remove();
            $("#" + to_remove['inst_id']+'_bubble').css('stroke',set_color[to_remove.bins]);
            // d3.selectAll('#'+String(to_remove)).remove();
            console.log(compare_inst);
        }

        compare_inst.push(d);
        $('#'+d['inst_id']+'_bubble').css('stroke','black');

        console.log(compare_inst);
        // console.log(d["bins"]);
        radarChart(d["inst_id"],d["bins"]);
        // loadChart(d.bins);
    }).on("mouseover", function (d, i) {
      // console.log(i)
      tooltip.transition().duration(10).style("opacity", "0.9").style("position", "absolute");
      tooltip.html("Instance ID : " + i.inst_id).style("font-size","1.1em")
      .style("left", d.pageX+10  + "px")
      .style("top", d.pageY-80 + "px");
      // d3.select(this).style("stroke", "black").style("opacity", 1);
    })
    .on("mousemove", function (d, i) {
      // d3.select(this).classed("bar",false)
      return tooltip
        .html("Instance ID : " + i.inst_id).style("font-size","1.1em")
        .style("left", d.pageX+10 + "px")
        .style("top", d.pageY-80 + "px");
    })
    .on("mouseout", function () {
      tooltip.html("").style("position","static")
      return tooltip.transition().duration(0).style("opacity", 0);
    });

    // console.log(minA,maxA);
    // console.log(minB,maxB);
    // console.log(minC,maxC);
    // console.log(minD,maxD);
    // labels
    // labels = elements
    //   .append('text')
    //   .attr('dy', '.3em')
    //   .style('text-anchor', 'middle')
    //   .style('font-size', 15)
    //   .style("font-size", "13px")
    //   .style('fill', 'black')
    //   .text(d => d.bins)

    // set simulation's nodes to our newly created nodes array
    // simulation starts running automatically once nodes are set
    simulation.nodes(nodes)
      .on('tick', ticked)
      .restart();
  }

  // callback function called after every tick of the force simulation
  // here we do the actual repositioning of the circles based on current x and y value of their bound node data
  // x and y values are modified by the force simulation
  function ticked() {
    bubbles
      .attr('cx', d => margin.left + d.x)
      .attr('cy', d => margin.top + d.y)

    // labels
    //   .attr('x', d => margin.left + d.x)
    //   .attr('y', d => margin.top + d.y)
  }

  // return chart function from closure
  return chart;
}

function bubbleRad(d){
    if(d.bins=="A"){
        return 40;
        // minA = Math.min(minA, d.radius/2);
        // maxA = Math.max(maxA, d.radius/2);
    }else if(d.bins=="B"){
        return 30;
        // minB = Math.min(minB, d.radius/2);
        // maxB = Math.max(maxB, d.radius/2);
    }else if(d.bins=="C"){
        return 20;
        // minC = Math.min(minC, d.radius/2);
        // maxC = Math.max(maxC, d.radius/2);
    }else{
        return 15;
        minD = Math.min(minD, d.radius/2);
        maxD = Math.max(maxD, d.radius/2);
    }

    // return d.radius/2;
}
// new bubble chart instance
let myBubbleChart = bubbleChart();

// function called once promise is resolved and data is loaded from csv
// calls bubble chart function to display inside #vis div
function display(data) {
  var bubbleData=data;
  // console.log('cbdshbcsbhdbsbkjbsdjkbvvkjsdbvkbdskvbkfbvkdfkvbfkkfbh');
  // myBubbleChart('#bubble-viz', data);
  // bubbleData = data;
}
function updateBubbleChart(ids){
  bb_data = []
  d3.csv('data/bubble_data.csv').then(data => {
    ids.forEach(d => {
      // console.log(d)
      // console.log(data.filter(x => x.inst_id == d))
      temp = data.filter(x => x.inst_id == d)[0]
      if(temp!=undefined)
        bb_data.push(temp)
    })
    d3.select('#bubble-viz > *').remove();
    myBubbleChart('#bubble-viz',bb_data)
  })
}
// var bubbleData;
// load data
d3.csv('data/bubble_data.csv').then(display);
