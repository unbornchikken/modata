"use strict";

let util = require("util");
let _ = require("lodash");
let InlineCountResult = require("./inlineCountResult");
let debug = require("debug")("modata:query");

let parseQuery = function (query, options) {
    let decodedQuery = {
        q: {},
        t: "find",
        f: false,
        s: false,
        sk: false,
        l: null,
        p: false,
        ic: false
    };

    let decode = function (value) {
        let to = function (str) {
            str = str.trim();
            if ((str.length > 1) &&
                ((str[0] === "{" && str[str.length - 1] === "}") ||
                (str[0] === "'" && str[str.length - 1] === "'") ||
                (str[0] === '"' && str[str.length - 1] === '"') ||
                (str[0] === "[" && str[str.length - 1] === "]"))) {
                try {
                    return JSON.parse(str);
                }
                catch (e) {
                    _.noop(e);
                }
            }
            return false;
        };

        if (_.isString(value)) {
            let result = to(value);
            if (result === false) {
                result = to(decodeURIComponent(value));
            }
            if (result === false) {
                return value;
            }
            return result;
        }
        return value;
    };

    function walker(value, key, obj) {
        if (!value) {
            return;
        }
        if (_.isArray(value) || _.isPlainObject(value)) {
            _.forEach(value, walker);
        }
        else if (_.isString(value)) {
            if (key === "$regex") {
                let m = value.match(/\/(.*)\//);
                if (m) {
                    let options;
                    if (obj.$options) {
                        m[2] = obj.$options;
                        delete obj.$options;
                    }
                    obj[key] = new RegExp(m[1], m[2]);
                }
            }
            else {
                let decoded = decode(value);
                if (decoded !== value) {
                    obj[key] = decoded;
                    walker(decoded, key, obj);
                }
            }
        }
    }

    for (let key in query) {
        if (query.hasOwnProperty(key)) {
            switch (key) {
                case "q":
                    decodedQuery.q = decode(query[key]);
                    _.each(decodedQuery.q, walker);
                    break;
                case "t":
                    decodedQuery.t = query[key];
                    break;
                case "f":
                    decodedQuery.f = decode(query[key]);
                    break;
                case "s":
                    decodedQuery.s = decode(query[key]);
                    break;
                case "sk":
                    decodedQuery.sk = parseInt(query[key]);
                    break;
                case "l":
                    decodedQuery.l = parseInt(query[key]);
                    break;
                case "p":
                    decodedQuery.p = decode(query[key]);
                    break;
                case "ic":
                    decodedQuery.ic = (_.isString(query[key]) && query[key] === "true") || (_.isBoolean(query[key]) && query[key]);
                    break;
            }
        }
    }
    return decodedQuery;
};

let doQuery = function (query, model, options, callback) {
    debug("query: %j", query);
    let parsedQuery = parseQuery(query, options);
    if (!model)return parsedQuery;
    debug("parsedQuery: %j", query);
    let mongooseQuery = model;
    let originalQuery = model;

    let canDoIC = false;
    let aggr = false;

    switch (parsedQuery.t) {
        case "find":
        case "count":
        case "distinct":
            canDoIC = true;
            mongooseQuery = mongooseQuery.find(parsedQuery.q);
            originalQuery = originalQuery.find(parsedQuery.q);
            break;
        case "aggregate":
        case "aggr":
            canDoIC = true;
            mongooseQuery = mongooseQuery.aggregate(parsedQuery.q);
            originalQuery = originalQuery.aggregate(parsedQuery.q);
            break;
        default:
            throw new Error("Not supported query type: '" + parsedQuery.t + "'.");
    }

    if (!aggr) {
        if (parsedQuery.t === "distinct") {
            mongooseQuery = mongooseQuery.distinct(parsedQuery.f);
        }
        if (parsedQuery.s) mongooseQuery = mongooseQuery.sort(parsedQuery.s);
        if (parsedQuery.sk) mongooseQuery = mongooseQuery.skip(parsedQuery.sk);
        if (parsedQuery.l) mongooseQuery = mongooseQuery.limit(parsedQuery.l);
        if (parsedQuery.f && parsedQuery.t === "find") mongooseQuery = mongooseQuery.select(parsedQuery.f);
        if (parsedQuery.p) mongooseQuery = mongooseQuery.populate(parsedQuery.p);
        if (parsedQuery.t === "count") {
            mongooseQuery = mongooseQuery.count();
        }
    }
    else {
        if (parsedQuery.s) mongooseQuery = mongooseQuery.sort(parsedQuery.s);
        if (parsedQuery.sk) mongooseQuery = mongooseQuery.skip(parsedQuery.sk);
        if (parsedQuery.l) mongooseQuery = mongooseQuery.limit(parsedQuery.l);
        if (parsedQuery.f) mongooseQuery = mongooseQuery.project(parsedQuery.f);
        if (parsedQuery.p) {
            throw new Error("Populate is not supported during aggregation.");
        }
    }

    if (parsedQuery.ic) {
        if (!canDoIC) {
            throw new Error("Inline count is not supported for query type: '" + parsedQuery.t + "'.");
        }
        // Do inline count:
        mongooseQuery = new InlineCountResult(originalQuery, mongooseQuery, aggr);
    }

    return mongooseQuery;
};

module.exports = function Query(schema, options) {
    schema.statics.query = schema.statics.Query = function (query) {
        options = options || {};
        return doQuery(query, this, options);
    };
};
