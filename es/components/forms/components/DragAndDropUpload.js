"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DragAndDropZone = exports.DragAndDropFileUploadModal = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactBootstrap = require("react-bootstrap");

var _propTypes = _interopRequireDefault(require("prop-types"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function (obj) { return typeof obj; }; } else { _typeof = function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function (o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function (o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var DragAndDropFileUploadModal =
/*#__PURE__*/
function (_React$Component) {
  _inherits(DragAndDropFileUploadModal, _React$Component);

  function DragAndDropFileUploadModal() {
    _classCallCheck(this, DragAndDropFileUploadModal);

    return _possibleConstructorReturn(this, _getPrototypeOf(DragAndDropFileUploadModal).apply(this, arguments));
  }

  _createClass(DragAndDropFileUploadModal, [{
    key: "render",

    /*
        Stateless Drag and Drop Component that accepts an onHide and onContainerKeyDown function
        Functions for hiding
    */
    // constructor(props){
    //     super(props);
    // }
    value: function render() {
      var show = this.props.show;
      return _react["default"].createElement(_reactBootstrap.Modal, _extends({
        centered: true
      }, {
        show: show
      }, {
        className: "submission-view-modal"
      }), _react["default"].createElement(_reactBootstrap.Modal.Header, {
        closeButton: true
      }, _react["default"].createElement(_reactBootstrap.Modal.Title, {
        className: "text-500"
      }, "Upload a [Field Type] for [Field Name Here]")), _react["default"].createElement(_reactBootstrap.Modal.Body, null, _react["default"].createElement(DragAndDropZone, null)), _react["default"].createElement(_reactBootstrap.Modal.Footer, null, _react["default"].createElement("button", {
        type: "button",
        className: "btn btn-danger"
      }, "Cancel"), _react["default"].createElement("button", {
        type: "button",
        className: "btn btn-primary"
      }, "Submit")));
    }
  }]);

  return DragAndDropFileUploadModal;
}(_react["default"].Component);

exports.DragAndDropFileUploadModal = DragAndDropFileUploadModal;

_defineProperty(DragAndDropFileUploadModal, "propTypes", {
  show: _propTypes["default"].bool // onHide: PropTypes.func.isRequired,
  // onContainerKeyDown: PropTypes.func.isRequired

});

_defineProperty(DragAndDropFileUploadModal, "defaultProps", {
  show: true
});

var DragAndDropZone =
/*#__PURE__*/
function (_React$Component2) {
  _inherits(DragAndDropZone, _React$Component2);

  // static propTypes = {
  //     /** Whether component should be listening for Item to be selected */
  //     'isSelecting'       : PropTypes.bool.isRequired,
  //     /** Callback called when Item is received. Should accept @ID and Item context (not guaranteed) as params. */
  //     'onSelect'          : PropTypes.func.isRequired,
  // };
  // static defaultProps = {
  //     'isSelecting'       : false,
  //     'onSelect': function (items, endDataPost) {
  //         console.log("Selected", items, endDataPost);
  //     },
  //     'dropMessage'       : "Drop Item Here"
  // };
  function DragAndDropZone(props) {
    var _this;

    _classCallCheck(this, DragAndDropZone);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(DragAndDropZone).call(this, props));

    _defineProperty(_assertThisInitialized(_this), "handleDragOut", function (evt) {
      evt.preventDefault();
      evt.stopPropagation();
    });

    _defineProperty(_assertThisInitialized(_this), "handleDrop", function (evt) {
      evt.preventDefault();
      evt.stopPropagation();

      if (evt.dataTransfer.items && evt.dataTransfer.items.length > 0) {
        var data = evt.dataTransfer.files;

        for (var i = 0; i < data.length; i++) {
          console.log("data", data[i]);
        }
      }
    });

    _this.dropZoneRef = _react["default"].createRef();
    _this.cleanUpEventListeners = _this.cleanUpEventListeners.bind(_assertThisInitialized(_this));
    _this.setUpEventListeners = _this.setUpEventListeners.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(DragAndDropZone, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.setUpEventListeners();
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.cleanUpEventListeners();
    }
  }, {
    key: "setUpEventListeners",
    value: function setUpEventListeners() {
      var div = this.dropZoneRef.current;
      div.addEventListener('dragenter', this.handleDragIn);
      div.addEventListener('dragleave', this.handleDragOut);
      div.addEventListener('dragover', this.handleDrag);
      div.addEventListener('drop', this.handleDrop);
    }
  }, {
    key: "cleanUpEventListeners",
    value: function cleanUpEventListeners() {
      var div = this.dropZoneRef.current;
      div.removeEventListener('dragenter', this.handleDragIn);
      div.removeEventListener('dragleave', this.handleDragOut);
      div.removeEventListener('dragover', this.handleDrag);
      div.removeEventListener('drop', this.handleDrop);
    }
  }, {
    key: "handleDrag",
    value: function handleDrag(evt) {
      evt.preventDefault();
      evt.stopPropagation();

      if (evt.dataTransfer.items && evt.dataTransfer.items.length > 0) {
        var data = evt.dataTransfer.files;

        for (var i = 0; i < data.length; i++) {
          console.log("data", data[i]);
        }
      }
    }
  }, {
    key: "handleDragIn",
    value: function handleDragIn(evt) {
      evt.preventDefault();
      evt.stopPropagation();
    }
  }, {
    key: "render",
    value: function render() {
      return _react["default"].createElement("div", {
        className: "panel text-center",
        style: {
          backgroundColor: '#eee',
          border: "1px solid #efefef",
          height: "30vh",
          flexDirection: "column",
          display: "flex",
          justifyContent: "center"
        },
        ref: this.dropZoneRef
      }, "Drag a file here to upload");
    }
  }]);

  return DragAndDropZone;
}(_react["default"].Component);

exports.DragAndDropZone = DragAndDropZone;