const request = require('supertest');
const app = require('../../src/app');
const pool = require('../../src/config/db');

const createRoutineTest = async(idClient, tokenProfessor)=>{
    const res = await request(app)
            .post(`/api/clients/${idClient}/routines`)
            .set('Authorization', `Bearer ${tokenProfessor}`)
            .send({
                name : 'RoutineTest',
                notes : 'Note test'
            });

    return res.body;
};

const deleteRoutineTest = async(id) =>{
    await pool.query(
        `DELETE FROM Rutinas
         WHERE idRutina = ?`,
         [id]
    );
};

module.exports = {
    createRoutineTest,
    deleteRoutineTest
};