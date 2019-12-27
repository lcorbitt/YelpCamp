var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

var campgrounds = [ { name: 'Salmon Creek' }, { name: 'Granite Hill' }, { name: 'Mountain Goat Springs' } ];

app.set('view engine', 'ejs');

app.get('/', function(req, res) {
	res.render('landing');
});

app.get('/campgrounds', function(req, res) {
	res.render('campgrounds', { campgrounds: campgrounds });
});

app.get('/campgrounds/new', function(req, res) {
	res.render('new.ejs');
});

app.post('/campgrounds', function(req, res) {
	var name = req.body.name;
	var newCampground = { name: name };
	campgrounds.push(newCampground);
	res.redirect('campgrounds');
});

app.listen(3000, function() {
	console.log('YelpCamp server has started!');
});
