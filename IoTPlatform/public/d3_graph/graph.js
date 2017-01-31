var value=[];
	var temp = document.getElementById("");
	//value.append(
	//D3 code	
	var points = [{x: 0,y: 100},{x: 10, y: 110},{x: 20, y: 140},{x: 30, y:130},{x:40, y:80},{x:50, y:75},{x:60, y:78},
			{x:70, y:120},{x:80, y:160}, {x:90, y:100}];
	var yMax = 0 , xMax = 0;
	var ax = [];
	var ay = [];
	points.forEach(function(d,i)
	{
		ax[i] = d.x;
		ay[i] = d.y;
	});
	xMax = d3.max(ax);
	yMax = d3.max(ay);

	//Axes Range defining
	var xLowLim = 0;
	var xUpLim = xMax;
	var yLowLim = 0.8 * d3.min(ay);
	var yUpLim = 1.2 * yMax;
	console.log(xMax);
	console.log(yMax);
	var h = 300,
		w = 500,
		margin_x = 32,
		margin_y = 20;
	var scale = d3.scale.linear().domain([0,5]).range([0,255]);
	var y = d3.scale.linear().domain([yLowLim, yUpLim]).range([0 + margin_y, h - margin_y]);
	var x = d3.scale.linear().domain([xLowLim, xUpLim]).range([0 + margin_x, w - margin_x]);
	
	var svg = d3.select("#sam")
			.append("svg:svg")
			.attr("width",w)
			.attr("height",h);
	var g = svg.append("svg:g").attr("transform","translate(0,"+h+")");
	var line = d3.svg.line()
			.x(function(d){return x(d.x);})
			.y(function(d) {return -y(d.y);});
	//g.append("svg:path").attr("d", line(points));
	
	//X-Y lines
	g.append("svg:line")
		.attr("x1",x(xLowLim))
		.attr("y1",-y(yLowLim))
		.attr("x2",1.2 * x(xUpLim))
		.attr("y2",-y(yLowLim));
	g.append("svg:line")
		.attr("x1", x(xLowLim))
		.attr("y1",-y(yLowLim))
		.attr("x2",x(xLowLim))
		.attr("y2",-1.2 * y(yUpLim));

	//Giving the labels of X-Y axis
	g.selectAll(".xLabel")
		.data(x.ticks(10))
		.enter().append("svg:text")
		.attr("class", "xLabel")
		.text(String)
		.attr("x",function(d)
			{	return x(d)})
		.attr("y",0);
	g.selectAll(".yLabel")
		.data(y.ticks(5))
		.enter().append("svg:text")
		.attr("class","yLabel")
		.text(String)
		.attr("x",25)
		.attr("y",function(d){ return -y(d)});

	//Draw ticks 
	g.selectAll(".xTicks")
		.data(x.ticks(10))
		.enter().append("svg:line")
		.attr("class","xTicks")
		.attr("x1",function(d){ return x(d); })
		.attr("y1", -y(yLowLim))
		.attr("x2",function(d){return x(d);})
		.attr("y2",-y(yLowLim)-5);
	g.selectAll(".yTicks")
		.data(y.ticks(5))
		.enter().append("svg:line")
		.attr("class","yTicks")
		.attr("y1",function(d) {return -y(d);})
		.attr("x1",x(xLowLim))
		.attr("y2", function(d){ return -y(d);})
		.attr("x2", x(xLowLim)+5);

	//Drawing the grids
	g.selectAll(".xGrids")
		.data(x.ticks(10))
		.enter().append("svg:line")
		.attr("class","xGrids")
		.attr("x1", function(d) { return x(d);})
		.attr("y1", -y(yLowLim))
		.attr("x2", function(d){return x(d);})
		.attr("y2", -y(yUpLim)-10);
	
	g.selectAll(".yGrids")
		.data(y.ticks(5))
		.enter().append("svg:line")
		.attr("class","yGrids")
		.attr("y1", function(d){ return -y(d); })
		.attr("x1", x(xUpLim)+20)
		.attr("y2", function(d) { return -y(d); })
		.attr("x2", x(xLowLim));
	//Drwaing the Arrows
	g.append("svg:path")
		.attr("class", "axisArrow")
		.attr("d", function(){
				var x1 = x(xUpLim) + 23, x2 = x(xUpLim) + 30;
				var y2 = -y(yLowLim), y1 = y2-3, y3 = y2+3;
				return 'M'+x1+','+y1+','+x2+','+y2+','+x1+','+y3;
		});
	g.append("svg:path")
		.attr("class","axisArrow")
		.attr("d", function(){
				var x2 = x(xLowLim), x1 = x2-3, x3 = x2+3;
				var y1 = -y(yUpLim)-13, y2 = -y(yUpLim)-20;
				return 'M'+x1+','+y1+','+x2+','+y2+','+x3+','+y1;
		});
	//Adding the text and title
	g.append("svg:text")
		.attr("x", (w/2))
		.attr("y",-h + margin_y)
		.attr("text-anchor", "middle")
		.style("font-size", "22px")
		.text("Line Chart");
	g.append("svg:text")
		.attr("x", 25)
		.attr("y", -h + margin_y)
		.attr("text-anchor", "end")
		.style("font-size","11px")
		.text("[#]");
	g.append("svg:text")
		.attr("x", w - 40)
		.attr("y", -8)
		.attr("text-anchor","end")
		.style("font-size", "11px")
		.text("Time [s]");
	//Drwaing the data lines
	g.append("svg:path").attr("d", line(points));
	g.selectAll(".dot")
		.data(points)
		.enter().append("circle")
		.attr("class","dot")
		.attr("r",3.5)
		.attr("cx", function(d){ return x(d.x);})
		.attr("cy", function(d){ return -y(d.y);});
	console.log(Math.round(scale(2.7)));

	
	
