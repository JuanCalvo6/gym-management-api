const pool = require('../../config/db');

const findExistingMembership = async(name) =>{
    const [rows] = await pool.query(
        `SELECT nombre
         FROM Pases
         WHERE nombre = ?`,
         [name]
    );

    return rows[0] || null;
};

const createMembership = async(membershipData) =>{
    const [result] = await pool.query(
        `INSERT INTO Pases (nombre, horaInicio, horaFin, precio, estado)
         VALUES (?, ?, ?, ?, ?)`,
         [
            membershipData.name,
            membershipData.start,
            membershipData.end,
            membershipData.price,
            'A'
        ]
    );

    return {id: result.insertId};
};

module.exports = {
    findExistingMembership,
    createMembership
}