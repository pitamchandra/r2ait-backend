const express = require('express');
const router = express.Router();
const Team = require('../schemas/teamSchema')
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware')

router.post("/", verifyToken, isAdmin, async (req, res) => {
    try {
        const team = Team(req.body)
        await team.save()
        res.status(201).json({
            status: "success",
            message: "team member added successfully",
            data: team
        })
    } catch (err) {
        res.status(500).json({
            status: "failed",
            message: err.message
        })
    }
})
router.get("/", async (req, res) => {
    try {
        const teams = await Team.find({})
        res.status(200).json({
            status: "success",
            message: "team members getting successfully",
            data: teams
        })

    } catch (err) {
        res.status(500).json({
            status: "failed",
            message: err.message
        })
    }
})
router.get("/:id", async (req, res) => {
    const {id} = req.params
    try {
        const team = await Team.findById(id)
        if(team){
            res.status(200).json({
                status: "success",
                message: "team member getting successfully",
                data: team
            })
        }else{
            res.status(404).json({
                status: "failed",
                message: "team member not found"
            })
        }

    } catch (err) {
        res.status(500).json({
            status: "failed",
            message: err.message
        })
    }
})
router.patch("/:id", verifyToken, isAdmin, async (req, res) => {
    const {id} = req.params
    try {
        const team = await Team.findByIdAndUpdate(id, req.body, {new : true})
        if(team){
            res.status(200).json({
                status: "success",
                message: "team member updated successfully",
                data: team
            })
        }else{
            res.status(404).json({
                status: "failed",
                message: "team member not found"
            })
        }

    } catch (err) {
        res.status(500).json({
            status: "failed",
            message: err.message
        })
    }
})
router.delete("/:id", verifyToken, isAdmin, async (req, res) => {
    const {id} = req.params
    try {
        const team = await Team.findByIdAndDelete(id)
        if(team){
            res.status(200).json({
                status: "success",
                message: "team member deleted successfully",
                data: team
            })
        }else{
            res.status(404).json({
                status: "failed",
                message: "team member not found"
            })
        }

    } catch (err) {
        res.status(500).json({
            status: "failed",
            message: err.message
        })
    }
})

module.exports = router;