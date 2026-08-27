require('dotenv').config();

const pool = require('../../src/config/db');
const request = require('supertest');
const app = require('../../src/app');
const {getToken} = require('../helpers/authHelper');
const {
    createClientTest,
    deleteClientTest
} = require('../helpers/clientsHelper');
const {
    createRutineTest,
    deleteRutineTest
} = require('../helpers/rutinesHelper');

describe('POST /api/clients/:id/rutines', ()=>{
    it('Should create a rutine successfully', async()=>{
        const tokenProfessor = await getToken(
            process.env.USER_PROFESSOR_TEST,
            process.env.PASSWORD_PROFESSOR_TEST
        );

        const clientTest = await createClientTest(tokenProfessor);

        const res = await request(app)
            .post(`/api/clients/${clientTest.id}/rutines`)
            .set('Authorization', `Bearer ${tokenProfessor}`)
            .send({
                name : 'RutineTest',
                notes : 'Note test'
            });

        expect(res.statusCode).toBe(201);

        await deleteRutineTest(res.body.id);
        await deleteClientTest(clientTest.id);
    });

    it('Should fail when required fileds are missing', async()=>{
        const tokenProfessor = await getToken(
            process.env.USER_PROFESSOR_TEST,
            process.env.PASSWORD_PROFESSOR_TEST
        );

        const clientTest = await createClientTest(tokenProfessor);

        const res = await request(app)
            .post(`/api/clients/${clientTest.id}/rutines`)
            .set('Authorization', `Bearer ${tokenProfessor}`)
            .send({
                notes : 'Note test'
            });

        expect(res.statusCode).toBe(400);

        await deleteClientTest(clientTest.id);
    });
    
    it('Should fail if rutine already exists', async()=>{
        const tokenProfessor = await getToken(
            process.env.USER_PROFESSOR_TEST,
            process.env.PASSWORD_PROFESSOR_TEST
        );

        const clientTest = await createClientTest(tokenProfessor);
        const rutineTest = await createRutineTest(clientTest.id, tokenProfessor);

        const res = await request(app)
            .post(`/api/clients/${clientTest.id}/rutines`)
            .set('Authorization', `Bearer ${tokenProfessor}`)
            .send({
                name : 'RutineTest',
                notes : 'Note test'
            });

        expect(res.statusCode).toBe(409);

        await deleteRutineTest(rutineTest.id);
        await deleteClientTest(clientTest.id);
    });
});

describe('GET /api/clients/:id/rutines', ()=>{
    it('Should return rutines by client', async()=>{
        const tokenProfessor = await getToken(
            process.env.USER_PROFESSOR_TEST,
            process.env.PASSWORD_PROFESSOR_TEST
        );

        const clientTest = await createClientTest(tokenProfessor);

        const res = await request(app)
            .get(`/api/clients/${clientTest.id}/rutines`)
            .set('Authorization', `Bearer ${tokenProfessor}`);

        expect(res.statusCode).toBe(200);

        await deleteClientTest(clientTest.id);
    });
});

describe('GET /api/rutines/:id', ()=>{
    it('Should return rutine by id', async()=>{
        const tokenProfessor = await getToken(
            process.env.USER_PROFESSOR_TEST,
            process.env.PASSWORD_PROFESSOR_TEST
        );

        const clientTest = await createClientTest(tokenProfessor);
        const rutineTest = await createRutineTest(clientTest.id, tokenProfessor);

        const res = await request(app)
            .get(`/api/rutines/${rutineTest.id}`)
            .set('Authorization', `Bearer ${tokenProfessor}`);

        expect(res.statusCode).toBe(200);

        await deleteRutineTest(rutineTest.id);
        await deleteClientTest(clientTest.id);
    });

    it('Should fail if id is not a number', async()=>{
        const tokenProfessor = await getToken(
            process.env.USER_PROFESSOR_TEST,
            process.env.PASSWORD_PROFESSOR_TEST
        );

        const res = await request(app)
            .get('/api/rutines/abc')
            .set('Authorization', `Bearer ${tokenProfessor}`);

        expect(res.status).toBe(400);
    });

    it('Should fail if rutine does not exist', async()=>{
        const tokenProfessor = await getToken(
            process.env.USER_PROFESSOR_TEST,
            process.env.PASSWORD_PROFESSOR_TEST
        );

        const res = await request(app)
            .get('/api/rutines/9999')
            .set('Authorization', `Bearer ${tokenProfessor}`);

        expect(res.status).toBe(404);
    });
});

