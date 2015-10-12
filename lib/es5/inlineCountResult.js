"use strict";
var _ = require("lodash");
var Bluebird = require("bluebird");
var async = Bluebird.coroutine;
function InlineCountResult(originalQuery, query, isAggregate) {
  this.originalQuery = originalQuery;
  this.query = query;
  this.isAggregate = isAggregate;
}
InlineCountResult.prototype._verifyQuery = function() {
  if (this.isAggregate) {
    throw new Error("Operation not supported on an Aggregate.");
  }
};
InlineCountResult.prototype._verifyAggregate = function() {
  if (!this.isAggregate) {
    throw new Error("Operation not supported on a Query.");
  }
};
InlineCountResult.prototype.lean = function() {
  this._verifyQuery();
  return new InlineCountResult(this.originalQuery, this.query.lean.apply(this.query, arguments));
};
InlineCountResult.prototype.select = function() {
  this._verifyQuery();
  return new InlineCountResult(this.originalQuery, this.query.select.apply(this.query, arguments));
};
InlineCountResult.prototype.where = function() {
  this._verifyQuery();
  return new InlineCountResult(this.originalQuery.where.apply(this.originalQuery, arguments), this.query.where.apply(this.query, arguments));
};
InlineCountResult.prototype.equals = function() {
  this._verifyQuery();
  return new InlineCountResult(this.originalQuery.equals.apply(this.originalQuery, arguments), this.query.equals.apply(this.query, arguments));
};
InlineCountResult.prototype.in = function() {
  this._verifyQuery();
  return new InlineCountResult(this.originalQuery.in.apply(this.originalQuery, arguments), this.query.in.apply(this.query, arguments));
};
InlineCountResult.prototype.and = function() {
  this._verifyQuery();
  return new InlineCountResult(this.originalQuery.and.apply(this.originalQuery, arguments), this.query.and.apply(this.query, arguments));
};
InlineCountResult.prototype.or = function() {
  this._verifyQuery();
  return new InlineCountResult(this.originalQuery.or.apply(this.originalQuery, arguments), this.query.or.apply(this.query, arguments));
};
InlineCountResult.prototype.exec = function(callback) {
  var self = this;
  var p = async($traceurRuntime.initGeneratorFunction(function $__2() {
    var queryResult,
        count,
        cr;
    return $traceurRuntime.createGeneratorInstance(function($ctx) {
      while (true)
        switch ($ctx.state) {
          case 0:
            $ctx.state = (self.isAggregate) ? 1 : 11;
            break;
          case 1:
            $ctx.state = 2;
            return self.query.exec();
          case 2:
            queryResult = $ctx.sent;
            $ctx.state = 4;
            break;
          case 4:
            $ctx.state = 6;
            return self.originalQuery.group({
              _id: null,
              count: {$sum: 1}
            }).exec();
          case 6:
            cr = $ctx.sent;
            $ctx.state = 8;
            break;
          case 8:
            if (_.isArray(cr)) {
              cr = cr[0];
            }
            count = cr ? cr.count : 0;
            $ctx.state = 10;
            break;
          case 11:
            $ctx.state = 12;
            return self.query.exec();
          case 12:
            queryResult = $ctx.sent;
            $ctx.state = 14;
            break;
          case 14:
            $ctx.state = 16;
            return self.originalQuery.count().exec();
          case 16:
            count = $ctx.sent;
            $ctx.state = 10;
            break;
          case 10:
            $ctx.returnValue = {
              data: queryResult,
              count: count
            };
            $ctx.state = -2;
            break;
          default:
            return $ctx.end();
        }
    }, $__2, this);
  }))();
  if (callback) {
    p.nodeify(callback);
  }
  return p;
};
module.exports = InlineCountResult;

//# sourceMappingURL=inlineCountResult.js.map
