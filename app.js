var express = require('express');
var app = express();

app.get('/', function(req, res) {
	res.send('Working');
});

app.listen(3000, function() {
	console.log('YelpCamp server has started!');
});
