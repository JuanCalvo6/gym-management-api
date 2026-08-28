const AppError = require('../../utils/AppError');
const routineLineModel = require('./routineLineModel');
const routineService = require('../routines/routineService');

const createRoutineLine = async(idRoutine, routineLineData)=>{
    const routine = await routineService.getRoutineById(idRoutine);

    const result = await routineLineModel.createRoutineLine(idRoutine, routine.idCliente, routineLineData);

    return result;
};

const getRoutineLinesByRoutine = async(idRoutine)=>{
    await routineService.getRoutineById(idRoutine);

    const routineLines = await routineLineModel.getRoutineLinesByRoutine(idRoutine);

    return routineLines;
};

const getRoutineLineById = async(id)=>{
    if(isNaN(id))
        throw new AppError('Invalid routineLine id', 400);

    const routineLine = await routineLineModel.getRoutineLineById(id);

    if(!routineLine)
        throw new AppError('Routine line not found', 404);

    return routineLine;
};

const updateRoutineLine = async(id, routineLineData)=>{
    await getRoutineLineById(id);

    const result = await routineLineModel.updateRoutineLine(id, routineLineData);

    return result;
};

const deleteRoutineLine = async(id)=>{
    await getRoutineLineById(id);

    await routineLineModel.deleteRoutineLine(id);

    return {message : 'Routine line deleted successfully'};
};

module.exports = {
    createRoutineLine,
    getRoutineLinesByRoutine,
    getRoutineLineById,
    updateRoutineLine,
    deleteRoutineLine
};