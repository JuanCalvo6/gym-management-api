

const findUser = async(user) =>{
    // const [userFound] = await ... QUERY
    const userFound = {
        "user" : "juan123",
        "type" : "admin",
        "password" : "$2b$10$8YKaWS6QmtSPmCUrLfktc.6gnlT5QGpBYc14Dc7nVOlCUz04aYoIG"
    };

    if(user == userFound.user){
        return userFound;
    }

    return null;
};

module.exports = {
    findUser
};