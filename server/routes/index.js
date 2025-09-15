const router = require('express').Router();
const { errorHandling } = require('../middlewares/errorHandling');
const users = require('./users');


router.use(users);


router.use(errorHandling)
module.exports = router