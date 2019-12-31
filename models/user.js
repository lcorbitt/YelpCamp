var mongoose = require('mongoose');

// SCHEMA SETUP
var userSchema = new mongoose.Schema({
	name: String,
	email: String
});

module.exports = mongoose.model('User', userSchema);
