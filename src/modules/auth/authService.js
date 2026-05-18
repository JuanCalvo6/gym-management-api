const jwtUtils = require('../../utils/jwtUtils');
const authModel = require('./authModel');
const bcrypt = require("bcryptjs");

const login = async(user, password) =>{
    const userFound = await authModel.findUser(user);

    if(!userFound) return null;


    const isValidPassword = await bcrypt.compare(password, userFound.password);

    if(!isValidPassword) return null;

    const token = jwtUtils.generateToken(
        {
            user : userFound.user,
            type : userFound.type
        }
    );
    
    return {
        token : token
    };
};

const verifyToken = async (token) =>{
    try {
        
        const decoded = jwtUtils.verifyToken(token);

        return decoded;

    } catch (error) {
        return null;
    }
}

module.exports = {
    login,
    verifyToken
};