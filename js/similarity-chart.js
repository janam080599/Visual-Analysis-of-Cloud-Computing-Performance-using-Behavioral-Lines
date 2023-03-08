var margin = {top: 60, right: 230, bottom: 50, left: 70},
    width = 1200 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

var svg,x,y,xAxis,yAxis;
var color;
var group_data;

$(document).ready(function(){

    Promise.all([d3.csv('data/inst_groups.csv', 'data/bins (1).csv')])
    .then(function (values) {

        console.log(values[0]);

        group_data = values[0];

        group_data[1].forEach(function(d) {
                inst_array.push(d.inst_id);
        });
        // console.log(group_data);
        draw();
    });

    function drawForRange(){
        console.log('drawforrange');

        x.domain([+group_data[0].start_time,+group_data[group_data.length-1].start_time]);
        xAxis.transition().duration(1000).call(d3.axisBottom(x));

        let mini = d3.min(group_data,function(d){return +d.cpu_usage});
        let maxi = d3.max(group_data,function(d){return +d.cpu_usage});


        y.domain([mini, maxi]);
        yAxis.transition().duration(1000).call(d3.axisBottom(y));

        var set_color = {A:"red",B:"green",C:"blue",D:"yellow"}

        for(let k=0; k <200; k++){

            temp_data=group_data.filter(function(d){ return d.inst_id == inst_array[k]});
            // var color=set_color[""]
            var inst_data=temp_data;
            console.log(k + " . ");
            // console.log(inst_data);
            svg.append("path")
            .datum(inst_data)
            .attr("fill", "none")
            .attr("stroke", function(d){ console.log(d[0].group_bin); return set_color[d[0].group_bin] })
            .attr("stroke-width", 1)
            .attr("d", d3.line()
                .x(function(d) {console.log(d.start_time); return xScale(+d.start_time) })
                .y(function(d) { console.log(d.cpu_usage);return yScale(+d.cpu_usage)})
                )

            d3.select("svg")
                // .append("g")
                .data(inst_data)
                .append("circle")
                .attr("r", 5)
                .attr("cx", d => xScale(+d.start_time))
                .attr("cy", d => yScale(+d.cpu_usage))
                .style("fill", "blue")

        }

        // let line = svg.append('path')
        //             .datum(group_data)
        //             .attr("id", function(d){ return group_data[]})
        //             .attr("fill", "none");

    }
    function draw(){
        console.log('draw');
        d3.select('#country_svg').remove();

        svg = d3.select('#my_dataviz')
                    .append('svg')
                    .attr('width', width + margin.left + margin.right)
                    .attr('height', height + margin.top + margin.bottom)
                    .attr('border', '1px')
                    .attr('id', 'country_svg')
                    .append('g')
                    .attr('transform', 'translate(' + margin.left +
                      ',' + margin.top + ')');

        x = d3.scaleTime()
                  .range([ 0, width ]);

        xAxis = svg.append("g")
                  .attr("transform", `translate(0,${height})`);
                  // .domain([new Date(1980,0,1), new Date(2013,0,1)]);

        // Initialize the Y axis
        y = d3.scaleLinear()
                  .range([ height, 0]);

        y.domain([Number.MAX_VALUE,-1]);

        yAxis = svg.append("g")
                  // .domian([10000,-1])
                  .attr("class", "myYaxis");

        color = d3.scaleOrdinal().range(d3.schemeSet2);


        drawForRange();

    }
});
