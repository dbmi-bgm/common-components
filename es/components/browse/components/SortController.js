'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SortController = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _url = _interopRequireDefault(require("url"));

var _querystring = _interopRequireDefault(require("querystring"));

var _memoizeOne = _interopRequireDefault(require("memoize-one"));

var _underscore = _interopRequireDefault(require("underscore"));

var _navigate2 = require("./../../util/navigate");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function (obj) { return typeof obj; }; } else { _typeof = function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function (o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function (o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var SortController = function (_React$PureComponent) {
  _inherits(SortController, _React$PureComponent);

  function SortController(props) {
    var _this;

    _classCallCheck(this, SortController);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(SortController).call(this, props));
    _this.sortBy = _this.sortBy.bind(_assertThisInitialized(_this));
    _this.state = {
      'changingPage': false
    };
    return _this;
  }

  _createClass(SortController, [{
    key: "sortBy",
    value: function sortBy(key, reverse) {
      var _this2 = this;

      var _this$props = this.props,
          propNavigate = _this$props.navigate,
          href = _this$props.href;
      if (typeof propNavigate !== 'function') throw new Error("No navigate function.");
      if (typeof href !== 'string') throw new Error("Browse doesn't have props.href.");

      var _url$parse = _url.default.parse(href, true),
          query = _url$parse.query,
          urlParts = _objectWithoutProperties(_url$parse, ["query"]);

      if (key) {
        query.sort = (reverse ? '-' : '') + key;
      } else {
        delete query.sort;
      }

      urlParts.search = '?' + _querystring.default.stringify(query);

      var newHref = _url.default.format(urlParts);

      this.setState({
        'changingPage': true
      }, function () {
        propNavigate(newHref, {
          'replace': true
        }, function () {
          _this2.setState({
            'changingPage': false
          });
        });
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
          children = _this$props2.children,
          context = _this$props2.context,
          href = _this$props2.href;

      var _SortController$getSo = SortController.getSortColumnAndReverseFromContext(context),
          sortColumn = _SortController$getSo.sortColumn,
          sortReverse = _SortController$getSo.sortReverse;

      var _SortController$getPa = SortController.getPageAndLimitFromURL(href),
          page = _SortController$getPa.page,
          limit = _SortController$getPa.limit;

      var propsToPass = _underscore.default.extend(_underscore.default.omit(this.props, 'children'), {
        'sortBy': this.sortBy
      }, {
        sortColumn: sortColumn,
        sortReverse: sortReverse,
        page: page,
        limit: limit
      });

      return _react.default.createElement("div", null, _react.default.Children.map(children, function (c) {
        return _react.default.cloneElement(c, propsToPass);
      }));
    }
  }]);

  return SortController;
}(_react.default.PureComponent);

exports.SortController = SortController;

_defineProperty(SortController, "propTypes", {
  'href': _propTypes.default.string.isRequired,
  'context': _propTypes.default.object.isRequired,
  'navigate': _propTypes.default.func,
  'children': _propTypes.default.node.isRequired
});

_defineProperty(SortController, "defaultProps", {
  'navigate': function navigate(href, options, callback) {
    console.info('Called SortController.props.navigate with:', href, options, callback);
    if (typeof _navigate2.navigate === 'function') return _navigate2.navigate.apply(_navigate2.navigate, arguments);
  }
});

_defineProperty(SortController, "getPageAndLimitFromURL", (0, _memoizeOne.default)(function (href) {
  var _url$parse2 = _url.default.parse(href, true),
      query = _url$parse2.query;

  var limit = parseInt(query.limit || 25);
  var from = parseInt(query.from || 0);
  if (isNaN(limit)) limit = 25;
  if (isNaN(from)) from = 0;
  return {
    'page': from / limit + 1,
    'limit': limit
  };
}));

_defineProperty(SortController, "getSortColumnAndReverseFromContext", (0, _memoizeOne.default)(function (context) {
  var defaults = {
    'sortColumn': null,
    'sortReverse': false
  };
  if (!context || !context.sort) return defaults;

  var sortKey = _underscore.default.keys(context.sort);

  if (sortKey.length > 0) {
    sortKey = sortKey[0];
  } else {
    return defaults;
  }

  var reverse = context.sort[sortKey].order === 'desc';
  return {
    'sortColumn': sortKey,
    'sortReverse': reverse
  };
}));