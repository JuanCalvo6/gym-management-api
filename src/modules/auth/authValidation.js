
const validationLogin =  (req, res, next) =>{
    const {user, password} = req.body;

        if(!user || !password)
            return res.status(400).json({error : "Missing required fields"});

        next();
};

module.exports = {
    validationLogin
};