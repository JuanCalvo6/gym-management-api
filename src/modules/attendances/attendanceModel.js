const pool = require('../../config/db');

const createAttendance = async(idClient, date)=>{
    const [result] = await pool.query(
        `INSERT INTO Asistencias (idCliente, fecha)
         VALUES(?, ?)`,
         [idClient, date]
    );

    return {id : result.insertId};
};

const getAllAttendances = async()=>{
    const [rows] = await pool.query(
        `SELECT idAsistencia AS id, idCliente, fecha
         FROM Asistencias
         ORDER BY idCliente, fecha`
    );

    return rows;
};

const getAttendancesByClient = async(idClient)=>{
    const [rows] = await pool.query(
        `SELECT idAsistencia AS id, idCliente, fecha
        FROM Asistencias 
        WHERE idCliente = ?
        ORDER BY fecha`,
        [idClient]
    );

    return rows;
};

module.exports = {
    createAttendance,
    getAllAttendances,
    getAttendancesByClient
}