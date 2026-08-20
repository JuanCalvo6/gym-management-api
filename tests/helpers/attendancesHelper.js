const request = require('supertest');
const app = require('../../src/app');
const pool = require('../../src/config/db');

const deleteAttendanceTest = async(id) =>{
    await pool.query(
        `DELETE FROM Asistencias
         WHERE idAsistencia = ?`,
         [id]
    );
}

module.exports = {
    deleteAttendanceTest
}