describe('PUT /api/rutines/:id', ()=>{
    it('Should update rutine successfully', async()=>{
        const tokenProfessor = await getToken(
            process.env.USER_PROFESSOR_TEST,
            process.env.PASSWORD_PROFESSOR_TEST
        );

        const clientTest = await createClientTest(tokenProfessor);
        const rutineTest = await createRutineTest(clientTest.id, tokenProfessor);

        const res = await request(app)
            .put(`/api/rutines/${rutineTest.id}`)
            .set('Authorization', `Bearer ${tokenProfessor}`)
            .send({
                name : 'New Rutine name'
            });

        expect(res.statusCode).toBe(200)
        
        await deleteRutineTest(rutineTest.id);
        await deleteClientTest(clientTest.id);
    });

    it('Should fail if rutine name already exist', async()=>{
        const tokenProfessor = await getToken(
            process.env.USER_PROFESSOR_TEST,
            process.env.PASSWORD_PROFESSOR_TEST
        );

        const clientTest = await createClientTest(tokenProfessor);
        const rutineTest = await createRutineTest(clientTest.id, tokenProfessor);
        const rutineUpdate = await request(app)
            .post(`/api/clients/${clientTest.id}/rutines`)
            .set('Authorization', `Bearer ${tokenProfessor}`)
            .send({
                name : 'RutineUpdate',
                notes : 'Note test'
            });

        const res = await request(app)
            .put(`/api/rutines/${rutineUpdate.body.id}`)
            .set('Authorization', `Bearer ${tokenProfessor}`)
            .send({
                name : 'RutineTest'
            });
        
        expect(res.statusCode).toBe(409)
        
        await deleteRutineTest(rutineTest.id);
        await deleteRutineTest(rutineUpdate.body.id);
        await deleteClientTest(clientTest.id);
    });
});

describe('PATCH /api/rutines/:id/deactivate', ()=>{
    it('Should deactivate rutine', async()=>{
        const tokenProfessor = await getToken(
            process.env.USER_PROFESSOR_TEST,
            process.env.PASSWORD_PROFESSOR_TEST
        );

        const clientTest = await createClientTest(tokenProfessor);
        const rutineTest = await createRutineTest(clientTest.id, tokenProfessor);

        const res = await request(app)
            .patch(`/api/rutines/${rutineTest.id}/deactivate`)
            .set('Authorization', `Bearer ${tokenProfessor}`);

        expect(res.statusCode).toBe(200);

        await deleteRutineTest(rutineTest.id);
        await deleteClientTest(clientTest.id);
    });

    it('Should fail if rutine is already deactivate', async()=>{
        const tokenProfessor = await getToken(
            process.env.USER_PROFESSOR_TEST,
            process.env.PASSWORD_PROFESSOR_TEST
        );

        const clientTest = await createClientTest(tokenProfessor);
        const rutineTest = await createRutineTest(clientTest.id, tokenProfessor);

        await request(app)
            .patch(`/api/rutines/${rutineTest.id}/deactivate`)
            .set('Authorization', `Bearer ${tokenProfessor}`);
        
        const res = await request(app)
        .patch(`/api/rutines/${rutineTest.id}/deactivate`)
        .set('Authorization', `Bearer ${tokenProfessor}`);

        expect(res.statusCode).toBe(409);

        await deleteRutineTest(rutineTest.id);
        await deleteClientTest(clientTest.id);
    });
});

describe('PATCH /api/rutines/:id/activate', ()=>{
    it('Should activate rutine', async()=>{
        const tokenProfessor = await getToken(
            process.env.USER_PROFESSOR_TEST,
            process.env.PASSWORD_PROFESSOR_TEST
        );

        const clientTest = await createClientTest(tokenProfessor);
        const rutineTest = await createRutineTest(clientTest.id, tokenProfessor);

        await request(app)
            .patch(`/api/rutines/${rutineTest.id}/deactivate`)
            .set('Authorization', `Bearer ${tokenProfessor}`);
        
        const res = await request(app)
        .patch(`/api/rutines/${rutineTest.id}/activate`)
        .set('Authorization', `Bearer ${tokenProfessor}`);

        expect(res.statusCode).toBe(200);

        await deleteRutineTest(rutineTest.id);
        await deleteClientTest(clientTest.id);
    });

    it('Should fail if rutine is already activate', async()=>{
        const tokenProfessor = await getToken(
            process.env.USER_PROFESSOR_TEST,
            process.env.PASSWORD_PROFESSOR_TEST
        );

        const clientTest = await createClientTest(tokenProfessor);
        const rutineTest = await createRutineTest(clientTest.id, tokenProfessor);

        const res = await request(app)
            .patch(`/api/rutines/${rutineTest.id}/activate`)
            .set('Authorization', `Bearer ${tokenProfessor}`);

        expect(res.statusCode).toBe(409);

        await deleteRutineTest(rutineTest.id);
        await deleteClientTest(clientTest.id);
    });
});

describe('DELETE /api/rutines/:id', ()=>{
    it('Should delete rutine successfully', async()=>{
        const tokenProfessor = await getToken(
            process.env.USER_PROFESSOR_TEST,
            process.env.PASSWORD_PROFESSOR_TEST
        );

        const clientTest = await createClientTest(tokenProfessor);
        const rutineTest = await createRutineTest(clientTest.id, tokenProfessor);

        const res = await request(app)
            .delete(`/api/rutines/${rutineTest.id}`)
            .set('Authorization', `Bearer ${tokenProfessor}`);
        expect(res.statusCode).toBe(204);

        await deleteClientTest(clientTest.id);
    });
});

afterAll(async ()=>{
    await pool.end();
});