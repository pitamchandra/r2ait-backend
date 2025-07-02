const successResponse = (res, message = 'success', data = {}, statusCode = 200) => {
    return res.status(statusCode).json({
        status: "success",
        message: message,
        data: data
    })
}
const errorResponse = (res, message = "Error", error = {}, statusCode = 500) => {
    return res.status(statusCode).json({
        status: 'failed',
        message: message,
        error,
    })
}
module.exports = {successResponse, errorResponse};