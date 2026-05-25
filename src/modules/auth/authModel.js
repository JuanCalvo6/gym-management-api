const pool = require('../../config/db');

const findUser = async(user) =>{
    const [rows] = await pool.query(
        `SELECT idAdministrador AS id, contraseña AS password, 'admin' AS type 
         FROM Administradores 
         WHERE usuario= ? `,
         [user]
    ); 
    // const userFound = {
    //     "user" : "juan123",
    //     "type" : "admin",
    //     "password" : "$2b$10$8YKaWS6QmtSPmCUrLfktc.6gnlT5QGpBYc14Dc7nVOlCUz04aYoIG" //1234
    // };

    return rows[0] || null;
};

module.exports = {
    findUser
};