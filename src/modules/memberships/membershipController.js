const membershipService = require('./membershipService');

const createMembership = async (req, res) =>{
    try {
        const membership = await membershipService.createMembership(req.body);

        res.status(201).json(membership);

    } catch (error) {
        
        res.status(error.statusCode || 500).json({error: error.message});
    }
};


module.exports = {
    createMembership
}