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
    createRoutineTest,
    deleteRoutineTest
} = require('../helpers/routinesHelper');

describe('POST /api/clients/:id/routines', ()=>{
    it('Should create a routine successfully', async()=>{
        const tokenProfessor = await getToken(
            process.env.USER_PROFESSOR_TEST,
            process.env.PASSWORD_PROFESSOR_TEST
        );

        const clientTest = await createClientTest(tokenProfessor);

        const res = await request(app)
            .post(`/api/clients/${clientTest.id}/routines`)
            .set('Authorization', `Bearer ${tokenProfessor}`)
            .send({
                name : 'RoutineTest',
                notes : 'Note test'
            });

        expect(res.statusCode).toBe(201);

        await deleteRoutineTest(res.body.id);
        await deleteClientTest(clientTest.id);
    });

    it('Should fail when required fileds are missing', async()=>{
        const tokenProfessor = await getToken(
            process.env.USER_PROFESSOR_TEST,
            process.env.PASSWORD_PROFESSOR_TEST
        );

        const clientTest = await createClientTest(tokenProfessor);

        const res = await request(app)
            .post(`/api/clients/${clientTest.id}/routines`)
            .set('Authorization', `Bearer ${tokenProfessor}`)
            .send({
                notes : 'Note test'
            });

        expect(res.statusCode).toBe(400);

        await deleteClientTest(clientTest.id);
    });
    
    it('Should fail if routine already exists', async()=>{
        const tokenProfessor = await getToken(
            process.env.USER_PROFESSOR_TEST,
            process.env.PASSWORD_PROFESSOR_TEST
        );

        const clientTest = await createClientTest(tokenProfessor);
        const routineTest = await createRoutineTest(clientTest.id, tokenProfessor);

        const res = await request(app)
            .post(`/api/clients/${clientTest.id}/routines`)
            .set('Authorization', `Bearer ${tokenProfessor}`)
            .send({
                name : 'RoutineTest',
                notes : 'Note test'
            });

        expect(res.statusCode).toBe(409);

        await deleteRoutineTest(routineTest.id);
        await deleteClientTest(clientTest.id);
    });
});

describe('GET /api/clients/:id/routines', ()=>{
    it('Should return routines by client', async()=>{
        const tokenProfessor = await getToken(
            process.env.USER_PROFESSOR_TEST,
            process.env.PASSWORD_PROFESSOR_TEST
        );

        const clientTest = await createClientTest(tokenProfessor);

        const res = await request(app)
            .get(`/api/clients/${clientTest.id}/routines`)
            .set('Authorization', `Bearer ${tokenProfessor}`);

        expect(res.statusCode).toBe(200);

        await deleteClientTest(clientTest.id);
    });
});

describe('GET /api/routines/:id', ()=>{
    it('Should return routine by id', async()=>{
        const tokenProfessor = await getToken(
            process.env.USER_PROFESSOR_TEST,
            process.env.PASSWORD_PROFESSOR_TEST
        );

        const clientTest = await createClientTest(tokenProfessor);
        const routineTest = await createRoutineTest(clientTest.id, tokenProfessor);

        const res = await request(app)
            .get(`/api/routines/${routineTest.id}`)
            .set('Authorization', `Bearer ${tokenProfessor}`);

        expect(res.statusCode).toBe(200);

        await deleteRoutineTest(routineTest.id);
        await deleteClientTest(clientTest.id);
    });

    it('Should fail if id is not a number', async()=>{
        const tokenProfessor = await getToken(
            process.env.USER_PROFESSOR_TEST,
            process.env.PASSWORD_PROFESSOR_TEST
        );

        const res = await request(app)
            .get('/api/routines/abc')
            .set('Authorization', `Bearer ${tokenProfessor}`);

        expect(res.status).toBe(400);
    });

    it('Should fail if routine does not exist', async()=>{
        const tokenProfessor = await getToken(
            process.env.USER_PROFESSOR_TEST,
            process.env.PASSWORD_PROFESSOR_TEST
        );

        const res = await request(app)
            .get('/api/routines/9999')
            .set('Authorization', `Bearer ${tokenProfessor}`);

        expect(res.status).toBe(404);
    });
});

