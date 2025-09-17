const { Hooks } = require("sequelize/lib/hooks");
const { comparePassword } = require("../helpers/bcrypt");
const { signToken } = require("../helpers/jwt");
const { User, Profile } = require("../models");
const { OAuth2Client } = require('google-auth-library');

class UserController {

    static async register(req, res, next) {

        try {

            if (!req.body) return next({ name: 'BadRequest', message: 'Invalid input' });
            const { fullName, email, username } = req.body;
            await User.create({ fullName, email, password });
            res.status(200).json({ message: 'Register Successfully' })

        } catch (error) {

            next(error)

        }

    }

    static async login(req, res, next) {

        try {

            if (!req.body) return next({ name: 'BadRequest', message: 'Invalid input' });
            const { email, password } = req.body;
            if (!email) return next({ name: 'BadRequest', message: 'Email is required' });
            if (!password) return next({ name: 'BadRequest', message: 'Password is required' });
            const isUserExist = await User.findOne({
                where: {
                    email: email
                }
            });
            if (!isUserExist) return next({ name: 'Unauthorized', message: 'Invalid email / password' });
            const isValidPassword = comparePassword(password, isUserExist.password);
            if (!isValidPassword) return next({ name: 'Unauthorized', message: 'Invalid email / password' });
            const access_token = signToken({ id: isUserExist.id, email: isUserExist.email });
            return res.status(200).json({ access_token });

        } catch (error) {

            next(error)

        }

    }

    static async googleSignIn(req, res, next) {
        if (!req.body) return next({name : 'BadRequest', message : 'Invalid google token'})
        try {
            const { googleToken } = req.body;
            if (!googleToken) {
                throw { name: 'BadRequest', message: 'Google token is required' }
            }
            const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
            const ticket = await client.verifyIdToken({
                idToken: googleToken,
                audience: process.env.GOOGLE_CLIENT_ID
            })
            const payload = ticket.getPayload()

            const [user, created] = await User.findOrCreate({
                where: { email: payload.email },
                defaults: {
                    fullName: payload.name,
                    email: payload.email,
                    password: Math.random().toString(36).slice(-8),
                }
            })

            if (created === 201) {
                await User.runHooks('afterCreate', user, {})
            }
            res.status(created ? 201 : 200).json({
                access_token: signToken({ id: user.id })
            })
        } catch (err) {
            next(err);
        }
    }
    

    static async updateProfileUser () {

        if (!req.body) return next({name: 'BadRequest', message : 'Invalid input'})

        try {

            const {username,email,fullName} = req.body;
            const user = await User.findOne({where : {email}});
            await user.update({email, fullName});
            const profile = await User.findOne({where : req.user.id});
            await profile.update({username})
            res.status(200).json({user,profile})

        } catch (error) {
            
            next(error)

        }

    }

}

module.exports = UserController