const { verifyToken } = require("../helpers/jwt");
const authentication = (req, _res, next) => {
    console.log(req.headers)
    if (!req.headers.authorization) {
        return next({ name: "Unauthorized", message: 'Invalid token' });
    }
    try {
        const access_token = req.headers.authorization.split(' ')[1];
        const decoded = verifyToken(access_token);
        req.user = decoded;
        console.log(req.user)
        next();
    } catch (error) {
        next(error);
    }
};

module.exports = authentication;