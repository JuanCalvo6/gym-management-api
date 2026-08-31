const pool =  require('../../src/config/db');

const createClientTest = async()=>{
    const [result] = await pool.query(
        `INSERT INTO Clientes (nombres, apellidos, tipoDni, dni, telefono, direccion, mail, estado)
         VALUES( ?, ?, ?, ?, ?, ?, ?, ?)`,
         [
            'Client',
            'Test',
            'DNI',
            '123456789',
            '1234567890',
            'calle test 12',
            'cliente@test.com',
            'A'
         ]
    );

    return {id : result.insertId};   
};

const deleteClientTest = async(id)=>{
    await pool.query(
            `DELETE FROM Clientes 
            WHERE idCliente = ?`,
            [id]
        );
};

module.exports = {
    createClientTest,
    deleteClientTest
};