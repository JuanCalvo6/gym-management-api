

const validateRole = (...allowedRoles) =>{

    return (req, res, next)=>{

        if(!allowedRoles.includes(req.user.type)){
            return res.status(403).json({error: 'Forbidden'});
        }

        next();
    }
};

module.exports = {validateRole};