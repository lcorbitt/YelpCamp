var express = require('express'),
	router = express.Router(),
	passport = require('passport'),
	User = require('../models/user');

// SHOW SIGN-UP FORM
router.get('/sign-up', (req, res) => {
	res.render('sign-up');
});

// HANDLE USER SIGN-UP
router.post('/sign-up', (req, res) => {
	var username = req.body.username;
	var password = req.body.password;
	User.register(new User({ username: username }), password, (err, user) => {
		if (err) {
			console.log(err);
			return res.render('sign-up');
		}
		passport.authenticate('local')(req, res, () => {
			console.log(user, 'NEW USER CREATED');
			res.redirect('/campgrounds');
		});
	});
});

// SHOW LOGIN FORM
router.get('/login', (req, res) => {
	res.render('login');
});

// HANDLE USER LOGIN
router.post(
	'/login',
	passport.authenticate('local', {
		successRedirect: '/campgrounds',
		failureRedirect: '/login'
	}),
	(req, res) => {}
);

// HANDLE USER LOGOUT
router.get('/logout', (req, res) => {
	req.logout();
	res.redirect('/');
});

// isLoggedIn middleware
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect('/login');
}

module.exports = router;
