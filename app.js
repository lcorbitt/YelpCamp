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
var campgroundRoutes = require('./routes/campgrounds'),
	commentRoutes = require('./routes/comments'),
	indexRoutes = require('./routes/index');

// CONFIG
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

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

// middleware will be called on every route
app.use((req, res, next) => {
	res.locals.currentUser = req.user;
	next();
});

// CAMPGROUND RESTful ROUTES
app.use('/campgrounds', campgroundRoutes);

// COMMENT RESTful ROUTES
app.use('/campgrounds/:id/comments', commentRoutes);

// AUTH ROUTES
app.use('/', indexRoutes);

// isLoggedIn middleware
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect('/login');
}

// Server listener
app.listen(3000, () => {
	console.log('YelpCamp server has started on localhost:3000!');
});
