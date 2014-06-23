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

var kraje = [];
var jezyki = [];

var aDBparams = { host: 'ec2-54-197-238-242.compute-1.amazonaws.com', user: 'msnyshehxzwduz', password: 'CZZpzn1J7DYG2cX_W3RyzlhSLp', database: 'd2oindia6bcueo',ssl: true };
 
var client = new pg.Client(aDBparams);
 
client.connect();

client.query("SELECT * FROM country", function(err, result) {

    console.log("donwloading countries");

    if( result == undefined ){
        console.log("No results for the query");
    }else{

        for(i in result.rows)
        {
            kraje[i] = result.rows[i];
        }

        app.set('kraje', { kraje: kraje });
        
    }
    pg.end();
    nextQuery();
});

nextQuery = function(){

    console.log("donwloading languages");

    client.query("SELECT * FROM countryLanguage", function(err, result) {
        if( result == undefined ){
            console.log("No results for the query");
        }else{

            for(i in result.rows)
            {
                jezyki[i] = result.rows[i];
            }

            app.set('jezyki', { jezyki: jezyki });
            
        }
        pg.end();
        setUpRouts();
    });

}

setUpRouts = function(){

    console.log("setting up routes");

    app.get('/', routes.index);
    app.get('/countries', routes.countries);
    app.get('/groupedCountries', routes.groupedCountries);
    app.get(/^\/country\/(\w+)?$/, routes.countryCode);

    http.createServer(app).listen(app.get('port'), function () {
        console.log("Serwer nasłuchuje na porcie " + app.get('port'));
    });

}