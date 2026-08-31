const pool = require('../../config/db');

const  findExistingClient =  async(dni) =>{
    const [rows] = await pool.query(
        `SELECT dni
         FROM Clientes
         WHERE dni = ?`,
         [dni]
    );

    return rows[0] || null;
}; 

const findClientByUniqueData = async(id, dni) =>{
    const [rows] = await pool.query(
        `SELECT 1
         FROM Clientes
         WHERE dni = ? AND idCliente <> ?
         LIMIT 1`,
         [dni, id]
    );

    return rows[0] || null;
};

const createClient = async (clientData) =>{
    const [result] = await pool.query(
        `INSERT INTO Clientes (nombres, apellidos, tipoDni, dni, telefono, direccion, mail, estado)
         VALUES( ?, ?, ?, ?, ?, ?, ?, ?)`,
         [
            clientData.name,
            clientData.surname,
            clientData.documentType,
            clientData.dni,
            clientData.phone,
            clientData.address,
            clientData.mail,
            'A'
         ]
    );

    return {id : result.insertId};
};

const getAllClients = async() =>{
    const [rows] = await pool.query(
        `SELECT idCliente AS id,
                nombres AS name,
                apellidos AS surname,
                tipoDni AS documentType, 
                dni, 
                telefono AS phone, 
                direccion AS address, 
                mail, 
                estado AS status
         FROM Clientes
         WHERE estado = 'A'
         ORDER BY  estado, apellidos, nombres`
    );

    return rows;
};

const getClientById = async(id)=>{
    const [rows] = await pool.query(
        `SELECT idCliente AS id,
                nombres AS name,
                apellidos AS surname,
                tipoDni AS documentType, 
                dni, 
                telefono AS phone, 
                direccion AS address, 
                mail, 
                estado AS status
         FROM Clientes
         WHERE idCliente = ?`,
         [id]
    );

    return rows[0] || null;
};

const updateClient = async(id, clientData) =>{
    await pool.query(
        `UPDATE Clientes
         SET
            nombres = ?,
            apellidos = ?,
            tipoDni = ?,
            dni = ?,
            telefono = ?,
            direccion = ?,
            mail = ?
         WHERE idCliente = ?`,
         [
            clientData.name,
            clientData.surname,
            clientData.documentType,
            clientData.dni,
            clientData.phone,
            clientData.address,
            clientData.mail,
            id
         ]
    );

    return {id : id};
};

const updateClientStatus = async (id, status) =>{
    await pool.query(
        `UPDATE Clientes
         SET estado = ?
         WHERE idCliente = ?`,
         [status, id]
    );
};

module.exports = {
    findExistingClient,
    findClientByUniqueData,
    createClient,
    getAllClients,
    getClientById,
    updateClient,
    updateClientStatus
};