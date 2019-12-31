var mongoose = require('mongoose');

// SCHEMA SETUP
var commentSchema = new mongoose.Schema({
	body: String,
	author: String
});
module.exports = mongoose.model('Comment', commentSchema);
