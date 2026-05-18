const jwtUtils = require('../utils/jwtUtils');

const authMiddleware = (req, res, next) =>{
    const authHeader = req.headers.authorization;

    if(!authHeader)
        return res.status(401).json({error : "Token required"});
    
    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwtUtils.verifyToken(token);
        
        req.user = decoded;
        next();

    } catch (error) {
        return res.status(401).json({error : "Invalid Token"});
    }
};

module.exports = {authMiddleware}
