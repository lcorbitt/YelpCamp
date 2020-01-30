var express = require('express'),
	router = express.Router(),
	Campground = require('../models/campground');

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
router.get('/new', isLoggedIn, function(req, res) {
	res.render('campgrounds/new');
});

// CREATE - POST request to create a new campground
router.post('/', function(req, res) {
	// Get data from form and add to campgrounds array
	var name = req.body.name;
	var image = req.body.image;
	var description = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	};
	var newCampground = { name: name, image: image, description: description, author: author };
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

// EDIT - Edit campground with unique ID
router.get('/:id/edit', checkCampgroundOwnership, (req, res) => {
	Campground.findById(req.params.id, (err, foundCampground) => {
		res.render('campgrounds/edit', { campground: foundCampground });
	});
});

// UPDATE - Edit campground data
router.put('/:id', checkCampgroundOwnership, (req, res) => {
	// find and update the correct campground
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) => {
		if (err) {
			res.redirect('/campgrounds');
		} else {
			res.redirect('/campgrounds/' + req.params.id);
		}
	});
});

// DESTROY - Delete campground
router.delete('/:id', checkCampgroundOwnership, (req, res) => {
	Campground.findByIdAndRemove(req.params.id, (err) => {
		if (err) {
			res.redirect('/campgrounds');
		} else {
			res.redirect('/campgrounds');
		}
	});
});

// middleware
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect('/login');
}

function checkCampgroundOwnership(req, res, next) {
	// Is user logged in?
	if (req.isAuthenticated()) {
		Campground.findById(req.params.id, (err, foundCampground) => {
			if (err) {
				res.redirect('back');
			} else {
				// Does user own campground?
				if (foundCampground.author.id.equals(req.user._id)) {
					next();
				} else {
					res.redirect('back');
				}
			}
		});
	} else {
		res.redirect('back');
	}
}

// What's being exported from this file
module.exports = router;
