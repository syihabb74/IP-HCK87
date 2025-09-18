const { Wallet } = require('../models');

const authorization = async (req, res, next) => {
    if (!req.user) {
        return res.status(403).json({ name: 'Forbidden', message: 'Access Forbidden' });
    }
    const user = req.user;

    if (!req.params.id) return next({ name: 'BadRequest', message: 'Invalid input' });

    try {

        const { id } = req.params;

        const wallet = await Wallet.findByPk(id);

        if (!wallet) {
            return res.status(404).json({ name: 'NotFound', message: 'Wallet not found' });
        }

        if (wallet.UserId !== user.id) {
            return res.status(403).json({ name: 'Forbidden', message: 'Access Forbidden' });
        }
        next();

    } catch (error) {
        next(error);
    }

};





module.exports = authorization;