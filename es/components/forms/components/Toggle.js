var _excluded = ["className", "id", "disabled"];
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
import React from 'react';
import _ from 'underscore';
import { randomId } from './../../util/object';
import { patchedConsoleInstance as console } from './../../util/patched-console';

/**
 * Wraps a checkbox input to turn it into a toggle switch using CSS.
 * Use just like a checkbox input element.
 *
 * @prop {string} id - A unique id. If not supplied, one is autogenerated.
 * @prop {function} onChange - Change event handler.
 * @prop {boolean} checked - Whether is checked or not.
 */
export var Toggle = /*#__PURE__*/React.memo(function (_ref) {
  var className = _ref.className,
    id = _ref.id,
    disabled = _ref.disabled,
    remainingProps = _objectWithoutProperties(_ref, _excluded);
  var useID = id || randomId();
  return /*#__PURE__*/React.createElement("div", {
    className: "onoffswitch " + className + (disabled ? ' disabled' : '')
  }, /*#__PURE__*/React.createElement("input", _extends({
    type: "checkbox",
    id: useID
  }, remainingProps, {
    className: "onoffswitch-checkbox",
    disabled: disabled
  })), /*#__PURE__*/React.createElement("label", {
    className: "onoffswitch-label",
    htmlFor: id
  }, /*#__PURE__*/React.createElement("span", {
    className: "onoffswitch-inner"
  }), /*#__PURE__*/React.createElement("span", {
    className: "onoffswitch-switch"
  })));
});
Toggle.defaultProps = {
  'name': 'onoffswitch',
  'onChange': function onChange() {
    console.log("Toggled ", this);
  },
  'id': null,
  'checked': false,
  'className': ''
};

/** Pulled out into own component so can style/adjust-if-needed together w. Case Review Tab */
export var IconToggle = function (props) {
  var _props$activeIdx = props.activeIdx,
    activeIdx = _props$activeIdx === void 0 ? 0 : _props$activeIdx,
    _props$options = props.options,
    options = _props$options === void 0 ? [] : _props$options,
    _props$divCls = props.divCls,
    divCls = _props$divCls === void 0 ? "" : _props$divCls;
  var renderedOptions = options.map(function (opt, optIdx) {
    var title = opt.title,
      disabled = opt.disabled,
      onClick = opt.onClick,
      dataTip = opt.dataTip,
      _opt$btnCls = opt.btnCls,
      btnCls = _opt$btnCls === void 0 ? "btn-sm" : _opt$btnCls;
    var padding = optIdx === 0 ? "pl-05" : optIdx === options.length - 1 ? "pr-05" : "px-05";
    return /*#__PURE__*/React.createElement("div", {
      className: "flex-grow-1 " + padding,
      "data-tip": dataTip,
      key: optIdx
    }, /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: onClick,
      disabled: disabled,
      "aria-pressed": activeIdx === optIdx,
      className: "btn btn-" + (activeIdx === optIdx ? "primary-dark active pe-none" : "link") + " " + btnCls
    }, title));
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "d-flex mr-1 border border-light flex-nowrap rounded icon-toggle align-items-center " + divCls
  }, renderedOptions);
};