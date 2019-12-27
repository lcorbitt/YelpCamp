var express = require('express');
var mongoose = require('mongoose');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// DB SETUP
mongoose
	.connect('mongodb://localhost/yelp_camp', {
		useUnifiedTopology: true,
		useNewUrlParser: true
	})
	.then(() => console.log('DB Connected!'))
	.catch((err) => {
		console.log('DB Connection Error: ${err.message}');
	});

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

// SCHEMA SETUP
var campgroundSchema = new mongoose.Schema({
	name: String,
	image: String
});

var Campground = mongoose.model('Campground', campgroundSchema);

// Campground.create({
// 	name: 'Salmon Creek',
// 	image:
// 		'https://www.photosforclass.com/download/pixabay-1846142?webUrl=https%3A%2F%2Fpixabay.com%2Fget%2F57e8d1454b56ae14f6da8c7dda793f7f1636dfe2564c704c72287fd79245c159_960.jpg&user=Pexels'
// });

// Landing Page
app.get('/', function(req, res) {
	res.render('landing');
});

// Get all campgrounds from db
app.get('/campgrounds', function(req, res) {
	Campground.find({}, (err, allCampgrounds) => {
		if (err) {
			console.log(err);
		} else {
			res.render('campgrounds', { campgrounds: allCampgrounds });
		}
	});
});

// Create new campground
app.get('/campgrounds/new', function(req, res) {
	res.render('new.ejs');
});

app.post('/campgrounds', function(req, res) {
	var name = req.body.name;
	var image = req.body.image;
	var newCampground = { name: name, image: image };
	// Create a new campground and save to db
	Campground.create(newCampground, (err, newlyCreated) => {
		if (err) {
			console.log(err);
		} else {
			res.redirect('/campgrounds');
		}
	});
});

// Server listener
app.listen(3000, function() {
	console.log('YelpCamp server has started!');
});
