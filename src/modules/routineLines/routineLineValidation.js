const AppError = require('../../utils/AppError');

const validateCreateRoutineLine = (req, res, next) =>{
    const {
        exercise,
        repetitions,
        sets,
        rest
    } = req.body;

    try {
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
    const {
        exercise,
        repetitions,
        sets,
        rest
    } = req.body;

    try {
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