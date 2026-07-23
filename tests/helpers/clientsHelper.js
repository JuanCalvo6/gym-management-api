const request = require('supertest');
const app = require('../../src/app');
const pool =  require('../../src/config/db');

const createClientTest = async(token)=>{
    const res = await request(app)
                .post('/api/clients')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    name : 'Client',
                    surname : 'Test',
                    documentType : 'DNI',
                    dni : '123456789',
                    phone : '1234567890',
                    address : 'calle test 12',
                    mail : 'cliente@test.com'
                });

    return res.body;     
};

const deleteClientTest = async(id)=>{
    await pool.query(
            `DELETE FROM Clientes 
            WHERE idCliente = ?`,
            [id]
        );
}

module.exports = {
    createClientTest,
    deleteClientTest
}