const failureResponse = (response, statusCode, message = "") => {
    return response.status(statusCode).json({
        success: false,
        message: message,
    });
};

const successResponse = (response, statusCode = 200, message = "", data) => {
    return response.status(statusCode).json({
        success: true,
        message: message,
        data: data,
    });
};

module.exports = {
    failureResponse,
    successResponse,
};
