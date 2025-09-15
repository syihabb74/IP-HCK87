const jwt = require('jsonwebtoken');


const signToken = (payload) => {

    return jwt.sign(payload, process.env.SECRET_KEY_JWT);

}

const verifyToken = (token) => {

    return jwt.verify(token, process.env.SECRET_KEY_JWT);

}

module.exports = {signToken, verifyToken}

