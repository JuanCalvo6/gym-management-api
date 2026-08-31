const pool = require('../../config/db');

const createRoutine = async(IdClient, routineData)=>{
    const [result] = await pool.query(
        `INSERT INTO Rutinas (idCliente, nombre, observaciones, estado)
         VALUES (?, ?, ?, ?)`,
         [
            IdClient,
            routineData.name,
            routineData.notes,
            'A'
         ]
    );

    return {id : result.insertId};
};

const findRoutineByUniqueData = async(idClient, name)=>{
    const [rows] = await pool.query(
        `SELECT 1
         FROM Rutinas
         WHERE idCliente = ? AND nombre = ? 
         LIMIT 1`,
         [idClient, name]
    );

    return rows[0] || null;
};

const getRoutinesByClient = async(idClient)=>{
    const [rows] = await pool.query(
        `SELECT idRutina AS id, 
                idCliente AS idClient, 
                nombre AS name, 
                observaciones AS notes, 
                estado AS status
         FROM Rutinas
         WHERE idCliente = ?
         ORDER BY estado, nombre`,
         [idClient]
    );
    
    return rows;
};

const getRoutineById = async(id)=>{
    const [rows] = await pool.query(
        `SELECT idRutina AS id, 
                idCliente AS idClient, 
                nombre AS name, 
                observaciones AS notes, 
                estado AS status
         FROM Rutinas
         WHERE idRutina = ?`,
         [id]
    );

    return rows[0] || null;
};

const updateRoutine = async(id, rutineData)=>{
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

const updateRoutineStatus = async(id, status)=>{
    await pool.query(
        `UPDATE Rutinas
         SET estado = ?
          WHERE idRutina = ?`,
          [status, id]
    );
};

const deleteRoutine = async(id)=>{
    await pool.query(
        `DELETE FROM Rutinas
        WHERE idRutina = ?`,
        [id]
    );
};

module.exports = {
    createRoutine,
    findRoutineByUniqueData,
    getRoutinesByClient,
    getRoutineById,
    updateRoutine,
    updateRoutineStatus,
    deleteRoutine
};