var express = require('express'),
	request = require('request'),
	cheerio = require('cheerio'),
	async = require('async');

var app = express();

app.set('view engine', 'ejs');

var createValidUrl = function(_url) {
    if(_url.indexOf('www') < 0) {
        _url = 'www.'.concat(_url);
    }
    if(_url.indexOf('http://') < 0) {
        _url = 'http://'.concat(_url);
    }
    return _url;
}

function createRequestToAddress(address, callback) {
    var proper_address = createValidUrl(address);
    request(proper_address, function (error, response, html) {
        if (!error) {
            var $ = cheerio.load(html);
            callback(null, { Url: address, Title : $("title").text()});
        } else {
            callback(null, { Url: address, Title : "NO RESPONSE"});
        }
    });
}

app.get('/I/want/title', function(req, res) {
    var functions = [];
    var addresses = req.query['address'],
		scrapedResult = [];
		
	if(!addresses || addresses == "undefined"){
	 res.render('title', {
					ScrapedResults: scrapedResult
		});
	}else{
			addresses = Array.isArray(req.query['address']) ? req.query['address'] : [req.query['address']];

	        async.each(addresses, function(address, callback) {
                functions.push(function(callback) {
                    createRequestToAddress(address, callback);
                });
            });
        async.parallel(functions,function(err, results){
            res.render('title', {
                ScrapedResults: results
            });
        });
    }
});

app.listen('8081');
exports = module.exports = app;