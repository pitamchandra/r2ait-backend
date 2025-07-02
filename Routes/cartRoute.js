const express = require('express');
const router = express.Router();
const Cart = require('../schemas/cartSchema');
const mongoose  = require('mongoose');
const { errorResponse } = require('../utils/responseHandler');
const User = require('../schemas/userSchema');
const serviceSchema = require('../schemas/serviceSchema');
// const verifyToken = require('../middlewares/authMiddleware')

router.post('/add', async (req, res) => {
    const {userId, serviceId, quantity = 1} = req.body;
    const qty = parseInt(quantity);
    if(!mongoose.Types.ObjectId.isValid(userId)){
        return errorResponse(res, 'invalid user id', {}, 400)
    }
    if(!mongoose.Types.ObjectId.isValid(serviceId)){
        return errorResponse(res, 'invalid service id')
    }
    try {
        const userExists = await User.findById(userId)
        if(!userExists) {
            return errorResponse(res, "user not found", {}, 404)
        }
        const serviceExists = await serviceSchema.findById(serviceId);
        if(!serviceExists){
            return errorResponse(res, "service not found", {}, 404)
        }

        let cart = await Cart.findOne({user : userId});
        
        if(!cart){
            console.log("cart empty");
            cart = new Cart({
                user: userId,
                items: [{service: serviceId, qty}]
            })
        }else{
            console.log('cart ache');
            // console.log(cart);
            const itemIndex = cart.items.findIndex(item => item.service.toString() === serviceId);
            console.log(itemIndex);
            if(itemIndex > -1){
                cart.items[itemIndex].quantity += qty;
            }else{
                cart.items.push({service: serviceId, quantity: qty})
            }
        }
        await cart.save();
        res.status(201).json({
            status: 'success',
            message: 'service added to cart',
            data: cart
        })
    } catch (err) {
        res.status(500).json({
            status: 'failed',
            message: err.message
        })
    }
})

router.get('/:userId', async (req, res) => {
    const {userId} = req.params;
    try {
        const cart = await Cart.findOne({user : userId});
        if(!cart) res.status(404).json({status: 'failed', message: 'cart is empty'})
        res.status(200).json({
            status: 'success',
            message: 'cart items getting',
            data: cart
        })
    } catch (err) {
        res.status(500).json({
            status: "success",
            message: err.message
        })
    }
})

router.patch('/update', async(req, res) => {
    const {userId, serviceId, quantity} = req.body;
    const qty = parseInt(quantity);
    try {
        const cart = await Cart.findOne({user : userId});
        if(!cart){
            return res.status(404).json({status: "failed", message: "cart not found"})
        }

        const cartIndex = cart.items.findIndex((item => item.service.toString() === serviceId))

        console.log("cart", cartIndex);
        if(cartIndex == -1){
            return res.status(404).json({status: "failed", message: "service not found in cart"})
        }

        if(cartIndex <= 0){
            cart.items.splice(cartIndex, 1);
        }else{
            cart.items[cartIndex].quantity = qty;
        }

        await cart.save();

        res.status(200).json({status: 'success', message: 'cart updated successfully', data: cart});

    } catch (error) {
        res.status(500).json({status: 'failed', message: error.message})
    }
})

router.delete('/remove', async (req, res) => {
    const {userId, serviceId} = req.body;
    
    try {
        const cart = await Cart.findOne({user : userId});
        if(!cart){
            return res.status(404).json({
                status: "failed",
                message: "cart not found"
            })
        }
        const originalLength = cart.items.length;
        cart.items = cart.items.filter((item) => item.service.toString() !== serviceId);
        
        if(cart.items.length === originalLength){
            return res.status(404).json({
                status: "failed",
                message: 'service not found in cart'
            })
        }
        await cart.save();
        res.status(200).json({
            status: "success",
            message: "service deleted successfully"
        })

    } catch (error) {
        res.status(500).json({
            status: "failed",
            message: error.message
        })
    }
})

router.delete('/clear-cart', async (req, res) => {
    const {userId} = req.body;
    try {
        const cart = await Cart.findOne({user: userId})
        if(!cart){
            res.status(404).json({
                status: 'failed',
                message: 'cart not found'
            })
        }
        cart.items = []
        await cart.save();
        res.status(200).json({
            status: 'failed',
            message: 'cart clear successfully'
        })
    } catch (error) {
        res.status(500).json({
            status: "failed",
            message: error.message
        })
    }
})

module.exports = router;
