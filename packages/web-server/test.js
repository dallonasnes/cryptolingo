const app = require('./app.js');
const supertest = require('supertest');
// const requestWithSupertest = supertest(server);

describe('Endpoints', () => {

    let request;
    let server;

    beforeAll(async () => {
        await app.setup();
    })

    it('Works', async () => {
        const res = await request.get('/')
        expect(res.statusCode).toEqual(200)
        // expect(res.body).toHaveProperty('user3')
    });
});