describe('PUT /api/routines/:id', ()=>{
    it('Should update routine successfully', async()=>{
        const tokenProfessor = await getToken(
            process.env.USER_PROFESSOR_TEST,
            process.env.PASSWORD_PROFESSOR_TEST
        );

        const clientTest = await createClientTest(tokenProfessor);
        const routineTest = await createRoutineTest(clientTest.id, tokenProfessor);

        const res = await request(app)
            .put(`/api/routines/${routineTest.id}`)
            .set('Authorization', `Bearer ${tokenProfessor}`)
            .send({
                name : 'New Routine name'
            });

        expect(res.statusCode).toBe(200)
        
        await deleteRoutineTest(routineTest.id);
        await deleteClientTest(clientTest.id);
    });

    it('Should fail if routine name already exist', async()=>{
        const tokenProfessor = await getToken(
            process.env.USER_PROFESSOR_TEST,
            process.env.PASSWORD_PROFESSOR_TEST
        );

        const clientTest = await createClientTest(tokenProfessor);
        const routineTest = await createRoutineTest(clientTest.id, tokenProfessor);
        const routineUpdate = await request(app)
            .post(`/api/clients/${clientTest.id}/routines`)
            .set('Authorization', `Bearer ${tokenProfessor}`)
            .send({
                name : 'RoutineUpdate',
                notes : 'Note test'
            });

        const res = await request(app)
            .put(`/api/routines/${routineUpdate.body.id}`)
            .set('Authorization', `Bearer ${tokenProfessor}`)
            .send({
                name : 'RoutineTest'
            });
        
        expect(res.statusCode).toBe(409)
        
        await deleteRoutineTest(routineTest.id);
        await deleteRoutineTest(routineUpdate.body.id);
        await deleteClientTest(clientTest.id);
    });
});

describe('PATCH /api/routines/:id/deactivate', ()=>{
    it('Should deactivate routine', async()=>{
        const tokenProfessor = await getToken(
            process.env.USER_PROFESSOR_TEST,
            process.env.PASSWORD_PROFESSOR_TEST
        );

        const clientTest = await createClientTest(tokenProfessor);
        const routineTest = await createRoutineTest(clientTest.id, tokenProfessor);

        const res = await request(app)
            .patch(`/api/routines/${routineTest.id}/deactivate`)
            .set('Authorization', `Bearer ${tokenProfessor}`);

        expect(res.statusCode).toBe(200);

        await deleteRoutineTest(routineTest.id);
        await deleteClientTest(clientTest.id);
    });

    it('Should fail if routine is already deactivate', async()=>{
        const tokenProfessor = await getToken(
            process.env.USER_PROFESSOR_TEST,
            process.env.PASSWORD_PROFESSOR_TEST
        );

        const clientTest = await createClientTest(tokenProfessor);
        const routineTest = await createRoutineTest(clientTest.id, tokenProfessor);

        await request(app)
            .patch(`/api/routines/${routineTest.id}/deactivate`)
            .set('Authorization', `Bearer ${tokenProfessor}`);
        
        const res = await request(app)
        .patch(`/api/routines/${routineTest.id}/deactivate`)
        .set('Authorization', `Bearer ${tokenProfessor}`);

        expect(res.statusCode).toBe(409);

        await deleteRoutineTest(routineTest.id);
        await deleteClientTest(clientTest.id);
    });
});

describe('PATCH /api/routines/:id/activate', ()=>{
    it('Should activate routine', async()=>{
        const tokenProfessor = await getToken(
            process.env.USER_PROFESSOR_TEST,
            process.env.PASSWORD_PROFESSOR_TEST
        );

        const clientTest = await createClientTest(tokenProfessor);
        const routineTest = await createRoutineTest(clientTest.id, tokenProfessor);

        await request(app)
            .patch(`/api/routines/${routineTest.id}/deactivate`)
            .set('Authorization', `Bearer ${tokenProfessor}`);
        
        const res = await request(app)
        .patch(`/api/routines/${routineTest.id}/activate`)
        .set('Authorization', `Bearer ${tokenProfessor}`);

        expect(res.statusCode).toBe(200);

        await deleteRoutineTest(routineTest.id);
        await deleteClientTest(clientTest.id);
    });

    it('Should fail if routine is already activate', async()=>{
        const tokenProfessor = await getToken(
            process.env.USER_PROFESSOR_TEST,
            process.env.PASSWORD_PROFESSOR_TEST
        );

        const clientTest = await createClientTest(tokenProfessor);
        const routineTest = await createRoutineTest(clientTest.id, tokenProfessor);

        const res = await request(app)
            .patch(`/api/routines/${routineTest.id}/activate`)
            .set('Authorization', `Bearer ${tokenProfessor}`);

        expect(res.statusCode).toBe(409);

        await deleteRoutineTest(routineTest.id);
        await deleteClientTest(clientTest.id);
    });
});

describe('DELETE /api/routines/:id', ()=>{
    it('Should delete routine successfully', async()=>{
        const tokenProfessor = await getToken(
            process.env.USER_PROFESSOR_TEST,
            process.env.PASSWORD_PROFESSOR_TEST
        );

        const clientTest = await createClientTest(tokenProfessor);
        const routineTest = await createRoutineTest(clientTest.id, tokenProfessor);

        const res = await request(app)
            .delete(`/api/routines/${routineTest.id}`)
            .set('Authorization', `Bearer ${tokenProfessor}`);
        expect(res.statusCode).toBe(204);

        await deleteClientTest(clientTest.id);
    });
});

afterAll(async ()=>{
    await pool.end();
});