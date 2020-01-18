var express = require('express'),
	router = express.Router(),
	Campground = require('../models/campground'),
	Comment = require('../models/comment');

// NEW - Display form to create new comment
router.get('/campgrounds/:id/comments/new', isLoggedIn, (req, res) => {
	var id = req.params.id;
	Campground.findById(id).populate('comments').exec((err, foundCampground) => {
		err ? console.log(err) : res.render('comments/new', { campground: foundCampground });
	});
});

// CREATE - POST request to create a new comment
router.post('/campgrounds/:id/comments', isLoggedIn, (req, res) => {
	var id = req.params.id;
	Campground.findById(id, (err, foundCampground) => {
		err
			? console.log(err)
			: Comment.create(req.body.comment, (err, comment) => {
					err ? console.log(err) : foundCampground.comments.unshift(comment);
					foundCampground.save();
					res.redirect('/campgrounds/' + foundCampground._id);
				});
	});
});

// isLoggedIn middleware
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect('/login');
}

module.exports = router;
