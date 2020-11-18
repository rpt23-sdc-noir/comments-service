/* eslint-disable no-undef */
const chai = require('chai');
const chaiHttp = require('chai-http');
require('dotenv').config();

const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 4000;
const app = `http://${HOST}:${PORT}`;

// eslint-disable-next-line no-unused-vars
const should = chai.should();
chai.use(chaiHttp);

describe('/GET comments', () => {
  it('it should GET all the comments', (done) => {
    chai
      .request(app)
      .get('/comments')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.data.should.be.a('array');
        res.body.data.length.should.be.gt(36);
        res.body.data.length.should.be.below(1000);
        done();
      });
  });
});

describe('/GET comment', () => {
  it('it should GET some comment for song_id 1', (done) => {
    chai
      .request(app)
      .get('/comments/1')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.data.should.be.a('array');
        res.body.data.length.should.be.greaterThan(0);
        done();
      });
  });

  it('it should not GET any comments for a non-existant song_id 101', (done) => {
    chai
      .request(app)
      .get('/comments/101')
      .end((err, res) => {
        res.should.have.status(400);
        res.body.msg.should.be.a('string');
        // res.body.msg.should.equal('no song with id 101');
        done();
      });
  });
});
