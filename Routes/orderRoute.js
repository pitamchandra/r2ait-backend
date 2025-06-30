const express = require('express');
const router = express.Router();
const Order = require('../schemas/orderSchema');
const Cart = require('../schemas/cartSchema');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');
const { successResponse, errorResponse } = require('../utils/responseHandler')

router.post('/create', verifyToken, async (req, res) => {
    const { userId } = req.body;
    try {
        const cart = await Cart.findOne({ user: userId }).populate('items.service');
        if(!cart || cart.items.length === 0){
            errorResponse(res, "cart is empty", {}, 404)
        }
        const totalAmount = cart.items.reduce((accumulator, item) => {
            return accumulator + (item.service.price * item.quantity)
        }, 0);

        const newOrder = new Order({
            user: userId,
            items: cart.items,
            status: 'pending',
            totalAmount
        })

        await newOrder.save()
        await Cart.findOneAndDelete({user: userId})
        successResponse(res, "Order Placed Successfully", newOrder, 201 )
    } catch (error) {
        errorResponse(res, "data fetching failed", error.message)
    }

})

router.get('/user/:userId', verifyToken, async (req, res) => {
    const {userId} = req.params;
    try {
        const orders = await Order.findOne({user: userId}).populate("items.service");
        if(!orders.items || orders.items <= 0){
            return errorResponse(res, "order is empty", {}, 404);
        }
        successResponse(res, "orders fetching successfully" , orders)
    } catch (error) {
        errorResponse(res, "data fetching error", error.message)
    }
})

router.get('/all', verifyToken, async (req, res) => {
    try {
        const orders = await Order.find().populate('user').populate('items.service');
        if(!orders.items || orders.items <= 0){
            return errorResponse(res, "order is empty", {}, 404);
        }
        successResponse(res, "orders fetching successfully" , orders)

    } catch (error) {
        errorResponse(res, "data fetching error", error.message)
    }
})

router.patch('/:id', verifyToken, isAdmin, async(req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        const updatedOrder = await Order.findByIdAndUpdate(id, {status}, { new : true})
        if (!updatedOrder) {
            return errorResponse(res, "order not found");
        }
        successResponse(res, "status updated successfully", updatedOrder)
        
    } catch (error) {
        errorResponse(res, "data fetching error", error.message)
    }
})

module.exports = router;