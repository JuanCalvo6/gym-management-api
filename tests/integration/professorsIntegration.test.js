require('dotenv').config();

const pool = require('../../src/config/db');
const request = require('supertest');
const app = require('../../src/app');
const {getToken} = require('../helpers/authHelper');
const {
    createProfessorTest,
    deleteProfessorTest
} = require('../helpers/professorsHelper');

describe("POST /api/professors/", ()=>{
    it.only("Should create a professor successefully", async ()=>{
        const tokenAdmin = await getToken(
            process.env.USER_ADMIN_TEST,
            process.env.PASSWORD_ADMIN_TEST
        );

        const res = await request(app)
            .post('/api/professors/')
            .set('Authorization', `Bearer ${tokenAdmin}`)
            .send({
                name: "Pepe",
                surname: "Tester",
                dni: 22222222,
                mail: 'pepe@test.com',
                user: 'pepe123',
                password: "123456"
            });
        console.log(res.body);
        expect(res.statusCode).toBe(201);

        await deleteProfessorTest(res.body.id);
    });

    it("Should fail when required fields are missing", async()=>{
        const tokenAdmin = await getToken(
            process.env.USER_ADMIN_TEST,
            process.env.PASSWORD_ADMIN_TEST
        );

        const res = await request(app)
            .post('/api/professors/')
            .set('Authorization', `Bearer ${tokenAdmin}`)
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
        const tokenAdmin = await getToken(
            process.env.USER_ADMIN_TEST,
            process.env.PASSWORD_ADMIN_TEST
        );

        const professor = {
            name: "Juan2",
            surname: "Tester",
            dni: 22222222,
            mail: `juan2@test.com`,
            user: `juan123`,
            password: "1234567"
        }

        const professorTest = await createProfessorTest();

        const res = await request(app)
            .post('/api/professors/')
            .set('Authorization', `Bearer ${tokenAdmin}`)
            .send(professor);

        expect(res.statusCode).toBe(409);
        await deleteProfessorTest(professorTest.id)
    });

    it("Should fail when dni already exists", async()=>{
        const tokenAdmin = await getToken(
            process.env.USER_ADMIN_TEST,
            process.env.PASSWORD_ADMIN_TEST
        );

        const professor = {
            name: "Juan2",
            surname: "Tester",
            dni: 11111111,
            mail: `juan2@test.com`,
            user: `juan12`,
            password: "1234567"
        }

        const professorTest = await createProfessorTest();

        const res = await request(app)
            .post('/api/professors/')
            .set('Authorization', `Bearer ${tokenAdmin}`)
            .send(professor);
 
        expect(res.statusCode).toBe(409);
        await deleteProfessorTest(professorTest.id);
    });

    it("Should fail when mail already exists", async()=>{
        const tokenAdmin = await getToken(
            process.env.USER_ADMIN_TEST,
            process.env.PASSWORD_ADMIN_TEST
        );

        const professor = {
            name: "Juan2",
            surname: "Tester",
            dni: 22222222,
            mail: `juan@test.com`,
            user: `juan12`,
            password: "1234567"
        }

        const professorTest = await createProfessorTest();

        const res = await request(app)
            .post('/api/professors/')
            .set('Authorization', `Bearer ${tokenAdmin}`)
            .send(professor);
 
        expect(res.statusCode).toBe(409);
        await deleteProfessorTest(professorTest.id)
    });
});

