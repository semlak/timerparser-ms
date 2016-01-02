'use strict';

var express = require('express');

var app = express();
var url = require('url');


var port = process.env.PORT || 8080;


// routes for my API

var router = express.Router();

// middleware to use for all requests
// this (middleware) enables me to easily log something every time a request was sent to my API 
router.use(function(req, res, next) {
	//do logging
	console.log('Something is happening.');
	next();  //make sure we go to the next routes and don't stop here
})

// test route to make sure everything is working (access at GET http://localhost:8080/api)
router.get('/', function(req, res) {
	res.json({ message: 'hooray! welcom to my api!'});
});

router.get('/parse_timestamp/:timeInfo', function(req, res) {
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
	if (date == 'Invalid Date') {
		returnObj.unix = null;
		returnObj.natural = null;
	}
	else {
		returnObj.unix = date.valueOf()/1000;
		returnObj.natural = date.toLocaleDateString('en-US', options);
	}

	//console.log(returnObj);

    // res.send(JSON.stringify(req.query));
    res.send(JSON.stringify(returnObj, false, ' '));
    res.end();
});



// Register our routes ----

// more routes will be prefixed with /api
app.use('/api', router);


app.listen(port,  function () {
	console.log('Node.js listening on port ' + port + '...');
});