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
  async($traceurRuntime.initGeneratorFunction(function $__2() {
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
  }))().nodeify(callback);
};
module.exports = InlineCountResult;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImlubGluZUNvdW50UmVzdWx0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBRUEsQUFBSSxFQUFBLENBQUEsQ0FBQSxFQUFJLENBQUEsT0FBTSxBQUFDLENBQUMsUUFBTyxDQUFDLENBQUM7QUFDekIsQUFBSSxFQUFBLENBQUEsUUFBTyxFQUFJLENBQUEsT0FBTSxBQUFDLENBQUMsVUFBUyxDQUFDLENBQUM7QUFDbEMsQUFBSSxFQUFBLENBQUEsS0FBSSxFQUFJLENBQUEsUUFBTyxVQUFVLENBQUM7QUFFOUIsT0FBUyxrQkFBZ0IsQ0FBRSxhQUFZLENBQUcsQ0FBQSxLQUFJLENBQUcsQ0FBQSxXQUFVLENBQUc7QUFDMUQsS0FBRyxjQUFjLEVBQUksY0FBWSxDQUFDO0FBQ2xDLEtBQUcsTUFBTSxFQUFJLE1BQUksQ0FBQztBQUNsQixLQUFHLFlBQVksRUFBSSxZQUFVLENBQUM7QUFDbEM7QUFBQSxBQUVBLGdCQUFnQixVQUFVLGFBQWEsRUFBSSxVQUFTLEFBQUQsQ0FBRztBQUNsRCxLQUFJLElBQUcsWUFBWSxDQUFHO0FBQ2xCLFFBQU0sSUFBSSxNQUFJLEFBQUMsQ0FBQywwQ0FBeUMsQ0FBQyxDQUFDO0VBQy9EO0FBQUEsQUFDSixDQUFDO0FBRUQsZ0JBQWdCLFVBQVUsaUJBQWlCLEVBQUksVUFBUyxBQUFELENBQUc7QUFDdEQsS0FBSSxDQUFDLElBQUcsWUFBWSxDQUFHO0FBQ25CLFFBQU0sSUFBSSxNQUFJLEFBQUMsQ0FBQyxxQ0FBb0MsQ0FBQyxDQUFDO0VBQzFEO0FBQUEsQUFDSixDQUFDO0FBRUQsZ0JBQWdCLFVBQVUsS0FBSyxFQUFJLFVBQVUsQUFBRCxDQUFHO0FBQzNDLEtBQUcsYUFBYSxBQUFDLEVBQUMsQ0FBQztBQUNuQixPQUFPLElBQUksa0JBQWdCLEFBQUMsQ0FBQyxJQUFHLGNBQWMsQ0FBRyxDQUFBLElBQUcsTUFBTSxLQUFLLE1BQU0sQUFBQyxDQUFDLElBQUcsTUFBTSxDQUFHLFVBQVEsQ0FBQyxDQUFDLENBQUM7QUFD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QWlFd0MsQ0FBQTs7Ozs7aUJBQ3JCLENBQUEsSUFBRyxjQUFjLE1BQU0sQUFBQyxDQUFDO0FBQUUsZ0JBQUUsQ0FBRyxLQUFHO0FBQUcsa0JBQUksQ0FBRyxFQUFFLElBQUcsQ0FBRyxFQUFBLENBQUU7QUFBQSxZQUFFLENBQUMsS0FBSyxBQUFDLEVBQUM7O2VBbEU1RixDQUFBLElBQUcsS0FBSzs7OztBQW1FSSxlQUFJLENBQUEsUUFBUSxBQUFDLENBQUMsRUFBQyxDQUFDLENBQUc7QUFDZixlQUFDLEVBQUksQ0FBQSxFQUFDLENBQUUsQ0FBQSxDQUFDLENBQUM7WUFDZDtBQUFBLEFBQ0EsZ0JBQUksRUFBSSxDQUFBLEVBQUMsTUFBTSxDQUFDOzs7OztpQkFHSSxDQUFBLElBQUcsTUFBTSxLQUFLLEFBQUMsRUFBQzs7QUFBcEMsc0JBQVUsRUF6RXRCLENBQUEsSUFBRyxLQUFLLEFBeUV3QyxDQUFBOzs7OztpQkFDdEIsQ0FBQSxJQUFHLGNBQWMsTUFBTSxBQUFDLEVBQUMsS0FBSyxBQUFDLEVBQUM7O0FBQTlDLGdCQUFJLEVBMUVoQixDQUFBLElBQUcsS0FBSyxBQTBFa0QsQ0FBQTs7OztBQTFFMUQsZUFBRyxZQUFZLEVBNEVBO0FBQ0gsaUJBQUcsQ0FBRyxZQUFVO0FBQ2hCLGtCQUFJLENBQUcsTUFBSTtBQUFBLFlBQ2YsQUEvRTJCLENBQUE7Ozs7QUFBbkMsaUJBQU8sQ0FBQSxJQUFHLElBQUksQUFBQyxFQUFDLENBQUE7O0FBQ21CLElBQy9CLE9BQTZCLEtBQUcsQ0FBQyxDQUFDO0VBOEVsQyxDQWhGbUQsQ0FnRmxELEFBQUMsRUFBQyxRQUFRLEFBQUMsQ0FBQyxRQUFPLENBQUMsQ0FBQztBQUMxQixDQUFDO0FBRUQsS0FBSyxRQUFRLEVBQUksa0JBQWdCLENBQUM7QUFBQSIsImZpbGUiOiJpbmxpbmVDb3VudFJlc3VsdC5qcyIsInNvdXJjZVJvb3QiOiJsaWIvZXM2Iiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5sZXQgXyA9IHJlcXVpcmUoXCJsb2Rhc2hcIik7XHJcbmxldCBCbHVlYmlyZCA9IHJlcXVpcmUoXCJibHVlYmlyZFwiKTtcclxubGV0IGFzeW5jID0gQmx1ZWJpcmQuY29yb3V0aW5lO1xyXG5cclxuZnVuY3Rpb24gSW5saW5lQ291bnRSZXN1bHQob3JpZ2luYWxRdWVyeSwgcXVlcnksIGlzQWdncmVnYXRlKSB7XHJcbiAgICB0aGlzLm9yaWdpbmFsUXVlcnkgPSBvcmlnaW5hbFF1ZXJ5O1xyXG4gICAgdGhpcy5xdWVyeSA9IHF1ZXJ5O1xyXG4gICAgdGhpcy5pc0FnZ3JlZ2F0ZSA9IGlzQWdncmVnYXRlO1xyXG59XHJcblxyXG5JbmxpbmVDb3VudFJlc3VsdC5wcm90b3R5cGUuX3ZlcmlmeVF1ZXJ5ID0gZnVuY3Rpb24oKSB7XHJcbiAgICBpZiAodGhpcy5pc0FnZ3JlZ2F0ZSkge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIk9wZXJhdGlvbiBub3Qgc3VwcG9ydGVkIG9uIGFuIEFnZ3JlZ2F0ZS5cIik7XHJcbiAgICB9XHJcbn07XHJcblxyXG5JbmxpbmVDb3VudFJlc3VsdC5wcm90b3R5cGUuX3ZlcmlmeUFnZ3JlZ2F0ZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgaWYgKCF0aGlzLmlzQWdncmVnYXRlKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiT3BlcmF0aW9uIG5vdCBzdXBwb3J0ZWQgb24gYSBRdWVyeS5cIik7XHJcbiAgICB9XHJcbn07XHJcblxyXG5JbmxpbmVDb3VudFJlc3VsdC5wcm90b3R5cGUubGVhbiA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHRoaXMuX3ZlcmlmeVF1ZXJ5KCk7XHJcbiAgICByZXR1cm4gbmV3IElubGluZUNvdW50UmVzdWx0KHRoaXMub3JpZ2luYWxRdWVyeSwgdGhpcy5xdWVyeS5sZWFuLmFwcGx5KHRoaXMucXVlcnksIGFyZ3VtZW50cykpO1xyXG59O1xyXG5cclxuSW5saW5lQ291bnRSZXN1bHQucHJvdG90eXBlLnNlbGVjdCA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHRoaXMuX3ZlcmlmeVF1ZXJ5KCk7XHJcbiAgICByZXR1cm4gbmV3IElubGluZUNvdW50UmVzdWx0KHRoaXMub3JpZ2luYWxRdWVyeSwgdGhpcy5xdWVyeS5zZWxlY3QuYXBwbHkodGhpcy5xdWVyeSwgYXJndW1lbnRzKSk7XHJcbn07XHJcblxyXG5JbmxpbmVDb3VudFJlc3VsdC5wcm90b3R5cGUud2hlcmUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aGlzLl92ZXJpZnlRdWVyeSgpO1xyXG4gICAgcmV0dXJuIG5ldyBJbmxpbmVDb3VudFJlc3VsdCh0aGlzLm9yaWdpbmFsUXVlcnkud2hlcmUuYXBwbHkodGhpcy5vcmlnaW5hbFF1ZXJ5LCBhcmd1bWVudHMpLCB0aGlzLnF1ZXJ5LndoZXJlLmFwcGx5KHRoaXMucXVlcnksIGFyZ3VtZW50cykpO1xyXG59O1xyXG5cclxuSW5saW5lQ291bnRSZXN1bHQucHJvdG90eXBlLmVxdWFscyA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHRoaXMuX3ZlcmlmeVF1ZXJ5KCk7XHJcbiAgICByZXR1cm4gbmV3IElubGluZUNvdW50UmVzdWx0KHRoaXMub3JpZ2luYWxRdWVyeS5lcXVhbHMuYXBwbHkodGhpcy5vcmlnaW5hbFF1ZXJ5LCBhcmd1bWVudHMpLCB0aGlzLnF1ZXJ5LmVxdWFscy5hcHBseSh0aGlzLnF1ZXJ5LCBhcmd1bWVudHMpKTtcclxufTtcclxuXHJcbklubGluZUNvdW50UmVzdWx0LnByb3RvdHlwZS5pbiA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHRoaXMuX3ZlcmlmeVF1ZXJ5KCk7XHJcbiAgICByZXR1cm4gbmV3IElubGluZUNvdW50UmVzdWx0KHRoaXMub3JpZ2luYWxRdWVyeS5pbi5hcHBseSh0aGlzLm9yaWdpbmFsUXVlcnksIGFyZ3VtZW50cyksIHRoaXMucXVlcnkuaW4uYXBwbHkodGhpcy5xdWVyeSwgYXJndW1lbnRzKSk7XHJcbn07XHJcblxyXG5JbmxpbmVDb3VudFJlc3VsdC5wcm90b3R5cGUuYW5kID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdGhpcy5fdmVyaWZ5UXVlcnkoKTtcclxuICAgIHJldHVybiBuZXcgSW5saW5lQ291bnRSZXN1bHQodGhpcy5vcmlnaW5hbFF1ZXJ5LmFuZC5hcHBseSh0aGlzLm9yaWdpbmFsUXVlcnksIGFyZ3VtZW50cyksIHRoaXMucXVlcnkuYW5kLmFwcGx5KHRoaXMucXVlcnksIGFyZ3VtZW50cykpO1xyXG59O1xyXG5cclxuSW5saW5lQ291bnRSZXN1bHQucHJvdG90eXBlLm9yID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdGhpcy5fdmVyaWZ5UXVlcnkoKTtcclxuICAgIHJldHVybiBuZXcgSW5saW5lQ291bnRSZXN1bHQodGhpcy5vcmlnaW5hbFF1ZXJ5Lm9yLmFwcGx5KHRoaXMub3JpZ2luYWxRdWVyeSwgYXJndW1lbnRzKSwgdGhpcy5xdWVyeS5vci5hcHBseSh0aGlzLnF1ZXJ5LCBhcmd1bWVudHMpKTtcclxufTtcclxuXHJcbklubGluZUNvdW50UmVzdWx0LnByb3RvdHlwZS5leGVjID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XHJcbiAgICBsZXQgc2VsZiA9IHRoaXM7XHJcbiAgICBhc3luYyhmdW5jdGlvbiooKSB7XHJcbiAgICAgICAgbGV0IHF1ZXJ5UmVzdWx0O1xyXG4gICAgICAgIGxldCBjb3VudDtcclxuICAgICAgICBpZiAoc2VsZi5pc0FnZ3JlZ2F0ZSkge1xyXG4gICAgICAgICAgICBxdWVyeVJlc3VsdCA9IHlpZWxkIHNlbGYucXVlcnkuZXhlYygpO1xyXG4gICAgICAgICAgICBsZXQgY3IgPSB5aWVsZCBzZWxmLm9yaWdpbmFsUXVlcnkuZ3JvdXAoeyBfaWQ6IG51bGwsIGNvdW50OiB7ICRzdW06IDEgfSB9KS5leGVjKCk7XHJcbiAgICAgICAgICAgIGlmIChfLmlzQXJyYXkoY3IpKSB7XHJcbiAgICAgICAgICAgICAgICBjciA9IGNyWzBdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvdW50ID0gY3IuY291bnQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBxdWVyeVJlc3VsdCA9IHlpZWxkIHNlbGYucXVlcnkuZXhlYygpO1xyXG4gICAgICAgICAgICBjb3VudCA9IHlpZWxkIHNlbGYub3JpZ2luYWxRdWVyeS5jb3VudCgpLmV4ZWMoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgZGF0YTogcXVlcnlSZXN1bHQsXHJcbiAgICAgICAgICAgIGNvdW50OiBjb3VudFxyXG4gICAgICAgIH07XHJcbiAgICB9KSgpLm5vZGVpZnkoY2FsbGJhY2spO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBJbmxpbmVDb3VudFJlc3VsdDsiXX0=
