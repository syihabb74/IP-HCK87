const bcrypt = require('bcryptjs');

const hashPassword = (plainPassword) => {

    return bcrypt.hashSync(plainPassword, 10);

}


const comparePassword = (inputUserPassword, hashedPassword) => {

    return bcrypt.compareSync(inputUserPassword, hashedPassword)

}

module.exports = {hashPassword, comparePassword}