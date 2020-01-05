var express = require('express'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	LocalStrategy = require('passport-local'),
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
app.use(express.static(__dirname + '/public'));
console.log(__dirname);

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

// =================
// PASSPORT CONFIGURATION
// =================

app.use(
	require('express-session')({
		secret: 'decode',
		resave: false,
		saveUninitialized: false
	})
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

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
app.get('/campgrounds/:id/comments/new', isLoggedIn, (req, res) => {
	var id = req.params.id;
	Campground.findById(id).populate('comments').exec((err, foundCampground) => {
		err ? console.log(err) : console.log(foundCampground.comments[0].text);

		res.render('comments/new', { campground: foundCampground });
	});
});

// CREATE - POST request to create a new comment
app.post('/campgrounds/:id/comments', isLoggedIn, (req, res) => {
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
	// 	res.render('/comments/new', { campground: foundCampground });
	// });
});

// ======================
// AUTH ROUTES
// ======================

// SHOW SIGN-UP FORM
app.get('/sign-up', (req, res) => {
	res.render('sign-up');
});

// HANDLE USER SIGN-UP
app.post('/sign-up', (req, res) => {
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
app.get('/login', (req, res) => {
	res.render('login');
});

// HANDLE USER LOGIN
app.post(
	'/login',
	passport.authenticate('local', {
		successRedirect: '/campgrounds',
		failureRedirect: '/login'
	}),
	(req, res) => {}
);

// HANDLE USER LOGOUT
app.get('/logout', (req, res) => {
	req.logout();
	res.redirect('/');
});

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect('/login');
}

// Server listener
app.listen(3000, () => {
	console.log('YelpCamp server has started!');
});