describe("GET /api/professors/", ()=>{
    it('Should return all active professors', async() =>{
        const tokenAdmin = await getToken(
            process.env.USER_ADMIN_TEST,
            process.env.PASSWORD_ADMIN_TEST
        );

        const res = await request(app)
            .get('/api/professors/')
            .set('Authorization', `Bearer ${tokenAdmin}`);

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    it('Should not return password field', async()=>{
        const tokenAdmin = await getToken(
            process.env.USER_ADMIN_TEST,
            process.env.PASSWORD_ADMIN_TEST
        );

        const res = await request(app)
            .get('/api/professors/')
            .set('Authorization', `Bearer ${tokenAdmin}`);

        expect(res.statusCode).toBe(200);
        
        if(res.body.length > 0)
            expect(res.body[0]).not.toHaveProperty('password');
    });

    it('Should return only active professors', async()=>{
        const tokenAdmin = await getToken(
            process.env.USER_ADMIN_TEST,
            process.env.PASSWORD_ADMIN_TEST
        );

        const res = await request(app)
            .get('/api/professors/')
            .set('Authorization', `Bearer ${tokenAdmin}`);

        expect(res.statusCode).toBe(200);
        res.body.forEach(professor => expect(professor.status).toBe('A'));
    })
});

describe("GET /api/professors/:id", ()=>{
    it('Should return professor by id', async()=>{
        const tokenAdmin = await getToken(
            process.env.USER_ADMIN_TEST,
            process.env.PASSWORD_ADMIN_TEST
        );

        const professorTest = await createProfessorTest();
        
        const res = await request(app)
            .get(`/api/professors/${professorTest.id}`)
            .set('Authorization', `Bearer ${tokenAdmin}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('id');
        expect(res.body.id).toBe(professorTest.id);

        await deleteProfessorTest(professorTest.id);
    });

    it('Should fail if professor does not exist', async()=>{
        const tokenAdmin = await getToken(
            process.env.USER_ADMIN_TEST,
            process.env.PASSWORD_ADMIN_TEST
        );

        const res = await request(app)
            .get('/api/professors/999999')
            .set('Authorization', `Bearer ${tokenAdmin}`);

        expect(res.statusCode).toBe(404);
    });

    it('Should fail if id is not a number', async()=>{
        const tokenAdmin = await getToken(
            process.env.USER_ADMIN_TEST,
            process.env.PASSWORD_ADMIN_TEST
        );

        const res = await request(app)
            .get('/api/professors/abc')
            .set('Authorization', `Bearer ${tokenAdmin}`);

        expect(res.statusCode).toBe(400);
    });
});

describe("PUT /api/professors/:id", ()=>{
    it('Should update professor successfully', async()=>{
        const tokenAdmin = await getToken(
            process.env.USER_ADMIN_TEST,
            process.env.PASSWORD_ADMIN_TEST
        );

        const professorTest = await createProfessorTest();

        const res = await request(app)
            .put(`/api/professors/${professorTest.id}`)
            .set('Authorization', `Bearer ${tokenAdmin}`)
            .send({
                user: `juanUpdate`,
            });
        
        expect(res.statusCode).toBe(200);    
        
        await deleteProfessorTest(professorTest.id);
    });

    it('Should fail if id is not a number', async()=>{
        const tokenAdmin = await getToken(
            process.env.USER_ADMIN_TEST,
            process.env.PASSWORD_ADMIN_TEST
        );

        const res =  await request(app)
            .put('/api/professors/abv')
            .set('Authorization', `Bearer ${tokenAdmin}`)
            .send({});

        expect(res.statusCode).toBe(400);
    })

    it('Should fail if professor does not exist', async()=>{
        const tokenAdmin = await getToken(
            process.env.USER_ADMIN_TEST,
            process.env.PASSWORD_ADMIN_TEST
        );

        const res =  await request(app)
            .put('/api/professors/9999999')
            .set('Authorization', `Bearer ${tokenAdmin}`)
            .send({});

        expect(res.statusCode).toBe(404);
    })
});

describe("PATCH /api/professors/:id/deactivate", ()=>{
    it('Should deactivate professor', async()=>{
        const tokenAdmin = await getToken(
            process.env.USER_ADMIN_TEST,
            process.env.PASSWORD_ADMIN_TEST
        );

        const professorTest = await createProfessorTest();

        const res = await request(app)
            .patch(`/api/professors/${professorTest.id}/deactivate`)
            .set('Authorization', `Bearer ${tokenAdmin}`);

        expect(res.statusCode).toBe(200);

        await deleteProfessorTest(professorTest.id);
    });

    it('Should fail if professor is already deactivate', async()=>{
        const tokenAdmin = await getToken(
            process.env.USER_ADMIN_TEST,
            process.env.PASSWORD_ADMIN_TEST
        );

        const professorTest = await createProfessorTest();

        await request(app)
            .patch(`/api/professors/${professorTest.id}/deactivate`)
            .set('Authorization', `Bearer ${tokenAdmin}`);

        const res = await request(app)
            .patch(`/api/professors/${professorTest.id}/deactivate`)
            .set('Authorization', `Bearer ${tokenAdmin}`);

        expect(res.statusCode).toBe(409);

        await deleteProfessorTest(professorTest.id);
    });

    it('Should fail if id is not a number', async()=>{
        const tokenAdmin = await getToken(
            process.env.USER_ADMIN_TEST,
            process.env.PASSWORD_ADMIN_TEST
        );

        const res = await request(app)
            .patch('/api/professors/abc/deactivate')
            .set('Authorization', `Bearer ${tokenAdmin}`);
        
        expect(res.statusCode).toBe(400);
    });

    it('Should fail if professor does not exist', async()=>{
        const tokenAdmin = await getToken(
            process.env.USER_ADMIN_TEST,
            process.env.PASSWORD_ADMIN_TEST
        );

        const res = await request(app)
            .patch('/api/professors/9999/deactivate')
            .set('Authorization', `Bearer ${tokenAdmin}`);

        expect(res.statusCode).toBe(404);
    });
});

describe("PATCH /api/professors/:id/activate", ()=>{
    it('Should activate professor', async()=>{
        const tokenAdmin = await getToken(
            process.env.USER_ADMIN_TEST,
            process.env.PASSWORD_ADMIN_TEST
        );

        const professorTest = await createProfessorTest();

        await request(app)
            .patch(`/api/professors/${professorTest.id}/deactivate`)
            .set('Authorization', `Bearer ${tokenAdmin}`);

        const res = await request(app)
            .patch(`/api/professors/${professorTest.id}/activate`)
            .set('Authorization', `Bearer ${tokenAdmin}`);

        expect(res.statusCode).toBe(200);

        await deleteProfessorTest(professorTest.id);
    });

    it('Should fail if professor is already activate', async()=>{
        const tokenAdmin = await getToken(
            process.env.USER_ADMIN_TEST,
            process.env.PASSWORD_ADMIN_TEST
        );

        const professorTest = await createProfessorTest();

        const res = await request(app)
            .patch(`/api/professors/${professorTest.id}/activate`)
            .set('Authorization', `Bearer ${tokenAdmin}`);

        expect(res.statusCode).toBe(409);

        await deleteProfessorTest(professorTest.id);
    });

    it('Should fail if id is not a number', async()=>{
        const tokenAdmin = await getToken(
            process.env.USER_ADMIN_TEST,
            process.env.PASSWORD_ADMIN_TEST
        );

        const res = await request(app)
            .patch('/api/professors/abc/activate')
            .set('Authorization', `Bearer ${tokenAdmin}`);
        
        expect(res.statusCode).toBe(400);
    });

    it('Should fail if professor does not exist', async()=>{
        const tokenAdmin = await getToken(
            process.env.USER_ADMIN_TEST,
            process.env.PASSWORD_ADMIN_TEST
        );

        const res = await request(app)
            .patch('/api/professors/9999/activate')
            .set('Authorization', `Bearer ${tokenAdmin}`);

        expect(res.statusCode).toBe(404);
    });
});

describe("PATCH /api/professors/:id/password", ()=>{
    it('Should update password successfully', async()=>{
        const tokenAdmin = await getToken(
            process.env.USER_ADMIN_TEST,
            process.env.PASSWORD_ADMIN_TEST
        );

        const professorTest = await createProfessorTest();

        const res = await request(app)
            .patch(`/api/professors/${professorTest.id}/password`)
            .set('Authorization', `Bearer ${tokenAdmin}`)
            .send({password : '123abc'});

        expect(res.statusCode).toBe(200);

        await deleteProfessorTest(professorTest.id);
    });

    it('Should fail if id is not a number', async()=>{
        const tokenAdmin = await getToken(
            process.env.USER_ADMIN_TEST,
            process.env.PASSWORD_ADMIN_TEST
        );

        const res = await request(app)
            .patch('/api/professors/abc/password')
            .set('Authorization', `Bearer ${tokenAdmin}`)
            .send({password : '123abc'});
        
        expect(res.statusCode).toBe(400);
    });

    it('Should fail if professor does not exist', async()=>{
        const tokenAdmin = await getToken(
            process.env.USER_ADMIN_TEST,
            process.env.PASSWORD_ADMIN_TEST
        );

        const res = await request(app)
            .patch('/api/professors/9999/password')
            .set('Authorization', `Bearer ${tokenAdmin}`)
            .send({password : '123abc'});

        expect(res.statusCode).toBe(404);
    });

    it('Should fail if password is missing', async()=>{
        const tokenAdmin = await getToken(
            process.env.USER_ADMIN_TEST,
            process.env.PASSWORD_ADMIN_TEST
        );

        const professorTest = await createProfessorTest();

        const res = await request(app)
            .patch(`/api/professors/${professorTest.id}/password`)
            .set('Authorization', `Bearer ${tokenAdmin}`)
            .send({});

        expect(res.statusCode).toBe(400);

        await deleteProfessorTest(professorTest.id);
    });

    it('Should fail if password is too short', async()=>{
        const tokenAdmin = await getToken(
            process.env.USER_ADMIN_TEST,
            process.env.PASSWORD_ADMIN_TEST
        );

        const professorTest = await createProfessorTest();

        const res = await request(app)
            .patch(`/api/professors/${professorTest.id}/password`)
            .set('Authorization', `Bearer ${tokenAdmin}`)
            .send({password: '123'});

        expect(res.statusCode).toBe(400);

        await deleteProfessorTest(professorTest.id);
    });

    it('Should fail if password is too long', async()=>{
        const tokenAdmin = await getToken(
            process.env.USER_ADMIN_TEST,
            process.env.PASSWORD_ADMIN_TEST
        );

        const professorTest = await createProfessorTest();

        const res = await request(app)
            .patch(`/api/professors/${professorTest.id}/password`)
            .set('Authorization', `Bearer ${tokenAdmin}`)
            .send({password: '1234567890123456789012345678901234567890123456789012345678901234'});

        expect(res.statusCode).toBe(400);

        await deleteProfessorTest(professorTest.id);
    });

});

afterAll(async ()=>{
    await pool.end();
});