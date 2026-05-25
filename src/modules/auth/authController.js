const authService = require('./authService');

const login = async (req, res) =>{
    try {
        const {user, password} = req.body;

        const result = await authService.login(user, password);

        res.json(result);

    } catch (error) {

        if(error.message === 'Invalid credentials'){
            return res.status(401).json({error : error.message});
        }

        res.status(500).json({error: "Server error"});
    }
};

const logout = async (req,res) =>{
    res.json({message : "Logout successfull"});
};

const verifyToken = async (req, res) =>{
    const authHeader = req.headers.authorization;
    

    if(!authHeader){
        return res.status(401).json({authenticated : false});
    }

    const token = authHeader.split(" ")[1];

    const decoded = await authService.verifyToken(token);

    if(!decoded){
        return res.status(401).json({authenticated : false});
    }

    return res.json({
        authenticated : true,
        user: decoded
    });
};

module.exports = {
    login,
    logout,
    verifyToken
};