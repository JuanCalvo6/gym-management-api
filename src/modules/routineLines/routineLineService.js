const AppError = require('../../utils/AppError');
const routineLineModel = require('./routineLineModel');
const routineService = require('../routines/routineService');
const { settings } = require('../../app');

const createRoutineLine = async(idRoutine, routineLineData)=>{
    const routine = await routineService.getRoutineById(idRoutine);

    const result = await routineLineModel.createRoutineLine(idRoutine, routine.idClient, routineLineData);

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
    const routineLine = await getRoutineLineById(id);

    const updateData = {
        exercise : routineLineData.exercise ?? routineLine.exercise,
        repetitions : routineLineData.repetitions ?? routineLine.repetitions,
        sets : routineLineData.sets ?? routineLine.sets,
        rest : routineLineData.rest ?? routineLine.rest

    };

    const result = await routineLineModel.updateRoutineLine(id, updateData);

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