const express = require('express');
const router = express.Router();
const Cart = require('../schemas/cartSchema');
// const verifyToken = require('../middlewares/authMiddleware')

router.post('/add', async (req, res) => {
    const {userId, serviceId, quantity = 1} = req.body;
    const qty = parseInt(quantity);
    try {
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

module.exports = router;

