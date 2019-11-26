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

    context('- Create user', () => {
        const description = 'Should create a user.';
        it(description, (done) => {
            server
            .post('/user/create')
            .send({
                userName: 'test',
                password: 'test',
                studentNumber: 's088705'
            })
            .redirects(0)
            .end((err, res) => {
                if (err) return done(err);
                expect(res).to.have.status(201);
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
            const id = 1;
            server.get(`/orders/${id}`).end((err, res) => {
                if (err) return done(err);
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                done();
            });
        });
    });

    context('- Create order', () => {
        const description = 'Should create an order.';
        it(description, (done) => {
            server
            .post('/orders/create')
            .send({
                productId: ['0'],
                userId: '0',
                status: 'busy',
                quantity: '5',
                price: '10.98'
            })
            .redirects(0)
            .end((err, res) => {
                if (err) return done(err);
                expect(res).to.have.status(201);
                done();
            });
        });
    });

    context('- Update order', () => {
        const description = 'Should update the defined order.';
        it(description, (done) => {
            const id = 1;
            server
            .patch(`/orders/${id}`)
            .send({
                status: 'done',
                quantity: '15',
                price: '50.0'
            })
            .redirects(0)
            .end((err, res) => {
                if (err) return done(err);
                expect(res).to.have.status(201);
                done();
            });
        });
    });

    context('- Delete order', () => {
        const description = 'Should delete the defined order.';
        it(description, (done) => {
            const id = 1;
            server
            .delete(`/orders/${id}`)
            .redirects(0)
            .end((err, res) => {
                if (err) return done(err);
                expect(res).to.have.status(200);
                done();
            });
        });
    });
});


//----------------------------
//        Order Routes
//----------------------------
describe('Testing products routes:',  () => {
    context('- Get all products', () => {
        const description = 'Should get all the products.';
        it(description, (done) => {
            server.get('/products').end((err, res) => {
                if (err) return done(err);
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                done();
            });
        });
    });

    context('- Get product by id', () => {
        const description = 'Should get the defined product by id.';
        it(description, (done) => {
            const id = 1;
            server.get(`/products/${id}`).end((err, res) => {
                if (err) return done(err);
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                done();
            });
        });
    });

    context('- Create product', () => {
        const description = 'Should create a product.';
        it(description, (done) => {
            server
            .post('/products/create')
            .send({
                name: 'test',
                price: '10.2',
                photoUrl: 'http://test.test',
                allergens: 'Test allergens',
                description: 'Test description',
                available: "20"
            })
            .redirects(0)
            .end((err, res) => {
                if (err) return done(err);
                expect(res).to.have.status(201);
                done();
            });
        });
    });

    context('- Update product', () => {
        const description = 'Should update the defined product.';
        it(description, (done) => {
            const id = 1;
            server
            .patch(`/products/${id}`)
            .send({
                name: 'testUpdate',
                price: '10.2',
                photoUrl: 'http://test.test',
                allergens: 'Test allergens',
                description: 'Test description',
                available: "20"
            })
            .redirects(0)
            .end((err, res) => {
                if (err) return done(err);
                expect(res).to.have.status(201);
                done();
            });
        });
    });

    context('- Delete product', () => {
        const description = 'Should delete the defined product.';
        it(description, (done) => {
            const id = 1;
            server
            .delete(`/products/${id}`)
            .redirects(0)
            .end((err, res) => {
                if (err) return done(err);
                expect(res).to.have.status(200);
                done();
            });
        });
    });
});


//----------------------------
//        User Routes
//----------------------------
describe('Testing user routes:',  () => {
    // context('- Get all users', () => {
    //     const description = 'Should get all the products.';
    //     it(description, (done) => {
    //         server.get('/products').end((err, res) => {
    //             if (err) return done(err);
    //             expect(res).to.have.status(200);
    //             expect(res).to.be.json;
    //             done();
    //         });
    //     });
    // });

    // context('- Get product by id', () => {
    //     const description = 'Should get the defined product by id.';
    //     it(description, (done) => {
    //         const id = 1;
    //         server.get(`/products/${id}`).end((err, res) => {
    //             if (err) return done(err);
    //             expect(res).to.have.status(200);
    //             expect(res).to.be.json;
    //             done();
    //         });
    //     });
    // });

    // Close server after these tests.
    after(() => server.close());

    context('- Update user', () => {
        const description = 'Should update the defined user.';
        it(description, (done) => {
            const id = 1;
            server
            .patch(`/user/${id}`)
            .send({
                userName: 'TestUserUpdate',
                password: 'Test!',
                studentNumber: 's088705'
            })
            .redirects(0)
            .end((err, res) => {
                if (err) return done(err);
                expect(res).to.have.status(201);
                done();
            });
        });
    });

    context('- Delete user', () => {
        const description = 'Should delete the defined user.';
        it(description, (done) => {
            const id = 1;
            server
            .delete(`/user/${id}`)
            .redirects(0)
            .end((err, res) => {
                if (err) return done(err);
                expect(res).to.have.status(200);
                done();
            });
        });
    });
});