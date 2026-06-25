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

const findMembershipByUniqueData = async(id, name) =>{
    const [rows] = await pool.query(
        `SELECT 1
         FROM Pases
         WHERE nombre = ? AND idPase <> ?
         LIMIT 1`,
         [name, id]
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

const getAllMemberships = async()=>{
    const [rows] = await pool.query(
        `SELECT nombre, horaInicio, horaFin, precio, estado
         FROM Pases
         WHERE estado = 'A'
         ORDER BY nombre`
    ); 

    return rows;
};

const getMembershipById = async(id)=>{
    const [rows] = await pool.query(
        `SELECT nombre, horaInicio, horaFin, precio, estado
         FROM Pases
         WHERE idPase = ?`,
         [id]
    );

    return rows[0] || null;
};

const updateMembership = async(id, membershipData)=>{
    const [rows] = await pool.query(
        `UPDATE Pases
         SET 
            nombre = ?,
            horaInicio = ?,
            horaFin = ?,
            precio = ?
         WHERE idPase = ?
         `,
         [
            membershipData.name,
            membershipData.start,
            membershipData.end,
            membershipData.price,
            id
         ]
    );

    return {id : id};
};

const updateMembershipStatus = async(id, status)=>{
    await pool.query(
        `UPDATE Pases
         SET estado = ?
         WEHRE idPase = ?`,
         [status, id]
    );
};

module.exports = {
    findExistingMembership,
    createMembership,
    getAllMemberships,
    getMembershipById,
    findMembershipByUniqueData,
    updateMembership,
    updateMembershipStatus
}