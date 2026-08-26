const pool = require('../../config/db');

const createRutine = async(IdClient, rutineData)=>{
    const [result] = await pool.query(
        `INSERT INTO Rutinas (idCliente, nombre, observaciones, estado)
         VALUES (?, ?, ?, ?)`,
         [
            IdClient,
            rutineData.name,
            rutineData.notes,
            'A'
         ]
    );

    return {id : result.insertId};
};

const findRutineByUniqueData = async(idClient, name)=>{
    const [rows] = await pool.query(
        `SELECT 1
         FROM Rutinas
         WHERE idCliente = ? AND nombre = ? 
         LIMIT 1`,
         [idClient, name]
    );

    return rows[0] || null;
};

const getRutinesByClient = async(idClient)=>{
    const [rows] = await pool.query(
        `SELECT idRutina AS id, idCliente, nombre, observaciones, estado
         FROM Rutinas
         WHERE idCliente = ?
         ORDER BY estado, nombre`,
         [idClient]
    );
    return rows;
};

const getRutineById = async(id)=>{
    const [rows] = await pool.query(
        `SELECT idRutina AS id, idCliente, nombre, observaciones, estado
         FROM Rutinas
         WHERE idRutina = ?`,
         [id]
    );

    return rows[0] || null;
};

const updateRutine = async(id, rutineData)=>{
    await pool.query(
        `UPDATE Rutinas
         SET
            nombre = ?,
            observaciones = ?
         WHERE idRutina = ?`,
         [
            rutineData.name,
            rutineData.notes,
            id
         ]
    );

    return {id : id};
};

const updateRutineStatus = async(id, status)=>{
    await pool.query(
        `UPDATE Rutinas
         SET estado = ?
          WHERE idRutina = ?`,
          [status, id]
    );
};

const deleteRutine = async(id)=>{
    await pool.query(
        `DELETE FROM Rutinas
        WHERE idRutina = ?`,
        [id]
    );
};

module.exports = {
    createRutine,
    findRutineByUniqueData,
    getRutinesByClient,
    getRutineById,
    updateRutine,
    updateRutineStatus,
    deleteRutine
};