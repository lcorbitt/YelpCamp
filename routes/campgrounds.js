var express = require('express'),
	router = express.Router(),
	Campground = require('../models/campground');

// INDEX - Landing Page
// router.get('/', function(req, res) {
// 	res.redirect('../campgrounds');
// });

// INDEX - Get all campgrounds from database
router.get('/', function(req, res) {
	Campground.find({}, (err, allCampgrounds) => {
		if (err) {
			console.log(err);
		} else {
			res.render('campgrounds/index', {
				// view variables
				campgrounds: allCampgrounds
			});
		}
	});
});

// NEW - Display form to create new campground
router.get('/new', function(req, res) {
	res.render('campgrounds/new');
});

// CREATE - POST request to create a new campground
router.post('/', function(req, res) {
	// Get data from form and add to campgrounds array
	var name = req.body.name;
	var image = req.body.image;
	var description = req.body.description;
	var newCampground = { name: name, image: image, description: description };
	// Create a new campground and save to db
	Campground.create(newCampground, (err, newlyCreated) => {
		if (err) {
			console.log(err);
		} else {
			res.redirect('/campgrounds');
		}
	});
});

// SHOW - Find campground with unique ID
router.get('/:id', (req, res) => {
	var id = req.params.id;
	Campground.findById(id).populate('comments').exec((err, foundCampground) => {
		err ? console.log(err) : res.render('campgrounds/show', { campground: foundCampground });
	});
});

// What's being exported from this file
module.exports = router;
