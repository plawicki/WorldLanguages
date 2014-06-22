$(function(){

	// przyporzadkowanie jezykowi kraju
	for(var j in dane.kraje)
		for(var i in dane.jezyki)
			if(dane.jezyki[i].countrycode === dane.kraje[j].code)
				dane.jezyki[i].country = dane.kraje[j];

	// sortowanie po nazwie kontynentu asc, nazwie kraju asc, % desc
	dane.jezyki.sort(function(a,b){
		
		if(a.country.continent != b.country.continent)
		{
			if (a.country.continent < b.country.continent) return -1;
			if (a.country.continent > b.country.continent) return 1;
			return 0;
		}

		if(a.country.name != b.country.name)
		{
			if (a.country.name < b.country.name) return -1;
			if (a.country.name > b.country.name) return 1;
		}

		if(a.percentage < b.percentage) return 1;
		if(a.percentage > b.percentage) return -1;
		return 0;
	});

	for(var i in dane.jezyki)
		if(dane.jezyki[i].isofficial === true)
			$('tbody').append('<tr><td>'+dane.jezyki[i].country.continent+'</td><td>'+dane.jezyki[i].country.name+'</td><td>'+dane.jezyki[i].language+'</td><td>'+dane.jezyki[i].country.population+'</td><td>'+dane.jezyki[i].percentage.toFixed(2)+'</td><td>'+Math.floor((dane.jezyki[i].country.population*dane.jezyki[i].percentage)/100)+'</td><td><a href="/country/'+dane.jezyki[i].countrycode+'" role="button" class="btn btn-info">Details</a></td></tr>');
	
});