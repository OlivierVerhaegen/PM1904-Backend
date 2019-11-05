const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = require('chai').expect;
const app = require('../index');

// Configure chai
chai.use(chaiHttp);

// Open server using an agent, this way coockies are saved between requests.
const server = chai.request.agent(app);

//----------------------------
//          Root Routes
//----------------------------
describe('Testing root routes:', () => {
    context('- Without logging in.', () => {
        const description = 'Should open the login page.'
        it(description, (done) => {
            server
            .get('/')
            .redirects(0)
            .end((err, res) => {
                if (err) return done(err);
                expect(res).to.redirectTo('/login');
                done();
            });
        });
    });

    context('- Log in', () => {
        const description = 'Should log in user.'
        it(description, (done) => {
            server
            .post('/user/auth')
            .send({username: 'test', password: 'test'})
            .redirects(0)
            .end((err, res) => {
                if (err) return done(err);
                expect(res).to.redirectTo('/?status=success-login');
                done();
            });
        });
    });

    context('- With logged in user.', () => {
        const description = 'Should open home page.';
        it(description, (done) => {
            server.get('/').end((err, res) => {
                if (err) return done(err);
                expect(res).to.not.redirect;
                expect('Location', '/');
                done();
            });
        });
    });
});


//----------------------------
//        Order Routes
//----------------------------
describe('Testing order routes:', () => {
    context('- Get all orders', () => {
        const description = 'Should get all the orders.';
        it(description, (done) => {
            server.get('/orders').end((err, res) => {
                if (err) return done(err);
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                done();
            });
        });
    });

    context('- Get order by id', () => {
        const description = 'Should get the defined order by id.';
        it(description, (done) => {
            const id = 0;
            server.get(`orders/${id}`, (done) => {
                if (err) return done(err);
                expect(res).to.have.status(200);
                expect(res).to.be.json;
            });
        });
    });
});