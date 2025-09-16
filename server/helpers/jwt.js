const jwt = require('jsonwebtoken');


const signToken = (payload) => {

    return jwt.sign(payload, process.env.SECRET_JWT_KEY);

}

const verifyToken = (token) => {

    return jwt.verify(token, process.env.SECRET_JWT_KEY);

}

module.exports = {signToken, verifyToken}

