"use strict";

let util = require("util");
let _ = require("lodash");
let InlineCountResult = require("./inlineCountResult");
let debug = require("debug")("modata:query");

let parseQuery = function (query, options) {
    let decodedQuery = {
        q: {},      //  query
        t: "find",   //  count
        f: false,      // fields
        s: false,      //  sort
        sk: false,      //  skip
        l: null,     //  limit
        p: false,    //populate
        ic: false
    };

    let toJSON = function (str) {
        if (_.isString(str) && str.length > 1 &&
            ((str[0] === "{" && str[str.length - 1] === "}") ||
            (str[0] === "[" && str[str.length - 1] === "]"))) {
            let json = {};
            try {
                json = JSON.parse(str);
            } catch (e) {
                if (_.isString(str) && str.match(/^[$A-Z_][0-9A-Z_$]*$/i)) {
                    json = str;
                }
                else {
                    throw new TypeError("Argument is not in JSON format: " + str);
                }
            }
            return json;
        }
        else {
            return str;
        }
    };

    function walker(value, key, obj) {
        if (value !== null && typeof value === "object") {
            // Recurse into children
            _.each(value, walker);
        } else if (typeof value === "string") {
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
        }
    }

    for (let key in query) {
        if (query.hasOwnProperty(key)) {
            switch (key) {
                case("q"):
                    decodedQuery.q = toJSON(decodeURIComponent(query[key]));
                    _.each(decodedQuery.q, walker);
                    break;
                case("t"):
                    decodedQuery.t = query[key];
                    break;
                case("f"):
                    decodedQuery.f = toJSON(decodeURIComponent(query[key]));
                    break;
                case("s"):
                    decodedQuery.s = toJSON(query[key]);
                    break;
                case("sk"):
                    decodedQuery.sk = parseInt(query[key]);
                    break;
                case("l"):
                    decodedQuery.l = parseInt(query[key]);
                    break;
                case("p"):
                    decodedQuery.p = toJSON(query[key]);
                    break;
                case("ic"):
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
