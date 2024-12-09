import mongoose from 'mongoose';

/**
* DOCU: Defines the schema for a user <br>
* It specifies the fields and their validation rules for a user record <br>
* Last Updated Date: December 6, 2024 <br>
* @constant userSchema
* @type {Schema}
* @description Defines the Mongoose schema for users, including details about the first name, last name, email, password, and role.
* @property {String} firstName - The user's first name. This field is required.
* @property {String} lastName - The user's last name. This field is required.
* @property {String} email - The user's email address. This field is required and must be unique.
* @property {String} password - The user's password. This field is required.
* @property {String} role - The user's role, either 'user' or 'admin'. Defaults to 'user'.
* @property {Date} createdAt - Timestamp of when the user was created (automatically added by Mongoose).
* @property {Date} updatedAt - Timestamp of when the user was last updated (automatically added by Mongoose).
* @author Cesar
*/
const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
}, { timestamps: true });

export default mongoose.model('User', userSchema);