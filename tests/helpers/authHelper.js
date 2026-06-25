const request = require('supertest');
const app = require('../../src/app');

const getToken = async (user, password)=>{

    const res = await request(app)
        .post('/api/auth/login')
        .send({
            user : user,
            password : password
        });

        return res.body.token;
};

module.exports = {
    getToken
}