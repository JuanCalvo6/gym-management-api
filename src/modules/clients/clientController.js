const clientService = require('./clientService');


const createClient = async(req, res) =>{
    try {
        const client = await clientService.createClient(req.body);

        res.status(201).json(client);
        
    } catch (error) {
        res.status(error.statusCode || 500).json({error : error.message});
    }
};

const getAllClients = async(req, res) =>{
    try {
        const clients = await clientService.getAllClients();

        res.status(200).json(clients);
        
    } catch (error) {
        res.status(error.statusCode),json({error: error.message});
    }
};

const getClientById = async(req, res) =>{
    try {
        const {id} = req.params;

        const client = await clientService.getClientById(id);
        
        res.status(200).json(client);

    } catch (error) {
        res.status(error.statusCode).json({error: error.message});
    }
};

const updateClient = async(req, res) =>{
    try {
        const {id} = req.params;
        
        const client = await clientService.updateClient(id, req.body);

        res.status(200).json(client);
    } catch (error) {
        res.status(error.statusCode || 500).json({error: error.message});
    }
};

const deactivateClient = async(req, res) =>{
    try {
        const {id} = req.params;
        
        const client = await clientService.deactivateClient(id);

        res.status(200).json(client);

    } catch (error) {
        res.status(error.statusCode || 500).json({error: error.message});
    }
};

const activateClient = async(req, res) =>{
    try {
        const {id} = req.params;
        
        const client = await clientService.activateClient(id);

        res.status(200).json(client);
        
    } catch (error) {
        res.status(error.statusCode || 500).json({error: error.message});
    }
};

module.exports = {
    createClient,
    getAllClients,
    getClientById,
    updateClient,
    deactivateClient,
    activateClient
}