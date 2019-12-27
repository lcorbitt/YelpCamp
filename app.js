var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

var campgrounds = [
	{
		name: 'Salmon Creek',
		image: 'https://pixabay.com/get/57e8d1454b56ae14f6da8c7dda793f7f1636dfe2564c704c722878d09f48c65d_340.jpg'
	},
	{
		name: 'Granite Hill',
		image:
			'https://www.photosforclass.com/download/pixabay-1189929?webUrl=https%3A%2F%2Fpixabay.com%2Fget%2F57e1dd4a4350a514f6da8c7dda793f7f1636dfe2564c704c722878d09f48c65d_960.jpg&user=Noel_Bauza'
	},
	{
		name: 'Mountain Goat Springs',
		image:
			'https://www.photosforclass.com/download/pixabay-1851092?webUrl=https%3A%2F%2Fpixabay.com%2Fget%2F57e8d0424a5bae14f6da8c7dda793f7f1636dfe2564c704c722878d09f48c65d_960.jpg&user=Pexels'
	},
	{
		name: 'Salmon Creek',
		image: 'https://pixabay.com/get/57e8d1454b56ae14f6da8c7dda793f7f1636dfe2564c704c722878d09f48c65d_340.jpg'
	},
	{
		name: 'Granite Hill',
		image:
			'https://www.photosforclass.com/download/pixabay-1189929?webUrl=https%3A%2F%2Fpixabay.com%2Fget%2F57e1dd4a4350a514f6da8c7dda793f7f1636dfe2564c704c722878d09f48c65d_960.jpg&user=Noel_Bauza'
	},
	{
		name: 'Mountain Goat Springs',
		image:
			'https://www.photosforclass.com/download/pixabay-1851092?webUrl=https%3A%2F%2Fpixabay.com%2Fget%2F57e8d0424a5bae14f6da8c7dda793f7f1636dfe2564c704c722878d09f48c65d_960.jpg&user=Pexels'
	}
];

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
	var image = req.body.image;
	var newCampground = { name: name, image: image };
	campgrounds.unshift(newCampground);
	res.redirect('campgrounds');
});

app.listen(3000, function() {
	console.log('YelpCamp server has started!');
});
