var express = require('express'),
	request = require('request'),
	cheerio = require('cheerio'),
	app = express();
	
app.set('view engine', 'ejs');
  
var createValidUrl = function (_url) {
    if(_url.indexOf('www') < 0) {
        _url = 'www.'.concat(_url);
    }
    if(_url.indexOf('http://') < 0) {
        _url = 'http://'.concat(_url);
    }
    return _url;
}
  
  function createRequestToAddress(address, size, res, scrapedResult){
		var validUrl = createValidUrl(address);
  
		request(validUrl, function(error, response, html){
			if(!error){
				var $ = cheerio.load(html);
				scrapedResult.push({ Url: address, Title : $("title").text()});
			}else{
				scrapedResult.push({ Url: address, Title : "NO RESPONSE"});
			}
			if(size == scrapedResult.length){
				renderResults(res, scrapedResult);
			}
		});
  }
  
  function renderResults(response, results){
		response.render('title', {
					ScrapedResults: results
		});
  }
  
  app.get('/I/want/title/', function (req, res) {
  
	var addresses = req.query['address'],
		scrapedResult = [];
		
	if(!addresses || addresses == "undefined"){
		renderResults(res, scrapedResult);
	}else{
			addresses = Array.isArray(req.query['address']) ? req.query['address'] : [req.query['address']];
			for(var i in addresses){
				createRequestToAddress(addresses[i], addresses.length, res, scrapedResult);			
			}
	}
});

app.listen('8081');
exports = module.exports = app;