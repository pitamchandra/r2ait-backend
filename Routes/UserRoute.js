
const express = require('express')
const router = express.Router()
const User = require('../schemas/userSchema')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware')

router.post("/signup", async (req, res) => {
    try {
        const {firstName, username, email, password, role, imageUrl} = req.body;
        const hashPassword = await bcrypt.hash(password, 10)
        const newUser = User({
            firstName, username, email, password: hashPassword, role, imageUrl
        })
        await newUser.save()
        res.status(201).json({
            status: "success",
            message: "New User signup successfully",
            data: newUser
        })
    } catch (err) {
        res.status(500).json({
            status: "failed",
            message: err.message
        })
    }
})
router.post("/login", async (req, res) => {
    const {user_or_mail, password, deviceToken} = req.body;

    try {
        const user = await User.find({
            $or: [
                {username: user_or_mail},
                {email: user_or_mail}
            ]
        });
        if(user && user.length > 0 ){
            const isValidUser = await bcrypt.compare(password, user[0].password);
            if(isValidUser){
                const token = jwt.sign(
                    {
                        name: user[0].name,
                        userId: user[0]._id
                    },
                    process.env.SECRET_KEY,
                    {
                        expiresIn: '1h'
                    }
                )
                res.status(200).json({
                    status: "success",
                    message: "login successful",
                    id: user[0]._id,
                    role: user[0].role,
                    access: token
                })
            }else{
                res.status(401).json({
                    status: "failed",
                    message: "Authentication Error"
                })
            }
        }else{
            res.status(401).json({
                status: "failed",
                message: "Authentication Error"
            })
        }
    } catch (err) {
        res.status(500).json({
            status: "failed",
            message: err.message
        })
    }
})
router.patch("/:id", verifyToken, async(req, res) => {
    const { id } = req.params;
    const { firstName, lastName, username, email, password, address, role, profileImage, coverImage, phone, profession, gender, website, dateOfBirth } = req.body;
    console.log("params id", id);
    try {
        const updatedData = {}
        if(password){
            const hashPassword = await bcrypt.hash(password, 10)
            updatedData.password = hashPassword
        }
        if(firstName) updatedData.firstName = firstName;
        if(lastName) updatedData.lastName = lastName;
        if(username) updatedData.username = username;
        if(email) updatedData.email = email;
        if(address) updatedData.address = address;
        if(role) updatedData.role = role;
        if(profileImage) updatedData.profileImage = profileImage;
        if(coverImage) updatedData.coverImage = coverImage;
        if(phone) updatedData.phone = phone;
        if(profession) updatedData.profession = profession;
        if(gender) updatedData.gender = gender;
        if(website) updatedData.website = website;
        if(dateOfBirth) updatedData.dateOfBirth = website;
        if(Object.keys(updatedData).length > 0){
            const updatedUser = await User.findByIdAndUpdate(id, updatedData, {new: true})
            console.log(updatedUser);
            
            if(updatedUser){
                res.status(200).json({
                    status: "success",
                    message: "User updated successfully",
                    data: updatedUser
                });
            }else{
                res.status(404).json({
                    status: "failed",
                    message: "User not found"
                });
            }
        }else{
            res.status(404).json({
                status: "failed",
                message: "update data can't be empty"
            });
        }
    } catch (err) {
        res.status(500).json({
            status: "failed",
            message: err.message
        })
    }
})
router.get('/all', async (req, res) => {
    try {
        const allUsers = await User.find()
        res.status(200).json({
            status: "success",
            message: "users getting successfully",
            data: allUsers
        })
    } catch (err) {
        res.status(500).json({
            status: "failed",
            message: err.message
        })
    }
})
router.get('/all/:username', async (req, res) => {
    const { username } = req.params;
    console.log("request username",username);
    try {
        const exists = await User.find({username: username})
        if(exists.length > 0){
            res.status(200).json({
                message: "exist the username",
                valid: true
            })
        }else{
            res.status(200).json({
                message: "doesn't exist the username",
                valid: false
            })
        }
    } catch (err) {
        res.status(500).json({
            status: "failed",
            message: err.message
        })
    }
})
router.get('/admin', verifyToken, isAdmin, async (req, res) => {
    try {
        const admins = await User.find({role: "admin"})
        res.status(200).json({
            status: "success",
            message: "admin getting successfully",
            data: admins
        })
    } catch (err) {
        res.status(500).json({
            status: "failed",
            message: err.message
        })
    }
})
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.find({_id: id})
        if(user){
            res.status(201).json({
                status: "success",
                message: "user getting successful",
                data: user
            })
        }else{
            res.status(404).json({
                status: "failed",
                message: "user not found"
            })
        }
        
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
        const deletedUser = await User.findByIdAndDelete(id)
        if(deletedUser){
            res.status(200).json({
                status: "success",
                message: "User deleted successfully"
            });
        }else{
            res.status(404).json({
                status: "failed",
                message: "user not found"
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