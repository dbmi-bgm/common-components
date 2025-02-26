import _objectWithoutProperties from "@babel/runtime/helpers/objectWithoutProperties";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/inherits";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
var _excluded = ["href", "context", "showClearFiltersButton", "schemas", "currentAction", "facets", "navigate", "columns", "columnExtensionMap", "placeholderReplacementFxn", "keepSelectionInStorage", "searchViewHeader", "windowWidth", "hideFacets", "hideStickyFooter", "useCustomSelectionController"];
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _callSuper(_this, derived, args) {
  derived = _getPrototypeOf(derived);
  return _possibleConstructorReturn(_this, function () {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;
    try {
      return !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
    } catch (e) {
      return false;
    }
  }() ? Reflect.construct(derived, args || [], _getPrototypeOf(_this).constructor) : derived.apply(_this, args));
}
import React from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';
import memoize from 'memoize-one';
import ReactTooltip from 'react-tooltip';
import { navigate } from './../util/navigate';
import { isSelectAction } from './../util/misc';
import { patchedConsoleInstance as console } from './../util/patched-console';
import { basicColumnExtensionMap, ColumnCombiner } from './components/table-commons';
import { AboveSearchTablePanel } from './components/AboveSearchTablePanel';
import { CustomColumnController } from './components/CustomColumnController';
import { SortController } from './components/SortController';
import { SelectedItemsController } from './components/SelectedItemsController';
import { WindowNavigationController } from './components/WindowNavigationController';
import { ControlsAndResults } from './components/ControlsAndResults';

