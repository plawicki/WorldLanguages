$(function(){

	var mojKraj = null

	var mojeJezyki = [];

	// szukam odpowiedniogo kraju
	for(var i in dane.kraje)
		if(dane.kraje[i].code === dane["kod"])
			mojKraj = dane.kraje[i];

	if(mojKraj)
	{
		$('h1').replaceWith('<h1 class="container myH">Language use in '+mojKraj.name+'</h1>');

		// przyporzadkowanie jezykowi kraju
		for(var j in dane.jezyki)
			if(dane.jezyki[j].countrycode === dane["kod"])
			{
				mojeJezyki.push(dane.jezyki[j]);
			}

		// d3js pie chart

		   var w = 300,                        //width
	    h = 300,                            //height
	    r = 100,                            //radius
	    color = d3.scale.category20c();     //builtin range of colors
	 	
	    data = [];

	    var suma = 0, dopelnienie = 100.0;

	    for(var k in mojeJezyki)
	    {
	    	suma += mojeJezyki[k].percentage;
	    	data.push({"label": mojeJezyki[k].language, value: mojeJezyki[k].percentage});
	    }

	    dopelnienie -= suma;

	    if(dopelnienie > 0.09)
	    	data.push({"label": "Other", value: dopelnienie});

	    data.sort(function(a,b){
	    	if(a.value > b.value) return -1;
	    	if(a.value < b.value) return 1;
	    	return 0;
	    })

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