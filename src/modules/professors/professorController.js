const professorService = require('./professorService');

const createProfessor = async (req, res) =>{
    try {
        const result = await professorService.createProfessor(req.body);
        
        res.status(201).json(result);
    
    } catch (error) {

        res.status(error.statusCode || 500).json({error: error.message});
    }
};

module.exports = {
    createProfessor
}