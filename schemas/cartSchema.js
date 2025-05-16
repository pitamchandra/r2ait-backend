const mongoose = require('mongoose');

const cartSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        },
        items: [
            {
                service: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'service'
                },
                quantity: {
                    type: Number,
                    default: 1
                }
            }
        ]
    }, 
    {
        timestamps: true
    }
);

module.exports = mongoose.model('cart', cartSchema);