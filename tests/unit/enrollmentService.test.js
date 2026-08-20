const enrollmentModel = require('../../src/modules/enrollments/enrollmentModel');
const enrollmentService = require('../../src/modules/enrollments/enrollmentService');
const clientService = require('../../src/modules/clients/clientService');
const membershipService = require('../../src/modules/memberships/membershipService');


jest.mock('../../src/modules/clients/clientService');
jest.mock('../../src/modules/memberships/membershipService');
jest.mock('../../src/modules/enrollments/enrollmentModel');

describe('createEnrollment', ()=>{
    it('Should create a enrollment successfully', async()=>{
        const enrollmentData = {
            membershipId : 1,
            startDate : "2025-1-1",
            endDate : "2025-2-1"
        };

        clientService.getClientById.mockResolvedValue({
            id : 1,
            estado : 'A'
        });

        membershipService.getMembershipById.mockResolvedValue({
            estado : 'A',
            precio : 12000
        });

        enrollmentModel.getActiveEnrollmentsByClient.mockResolvedValue([]);
        enrollmentModel.createEnrollment.mockResolvedValue({id : 1});

        const result = await enrollmentService.createEnrollment(
            1,
            2,
            enrollmentData
        );

        expect(result).toEqual({id : 1})
    });

    it('Should fail if client is inactive', async()=>{
        const enrollmentData = {
            membershipId : 1,
            startDate : "2025-1-1",
            endDate : "2025-2-1"
        };

        clientService.getClientById.mockResolvedValue({
            id : 1,
            estado : 'B'
        });


        await expect(enrollmentService.createEnrollment(
                1,
                2,
                enrollmentData
            )
        ).rejects.toThrow('Client is inactive') ;

    });

    it('Should fail is membership is inactive', async()=>{
        const enrollmentData = {
            membershipId : 1,
            startDate : "2025-1-1",
            endDate : "2025-2-1"
        };

        clientService.getClientById.mockResolvedValue({
            id : 1,
            estado : 'A'
        });

        membershipService.getMembershipById.mockResolvedValue({
            estado : 'B',
            precio : 12000
        });

            await expect(enrollmentService.createEnrollment(
                1,
                2,
                enrollmentData
            )
        ).rejects.toThrow('Membership is inactive');
    });

    it('Should fail if enrollment dates overlap',async()=>{
        const enrollmentData = {
            membershipId : 1,
            startDate : "2026-08-15",
            endDate : "2026-09-15"
        };

        clientService.getClientById.mockResolvedValue({
            id : 1,
            estado : 'A'
        });

        membershipService.getMembershipById.mockResolvedValue({
            estado : 'A',
            precio : 12000
        });

        enrollmentModel.getActiveEnrollmentsByClient.mockResolvedValue([{
            diaInicio : '2026-08-01',
            diaFin : '2026-08-31' 
        }]);

        await expect(
            enrollmentService.createEnrollment(1,2,enrollmentData)
        ).rejects.toThrow('Enrollment dates overlap with an existing enrollment');
    });

    it('Should create enrollment if new enrollment stats after existing one ends', async()=>{
        const enrollmentData = {
            membershipId : 1,
            startDate : "2026-09-1",
            endDate : "2026-09-30"
        };

        clientService.getClientById.mockResolvedValue({
            id : 1,
            estado : 'A'
        });

        membershipService.getMembershipById.mockResolvedValue({
            estado : 'A',
            precio : 12000
        });

        enrollmentModel.getActiveEnrollmentsByClient.mockResolvedValue([{
            diaInicio : '2026-08-01',
            diaFin : '2026-08-31' 
        }]);

        enrollmentModel.createEnrollment.mockResolvedValue({id : 2});

        const result = await enrollmentService.createEnrollment(1,2, enrollmentData);

        expect(result).toEqual({id : 2});


    });
});

