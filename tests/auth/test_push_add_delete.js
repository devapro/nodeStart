var chai = require('chai');
var chaiHttp = require('chai-http');
var winston = require('winston');
var request = require('supertest');
var should = chai.should();
chai.use(chaiHttp);

var url = 'http://127.0.0.1:3000';
var token = 'ebf60566692dfb955cf2b0c1eb661568';

describe('API Push', function() {
    it('Set push error', function(done) {
        request(url)
            .post('/api/add_device')
            .set('Content-Type', 'application/json')
            .set('Authorization', token)
            .send({"id":12,"params":{"id":"22"}})
            .end(function(err, res) {
                if (err) {
                    throw err;
                }

                winston.info(res.body);

                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('result');
                res.body.result.should.be.a('object');
                res.body.result.should.have.property('status');
                res.body.result.should.have.property('message');
                res.body.result.should.have.property('data');
                res.body.result.data.should.have.property('error');
                res.body.result.data.should.have.property('items');

                res.body.result.data.should.be.a('object');
                res.body.result.data.error.should.be.a('array');

                res.body.result.status.should.equal(0);
                res.body.result.data.items.should.be.a('object');

                done();
            });
    });

    it('Set push success', function(done) {
        request(url)
            .post('/api/add_device')
            .set('Content-Type', 'application/json')
            .set('Authorization', token)
            .send({"id":12,"params":{"id":"5742d65d407905a4518d422c5742d65d407905a4518d422c5742d65d407905a4518d422c5742d65d407905a4518d422c"}})
            .end(function(err, res) {
                if (err) {
                    throw err;
                }

                winston.info(res.body);

                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('result');
                res.body.result.should.be.a('object');
                res.body.result.should.have.property('status');
                res.body.result.should.have.property('message');
                res.body.result.should.have.property('data');
                res.body.result.data.should.have.property('error');
                res.body.result.data.should.have.property('items');

                res.body.result.data.should.be.a('object');
                res.body.result.data.error.should.be.a('array');

                res.body.result.status.should.equal(1);

                res.body.result.data.items.should.be.a('object');

                // res.body.SUCCESS.name.should.equal('Java');
                // res.body.SUCCESS.lastName.should.equal('Script');
                done();
            });
    });

    it('Set delete push error', function(done) {
        request(url)
            .post('/api/remove_device')
            .set('Content-Type', 'application/json')
            .set('Authorization', token)
            .send({"id":12,"params":{"id":"5742d65d407905a4518d422c574"}})
            .end(function(err, res) {
                if (err) {
                    throw err;
                }

                winston.info(res.body);

                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('result');
                res.body.result.should.be.a('object');
                res.body.result.should.have.property('status');
                res.body.result.should.have.property('message');
                res.body.result.should.have.property('data');
                res.body.result.data.should.have.property('error');
                res.body.result.data.should.have.property('items');

                res.body.result.data.should.be.a('object');
                res.body.result.data.error.should.be.a('array');

                res.body.result.status.should.equal(0);
                res.body.result.data.items.should.be.a('object');

                done();
            });
    });

    it('Set delete push success', function(done) {
        request(url)
            .post('/api/remove_device')
            .set('Content-Type', 'application/json')
            .set('Authorization', token)
            .send({"id":12,"params":{"id":"5742d65d407905a4518d422c5742d65d407905a4518d422c5742d65d407905a4518d422c5742d65d407905a4518d422c"}})
            .end(function(err, res) {
                if (err) {
                    throw err;
                }

                winston.info(res.body);

                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('result');
                res.body.result.should.be.a('object');
                res.body.result.should.have.property('status');
                res.body.result.should.have.property('message');
                res.body.result.should.have.property('data');
                res.body.result.data.should.have.property('error');
                res.body.result.data.should.have.property('items');

                res.body.result.data.should.be.a('object');
                res.body.result.data.error.should.be.a('array');

                res.body.result.status.should.equal(1);

                res.body.result.data.items.should.be.a('object');
                done();
            });
    });
});
