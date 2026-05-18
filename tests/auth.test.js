require('dotenv').config();

const request = require('supertest');
const app = require('../src/app');

// npm test -- --runInBand --verbose

describe("POST /api/auth/login", () =>{
    it("Should login successfully", async ()=>{
        const res = await request(app).post('/api/auth/login').send({
            "user" : "juan123",
            "password" : "1234"
        });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('token');
    });

    it("Should fail with invalid credentials (Password)", async () =>{
        const res = await request(app).post('/api/auth/login').send({
            "user" : "juan123",
            "password" : "5678"
        });

        expect(res.statusCode).toBe(401);
    });

    it("Should fail with invalid credentials (Username)", async () =>{
        const res = await request(app).post('/api/auth/login').send({
            "user" : "juan1",
            "password" : "1234"
        });

        expect(res.statusCode).toBe(401);
    });
    it("Should fail if fields are missing ", async()=>{
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                user : "juan123"
            });

            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty(
                "error",
                "Missing required fields"
            );
    });
});

describe("POST /api/auth/logout", () =>{
    it("Should logout successfully", async()=>{
        const res = await request(app)
            .post('/api/auth/logout');

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty(
            "message",
            "Logout successfull"
        );
    });
});

describe("GET /api/auth/verify", () =>{
    it("Should verify valid token", async()=>{
        const loginRes = await request(app)
            .post("/api/auth/login")
            .send({
                user : "juan123",
                password : "1234"
            });

        const token = loginRes.body.token;
        
        const verifyRes = await request(app)
            .get("/api/auth/verify")
            .set("Authorization", `Bearer ${token}`);
        console.log(verifyRes);

        expect(verifyRes.statusCode).toBe(200);
        expect(verifyRes.body).toHaveProperty(
            "authenticated",
            true
        );
    });
    it("Should fail with invalid token", async()=>{
        const res = await request(app)
            .get('/api/auth/verify')
            .set("Authorization", "Bearer invalidToken");

        expect(res.statusCode).toBe(401);
        expect(res.body).toHaveProperty(
            "authenticated",
            false
        );
    });
    it("Should fail without token", async()=>{
        const res = await request(app)
            .get('/api/auth/verify');

        expect(res.statusCode).toBe(401);
        expect(res.body).toHaveProperty(
            "authenticated",
            false
        );
    });
});