'use strict';

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

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
      remainingProps = _objectWithoutProperties(_ref, ["className", "id", "disabled"]);

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