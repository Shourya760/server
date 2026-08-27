const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true,
		},
		phone: {
			type: String,
			required: true,
			trim: true,
		},
		profilePicture: {
			type: String,
			required: true,
			trim: true,
		},
		dateOfBirth: {
			type: Date,
			required: true,
		},
		gender: {
			type: String,
			trim: true,
			required: true,
		},
		password: {
			type: String,
			required: true,
			minlength: 6,
		},

	},
	{ timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
