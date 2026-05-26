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
}

module.exports = {
    createProfessor
}