var express = require('express'),
	router = express.Router({ mergeParams: true }),
	Campground = require('../models/campground'),
	Comment = require('../models/comment');

// NEW - Display form to create new comment
router.get('/new', isLoggedIn, (req, res) => {
	var id = req.params.id;
	Campground.findById(id).populate('comments').exec((err, foundCampground) => {
		err ? console.log(err) : res.render('comments/new', { campground: foundCampground });
	});
});

// CREATE - POST request to create a new comment
router.post('/', isLoggedIn, (req, res) => {
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

// EDIT - Display form to edit existing comment
router.get('/:comment_id/edit', checkCommentOwnership, (req, res) => {
	console.log(req.user._id);
	Comment.findById(req.params.comment_id, (err, foundComment) => {
		if (err) {
			res.redirect('back');
		} else {
			res.render('comments/edit', { campground_id: req.params.id, comment: foundComment });
		}
	});
});

// UPDATE - POST request to edit existing comment
router.put('/:comment_id', checkCommentOwnership, (req, res) => {
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
		if (err) {
			res.redirect('back');
		} else {
			res.redirect('/campgrounds/' + req.params.id);
		}
	});
});

// DESTROY - Delete existing comment
router.delete('/:comment_id', checkCommentOwnership, (req, res) => {
	Comment.findByIdAndRemove(req.params.comment_id, (err) => {
		if (err) {
			res.redirect('back');
		} else {
			res.redirect('/campgrounds/' + req.params.id);
		}
	});
});

// isLoggedIn middleware
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect('/login');
}

function checkCommentOwnership(req, res, next) {
	// Is user logged in?
	if (req.isAuthenticated()) {
		Comment.findById(req.params.comment_id, (err, foundComment) => {
			if (err) {
				res.redirect('back');
			} else {
				// Does user own comment?
				if (foundComment.author.id.equals(req.user._id)) {
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

module.exports = router;
