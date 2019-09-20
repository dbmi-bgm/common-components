"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Checkbox = void 0;

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var Checkbox = _react.default.memo(function (props) {
  var className = props.className,
      children = props.children,
      _props$labelClassName = props.labelClassName,
      labelClassName = _props$labelClassName === void 0 ? "mb-0" : _props$labelClassName,
      title = props.title,
      passProps = _objectWithoutProperties(props, ["className", "children", "labelClassName", "title"]);

  var disabled = passProps.disabled;
  var cls = "checkbox" + (disabled ? " disabled" : "") + (className ? " " + className : "");
  return _react.default.createElement("div", {
    className: cls
  }, _react.default.createElement("label", {
    title: title,
    className: labelClassName
  }, _react.default.createElement("input", _extends({
    type: "checkbox",
    className: "mr-08"
  }, passProps)), children));
});

exports.Checkbox = Checkbox;