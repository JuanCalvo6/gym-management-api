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
    createMembershipWithScheduleTest,
    deleteMembershipTest
} = require('../helpers/membershipsHelper');
const {
    createEnrollmentTest,
    createEnrollmentWithScheduleTest,
    deleteEnrollmentTest
} = require('../helpers/enrollmentsHelper'); 
const {
    deleteAttendanceTest
} = require('../helpers/attendancesHelper');

describe('POST api/clients/:id/attendances', ()=>{
    it('Should create attendance successfully', async()=>{
        const tokenProfessor = await getToken(
            process.env.USER_PROFESSOR_TEST,
            process.env.PASSWORD_PROFESSOR_TEST
        );

        const tokenAdmin = await getToken(
            process.env.USER_ADMIN_TEST,
            process.env.PASSWORD_ADMIN_TEST
        );

        const clientTest = await createClientTest(tokenProfessor);
        const membershipTest = await createMembershipWithScheduleTest(
            tokenAdmin,
            '00:00',
            '23:59'
        );

        const today = new Date();
        const startDate = new Date(today);
        const endDate = new Date(today);
        startDate.setDate(today.getDate() - 2);
        endDate.setDate(today.getDate() + 2);

        const enrollmentTest = await createEnrollmentWithScheduleTest(
            clientTest.id, 
            tokenProfessor, 
            membershipTest.id,
            startDate,
            endDate
        );

        const res = await request(app)
            .post(`/api/clients/${clientTest.id}/attendances`)
            .set('Authorization', `Bearer ${tokenProfessor}`);

        expect(res.statusCode).toBe(201);

        await deleteAttendanceTest(res.body.id);
        await deleteEnrollmentTest(enrollmentTest.id);
        await deleteClientTest(clientTest.id);
        await deleteMembershipTest(membershipTest.id);

    });

    it('Should fail if client is inactive', async()=>{
        const tokenProfessor = await getToken(
            process.env.USER_PROFESSOR_TEST,
            process.env.PASSWORD_PROFESSOR_TEST
        );

        const clientTest = await createClientTest(tokenProfessor);
        await request(app)
            .patch(`/api/clients/${clientTest.id}/deactivate`)
            .set('Authorization', `Bearer ${tokenProfessor}`);
        
        const res = await request(app)
            .post(`/api/clients/${clientTest.id}/attendances`)
            .set('Authorization', `Bearer ${tokenProfessor}`);

        expect(res.statusCode).toBe(409); 
        await deleteClientTest(clientTest.id);
    });

    it('Should fail if client does not have enrollments active', async()=>{
        const tokenProfessor = await getToken(
            process.env.USER_PROFESSOR_TEST,
            process.env.PASSWORD_PROFESSOR_TEST
        );

        const clientTest = await createClientTest(tokenProfessor);
        
        const res = await request(app)
            .post(`/api/clients/${clientTest.id}/attendances`)
            .set('Authorization', `Bearer ${tokenProfessor}`);

        expect(res.statusCode).toBe(409); 
        await deleteClientTest(clientTest.id);
    });

    it('Should fail if attendances is outside membership hours', async()=>{
        const tokenProfessor = await getToken(
            process.env.USER_PROFESSOR_TEST,
            process.env.PASSWORD_PROFESSOR_TEST
        );

        const tokenAdmin = await getToken(
            process.env.USER_ADMIN_TEST,
            process.env.PASSWORD_ADMIN_TEST
        );

        const clientTest = await createClientTest(tokenProfessor);
        const membershipTest = await createMembershipWithScheduleTest(
            tokenAdmin,
            '00:00',
            '00:01'
        );

        const today = new Date();
        const startDate = new Date(today);
        const endDate = new Date(today);
        startDate.setDate(today.getDate() - 2);
        endDate.setDate(today.getDate() + 2);

        const enrollmentTest = await createEnrollmentWithScheduleTest(
            clientTest.id, 
            tokenProfessor, 
            membershipTest.id,
            startDate,
            endDate
        );

        const res = await request(app)
            .post(`/api/clients/${clientTest.id}/attendances`)
            .set('Authorization', `Bearer ${tokenProfessor}`);

        expect(res.statusCode).toBe(409);

        await deleteEnrollmentTest(enrollmentTest.id);
        await deleteClientTest(clientTest.id);
        await deleteMembershipTest(membershipTest.id);
    });
});

describe('GET api/clients/:id/attendances', ()=>{
    it('Should return all attendances by client', async()=>{
        const tokenProfessor = await getToken(
            process.env.USER_PROFESSOR_TEST,
            process.env.PASSWORD_PROFESSOR_TEST
        );

        const clientTest = await createClientTest(tokenProfessor);

        const res = await request(app)
            .get(`/api/clients/${clientTest.id}/attendances`)
            .set('Authorization', `Bearer ${tokenProfessor}`);

        expect(res.statusCode).toBe(200);

        await deleteClientTest(clientTest.id);
    });
});

describe('GET api/attendances/', ()=>{
    it('Should return all attendances', async()=>{
        const tokenAdmin = await getToken(
            process.env.USER_ADMIN_TEST,
            process.env.PASSWORD_ADMIN_TEST
        );

        const res = await request(app)
            .get('/api/attendances')
            .set('Authorization', `Bearer ${tokenAdmin}`);

        expect(res.statusCode).toBe(200);
    });
});

afterAll(async ()=>{
    await pool.end();
});