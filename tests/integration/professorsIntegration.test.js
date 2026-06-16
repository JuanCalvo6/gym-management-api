require('dotenv').config();

const pool = require('../../src/config/db');
const request = require('supertest');
const app = require('../../src/app');

describe("POST /api/professors/", ()=>{
    it("Should create a professor successefully", async ()=>{
        const timestamp = Date.now();

        const res = await request(app)
            .post('/api/professors/')
            .send({
                name: "Juan",
                surname: "Test",
                dni: timestamp.toString(),
                mail: `juan${timestamp}@test.com`,
                user: `juan${timestamp}`,
                password: "123456"
            });
        
        expect(res.statusCode).toBe(201);
    });

    it("Should fail when required fields are missing", async()=>{
        const res = await request(app)
            .post('/api/professors/')
            .send({
                name: "Juan",
                surname: "Test",
                mail: `juan@test.com`,
                user: `juantest1`,
                password: "123456"
            });
        
        expect(res.statusCode).toBe(400);
    });

    it("Should fail when username already exists", async()=>{
        const timestamp = Date.now();
        const professor = {
            name: "Juan",
            surname: "Test",
            dni: timestamp.toString(),
            mail: `juan${timestamp}@test.com`,
            user: `juan${timestamp}`,
            password: "123456"
        }

        await request(app).post('/api/professors/').send(professor);

        const res = await request(app)
            .post('/api/professors/')
            .send({
                ...professor,
                dni: (timestamp + 1).toString(),
                mail: `otro${timestamp}@test.com`
            });

        expect(res.statusCode).toBe(409);
    });

    it("Should fail when dni already exists", async()=>{
        const timestamp = Date.now();
        const professor = {
            name: "Juan",
            surname: "Test",
            dni: timestamp.toString(),
            mail: `juan${timestamp}@test.com`,
            user: `juan${timestamp}`,
            password: "123456"
        }

        await request(app).post('/api/professors/').send(professor);

        const res = await request(app)
            .post('/api/professors/')
            .send({
                ...professor,
                user: `otro${timestamp}`,
                mail: `otro${timestamp}@test.com`
            });

        expect(res.statusCode).toBe(409);
    });

    it("Should fail when mail already exists", async()=>{
        const timestamp = Date.now();
        const professor = {
            name: "Juan",
            surname: "Test",
            dni: timestamp.toString(),
            mail: `juan${timestamp}@test.com`,
            user: `juan${timestamp}`,
            password: "123456"
        }

        await request(app).post('/api/professors/').send(professor);

        const res = await request(app)
            .post('/api/professors/')
            .send({
                ...professor,
                user: `otro${timestamp}`,
                dni: (timestamp + 1).toString(),
            });

        expect(res.statusCode).toBe(409);
    });
});

describe("GET /api/professors/", ()=>{
    it('Should return all active professors', async() =>{

        const res = await request(app).get('/api/professors/');

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    it('Should not return password field', async()=>{
        const res = await request(app).get('/api/professors/');

        expect(res.statusCode).toBe(200);
        
        if(res.body.length > 0)
            expect(res.body[0]).not.toHaveProperty('password');
    });

    it('Should return only active professors', async()=>{
        const res = await request(app).get('/api/professors/');

        expect(res.statusCode).toBe(200);
        res.body.forEach(professor => expect(professor.estado).toBe('A'));
    })
});

describe("GET /api/professors/:id", ()=>{
    it('Should return professor by id', async()=>{
        const createRes = await request(app)
            .post('/api/professors')
            .send({
                name: 'Juan',
                surname: 'Perez',
                dni: Date.now().toString(),
                mail: `juan${Date.now()}@test.com`,
                user: `juan${Date.now()}`,
                password: '123456'
            });

        const professorId = createRes.body.id;
        console.log(createRes.body);
        const res = await request(app).get(`/api/professors/${professorId}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('id');
        expect(res.body.id).toBe(professorId);
    });

    it('Should fail if professor does not exist', async()=>{
        const res = await request(app).get('/api/professors/999999');

        expect(res.statusCode).toBe(404);
    });

    it('Should fail if id is not a number', async()=>{
        const res = await request(app).get('/api/professors/abc');

        expect(res.statusCode).toBe(400);
    });
});

describe("PUT /api/professors/:id", ()=>{
    it('Should update professor successfully', async()=>{
        const createRes = await request(app)
            .post('/api/professors')
            .send({
                name: 'Juan',
                surname: 'Perez',
                dni: Date.now().toString(),
                mail: `juan${Date.now()}@test.com`,
                user: `juan${Date.now()}`,
                password: '123456'
            });

        const professorId = createRes.body.id;

        const res = await request(app)
            .put(`/api/professors/${professorId}`)
            .send({
                name: 'Juan Updated',
                surname: 'Perez',
                dni : Date.now().toString(),
                mail: `juan${Date.now()}Up@test.com`,
                user: `juan${Date.now()}Up`,
            });

        expect(res.statusCode).toBe(200);       
    });

    it('Should fail if id is not a number', async()=>{
        const res =  await request(app).put('/api/professors/abv').send({});

        expect(res.statusCode).toBe(400);
    })

    it('Should fail if professor does not exist', async()=>{
        const res =  await request(app).put('/api/professors/9999999').send({});

        expect(res.statusCode).toBe(404);
    })
});

describe("PATCH /api/professors/:id/deactivate", ()=>{
    it('Should deactivate professor', async()=>{
        const res = await request(app).patch('/api/professors/28/deactivate');

        expect(res.statusCode).toBe(200);
    });

    it('Should fail if professor is already deactivate', async()=>{
        const res = await request(app).patch('/api/professors/28/deactivate');

        expect(res.statusCode).toBe(409);
    });

    it('Should fail if id is not a number', async()=>{
        const res = await request(app).patch('/api/professors/abc/deactivate');
        
        expect(res.statusCode).toBe(400);
    });

    it('Should fail if professor does not exist', async()=>{
        const res = await request(app).patch('/api/professors/999/deactivate');

        expect(res.statusCode).toBe(404);
    });
});

describe("PATCH /api/professors/:id/activate", ()=>{
    it('Should activate professor', async()=>{
        const res = await request(app).patch('/api/professors/27/activate');

        expect(res.statusCode).toBe(200);
    });

    it('Should fail if professor is already activate', async()=>{
        const res = await request(app).patch('/api/professors/27/activate');

        expect(res.statusCode).toBe(409);
    });

    it('Should fail if id is not a number', async()=>{
        const res = await request(app).patch('/api/professors/abc/activate');
        
        expect(res.statusCode).toBe(400);
    });

    it('Should fail if professor does not exist', async()=>{
        const res = await request(app).patch('/api/professors/999/activate');

        expect(res.statusCode).toBe(404);
    });
});

afterAll(async ()=>{
    await pool.end();
});