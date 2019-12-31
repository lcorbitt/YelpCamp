var mongoose = require('mongoose'),
	Campground = require('./models/campground'),
	Comment = require('./models/comment');

var my_arr = [
	{
		name: "Cloud's Rest",
		image:
			'https://images.unsplash.com/photo-1537905569824-f89f14cceb68?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=647&q=80',
		description: 'Loremipsum dolor sit amet'
	},
	{
		name: 'Desert Mesa',
		image:
			'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=700&q=60',
		description: 'Loremipsum dolor sit amet'
	},
	{
		name: 'Canyon Floor',
		image:
			'https://images.unsplash.com/photo-1510312305653-8ed496efae75?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=700&q=60',
		description: 'Loremipsum dolor sit amet'
	}
];

async function seedDB() {
	try {
		await Campground.deleteMany({});
		console.log('Previous camgrounds removed');
		await Comment.deleteMany({});
		console.log('Previous comments removed');

		for (const seed of my_arr) {
			let campground = await Campground.create(seed);
			console.log('Camground created');
			let comment = await Comment.create({
				text: 'This seeded comment is great.',
				author: 'Homer Tester'
			});
			console.log('Comment created');
			campground.comments.push(comment);
			campground.save();
			console.log('Comment added to campground');
		}
	} catch (err) {
		console.log('THERE WAS AN ERROR: ', err);
	}
}
module.exports = seedDB;
