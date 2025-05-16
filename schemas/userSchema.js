const mongoose = require("mongoose")

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true
        },
        lastName:{
            type: String,
        },
        username: {
            type: String,
            required: true,
            unique: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password:{
            type: String,
            required: true
        },
        address: {
            type: String,
        },
        role: {
            type: String,
            enum: ['user', "admin"],
            default: "user"
        },
        profileImage: {
            type: String
        },
        coverImage: String,
        deviceToken: {
            type: String,
        },
        phone: Number,
        profession: String,
        gender: String,
        website: String,
        dateOfBirth: Date
        
    },
    { timestamps: true }
)

const User = mongoose.model('user', userSchema)

module.exports = User