require('dotenv').config();

const pool = require('../../src/config/db');
const request = require('supertest');
const app = require('../../src/app');
const {getToken} = require('../helpers/authHelper');
const {
    createMembershipTest,
    deleteMembershipTest
} = require('../helpers/membershipsHelper');

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

describe("GET /api/memberships/", ()=>{
    
    it('Should return all active memberships', async()=>{
        const token = await getToken(
            process.env.USER_ADMIN_TEST,
            process.env.PASSWORD_ADMIN_TEST
        );
        
        const res = await request(app)
            .get('/api/memberships/')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    it('Should return only active memberships', async()=>{
        const token = await getToken(
            process.env.USER_ADMIN_TEST,
            process.env.PASSWORD_ADMIN_TEST
        );

        const res = await request(app)
            .get('/api/memberships/')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        res.body.forEach(membership =>expect(membership.estado).toBe('A'));
    })
});

describe("GET /api/memberships/:id", ()=>{
    it('Should return membership by id', async()=>{
        const token = await getToken(
            process.env.USER_ADMIN_TEST,
            process.env.PASSWORD_ADMIN_TEST
        );

        const membershipTest = await createMembershipTest(token);

        const res = await request(app)
            .get(`/api/memberships/${membershipTest.id}`)
            .set('Authorization', `Bearer ${token}`);
        
        expect(res.statusCode).toBe(200);

        await deleteMembershipTest(membershipTest.id);
    });

    it('Should fail if membership does not exist', async()=>{
        const token = await getToken(
            process.env.USER_ADMIN_TEST,
            process.env.PASSWORD_ADMIN_TEST
        );

        const res = await request(app)
            .get('/api/memberships/99999')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(404);
    });

    it('Should fail if id is not a number', async()=>{
        const token = await getToken(
            process.env.USER_ADMIN_TEST,
            process.env.PASSWORD_ADMIN_TEST
        );

        const res = await request(app)
            .get('/api/memberships/abc')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(400);
    });
});

describe("PUT /api/memberships/:id", ()=>{
    it('Should update membership successfully', async()=>{
        const token = await getToken(
            process.env.USER_ADMIN_TEST,
            process.env.PASSWORD_ADMIN_TEST
        );

        const membershipTest = await createMembershipTest(token);

        const res = await request(app)
            .put(`/api/memberships/${membershipTest.id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                name : 'updateMember',
                start : '07:00',
                end : '12:30',
                price : 15000
            });

        expect(res.statusCode).toBe(200);
        await deleteMembershipTest(membershipTest.id);
    });

    it('Should fail if id is not a number', async()=>{
        const token = await getToken(
            process.env.USER_ADMIN_TEST,
            process.env.PASSWORD_ADMIN_TEST
        );

        const res = await request(app)
            .put('/api/memberships/abc')
            .set('Authorization', `Bearer ${token}`)
            .send({});
        
        expect(res.statusCode).toBe(400);
    });

    it('Should fail if membership does not exist', async()=>{
        const token = await getToken(
            process.env.USER_ADMIN_TEST,
            process.env.PASSWORD_ADMIN_TEST
        );

        const res = await request(app)
            .put('/api/memberships/99999')
            .set('Authorization', `Bearer ${token}`)
            .send({});
        
        expect(res.statusCode).toBe(404);
    });
});

describe("PATCH /api/memberships/:id/deactivate", ()=>{
    it('Should deactivate membership', async()=>{
        const token = await getToken(
            process.env.USER_ADMIN_TEST,
            process.env.PASSWORD_ADMIN_TEST
        );

        const membershipTest = await createMembershipTest(token);

        const res = await request(app)
            .patch(`/api/memberships/${membershipTest.id}/deactivate`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);

        await deleteMembershipTest(membershipTest.id);
    });

    it('Should fail if membership is already deactivate', async()=>{
        const token = await getToken(
            process.env.USER_ADMIN_TEST,
            process.env.PASSWORD_ADMIN_TEST
        );

        const membershipTest = await createMembershipTest(token);

        await request(app)
            .patch(`/api/memberships/${membershipTest.id}/deactivate`)
            .set('Authorization', `Bearer ${token}`);

        const res = await request(app)
            .patch(`/api/memberships/${membershipTest.id}/deactivate`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(409);

        await deleteMembershipTest(membershipTest.id);
    });
});

describe("PATCH /api/memberships/:id/activate", ()=>{
    it('Should activate membership', async()=>{
        const token = await getToken(
            process.env.USER_ADMIN_TEST,
            process.env.PASSWORD_ADMIN_TEST
        );

        const membershipTest = await createMembershipTest(token);

        await request(app)
            .patch(`/api/memberships/${membershipTest.id}/deactivate`)
            .set('Authorization', `Bearer ${token}`);

        const res = await request(app)
            .patch(`/api/memberships/${membershipTest.id}/activate`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);

        await deleteMembershipTest(membershipTest.id);
    });

    it('Should fail if membership is already activate', async()=>{
        const token = await getToken(
            process.env.USER_ADMIN_TEST,
            process.env.PASSWORD_ADMIN_TEST
        );

        const membershipTest = await createMembershipTest(token);

        const res = await request(app)
            .patch(`/api/memberships/${membershipTest.id}/activate`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(409);

        await deleteMembershipTest(membershipTest.id);
    });
});

afterAll(async ()=>{
    await pool.end();
});