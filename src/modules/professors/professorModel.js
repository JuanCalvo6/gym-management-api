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

const findProfessorByUniqueData = async(user, dni, mail, id)=>{
    const [rows] = await pool.query(
        `SELECT 1
         FROM Profesores
         WHERE (usuario = ? OR dni = ? OR mail = ?) AND idProfesor <> ?
         LIMIT 1`,
         [user, dni, mail, id]
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

const getAllProfessors = async()=>{
    const [rows] = await pool.query(
        `SELECT idProfesor AS id, nombres, apellidos, dni, telefono, direccion, mail, usuario, estado
         FROM Profesores
         WHERE estado = 'A'
         ORDER BY Estado, Apellidos, nombres`
    );

    return rows;
}

const getProfessorById = async (id) =>{
    const [rows] = await pool.query(
        `SELECT idProfesor AS id, nombres, apellidos, dni, telefono, direccion, mail, usuario, estado
        FROM Profesores
        WHERE idProfesor = ?`,
        [id]
    );

    return rows[0] || null;
};

const updateProfessor = async (id, professorData) =>{
    const [rows] = await pool.query(
        `UPDATE Profesores
         SET
            nombres = ?,
            apellidos = ?,
            dni = ?,
            telefono = ?,
            direccion = ?,
            mail = ?,
            usuario = ?
         WHERE idProfesor = ?`,
         [
            professorData.name,
            professorData.surname,
            professorData.dni,
            professorData.phone,
            professorData.address,
            professorData.mail,
            professorData.user,
            id
         ]
    );

    return {id: id};
};

module.exports =  {
    findExistingProfessor,
    findProfessorByUniqueData,
    createProfessor,
    getAllProfessors,
    getProfessorById,
    updateProfessor
}