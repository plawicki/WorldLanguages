$(function(){

	if(dane !== "notFound")
	{
		$('h1').replaceWith('<h1 class="container myH">Language use in '+dane.kraj.name+'</h1>');

		// d3js pie chart
		var w = 300,                        //width
	    h = 300,                            //height
	    r = 100,                            //radius
	    color = d3.scale.category20c();     //builtin range of colors
	 	
	    var data = [];

	    for(var k in dane.jezyki)
	    {
	    	data.push({"label": dane.jezyki[k].language, value: dane.jezyki[k].percentage});
	    }

		piechart(data);

		function piechart(d){
	        var width = 500,
		    height = 500,
		    radius = Math.min(width, height) / 2 - 10;

			var data = [];

			for(var k in d)
				data.push(d[k].value);

			var color = d3.scale.category20();

			var arc = d3.svg.arc()
			    .outerRadius(radius);

			var pie = d3.layout.pie();

			var svg = d3.select(".svg").append("svg")
			    .datum(data)
			    .attr("width", width)
			    .attr("height", height)
			  .append("g")
			    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

			var arcs = svg.selectAll("g.arc")
			    .data(pie)
			  .enter().append("g")
			    .attr("class", "arc");

			arcs.append("path")
			    .attr("fill", function(d, i) { return color(i); })
			  .transition()
			    .duration(700)
			    .attrTween("d", tweenPie)
			  .transition()
			    .ease("elastic")
			    .delay(function(d, i) { return 2000 + i * 50; })
			    .duration(750);


			function tweenPie(b) {
			  b.innerRadius = 0;
			  var i = d3.interpolate({startAngle: 0, endAngle: 0}, b);
			  return function(t) { return arc(i(t)); };
			}

	        jQuery.each(d, function(i, val) {
	        	$('tbody').append("<tr><th><div class='legendColor' style='background: "+ color(i)  +"'></th><th>" + val.label + "</th><th>"+ val.value.toFixed(1) +"</th></tr>");
	        });
	    }
	}
	else
	{
		$('.alert').append("<div class='alert alert-danger'>No such country code!</div>").show();
		$('.row').hide();
	}
		
})