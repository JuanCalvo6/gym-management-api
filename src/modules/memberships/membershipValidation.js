const AppError = require('../../utils/AppError');

const validateMembership = (req, res, next)=>{
    const {
        name,
        start,
        end,
        price
    } = req.body;

    try {
        //required fields
        if(!name || !start || !end || !price)
            throw new AppError('Missing required fields', 400);
        
        //name
        if(name.length > 15)
            throw new AppError('Name cannot exceed 15 characters', 400);

        //time
        if(!/^([01]\d|2[0-3]):([0-5]\d)$/.test(start))
            throw new AppError('Invalid time format', 400);

        if(!/^([01]\d|2[0-3]):([0-5]\d)$/.test(end))
            throw new AppError('Invalid time format', 400);

        const [hourStart, minuteStart] = start.split(":").map(Number);
        const [hourEnd, minuteEnd] = end.split(":").map(Number);

        if(hourStart === hourEnd && minuteStart === minuteEnd)
            throw new AppError('The start and end times must be different', 400);

        if(hourEnd < hourStart || (hourStart === hourEnd && minuteStart > minuteEnd))
            throw new AppError('The end time must be later than the start time', 400);

        //price
        if(!Number.isInteger(price))
            throw new AppError('Price must be a number', 400);

        next();
    } catch (error) {
        res.status(error.statusCode || 500).json({error : error.message});
    }

};

module.exports = {validateMembership};