const AppError = require('../../utils/AppError');
const membershipModel = require('./membershipModel');

const createMembership = async(membershipData)=>{
    
    const existingMembership = await membershipModel.findExistingMembership(membershipData.name);

    if(existingMembership)
        throw new AppError('Membership already exists', 409);

    const result = await membershipModel.createMembership(membershipData);
    
    return result;
};

const getAllMemberships = async()=>{
    const memberships = await membershipModel.getAllMemberships();

    return memberships;
};

const getMembershipById = async(id)=>{
    if(isNaN(id))
        throw new AppError('Invalid membership id', 400);

    const membership = await membershipModel.getMembershipById(id);

    if(!membership)
        throw new AppError('Membership not found', 404);

    return membership;
};

const updateMembership = async(id, membershipData)=>{
    await getMembershipById(id);

    const duplicatedMembership = await membershipModel.findMembershipByUniqueData(id, membershipData.name);

    if(duplicatedMembership)
        throw new AppError('Membership data already exists', 409);

    const membership = await membershipModel.updateMembership(id, membershipData);

    return membership;
};

const deactivateMembership = async(id)=>{
    const membership = await getMembershipById(id);

    if(membership.estado === 'B')
        throw new AppError('Membership is already inactive', 409);

    await membershipModel.updateMembershipStatus(id, 'B');

    return {message: 'Membership deactivated successfully'};
};

const activateMembership = async(id)=>{
    const membership = await getMembershipById(id);

    if(membership.estado === 'A')
        throw new AppError('Membership is already active', 409);

    await membershipModel.updateMembershipStatus(id, 'A');

    return {message: 'Membership activated successfully'};
};

module.exports = {
    createMembership,
    getAllMemberships,
    getMembershipById,
    updateMembership,
    deactivateMembership
}