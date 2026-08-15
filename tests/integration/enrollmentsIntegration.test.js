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
    createMembershipTest,
    deleteMembershipTest
} = require('../helpers/membershipsHelper');
const {
    createEnrollmentTest,
    deleteEnrollmentTest
} = require('../helpers/enrollmentsHelper');


describe('POST /api/clients/:id/enrollments', ()=>{
    it('Should create enrollment successfully', async()=>{
        const tokenProfessor = await getToken(
            process.env.USER_PROFESSOR_TEST,
            process.env.PASSWORD_PROFESSOR_TEST
        );

        const tokenAdmin = await getToken(
            process.env.USER_ADMIN_TEST,
            process.env.PASSWORD_ADMIN_TEST
        );

        const clientTest = await createClientTest(tokenProfessor);
        const membershipTest = await createMembershipTest(tokenAdmin);

        const res = await request(app)
            .post(`/api/clients/${clientTest.id}/enrollments`)
            .set('Authorization', `Bearer ${tokenProfessor}`)
            .send({
                membershipId : membershipTest.id,
                startDate : '2025-02-1',
                endDate : '2025-03-01'
            });

        expect(res.statusCode).toBe(201);
        await deleteEnrollmentTest(res.body.id);
        await deleteClientTest(clientTest.id);
        await deleteMembershipTest(membershipTest.id);

    });

    it('Should fail when required fields are missing', async()=>{
        const tokenProfessor = await getToken(
            process.env.USER_PROFESSOR_TEST,
            process.env.PASSWORD_PROFESSOR_TEST
        );

        const clientTest = await createClientTest(tokenProfessor);

        const res = await request(app)
            .post(`/api/clients/${clientTest.id}/enrollments`)
            .set('Authorization', `Bearer ${tokenProfessor}`)
            .send({
                startDate : '2025-02-1',
                endDate : '2025-03-01'
            });

        expect(res.statusCode).toBe(400);
        await deleteEnrollmentTest(res.body.id);
        await deleteClientTest(clientTest.id);
    });

    it('Should fail if end date is before start date', async()=>{
        const tokenProfessor = await getToken(
            process.env.USER_PROFESSOR_TEST,
            process.env.PASSWORD_PROFESSOR_TEST
        );

        const tokenAdmin = await getToken(
            process.env.USER_ADMIN_TEST,
            process.env.PASSWORD_ADMIN_TEST
        );

        const clientTest = await createClientTest(tokenProfessor);
        const membershipTest = await createMembershipTest(tokenAdmin);

        const res = await request(app)
            .post(`/api/clients/${clientTest.id}/enrollments`)
            .set('Authorization', `Bearer ${tokenProfessor}`)
            .send({
                membershipId : membershipTest.id,
                startDate : '2025-02-1',
                endDate : '2025-01-01'
            });

        expect(res.statusCode).toBe(400);
        await deleteEnrollmentTest(res.body.id);
        await deleteClientTest(clientTest.id);
        await deleteMembershipTest(membershipTest.id);

    });

    it('Should fail if client does not exist', async()=>{
        const tokenProfessor = await getToken(
            process.env.USER_PROFESSOR_TEST,
            process.env.PASSWORD_PROFESSOR_TEST
        );

        const tokenAdmin = await getToken(
            process.env.USER_ADMIN_TEST,
            process.env.PASSWORD_ADMIN_TEST
        );
        const membershipTest = await createMembershipTest(tokenAdmin);

        const res = await request(app)
            .post(`/api/clients/999/enrollments`)
            .set('Authorization', `Bearer ${tokenProfessor}`)
            .send({
                membershipId : membershipTest.id,
                startDate : '2025-02-1',
                endDate : '2025-03-01'
            });

        expect(res.statusCode).toBe(404);
        await deleteEnrollmentTest(res.body.id);
        await deleteMembershipTest(membershipTest.id);

    });

    it('Should fail if client is inactive', async()=>{
        const tokenProfessor = await getToken(
            process.env.USER_PROFESSOR_TEST,
            process.env.PASSWORD_PROFESSOR_TEST
        );

        const tokenAdmin = await getToken(
            process.env.USER_ADMIN_TEST,
            process.env.PASSWORD_ADMIN_TEST
        );

        const clientTest = await createClientTest(tokenProfessor);
        await request(app)
            .patch(`/api/clients/${clientTest.id}/deactivate`)
            .set('Authorization', `Bearer ${tokenProfessor}`);

        const membershipTest = await createMembershipTest(tokenAdmin);

        const res = await request(app)
            .post(`/api/clients/${clientTest.id}/enrollments`)
            .set('Authorization', `Bearer ${tokenProfessor}`)
            .send({
                membershipId : membershipTest.id,
                startDate : '2025-02-1',
                endDate : '2025-03-01'
            });

        expect(res.statusCode).toBe(409);
        await deleteEnrollmentTest(res.body.id);
        await deleteClientTest(clientTest.id);
        await deleteMembershipTest(membershipTest.id);

    });

    it('Should fail if membership is inactive', async()=>{
        const tokenProfessor = await getToken(
            process.env.USER_PROFESSOR_TEST,
            process.env.PASSWORD_PROFESSOR_TEST
        );

        const tokenAdmin = await getToken(
            process.env.USER_ADMIN_TEST,
            process.env.PASSWORD_ADMIN_TEST
        );

        const clientTest = await createClientTest(tokenProfessor);
        const membershipTest = await createMembershipTest(tokenAdmin);
        await request(app)
            .patch(`/api/memberships/${membershipTest.id}/deactivate`)
            .set('Authorization', `Bearer ${tokenAdmin}`);

        const res = await request(app)
            .post(`/api/clients/${clientTest.id}/enrollments`)
            .set('Authorization', `Bearer ${tokenProfessor}`)
            .send({
                membershipId : membershipTest.id,
                startDate : '2025-02-1',
                endDate : '2025-03-01'
            });

        expect(res.statusCode).toBe(409);
        await deleteEnrollmentTest(res.body.id);
        await deleteClientTest(clientTest.id);
        await deleteMembershipTest(membershipTest.id);

    });

    it('Should fail if dates overlap', async()=>{
        const tokenProfessor = await getToken(
            process.env.USER_PROFESSOR_TEST,
            process.env.PASSWORD_PROFESSOR_TEST
        );

        const tokenAdmin = await getToken(
            process.env.USER_ADMIN_TEST,
            process.env.PASSWORD_ADMIN_TEST
        );

        const clientTest = await createClientTest(tokenProfessor);
        const membershipTest = await createMembershipTest(tokenAdmin);
        const enrollmentTest = await createEnrollmentTest(
            clientTest.id, 
            tokenProfessor, 
            membershipTest.id
        );

        const res = await request(app)
            .post(`/api/clients/${clientTest.id}/enrollments`)
            .set('Authorization', `Bearer ${tokenProfessor}`)
            .send({
                membershipId : membershipTest.id,
                startDate : '2025-02-15',
                endDate : '2025-03-15'
            });

        expect(res.statusCode).toBe(409);
        await deleteEnrollmentTest(res.body.id);
        await deleteEnrollmentTest(enrollmentTest.id);
        await deleteClientTest(clientTest.id);
        await deleteMembershipTest(membershipTest.id);

    });
});

