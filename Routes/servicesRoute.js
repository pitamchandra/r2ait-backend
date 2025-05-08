const express = require('express')
const Service = require('../schemas/serviceSchema')
const {verifyToken, isAdmin} = require('../middlewares/authMiddleware')

const router = express.Router()

router.post('/', verifyToken, isAdmin, async (req, res) => {
    try {
        const service = Service(req.body)
        await service.save()
        res.status(201).json({
            status: "Success",
            message: "service added successfully",
            data: service
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
        const services = await Service.find({}, {_id: 0,}).populate('service_category')
        res.status(200).json({
            status: "Success",
            message: "services getting successfully",
            data: services
        })
    } catch (err) {
        res.status(500).json({
            status: "failed",
            message: err.message
        })
    }
})

router.get('/:id', async (req, res) => {
    const { id } = req.params
    try {
        const service = await Service.findById(id)
        res.status(200).json({
            status: "Success",
            message: "Service getting successfully",
            data: service
        })
    } catch (err) {
        res.status(500).json({
            status: "failed",
            message: err.message
        })
    }
})

router.patch('/:id', verifyToken, isAdmin, async (req, res) => {
    const { id } = req.params
    try {
        const updatedService = await Service.findByIdAndUpdate(id, req.body, {new: true})
        res.status(200).json({
            status: "Success",
            message: "Service updated successfully",
            data: updatedService
        })
    } catch (err) {
        res.status(500).json({
            status: "failed",
            message: err.message
        })
    }
})
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
    const { id } = req.params
    try {
        await Service.findByIdAndDelete(id, req.body, {new: true})
        res.status(200).json({
            status: "Success",
            message: "Service deleted successfully"
        })
    } catch (err) {
        res.status(500).json({
            status: "failed",
            message: err.message
        })
    }
})

module.exports = router;