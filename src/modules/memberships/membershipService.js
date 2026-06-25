const AppError = require('../../utils/AppError');
const membershipModel = require('./membershipModel');

const createMembership = async(membershipData)=>{
    
    const existingMembership = await membershipModel.findExistingMembership(membershipData.name);

    if(existingMembership)
        throw new AppError('Membership already exists', 409);

    const result = await membershipModel.createMembership(membershipData);
    
    return result;
};

module.exports = {
    createMembership
}