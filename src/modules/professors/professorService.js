const bcrypt = require('bcryptjs');
const professorModel = require('./professorModel');
const AppError = require('../../utils/AppError');

const createProfessor = async (professorData)=>{

    const existingProfessor = await professorModel.findExistingProfessor(professorData.user,professorData.dni,professorData.mail);

    if(existingProfessor){
        if(existingProfessor.usuario === professorData.user)
            throw new AppError('Username already exists', 409);

        if(existingProfessor.dni === professorData.dni)
            throw new AppError('DNI already exists', 409);

        if(existingProfessor.mail === professorData.mail)
            throw new AppError('Email already exists', 409);
    }

    const hashPassword = await bcrypt.hash(professorData.password,10);

    const newProfessor = {
        ...professorData,
        password: hashPassword
    };

    const result = await professorModel.createProfessor(newProfessor);

    return result;
};

const getAllProfessors = async ()=>{
    const professors = await professorModel.getAllProfessors();

    return professors;
};

const getProfessorById = async (id) =>{
    if(isNaN(id))
        throw new AppError('Invalid professor id', 400);

    const professor = await professorModel.getProfessorById(id);

    if(!professor)
        throw new AppError('Professor not found', 404);

    return professor;
};

const updateProfessor = async (id, professorData) =>{
    await getProfessorById(id);
    
    const duplicatedProfessor = await professorModel.findProfessorByUniqueData(
        professorData.user,
        professorData.dni,
        professorData.mail,
        id
    );

    if(duplicatedProfessor)
        throw new AppError('Professor data already exists', 409);

    const result =await professorModel.updateProfessor(id, professorData);

    return result;
};

module.exports = {
    createProfessor,
    getAllProfessors,
    getProfessorById,
    updateProfessor
}