const attendanceService = require('./attendanceService');

const createAttendance = async(req, res)=>{
    try {
        const idClient = req.params.id
        
        const attendance = await attendanceService.createAttendance(idClient);

        res.status(201).json(attendance);

    } catch (error) {
        res.status(error.statusCode || 500).json({error : error.message});
    }
};

const getAllAttendances = async(req, res)=>{
    try {
        const attendances = await attendanceService.getAllAttendances();
        
        res.status(200).json(attendances);

    } catch (error) {
        res.status(error.statusCode || 500).json({error : error.message});
    }
};

const getAttendancesByClient = async(req, res)=>{
    try {
        const idClient = req.params.id

        const attendances = await attendanceService.getAttendancesByClient(idClient);

        res.status(200).json(attendances);

    } catch (error) {
        res.status(error.statusCode || 500).json({error : error.message});
    }
};

module.exports = {
    createAttendance,
    getAllAttendances,
    getAttendancesByClient
}