const request = require('supertest');
const app = require('../../src/app');
const pool =  require('../../src/config/db');


const createMembershipTest = async(token)=>{ 
    const res = await request(app)
        .post('/api/memberships/')
        .set('Authorization', `Bearer ${token}`)
        .send({
            name : 'testMembership',
            start : '08:00',
            end : '12:00',
            price : 12000
        });

    return res.body;
};

const createMembershipWithScheduleTest = async (start, end) => {
    const [result] = await pool.query(
        `INSERT INTO Pases (nombre, horaInicio, horaFin, precio, estado)
         VALUES (?, ?, ?, ?, ?)`,
         [
            'testMembership',
            start,
            end,
            12000,
            'A'
        ]
    );

    return {id: result.insertId};
};

const deleteMembershipTest = async(id) =>{
    await pool.query(
        `DELETE FROM Pases 
         WHERE idPase = ?`,
         [id]
    );
};

module.exports = {
    createMembershipTest,
    createMembershipWithScheduleTest,
    deleteMembershipTest
}