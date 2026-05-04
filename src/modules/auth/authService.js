const authModel = require('./authModel');

const login = async(user, password) =>{
    const userFound = await authModel.findUser(user);

    if(!userFound) return null;

    //verify password (last change for bcrypt)
    if(userFound.password != password) return null;

    //generate token (last change for jwt)
    return {token : "fake-token"};
};

module.exports = {
    login
};