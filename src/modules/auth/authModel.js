

const findUser = async(user) =>{
    // const [userFound] = await ... QUERY
    const userFound = {
        "user" : "juan123",
        "type" : "admin",
        "password" : "1234"
    };

    if(user == userFound.user){
        return userFound;
    }

    return null;
};

module.exports = {
    findUser
};