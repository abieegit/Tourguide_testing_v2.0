const mongoose = require ('mongoose');

// Schema for storing contact / inquiry messages submitted via Contact Us
const UserSchema  = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true }
}, { timestamps: true })

// Collection name: users (keeps previous behaviour)
const UserModel = mongoose.model ('users', UserSchema)
module.exports = UserModel