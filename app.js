var express = require('express'),
	mongoose = require('mongoose'),
	app = express(),
	bodyParser = require('body-parser'),
	// MODULES
	Campground = require('./models/campground'),
	Comment = require('./models/comment'),
	User = require('./models/user'),
	// SEED DB
	seedDB = require('./seeds');

// CONFIG
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

// =================
// SEED THE DATABASE
// =================
seedDB();

// =========================
// CAMPGROUND RESTful ROUTES
// =========================

// INDEX - Landing Page
app.get('/', function(req, res) {
	res.redirect('../campgrounds');
});

// INDEX - Get all campgrounds from database
app.get('/campgrounds', function(req, res) {
	Campground.find({}, (err, allCampgrounds) => {
		if (err) {
			console.log(err);
		} else {
			res.render('campgrounds/index', { campgrounds: allCampgrounds });
		}
	});
});

// NEW - Display form to create new campground
app.get('/campgrounds/new', function(req, res) {
	res.render('campgrounds/new');
});

// CREATE - POST request to create a new campground
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
			res.redirect('campgrounds/index');
		}
	});
});

// SHOW - Find campground with unique ID
app.get('/campgrounds/:id', (req, res) => {
	var id = req.params.id;
	Campground.findById(id).populate('comments').exec((err, foundCampground) => {
		err ? console.log(err) : res.render('campgrounds/show', { campground: foundCampground });
	});
});

// ======================
// COMMENT RESTful ROUTES
// ======================

// NEW - Display form to create new comment
app.get('/campgrounds/:id/comments/new', (req, res) => {
	var id = req.params.id;
	Campground.findById(id).populate('comments').exec((err, foundCampground) => {
		err ? console.log(err) : console.log(foundCampground.comments[0].text);

		res.render('comments/new', { campground: foundCampground });
	});
});

// CREATE - POST request to create a new comment
app.post('/campgrounds/:id/comments', (req, res) => {
	var id = req.params.id;
	Campground.findById(id, (err, foundCampground) => {
		err
			? console.log(err)
			: Comment.create(req.body.comment, (err, comment) => {
					err ? console.log(err) : foundCampground.comments.push(comment);
					foundCampground.save();
					res.redirect('/campgrounds/' + foundCampground._id);
				});
	});
	// 	res.render('/comments/new', { campground: foundCampground });
	// });
});

// Server listener
app.listen(3000, () => {
	console.log('YelpCamp server has started!');
});
