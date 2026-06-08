const professorService = require('./professorService');

const createProfessor = async (req, res) =>{
    try {
        const professors = await professorService.createProfessor(req.body);
        
        res.status(201).json(professors);
    
    } catch (error) {

        res.status(error.statusCode || 500).json({error: error.message});
    }
};

const getAllProfessors = async (req,res) => {
    try {
        const result = await professorService.getAllProfessors();

        res.status(200).json(result);
        
    } catch (error) {
        res.status(error.statusCode || 500).json({error: error.message});
    
    }
};

const getProfessorById = async (req, res) =>{
    try {
        const {id} = req.params;

        const professor = await professorService.getProfessorById(id);

        res.status(200).json(professor);

    } catch (error) {
        res.status(error.statusCode || 500).json({error: error.message});
    }
};

const updateProfessor = async(req, res) =>{
    try {
        const {id} = req.params;

        const professor = await professorService.updateProfessor(id, req.body);

        res.status(200).json(professor);

    } catch (error) {
        res.status(error.statusCode || 500).json({error: error.message});
    }
};

module.exports = {
    createProfessor,
    getAllProfessors,
    getProfessorById,
    updateProfessor
}