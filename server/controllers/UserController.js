const { comparePassword } = require("../helpers/bcrypt");
const { signToken } = require("../helpers/jwt");
const {User} = require("../models");

class UserController {

    static async register (req,res,next) {

        try {

            if (!req.body) return next({name : 'BadRequest', message : 'Invalid input'});
            const {fullName, email, password} = req.body;
            await User.create({fullName, email, password});
            res.status(200).json({message: 'Register Successfully'})

        } catch (error) {
            
            next(error)

        }

    }

    static async login (req,res,next) {

        try {

            if (!req.body) return next({name : 'BadRequest', message : 'Invalid input'});
            const {email, password} = req.body;
            if (!email) return next({name : 'BadRequest', message : 'Email is required'});
            if (!password) return next({name : 'BadRequest', message : 'Password is required'});
            const isUserExist = await User.findOne({where : {
                email : email
            }});
            if (!isUserExist) return next({name : 'Unauthorized', message : 'Invalid email / password'});
            const isValidPassword = comparePassword(password, isUserExist.password);
            if (!isValidPassword) return next({name : 'Unauthorized', message : 'Invalid email / password'});
            const access_token = signToken({id : isUserExist.id, email : isUserExist.email});
            return res.status(200).json({access_token});
            
        } catch (error) {
            
            next(error)

        }

    }
}

module.exports = UserController