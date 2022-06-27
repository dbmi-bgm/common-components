function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function (o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function () { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function (o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

import React from 'react';
import PropTypes from 'prop-types';
import memoize from 'memoize-one';
import Collapse from 'react-bootstrap/esm/Collapse';
import Fade from 'react-bootstrap/esm/Fade';
/**
 * Used to render individual facet fields and their available terms in FacetList.
 */

export var FacetOfFacets = /*#__PURE__*/function (_React$PureComponent) {
  _inherits(FacetOfFacets, _React$PureComponent);

  var _super = _createSuper(FacetOfFacets);

  function FacetOfFacets(props) {
    var _this;

    _classCallCheck(this, FacetOfFacets);

    _this = _super.call(this, props);
    _this.handleOpenToggleClick = _this.handleOpenToggleClick.bind(_assertThisInitialized(_this));
    _this.memoized = {
      anyFacetsHaveSelection: memoize(FacetOfFacets.anyFacetsHaveSelection)
    };
    return _this;
  }

  _createClass(FacetOfFacets, [{
    key: "handleOpenToggleClick",
    value: function handleOpenToggleClick(e) {
      e.preventDefault();
      var _this$props = this.props,
          onToggleOpen = _this$props.onToggleOpen,
          groupTitle = _this$props.title,
          _this$props$facetOpen = _this$props.facetOpen,
          facetOpen = _this$props$facetOpen === void 0 ? false : _this$props$facetOpen;
      onToggleOpen("group:" + groupTitle, !facetOpen);
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
          title = _this$props2.title,
          renderedFacets = _this$props2.children,
          propTip = _this$props2.tooltip,
          facetOpen = _this$props2.facetOpen,
          _this$props2$openFace = _this$props2.openFacets,
          openFacets = _this$props2$openFace === void 0 ? {} : _this$props2$openFace;
      var anySelections = this.memoized.anyFacetsHaveSelection(renderedFacets);
      var tooltip = propTip || "Group of facets containing "; // We'll append to this in .map loop below if !propTip.
      // Ensure all facets within group are not "static single terms".
      // Pass in facetOpen prop.

      var extendedFacets = React.Children.map(renderedFacets, function (renderedFacet, i) {
        var _renderedFacet$props$ = renderedFacet.props.facet,
            field = _renderedFacet$props$.field,
            childTitle = _renderedFacet$props$.title;

        if (!propTip) {
          tooltip += (i === 0 ? "" : ", ") + childTitle;
        }

        return /*#__PURE__*/React.cloneElement(renderedFacet, {
          isStatic: false,
          facetOpen: openFacets[field]
        });
      });
      return /*#__PURE__*/React.createElement("div", {
        className: "facet" + (facetOpen || anySelections ? ' open' : ' closed'),
        "data-group": title
      }, /*#__PURE__*/React.createElement("h5", {
        className: "facet-title",
        onClick: this.handleOpenToggleClick
      }, /*#__PURE__*/React.createElement("span", {
        className: "expand-toggle col-auto px-0"
      }, /*#__PURE__*/React.createElement("i", {
        className: "icon icon-fw icon-" + (anySelections ? "dot-circle far" : facetOpen ? "minus fas" : "plus fas")
      })), /*#__PURE__*/React.createElement("div", {
        className: "col px-0 line-height-1"
      }, /*#__PURE__*/React.createElement("span", {
        "data-tip": tooltip,
        "data-place": "right"
      }, title)), /*#__PURE__*/React.createElement(Fade, {
        "in": !facetOpen && !anySelections
      }, /*#__PURE__*/React.createElement("span", {
        className: "closed-terms-count col-auto px-0" + (anySelections ? " some-selected" : ""),
        "data-place": "right",
        "data-tip": "Group of ".concat(extendedFacets.length, " facets ").concat(anySelections ? " with at least 1 having a selection." : "")
      }, /*#__PURE__*/React.createElement("i", {
        className: "icon fas icon-layer-group"
      })))), /*#__PURE__*/React.createElement(Collapse, {
        "in": facetOpen || anySelections
      }, /*#__PURE__*/React.createElement("div", {
        className: "facet-group-list-container"
      }, extendedFacets)));
    }
  }], [{
    key: "anyFacetsHaveSelection",
    value: function anyFacetsHaveSelection(renderedFacets) {
      for (var facetIdx = 0; facetIdx < renderedFacets.length; facetIdx++) {
        var renderedFacet = renderedFacets[facetIdx]; // We have rendered facets as `props.facets`

        var anySelected = renderedFacet.props.anyTermsSelected;

        if (anySelected) {
          return true;
        }
      }

      return false;
    }
  }]);

  return FacetOfFacets;
}(React.PureComponent);
FacetOfFacets.propTypes = {
  'defaultGroupOpen': PropTypes.bool,
  'facets': PropTypes.arrayOf(PropTypes.element),
  'isStatic': PropTypes.bool,
  'itemTypeForSchemas': PropTypes.string,
  'mounted': PropTypes.bool,
  'onFilter': PropTypes.func,
  // Executed on term click
  'schemas': PropTypes.object,
  'separateSingleTermFacets': PropTypes.bool,
  'termTransformFxn': PropTypes.func,
  'title': PropTypes.string,
  'extraClassname': PropTypes.string
};