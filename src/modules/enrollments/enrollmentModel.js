const pool = require('../../config/db');


const createEnrollment = async (professorId, clientId, enrollmentData, price)=>{
    const [result] = await pool.query(
        `INSERT INTO Inscripciones (idProfesor, idCliente, idPase, diaInicio, diaFin, precio, estado)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
         [
            professorId,
            clientId,
            enrollmentData.membershipId,
            enrollmentData.startDate,
            enrollmentData.endDate,
            price,
            'A'
         ]
    );

    return {id : result.insertId};
};

const getAllEnrollments = async()=>{
    const [rows] = await pool.query(
        `SELECT idInscripcion AS id, idCliente, idProfesor, idPase, diaInicio, diaFin, precio, estado
         FROM Inscripciones
         ORDER BY diaInicio`
    );

    return rows;
};

const getActiveEnrollmentsByClient = async(idClient)=> {
    const [rows] = await pool.query(
        `SELECT idInscripcion AS id, idProfesor, idPase, diaInicio, diaFin, precio
         FROM Inscripciones
         WHERE estado = 'A' AND idCliente = ?
         ORDER BY diaInicio`,
         [idClient]
    );

    return rows;
};

const getEnrollmentsByClient = async(idClient)=>{
    const [rows] = await pool.query(
        `SELECT idInscripcion AS id, idProfesor, idPase, diaInicio, diaFin, precio
         FROM Inscripciones
         WHERE idCliente = ?
         ORDER BY diaInicio`,
         [idClient]
    );

    return rows;
};

const getEnrollmentById = async(id)=>{
    const [rows] = await pool.query(
        `SELECT idInscripcion AS id, idProfesor, idPase, diaInicio, diaFin, precio, estado
         FROM Inscripciones
         WHERE idInscripcion = ?
         ORDER BY diaInicio`,
         [id]
    );

    return rows[0] || null;
};

const updateEnrollmentStatus = async(id, status) =>{
    await pool.query(
        `UPDATE Inscripciones
         SET estado = ?
         WHERE idInscripcion = ?`,
         [status, id]
    );
};

module.exports ={
    createEnrollment,
    getAllEnrollments,
    getActiveEnrollmentsByClient,
    getEnrollmentsByClient,
    getEnrollmentById,
    updateEnrollmentStatus
};