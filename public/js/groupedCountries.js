$(function(){

	var pogrupowaneJezyki = {};
	var pogrupowaneJezykiTab = [];

	var ludnoscSwiata = 0;

	for(var j in dane.kraje)
		for(var i in dane.jezyki)
			if(dane.jezyki[i].countrycode === dane.kraje[j].code)
				dane.jezyki[i].country = dane.kraje[j];

	i=0;

	// grupowanie jezykow ze wzgledu na nazwe, zliczanie ludzi poslugujacych sie jezykiem
	for(i in dane.jezyki)
	{
		var ludnosc = 0;

		ludnosc = Math.floor((dane.jezyki[i].percentage * dane.jezyki[i].country.population) / 100);

		if(i==0)
		{
			pogrupowaneJezyki[dane.jezyki[0].language] = { langRef: dane.jezyki[0], count: ludnosc };
			continue;
		}

		if(pogrupowaneJezyki[dane.jezyki[i].language])
		{
			pogrupowaneJezyki[dane.jezyki[i].language].count += ludnosc;
		}
		else
		{
			pogrupowaneJezyki[dane.jezyki[i].language] = { langRef: dane.jezyki[i], count: ludnosc };
		}

	}

	for(i in dane.kraje)
		ludnoscSwiata += dane.kraje[i].population;

	$.each(pogrupowaneJezyki, function(i, jezyk){
		pogrupowaneJezykiTab.push(jezyk);
	})

	// sortowanie po ilosci ludzi desc, nazwie jezyka asc
	pogrupowaneJezykiTab.sort(function(a,b){

		if(a.count != b.count)
		{
			if(a.count < b.count) return 1;
			if(a.count > b.count) return -1;
		}

		if(a.langRef.language != b.langRef.language)
		{
			if (a.langRef.language < b.langRef.language) return -1;
			if (a.langRef.language > b.langRef.language) return 1;
			return 0;
		}
	});

	$.each(pogrupowaneJezykiTab, function(i, jezyk){
		$('tbody').append('<tr><td>'+jezyk.langRef.language+'</td><td>'+jezyk.count+'</td><td>'+(jezyk.count/ludnoscSwiata).toFixed(2)+'</td></tr>');
	});
});