// eslint-disable-next-line no-unused-vars
import { SearchResponse, Item, ColumnDefinition, URLParts } from './../util/typedefs';
export { SortController, SelectedItemsController, ColumnCombiner, CustomColumnController };
export var SearchView = /*#__PURE__*/function (_React$PureComponent) {
  function SearchView(props) {
    var _this2;
    _classCallCheck(this, SearchView);
    _this2 = _callSuper(this, SearchView, [props]);
    _this2.filterFacetFxn = _this2.filterFacetFxn.bind(_this2);
    _this2.memoized = {
      listToObj: memoize(SearchView.listToObj)
    };
    return _this2;
  }
  _inherits(SearchView, _React$PureComponent);
  return _createClass(SearchView, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      ReactTooltip.rebuild();
    }
  }, {
    key: "filterFacetFxn",
    value: function filterFacetFxn(facet) {
      var _this$props$hideFacet = this.props.hideFacets,
        hideFacets = _this$props$hideFacet === void 0 ? null : _this$props$hideFacet;
      var _ref = facet || {},
        field = _ref.field,
        _ref$hide_from_view = _ref.hide_from_view,
        hide_from_view = _ref$hide_from_view === void 0 ? false : _ref$hide_from_view;
      if (!hideFacets) return true;
      var idMap = this.memoized.listToObj(hideFacets);
      if (idMap[field] || hide_from_view) return false;
      return true;
    }

    /**
     * TODO once we have @type : [..more stuff..], change to use instead of `getSchemaTypeFromSearchContext`.
     * For custom styling from CSS stylesheet (e.g. to sync override of rowHeight in both CSS and in props here)
     */
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
        href = _this$props.href,
        context = _this$props.context,
        showClearFiltersButton = _this$props.showClearFiltersButton,
        _this$props$schemas = _this$props.schemas,
        schemas = _this$props$schemas === void 0 ? null : _this$props$schemas,
        _this$props$currentAc = _this$props.currentAction,
        currentAction = _this$props$currentAc === void 0 ? null : _this$props$currentAc,
        propFacets = _this$props.facets,
        _this$props$navigate = _this$props.navigate,
        propNavigate = _this$props$navigate === void 0 ? navigate : _this$props$navigate,
        _this$props$columns = _this$props.columns,
        columns = _this$props$columns === void 0 ? null : _this$props$columns,
        _this$props$columnExt = _this$props.columnExtensionMap,
        columnExtensionMap = _this$props$columnExt === void 0 ? basicColumnExtensionMap : _this$props$columnExt,
        placeholderReplacementFxn = _this$props.placeholderReplacementFxn,
        keepSelectionInStorage = _this$props.keepSelectionInStorage,
        _this$props$searchVie = _this$props.searchViewHeader,
        searchViewHeader = _this$props$searchVie === void 0 ? null : _this$props$searchVie,
        windowWidth = _this$props.windowWidth,
        hideFacets = _this$props.hideFacets,
        hideStickyFooter = _this$props.hideStickyFooter,
        useCustomSelectionController = _this$props.useCustomSelectionController,
        passProps = _objectWithoutProperties(_this$props, _excluded);
      var contextFacets = context.facets;

      // All these controllers pass props down to their children.
      // So we don't need to be repetitive here; i.e. may assume 'context' is available
      // in each controller that's child of <ColumnCombiner {...{ context, columns, columnExtensionMap }}>.
      // As well as in ControlsAndResults.

      var childViewProps = _objectSpread(_objectSpread({}, passProps), {}, {
        // Includes pass-thru props like 'facetListComponent', 'aboveTableComponent', 'aboveFacetListComponent', etc.
        currentAction: currentAction,
        schemas: schemas,
        href: href,
        windowWidth: windowWidth,
        isOwnPage: true,
        facets: propFacets || contextFacets,
        hideStickyFooter: hideStickyFooter
      });
      var controllersAndView = /*#__PURE__*/React.createElement(WindowNavigationController, {
        filterFacetFxn: this.filterFacetFxn,
        href: href,
        context: context,
        showClearFiltersButton: showClearFiltersButton,
        hideFacets: hideFacets,
        navigate: propNavigate
      }, /*#__PURE__*/React.createElement(ColumnCombiner, {
        columns: columns,
        columnExtensionMap: columnExtensionMap
      }, /*#__PURE__*/React.createElement(CustomColumnController, null, /*#__PURE__*/React.createElement(SortController, null, searchViewHeader, /*#__PURE__*/React.createElement(ControlsAndResults, childViewProps)))));
      if (isSelectAction(currentAction) && !useCustomSelectionController) {
        // We don't allow "SelectionMode" unless is own page.
        // Could consider changing later once a use case exists.
        controllersAndView =
        /*#__PURE__*/
        // SelectedItemsController must be above ColumnCombiner because it adjusts
        // columnExtensionMap, rather than columnDefinitions. This can be easily changed
        // though if desired.
        React.createElement(SelectedItemsController, {
          columnExtensionMap: columnExtensionMap,
          currentAction: currentAction,
          keepSelectionInStorage: keepSelectionInStorage
        }, controllersAndView);
      }
      return /*#__PURE__*/React.createElement("div", {
        className: "search-page-container"
      }, /*#__PURE__*/React.createElement(AboveSearchTablePanel, {
        context: context,
        placeholderReplacementFxn: placeholderReplacementFxn
      }), controllersAndView);
    }
  }], [{
    key: "listToObj",
    value: function listToObj(hideFacetStrs) {
      var obj = {};
      hideFacetStrs.forEach(function (str) {
        return obj[str] = str + "!";
      });
      // return  hideFacetStrs.concat(hideFacetStrs.map(function(facetStr){
      //     return facetStr + "!";
      // }));
      return obj;
    }
  }]);
}(React.PureComponent);
_defineProperty(SearchView, "propTypes", {
  'context': PropTypes.object.isRequired,
  'columns': PropTypes.object,
  'columnExtensionMap': PropTypes.object,
  'currentAction': PropTypes.string,
  'href': PropTypes.string.isRequired,
  'session': PropTypes.bool.isRequired,
  'navigate': PropTypes.func,
  'facets': PropTypes.array,
  'isFullscreen': PropTypes.bool.isRequired,
  'toggleFullScreen': PropTypes.func.isRequired,
  'separateSingleTermFacets': PropTypes.bool.isRequired,
  'detailPane': PropTypes.element,
  'renderDetailPane': PropTypes.func,
  'showClearFiltersButton': PropTypes.bool,
  'isOwnPage': PropTypes.bool,
  'schemas': PropTypes.object,
  'placeholderReplacementFxn': PropTypes.func,
  // Passed down to AboveSearchTablePanel StaticSection
  'keepSelectionInStorage': PropTypes.bool,
  'searchViewHeader': PropTypes.element,
  'hideFacets': PropTypes.arrayOf(PropTypes.string)
});
/**
 * @property {string} href - Current URI.
 * @property {!string} [currentAction=null] - Current action, if any.
 * @property {Object.<ColumnDefinition>} columnExtensionMap - Object keyed by field name with overrides for column definition.
 * @property {boolean} separateSingleTermFacets - If true, will push facets w/ only 1 term available to bottom of FacetList.
 */
_defineProperty(SearchView, "defaultProps", {
  'href': null,
  // `props.context.columns` is used in place of `props.columns` if `props.columns` is falsy.
  // Or, `props.columns` provides opportunity to override `props.context.columns`. Depends how look at it.
  'columns': null,
  'navigate': navigate,
  'currentAction': null,
  'columnExtensionMap': basicColumnExtensionMap,
  'separateSingleTermFacets': true,
  'isOwnPage': true,
  'keepSelectionInStorage': false,
  'hideFacets': []
});