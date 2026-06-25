require('dotenv').config();

const pool = require('../../src/config/db');
const request = require('supertest');
const app = require('../../src/app');
const {getToken} = require('../helpers/authHelper');

describe("POST /api/memberships/", ()=>{
    it('Should create a membership successfully', async()=>{
        const token = await getToken(
            process.env.USER_ADMIN_TEST,
            process.env.PASSWORD_ADMIN_TEST
        );

        const timestamp = Date.now();

        const res = await request(app)
            .post('/api/memberships/')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name : `MS${timestamp}`,
                start : '10:00',
                end : '12:00',
                price : 15000
            });
        expect(res.statusCode).toBe(201);
    });

    it('Should fail when required fields are missing', async()=>{
        const token = await getToken(
            process.env.USER_ADMIN_TEST,
            process.env.PASSWORD_ADMIN_TEST
        );

        const res = await request(app)
            .post('/api/memberships/')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name : 'MembershipTest',
                start : '10:00',
                end : '12:00'
            });
        

        expect(res.statusCode).toBe(400);
    });

    it('Should fail if membership already exists', async()=>{
        const token = await getToken(
            process.env.USER_ADMIN_TEST,
            process.env.PASSWORD_ADMIN_TEST
        );

        const timestamp = Date.now();

        const firstMembership = await request(app)
            .post('/api/memberships/')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name : `MS${timestamp}`,
                start : '10:00',
                end : '12:00',
                price : 15000
            });
        
        const res = await request(app)
            .post('/api/memberships/')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name : `MS${timestamp}`,
                start : '10:00',
                end : '12:00',
                price : 15000
            });
        
        expect(res.statusCode).toBe(409);
    });
});

afterAll(async ()=>{
    await pool.end();
});