const rutineService = require('./rutineService');

const createRutine = async(req, res) =>{
    try {
        const {id} = req.params;

        const rutine = await rutineService.createRutine(id, req.body);

        res.status(201).json(rutine);

    } catch (error) {
        res.status(error.statusCode || 500).json({error : error.message});
    }
};

const getRutinesByClient = async(req, res) =>{
    try {
        const {id} = req.params;

        const rutines = await rutineService.getRutinesByClient(id);

        res.status(200).json(rutines);

    } catch (error) {
        res.status(error.statusCode || 500).json({error : error.message});
    }
};

const getRutineById = async(req, res) =>{
    try {
        const {id} = req.params;

        const rutine = await rutineService.getRutineById(id);

        res.status(200).json(rutine);
        
    } catch (error) {
        res.status(error.statusCode || 500).json({error : error.message});
    }
};

const updateRutine = async(req, res) =>{
    try {
        const {id} = req.params;

        const rutine = await rutineService.updateRutine(id, req.body);

        res.status(200).json(rutine);
        
    } catch (error) {
        res.status(error.statusCode || 500).json({error : error.message});
    }
};

const deactivateRutine = async(req, res) =>{
    try {
        const {id} = req.params;

        const rutine = await rutineService.deactivateRutine(id);

        res.status(200).json(rutine);
        
    } catch (error) {
        res.status(error.statusCode || 500).json({error : error.message});
    }
};

const activateRutine = async(req, res) =>{
    try {
        const {id} = req.params;

        const rutine = await rutineService.activateRutine(id);

        res.status(200).json(rutine);

    } catch (error) {
        res.status(error.statusCode || 500).json({error : error.message});
    }
};

const deleteRutine = async(req, res) =>{
    try {
        const {id} = req.params;

        const rutine = await rutineService.deleteRutine(id);

        res.status(204).json(rutine);
        
    } catch (error) {
        res.status(error.statusCode || 500).json({error : error.message});
    }
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