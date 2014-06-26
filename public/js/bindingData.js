$(function(){
	// przyporzadkowanie jezykowi kraju
	for(var j in dane.kraje)
		for(var i in dane.jezyki)
			if(dane.jezyki[i].countrycode === dane.kraje[j].code)
				dane.jezyki[i].country = dane.kraje[j];
});