const AppError = require('../../utils/AppError');
const clientModel = require('./clientModel');

const createClient = async(clientData) =>{

    const existingClient = await clientModel.findExistingClient(clientData.dni);

    if(existingClient)
        throw new AppError('DNI already exists', 409);

    const result = await clientModel.createClient(clientData);

    return result;
};

const getAllClients = async()=>{
    const clients = await clientModel.getAllClients();

    return clients;
};

const getClientById = async(id)=>{
    if(NaN(id))
        throw new AppError('Invalid client id', 400);

    const client = await clientModel.getClientById(id);

    if(!client)
        throw new AppError('Client not found', 404);

    return client;
};

const updateClient = async(id, clientData) =>{
    await getClientById(id);

    const duplicatedClient = await clientModel.findClientByUniqueData(id, clientData.dni);

    if(duplicatedClient)
        throw new AppError('Client data already exists', 409);

    const client = await clientModel.updateClient(id, clientData);

    return client;
};

const deactivateClient = async(id) =>{
    const client = await getClientById(id);

    if( client.estado === 'B')
            throw new AppError('Client is already inactive', 409);

    await clientModel.updateClientStatus(id, 'B');

    return {message: 'Client deactivated successfully'};
};

const activateClient = async(id) =>{
    const client = await getClientById(id);

    if( client.estado === 'A')
            throw new AppError('Client is already active', 409);

    await clientModel.updateClientStatus(id, 'A');

    return {message: 'Client activated successfully'};
};

module.exports = {
    createClient, 
    getAllClients,
    getClientById,
    updateClient,
    deactivateClient,
    activateClient
};