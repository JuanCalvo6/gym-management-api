const AppError = require('../../utils/AppError');

const validateClient = (req, res, next) =>{
    const {
        name,
        surname,
        documentType,
        dni,
        phone,
        address,
        mail
    } = req.body;

    try {
        //required fields
        if(!name || !surname || !documentType || !dni)
            throw new AppError('Missing required fields', 400);

        //name
        if(name.length > 30)
            throw new AppError('Name cannot exceed 30 characters', 400);
        //surname
        if(surname.length > 30)
            throw new AppError('Surname cannot exceed 30 characters', 400);
        //documentType
        const validDocumentType = ['DNI', 'PASSPORT '];
        if(!validDocumentType.includes(documentType))
            throw new AppError('Invalid document type', 400);
        //dni
        if(dni.length > 20)
            throw new AppError('DNI cannot exceed 20 characters', 400);
        //phone
        if(phone){
            if(!/^\d+$/.test(phone))
                throw new AppError('Phone must contain only numbers', 400);
            if(phone.length > 11)
                throw new AppError('Phone cannot exceed 11 characters', 400);
        }
        //address
        if(address && address.length > 30)
            throw new AppError('Address cannot exceed 30 characters', 400);
        //mail
        if(mail){
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if(!emailRegex.test(mail))
                throw new AppError('Invalid email format', 400);
            if(mail.length > 30)
                throw new AppError('Email cannot exceed 30 characters', 400);
        }

        next();
        
    } catch (error) {
        res.status(error.statusCode || 500).json({error : error.message});
    }
};

module.exports = {validateClient};