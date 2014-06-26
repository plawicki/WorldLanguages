exports.index = function (req, res) {
    res.render('index', null);
};

exports.countries = function (req, res) {
	res.render('countries', { dane: req.app.locals.countriesData });
};

exports.groupedCountries = function (req, res) {
	res.render('groupedCountries', { dane: req.app.locals.groupedCountriesData });
};

exports.countryCode = function (req, res) {

	var result = "";

	if(req.app.locals.countryCodeData[req.params[0]])
		result = JSON.stringify(req.app.locals.countryCodeData[req.params[0]]);
	else
		result = JSON.stringify("notFound");

	res.render('countryCode', { dane: result });
}