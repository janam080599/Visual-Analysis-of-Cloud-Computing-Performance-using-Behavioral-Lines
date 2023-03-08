// set the dimensions and margins of the graph
// let  margin = {top: 60, right: 230, bottom: 50, left: 50},
//     width = 1200 - margin.left - margin.right,
//     height = 600 - margin.top - margin.bottom;
// var svvg1 = d3.select("#my_dataviz1")
//           .append("svg")
//           .attr("id","sss")
//               .attr("width", width + margin.left + margin.right)
//               .attr("height", height + margin.top + margin.bottom)
//           .append("g")
//               .attr("transform",
//                   `translate(${margin.left}, ${margin.top})`);
// var inst_array=new Set();

// let svvg1 = d3.select("#my_dataviz1")
//           .append("svg")
//           .attr("id","sss")
//               .attr("width", width + margin.left + margin.right)
//               .attr("height", height + margin.top + margin.bottom)
//           .append("g")
//               .attr("transform",
//                   `translate(${margin.left}, ${margin.top})`);

function graph2(start_time_limit, end_time_limit) {
    var inst_array=new Set();
    var message = {
        "start_time": start_time_limit,
        "end_time": end_time_limit
      }
        $.ajax({
            type: "POST",
            url: 'http://127.0.0.1:8080/getRangeData',
            data: message,
            dataType: 'json',
            success: function(data){
                console.log('success');
                console.log(data);
                // console.log(data.data.selected_time_data);
                let sel_data = JSON.parse(data.data.selected_time_data);
                let unique_inst = JSON.parse(data.data.instances_list);
                console.log('unique inst');
                console.log(unique_inst);

                // $.each(sel_data, function(i,d){
                //     console.log(i,d);
                // });
            },
            error: function(msg){
                console.log('error');
                // console.log(msg);    
            }
        });
        var txt = $("input").val();
        // $.post("demo_ajax_gethint.asp", {suggest: txt}, function(result){
        // $("span").html(result);
        // });
        // console.log(d3.select('#sss')._groups[0][0]);

        // if(d3.select('#sss')._groups[0][0]!==null){
            // svvg1 = d3.select('#sss');

        // {
            d3.selectAll('#sss > *').remove();
            
            let svvg1 = d3.select("#sss")
            // let svvg1 = d3.select("#my_dataviz1")
                    // .append("svg")
                    .attr("id","sss")
                        .attr("width", width + margin.left + margin.right)
                        .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                        .attr("transform",
                            `translate(${margin.left}, ${margin.top})`);
        // }


    //   svvg1.selectAll("*").remove();
        // console.log(res)

        // append the svvg1 object to the body of the page

        // d3.csv("../data/selected_inst_list.csv").then( function(data1) {
        //     data1.forEach(function(d) {
        //         inst_array.push(d.inst_id);
        //     })


        d3.csv("../data/gen_data3.csv").then( function(data) {
                // console.log(data);
                data["time"]=+data["time"];
                data["cpu_usage"]=+data["cpu_usage"];

                data=data.filter(function(d){ return d.time >= start_time_limit && d.time <= end_time_limit});
                // console.log(data);
                data.forEach(function(d) {
                    inst_array.add(d.inst_id);
                });

                inst_array=Array.from(inst_array);
                // console.log(inst_array);
                // var sumstat = d3.group(data, d => d.inst_id);
                // console.log(sumstat);

                var xExtent = d3.extent(data, d => +d.time);
                // var xExtent = d3.extent([start_time_limit, end_time_limit]);

                    // console.log(xExtent);
                x = d3.scaleLinear().domain(xExtent).range([margin.left, width]);

                //scale yAxis
                var yMax=d3.max(data,d=>+d.cpu_usage);
                var yMin=d3.min(data,d=>+d.cpu_usage);
                console.log(yMax+ "Y_Max" + yMin + "Y_Min");
                y = d3.scaleLinear().domain([yMin-10, yMax+10]).range([height-margin.bottom, 0]);

                xAxis = d3.axisBottom()
                    .scale(x)

                svvg1.append("g")
                    .attr("class", "axis")
                    .attr("transform", `translate(0,${height-margin.bottom})`)
                    .attr("stroke", "#444444")
                    .attr("stroke-width", 1.3)
                    .style("font-size","20px")
                    .call(xAxis)

                svvg1.append("text")
                    .style("font-size", "25px")
                    .style("font-weight",500)
                    .style('fill', '#444444')
                        .attr("text-anchor", "end")
                        .attr("x", width)
                        .attr("y", height )
                        .text("Hours");
                  


                // yAxis and yAxis label
                // yAxis = d3.axisLeft()
                //     .scale(y)
                //     .ticks(7)

                // svvg1.append("g")
                //     .attr("class", "axis")
                //     .attr("transform", `translate(${margin.left},0)`) //use variable in translate
                //     .call(yAxis)

                // console.log(sumstat[0][key][group_bin]);

                // var groupName = sumstat.map(d => d.key["group_bin"])
                // var color = d3.scaleOrdinal().domain(groupName).range(colorbrewer.Set2[6])

                //  d3.select("svvg1")
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
                    var tooltip = d3.select("body")
                        .append("div").style("width","250px").style("padding","5px")
                        .style("opacity", 0).style("border", "3px solid black").style("text-align","center")
                        .style("border-radius", "17%").style("font-weight","600").style("background","#F7F9F9")
                        .attr("class", "tooltip");
                var g = svvg1.append("g");

                var lineAndDots = g.append("g")
                .attr("class", "line-and-dots");


                var set_color = {"A":"#e15759","B":"#8080c1","C":"#76b7b2","D":"#f18e2c"}
                inst_array=Array.from(inst_array);
                // console.log('jnfdkj');
                // console.log(inst_array);
                for(var k=0; k <inst_array.length; k++){

                    temp_data=data.filter(function(d){ return d.inst_id == inst_array[k]});
                    // var color=set_color[""]
                    var inst_data=temp_data;
                    // console.log(k + " . ");
                    // console.log('jnfdkj');
                    // console.log(inst_data);

                    lineAndDots.append("path")
                    .datum(inst_data)
                    .attr("fill", "none")
                    .attr("stroke", function(d){return set_color[d[0].bins] })
                    .attr("stroke-width", 1.2)
                    .attr("d", d3.line()
                        .x(function(d) {return x(+d.time) })
                        .y(function(d) { return y(+d.cpu_usage)})
                        )
                        .on("mouseover", function (d, i) {
                            // console.log(i[0]["cpu_usage"]);
                            tooltip.transition().duration(10).style("opacity", "0.9").style("position", "absolute");
                            tooltip.html("Instance ID : " + i[0]["inst_id"]+"<br>"+ "CPU Usage : " + i[0]["cpu_usage"]).style("font-size","1.1em")
                            .style("left", d.pageX+10  + "px")
                            .style("top", d.pageY-80 + "px");

                            // tooltip.html("CPU Usage : " + i[0]["cpu_usage"]).style("font-size","1.1em")
                            // .style("left", d.pageX+10  + "px")
                            // .style("top", d.pageY-80 + "px");
                            // d3.select(this).style("stroke", "black").style("opacity", 1);
                          })
                          .on("mousemove", function (d, i) {
                            // d3.select(this).classed("bar",false)
                            return tooltip
                              .html("Instance ID : " + i[0]["inst_id"]+ "<br>" + "CPU Usage : " + i[0]["cpu_usage"]).style("font-size","1.1em")
                              .style("left", d.pageX+10 + "px")
                              .style("top", d.pageY-80 + "px");
                          })
                          .on("mouseout", function () {
                            tooltip.html("").style("position","static")
                            return tooltip.transition().duration(0).style("opacity", 0);
                          });

                    // lineAndDots.selectAll("line-circle")
                    // .data(inst_data)
                    // .enter().append("circle")
                    // .attr("class", "data-circle")
                    // .attr("fill", )
                    // .attr("r", 1)
                    // .attr("cx", function(d) { return xScale(+d.start_time); })
                    // .attr("cy", function(d) { return yScale(+d.cpu_usage); });

                }
                updateBubbleChart(inst_array)
            });




}
