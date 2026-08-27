const AppError = require('../../utils/AppError');
const routineModel = require('./routineModel');
const clientService = require('../clients/clientService');

const createRoutine = async(idClient, routineData)=>{
    await clientService.getClientById(idClient);

    const existingRoutine = await routineModel.findRoutineByUniqueData(idClient, routineData.name);
    if(existingRoutine)
            throw new AppError('Routine name already exists', 409);

    const result = await routineModel.createRoutine(idClient, routineData);

    return result;
};

const getRoutinesByClient = async(idClient)=>{
    await clientService.getClientById(idClient);

    const routines = await routineModel.getRoutinesByClient(idClient);

    return routines;
};

const getRoutineById =  async(id)=>{
    if(isNaN(id))
        throw new AppError('Invalid routine id', 400);

    const routine = await routineModel.getRoutineById(id);

    if(!routine)
        throw new AppError('Routine not found', 404);

    return routine;
};  

const updateRoutine = async(id, routineData)=>{
    const routine = await getRoutineById(id);

    const existingRoutines = await routineModel.findRoutineByUniqueData(routine.idCliente, routineData.name);
    if(existingRoutines)
            throw new AppError('Routine name already exists', 409);
    
    const result = await routineModel.updateRoutine(id, routineData);

    return result;
};

const deactivateRoutine = async(id)=>{
    const routine = await getRoutineById(id);

    if(routine.estado === 'B')
        throw new AppError('Routine is already inactive', 409);

    await routineModel.updateRoutineStatus(id, 'B');

    return {message : 'Routine deactivated successfully'};
};

const activateRoutine = async(id)=>{
    const routine = await getRoutineById(id);

    if(routine.estado === 'A')
        throw new AppError('Routine is already active', 409);

    await routineModel.updateRoutineStatus(id, 'A');

    return {message : 'Routine activated successfully'};
};

const deleteRoutine = async(id)=>{
    await getRoutineById(id);

    await routineModel.deleteRoutine(id);

    return {message: 'Routine deleted successfully'};
};

module.exports = {
    createRoutine,
    getRoutinesByClient,
    getRoutineById,
    updateRoutine,
    deactivateRoutine,
    activateRoutine,
    deleteRoutine
};