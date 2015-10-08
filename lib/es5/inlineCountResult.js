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
            count = cr.count;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImlubGluZUNvdW50UmVzdWx0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBRUEsQUFBSSxFQUFBLENBQUEsQ0FBQSxFQUFJLENBQUEsT0FBTSxBQUFDLENBQUMsUUFBTyxDQUFDLENBQUM7QUFDekIsQUFBSSxFQUFBLENBQUEsUUFBTyxFQUFJLENBQUEsT0FBTSxBQUFDLENBQUMsVUFBUyxDQUFDLENBQUM7QUFDbEMsQUFBSSxFQUFBLENBQUEsS0FBSSxFQUFJLENBQUEsUUFBTyxVQUFVLENBQUM7QUFFOUIsT0FBUyxrQkFBZ0IsQ0FBRSxhQUFZLENBQUcsQ0FBQSxLQUFJLENBQUcsQ0FBQSxXQUFVLENBQUc7QUFDMUQsS0FBRyxjQUFjLEVBQUksY0FBWSxDQUFDO0FBQ2xDLEtBQUcsTUFBTSxFQUFJLE1BQUksQ0FBQztBQUNsQixLQUFHLFlBQVksRUFBSSxZQUFVLENBQUM7QUFDbEM7QUFBQSxBQUVBLGdCQUFnQixVQUFVLGFBQWEsRUFBSSxVQUFVLEFBQUQsQ0FBRztBQUNuRCxLQUFJLElBQUcsWUFBWSxDQUFHO0FBQ2xCLFFBQU0sSUFBSSxNQUFJLEFBQUMsQ0FBQywwQ0FBeUMsQ0FBQyxDQUFDO0VBQy9EO0FBQUEsQUFDSixDQUFDO0FBRUQsZ0JBQWdCLFVBQVUsaUJBQWlCLEVBQUksVUFBVSxBQUFELENBQUc7QUFDdkQsS0FBSSxDQUFDLElBQUcsWUFBWSxDQUFHO0FBQ25CLFFBQU0sSUFBSSxNQUFJLEFBQUMsQ0FBQyxxQ0FBb0MsQ0FBQyxDQUFDO0VBQzFEO0FBQUEsQUFDSixDQUFDO0FBRUQsZ0JBQWdCLFVBQVUsS0FBSyxFQUFJLFVBQVUsQUFBRCxDQUFHO0FBQzNDLEtBQUcsYUFBYSxBQUFDLEVBQUMsQ0FBQztBQUNuQixPQUFPLElBQUksa0JBQWdCLEFBQUMsQ0FBQyxJQUFHLGNBQWMsQ0FBRyxDQUFBLElBQUcsTUFBTSxLQUFLLE1BQU0sQUFBQyxDQUFDLElBQUcsTUFBTSxDQUFHLFVBQVEsQ0FBQyxDQUFDLENBQUM7QUFD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cyIsInNvdXJjZVJvb3QiOiJsaWIvZXM2Iiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5sZXQgXyA9IHJlcXVpcmUoXCJsb2Rhc2hcIik7XHJcbmxldCBCbHVlYmlyZCA9IHJlcXVpcmUoXCJibHVlYmlyZFwiKTtcclxubGV0IGFzeW5jID0gQmx1ZWJpcmQuY29yb3V0aW5lO1xyXG5cclxuZnVuY3Rpb24gSW5saW5lQ291bnRSZXN1bHQob3JpZ2luYWxRdWVyeSwgcXVlcnksIGlzQWdncmVnYXRlKSB7XHJcbiAgICB0aGlzLm9yaWdpbmFsUXVlcnkgPSBvcmlnaW5hbFF1ZXJ5O1xyXG4gICAgdGhpcy5xdWVyeSA9IHF1ZXJ5O1xyXG4gICAgdGhpcy5pc0FnZ3JlZ2F0ZSA9IGlzQWdncmVnYXRlO1xyXG59XHJcblxyXG5JbmxpbmVDb3VudFJlc3VsdC5wcm90b3R5cGUuX3ZlcmlmeVF1ZXJ5ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgaWYgKHRoaXMuaXNBZ2dyZWdhdGUpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJPcGVyYXRpb24gbm90IHN1cHBvcnRlZCBvbiBhbiBBZ2dyZWdhdGUuXCIpO1xyXG4gICAgfVxyXG59O1xyXG5cclxuSW5saW5lQ291bnRSZXN1bHQucHJvdG90eXBlLl92ZXJpZnlBZ2dyZWdhdGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBpZiAoIXRoaXMuaXNBZ2dyZWdhdGUpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJPcGVyYXRpb24gbm90IHN1cHBvcnRlZCBvbiBhIFF1ZXJ5LlwiKTtcclxuICAgIH1cclxufTtcclxuXHJcbklubGluZUNvdW50UmVzdWx0LnByb3RvdHlwZS5sZWFuID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdGhpcy5fdmVyaWZ5UXVlcnkoKTtcclxuICAgIHJldHVybiBuZXcgSW5saW5lQ291bnRSZXN1bHQodGhpcy5vcmlnaW5hbFF1ZXJ5LCB0aGlzLnF1ZXJ5LmxlYW4uYXBwbHkodGhpcy5xdWVyeSwgYXJndW1lbnRzKSk7XHJcbn07XHJcblxyXG5JbmxpbmVDb3VudFJlc3VsdC5wcm90b3R5cGUuc2VsZWN0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdGhpcy5fdmVyaWZ5UXVlcnkoKTtcclxuICAgIHJldHVybiBuZXcgSW5saW5lQ291bnRSZXN1bHQodGhpcy5vcmlnaW5hbFF1ZXJ5LCB0aGlzLnF1ZXJ5LnNlbGVjdC5hcHBseSh0aGlzLnF1ZXJ5LCBhcmd1bWVudHMpKTtcclxufTtcclxuXHJcbklubGluZUNvdW50UmVzdWx0LnByb3RvdHlwZS53aGVyZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHRoaXMuX3ZlcmlmeVF1ZXJ5KCk7XHJcbiAgICByZXR1cm4gbmV3IElubGluZUNvdW50UmVzdWx0KHRoaXMub3JpZ2luYWxRdWVyeS53aGVyZS5hcHBseSh0aGlzLm9yaWdpbmFsUXVlcnksIGFyZ3VtZW50cyksIHRoaXMucXVlcnkud2hlcmUuYXBwbHkodGhpcy5xdWVyeSwgYXJndW1lbnRzKSk7XHJcbn07XHJcblxyXG5JbmxpbmVDb3VudFJlc3VsdC5wcm90b3R5cGUuZXF1YWxzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdGhpcy5fdmVyaWZ5UXVlcnkoKTtcclxuICAgIHJldHVybiBuZXcgSW5saW5lQ291bnRSZXN1bHQodGhpcy5vcmlnaW5hbFF1ZXJ5LmVxdWFscy5hcHBseSh0aGlzLm9yaWdpbmFsUXVlcnksIGFyZ3VtZW50cyksIHRoaXMucXVlcnkuZXF1YWxzLmFwcGx5KHRoaXMucXVlcnksIGFyZ3VtZW50cykpO1xyXG59O1xyXG5cclxuSW5saW5lQ291bnRSZXN1bHQucHJvdG90eXBlLmluID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdGhpcy5fdmVyaWZ5UXVlcnkoKTtcclxuICAgIHJldHVybiBuZXcgSW5saW5lQ291bnRSZXN1bHQodGhpcy5vcmlnaW5hbFF1ZXJ5LmluLmFwcGx5KHRoaXMub3JpZ2luYWxRdWVyeSwgYXJndW1lbnRzKSwgdGhpcy5xdWVyeS5pbi5hcHBseSh0aGlzLnF1ZXJ5LCBhcmd1bWVudHMpKTtcclxufTtcclxuXHJcbklubGluZUNvdW50UmVzdWx0LnByb3RvdHlwZS5hbmQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aGlzLl92ZXJpZnlRdWVyeSgpO1xyXG4gICAgcmV0dXJuIG5ldyBJbmxpbmVDb3VudFJlc3VsdCh0aGlzLm9yaWdpbmFsUXVlcnkuYW5kLmFwcGx5KHRoaXMub3JpZ2luYWxRdWVyeSwgYXJndW1lbnRzKSwgdGhpcy5xdWVyeS5hbmQuYXBwbHkodGhpcy5xdWVyeSwgYXJndW1lbnRzKSk7XHJcbn07XHJcblxyXG5JbmxpbmVDb3VudFJlc3VsdC5wcm90b3R5cGUub3IgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aGlzLl92ZXJpZnlRdWVyeSgpO1xyXG4gICAgcmV0dXJuIG5ldyBJbmxpbmVDb3VudFJlc3VsdCh0aGlzLm9yaWdpbmFsUXVlcnkub3IuYXBwbHkodGhpcy5vcmlnaW5hbFF1ZXJ5LCBhcmd1bWVudHMpLCB0aGlzLnF1ZXJ5Lm9yLmFwcGx5KHRoaXMucXVlcnksIGFyZ3VtZW50cykpO1xyXG59O1xyXG5cclxuSW5saW5lQ291bnRSZXN1bHQucHJvdG90eXBlLmV4ZWMgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcclxuICAgIGxldCBzZWxmID0gdGhpcztcclxuICAgIGxldCBwID0gYXN5bmMoZnVuY3Rpb24qKCkge1xyXG4gICAgICAgIGxldCBxdWVyeVJlc3VsdDtcclxuICAgICAgICBsZXQgY291bnQ7XHJcbiAgICAgICAgaWYgKHNlbGYuaXNBZ2dyZWdhdGUpIHtcclxuICAgICAgICAgICAgcXVlcnlSZXN1bHQgPSB5aWVsZCBzZWxmLnF1ZXJ5LmV4ZWMoKTtcclxuICAgICAgICAgICAgbGV0IGNyID0geWllbGQgc2VsZi5vcmlnaW5hbFF1ZXJ5Lmdyb3VwKHsgX2lkOiBudWxsLCBjb3VudDogeyAkc3VtOiAxIH0gfSkuZXhlYygpO1xyXG4gICAgICAgICAgICBpZiAoXy5pc0FycmF5KGNyKSkge1xyXG4gICAgICAgICAgICAgICAgY3IgPSBjclswXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb3VudCA9IGNyLmNvdW50O1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgcXVlcnlSZXN1bHQgPSB5aWVsZCBzZWxmLnF1ZXJ5LmV4ZWMoKTtcclxuICAgICAgICAgICAgY291bnQgPSB5aWVsZCBzZWxmLm9yaWdpbmFsUXVlcnkuY291bnQoKS5leGVjKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIGRhdGE6IHF1ZXJ5UmVzdWx0LFxyXG4gICAgICAgICAgICBjb3VudDogY291bnRcclxuICAgICAgICB9O1xyXG4gICAgfSkoKTtcclxuICAgIGlmIChjYWxsYmFjaykge1xyXG4gICAgICAgIHAubm9kZWlmeShjYWxsYmFjayk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcDtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gSW5saW5lQ291bnRSZXN1bHQ7Il19
