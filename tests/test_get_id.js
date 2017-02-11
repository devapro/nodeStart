var chai = require('chai');
var chaiHttp = require('chai-http');
var winston = require('winston');
var request = require('supertest');
var should = chai.should();
chai.use(chaiHttp);

var url = 'http://127.0.0.1:3000';
var token = '37f67a62832dea08598918a0177850e1';

describe('API quiz', function() {

    it('Get quiz success', function(done) {
        request(url)
            .post('/api/get_medimee_id')
            .set('Content-Type', 'application/json')
            //.set('Authorization', token)
            .send({"id":12,"params":{code: "RU"}})
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
                res.body.result.data.items.should.have.property('id');

                done();
            });
    });
});
