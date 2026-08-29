import mongoose from "mongoose";

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
		profile: {
			type: String,
			required: false,
			trim: true,
		},
		dob: {
			type: Date,
			required: true,
		},
		gender: {
			type: String,
			required: true,
			trim: true,
			lowercase: true,
			enum: ["male", "female", "other"]
		},
		password: {
			type: String,
			required: true,
			minlength: 8,
		},
		age: {
			type: Number,
			required: true,
		},
		isDeleted: {
			type: Boolean,
			default: false,
		},

	},
	{ timestamps: true }
);

const User = mongoose.model("User", userSchema);

export { User };
export default User;
