$(function(){

	var mojKraj = null

	var mojeJezyki = [];

	// szukam odpowiedniogo kraju
	for(var i in dane.kraje)
		if(dane.kraje[i].code === dane["kod"])
			mojKraj = dane.kraje[i];

	// przyporzadkowanie jezykowi kraju
	for(var j in dane.jezyki)
		if(dane.jezyki[j].countrycode === dane["kod"])
		{
			mojeJezyki.push(dane.jezyki[j]);
		}

	console.log(mojeJezyki);

})