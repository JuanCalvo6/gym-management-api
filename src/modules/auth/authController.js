const authService = require('./authService');

const login = async (req, res) =>{
    try {
        const {user, password} = req.body;

        const result = await authService.login(user, password);

        if(!result){
            return res.status(401).json({error: "Invalid credentials"});
        }

        res.json(result);

    } catch (error) {
        res.status(500).json({error: "Server errro"});
    }
};

const logout = async (req,res) =>{
    res.json({message : "Logout successfull"});
};

const verifyToken = async (req, res) =>{
    res.json({valid : true});
};

module.exports = {
    login,
    logout,
    verifyToken
};