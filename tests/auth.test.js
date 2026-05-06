const request = require('supertest');
const app = require('../src/app');

describe("POST /api/auth/login", () =>{
    it("Should login successfully", async ()=>{
        const res = await request(app).post('/api/auth/login').send({
            "user" : "juan123",
            "password" : "1234"
        });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('token');
    });

    it("Should fail with invalid credentials", async () =>{
        const res = await request(app).post('/api/auth/login').send({
            "user" : "juan123",
            "password" : "5678"
        });

        expect(res.statusCode).toBe(401);
    });
});