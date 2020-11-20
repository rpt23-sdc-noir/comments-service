/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */
const chai = require('chai');
const chaiHttp = require('chai-http');
require('dotenv').config();

const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 4000;
const app = `http://${HOST}:${PORT}`;

// eslint-disable-next-line no-unused-vars
const should = chai.should();
const { expect } = chai;
chai.use(chaiHttp);

let contentHolder;
let songIdHolder;
let userIdHolder;
let timeStampHolder;
let lastCommentId;

describe('/GET comments', () => {
  before((done) => {
    chai
      .request(app)
      .get('/user/comment/1')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(err).to.be.null;
        contentHolder = res.body.data[0].content;
        songIdHolder = res.body.data[0].song_id;
        userIdHolder = res.body.data[0].user_id;
        timeStampHolder = res.body.data[0].time_stamp;
        done();
      });
  });

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
  after((done) => {
    chai
      .request(app)
      .delete('/comment/0')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(err).to.be.null;
        res.body.success.should.equal(true);
        res.body.msg.n.should.equal(1);
        done();
      });
  });

  it('POST a test comment on song_id 0', (done) => {
    chai
      .request(app)
      .post('/comment/0')
      .send({
        user_id: 0,
        song_id: 0,
        content: 'Test',
        time_stamp: 100,
      })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(err).to.be.null;
        res.body.success.should.equal(true);
        done();
      });
  });

  it('it should GET some comment for song_id 0', (done) => {
    chai
      .request(app)
      .get('/comments/0')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.data.should.be.a('array');
        res.body.data.length.should.be.greaterThan(0);
        expect(res.body.data[0].content).to.be.a('string');
        expect(res.body.data[0].content).to.equal('Test');
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
        done();
      });
  });
});

describe('Test CRUD Operations for comments', () => {
  after((done) => {
    chai
      .request(app)
      .post('/comment/1')
      .send({
        user_id: userIdHolder,
        song_id: songIdHolder,
        content: contentHolder,
        time_stamp: timeStampHolder,
      })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(err).to.be.null;
        res.body.success.should.equal(true);
        done();
      });
  });

  it('PUT should be able to edit an existing comment', (done) => {
    chai
      .request(app)
      .put('/comment')
      .send({
        comment_id: 1,
        content: 'Test PUT operation',
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(err).to.be.null;
        res.body.success.should.equal(true);
        res.body.msg.n.should.equal(1);
        done();
      });
  });

  it('GET should be able to get comment updated by PUT', (done) => {
    chai
      .request(app)
      .get('/user/comment/1')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(err).to.be.null;
        expect(res.body.data[0].content).to.be.a('string');
        expect(res.body.data[0].content).to.equal('Test PUT operation');
        done();
      });
  });

  it('DELETE should be able to delete a comment', (done) => {
    chai
      .request(app)
      .delete('/comment/1')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(err).to.be.null;
        res.body.success.should.equal(true);
        res.body.msg.n.should.equal(1);
        done();
      });
  });

  it('Should not find comment deleted by DELETE method', (done) => {
    chai
      .request(app)
      .get('/user/comment/1')
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(err).to.be.null;
        res.body.success.should.equal(false);
        done();
      });
  });

  it('POST should add a new msg to the db', (done) => {
    chai
      .request(app)
      .post('/comment')
      .send({
        user_id: userIdHolder,
        song_id: songIdHolder,
        content: contentHolder,
        time_stamp: timeStampHolder,
      })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(err).to.be.null;
        res.body.success.should.equal(true);
        lastCommentId = res.body.data.comment_id;
        done();
      });
  });

  it('DELETE should clean up test entry created by POST test', (done) => {
    chai
      .request(app)
      .delete(`/comment/${lastCommentId}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(err).to.be.null;
        res.body.success.should.equal(true);
        res.body.msg.n.should.equal(1);
        done();
      });
  });

  it('Should not find cleaned up test comment deleted by DELETE method', (done) => {
    chai
      .request(app)
      .get(`/user/comment/${lastCommentId}`)
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(err).to.be.null;
        res.body.success.should.equal(false);
        done();
      });
  });
});
