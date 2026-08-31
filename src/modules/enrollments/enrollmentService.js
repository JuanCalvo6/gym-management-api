const AppError = require('../../utils/AppError');
const enrollmentModel = require('./enrollmentModel');
const clientService = require('../clients/clientService');
const membershipService = require('../memberships/membershipService')

const createEnrollment = async (idClient, idProfessor, enrollmentData)=>{

    const existingClient = await clientService.getClientById(idClient);
    if(existingClient.status === 'B')
        throw new AppError('Client is inactive', 409);

    const existingMembership = await membershipService.getMembershipById(enrollmentData.idMembership);
    if(existingMembership.status === 'B')
        throw new AppError('Membership is inactive', 409);

    const existingEnrollments = await enrollmentModel.getActiveEnrollmentsByClient(idClient);
    if(existingEnrollments){
        const newStart = new Date(enrollmentData.startDate);
        const newEnd = new Date(enrollmentData.endDate);

        const overlap = existingEnrollments.some(enrollment =>{
            const start = new Date(enrollment.startDate);
            const end = new Date(enrollment.endDate);
            console.log('Existing Data: ', start, end);
            return newStart <= end || start >= newEnd;
        });
        if(overlap)
            throw new AppError('Enrollment dates overlap with an existing enrollment',409);
    };

    const result = await enrollmentModel.createEnrollment(idProfessor, idClient, enrollmentData, existingMembership.price);

    return result;
};

const getAllEnrollments = async()=>{
    const enrollments = await enrollmentModel.getAllEnrollments();

    return enrollments;
};

const getEnrollmentById = async(id)=>{
    if(isNaN(id))
        throw new AppError('Invalid enrollment id', 400);

    const enrollment = await enrollmentModel.getEnrollmentById(id);

    if(!enrollment)
        throw new AppError('Enrollment not found', 404);

    return enrollment;
};

const getEnrollmentsByClient = async(idClient)=>{
    await clientService.getClientById(idClient);

    const enrollments = await enrollmentModel.getEnrollmentsByClient(idClient);

    return enrollments;
};

const getCurrentEnrollmentByClient = async(idClient)=>{
    await clientService.getClientById(idClient);

    const enrollments = await enrollmentModel.getActiveEnrollmentsByClient(idClient);
    
    const today = new Date();

    return enrollments.find(enrollment =>{
        const start = new Date(enrollment.startDate);
        const end = new Date(enrollment.endDate);

        return today >= start && today <= end;
    }) || null;
};

const deactivateEnrollment = async(id) =>{
    const enrollment = await getEnrollmentById(id);

    if(enrollment.status === 'B')
        throw new AppError('Enrollment is already inactive', 409);

    await enrollmentModel.updateEnrollmentStatus(id, 'B');

    return {message: 'Enrollment deactivated successfully'};
};

const activateEnrollment = async(id) =>{
    const enrollment = await getEnrollmentById(id);

    if(enrollment.status === 'A')
        throw new AppError('Enrollment is already active', 409);

    await enrollmentModel.updateEnrollmentStatus(id, 'A');

    return {message: 'Enrollment activated successfully'};
};

module.exports ={
    createEnrollment,
    getAllEnrollments,
    getEnrollmentById,
    getEnrollmentsByClient,
    getCurrentEnrollmentByClient,
    deactivateEnrollment,
    activateEnrollment
}