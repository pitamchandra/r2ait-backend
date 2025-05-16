const express = require('express');
const Category = require('../schemas/categorySchema')
const router = express.Router()
const {verifyToken, isAdmin} = require('../middlewares/authMiddleware')

router.post('/', verifyToken, isAdmin, async (req, res) => {
    try {
        const category = Category(req.body);
        await category.save()
        res.status(201).json({
            status: "success",
            message: "Category created successfully",
            data: category
        })

    } catch (err) {
        res.status(500).json({
            status: "failed",
            message: err.message
        })
    }
})
router.get('/', async (req, res) => {
    try {
        const categories = await Category.find({}).populate('')
        res.status(200).json({
            status: "success",
            message: "Categories Getting successfully",
            data: categories
        })

    } catch (err) {
        res.status(500).json({
            status: "failed",
            message: err.message
        })
    }
})
router.get('/:id', async (req, res) => {
    const {id} = req.params
    try {
        const category = await Category.findById(id)
        res.status(200).json({
            status: "success",
            message: "Category getting successfully",
            data: category
        })

    } catch (err) {
        res.status(500).json({
            status: "failed",
            message: err.message
        })
    }
})
router.patch('/:id', verifyToken, isAdmin, async (req, res) => {
    const {id} = req.params
    try {
        const updatedCategory = await Category.findByIdAndUpdate(id, req.body, {new : true})
        res.status(201).json({
            status: "success",
            message: "Category Updated successfully",
            data: updatedCategory
        })

    } catch (err) {
        res.status(500).json({
            status: "failed",
            message: err.message
        })
    }
})
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
    const {id} = req.params
    try {
        await Category.findByIdAndDelete(id)
        res.status(200).json({
            status: "success",
            message: "Category Deleted successfully"
        })

    } catch (err) {
        res.status(500).json({
            status: "failed",
            message: err.message
        })
    }
})

module.exports = router