describe('getAllEnrollments', ()=>{
    it('Should return all enrollments', async()=>{
        const mockEnrollments = [
            {
                id : 1,
                idCliente : 1,
                idProfesor : 1,
                idPase : 2,
                diaInicio : '2025-01-25',
                diaFin : '2025-02-25',
                precio : 10000,
                estado : 'B'
            },
            {
                id : 2,
                idCliente : 4,
                idProfesor : 2,
                idPase : 1,
                diaInicio : '2026-07-1',
                diaFin : '2026-08-1',
                precio : 15000,
                estado : 'B'
            }
        ];

        enrollmentModel.getAllEnrollments.mockResolvedValue(mockEnrollments);

        const result = await enrollmentService.getAllEnrollments();

        expect(result).toEqual(mockEnrollments);
        expect(enrollmentModel.getAllEnrollments).toHaveBeenCalled();
    });
});

describe('getEnrollmentById', ()=>{
    it('Should return enrollment by id', async()=>{
        const enrollment = {
            id : 1,
            idCliente : 1,
            idProfesor : 1,
            idPase : 2,
            diaInicio : '2025-01-25',
            diaFin : '2025-02-25',
            precio : 10000,
            estado : 'B'
        };

        enrollmentModel.getEnrollmentById.mockResolvedValue(enrollment);

        const result = await enrollmentService.getEnrollmentById(1);

        expect(result).toEqual(enrollment);
    });

    it('Should fail if id is not a number', async()=>{
        await expect(
            enrollmentService.getEnrollmentById('abc')
        ).rejects.toThrow('Invalid enrollment id');
    });

    it('Should fail if enrollment does not exist', async()=>{
        enrollmentModel.getEnrollmentById.mockResolvedValue(null);

        await expect(
            enrollmentService.getEnrollmentById(999)
        ).rejects.toThrow('Enrollment not found');
    });
});

describe('getEnrollmentByClient', ()=>{
    it('Should return enrollments by client', async()=>{
        const enrollments = [
            {
                id : 1,
                idCliente : 1,
                idProfesor : 1,
                idPase : 2,
                diaInicio : '2025-01-25',
                diaFin : '2025-02-24',
                precio : 10000,
                estado : 'B'
            },
            {
                id : 5,
                idCliente : 1,
                idProfesor : 2,
                idPase : 2,
                diaInicio : '2025-02-25',
                diaFin : '2025-03-24',
                precio : 10000,
                estado : 'A'
            }
        ]

        clientService.getClientById.mockResolvedValue({
            id : 1,
            estado : 'A'
        });

        enrollmentModel.getEnrollmentsByClient.mockResolvedValue(enrollments);

        const result = await enrollmentService.getEnrollmentsByClient(1);

        expect(result).toEqual(enrollments);
        expect(clientService.getClientById).toHaveBeenCalledWith(1);
    })
});

describe('deactivateEnrollment', ()=>{
    it('Should deactivate enrollment', async()=>{
        enrollmentModel.getEnrollmentById.mockResolvedValue({
            id : 1,
            estado : 'A'
        });

        enrollmentModel.updateEnrollmentStatus.mockResolvedValue();

        const result = await enrollmentService.deactivateEnrollment(1);

        expect(result).toEqual({
            message :'Enrollment deactivated successfully'
        });
    });

    it('Should fail if enrollment anready is deactivate', async()=>{
        enrollmentModel.getEnrollmentById.mockResolvedValue({
            id : 1,
            estado : 'B'
        });

        await expect(enrollmentService.deactivateEnrollment(1))
            .rejects.toThrow('Enrollment is already inactive');
    });
});

describe('activateEnrollment', ()=>{
    it('Should activate enrollment', async()=>{
        enrollmentModel.getEnrollmentById.mockResolvedValue({
            id : 1,
            estado : 'B'
        });

        enrollmentModel.updateEnrollmentStatus.mockResolvedValue();

        const result = await enrollmentService.activateEnrollment(1);

        expect(result).toEqual({
            message :'Enrollment activated successfully'
        });
    });

    it('Should fail if enrollment anready is activate', async()=>{
        enrollmentModel.getEnrollmentById.mockResolvedValue({
            id : 1,
            estado : 'A'
        });

        await expect(enrollmentService.activateEnrollment(1))
            .rejects.toThrow('Enrollment is already active');
    });
});