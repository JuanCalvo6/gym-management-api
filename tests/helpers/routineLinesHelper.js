const pool = require('../../src/config/db');

const createRoutineLineTest = async(idClient, idRoutine)=>{
    const [result] = await pool.query(
        `INSERT INTO LineasDeRutina (idCliente, idRutina, ejercicio, repeticiones, series, descanso)
         VALUES (?, ?, ?, ?, ?, ?)`,
         [
            idClient,
            idRoutine,
            'Pull up',
            '10',
            3,
            '10"'
        ]
    );
    
    return {id : result.insertId};
};

const deleteRoutineLineTest = async(id)=>{
    await pool.query(
        `DELETE FROM LineasDeRutina
         WHERE idLineaDeRutina = ?`,
         [id]
    );
};

module.exports = {
    createRoutineLineTest,
    deleteRoutineLineTest
};