function radarChart(inst_id,bin) {
	// let data = [];
	let features = ["GPU_Usage","AVG_Memory","Machine_Load","Network_Load"];
	// //generate the data
	// for (var i = 0; i < 3; i++){
	// 	var point = {}
	// 	//each feature will be a random number from 1-9
	// 	features.forEach(f => point[f] = 1 + Math.random() * 50);
	// 	data.push(point);
	// }
	// console.log(data);
    // console.log(inst_id);

    var data;
    d3.csv("../data/inst_data.csv").then( function(data1) {

        // console.log(data1);

        data=data1.filter(function(d){ return d.inst_id == inst_id});
        // console.log(data);
        // d3.selectAll('#radarChart > *').remove();

		// d3.selectAll('#'+to_remove).remove();

        let svrg = d3.select("#radarChart")
        // .append("svg")
        .attr("id","radarChart")
        .attr("width", 700)
        .attr("height", 700);

        let radialScale = d3.scaleLinear()
        .domain([0,65])
        .range([0,290]);
    let ticks = [10,20,30,40,50];

    ticks.forEach(t =>
        svrg.append("circle")
        .attr("cx", 350)
        .attr("cy", 350)
        .attr("fill", "none")
        .attr("stroke", "grey")
        .attr("r", radialScale(t))
    );

    ticks.forEach(t =>
        svrg.append("text")
        .style("font-size", "15px")
        .style("font-weight",500)
        .style('fill', '#444444')
        .attr("x", 370)
        .attr("y", 350 - radialScale(t)+20)
        .text(t.toString())
    );

    function angleToCoordinate(angle, value){
        let x = Math.cos(angle) * radialScale(value);
        let y = Math.sin(angle) * radialScale(value);
        return {"x": 350 + x, "y": 350 - y};
    }
    for (var i = 0; i < features.length; i++) {
        let ft_name = features[i];
        let angle = (Math.PI / 2) + (2 * Math.PI * i / features.length);
        let line_coordinate = angleToCoordinate(angle, 10*5);
        let label_coordinate = angleToCoordinate(angle, 10.5*5);

        //draw axis line
        svrg.append("line")
        .attr("x1", 350)
        .attr("y1", 350)
        .attr("x2", line_coordinate.x)
        .attr("y2", line_coordinate.y)
        .attr("stroke","black");

        //draw axis label
        svrg.append("text")
        .attr("x", label_coordinate.x-15)
        .attr("y", label_coordinate.y+10)
        .text(ft_name);
    }
    let line = d3.line()
        .x(d => d.x)
        .y(d => d.y);
    let colors = {A:"#e15759",B:"#8080c1",C:"#76b7b2",D:"#f18e2c"}
    function getPathCoordinates(data_point){
        let coordinates = [];
        for (var i = 0; i < features.length; i++){
            let ft_name = features[i];
            let angle = (Math.PI / 2) + (2 * Math.PI * i / features.length);
            coordinates.push(angleToCoordinate(angle, data_point[ft_name]));
        }
        return coordinates;
    }

    for (var i = 0; i < data.length; i ++){
        let d = data[i];
        let color = colors[i];
        let coordinates = getPathCoordinates(d);

        //draw the path element
        svrg.append("path")
        .datum(coordinates)
        .attr("d",line)
		.attr('id',inst_id)
        .attr("stroke-width", 3)
        .attr("stroke", colors[bin])
        .attr("fill", colors[bin])
        .attr("stroke-opacity", 1)
        .attr("opacity", 0.5);
    }



    });



}
