const mongoose = require('mongoose');
const orderSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        },
        services: {
            service: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'service'
            }
        },
        total: Number,
        status: {
            type: String,
            default: 'pending'
        }
    },
    {timestamps: true}
);

module.exports = mongoose.model('order', orderSchema);