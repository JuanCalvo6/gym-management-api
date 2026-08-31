const AppError = require('../../utils/AppError');

const attendanceModel = require('./attendanceModel');
const clientService = require('../clients/clientService');
const enrollmentService = require('../enrollments/enrollmentService');
const membershipService = require('../memberships/membershipService');
const {timeToMinutes} = require('../../utils/timeUtils');

const createAttendance = async(idClient)=>{
    const existingClient = await clientService.getClientById(idClient);
    if(existingClient.status === 'B')
        throw new AppError('Client is inactive', 409);

    const existingEnrollment = await enrollmentService.getCurrentEnrollmentByClient(idClient);

    if(!existingEnrollment)
        throw new AppError('Client does not have enrollments active', 409);

    const membership = await membershipService.getMembershipById(existingEnrollment.idMembership);

    const start = timeToMinutes(membership.start);
    const end = timeToMinutes(membership.end);
    const now = new Date();
    const current = now.getHours()*60 + now.getMinutes();

    if(current < start || current > end)
        throw new AppError('Attendance is outside membership hours', 409);

    const result = await attendanceModel.createAttendance(idClient, now);

    return result;
};

const getAllAttendances = async()=>{
    const attendances = await attendanceModel.getAllAttendances();

    return attendances;
};

const getAttendancesByClient = async(idClient)=>{
    await clientService.getClientById(idClient);

    const attendances = await attendanceModel.getAttendancesByClient(idClient);

    return attendances;
};

module.exports = {
    createAttendance,
    getAllAttendances,
    getAttendancesByClient
}