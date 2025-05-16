const mongoose = require('mongoose');

const categorySchema = mongoose.Schema(
    {
        category_imageUrl: {
            type: String,
            required: true
        },
        category_name: {
            type: String,
            required: true,
            unique: true
        },
        category_description: {
            type: String
        },
        // services:[
        //     {
        //         type: mongoose.Schema.Types.ObjectId,
        //         ref: "service"
        //     }
        // ]
    },
    {
        timestamps: true
    }
)
module.exports = mongoose.model('category', categorySchema)