describe('GET /api/clients/:id/enrollments', ()=>{
    it('Should return all active enrollments by client', async()=>{
        const tokenProfessor = await getToken(
            process.env.USER_PROFESSOR_TEST,
            process.env.PASSWORD_PROFESSOR_TEST
        );

        const clientTest = await createClientTest(tokenProfessor);

        const res = await request(app)
            .get(`/api/clients/${clientTest.id}/enrollments`)
            .set('Authorization', `Bearer ${tokenProfessor}`);

        expect(res.statusCode).toBe(200);

        await deleteClientTest(clientTest.id);
    });
});

describe('GET /api/enrollments/', ()=>{
    it('Should return all enrollments', async()=>{
        const tokenAdmin = await getToken(
            process.env.USER_ADMIN_TEST,
            process.env.PASSWORD_ADMIN_TEST
        );

        const res = await request(app)
            .get(`/api/enrollments/`)
            .set('Authorization', `Bearer ${tokenAdmin}`);

        expect(res.statusCode).toBe(200);
    });
});

describe('GET /api/enrollments/:id', ()=>{
    it('Should return enrollment by id', async()=>{
        const tokenProfessor = await getToken(
            process.env.USER_PROFESSOR_TEST,
            process.env.PASSWORD_PROFESSOR_TEST
        );

        const tokenAdmin = await getToken(
            process.env.USER_ADMIN_TEST,
            process.env.PASSWORD_ADMIN_TEST
        );

        const clientTest = await createClientTest(tokenProfessor);
        const membershipTest = await createMembershipTest(tokenAdmin);
        const enrollmentTest = await createEnrollmentTest(
            clientTest.id, 
            tokenProfessor, 
            membershipTest.id
        );

        const res = await request(app)
            .get(`/api/enrollments/${enrollmentTest.id}`)
            .set('Authorization', `Bearer ${tokenProfessor}`);

        expect(res.statusCode).toBe(200);

        await deleteEnrollmentTest(enrollmentTest.id);
        await deleteClientTest(clientTest.id);
        await deleteMembershipTest(membershipTest.id);
    });

    it('Should fail if id is not a number', async()=>{
        const tokenProfessor = await getToken(
            process.env.USER_PROFESSOR_TEST,
            process.env.PASSWORD_PROFESSOR_TEST
        );

        const res = await request(app)
            .get(`/api/enrollments/abc`)
            .set('Authorization', `Bearer ${tokenProfessor}`);

        expect(res.statusCode).toBe(400);
    });

    it('Should fail if enrollment does not exist', async()=>{
        const tokenProfessor = await getToken(
            process.env.USER_PROFESSOR_TEST,
            process.env.PASSWORD_PROFESSOR_TEST
        );

        const res = await request(app)
            .get(`/api/enrollments/9999`)
            .set('Authorization', `Bearer ${tokenProfessor}`);

        expect(res.statusCode).toBe(404);
        
    });
});

