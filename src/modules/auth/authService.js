const authModel = require('./authModel');
const bcrypt = require("bcryptjs");

const login = async(user, password) =>{
    const userFound = await authModel.findUser(user);

    if(!userFound) return null;


    const isMatch = await bcrypt.compare(password, userFound.password);
    if(!isMatch) return null;

    //generate token (last change for jwt)
    return {
        token : "fake-token",
        user  : userFound.user,
        type  : userFound.type
    };
};

module.exports = {
    login
};