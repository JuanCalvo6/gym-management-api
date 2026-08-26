const AppError = require('../../utils/AppError');
const rutineModel = require('./rutineModel');
const clientService = require('../clients/clientService');

const createRutine = async(idClient, rutineData)=>{
    await clientService.getClientById(idClient);

    const existingRutine = await rutineModel.findRutineByUniqueData(idClient, rutineData.name);
    if(existingRutine)
            throw new AppError('Rutine name already exists ', 409);

    const result = await rutineModel.createRutine(idClient, rutineData);

    return result;
};

const getRutinesByClient = async(idClient)=>{
    await clientService.getClientById(idClient);

    const rutines = await rutineModel.getRutinesByClient(idClient);

    return rutines;
};

const getRutineById =  async(id)=>{
    if(isNaN(id))
        throw new AppError('Invalid rutine id', 400);

    const rutine = await rutineModel.getRutineById(id);

    if(!rutine)
        throw new AppError('Rutine not found', 404);

    return rutine;
};  

const updateRutine = async(id, rutineData)=>{
    const rutine = await getRutineById(id);

    const existingRutines = await rutineModel.findRutineByUniqueData(rutine.idCliente, rutineData.name);
    if(existingRutines)
            throw new AppError('Rutine name already exists ', 409);
    
    const result = await rutineModel.updateRutine(id, rutineData);

    return result;
};

const deactivateRutine = async(id)=>{
    const rutine = await getRutineById(id);

    if(rutine.estado === 'B')
        throw new AppError('Rutine is alreadi inactive', 409);

    await rutineModel.updateRutineStatus(id, 'B');

    return {message : 'Rutine deactivated successfully'};
};

const activateRutine = async(id)=>{
    const rutine = await getRutineById(id);

    if(rutine.estado === 'A')
        throw new AppError('Rutine is alreadi active', 409);

    await rutineModel.updateRutineStatus(id, 'A');

    return {message : 'Rutine activated successfully'};
};

const deleteRutine = async(id)=>{
    await getRutineById(id);

    await rutineModel.deleteRutine(id);

    return {message: 'Rutine deleted successfully'};
};

module.exports = {
    createRutine,
    getRutinesByClient,
    getRutineById,
    updateRutine,
    deactivateRutine,
    activateRutine,
    deleteRutine
};