var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var less = require('less-middleware');
var pg = require('pg');

var app = express();

app.configure(function () {
    app.set('port', process.env.PORT || 80);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'ejs');
    app.use(express.json());
    app.use(express.urlencoded());
    app.use(express.methodOverride());
    app.use(express.cookieParser('bardzo tajne aqq'));
    app.use(express.session());
    app.use(app.router);
    // „middleware” obsługujące LESS-a
    // samo kompiluje pliki less-owe do CSS
    // a do tego pliki wynikowe kompresuje
    // Opis parametrów:
    //
    // https://github.com/emberfeather/less.js-middleware
    app.use(less({
        src: path.join(__dirname, 'less'),
        dest: path.join(__dirname, 'public/css'),
        prefix: '/css',
        compress: true
    }));
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(express.static(path.join(__dirname, 'bower_components/jquery/dist')));
    app.use(express.static(path.join(__dirname, 'bower_components/d3')));
    app.use(express.static(path.join(__dirname, 'bower_components/bootstrap-css')));
});

app.configure('development', function () {
    app.use(express.logger('dev'));
    app.use(express.errorHandler());
});

// dzialanie
// laczenie z baza, sciaganie countries, sciaganie languages, ustawianie data for countries, groupedCountries, countryCode
// kod podzielony na funkcje, aby zsynchronizowac uruchamianie serwera, najpierw trzeba sciagnac dane i posortowac

// oryginalne dane z bazy
var kraje = [];
var jezyki = [];

// dane posortowane dla widokow
var countriesJezyki = [];
var groupedCountriesJezyki = [];
var countryCodeData = {};

var ludnoscSwiata = 0;


var aDBparams = { host: 'ec2-54-225-101-124.compute-1.amazonaws.com', user: 'mmmwsvrkwfstit', password: 'vlliFqilBOUVyWVY-FZfV50Wa3', database: 'ddehqcgsacci3g',ssl: true };
 
var client = new pg.Client(aDBparams);
 

client.connect(function(err){
    if(err)
    {
        throw new Error("Cannot connect to database");
    }
    else
    {
        countriesQuery();
    }
});



countriesQuery = function(){

    client.query("SELECT code, name, continent, population FROM country", function(err, result) {

        console.log("donwloading countries");

        if( result == undefined ){
            throw new Error("Cannot download countries");
        }else{

            for(i in result.rows)
            {
                kraje[i] = result.rows[i];
            }

            app.set('kraje', { kraje: kraje });
            
        }
        pg.end();
        languageQuery();
    });
}

languageQuery = function(){

    console.log("donwloading languages");

    client.query("SELECT * FROM countryLanguage", function(err, result) {
        if( result == undefined ){
            throw new Error("Cannot download languages");
        }else{

            for(i in result.rows)
            {
                jezyki[i] = result.rows[i];
            }

            app.set('jezyki', { jezyki: jezyki });
            
        }
        pg.end();
        referenceBinding();
    });
};

referenceBinding = function(){

    // przyporzadkowanie jezykowi kraju
    for(var j in kraje)
        for(var i in jezyki)
            if(jezyki[i].countrycode === kraje[j].code)
                jezyki[i].country = kraje[j];

    countriesSetting();
}

countriesSetting = function(){

    // kopiowanie referencji
    for(var i in jezyki)
        if(jezyki[i].isofficial === true)
            countriesJezyki.push(jezyki[i]);

    // sortowanie po nazwie kontynentu asc, nazwie kraju asc, % desc
    countriesJezyki.sort(function(a,b){
        
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

    groupedCountriesSetting();
}

groupedCountriesSetting = function(){

    var pogrupowaneJezyki = {};

    var i=0;

    // grupowanie jezykow ze wzgledu na nazwe, zliczanie ludzi poslugujacych sie jezykiem
    for(i in jezyki)
    {
        var ludnosc = 0;

        ludnosc = Math.floor((jezyki[i].percentage * jezyki[i].country.population) / 100);

        if(i==0)
        {
            pogrupowaneJezyki[jezyki[0].language] = { langRef: jezyki[0], count: ludnosc };
            continue;
        }

        if(pogrupowaneJezyki[jezyki[i].language])
        {
            pogrupowaneJezyki[jezyki[i].language].count += ludnosc;
        }
        else
        {
            pogrupowaneJezyki[jezyki[i].language] = { langRef: jezyki[i], count: ludnosc };
        }
    }

    for(i in kraje)
        ludnoscSwiata += kraje[i].population;

    // foreach
    Object.keys(pogrupowaneJezyki).forEach(function(key) {

        groupedCountriesJezyki.push(pogrupowaneJezyki[key]);
    });

    // sortowanie po ilosci ludzi desc, nazwie jezyka asc
    groupedCountriesJezyki.sort(function(a,b){

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


    countryCodeSetting();
}

countryCodeSetting = function(){

    var i=0, j=0;

    for(i in kraje)
        countryCodeData[kraje[i].code] = { kraj: kraje[i], jezyki: [] }

    i=0;

    for(i in kraje)
        for(j in jezyki)
        {
            if(kraje[i].code === jezyki[j].countrycode)
                    countryCodeData[kraje[i].code].jezyki.push(jezyki[j]);
        } 

    // foreach
    Object.keys(countryCodeData).forEach(function(key) {
        
        var suma = 0, dopelnienie = 100.0, i = 0;

        for(i in countryCodeData[key].jezyki)
        {
            suma += countryCodeData[key].jezyki[i].percentage;
        }

        dopelnienie -= suma;

        if(dopelnienie > 0.09)
            countryCodeData[key].jezyki.push({ "language": "Other", "percentage": dopelnienie });

        countryCodeData[key].jezyki.sort(function(a,b){
            if(a.percentage > b.percentage) return -1;
            if(a.percentage < b.percentage) return 1;
            return 0;
        })
    });

    removingReferences();
}

removingReferences = function(){

    // usuwanie referencji z jezykow, aby uniknac dublowania danych przez JSON.stringify
    for(var i in countriesJezyki)
        delete jezyki[i].country;

    app.locals.countriesData = JSON.stringify({ kraje: kraje, jezyki: countriesJezyki });
    app.locals.groupedCountriesData = JSON.stringify({ kraje: kraje, jezyki: groupedCountriesJezyki, ludnoscSwiata: ludnoscSwiata });
    app.locals.countryCodeData = countryCodeData;

    runServer();
}

runServer = function(){

    client.end();

    console.log("setting up routes");

    app.get('/', routes.index);
    app.get('/countries', routes.countries);
    app.get('/groupedCountries', routes.groupedCountries);
    app.get(/^\/country\/(\w+)?$/, routes.countryCode);

    http.createServer(app).listen(app.get('port'), function () {
        console.log("Serwer nasłuchuje na porcie " + app.get('port'));
    });
}