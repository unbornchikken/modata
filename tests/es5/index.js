"use strict";
var fs = require("fs");
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var assert = require("chai").assert;
var Query = require("../../").Query;
var ObjectId = Schema.ObjectId;
var OrigSchema = new mongoose.Schema({value: {
    type: String,
    default: "original"
  }});
var TestSchema = new mongoose.Schema({
  title: {
    type: String,
    index: true
  },
  msg: {
    type: String,
    lowercase: true,
    trim: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  orig: {
    type: ObjectId,
    ref: "originals"
  },
  nest: {ed: {
      type: String,
      default: "value"
    }}
});
TestSchema.plugin(Query);
var origModel = mongoose.model("originals", OrigSchema);
var Test = mongoose.model("test", TestSchema);
mongoose.connect(process.env.MONGO_URL, {});
var _id = "123123";
describe('Query:basic', function() {
  before(function(done) {
    this.timeout(10000);
    var create = function(i, max, callback) {
      if (i < max) {
        var obj = new Test({
          title: (i < 10 ? 'testa' : 'testb'),
          msg: 'i#' + i,
          orig: _id
        });
        obj.save(function(error, doc) {
          create(i + 1, max, callback);
        });
      } else {
        callback();
      }
    };
    mongoose.connection.on('connected', function() {
      origModel.remove({}, function() {
        var obj = new origModel();
        obj.save(function(error, doc) {
          _id = doc._id;
          Test.remove({}, function() {
            create(0, 20, done);
          });
        });
      });
    });
  });
  it('all', function(done) {
    Test.Query({q: '{}'}).exec(function(error, data) {
      assert.equal(error, undefined);
      assert.equal(data.length, 20);
      assert.isTrue((data[0].orig + '').match(/([0-9a-z]{24})/) != null);
      done();
    });
  });
  it('regex', function(done) {
    Test.Query({q: '{"title": {"$regex": "/^testa/"}}'}).exec(function(error, data) {
      assert.equal(error, undefined);
      assert.equal(data.length, 10);
      assert.isTrue((data[0].orig + '').match(/([0-9a-z]{24})/) != null);
      done();
    });
  });
  it('regex && ic', function(done) {
    Test.Query({
      q: '{"title": {"$regex": "/^testa/"}}',
      ic: true,
      sk: 2
    }).exec(function(error, data) {
      assert.equal(error, undefined);
      assert.equal(data.count, 10);
      assert.equal(data.data.length, 8);
      assert.isTrue((data.data[0].orig + '').match(/([0-9a-z]{24})/) != null);
      done();
    });
  });
  it('find & sort', function(done) {
    Test.Query({
      q: '{}',
      t: 'find',
      s: '{"msg": 1}',
      l: 1
    }).exec(function(error, data) {
      assert.equal(error, undefined);
      assert.typeOf(data, 'Array');
      assert.equal(data[0].title, 'testa');
      assert.equal(data[0].msg, 'i#0');
      assert.equal(data.length, 1);
      done();
    });
  });
  it('exact', function(done) {
    Test.Query({q: '{"msg":"i#3"}'}).exec(function(error, data) {
      assert.equal(error, undefined);
      assert.equal(data.length, 1);
      assert.equal(data[0].msg, "i#3");
      done();
    });
  });
  it('populate', function(done) {
    Test.Query({
      q: '{"msg":"i#3"}',
      p: 'orig'
    }).exec(function(error, data) {
      assert.equal(error, undefined);
      assert.equal(data.length, 1);
      assert.equal(data[0].msg, "i#3");
      assert.equal(data[0].orig.value, "original");
      done();
    });
  });
  it('limit & select', function(done) {
    Test.Query({
      q: '{}',
      f: 'title',
      l: '3',
      s: '{"title": -1}'
    }).exec(function(error, data) {
      assert.equal(error, undefined);
      assert.equal(data.length, 3);
      assert.equal(data[0].msg, undefined);
      assert.equal(data[0].title, "testb");
      assert.equal(data[1].msg, undefined);
      assert.equal(data[1].title, "testb");
      assert.equal(data[2].msg, undefined);
      assert.equal(data[2].title, "testb");
      done();
    });
  });
  it('skip', function(done) {
    Test.Query({
      q: '{}',
      sk: '3'
    }).exec(function(error, data) {
      assert.equal(error, undefined);
      assert.equal(data.length, 17);
      done();
    });
  });
  it('count', function(done) {
    Test.Query({
      q: '{"$or": [ {"msg":"i#1"}, {"msg":"i#2"}]}',
      t: 'count'
    }).exec(function(error, data) {
      assert.equal(error, undefined);
      assert.equal(data, 2);
      done();
    });
  });
  it('distinct', function(done) {
    Test.Query({
      f: 'title',
      t: 'distinct'
    }).exec(function(error, data) {
      assert.equal(error, undefined);
      assert.equal(data.length, 2);
      done();
    });
  });
});

//# sourceMappingURL=index.js.map
