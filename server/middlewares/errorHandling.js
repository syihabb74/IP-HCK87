const errorHandling = (err,_req,res,_next) => {
    console.log(err)
    if (!err || typeof err !== 'object') {
        return res.status(500).json({message : 'Internal Server Error'});
    }
    if (err.name === 'JsonWebTokenError') return res.status(401).json({message : 'Invalid Token'});
    if (err.name === 'BadRequest') return res.status(400).json({message : err.message || 'Bad Request'});
    if (err.name === 'Unauthorized') return res.status(401).json({message : err.message || 'Unauthorized'});
    if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
        const message = err.errors && err.errors[0] && err.errors[0].message ? err.errors[0].message : 'Validation Error';
        return res.status(400).json({message});
    }
    if (err.name === 'NotFound') return res.status(404).json({message : err.message || 'Not Found'});
    return res.status(500).json({message : 'Internal Server Error'});

}


module.exports = {errorHandling};