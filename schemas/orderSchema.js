const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    items: [
        {
            service : {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'service'
            },
            quantity: {
                type: Number,
                default: 1
            }
        }
    ],
    status: {
        type: String,
        enum: ["pending", "confirmed", "completed", "cancelled"],
        default: "pending"
    },
    totalAmount : {
        type: Number,
        required: true
    },
    transactionId : {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const orderModel = mongoose.model('order', orderSchema);

module.exports = orderModel;

