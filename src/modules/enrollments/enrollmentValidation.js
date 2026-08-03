const AppError = require('../../utils/AppError');

const validateEnrollment = (req, res, next) =>{
    const {
        membershipId,
        startDate,
        endDate
    } = req.body;

    try {
        //required fields
        if(!membershipId || !startDate || !endDate)
            throw new AppError('Missing required fields', 400);

        //membership
        if(!Number.isInteger(Number(membershipId)))
            throw new AppError('Invalid membership id', 400);

        //Date
        if(isNaN(Date.parse(startDate)))
            throw new AppError('Invalid start date', 400);

        if(isNaN(Date.parse(endDate)))
            throw new AppError('Invalid end date', 400);

        const start = new Date(startDate);
        const end = new Date(endDate);
        if(end <= start)
            throw new AppError('End date must be after start date', 400);

        next();
    } catch (error) {
        res.status(error.statusCode || 500).json({error : error.message})
    }
};

module.exports = {validateEnrollment};