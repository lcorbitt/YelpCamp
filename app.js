var express = require('express'),
	mongoose = require('mongoose'),
	app = express(),
	bodyParser = require('body-parser'),
	// MODULES
	Campground = require('./models/campground'),
	User = require('./models/user');

// USE
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

// RESTful ROUTES

// Landing Page
app.get('/', function(req, res) {
	res.redirect('index');
});

// Get all campgrounds from db
app.get('/index', function(req, res) {
	Campground.find({}, (err, allCampgrounds) => {
		if (err) {
			console.log(err);
		} else {
			res.render('index', { campgrounds: allCampgrounds });
		}
	});
});

// Create new campground
app.get('/index/new', function(req, res) {
	res.render('new.ejs');
});

app.post('/index', function(req, res) {
	var name = req.body.name;
	var image = req.body.image;
	var description = req.body.description;
	var newCampground = { name: name, image: image, description: description };
	// Create a new campground and save to db
	Campground.create(newCampground, (err, newlyCreated) => {
		if (err) {
			console.log(err);
		} else {
			res.redirect('/index');
		}
	});
});

// Shows more info about one campground
app.get('/index/:id', (req, res) => {
	// Find campground with unique ID
	var id = req.params.id;
	Campground.findById(id, (err, foundCampground) => {
		if (err) {
			console.log(err);
		} else {
			// Render show template of uniqe ID
			res.render('show', { campground: foundCampground });
		}
	});
});

// Server listener
app.listen(3000, () => {
	console.log('YelpCamp server has started!');
});
