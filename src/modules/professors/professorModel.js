const pool = require('../../config/db');

const findExistingProfessor = async (user,dni,mail)=>{
    const [rows] = await pool.query(
        `SELECT usuario, dni, mail
         FROM Profesores
         WHERE usuario = ? OR dni = ? OR mail = ?`,
        [user, dni, mail]
    );

    return rows[0] || null;
};

const createProfessor = async (professorData)=>{
    const [result] = await pool.query(
        `INSERT INTO Profesores (nombres, apellidos, dni, telefono, direccion, mail, usuario, contraseña, estado)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
         [
            professorData.name,
            professorData.surname,
            professorData.dni,
            professorData.phone,
            professorData.address,
            professorData.mail,
            professorData.user,
            professorData.password,
            'a'
         ]
    );

    return {id: result.insertId};
};

module.exports =  {
    findExistingProfessor,
    createProfessor
}