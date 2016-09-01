var express = require('express'),
	request = require('request'),
	cheerio = require('cheerio'),
	q = require('q'),
	app = express();
	
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
    
  app.get('/I/want/title/', function (req, res) {
  
	var addresses = req.query['address'],
		scrapedResult = [];
		
	if(!addresses || addresses == "undefined"){
		res.render('title', {
					ScrapedResults: results
		});
	}else{
		
		addresses = Array.isArray(req.query['address']) ? req.query['address'] : [req.query['address']];
	
		for(var i=0;i< addresses.length;i++){
			wrapper(addresses[i], res, scrapedResult);
		}
	}
	
	function createRequestToAddress(_url) {
	 
		var defer = q.defer(),
			validUrl = createValidUrl(_url);
         
			 request(validUrl, function(error, response, html){
			 try{
					var $ = cheerio.load(html);
					defer.resolve($( 'title').text());
                } catch (error) {
                     defer.reject(error);
				}
			});
			
		return defer.promise;
    };
	
	function wrapper(url, res, result){

		createRequestToAddress(url).then(function (response) {
			result.push({Url: url, Title: response});
			tranformResult(res, result);
		}).catch(function (err) {
			result.push({Url: url, Title: "NO RESPONSE"});
			tranformResult(res, result);
		});
	}
	
	function tranformResult(res, result){
		if(result.length == addresses.length){
			res.render('title', {
					ScrapedResults: result
		});
	 }
	}
});

app.listen('8081');
exports = module.exports = app;