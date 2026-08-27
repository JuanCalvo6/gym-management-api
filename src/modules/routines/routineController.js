const routineService = require('./routineService');

const createRoutine = async(req, res) =>{
    try {
        const {id} = req.params;

        const routine = await routineService.createRoutine(id, req.body);

        res.status(201).json(routine);

    } catch (error) {
        res.status(error.statusCode || 500).json({error : error.message});
    }
};

const getRoutinesByClient = async(req, res) =>{
    try {
        const {id} = req.params;

        const routines = await routineService.getRoutinesByClient(id);

        res.status(200).json(routines);

    } catch (error) {
        res.status(error.statusCode || 500).json({error : error.message});
    }
};

const getRoutineById = async(req, res) =>{
    try {
        const {id} = req.params;

        const routine = await routineService.getRoutineById(id);

        res.status(200).json(routine);
        
    } catch (error) {
        res.status(error.statusCode || 500).json({error : error.message});
    }
};

const updateRoutine = async(req, res) =>{
    try {
        const {id} = req.params;

        const routine = await routineService.updateRoutine(id, req.body);

        res.status(200).json(routine);
        
    } catch (error) {
        res.status(error.statusCode || 500).json({error : error.message});
    }
};

const deactivateRoutine = async(req, res) =>{
    try {
        const {id} = req.params;

        const routine = await routineService.deactivateRoutine(id);

        res.status(200).json(routine);
        
    } catch (error) {
        res.status(error.statusCode || 500).json({error : error.message});
    }
};

const activateRoutine = async(req, res) =>{
    try {
        const {id} = req.params;

        const routine = await routineService.activateRoutine(id);

        res.status(200).json(routine);

    } catch (error) {
        res.status(error.statusCode || 500).json({error : error.message});
    }
};

const deleteRoutine = async(req, res) =>{
    try {
        const {id} = req.params;

        const routine = await routineService.deleteRoutine(id);

        res.status(204).json(routine);
        
    } catch (error) {
        res.status(error.statusCode || 500).json({error : error.message});
    }
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