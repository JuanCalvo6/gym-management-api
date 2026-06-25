const membershipService = require('./membershipService');

const createMembership = async (req, res) =>{
    try {
        const membership = await membershipService.createMembership(req.body);

        res.status(201).json(membership);

    } catch (error) {
        
        res.status(error.statusCode || 500).json({error: error.message});
    }
};

const getAllMemberships = async(req, res)=>{
    try {
        const memberships =  await membershipService.getAllMemberships();

        res.status(200).json(memberships);
        
    } catch (error) {
        res.status(error.statusCode || 500).json({error : error.message});
    }
};

const getMembershipById = async (req, res)=>{
    try {
        const {id} = req.params

        const membership = await membershipService.getMembershipById(id);
        
        return res.status(200).json(membership);

    } catch (error) {
        return res.status(error.statusCode || 500).json({error : error.message});
    }
};

const updateMembership = async (req, res)=>{
    try {
        const {id} = req.params;

        const membership = await membershipService.updateMembership(id, req.body);
        
        return res.status(200).json(membership);

    } catch (error) {
        return res.status(error.statusCode || 500).json({error : error.message});
    }
};

const deactivateMembership = async (req, res)=>{
    try {
        const {id} = req.params;

        const membership = await membershipService.deactivateMembership(id);

        return res.status(200).json(membership);

    } catch (error) {
        return res.status(error.statusCode || 500).json({error : error.message});
    }
};

const activateMembership = async (req, res)=>{
    try {
        const {id} = req.params;

        const membership = await membershipService.activateMembership(id);

        return res.status(200).json(membership);

    } catch (error) {
        return res.status(error.statusCode || 500).json({error : error.message});
    }
};

module.exports = {
    createMembership,
    getAllMemberships,
    getMembershipById,
    updateMembership,
    deactivateMembership,
    activateMembership
}