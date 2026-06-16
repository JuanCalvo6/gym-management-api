const AppError = require('../../utils/AppError');

const validatePassword = (req, res, next) => {
    const {password} = req.body;

    if(!password)
        throw new AppError('Missing required fields', 400);

    if(password.length < 6)
            throw new AppError('Password must have at least 6 characters', 400);
        
    if(password.length > 60)
        throw new AppError('Password cannot exceed 60 characters', 400);

    next();
};

module.exports = {validatePassword};