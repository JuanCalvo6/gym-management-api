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
const {
    createRoutineLineTest,
    deleteRoutineLineTest 
} = require('../helpers/routineLinesHelper');

describe('POST /api/routines/:id/lines', ()=>{
    it('Should create a routine line successfully', async()=>{
        const tokenProfessor = await getToken(
            process.env.USER_PROFESSOR_TEST,
            process.env.PASSWORD_PROFESSOR_TEST
        );

        const clientTest = await createClientTest(tokenProfessor);
        const routineTest = await createRoutineTest(clientTest.id, tokenProfessor);

        const res = await request(app)
            .post(`/api/routines/${routineTest.id}/lines`)
            .set('Authorization', `Bearer ${tokenProfessor}`)
            .send({
                exercise : 'Pull up',
                repetitions : '10',
                sets : 3,
                rest : '10"' 
            });

        expect(res.statusCode).toBe(201);

        await deleteRoutineLineTest(res.body.id);
        await deleteRoutineTest(routineTest.id);
        await deleteClientTest(clientTest.id);
    });

    it('Should fail when required fields are missing', async()=>{
        const tokenProfessor = await getToken(
            process.env.USER_PROFESSOR_TEST,
            process.env.PASSWORD_PROFESSOR_TEST
        );

        const clientTest = await createClientTest(tokenProfessor);
        const routineTest = await createRoutineTest(clientTest.id, tokenProfessor);

        const res = await request(app)
            .post(`/api/routines/${routineTest.id}/lines`)
            .set('Authorization', `Bearer ${tokenProfessor}`)
            .send({
                repetitions : '10',
                sets : 3,
                rest : '10"' 
            });

            expect(res.statusCode).toBe(400);

            await deleteRoutineTest(routineTest.id);
            await deleteClientTest(clientTest.id);
    });
});

describe('GET /api/routines/:id/lines', ()=>{
    it('Should return routine lines by routine', async()=>{
        const tokenProfessor = await getToken(
            process.env.USER_PROFESSOR_TEST,
            process.env.PASSWORD_PROFESSOR_TEST
        );

        const clientTest = await createClientTest(tokenProfessor);
        const routineTest = await createRoutineTest(clientTest.id, tokenProfessor);

        const res = await request(app)
            .get(`/api/routines/${routineTest.id}/lines`)
            .set('Authorization', `Bearer ${tokenProfessor}`);

            expect(res.statusCode).toBe(200);

            await deleteRoutineTest(routineTest.id);
            await deleteClientTest(clientTest.id);
    });
});

describe('GET /api/routine-lines/:id', ()=>{
    it('Should return routine line by id', async()=>{
        const tokenProfessor = await getToken(
            process.env.USER_PROFESSOR_TEST,
            process.env.PASSWORD_PROFESSOR_TEST
        );

        const clientTest = await createClientTest(tokenProfessor);
        const routineTest = await createRoutineTest(clientTest.id, tokenProfessor);
        const routineLineTest =  await createRoutineLineTest(clientTest.id, routineTest.id);

        const res = await request(app)
            .get(`/api/routine-lines/${routineLineTest.id}`)
            .set('Authorization', `Bearer ${tokenProfessor}`);

            expect(res.statusCode).toBe(200);

            await deleteRoutineLineTest(routineLineTest.id);
            await deleteRoutineTest(routineTest.id);
            await deleteClientTest(clientTest.id);
    });

    it('Should fail if id is not a number', async()=>{
        const tokenProfessor = await getToken(
            process.env.USER_PROFESSOR_TEST,
            process.env.PASSWORD_PROFESSOR_TEST
        );

        const res = await request(app)
            .get(`/api/routine-lines/abc`)
            .set('Authorization', `Bearer ${tokenProfessor}`);

            expect(res.statusCode).toBe(400);
    });

    it('Should fail if routine line does not exist', async()=>{
        const tokenProfessor = await getToken(
            process.env.USER_PROFESSOR_TEST,
            process.env.PASSWORD_PROFESSOR_TEST
        );

        const res = await request(app)
            .get(`/api/routine-lines/9999`)
            .set('Authorization', `Bearer ${tokenProfessor}`);

            expect(res.statusCode).toBe(404);
    });
});

describe('PUT /api/routine-lines/:id', ()=>{
    it('Should update routine line successfully', async()=>{
        const tokenProfessor = await getToken(
            process.env.USER_PROFESSOR_TEST,
            process.env.PASSWORD_PROFESSOR_TEST
        );

        const clientTest = await createClientTest(tokenProfessor);
        const routineTest = await createRoutineTest(clientTest.id, tokenProfessor);
        const routineLineTest = await createRoutineLineTest(clientTest.id, routineTest.id);

        const res = await request(app)
            .put(`/api/routine-lines/${routineLineTest.id}`)
            .set('Authorization', `Bearer ${tokenProfessor}`)
            .send({
                repetitions : '15',
                rest : '60"' 
            });

        expect(res.statusCode).toBe(200);

        await deleteRoutineLineTest(routineLineTest.id);
        await deleteRoutineTest(routineTest.id);
        await deleteClientTest(clientTest.id);
    });

    it('Should fail if data does not send to update', async()=>{
        const tokenProfessor = await getToken(
            process.env.USER_PROFESSOR_TEST,
            process.env.PASSWORD_PROFESSOR_TEST
        );

        const res = await request(app)
            .put(`/api/routine-lines/1`)
            .set('Authorization', `Bearer ${tokenProfessor}`)
            .send({});

        expect(res.statusCode).toBe(400);

    });
});

describe('DELETE /api/routine-lines/:id', ()=>{
    it('Should delete routine line successfully', async()=>{
        const tokenProfessor = await getToken(
            process.env.USER_PROFESSOR_TEST,
            process.env.PASSWORD_PROFESSOR_TEST
        );

        const clientTest = await createClientTest(tokenProfessor);
        const routineTest = await createRoutineTest(clientTest.id, tokenProfessor);
        const routineLineTest = await createRoutineLineTest(clientTest.id, routineTest.id);

        const res = await request(app)
            .delete(`/api/routine-lines/${routineLineTest.id}`)
            .set('Authorization', `Bearer ${tokenProfessor}`);

        expect(res.statusCode).toBe(204);

        await deleteRoutineTest(routineTest.id);
        await deleteClientTest(clientTest.id);
    });
});

afterAll(async ()=>{
    await pool.end();
});