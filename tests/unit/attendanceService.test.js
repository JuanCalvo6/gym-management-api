const attendanceModel = require('../../src/modules/attendances/attendanceModel');
const attendanceService = require('../../src/modules/attendances/attendanceService');
const clientService = require('../../src/modules/clients/clientService');
const enrollmentService = require('../../src/modules/enrollments/enrollmentService');
const membershipService = require('../../src/modules/memberships/membershipService');

jest.mock('../../src/modules/attendances/attendanceModel');
jest.mock('../../src/modules/clients/clientService');
jest.mock('../../src/modules/enrollments/enrollmentService');
jest.mock('../../src/modules/memberships/membershipService');

describe('createAttendance', ()=>{
    it('Should create attendance successfully', async()=>{
        
        jest.useFakeTimers();
        jest.setSystemTime(new Date('2026-08-19T10:00:00'));

        clientService.getClientById.mockResolvedValue({
            id : 1,
            estado : 'A'
        });

        enrollmentService.getCurrentEnrollmentByClient.mockResolvedValue({
            id : 1,
            idPase : 3
        });

        membershipService.getMembershipById.mockResolvedValue({
            id : 3,
            horaInicio : '08:00',
            horaFin : '12:00',
            precio : 12000
        });

        attendanceModel.createAttendance.mockResolvedValue({id : 1});

        const result = await attendanceService.createAttendance(1)

        expect(result).toEqual({id : 1});
        expect(attendanceModel.createAttendance).toHaveBeenCalled();
        
        jest.useRealTimers();
    });

    it('Should fail if client is inactive', async()=>{
        clientService.getClientById.mockResolvedValue({
            id : 1,
            estado : 'B'
        });

        await expect( attendanceService.createAttendance(1)
        ).rejects.toThrow('Client is inactive');
    });

    it('Should fail if client does not have enrollments active', async()=>{
        clientService.getClientById.mockResolvedValue({
            id : 1,
            estado : 'A'
        });

        enrollmentService.getCurrentEnrollmentByClient.mockResolvedValue(null);

        await expect(attendanceService.createAttendance(1)
        ).rejects.toThrow('Client does not have enrollments active');
    });

    it('Should fail if attendance is outside membership hours', async()=>{
        jest.useFakeTimers();
        jest.setSystemTime(new Date('2026-08-19T15:00:00'));

        clientService.getClientById.mockResolvedValue({
            id : 1,
            estado : 'A'
        });

        enrollmentService.getCurrentEnrollmentByClient.mockResolvedValue({
            id : 1,
            idPase : 3
        });

        membershipService.getMembershipById.mockResolvedValue({
            id : 3,
            horaInicio : '08:00',
            horaFin : '12:00',
            precio : 12000
        });

        await expect(attendanceService.createAttendance(1)
        ).rejects.toThrow('Attendance is outside membership hours');
        
        jest.useRealTimers();
    });
});

describe('getAllAttendances',()=>{
    it('Should return all attendances', async()=>{
        const attendances = [
            {
                id : 1,
                idCliente : 1,
                fecha : '2026-08-19T10:00:00'
            },
            {
                id : 2,
                idCliente : 1,
                fecha : '2026-08-20T10:00:00'
            },
            {
                id : 3,
                idCliente : 2,
                fecha : '2026-08-20T18:00:00'
            }
        ];

        attendanceModel.getAllAttendances.mockResolvedValue(attendances);

        const result = await attendanceService.getAllAttendances();

        expect(result).toEqual(attendances);
        expect(attendanceModel.getAllAttendances).toHaveBeenCalled();
    });
});

describe.only('getAttendancesByClient',()=>{
    it('Should return all attendances by client', async()=>{
        const attendances = [
            {
                id : 1,
                idCliente : 1,
                fecha : '2026-08-19T10:00:00'
            },
            {
                id : 2,
                idCliente : 1,
                fecha : '2026-08-20T10:00:00'
            }
        ];

        clientService.getClientById.mockResolvedValue({
            id : 1,
            estado : 'A'
        });

        attendanceModel.getAttendancesByClient.mockResolvedValue(attendances);

        const result = await attendanceService.getAttendancesByClient(1);

        expect(result).toEqual(attendances);
        expect(clientService.getClientById).toHaveBeenCalled();
        expect(attendanceModel.getAttendancesByClient).toHaveBeenCalled();
    });
});