describe('PATCH /api/enrollments/:id/deactvate', ()=>{
    it('Should deactivate enrollment', async()=>{
        const tokenProfessor = await getToken(
            process.env.USER_PROFESSOR_TEST,
            process.env.PASSWORD_PROFESSOR_TEST
        );

        const tokenAdmin = await getToken(
            process.env.USER_ADMIN_TEST,
            process.env.PASSWORD_ADMIN_TEST
        );

        const clientTest = await createClientTest(tokenProfessor);
        const membershipTest = await createMembershipTest(tokenAdmin);
        const enrollmentTest = await createEnrollmentTest(
            clientTest.id, 
            tokenProfessor, 
            membershipTest.id
        );

        const res = await request(app)
            .patch(`/api/enrollments/${enrollmentTest.id}/deactivate`)
            .set('Authorization', `Bearer ${tokenProfessor}`);

        expect(res.statusCode).toBe(200);

        await deleteEnrollmentTest(enrollmentTest.id);
        await deleteClientTest(clientTest.id);
        await deleteMembershipTest(membershipTest.id);

    });

    it('Should fail if enrollment is already inactive', async()=>{
        const tokenProfessor = await getToken(
            process.env.USER_PROFESSOR_TEST,
            process.env.PASSWORD_PROFESSOR_TEST
        );

        const tokenAdmin = await getToken(
            process.env.USER_ADMIN_TEST,
            process.env.PASSWORD_ADMIN_TEST
        );

        const clientTest = await createClientTest(tokenProfessor);
        const membershipTest = await createMembershipTest(tokenAdmin);
        const enrollmentTest = await createEnrollmentTest(
            clientTest.id, 
            tokenProfessor, 
            membershipTest.id
        );

        await request(app)
            .patch(`/api/enrollments/${enrollmentTest.id}/deactivate`)
            .set('Authorization', `Bearer ${tokenProfessor}`);

        const res = await request(app)
            .patch(`/api/enrollments/${enrollmentTest.id}/deactivate`)
            .set('Authorization', `Bearer ${tokenProfessor}`);

        expect(res.statusCode).toBe(409);

        await deleteEnrollmentTest(enrollmentTest.id);
        await deleteClientTest(clientTest.id);
        await deleteMembershipTest(membershipTest.id);

    });
});

describe('PATCH /api/enrollments/:id/activate', ()=>{
    it('Should activate enrollment', async()=>{
        const tokenProfessor = await getToken(
            process.env.USER_PROFESSOR_TEST,
            process.env.PASSWORD_PROFESSOR_TEST
        );

        const tokenAdmin = await getToken(
            process.env.USER_ADMIN_TEST,
            process.env.PASSWORD_ADMIN_TEST
        );

        const clientTest = await createClientTest(tokenProfessor);
        const membershipTest = await createMembershipTest(tokenAdmin);
        const enrollmentTest = await createEnrollmentTest(
            clientTest.id, 
            tokenProfessor, 
            membershipTest.id
        );

        await request(app)
            .patch(`/api/enrollments/${enrollmentTest.id}/deactivate`)
            .set('Authorization', `Bearer ${tokenProfessor}`);

        const res = await request(app)
            .patch(`/api/enrollments/${enrollmentTest.id}/activate`)
            .set('Authorization', `Bearer ${tokenProfessor}`);

        expect(res.statusCode).toBe(200);

        await deleteEnrollmentTest(enrollmentTest.id);
        await deleteClientTest(clientTest.id);
        await deleteMembershipTest(membershipTest.id);
    });

    it('Should fail if enrollment is already active', async()=>{
        const tokenProfessor = await getToken(
            process.env.USER_PROFESSOR_TEST,
            process.env.PASSWORD_PROFESSOR_TEST
        );

        const tokenAdmin = await getToken(
            process.env.USER_ADMIN_TEST,
            process.env.PASSWORD_ADMIN_TEST
        );

        const clientTest = await createClientTest(tokenProfessor);
        const membershipTest = await createMembershipTest(tokenAdmin);
        const enrollmentTest = await createEnrollmentTest(
            clientTest.id, 
            tokenProfessor, 
            membershipTest.id
        );

        const res = await request(app)
            .patch(`/api/enrollments/${enrollmentTest.id}/activate`)
            .set('Authorization', `Bearer ${tokenProfessor}`);

        expect(res.statusCode).toBe(409);

        await deleteEnrollmentTest(enrollmentTest.id);
        await deleteClientTest(clientTest.id);
        await deleteMembershipTest(membershipTest.id);

    });
});

afterAll(async ()=>{
    await pool.end();
});