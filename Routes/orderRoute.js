const express = require('express');
const router = express.Router();
const Order = require('../schemas/orderSchema');
const Cart = require('../schemas/cartSchema');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');
const { successResponse, errorResponse } = require('../utils/responseHandler')
const SSLCommerzPayment = require('sslcommerz-lts')
const store_id = process.env.Store_ID
const store_passwd = process.env.Store_Key
const is_live = false //true for live, false for sandbox
const { ObjectId } = require('mongodb')

router.post('/create', verifyToken, async (req, res) => {
    const { userId } = req.body;
    try {
        const cart = await Cart.findOne({ user: userId }).populate('items.service');
        if(!cart || cart.items.length === 0){
            return errorResponse(res, "cart is empty", {}, 404)
        }
        // console.log("my cart", cart);
        const totalAmount = cart.items.reduce((accumulator, item) => {
            return accumulator + (item.service.price * item.quantity)
        }, 0);
        
        const tran_id = new ObjectId().toString();
        
        const data = {
        total_amount: totalAmount,
        currency: 'BDT',
        tran_id: tran_id, // use unique tran_id for each api call
        success_url: `http://localhost:3000/order/payment/success/${tran_id}`,
        fail_url:`http://localhost:3000/order/payment/fail/${tran_id}`,
        cancel_url: 'http://localhost:3030/cancel',
        ipn_url: 'http://localhost:3030/ipn',
        shipping_method: 'Courier',
        product_name: "sdflkjsd",
        product_category: 'Electronic',
        product_profile: 'general',
        cus_name: 'Customer Name',
        cus_email: 'customer@example.com',
        cus_add1: 'Dhaka',
        cus_add2: 'Dhaka',
        cus_city: 'Dhaka',
        cus_state: 'Dhaka',
        cus_postcode: '1000',
        cus_country: 'Bangladesh',
        cus_phone: '01711111111',
        cus_fax: '01711111111',
        ship_name: 'Customer Name',
        ship_add1: 'Dhaka',
        ship_add2: 'Dhaka',
        ship_city: 'Dhaka',
        ship_state: 'Dhaka',
        ship_postcode: 1000,
        ship_country: 'Bangladesh',
    };
    // console.log(data);
    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
        sslcz.init(data).then(async apiResponse => {
            let GatewayPageURL = apiResponse.GatewayPageURL;
            console.log("url", GatewayPageURL);
            const newOrder = new Order({
                user: userId,
                items: cart.items,
                status: 'pending',
                totalAmount,
                transactionId: tran_id
            })
            await newOrder.save();
            // await Cart.findOneAndDelete({ user: userId });
            res.status(201).json({
                status: 'success',
                message: 'Redirecting to payment gateway...',
                order: newOrder,
                url: GatewayPageURL
            });
        }).catch(err => {
            return errorResponse(res, "Payment initialization failed", err.message);
        });

    } catch (error) {
        errorResponse(res, "data fetching failed", error.message)
    }

})
router.post('/payment/success/:tranId', async (req, res) => {
    try {
        const { tranId } = req.params;
        const updatedOrder = await Order.findOneAndUpdate({transactionId: tranId}, { status: "confirmed"}, { new: true })
        if(updatedOrder.status !== "confirmed"){
            return errorResponse(res, "payment not confirmed")
        }
        res.redirect(`http://localhost:5173/order/payment/success/${tranId}`)
    } catch (error) {
        errorResponse(res, "transaction id not matching", error, 404)
    }
})

router.post('/payment/fail/:tranId', async (req, res) => {
    try {
        const { tranId } = req.params;
        // const deletedOrder = await Order.findOneAndDelete({transactionId: tranId})
        // console.log("deleted Order", deletedOrder);
        // if(updatedOrder.status){
        //     return errorResponse(res, "payment not confirmed")
        // }
        res.redirect(`http://localhost:5173/order/payment/fail/${tranId}`)
    } catch (error) {
        errorResponse(res, "transaction id not matching", error.message, 404)
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