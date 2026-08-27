const request = require('supertest');
const app = require('../../src/app');
const pool = require('../../src/config/db');

const createRutineTest = async(idClient, tokenProfessor)=>{
    const res = await request(app)
            .post(`/api/clients/${idClient}/rutines`)
            .set('Authorization', `Bearer ${tokenProfessor}`)
            .send({
                name : 'RutineTest',
                notes : 'Note test'
            });

    return res.body;
};

const deleteRutineTest = async(id) =>{
    await pool.query(
        `DELETE FROM Rutinas
         WHERE idRutina = ?`,
         [id]
    );
};

module.exports = {
    createRutineTest,
    deleteRutineTest
};