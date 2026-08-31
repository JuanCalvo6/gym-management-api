const enrollmentService = require('./enrollmentService'); 

const createEnrollment = async(req, res) =>{
    try {
        const idClient = req.params.id;
        const idProfessor = req.user.id;

        const enrollment = await enrollmentService.createEnrollment(idClient, idProfessor, req.body);

        res.status(201).json(enrollment);

    } catch (error) {
        res.status(error.statusCode || 500).json({error : error.message});
    }
};

const getAllEnrollments = async(req, res) =>{
    try {
        const enrollments = await enrollmentService.getAllEnrollments();

        res.status(200).json(enrollments);
        
    } catch (error) {
        res.status(error.statusCode).json({error: error.message});
    }
};

const getEnrollmentById = async(req, res) =>{
    try {
        const {id} = req.params;

        const enrollment = await enrollmentService.getEnrollmentById(id);

        res.status(200).json(enrollment);

    } catch (error) {
        res.status(error.statusCode).json({error: error.message});
    }
};

const getEnrollmentsByClient = async(req, res) =>{
    try {
        const clientId = req.params.id;

        const enrollment = await enrollmentService.getEnrollmentsByClient(clientId);

        res.status(200).json(enrollment);

    } catch (error) {
        res.status(error.statusCode).json({error: error.message});
    }
};

const deactivateEnrollment = async(req, res) =>{
    try {
        const {id} = req.params;

        const enrollment = await enrollmentService.deactivateEnrollment(id);

        res.status(200).json(enrollment);

    } catch (error) {
        res.status(error.statusCode || 500).json({error: error.message});
    }
};

const activateEnrollment = async(req, res) =>{
    try {
        const {id} = req.params;

        const enrollment = await enrollmentService.activateEnrollment(id);

        res.status(200).json(enrollment);
        
    } catch (error) {
        res.status(error.statusCode || 500).json({error: error.message});
    }
};

module.exports = {
    createEnrollment,
    getAllEnrollments,
    getEnrollmentById,
    getEnrollmentsByClient,
    deactivateEnrollment,
    activateEnrollment
}