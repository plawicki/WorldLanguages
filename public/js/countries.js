$(function(){

	for(var i in dane.jezyki)
		if(dane.jezyki[i].isofficial === true)
			$('tbody').append('<tr><td>'+dane.jezyki[i].country.continent+'</td><td>'+dane.jezyki[i].country.name+'</td><td>'+dane.jezyki[i].language+'</td><td>'+dane.jezyki[i].country.population+'</td><td>'+dane.jezyki[i].percentage.toFixed(2)+'</td><td>'+Math.floor((dane.jezyki[i].country.population*dane.jezyki[i].percentage)/100)+'</td><td><a href="/country/'+dane.jezyki[i].countrycode+'" role="button" class="btn btn-info">Details</a></td></tr>');
	
});