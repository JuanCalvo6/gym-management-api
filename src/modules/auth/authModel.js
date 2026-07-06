const pool = require('../../config/db');

const findUser = async(user) =>{
    let [rows] = await pool.query(
        `SELECT idAdministrador AS id, contraseña AS password, 'admin' AS type 
         FROM Administradores 
         WHERE usuario= ? `,
         [user]
    ); 
    
    if(rows.length > 0)
        return rows[0];

    [rows] = await pool.query(
        `SELECT idProfesor AS id, contraseña AS password, 'professor' AS type
         FROM Profesores
         WHERE usuario = ?`,
         [user]
    );

    return rows[0] || null;
};

module.exports = {
    findUser
};