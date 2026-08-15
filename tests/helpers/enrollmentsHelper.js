const request = require('supertest');
const app = require('../../src/app');
const pool = require('../../src/config/db');

const createEnrollmentTest = async(idClient, tokenProfessor, membershipId)=>{
    const res = await request(app)
            .post(`/api/clients/${idClient}/enrollments`)
            .set('Authorization', `Bearer ${tokenProfessor}`)
            .send({
                membershipId : membershipId,
                startDate : '2025-02-1',
                endDate : '2025-03-01'
            });

    return res.body;
};


const deleteEnrollmentTest = async(id)=>{
    await pool.query(
        `DELETE FROM Inscripciones
         WHERE idInscripcion = ?`,
         [id]
    );
};

module.exports = {
    createEnrollmentTest,
    deleteEnrollmentTest
}