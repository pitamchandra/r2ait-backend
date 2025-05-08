const jwt = require('jsonwebtoken')
const User = require('../schemas/userSchema')
const verifyToken = async (req, res, next) => {
    const { authorization } = req.headers
    if(!authorization){
        return res.status(401).json({
            status: "failed",
            message: "Unauthorized"
        })
    }

    const token = authorization.split(' ')[1]

    try {
        const decode = jwt.verify(token, process.env.SECRET_KEY);
        const user = await User.findById(decode.userId)
        // console.log(user);
        if(!user){
            return res.status(401).json({
                status: "failed",
                message: "user not found"
            })
        }
        req.user = user;
        next()
    } catch (err) {
        return res.status(500).json({
            status: "failed",
            message: err.message
        })
    }
}
const isAdmin = async (req, res, next) => {
    const {role} = req.user
    if(role !== 'admin'){
        return res.status(401).json({
            status: 'failed',
            message: "Access denied admin only"
        })
    }
    next()
}

module.exports = { verifyToken, isAdmin };