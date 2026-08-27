const pool = require('../../config/db');

const createRoutineLine = async(idRoutine, idClient, routineLineData)=>{
    const [result] = await pool.query(
        `INSERT INTO LineasDeRutina (idCliente, idRutina, ejercicio, repeticiones, series, descanso)
         VALUES (?, ?, ?, ?, ?, ?)`,
         [
            idClient,
            idRoutine,
            routineLineData.exercise,
            routineLineData.repetitions,
            routineLineData.sets,
            routineLineData.rest
        ]
    );
    
    return {id : result.insertId};
};

const getRoutineLinesByRoutine = async(idRoutine)=>{
    const [rows] = await pool.query(
        `SELECT idLineaDeRutina AS id, idCliente, idRutina, ejercicio, repeticiones, series, descanso
         FROM lineasDeRutina
         WHERE idRutina = ?`,
         [idRoutine]
    );

    return rows;
};

const getRoutineLineById = async(id)=>{
    const [rows] = await pool.query(
        `SELECT idLineaDeRutina AS id, idCliente, idRutina, ejercicio, repeticiones, series, descanso
         FROM lineasDeRutina
         WHERE idLineaDeRutina = ?`,
         [id]
    );

    return rows[0] || null;
};

const updateRoutineLine = async(id, routineLineData)=>{
    await pool.query(
        `UPDATE lineasDeRutina
         SET
            ejercicio = ?,
            repeticiones = ?,
            series = ?,
            descanso = ?
         WHERE idLineaDeRutina = ?`,
         [
            routineLineData.exercise,
            routineLineData.repetitions,
            routineLineData.sets,
            routineLineData.rest,
            id
         ]
    );

    return {id : id};
};

const deleteRoutineLine = async(id)=>{
    await pool.query(
        `DELETE FROM lineasDeRutina
         WHERE idLineaDeRutina = ?`,
         [id]
    );
};

module.exports = {
    createRoutineLine,
    getRoutineLinesByRoutine,
    getRoutineLineById,
    updateRoutineLine,
    deleteRoutineLine
};

