const AppError = require('../../utils/AppError');

const validateCreateRoutineLine = (req, res, next) =>{
    try {
        const {
            exercise,
            repetitions,
            sets,
            rest
        } = req.body;

        if(!exercise)
            throw new AppError('Missing required field', 400);
        if(exercise.length > 20)
            throw new AppError('Exercise cannot exceed 20 characters', 400);

        if(repetitions && repetitions.length > 5)
            throw new AppError('Repetitions cannot exceed 5 characters', 400);

        if(sets && !Number.isInteger(sets))
            throw new AppError('Sets must be a number', 400);

        if(rest && rest.length > 10)
            throw new AppError('Rest cannot exceed 10 characters', 400);

        next();

    } catch (error) {
        res.status(error.statusCode || 500).json({error : error.message});
    }
};

const validateUpdateRoutineLine = (req, res, next) =>{
    try {
        if (Object.keys(req.body).length === 0)
            throw new AppError('No data to update', 400);
    
        const {
            exercise,
            repetitions,
            sets,
            rest
        } = req.body;

        if(exercise && exercise.length > 20)
            throw new AppError('Exercise cannot exceed 20 characters', 400);

        if(repetitions && repetitions.length > 5)
            throw new AppError('Repetitions cannot exceed 5 characters', 400);

        if(sets && !Number.isInteger(sets))
            throw new AppError('Sets must be a number', 400);

        if(rest && rest.length > 10)
            throw new AppError('Rest cannot exceed 10 characters', 400);

        next();

    } catch (error) {
        res.status(error.statusCode || 500).json({error : error.message});
    }
};

module.exports = {
    validateCreateRoutineLine,
    validateUpdateRoutineLine
};