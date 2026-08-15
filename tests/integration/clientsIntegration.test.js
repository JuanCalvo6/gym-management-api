require('dotenv').config();

const pool = require('../../src/config/db');
const request = require('supertest');
const app = require('../../src/app');
const { getToken } = require('../helpers/authHelper');
const {
    createClientTest,
    deleteClientTest
} = require('../helpers/clientsHelper');

describe("POST /api/clients", ()=>{
    it('Should create client successfully', async()=>{
        const token = await getToken(
            process.env.USER_PROFESSOR_TEST,
            process.env.PASSWORD_PROFESSOR_TEST
        );

        const res = await request(app)
            .post('/api/clients')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name : 'Client',
                surname : 'Test',
                documentType : 'DNI',
                dni : '123456789',
                phone : '1234567890',
                address : 'calle test 12',
                mail : 'cliente@test.com'
            });
        expect(res.statusCode).toBe(201);
        await deleteClientTest(res.body.id);

    });

    it('Should fail when required fields are missing', async()=>{
        const token = await getToken(
            process.env.USER_PROFESSOR_TEST,
            process.env.PASSWORD_PROFESSOR_TEST
        );

        const res = await request(app)
            .post('/api/clients')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name : 'Client',
                surname : 'Test',
                documentType : 'DNI',
                phone : '1234567890',
                address : 'calle test 12',
                mail : 'cliente@test.com'
            });

        expect(res.statusCode).toBe(400);
    });

    it('Should fail if clients already exists', async()=>{
        const token = await getToken(
            process.env.USER_PROFESSOR_TEST,
            process.env.PASSWORD_PROFESSOR_TEST
        );

        const firstClient = await createClientTest(token);

        const res = await request(app)
                .post('/api/clients')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    name : 'Client',
                    surname : 'Test',
                    documentType : 'DNI',
                    dni : '123456789',
                    phone : '1234567890',
                    address : 'calle test 12',
                    mail : 'cliente@test.com'
                });
        console.log(res.body);
        expect(res.statusCode).toBe(409);
        await deleteClientTest(firstClient.id);
    });
})

describe("GET /api/clients", ()=>{
    it('Should return all active clients', async()=>{
        const token = await getToken(
            process.env.USER_PROFESSOR_TEST,
            process.env.PASSWORD_PROFESSOR_TEST
        );

        const res = await request(app)
            .get('/api/clients/')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        
    });

});

describe("GET /api/clients/:id", ()=>{
    it('Should return client by id', async()=>{
        const token = await getToken(
            process.env.USER_PROFESSOR_TEST,
            process.env.PASSWORD_PROFESSOR_TEST
        );

        const clientTest = await createClientTest(token);

        const res = await request(app)
            .get(`/api/clients/${clientTest.id}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);

        await deleteClientTest(clientTest.id);
    });

    it('Should fail if client does not exist', async()=>{
        const token = await getToken(
            process.env.USER_PROFESSOR_TEST,
            process.env.PASSWORD_PROFESSOR_TEST
        );

        const res = await request(app)
            .get(`/api/clients/9999`)
            .set('Authorization', `Bearer ${token}`);
        
        expect(res.statusCode).toBe(404);
    });

    it('Should fail if id is not a number', async()=>{
        const token = await getToken(
            process.env.USER_PROFESSOR_TEST,
            process.env.PASSWORD_PROFESSOR_TEST
        );

        const res = await request(app)
            .get(`/api/clients/abc`)
            .set('Authorization', `Bearer ${token}`);
        
        expect(res.statusCode).toBe(400);
    });
});

describe("PUT /api/clients/:id", ()=>{
    it('Should update client successfully', async()=>{
        const token = await getToken(
            process.env.USER_PROFESSOR_TEST,
            process.env.PASSWORD_PROFESSOR_TEST
        );

        const clientTest = await createClientTest(token);

        const res = await request(app)
            .put(`/api/clients/${clientTest.id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                name : 'ClientMod',
                surname : 'Test',
                documentType : 'DNI',
                dni : '123456789',
                phone : '1234567811',
                address : 'calle test 12',
                mail : 'cliente@test.com'
            });

        expect(res.statusCode).toBe(200);
        await deleteClientTest(clientTest.id);
    });
});

describe("PATCH /api/clients/:id/deactivate", ()=>{
    it('Should deactivate client', async()=>{
        const token = await getToken(
            process.env.USER_PROFESSOR_TEST,
            process.env.PASSWORD_PROFESSOR_TEST
        );

        const clientTest = await createClientTest(token);

        const res = await request(app)
            .patch(`/api/clients/${clientTest.id}/deactivate`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        await deleteClientTest(clientTest.id);
    });

    it('Should fail if client is already deactivate', async()=>{
        const token = await getToken(
            process.env.USER_PROFESSOR_TEST,
            process.env.PASSWORD_PROFESSOR_TEST
        );

        const clientTest = await createClientTest(token);

        await request(app)
            .patch(`/api/clients/${clientTest.id}/deactivate`)
            .set('Authorization', `Bearer ${token}`);

        const res = await request(app)
            .patch(`/api/clients/${clientTest.id}/deactivate`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(409);
        await deleteClientTest(clientTest.id);
    });
});

describe("PATCH /api/clients/:id/activate", ()=>{
    it('Should activate client', async()=>{
        const token = await getToken(
            process.env.USER_PROFESSOR_TEST,
            process.env.PASSWORD_PROFESSOR_TEST
        );

        const clientTest = await createClientTest(token);

        await request(app)
            .patch(`/api/clients/${clientTest.id}/deactivate`)
            .set('Authorization', `Bearer ${token}`);

        const res = await request(app)
            .patch(`/api/clients/${clientTest.id}/activate`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        await deleteClientTest(clientTest.id);
    });

    it('Should fail if client is already activate', async()=>{
        const token = await getToken(
            process.env.USER_PROFESSOR_TEST,
            process.env.PASSWORD_PROFESSOR_TEST
        );

        const clientTest = await createClientTest(token);

        const res = await request(app)
            .patch(`/api/clients/${clientTest.id}/activate`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(409);
        await deleteClientTest(clientTest.id);
    });
});

afterAll(async ()=>{
    await pool.end();
});