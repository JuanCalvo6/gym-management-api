const AppError = require('../../utils/AppError');

const validateCreateRutine = (req, res, next) =>{
    const {
        name,
        notes
    } = req.body;

    try {
        if(!name)
            throw new AppError('Missing require fields', 400);
        if(name.length > 45)
            throw new AppError('Name cannot exceed 45 characters', 400);

        if(notes && notes.length > 45)
            throw new AppError('Notes cannot exceed 45 characters', 400);
        next();

    } catch (error) {
        res.status(error.statusCode || 500).json({error : error.message});
    }
};

const validateUpdateRutine = (req, res, next) =>{
    const {name, notes} = req.body;

    try {
        if(name !== undefined && name.length > 45)
            throw new AppError('Name cannot exceed 45 characters', 400);

        if(notes !== undefined && notes.length > 45)
            throw new AppError('Notes cannot exceed 45 characters', 400);

        next();

    } catch(error) {
        res.status(error.statusCode || 500).json({error : error.message});
    }
};

module.exports = {
    validateCreateRutine,
    validateUpdateRutine
};