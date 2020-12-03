'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getRangeValuesFromFiltersByField = getRangeValuesFromFiltersByField;
exports.RangeTerm = exports.RangeFacet = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _underscore = _interopRequireDefault(require("underscore"));

var _memoizeOne = _interopRequireDefault(require("memoize-one"));

var _Collapse = _interopRequireDefault(require("react-bootstrap/esm/Collapse"));

var _DropdownButton = _interopRequireDefault(require("react-bootstrap/esm/DropdownButton"));

var _DropdownItem = _interopRequireDefault(require("react-bootstrap/esm/DropdownItem"));

var _Fade = _interopRequireDefault(require("react-bootstrap/esm/Fade"));

var _Popover = _interopRequireDefault(require("react-bootstrap/esm/Popover"));

var _OverlayTrigger = _interopRequireDefault(require("react-bootstrap/esm/OverlayTrigger"));

var _LocalizedTime = require("./../../../ui/LocalizedTime");

var _valueTransforms = require("./../../../util/value-transforms");

var _schemaTransforms = require("./../../../util/schema-transforms");

var _patchedConsole = require("./../../../util/patched-console");

var _ExtendedDescriptionPopoverIcon = require("./ExtendedDescriptionPopoverIcon");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function (obj) { return typeof obj; }; } else { _typeof = function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function (o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function () { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function (o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function getRangeValuesFromFiltersByField() {
  var facets = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var filters = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var facetsByFilterField = {};
  var valuesByField = {};
  facets.forEach(function (f) {
    if (f.aggregation_type !== "stats" && f.aggregation_type !== "range") {
      return; // Skip
    }

    facetsByFilterField[f.field + ".to"] = f;
    facetsByFilterField[f.field + ".from"] = f;
  });
  filters.forEach(function (f) {
    var filterField = f.field,
        strValue = f.term; // filterField would have .to and .from appended.

    var facet = facetsByFilterField[filterField];
    if (!facet) return; // Skip, not range facet.

    var facetField = facet.field,
        _facet$field_type = facet.field_type,
        field_type = _facet$field_type === void 0 ? "number" : _facet$field_type;
    valuesByField[facetField] = valuesByField[facetField] || {};
    var value = // Convert to float if numerical field type or leave as string if datetime, etc.
    field_type === "integer" ? parseInt(strValue) : field_type === "number" ? parseFloat(strValue) : strValue;

    if (facetField + ".to" === filterField) {
      valuesByField[facetField].toVal = value;
    } else if (facetField + ".from" === filterField) {
      valuesByField[facetField].fromVal = value;
    } else {
      throw new Error("Unexpected range facet filter value or type");
    }
  });
  return valuesByField;
}

var RangeFacet = /*#__PURE__*/function (_React$PureComponent) {
  _inherits(RangeFacet, _React$PureComponent);

  var _super = _createSuper(RangeFacet);

  _createClass(RangeFacet, null, [{
    key: "parseAndValidate",
    value: function parseAndValidate(facet, value) {
      var _facet$field_type2 = facet.field_type,
          field_type = _facet$field_type2 === void 0 ? "integer" : _facet$field_type2,
          _facet$number_step = facet.number_step,
          number_step = _facet$number_step === void 0 ? "any" : _facet$number_step;

      if (value === "" || value === null) {
        return null;
      }

      if (field_type === "date") {
        // Todo check if valid date string and set state.valid === false, upon which
        // to deny ability to apply.
        return value.toString();
      }

      var numVal = field_type === "integer" ? parseInt(value) : parseFloat(value);

      if (isNaN(numVal)) {
        throw new Error("Is not a number - " + numVal);
      }

      if (number_step === "any") {
        return numVal;
      }

      if (typeof number_step !== "number" || isNaN(number_step) || number_step <= 0) {
        _patchedConsole.patchedConsoleInstance.error("Expected number_step to be a positive number");

        return numVal;
      } // Remove trailing decimals (if any) (round down)
      // Be careful re: float operations (imprecise) and favor integers


      if (number_step >= 1) {
        numVal = Math.floor(numVal / number_step) * number_step;
      } else {
        var diviser = Math.round(1 / number_step);
        numVal = Math.floor(numVal * diviser) / diviser;
      }

      return numVal;
    }
  }, {
    key: "validIncrements",
    value: function validIncrements(facet) {
      var min = facet.min,
          max = facet.max,
          increments = facet.increments;

      function ensureWithinRange(increment) {
        if (typeof min === "number" && increment < min) return false;
        if (typeof max === "number" && increment > max) return false;
        return true;
      }

      if (Array.isArray(increments)) {
        var validIncrements = increments.filter(ensureWithinRange);
        return {
          "fromIncrements": validIncrements,
          "toIncrements": validIncrements
        };
      }

      var _ref = increments || {},
          _ref$from = _ref.from,
          fromIncrementsOrig = _ref$from === void 0 ? [] : _ref$from,
          _ref$to = _ref.to,
          toIncrementsOrig = _ref$to === void 0 ? [] : _ref$to;

      return {
        "fromIncrements": fromIncrementsOrig.filter(ensureWithinRange),
        "toIncrements": toIncrementsOrig.filter(ensureWithinRange)
      };
    }
  }, {
    key: "initialStateValues",
    value: function initialStateValues(props) {
      var fromVal = props.fromVal,
          toVal = props.toVal,
          _props$facet$field_ty = props.facet.field_type,
          field_type = _props$facet$field_ty === void 0 ? "number" : _props$facet$field_ty;
      var state = {
        fromVal: fromVal,
        toVal: toVal
      };

      if (field_type === "date") {
        // Convert to strings so e.g. "2018" doesn't get interpreted as unix timestamp.
        state.fromVal = fromVal && fromVal.toString() || null;
        state.toVal = toVal && toVal.toString() || null;
      }

      return state;
    }
  }]);

  function RangeFacet(props) {
    var _this;

    _classCallCheck(this, RangeFacet);

    _this = _super.call(this, props);
    _this.handleOpenToggleClick = _this.handleOpenToggleClick.bind(_assertThisInitialized(_this));
    _this.setFrom = _this.setFrom.bind(_assertThisInitialized(_this));
    _this.setTo = _this.setTo.bind(_assertThisInitialized(_this));
    _this.setToAndFrom = _this.setToAndFrom.bind(_assertThisInitialized(_this));
    _this.selectRange = _this.selectRange.bind(_assertThisInitialized(_this));
    _this.resetFrom = _this.resetFrom.bind(_assertThisInitialized(_this));
    _this.resetTo = _this.resetTo.bind(_assertThisInitialized(_this));
    _this.resetToAndFrom = _this.resetToAndFrom.bind(_assertThisInitialized(_this)); // tentative - will likely be replaced with a prop

    _this.performUpdateFrom = _this.performUpdateFrom.bind(_assertThisInitialized(_this));
    _this.performUpdateTo = _this.performUpdateTo.bind(_assertThisInitialized(_this));
    _this.performUpdateToAndFrom = _this.performUpdateToAndFrom.bind(_assertThisInitialized(_this));
    _this.termTitle = _this.termTitle.bind(_assertThisInitialized(_this));
    _this.memoized = {
      fieldSchema: (0, _memoizeOne["default"])(_schemaTransforms.getSchemaProperty),
      validIncrements: (0, _memoizeOne["default"])(RangeFacet.validIncrements)
    };
    _this.state = _objectSpread(_objectSpread({}, RangeFacet.initialStateValues(props)), {}, {
      "facetClosing": false
    });
    return _this;
  }

  _createClass(RangeFacet, [{
    key: "setFrom",
    value: function setFrom(value, callback) {
      var facet = this.props.facet;

      _patchedConsole.patchedConsoleInstance.log("setFrom called with", value);

      try {
        var fromVal = RangeFacet.parseAndValidate(facet, value);
        this.setState({
          fromVal: fromVal
        }, callback);
      } catch (e) {
        _patchedConsole.patchedConsoleInstance.error("Couldn't set value", e);
      }
    }
  }, {
    key: "setTo",
    value: function setTo(value, callback) {
      var facet = this.props.facet;

      _patchedConsole.patchedConsoleInstance.log("setTo called with", value);

      try {
        var toVal = RangeFacet.parseAndValidate(facet, value);
        this.setState({
          toVal: toVal
        }, callback);
      } catch (e) {
        _patchedConsole.patchedConsoleInstance.error("Couldn't set value", e);
      }
    }
  }, {
    key: "setToAndFrom",
    value: function setToAndFrom(toValue, fromValue, callback) {
      var facet = this.props.facet;

      try {
        var fromVal = RangeFacet.parseAndValidate(facet, fromValue);
        var toVal = RangeFacet.parseAndValidate(facet, toValue);
        this.setState({
          toVal: toVal,
          fromVal: fromVal
        }, callback);
      } catch (e) {
        _patchedConsole.patchedConsoleInstance.error("Couldn't set value", e);
      }
    }
  }, {
    key: "performUpdateFrom",
    value: function performUpdateFrom() {
      var _this$props = this.props,
          onFilter = _this$props.onFilter,
          facet = _this$props.facet;
      var fromVal = this.state.fromVal;

      _patchedConsole.patchedConsoleInstance.log("performUpdateFrom", fromVal);

      onFilter(_objectSpread(_objectSpread({}, facet), {}, {
        field: facet.field + ".from"
      }), {
        key: fromVal
      });
    }
  }, {
    key: "performUpdateTo",
    value: function performUpdateTo() {
      var _this$props2 = this.props,
          onFilter = _this$props2.onFilter,
          facet = _this$props2.facet;
      var toVal = this.state.toVal;

      _patchedConsole.patchedConsoleInstance.log("performUpdateTo", toVal);

      onFilter(_objectSpread(_objectSpread({}, facet), {}, {
        field: facet.field + ".to"
      }), {
        key: toVal
      });
    }
  }, {
    key: "performUpdateToAndFrom",
    value: function performUpdateToAndFrom() {
      var _this$props3 = this.props,
          onFilterMultiple = _this$props3.onFilterMultiple,
          facet = _this$props3.facet;
      var _this$state = this.state,
          toVal = _this$state.toVal,
          fromVal = _this$state.fromVal;

      _patchedConsole.patchedConsoleInstance.log("performUpdate", toVal, fromVal);

      if (toVal === null) {
        onFilterMultiple([{
          facet: _objectSpread(_objectSpread({}, facet), {}, {
            field: facet.field + ".from"
          }),
          term: {
            key: fromVal
          }
        }]);
      } else {
        onFilterMultiple([{
          facet: _objectSpread(_objectSpread({}, facet), {}, {
            field: facet.field + ".from"
          }),
          term: {
            key: fromVal
          }
        }, {
          facet: _objectSpread(_objectSpread({}, facet), {}, {
            field: facet.field + ".to"
          }),
          term: {
            key: toVal
          }
        }]);
      }
    }
  }, {
    key: "resetFrom",
    value: function resetFrom(e) {
      e.stopPropagation();
      this.setFrom(null, this.performUpdateFrom);
    }
  }, {
    key: "resetTo",
    value: function resetTo(e) {
      e.stopPropagation();
      this.setTo(null, this.performUpdateTo);
    }
  }, {
    key: "resetToAndFrom",
    value: function resetToAndFrom(e) {
      e.stopPropagation();
      this.setToAndFrom(null, null, this.performUpdateToAndFrom);
    }
  }, {
    key: "selectRange",
    value: function selectRange(to, from, e) {
      _patchedConsole.patchedConsoleInstance.log("selectRange", to, from);

      e.stopPropagation();
      this.setToAndFrom(to, from, this.performUpdateToAndFrom);
    }
  }, {
    key: "handleOpenToggleClick",
    value: function handleOpenToggleClick(e) {
      e.preventDefault();
      var _this$props4 = this.props,
          onToggleOpen = _this$props4.onToggleOpen,
          field = _this$props4.facet.field,
          _this$props4$facetOpe = _this$props4.facetOpen,
          facetOpen = _this$props4$facetOpe === void 0 ? false : _this$props4$facetOpe;
      onToggleOpen(field, !facetOpen);
    }
    /**
     * If no other transformations specified, and have a large number, then
     * condense it using `toExponential`.
     */

  }, {
    key: "termTitle",
    value: function termTitle(fieldName, value) {
      var allowJSX = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
      var toPrecision = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
      var _this$props5 = this.props,
          _this$props5$facet$fi = _this$props5.facet.field_type,
          field_type = _this$props5$facet$fi === void 0 ? "number" : _this$props5$facet$fi,
          termTransformFxn = _this$props5.termTransformFxn;

      if (field_type === "date") {
        return /*#__PURE__*/_react["default"].createElement(_LocalizedTime.LocalizedTime, {
          timestamp: value,
          localize: false
        });
      }

      if (field_type !== "number" && field_type !== "integer") {
        throw new Error("Expect field_type to be 'number' or 'date'.");
      }

      var transformedValue = termTransformFxn(fieldName, value, allowJSX);

      if (typeof transformedValue !== "number") {
        return transformedValue;
      }

      var absVal = Math.abs(transformedValue);

      if (absVal.toString().length <= 6) {
        // Else is too long and will go thru toPrecision or toExponential.
        if (absVal >= 1000) {
          return (0, _valueTransforms.decorateNumberWithCommas)(transformedValue);
        } else {
          return transformedValue;
        }
      }

      if (toPrecision) {
        return transformedValue.toPrecision(3);
      }

      return transformedValue.toExponential(3);
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$props6 = this.props,
          schemas = _this$props6.schemas,
          itemTypeForSchemas = _this$props6.itemTypeForSchemas,
          facet = _this$props6.facet,
          propTitle = _this$props6.title,
          isStatic = _this$props6.isStatic,
          savedFromVal = _this$props6.fromVal,
          savedToVal = _this$props6.toVal,
          facetOpen = _this$props6.facetOpen,
          openPopover = _this$props6.openPopover,
          setOpenPopover = _this$props6.setOpenPopover;
      var aggregation_type = facet.aggregation_type,
          _facet$field_type3 = facet.field_type,
          field_type = _facet$field_type3 === void 0 ? "number" : _facet$field_type3,
          field = facet.field,
          _facet$ranges = facet.ranges,
          ranges = _facet$ranges === void 0 ? [] : _facet$ranges,
          _facet$min = facet.min,
          minValue = _facet$min === void 0 ? null : _facet$min,
          _facet$min_as_string = facet.min_as_string,
          minDateTime = _facet$min_as_string === void 0 ? null : _facet$min_as_string,
          _facet$max = facet.max,
          maxValue = _facet$max === void 0 ? null : _facet$max,
          _facet$max_as_string = facet.max_as_string,
          maxDateTime = _facet$max_as_string === void 0 ? null : _facet$max_as_string,
          _facet$title = facet.title,
          facetTitle = _facet$title === void 0 ? null : _facet$title,
          _facet$description = facet.description,
          facetSchemaDescription = _facet$description === void 0 ? null : _facet$description;
      var fieldSchema = this.memoized.fieldSchema(field, schemas, itemTypeForSchemas);
      var fieldSchemaDescription = (fieldSchema || {}).description; // fieldSchema not present if no schemas loaded yet.

      var _this$state2 = this.state,
          fromVal = _this$state2.fromVal,
          toVal = _this$state2.toVal;

      var _this$memoized$validI = this.memoized.validIncrements(facet),
          fromIncrements = _this$memoized$validI.fromIncrements,
          toIncrements = _this$memoized$validI.toIncrements;

      var fromTitle, toTitle;

      _patchedConsole.patchedConsoleInstance.log(facet);

      if (field_type === "number" || field_type === "integer") {
        if (aggregation_type === "stats") {
          fromTitle = typeof fromVal === 'number' ? this.termTitle(facet.field, fromVal) : typeof minValue === "number" ? this.termTitle(facet.field, minValue) : /*#__PURE__*/_react["default"].createElement("em", null, "-Infinite");
          toTitle = typeof toVal === 'number' ? this.termTitle(facet.field, toVal) : typeof maxValue === "number" ? this.termTitle(facet.field, maxValue) : /*#__PURE__*/_react["default"].createElement("em", null, "Infinite");
        } else if (aggregation_type === "range") {
          _patchedConsole.patchedConsoleInstance.log("fromVal, toVal", fromVal, _typeof(fromVal), toVal, _typeof(toVal));

          var _ranges$ = ranges[0],
              firstRange = _ranges$ === void 0 ? null : _ranges$;
          var lastRange = ranges[ranges.length - 1] || {};
          fromTitle = typeof fromVal === 'number' ? this.termTitle(facet.field, fromVal) : typeof firstRange.from === "number" ? this.termTitle(facet.field, firstRange.from) : /*#__PURE__*/_react["default"].createElement("em", null, "-Infinite");
          toTitle = typeof toVal === 'number' ? this.termTitle(facet.field, toVal) : typeof lastRange.to === "number" ? this.termTitle(facet.field, lastRange.to) : /*#__PURE__*/_react["default"].createElement("em", null, "Infinite");
        }

        _patchedConsole.patchedConsoleInstance.log("field", field, "typeof minValue", minValue, _typeof(minValue));
      } else if (field_type === "date") {
        fromTitle = this.termTitle(facet.field, fromVal && typeof fromVal === 'string' ? fromVal : minDateTime || 0);
        toTitle = this.termTitle(facet.field, toVal && typeof toVal === 'string' ? toVal : maxDateTime) || /*#__PURE__*/_react["default"].createElement("em", null, "None");

        _patchedConsole.patchedConsoleInstance.log("DATE VALS", fromVal, facet.field, minDateTime, 0, fromTitle, toTitle);
      } else {
        throw new Error("Expected number|integer or date field_type. " + field + ' ' + field_type);
      }

      var isOpen = facetOpen || savedFromVal !== null || savedToVal !== null; // const isFromValUnapplied = (fromVal !== savedFromVal);
      // const isToValUnapplied = (toVal !== savedToVal);

      var fromVariant = savedFromVal === null ? "outline-dark" : "primary";
      var toVariant = savedToVal === null ? "outline-dark" : "primary";
      return /*#__PURE__*/_react["default"].createElement("div", {
        className: "facet range-facet" + (isOpen ? ' open' : ' closed'),
        "data-field": facet.field
      }, /*#__PURE__*/_react["default"].createElement("h5", {
        className: "facet-title",
        onClick: this.handleOpenToggleClick
      }, /*#__PURE__*/_react["default"].createElement("span", {
        className: "expand-toggle col-auto px-0"
      }, /*#__PURE__*/_react["default"].createElement("i", {
        className: "icon icon-fw icon-" + (savedFromVal !== null || savedToVal !== null ? "dot-circle far" : isOpen ? "minus fas" : "plus fas")
      })), /*#__PURE__*/_react["default"].createElement("div", {
        className: "col px-0 line-height-1"
      }, /*#__PURE__*/_react["default"].createElement("span", {
        "data-tip": facetSchemaDescription || fieldSchemaDescription,
        "data-place": "right"
      }, propTitle || facetTitle || field), /*#__PURE__*/_react["default"].createElement(_ExtendedDescriptionPopoverIcon.ExtendedDescriptionPopoverIcon, {
        fieldSchema: fieldSchema,
        facet: facet,
        openPopover: openPopover,
        setOpenPopover: setOpenPopover
      })), /*#__PURE__*/_react["default"].createElement(_Fade["default"], {
        "in": !isOpen
      }, /*#__PURE__*/_react["default"].createElement("span", {
        className: "closed-terms-count col-auto px-0" + (savedFromVal !== null || savedToVal !== null ? " some-selected" : "")
      }, isStatic ? /*#__PURE__*/_react["default"].createElement("i", {
        className: "icon fas icon-" + (savedFromVal !== null || savedToVal !== null ? "circle" : "minus-circle"),
        style: {
          opacity: savedFromVal !== null || savedToVal !== null ? 0.75 : 0.25
        }
      }) : /*#__PURE__*/_react["default"].createElement("i", {
        className: "icon icon-fw icon-greater-than-equal fas"
      })))), /*#__PURE__*/_react["default"].createElement(_Collapse["default"], {
        "in": isOpen
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: "inner-panel"
      }, /*#__PURE__*/_react["default"].createElement(RangeClear, _extends({
        fromTitle: fromTitle,
        toTitle: toTitle,
        savedFromVal: savedFromVal,
        savedToVal: savedToVal,
        facet: facet
      }, {
        resetAll: this.resetToAndFrom,
        termTransformFxn: this.termTitle,
        resetFrom: fromVal !== null ? this.resetFrom : null,
        resetTo: toVal !== null ? this.resetTo : null
      })), /*#__PURE__*/_react["default"].createElement("div", {
        className: "range-drop-group"
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: "range-drop"
      }, /*#__PURE__*/_react["default"].createElement("label", {
        className: "mb-0 small"
      }, "From:"), /*#__PURE__*/_react["default"].createElement(RangeDropdown, {
        title: fromTitle,
        value: fromVal,
        savedValue: savedFromVal,
        max: toVal || null,
        increments: fromIncrements,
        variant: fromVariant + " btn-xs",
        onSelect: this.setFrom,
        update: this.performUpdateFrom,
        termTransformFxn: this.termTitle,
        facet: facet,
        id: "from_" + field,
        reset: fromVal !== null ? this.resetFrom : null
      })), /*#__PURE__*/_react["default"].createElement("div", {
        className: "range-drop ml-05"
      }, /*#__PURE__*/_react["default"].createElement("label", {
        className: "mb-0 small"
      }, "To:"), /*#__PURE__*/_react["default"].createElement(RangeDropdown, {
        title: toTitle,
        value: toVal,
        savedValue: savedToVal,
        min: fromVal || null,
        increments: toIncrements,
        termTransformFxn: this.termTitle,
        variant: toVariant + " btn-xs",
        onSelect: this.setTo,
        update: this.performUpdateTo,
        facet: facet,
        id: "to_" + field,
        reset: toVal !== null ? this.resetTo : null
      }))), ranges.map(function (range) {
        return /*#__PURE__*/_react["default"].createElement(RangeTerm, _extends({
          key: "".concat(range.to, "-").concat(range.from),
          onClick: _this2.selectRange
        }, {
          range: range,
          facet: facet
        }));
      }))));
    }
  }]);

  return RangeFacet;
}(_react["default"].PureComponent);
/**
 * Used to render a term with range functionality in FacetList. Basically same as FacetTermsList > Term... maybe merge later
 */


exports.RangeFacet = RangeFacet;

var RangeTerm = /*#__PURE__*/function (_React$PureComponent2) {
  _inherits(RangeTerm, _React$PureComponent2);

  var _super2 = _createSuper(RangeTerm);

  function RangeTerm(props) {
    var _this3;

    _classCallCheck(this, RangeTerm);

    _this3 = _super2.call(this, props);
    _this3.handleClick = _underscore["default"].debounce(_this3.handleClick.bind(_assertThisInitialized(_this3)), 500, true);
    _this3.state = {
      'filtering': false
    };
    return _this3;
  }

  _createClass(RangeTerm, [{
    key: "handleClick",
    value: function handleClick(e) {
      var _this4 = this;

      //expecting this onClick to be onFilterMultiple, basically
      var _this$props7 = this.props,
          range = _this$props7.range,
          onClick = _this$props7.onClick;
      var _range$to = range.to,
          to = _range$to === void 0 ? null : _range$to,
          _range$from = range.from,
          from = _range$from === void 0 ? null : _range$from;

      _patchedConsole.patchedConsoleInstance.log("to and from", to, from);

      e.preventDefault();
      this.setState({
        'filtering': true
      }, function () {
        onClick(to, from, e, function () {
          return _this4.setState({
            'filtering': false
          });
        });
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props8 = this.props,
          range = _this$props8.range,
          facet = _this$props8.facet,
          status = _this$props8.status,
          termTransformFxn = _this$props8.termTransformFxn;
      var doc_count = range.doc_count,
          from = range.from,
          to = range.to,
          label = range.label;
      var filtering = this.state.filtering;
      var icon = null;
      var title = (typeof from !== 'undefined' ? from : '< ') + (typeof from !== 'undefined' && typeof to !== 'undefined' ? ' - ' : '') + (typeof to !== 'undefined' ? to : '+ ');

      if (filtering) {
        icon = /*#__PURE__*/_react["default"].createElement("i", {
          className: "icon fas icon-circle-notch icon-spin icon-fw"
        });
      } else if (status === 'selected' || status === 'omitted') {
        icon = /*#__PURE__*/_react["default"].createElement("i", {
          className: "icon icon-minus-circle icon-fw fas"
        });
      } else {
        icon = /*#__PURE__*/_react["default"].createElement("i", {
          className: "icon icon-circle icon-fw unselected far"
        });
      }

      if (!title || title === 'null' || title === 'undefined') {
        title = 'None';
      }

      var statusClassName = status !== 'none' ? status === 'selected' ? " selected" : " omitted" : '';
      return /*#__PURE__*/_react["default"].createElement("li", {
        className: "facet-list-element " + statusClassName,
        key: label,
        "data-key": label
      }, /*#__PURE__*/_react["default"].createElement("a", {
        className: "term",
        "data-selected": status !== 'none',
        href: "#",
        onClick: this.handleClick,
        "data-term": label
      }, /*#__PURE__*/_react["default"].createElement("span", {
        className: "facet-selector"
      }, icon), /*#__PURE__*/_react["default"].createElement("span", {
        className: "facet-item",
        "data-tip": title.length > 30 ? title : null
      }, title, " ", label ? "(".concat(label, ")") : null), /*#__PURE__*/_react["default"].createElement("span", {
        className: "facet-count"
      }, doc_count || 0)));
    }
  }]);

  return RangeTerm;
}(_react["default"].PureComponent);

exports.RangeTerm = RangeTerm;
RangeTerm.propTypes = {
  'facet': _propTypes["default"].shape({
    'field': _propTypes["default"].string.isRequired
  }).isRequired,
  'range': _propTypes["default"].shape({
    'from': _propTypes["default"].number,
    'to': _propTypes["default"].number,
    'label': _propTypes["default"].string,
    'doc_count': _propTypes["default"].number
  }).isRequired,
  // 'getTermStatus'     : PropTypes.func.isRequired,
  'onClick': _propTypes["default"].func.isRequired
};

var RangeClear = /*#__PURE__*/function (_React$PureComponent3) {
  _inherits(RangeClear, _React$PureComponent3);

  var _super3 = _createSuper(RangeClear);

  function RangeClear() {
    _classCallCheck(this, RangeClear);

    return _super3.apply(this, arguments);
  }

  _createClass(RangeClear, [{
    key: "render",
    value: function render() {
      var _this$props9 = this.props,
          savedFromVal = _this$props9.savedFromVal,
          savedToVal = _this$props9.savedToVal,
          resetTo = _this$props9.resetTo,
          resetFrom = _this$props9.resetFrom,
          resetAll = _this$props9.resetAll,
          facet = _this$props9.facet,
          termTransformFxn = _this$props9.termTransformFxn;
      var facetField = facet.field,
          facetTitle = facet.title;
      var savedFromTitle = termTransformFxn(facetField, savedFromVal, true);
      var savedToTitle = termTransformFxn(facetField, savedToVal, true);

      if (savedFromVal === null && savedToVal === null) {
        return null;
      } else if (savedFromVal !== null && savedToVal !== null) {
        // To and From present
        var invalidRange = savedToVal < savedFromVal;
        var btnVariant = invalidRange ? "btn-warning" : "btn-primary";
        return /*#__PURE__*/_react["default"].createElement("button", {
          className: "range-clear btn btn-block btn-xs mt-05 mb-05 " + btnVariant,
          type: "button",
          onClick: resetAll,
          "data-html": invalidRange,
          "data-tip": invalidRange ? '<i className="icon fa-exclamation-circle fas"></i>This range is invalid. Adjust range boundaries for better results.' : null
        }, /*#__PURE__*/_react["default"].createElement("div", {
          className: "d-flex"
        }, /*#__PURE__*/_react["default"].createElement("div", {
          className: "clear-icon-container col-auto clickable d-flex align-items-center",
          "data-tip": "Click to unset"
        }, /*#__PURE__*/_react["default"].createElement("i", {
          className: "icon icon-fw fas icon-minus-circle"
        })), /*#__PURE__*/_react["default"].createElement("div", {
          className: "col px-0"
        }, savedFromTitle, " < ", facetTitle, " < ", savedToTitle)));
      } else {
        // Only To or From present
        return /*#__PURE__*/_react["default"].createElement("button", {
          className: "range-clear btn btn-primary btn-block btn-xs mt-05 mb-05",
          type: "button",
          onClick: resetTo === null ? resetFrom : resetTo
        }, /*#__PURE__*/_react["default"].createElement("div", {
          className: "d-flex"
        }, /*#__PURE__*/_react["default"].createElement("div", {
          className: "clear-icon-container col-auto clickable d-flex align-items-center",
          "data-tip": "Click to unset"
        }, /*#__PURE__*/_react["default"].createElement("i", {
          className: "icon icon-fw fas icon-minus-circle"
        })), /*#__PURE__*/_react["default"].createElement("div", {
          className: "col px-0"
        }, savedToVal !== null ? "".concat(facetTitle, " < ").concat(savedToTitle) : null, savedFromVal !== null ? "".concat(savedFromTitle, " < ").concat(facetTitle) : null)));
      }
    }
  }]);

  return RangeClear;
}(_react["default"].PureComponent);

var RangeDropdown = /*#__PURE__*/function (_React$PureComponent4) {
  _inherits(RangeDropdown, _React$PureComponent4);

  var _super4 = _createSuper(RangeDropdown);

  function RangeDropdown(props) {
    var _this5;

    _classCallCheck(this, RangeDropdown);

    _this5 = _super4.call(this, props);
    _this5.state = {
      showMenu: false,
      toggling: false
    };
    _this5.onTextInputChange = _this5.onTextInputChange.bind(_assertThisInitialized(_this5));
    _this5.onDropdownSelect = _this5.onDropdownSelect.bind(_assertThisInitialized(_this5));
    _this5.onTextInputFormSubmit = _this5.onTextInputFormSubmit.bind(_assertThisInitialized(_this5));
    _this5.onTextInputKeyDown = _this5.onTextInputKeyDown.bind(_assertThisInitialized(_this5));
    _this5.toggleDrop = _this5.toggleDrop.bind(_assertThisInitialized(_this5));
    _this5.onBlur = _this5.onBlur.bind(_assertThisInitialized(_this5)); // console.log("props", props);

    return _this5;
  }

  _createClass(RangeDropdown, [{
    key: "onTextInputChange",
    value: function onTextInputChange(evt) {
      var onSelect = this.props.onSelect;
      var nextValue = evt.target.value;
      onSelect(nextValue);
    }
    /** Handles _numbers_ only. */

  }, {
    key: "onDropdownSelect",
    value: function onDropdownSelect(evtKey) {
      var _this$props10 = this.props,
          onSelect = _this$props10.onSelect,
          update = _this$props10.update,
          savedValue = _this$props10.savedValue;

      if (parseFloat(evtKey) === savedValue) {
        return false;
      }

      _patchedConsole.patchedConsoleInstance.log("onDropdownSelect", evtKey);

      onSelect(evtKey, update);
    }
  }, {
    key: "onTextInputFormSubmit",
    value: function onTextInputFormSubmit(evt) {
      var _this$props11 = this.props,
          update = _this$props11.update,
          savedValue = _this$props11.savedValue,
          value = _this$props11.value;
      evt.preventDefault();
      evt.stopPropagation();

      if (!(savedValue !== value)) {
        return;
      }

      update();
      this.toggleDrop();
    }
  }, {
    key: "onTextInputKeyDown",
    value: function onTextInputKeyDown(evt) {
      if (evt.key === "Enter" || evt.keyCode === 13) {
        this.onTextInputFormSubmit(evt);
        this.toggleDrop();
      }
    }
  }, {
    key: "toggleDrop",
    value: function toggleDrop() {
      var _this6 = this;

      var _this$state3 = this.state,
          showMenu = _this$state3.showMenu,
          toggling = _this$state3.toggling; // Note: toggling state addresses bug where state updates stack and end up resulting in no state change

      if (!toggling) {
        this.setState({
          showMenu: !showMenu,
          toggling: true
        }, function () {
          _this6.setState({
            toggling: false
          });
        });
      }
    }
  }, {
    key: "onBlur",
    value: function onBlur(evt) {
      // Update saved value with current value of input when clicking off
      this.onTextInputFormSubmit(evt);
    }
  }, {
    key: "render",
    value: function render() {
      var showMenu = this.state.showMenu;
      var _this$props12 = this.props,
          _this$props12$variant = _this$props12.variant,
          variant = _this$props12$variant === void 0 ? "outline-dark" : _this$props12$variant,
          _this$props12$size = _this$props12.size,
          size = _this$props12$size === void 0 ? "sm" : _this$props12$size,
          _this$props12$disable = _this$props12.disabled,
          disabled = _this$props12$disable === void 0 ? false : _this$props12$disable,
          _this$props12$classNa = _this$props12.className,
          className = _this$props12$classNa === void 0 ? "range-dropdown-container col" : _this$props12$classNa,
          propMin = _this$props12.min,
          propMax = _this$props12.max,
          value = _this$props12.value,
          savedValue = _this$props12.savedValue,
          _this$props12$placeho = _this$props12.placeholder,
          placeholder = _this$props12$placeho === void 0 ? "Type..." : _this$props12$placeho,
          title = _this$props12.title,
          termTransformFxn = _this$props12.termTransformFxn,
          id = _this$props12.id,
          facet = _this$props12.facet,
          _this$props12$increme = _this$props12.increments,
          increments = _this$props12$increme === void 0 ? [] : _this$props12$increme,
          _this$props12$reset = _this$props12.reset,
          reset = _this$props12$reset === void 0 ? null : _this$props12$reset,
          tooltip = _this$props12.tooltip;
      var updateAble = savedValue !== value;
      var _facet$field_type4 = facet.field_type,
          field_type = _facet$field_type4 === void 0 ? "number" : _facet$field_type4,
          fMin = facet.min,
          fMax = facet.max,
          _facet$number_step2 = facet.number_step,
          step = _facet$number_step2 === void 0 ? "any" : _facet$number_step2;

      var emptyValue = /*#__PURE__*/_react["default"].createElement("span", {
        className: "mx-1"
      }, "-");

      var showTitle = /*#__PURE__*/_react["default"].createElement("div", {
        className: "d-flex"
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: "col px-1 pt-02"
      }, value !== null ? title : emptyValue)); // if (typeof reset === "function") {
      //     showTitle = (
      //         <div className="d-flex">
      //             <div className="clear-icon-container col-auto clickable d-flex align-items-center" onClick={reset}
      //                 data-tip="Click to unset">
      //                 <i className="icon icon-fw fas icon-minus-circle"/>
      //             </div>
      //             <div className="col px-0">{ value !== null ? title : emptyValue }</div>
      //         </div>
      //     );
      // }


      if (field_type === "date") {
        return /*#__PURE__*/_react["default"].createElement(_DropdownButton["default"], _extends({
          variant: variant,
          disabled: disabled,
          className: className,
          size: size,
          id: id
        }, {
          alignRight: true,
          title: showTitle,
          show: showMenu,
          onToggle: this.toggleDrop,
          onBlur: this.onBlur,
          "data-tip": tooltip,
          "data-html": true
        }), /*#__PURE__*/_react["default"].createElement("form", {
          className: "inline-input-container pb-0 mb-0 border-0",
          onSubmit: this.onTextInputFormSubmit
        }, /*#__PURE__*/_react["default"].createElement("div", {
          className: "input-element-container"
        }, /*#__PURE__*/_react["default"].createElement("input", {
          type: "date",
          className: "form-control",
          value: value,
          "data-value": value,
          onKeyDown: this.onTextInputKeyDown,
          onChange: this.onTextInputChange
        })), /*#__PURE__*/_react["default"].createElement("button", {
          type: "submit",
          disabled: !updateAble,
          className: "btn"
        }, /*#__PURE__*/_react["default"].createElement("i", {
          className: "icon icon-fw icon-check fas"
        }))));
      } else if (field_type === "number" || field_type === "integer") {
        var min = typeof propMin === "number" ? propMin : typeof fMin === "number" ? fMin : 0;
        var max = propMax || fMax || null;

        var menuOptsSet = _toConsumableArray(increments).concat([min]).concat([max]).sort(function (a, b) {
          return a - b;
        }).reduce(function (m, incr) {
          if (typeof incr !== "number") {
            return m;
          }

          m.add(incr); // Handles duplicates.

          return m;
        }, new Set());

        var menuOptions = _toConsumableArray(menuOptsSet).map(function (increment) {
          _patchedConsole.patchedConsoleInstance.log("increment: ", increment, " savedValue: ", savedValue, " min: ", min);

          return /*#__PURE__*/_react["default"].createElement(_DropdownItem["default"], {
            disabled: disabled,
            key: increment,
            eventKey: increment === 0 ? increment.toString() : increment,
            active: increment === savedValue
          }, termTransformFxn(facet.field, increment, true), increment === min ? /*#__PURE__*/_react["default"].createElement("small", null, " (min)") : null, increment === max ? /*#__PURE__*/_react["default"].createElement("small", null, " (max)") : null);
        });

        return /*#__PURE__*/_react["default"].createElement(_DropdownButton["default"], _extends({
          variant: variant,
          disabled: disabled,
          className: className,
          size: size,
          id: id
        }, {
          alignRight: true,
          onSelect: this.onDropdownSelect,
          title: showTitle,
          show: showMenu,
          onToggle: this.toggleDrop,
          onBlur: this.onBlur,
          "data-tip": tooltip,
          "data-html": true
        }), /*#__PURE__*/_react["default"].createElement("form", {
          className: "inline-input-container",
          onSubmit: this.onTextInputFormSubmit
        }, /*#__PURE__*/_react["default"].createElement("div", {
          className: "input-element-container"
        }, /*#__PURE__*/_react["default"].createElement("input", _extends({
          type: "number",
          className: "form-control"
        }, {
          value: value,
          placeholder: placeholder,
          step: step
        }, {
          onKeyDown: this.onTextInputKeyDown,
          onChange: this.onTextInputChange
        }))), /*#__PURE__*/_react["default"].createElement("button", {
          type: "submit",
          disabled: !updateAble,
          className: "btn"
        }, /*#__PURE__*/_react["default"].createElement("i", {
          className: "icon icon-fw icon-check fas"
        }))), menuOptions);
      } else {
        throw new Error("Expected number, integer, or date field type.");
      }
    }
  }]);

  return RangeDropdown;
}(_react["default"].PureComponent);