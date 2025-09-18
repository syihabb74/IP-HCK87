const { verifyToken } = require("../helpers/jwt");
const authentication = (req, _res, next) => {
    if (!req.headers.authorization) {
        return next({ name: "Unauthorized", message: 'Invalid token' });
    }
    try {
        const access_token = req.headers.authorization.split(' ')[1];
        if (!access_token) {
            return next({ name: "Unauthorized", message: 'Invalid token' });
        }
        const decoded = verifyToken(access_token);
        if (!decoded) {
            return next({ name: "Unauthorized", message: 'Invalid token' });
        }
        req.user = decoded;
        next();
    } catch (error) {
        next(error);
    }
};

module.exports = authentication;