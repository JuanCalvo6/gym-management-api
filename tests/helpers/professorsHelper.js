const pool = require('../../src/config/db');

const createProfessorTest = async()=>{
    const [result] = await pool.query(
        `INSERT INTO Profesores (nombres, apellidos, dni, telefono, direccion, mail, usuario, contraseña, estado)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            'Juan',
            'Test',
            11111111,
            '1234567890',
            'juan 123',
            'juan@test.com',
            'juan123',
            '1234',
            'A'
        ]
    );
    
    return {id : result.insertId}
};

const deleteProfessorTest = async(id)=>{
    await pool.query(
        `DELETE FROM Profesores
        WHERE idProfesor = ?`,
        [id]
    );
} ;

module.exports = {
    createProfessorTest,
    deleteProfessorTest
};