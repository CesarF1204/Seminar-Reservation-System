import mongoose from 'mongoose';

/**
* DOCU: Defines the schema for a user <br>
* It specifies the fields and their validation rules for a user record <br>
* Last Updated Date: December 11, 2024 <br>
* @constant userSchema
* @type {Schema}
* @description Defines the Mongoose schema for users, including details about the first name, last name, email, password, and role.
* @property {String} firstName - The user's first name. This field is required.
* @property {String} lastName - The user's last name. This field is required.
* @property {String} profilePicture - The user's profile picture. Defaults to a specified image.
* @property {String} email - The user's email address. This field is required and must be unique.
* @property {String} password - The user's password. This field is required.
* @property {String} role - The user's role, either 'user' or 'admin'. Defaults to 'user'.
* @property {String} isDisabled - User's restriction. Defaults to false.
* @property {String} passwordResetToken - Token for the created password recovery link.
* @property {String} passwordResetExpires - Password recovery expiration time.
* @property {Date} createdAt - Timestamp of when the user was created (automatically added by Mongoose).
* @property {Date} updatedAt - Timestamp of when the user was last updated (automatically added by Mongoose).
* @author Cesar
*/
const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    profilePicture: { type: String, default: "https://i.imgur.com/aKGKRzJ.png"},
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    isDisabled: { type: Boolean, default: false},
    passwordResetToken: { type: String},
    passwordResetExpires: { type: String},
}, { timestamps: true });

export default mongoose.model('User', userSchema);