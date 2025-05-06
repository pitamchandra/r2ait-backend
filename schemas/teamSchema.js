const mongoose = require('mongoose');
const teamSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        title: {
            type: String
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        phone: {
            type: Number
        },
        imageUrl: {
            type: String,
            required: true
        }
    },
    {timestamps: true}
)

const User = mongoose.model('team', teamSchema)
module.exports = User;