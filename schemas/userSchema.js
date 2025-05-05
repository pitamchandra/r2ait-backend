const mongoose = require("mongoose")

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
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
        role: {
            type: String,
            enum: ['user', "admin"],
            default: "user"
        },
        imageUrl: {
            type: String
        }
    },
    { timestamps: true }
)

const User = mongoose.model('user', userSchema)

module.exports = User