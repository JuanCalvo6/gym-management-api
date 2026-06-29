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

describe('getAllMemberships', ()=>{
    it('Should return all memberships', async()=>{
        const mockMemberships = [
            {
                id: 1,
                nombre : 'member1',
                horaInicio : '08:00',
                horaFin : '12:00',
                precio: 10000
            },
            {
                id: 2,
                nombre : 'member1',
                horaInicio : '12:00',
                horaFin : '20:00',
                precio: 10000
            }
        ];

        membershipModel.getAllMemberships.mockResolvedValue(mockMemberships);

        const result = await membershipService.getAllMemberships();

        expect(result).toEqual(mockMemberships);
        expect(membershipModel.getAllMemberships).toHaveBeenCalled();

    });
});

describe('getMembershipById', ()=>{
    it('Should return membership by id', async()=>{
        const membership = {
            id : 1,
            nombre : 'member1',
            horaInicio : '08:00',
            horaFin : '12:00',
            precio : 15000
        };

        membershipModel.getMembershipById.mockResolvedValue(membership);

        const result = await membershipService.getMembershipById(1);

        expect(result).toEqual(membership);
    });

    it('Should fail if id is not a number', async()=>{
        await expect(membershipService.getMembershipById('abc'))
            .rejects.toThrow('Invalid membership id');
        
    });

    it('Should fail if membership does not exist', async()=>{
        membershipModel.getMembershipById.mockResolvedValue(null);

        await expect(membershipService.getMembershipById(999))
            .rejects.toThrow('Membership not found');
    });
});

describe('updateMembership', ()=>{
    it('Should update membership successfully', async()=>{
        membershipModel.getMembershipById.mockResolvedValue({
            id : 1
        });

        membershipModel.findMembershipByUniqueData.mockResolvedValue(null);
        membershipModel.updateMembership.mockResolvedValue({id : 1});

        const result = await membershipService.updateMembership(
            1,
            {
                name : 'membership1',
                start : '07:00',
                end  : '12:30',
                price : 15500
            });

        expect(result).toEqual({id : 1});
        expect(membershipModel.updateMembership).toHaveBeenCalled();
    });

    it('Should fail if id is not a number', async()=>{
        await expect(
            membershipService.updateMembership(
                'abc',
                {}
            )
        ).rejects.toThrow('Invalid membership id');
    });

    it('Should fail if membership does not exist', async()=> {
        membershipModel.getMembershipById.mockResolvedValue(null);

        await expect(
            membershipService.updateMembership(
                999,
                {}
            )
        ).rejects.toThrow('Membership not found');
    });

    it('Should fail if unique data already exists', async()=>{
        membershipModel.getMembershipById.mockResolvedValue({id : 1});
        membershipModel.findMembershipByUniqueData.mockResolvedValue({id : 2});

        await expect(
            membershipService.updateMembership(
                1,
                {
                name : 'membership1',
                start : '07:00',
                end  : '12:30',
                price : 15500
                }
            )
        ).rejects.toThrow('Membership data already exists')


    });
});

describe('deactivateMembership', ()=>{
    it('Should deactivate membership', async()=>{
        membershipModel.getMembershipById.mockResolvedValue({id : 1});
        membershipModel.updateMembershipStatus.mockResolvedValue();

        const result = await membershipService.deactivateMembership(1);

        expect(result).toEqual({
            message: 'Membership deactivated successfully'
        });
    });

    it('Should fail if membership is already deactivate', async()=>{
        membershipModel.getMembershipById.mockResolvedValue({
            id :  1,
            estado : 'B'
        });

        await expect(membershipService.deactivateMembership(1))
            .rejects.toThrow('Membership is already inactive');
    });
});

describe('activateMembership', ()=>{
    it('Should activate membership', async()=>{
        membershipModel.getMembershipById.mockResolvedValue({id : 1});
        membershipModel.updateMembershipStatus.mockResolvedValue();

        const result = await membershipService.activateMembership(1);

        expect(result).toEqual({
            message: 'Membership activated successfully'
        });
    });

    it('Should fail if membership is already activate', async()=>{
        membershipModel.getMembershipById.mockResolvedValue({
            id :  1,
            estado : 'A'
        });

        await expect(membershipService.activateMembership(1))
            .rejects.toThrow('Membership is already active');
    });
});