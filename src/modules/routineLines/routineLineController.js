const routineLineService = require('./routineLineService');

const createRoutineLine = async(req, res)=>{
    try {
        const {id} = req.params;

        const routineLine = await routineLineService.createRoutineLine(id, req.body);

        res.status(201).json(routineLine);

    } catch (error) {
        res.status(error.statusCode || 500).json({error : error.message});
    }
};

const getRoutineLinesByRoutine = async(req, res)=>{
    try {
        const {id} = req.params;

        const routineLines = await routineLineService.getRoutineLinesByRoutine(id);

        res.status(200).json(routineLines);

    } catch (error) {
        res.status(error.statusCode || 500).json({error : error.message});
    }
};

const getRoutineLineById = async(req, res)=>{
    try {
        const {id} = req.params;

        const routineLine = await routineLineService.getRoutineLineById(id);

        res.status(200).json(routineLine);

    } catch (error) {
        res.status(error.statusCode || 500).json({error : error.message});
    }
};

const updateRoutineLine = async(req, res)=>{
    try {
        const {id} = req.params;

        const routineLine = await routineLineService.updateRoutineLine(id, req.body);

        res.status(200).json(routineLine);

    } catch (error) {
        res.status(error.statusCode || 500).json({error : error.message});
    }
};

const deleteRoutineLine = async(req, res)=>{
    try {
        const {id} = req.params;

        const routineLine = await routineLineService.deleteRoutineLine(id);

        res.status(204).json(routineLine);
        
    } catch (error) {
        res.status(error.statusCode || 500).json({error : error.message});
    }
};

module.exports = {
    createRoutineLine,
    getRoutineLinesByRoutine,
    getRoutineLineById,
    updateRoutineLine,
    deleteRoutineLine
};