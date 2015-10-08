"use strict";

let _ = require("lodash");
let Bluebird = require("bluebird");
let async = Bluebird.coroutine;

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

InlineCountResult.prototype.lean = function () {
    this._verifyQuery();
    return new InlineCountResult(this.originalQuery, this.query.lean.apply(this.query, arguments));
};

InlineCountResult.prototype.select = function () {
    this._verifyQuery();
    return new InlineCountResult(this.originalQuery, this.query.select.apply(this.query, arguments));
};

InlineCountResult.prototype.where = function () {
    this._verifyQuery();
    return new InlineCountResult(this.originalQuery.where.apply(this.originalQuery, arguments), this.query.where.apply(this.query, arguments));
};

InlineCountResult.prototype.equals = function () {
    this._verifyQuery();
    return new InlineCountResult(this.originalQuery.equals.apply(this.originalQuery, arguments), this.query.equals.apply(this.query, arguments));
};

InlineCountResult.prototype.in = function () {
    this._verifyQuery();
    return new InlineCountResult(this.originalQuery.in.apply(this.originalQuery, arguments), this.query.in.apply(this.query, arguments));
};

InlineCountResult.prototype.and = function () {
    this._verifyQuery();
    return new InlineCountResult(this.originalQuery.and.apply(this.originalQuery, arguments), this.query.and.apply(this.query, arguments));
};

InlineCountResult.prototype.or = function () {
    this._verifyQuery();
    return new InlineCountResult(this.originalQuery.or.apply(this.originalQuery, arguments), this.query.or.apply(this.query, arguments));
};

InlineCountResult.prototype.exec = function (callback) {
    let self = this;
    async(function*() {
        let queryResult;
        let count;
        if (self.isAggregate) {
            queryResult = yield self.query.exec();
            let cr = yield self.originalQuery.group({ _id: null, count: { $sum: 1 } }).exec();
            if (_.isArray(cr)) {
                cr = cr[0];
            }
            count = cr.count;
        }
        else {
            queryResult = yield self.query.exec();
            count = yield self.originalQuery.count().exec();
        }
        return {
            data: queryResult,
            count: count
        };
    })().nodeify(callback);
};

module.exports = InlineCountResult;