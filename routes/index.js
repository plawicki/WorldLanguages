exports.index = function (req, res) {
    res.render('index', null);
};

exports.countries = function (req, res) {
	res.render('countries', { kraje: JSON.stringify(req.app.get('kraje')), jezyki: JSON.stringify(req.app.get('jezyki'))});
};

exports.groupedCountries = function (req, res) {
	res.render('groupedCountries', { kraje: JSON.stringify(req.app.get('kraje')), jezyki: JSON.stringify(req.app.get('jezyki'))});
};