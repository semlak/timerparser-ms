'use strict';

var express = require('express');

var app = express();
var url = require('url');
var port = process.env.PORT || 8080;
var path = require('path');

//app.engine('.html', require('jade'));
app.set('views', path.join(__dirname, '/app/views'));
app.set('view engine', 'jade');
app.use(express.static(__dirname + '/public'));

/*
app.get('/', function(req, res) {
	res.render('index.html');
    res.end();
});
*/


app.get('/', function (req, res) {
	console.log("rendering homepage");
	//get page data
	var pageData = require('./app/views/indexPageData.json');
	var appURL = req.protocol + '://' + req.headers.host;
	pageData = JSON.parse(JSON.stringify(pageData).replace(/APPURL/g, appURL));
	// console.log(pageData);
	res.render('index', pageData);
	res.end();
});

app.get('/:timeInfo', function(req, res) {
	var timestamp_request = req.params.timeInfo;
	//check wether request is a unix timestamp, a natureal language date, or neither
	//For Unix timestamp, I'm assuming any string that parses to an integer is a unix timestamp
	var returnObj = {};
	var date;
	var options = {  year: 'numeric', month: 'long', day: 'numeric' };

	//console.log(new Date(timestamp_request));
	if ( Number.parseInt(timestamp_request)) {
		date = new Date(Number.parseInt(timestamp_request)* 1000);
	}
	else if (new Date(timestamp_request)) {
		date = new Date(timestamp_request);
	}

	//console.log(date.toLocaleDateString(options));
	if (date != 'Invalid Date') {
		returnObj.unix = date.valueOf()/1000;
		returnObj.natural = date.toLocaleDateString('en-US', options);
	}
	else {
		returnObj.unix = null;
		returnObj.natural = null;		
	}

    res.send(JSON.stringify(returnObj, false, ' '));
    res.end();
});


app.listen(port,  function () {
	console.log('Node.js listening on port ' + port + '...');
});