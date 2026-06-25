const { end } = require('../../src/config/db');
const membershipModel = require('../../src/modules/memberships/membershipModel');
const membershipService = require('../../src/modules/memberships/membershipService');

jest.mock('../../src/modules/memberships/membershipModel');

describe('createMembership',()=>{
    it('Should create a membership successfully', async()=>{
        const membership = {
            name : "membership1",
            start : "10:00",
            end : "12:00",
            price : 15000
        };

        membershipModel.findExistingMembership.mockResolvedValue(null);
        membershipModel.createMembership.mockResolvedValue({id : 1});

        const result = await membershipService.createMembership(membership);

        expect(result).toEqual({id : 1});

    });

    it('Should fails if membership is already exists', async()=>{
        membershipModel.findExistingMembership.mockResolvedValue({nombre : 'membership1'});

        await expect(membershipService.createMembership({
            name : "membership1",
            start : "10:00",
            end : "12:00",
            price : 15000
        })).rejects.toThrow('Membership already exists');
    });

    
});

