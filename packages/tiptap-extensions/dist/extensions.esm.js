
    /*!
    * tiptap-extensions v1.28.6
    * (c) 2020 Scrumpy UG (limited liability)
    * @license MIT
    */
  
import { Node, Plugin, PluginKey, Mark, Extension } from 'tiptap';
import { toggleWrap, wrappingInputRule, toggleList, toggleBlockType, setBlockType, textblockTypeInputRule, chainCommands, exitCode, nodeInputRule, splitListItem, sinkListItem, liftListItem, insertText, replaceText, splitToDefaultListItem, toggleMark, markInputRule, markPasteRule, updateMark, removeMark, pasteRule } from 'tiptap-commands';
import low from 'lowlight/lib/core';
import { DecorationSet, Decoration } from 'prosemirror-view';
import { findBlockNodes, createTable } from 'prosemirror-utils';
import { Plugin as Plugin$1, PluginKey as PluginKey$1, TextSelection } from 'prosemirror-state';
import { tableNodes, addColumnBefore, addColumnAfter, deleteColumn, addRowBefore, addRowAfter, deleteRow, deleteTable, mergeCells, splitCell, toggleHeaderColumn, toggleHeaderRow, toggleHeaderCell, setCellAttr, fixTables, goToNextCell, columnResizing, tableEditing } from 'prosemirror-tables';
import { getMarkAttrs, nodeEqualsType } from 'tiptap-utils';
import { Step } from 'prosemirror-transform';
import { sendableSteps, getVersion, receiveTransaction, collab } from 'prosemirror-collab';
import { undo, redo, undoDepth, redoDepth, history } from 'prosemirror-history';

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _possibleConstructorReturn(self, call) {
  if (call && (typeof call === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  }
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArray(iter) {
  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}

function _iterableToArrayLimit(arr, i) {
  if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) {
    return;
  }

  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance");
}

var Blockquote =
/*#__PURE__*/
function (_Node) {
  _inherits(Blockquote, _Node);

  function Blockquote() {
    _classCallCheck(this, Blockquote);

    return _possibleConstructorReturn(this, _getPrototypeOf(Blockquote).apply(this, arguments));
  }

  _createClass(Blockquote, [{
    key: "commands",
    value: function commands(_ref) {
      var type = _ref.type,
          schema = _ref.schema;
      return function () {
        return toggleWrap(type, schema.nodes.paragraph);
      };
    }
  }, {
    key: "keys",
    value: function keys(_ref2) {
      var type = _ref2.type;
      return {
        'Ctrl->': toggleWrap(type)
      };
    }
  }, {
    key: "inputRules",
    value: function inputRules(_ref3) {
      var type = _ref3.type;
      return [wrappingInputRule(/^\s*>\s$/, type)];
    }
  }, {
    key: "name",
    get: function get() {
      return 'blockquote';
    }
  }, {
    key: "schema",
    get: function get() {
      return {
        content: 'block*',
        group: 'block',
        defining: true,
        draggable: false,
        parseDOM: [{
          tag: 'blockquote'
        }],
        toDOM: function toDOM() {
          return ['blockquote', 0];
        }
      };
    }
  }]);

  return Blockquote;
}(Node);

var BulletList =
/*#__PURE__*/
function (_Node) {
  _inherits(BulletList, _Node);

  function BulletList() {
    _classCallCheck(this, BulletList);

    return _possibleConstructorReturn(this, _getPrototypeOf(BulletList).apply(this, arguments));
  }

  _createClass(BulletList, [{
    key: "commands",
    value: function commands(_ref) {
      var type = _ref.type,
          schema = _ref.schema;
      return function () {
        return toggleList(type, schema.nodes.list_item);
      };
    }
  }, {
    key: "keys",
    value: function keys(_ref2) {
      var type = _ref2.type,
          schema = _ref2.schema;
      return {
        'Shift-Ctrl-8': toggleList(type, schema.nodes.list_item)
      };
    }
  }, {
    key: "inputRules",
    value: function inputRules(_ref3) {
      var type = _ref3.type;
      return [wrappingInputRule(/^\s*([-+*])\s$/, type)];
    }
  }, {
    key: "name",
    get: function get() {
      return 'bullet_list';
    }
  }, {
    key: "schema",
    get: function get() {
      return {
        content: 'list_item+',
        group: 'block',
        parseDOM: [{
          tag: 'ul'
        }],
        toDOM: function toDOM() {
          return ['ul', 0];
        }
      };
    }
  }]);

  return BulletList;
}(Node);

var CodeBlock =
/*#__PURE__*/
function (_Node) {
  _inherits(CodeBlock, _Node);

  function CodeBlock() {
    _classCallCheck(this, CodeBlock);

    return _possibleConstructorReturn(this, _getPrototypeOf(CodeBlock).apply(this, arguments));
  }

  _createClass(CodeBlock, [{
    key: "commands",
    value: function commands(_ref) {
      var type = _ref.type,
          schema = _ref.schema;
      return function () {
        return toggleBlockType(type, schema.nodes.paragraph);
      };
    }
  }, {
    key: "keys",
    value: function keys(_ref2) {
      var type = _ref2.type;
      return {
        'Shift-Ctrl-\\': setBlockType(type)
      };
    }
  }, {
    key: "inputRules",
    value: function inputRules(_ref3) {
      var type = _ref3.type;
      return [textblockTypeInputRule(/^```$/, type)];
    }
  }, {
    key: "name",
    get: function get() {
      return 'code_block';
    }
  }, {
    key: "schema",
    get: function get() {
      return {
        content: 'text*',
        marks: '',
        group: 'block',
        code: true,
        defining: true,
        draggable: false,
        parseDOM: [{
          tag: 'pre',
          preserveWhitespace: 'full'
        }],
        toDOM: function toDOM() {
          return ['pre', ['code', 0]];
        }
      };
    }
  }]);

  return CodeBlock;
}(Node);

function getDecorations(_ref) {
  var doc = _ref.doc,
      name = _ref.name;
  var decorations = [];
  var blocks = findBlockNodes(doc).filter(function (item) {
    return item.node.type.name === name;
  });

  var flatten = function flatten(list) {
    return list.reduce(function (a, b) {
      return a.concat(Array.isArray(b) ? flatten(b) : b);
    }, []);
  };

  function parseNodes(nodes) {
    var className = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    return nodes.map(function (node) {
      var classes = [].concat(_toConsumableArray(className), _toConsumableArray(node.properties ? node.properties.className : []));

      if (node.children) {
        return parseNodes(node.children, classes);
      }

      return {
        text: node.value,
        classes: classes
      };
    });
  }

  blocks.forEach(function (block) {
    var startPos = block.pos + 1;
    var nodes = low.highlightAuto(block.node.textContent).value;
    flatten(parseNodes(nodes)).map(function (node) {
      var from = startPos;
      var to = from + node.text.length;
      startPos = to;
      return _objectSpread2({}, node, {
        from: from,
        to: to
      });
    }).forEach(function (node) {
      var decoration = Decoration.inline(node.from, node.to, {
        class: node.classes.join(' ')
      });
      decorations.push(decoration);
    });
  });
  return DecorationSet.create(doc, decorations);
}

function HighlightPlugin(_ref2) {
  var name = _ref2.name;
  return new Plugin({
    name: new PluginKey('highlight'),
    state: {
      init: function init(_, _ref3) {
        var doc = _ref3.doc;
        return getDecorations({
          doc: doc,
          name: name
        });
      },
      apply: function apply(transaction, decorationSet, oldState, state) {
        // TODO: find way to cache decorations
        // see: https://discuss.prosemirror.net/t/how-to-update-multiple-inline-decorations-on-node-change/1493
        var nodeName = state.selection.$head.parent.type.name;
        var previousNodeName = oldState.selection.$head.parent.type.name;

        if (transaction.docChanged && [nodeName, previousNodeName].includes(name)) {
          return getDecorations({
            doc: transaction.doc,
            name: name
          });
        }

        return decorationSet.map(transaction.mapping, transaction.doc);
      }
    },
    props: {
      decorations: function decorations(state) {
        return this.getState(state);
      }
    }
  });
}

var CodeBlockHighlight =
/*#__PURE__*/
function (_Node) {
  _inherits(CodeBlockHighlight, _Node);

  function CodeBlockHighlight() {
    var _this;

    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, CodeBlockHighlight);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(CodeBlockHighlight).call(this, options));

    try {
      Object.entries(_this.options.languages).forEach(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
            name = _ref2[0],
            mapping = _ref2[1];

        low.registerLanguage(name, mapping);
      });
    } catch (err) {
      throw new Error('Invalid syntax highlight definitions: define at least one highlight.js language mapping');
    }

    return _this;
  }

  _createClass(CodeBlockHighlight, [{
    key: "commands",
    value: function commands(_ref3) {
      var type = _ref3.type,
          schema = _ref3.schema;
      return function () {
        return toggleBlockType(type, schema.nodes.paragraph);
      };
    }
  }, {
    key: "keys",
    value: function keys(_ref4) {
      var type = _ref4.type;
      return {
        'Shift-Ctrl-\\': setBlockType(type)
      };
    }
  }, {
    key: "inputRules",
    value: function inputRules(_ref5) {
      var type = _ref5.type;
      return [textblockTypeInputRule(/^```$/, type)];
    }
  }, {
    key: "name",
    get: function get() {
      return 'code_block';
    }
  }, {
    key: "defaultOptions",
    get: function get() {
      return {
        languages: {}
      };
    }
  }, {
    key: "schema",
    get: function get() {
      return {
        content: 'text*',
        marks: '',
        group: 'block',
        code: true,
        defining: true,
        draggable: false,
        parseDOM: [{
          tag: 'pre',
          preserveWhitespace: 'full'
        }],
        toDOM: function toDOM() {
          return ['pre', ['code', 0]];
        }
      };
    }
  }, {
    key: "plugins",
    get: function get() {
      return [HighlightPlugin({
        name: this.name
      })];
    }
  }]);

  return CodeBlockHighlight;
}(Node);

var HardBreak =
/*#__PURE__*/
function (_Node) {
  _inherits(HardBreak, _Node);

  function HardBreak() {
    _classCallCheck(this, HardBreak);

    return _possibleConstructorReturn(this, _getPrototypeOf(HardBreak).apply(this, arguments));
  }

  _createClass(HardBreak, [{
    key: "keys",
    value: function keys(_ref) {
      var type = _ref.type;
      var command = chainCommands(exitCode, function (state, dispatch) {
        dispatch(state.tr.replaceSelectionWith(type.create()).scrollIntoView());
        return true;
      });
      return {
        'Mod-Enter': command,
        'Shift-Enter': command
      };
    }
  }, {
    key: "name",
    get: function get() {
      return 'hard_break';
    }
  }, {
    key: "schema",
    get: function get() {
      return {
        inline: true,
        group: 'inline',
        selectable: false,
        parseDOM: [{
          tag: 'br'
        }],
        toDOM: function toDOM() {
          return ['br'];
        }
      };
    }
  }]);

  return HardBreak;
}(Node);

var Heading =
/*#__PURE__*/
function (_Node) {
  _inherits(Heading, _Node);

  function Heading() {
    _classCallCheck(this, Heading);

    return _possibleConstructorReturn(this, _getPrototypeOf(Heading).apply(this, arguments));
  }

  _createClass(Heading, [{
    key: "commands",
    value: function commands(_ref) {
      var type = _ref.type,
          schema = _ref.schema;
      return function (attrs) {
        return toggleBlockType(type, schema.nodes.paragraph, attrs);
      };
    }
  }, {
    key: "keys",
    value: function keys(_ref2) {
      var type = _ref2.type;
      return this.options.levels.reduce(function (items, level) {
        return _objectSpread2({}, items, {}, _defineProperty({}, "Shift-Ctrl-".concat(level), setBlockType(type, {
          level: level
        })));
      }, {});
    }
  }, {
    key: "inputRules",
    value: function inputRules(_ref3) {
      var type = _ref3.type;
      return this.options.levels.map(function (level) {
        return textblockTypeInputRule(new RegExp("^(#{1,".concat(level, "})\\s$")), type, function () {
          return {
            level: level
          };
        });
      });
    }
  }, {
    key: "name",
    get: function get() {
      return 'heading';
    }
  }, {
    key: "defaultOptions",
    get: function get() {
      return {
        levels: [1, 2, 3, 4, 5, 6]
      };
    }
  }, {
    key: "schema",
    get: function get() {
      return {
        attrs: {
          level: {
            default: 1
          }
        },
        content: 'inline*',
        group: 'block',
        defining: true,
        draggable: false,
        parseDOM: this.options.levels.map(function (level) {
          return {
            tag: "h".concat(level),
            attrs: {
              level: level
            }
          };
        }),
        toDOM: function toDOM(node) {
          return ["h".concat(node.attrs.level), 0];
        }
      };
    }
  }]);

  return Heading;
}(Node);

var HorizontalRule =
/*#__PURE__*/
function (_Node) {
  _inherits(HorizontalRule, _Node);

  function HorizontalRule() {
    _classCallCheck(this, HorizontalRule);

    return _possibleConstructorReturn(this, _getPrototypeOf(HorizontalRule).apply(this, arguments));
  }

  _createClass(HorizontalRule, [{
    key: "commands",
    value: function commands(_ref) {
      var type = _ref.type;
      return function () {
        return function (state, dispatch) {
          return dispatch(state.tr.replaceSelectionWith(type.create()));
        };
      };
    }
  }, {
    key: "inputRules",
    value: function inputRules(_ref2) {
      var type = _ref2.type;
      return [nodeInputRule(/^(?:---|___\s|\*\*\*\s)$/, type)];
    }
  }, {
    key: "name",
    get: function get() {
      return 'horizontal_rule';
    }
  }, {
    key: "schema",
    get: function get() {
      return {
        group: 'block',
        parseDOM: [{
          tag: 'hr'
        }],
        toDOM: function toDOM() {
          return ['hr'];
        }
      };
    }
  }]);

  return HorizontalRule;
}(Node);

/**
 * Matches following attributes in Markdown-typed image: [, alt, src, title]
 *
 * Example:
 * ![Lorem](image.jpg) -> [, "Lorem", "image.jpg"]
 * ![](image.jpg "Ipsum") -> [, "", "image.jpg", "Ipsum"]
 * ![Lorem](image.jpg "Ipsum") -> [, "Lorem", "image.jpg", "Ipsum"]
 */

var IMAGE_INPUT_REGEX = /!\[(.+|:?)]\((\S+)(?:(?:\s+)["'](\S+)["'])?\)/;

var Image =
/*#__PURE__*/
function (_Node) {
  _inherits(Image, _Node);

  function Image() {
    _classCallCheck(this, Image);

    return _possibleConstructorReturn(this, _getPrototypeOf(Image).apply(this, arguments));
  }

  _createClass(Image, [{
    key: "commands",
    value: function commands(_ref) {
      var type = _ref.type;
      return function (attrs) {
        return function (state, dispatch) {
          var selection = state.selection;
          var position = selection.$cursor ? selection.$cursor.pos : selection.$to.pos;
          var node = type.create(attrs);
          var transaction = state.tr.insert(position, node);
          dispatch(transaction);
        };
      };
    }
  }, {
    key: "inputRules",
    value: function inputRules(_ref2) {
      var type = _ref2.type;
      return [nodeInputRule(IMAGE_INPUT_REGEX, type, function (match) {
        var _match = _slicedToArray(match, 4),
            alt = _match[1],
            src = _match[2],
            title = _match[3];

        return {
          src: src,
          alt: alt,
          title: title
        };
      })];
    }
  }, {
    key: "name",
    get: function get() {
      return 'image';
    }
  }, {
    key: "schema",
    get: function get() {
      return {
        inline: true,
        attrs: {
          src: {},
          alt: {
            default: null
          },
          title: {
            default: null
          }
        },
        group: 'inline',
        draggable: true,
        parseDOM: [{
          tag: 'img[src]',
          getAttrs: function getAttrs(dom) {
            return {
              src: dom.getAttribute('src'),
              title: dom.getAttribute('title'),
              alt: dom.getAttribute('alt')
            };
          }
        }],
        toDOM: function toDOM(node) {
          return ['img', node.attrs];
        }
      };
    }
  }, {
    key: "plugins",
    get: function get() {
      return [new Plugin({
        props: {
          handleDOMEvents: {
            drop: function drop(view, event) {
              var hasFiles = event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files.length;

              if (!hasFiles) {
                return;
              }

              var images = Array.from(event.dataTransfer.files).filter(function (file) {
                return /image/i.test(file.type);
              });

              if (images.length === 0) {
                return;
              }

              event.preventDefault();
              var schema = view.state.schema;
              var coordinates = view.posAtCoords({
                left: event.clientX,
                top: event.clientY
              });
              images.forEach(function (image) {
                var reader = new FileReader();

                reader.onload = function (readerEvent) {
                  var node = schema.nodes.image.create({
                    src: readerEvent.target.result
                  });
                  var transaction = view.state.tr.insert(coordinates.pos, node);
                  view.dispatch(transaction);
                };

                reader.readAsDataURL(image);
              });
            }
          }
        }
      })];
    }
  }]);

  return Image;
}(Node);

var ListItem =
/*#__PURE__*/
function (_Node) {
  _inherits(ListItem, _Node);

  function ListItem() {
    _classCallCheck(this, ListItem);

    return _possibleConstructorReturn(this, _getPrototypeOf(ListItem).apply(this, arguments));
  }

  _createClass(ListItem, [{
    key: "keys",
    value: function keys(_ref) {
      var type = _ref.type;
      return {
        Enter: splitListItem(type),
        Tab: sinkListItem(type),
        'Shift-Tab': liftListItem(type)
      };
    }
  }, {
    key: "name",
    get: function get() {
      return 'list_item';
    }
  }, {
    key: "schema",
    get: function get() {
      return {
        content: 'paragraph block*',
        defining: true,
        draggable: false,
        parseDOM: [{
          tag: 'li'
        }],
        toDOM: function toDOM() {
          return ['li', 0];
        }
      };
    }
  }]);

  return ListItem;
}(Node);

function triggerCharacter(_ref) {
  var _ref$char = _ref.char,
      char = _ref$char === void 0 ? '@' : _ref$char,
      _ref$allowSpaces = _ref.allowSpaces,
      allowSpaces = _ref$allowSpaces === void 0 ? false : _ref$allowSpaces,
      _ref$startOfLine = _ref.startOfLine,
      startOfLine = _ref$startOfLine === void 0 ? false : _ref$startOfLine;
  return function ($position) {
    // cancel if top level node
    if ($position.depth <= 0) {
      return false;
    } // Matching expressions used for later


    var escapedChar = "\\".concat(char);
    var suffix = new RegExp("\\s".concat(escapedChar, "$"));
    var prefix = startOfLine ? '^' : '';
    var regexp = allowSpaces ? new RegExp("".concat(prefix).concat(escapedChar, ".*?(?=\\s").concat(escapedChar, "|$)"), 'gm') : new RegExp("".concat(prefix, "(?:^)?").concat(escapedChar, "[^\\s|\\0").concat(escapedChar, "]*"), 'gm'); // Lookup the boundaries of the current node

    var textFrom = $position.before();
    var textTo = $position.end();
    var text = $position.doc.textBetween(textFrom, textTo, '\0', '\0');
    var match = regexp.exec(text);
    var position;

    while (match !== null) {
      // JavaScript doesn't have lookbehinds; this hacks a check that first character is " "
      // or the line beginning
      var matchPrefix = match.input.slice(Math.max(0, match.index - 1), match.index);

      if (/^[\s\0]?$/.test(matchPrefix)) {
        // The absolute position of the match in the document
        var from = match.index + $position.start();
        var to = from + match[0].length; // Edge case handling; if spaces are allowed and we're directly in between
        // two triggers

        if (allowSpaces && suffix.test(text.slice(to - 1, to + 1))) {
          match[0] += ' ';
          to += 1;
        } // If the $position is located within the matched substring, return that range


        if (from < $position.pos && to >= $position.pos) {
          position = {
            range: {
              from: from,
              to: to
            },
            query: match[0].slice(char.length),
            text: match[0]
          };
        }
      }

      match = regexp.exec(text);
    }

    return position;
  };
}

function SuggestionsPlugin(_ref2) {
  var _ref2$matcher = _ref2.matcher,
      matcher = _ref2$matcher === void 0 ? {
    char: '@',
    allowSpaces: false,
    startOfLine: false
  } : _ref2$matcher,
      _ref2$appendText = _ref2.appendText,
      appendText = _ref2$appendText === void 0 ? null : _ref2$appendText,
      _ref2$suggestionClass = _ref2.suggestionClass,
      suggestionClass = _ref2$suggestionClass === void 0 ? 'suggestion' : _ref2$suggestionClass,
      _ref2$command = _ref2.command,
      _command = _ref2$command === void 0 ? function () {
    return false;
  } : _ref2$command,
      _ref2$items = _ref2.items,
      items = _ref2$items === void 0 ? [] : _ref2$items,
      _ref2$onEnter = _ref2.onEnter,
      onEnter = _ref2$onEnter === void 0 ? function () {
    return false;
  } : _ref2$onEnter,
      _ref2$onChange = _ref2.onChange,
      onChange = _ref2$onChange === void 0 ? function () {
    return false;
  } : _ref2$onChange,
      _ref2$onExit = _ref2.onExit,
      onExit = _ref2$onExit === void 0 ? function () {
    return false;
  } : _ref2$onExit,
      _ref2$onKeyDown = _ref2.onKeyDown,
      onKeyDown = _ref2$onKeyDown === void 0 ? function () {
    return false;
  } : _ref2$onKeyDown,
      _ref2$onFilter = _ref2.onFilter,
      onFilter = _ref2$onFilter === void 0 ? function (searchItems, query) {
    if (!query) {
      return searchItems;
    }

    return searchItems.filter(function (item) {
      return JSON.stringify(item).toLowerCase().includes(query.toLowerCase());
    });
  } : _ref2$onFilter;

  return new Plugin$1({
    key: new PluginKey$1('suggestions'),
    view: function view() {
      var _this = this;

      return {
        update: function update(view, prevState) {
          var prev = _this.key.getState(prevState);

          var next = _this.key.getState(view.state); // See how the state changed


          var moved = prev.active && next.active && prev.range.from !== next.range.from;
          var started = !prev.active && next.active;
          var stopped = prev.active && !next.active;
          var changed = !started && !stopped && prev.query !== next.query;
          var handleStart = started || moved;
          var handleChange = changed && !moved;
          var handleExit = stopped || moved; // Cancel when suggestion isn't active

          if (!handleStart && !handleChange && !handleExit) {
            return;
          }

          var state = handleExit ? prev : next;
          var decorationNode = document.querySelector("[data-decoration-id=\"".concat(state.decorationId, "\"]")); // build a virtual node for popper.js or tippy.js
          // this can be used for building popups without a DOM node

          var virtualNode = decorationNode ? {
            getBoundingClientRect: function getBoundingClientRect() {
              return decorationNode.getBoundingClientRect();
            },
            clientWidth: decorationNode.clientWidth,
            clientHeight: decorationNode.clientHeight
          } : null;
          var props = {
            view: view,
            range: state.range,
            query: state.query,
            text: state.text,
            decorationNode: decorationNode,
            virtualNode: virtualNode,
            items: onFilter(Array.isArray(items) ? items : items(), state.query),
            command: function command(_ref3) {
              var range = _ref3.range,
                  attrs = _ref3.attrs;

              _command({
                range: range,
                attrs: attrs,
                schema: view.state.schema
              })(view.state, view.dispatch, view);

              if (appendText) {
                insertText(appendText)(view.state, view.dispatch, view);
              }
            }
          }; // Trigger the hooks when necessary

          if (handleExit) {
            onExit(props);
          }

          if (handleChange) {
            onChange(props);
          }

          if (handleStart) {
            onEnter(props);
          }
        }
      };
    },
    state: {
      // Initialize the plugin's internal state.
      init: function init() {
        return {
          active: false,
          range: {},
          query: null,
          text: null
        };
      },
      // Apply changes to the plugin state from a view transaction.
      apply: function apply(tr, prev) {
        var selection = tr.selection;
        var next = Object.assign({}, prev); // We can only be suggesting if there is no selection

        if (selection.from === selection.to) {
          // Reset active state if we just left the previous suggestion range
          if (selection.from < prev.range.from || selection.from > prev.range.to) {
            next.active = false;
          } // Try to match against where our cursor currently is


          var $position = selection.$from;
          var match = triggerCharacter(matcher)($position);
          var decorationId = (Math.random() + 1).toString(36).substr(2, 5); // If we found a match, update the current state to show it

          if (match) {
            next.active = true;
            next.decorationId = prev.decorationId ? prev.decorationId : decorationId;
            next.range = match.range;
            next.query = match.query;
            next.text = match.text;
          } else {
            next.active = false;
          }
        } else {
          next.active = false;
        } // Make sure to empty the range if suggestion is inactive


        if (!next.active) {
          next.decorationId = null;
          next.range = {};
          next.query = null;
          next.text = null;
        }

        return next;
      }
    },
    props: {
      // Call the keydown hook if suggestion is active.
      handleKeyDown: function handleKeyDown(view, event) {
        var _this$getState = this.getState(view.state),
            active = _this$getState.active,
            range = _this$getState.range;

        if (!active) return false;
        return onKeyDown({
          view: view,
          event: event,
          range: range
        });
      },
      // Setup decorator on the currently active suggestion.
      decorations: function decorations(editorState) {
        var _this$getState2 = this.getState(editorState),
            active = _this$getState2.active,
            range = _this$getState2.range,
            decorationId = _this$getState2.decorationId;

        if (!active) return null;
        return DecorationSet.create(editorState.doc, [Decoration.inline(range.from, range.to, {
          nodeName: 'span',
          class: suggestionClass,
          'data-decoration-id': decorationId
        })]);
      }
    }
  });
}

var Mention =
/*#__PURE__*/
function (_Node) {
  _inherits(Mention, _Node);

  function Mention() {
    _classCallCheck(this, Mention);

    return _possibleConstructorReturn(this, _getPrototypeOf(Mention).apply(this, arguments));
  }

  _createClass(Mention, [{
    key: "commands",
    value: function commands(_ref) {
      var _this = this;

      var schema = _ref.schema;
      return function (attrs) {
        return replaceText(null, schema.nodes[_this.name], attrs);
      };
    }
  }, {
    key: "name",
    get: function get() {
      return 'mention';
    }
  }, {
    key: "defaultOptions",
    get: function get() {
      return {
        matcher: {
          char: '@',
          allowSpaces: false,
          startOfLine: false
        },
        mentionClass: 'mention',
        suggestionClass: 'mention-suggestion'
      };
    }
  }, {
    key: "schema",
    get: function get() {
      var _this2 = this;

      return {
        attrs: {
          id: {},
          label: {}
        },
        group: 'inline',
        inline: true,
        selectable: false,
        atom: true,
        toDOM: function toDOM(node) {
          return ['span', {
            class: _this2.options.mentionClass,
            'data-mention-id': node.attrs.id
          }, "".concat(_this2.options.matcher.char).concat(node.attrs.label)];
        },
        parseDOM: [{
          tag: 'span[data-mention-id]',
          getAttrs: function getAttrs(dom) {
            var id = dom.getAttribute('data-mention-id');
            var label = dom.innerText.split(_this2.options.matcher.char).join('');
            return {
              id: id,
              label: label
            };
          }
        }]
      };
    }
  }, {
    key: "plugins",
    get: function get() {
      var _this3 = this;

      return [SuggestionsPlugin({
        command: function command(_ref2) {
          var range = _ref2.range,
              attrs = _ref2.attrs,
              schema = _ref2.schema;
          return replaceText(range, schema.nodes[_this3.name], attrs);
        },
        appendText: ' ',
        matcher: this.options.matcher,
        items: this.options.items,
        onEnter: this.options.onEnter,
        onChange: this.options.onChange,
        onExit: this.options.onExit,
        onKeyDown: this.options.onKeyDown,
        onFilter: this.options.onFilter,
        suggestionClass: this.options.suggestionClass
      })];
    }
  }]);

  return Mention;
}(Node);

var OrderedList =
/*#__PURE__*/
function (_Node) {
  _inherits(OrderedList, _Node);

  function OrderedList() {
    _classCallCheck(this, OrderedList);

    return _possibleConstructorReturn(this, _getPrototypeOf(OrderedList).apply(this, arguments));
  }

  _createClass(OrderedList, [{
    key: "commands",
    value: function commands(_ref) {
      var type = _ref.type,
          schema = _ref.schema;
      return function () {
        return toggleList(type, schema.nodes.list_item);
      };
    }
  }, {
    key: "keys",
    value: function keys(_ref2) {
      var type = _ref2.type,
          schema = _ref2.schema;
      return {
        'Shift-Ctrl-9': toggleList(type, schema.nodes.list_item)
      };
    }
  }, {
    key: "inputRules",
    value: function inputRules(_ref3) {
      var type = _ref3.type;
      return [wrappingInputRule(/^(\d+)\.\s$/, type, function (match) {
        return {
          order: +match[1]
        };
      }, function (match, node) {
        return node.childCount + node.attrs.order === +match[1];
      })];
    }
  }, {
    key: "name",
    get: function get() {
      return 'ordered_list';
    }
  }, {
    key: "schema",
    get: function get() {
      return {
        attrs: {
          order: {
            default: 1
          }
        },
        content: 'list_item+',
        group: 'block',
        parseDOM: [{
          tag: 'ol',
          getAttrs: function getAttrs(dom) {
            return {
              order: dom.hasAttribute('start') ? +dom.getAttribute('start') : 1
            };
          }
        }],
        toDOM: function toDOM(node) {
          return node.attrs.order === 1 ? ['ol', 0] : ['ol', {
            start: node.attrs.order
          }, 0];
        }
      };
    }
  }]);

  return OrderedList;
}(Node);

var TableNodes = tableNodes({
  tableGroup: 'block',
  cellContent: 'block+',
  cellAttributes: {
    background: {
      default: null,
      getFromDOM: function getFromDOM(dom) {
        return dom.style.backgroundColor || null;
      },
      setDOMAttr: function setDOMAttr(value, attrs) {
        if (value) {
          var style = {
            style: "".concat(attrs.style || '', "background-color: ").concat(value, ";")
          };
          Object.assign(attrs, style);
        }
      }
    }
  }
});

var Table =
/*#__PURE__*/
function (_Node) {
  _inherits(Table, _Node);

  function Table() {
    _classCallCheck(this, Table);

    return _possibleConstructorReturn(this, _getPrototypeOf(Table).apply(this, arguments));
  }

  _createClass(Table, [{
    key: "commands",
    value: function commands(_ref) {
      var schema = _ref.schema;
      return {
        createTable: function createTable$1(_ref2) {
          var rowsCount = _ref2.rowsCount,
              colsCount = _ref2.colsCount,
              withHeaderRow = _ref2.withHeaderRow;
          return function (state, dispatch) {
            var offset = state.tr.selection.anchor + 1;

            var nodes = createTable(schema, rowsCount, colsCount, withHeaderRow);

            var tr = state.tr.replaceSelectionWith(nodes).scrollIntoView();
            var resolvedPos = tr.doc.resolve(offset);
            tr.setSelection(TextSelection.near(resolvedPos));
            dispatch(tr);
          };
        },
        addColumnBefore: function addColumnBefore$1() {
          return addColumnBefore;
        },
        addColumnAfter: function addColumnAfter$1() {
          return addColumnAfter;
        },
        deleteColumn: function deleteColumn$1() {
          return deleteColumn;
        },
        addRowBefore: function addRowBefore$1() {
          return addRowBefore;
        },
        addRowAfter: function addRowAfter$1() {
          return addRowAfter;
        },
        deleteRow: function deleteRow$1() {
          return deleteRow;
        },
        deleteTable: function deleteTable$1() {
          return deleteTable;
        },
        toggleCellMerge: function toggleCellMerge() {
          return function (state, dispatch) {
            if (mergeCells(state, dispatch)) {
              return;
            }

            splitCell(state, dispatch);
          };
        },
        mergeCells: function mergeCells$1() {
          return mergeCells;
        },
        splitCell: function splitCell$1() {
          return splitCell;
        },
        toggleHeaderColumn: function toggleHeaderColumn$1() {
          return toggleHeaderColumn;
        },
        toggleHeaderRow: function toggleHeaderRow$1() {
          return toggleHeaderRow;
        },
        toggleHeaderCell: function toggleHeaderCell$1() {
          return toggleHeaderCell;
        },
        setCellAttr: function setCellAttr$1() {
          return setCellAttr;
        },
        fixTables: function fixTables$1() {
          return fixTables;
        }
      };
    }
  }, {
    key: "keys",
    value: function keys() {
      return {
        Tab: goToNextCell(1),
        'Shift-Tab': goToNextCell(-1)
      };
    }
  }, {
    key: "name",
    get: function get() {
      return 'table';
    }
  }, {
    key: "defaultOptions",
    get: function get() {
      return {
        resizable: false
      };
    }
  }, {
    key: "schema",
    get: function get() {
      return TableNodes.table;
    }
  }, {
    key: "plugins",
    get: function get() {
      return [].concat(_toConsumableArray(this.options.resizable ? [columnResizing()] : []), [tableEditing()]);
    }
  }]);

  return Table;
}(Node);

var TableHeader =
/*#__PURE__*/
function (_Node) {
  _inherits(TableHeader, _Node);

  function TableHeader() {
    _classCallCheck(this, TableHeader);

    return _possibleConstructorReturn(this, _getPrototypeOf(TableHeader).apply(this, arguments));
  }

  _createClass(TableHeader, [{
    key: "name",
    get: function get() {
      return 'table_header';
    }
  }, {
    key: "schema",
    get: function get() {
      return TableNodes.table_header;
    }
  }]);

  return TableHeader;
}(Node);

var TableCell =
/*#__PURE__*/
function (_Node) {
  _inherits(TableCell, _Node);

  function TableCell() {
    _classCallCheck(this, TableCell);

    return _possibleConstructorReturn(this, _getPrototypeOf(TableCell).apply(this, arguments));
  }

  _createClass(TableCell, [{
    key: "name",
    get: function get() {
      return 'table_cell';
    }
  }, {
    key: "schema",
    get: function get() {
      return TableNodes.table_cell;
    }
  }]);

  return TableCell;
}(Node);

var TableRow =
/*#__PURE__*/
function (_Node) {
  _inherits(TableRow, _Node);

  function TableRow() {
    _classCallCheck(this, TableRow);

    return _possibleConstructorReturn(this, _getPrototypeOf(TableRow).apply(this, arguments));
  }

  _createClass(TableRow, [{
    key: "name",
    get: function get() {
      return 'table_row';
    }
  }, {
    key: "schema",
    get: function get() {
      return TableNodes.table_row;
    }
  }]);

  return TableRow;
}(Node);

var TodoItem =
/*#__PURE__*/
function (_Node) {
  _inherits(TodoItem, _Node);

  function TodoItem() {
    _classCallCheck(this, TodoItem);

    return _possibleConstructorReturn(this, _getPrototypeOf(TodoItem).apply(this, arguments));
  }

  _createClass(TodoItem, [{
    key: "keys",
    value: function keys(_ref) {
      var type = _ref.type;
      return {
        Enter: splitToDefaultListItem(type),
        Tab: this.options.nested ? sinkListItem(type) : function () {},
        'Shift-Tab': liftListItem(type)
      };
    }
  }, {
    key: "name",
    get: function get() {
      return 'todo_item';
    }
  }, {
    key: "defaultOptions",
    get: function get() {
      return {
        nested: false
      };
    }
  }, {
    key: "view",
    get: function get() {
      return {
        props: ['node', 'updateAttrs', 'view'],
        methods: {
          onChange: function onChange() {
            this.updateAttrs({
              done: !this.node.attrs.done
            });
          }
        },
        template: "\n        <li :data-type=\"node.type.name\" :data-done=\"node.attrs.done.toString()\" data-drag-handle>\n          <span class=\"todo-checkbox\" contenteditable=\"false\" @click=\"onChange\"></span>\n          <div class=\"todo-content\" ref=\"content\" :contenteditable=\"view.editable.toString()\"></div>\n        </li>\n      "
      };
    }
  }, {
    key: "schema",
    get: function get() {
      var _this = this;

      return {
        attrs: {
          done: {
            default: false
          }
        },
        draggable: true,
        content: this.options.nested ? '(paragraph|todo_list)+' : 'paragraph+',
        toDOM: function toDOM(node) {
          var done = node.attrs.done;
          return ['li', {
            'data-type': _this.name,
            'data-done': done.toString()
          }, ['span', {
            class: 'todo-checkbox',
            contenteditable: 'false'
          }], ['div', {
            class: 'todo-content'
          }, 0]];
        },
        parseDOM: [{
          priority: 51,
          tag: "[data-type=\"".concat(this.name, "\"]"),
          getAttrs: function getAttrs(dom) {
            return {
              done: dom.getAttribute('data-done') === 'true'
            };
          }
        }]
      };
    }
  }]);

  return TodoItem;
}(Node);

var TodoList =
/*#__PURE__*/
function (_Node) {
  _inherits(TodoList, _Node);

  function TodoList() {
    _classCallCheck(this, TodoList);

    return _possibleConstructorReturn(this, _getPrototypeOf(TodoList).apply(this, arguments));
  }

  _createClass(TodoList, [{
    key: "commands",
    value: function commands(_ref) {
      var type = _ref.type,
          schema = _ref.schema;
      return function () {
        return toggleList(type, schema.nodes.todo_item);
      };
    }
  }, {
    key: "inputRules",
    value: function inputRules(_ref2) {
      var type = _ref2.type;
      return [wrappingInputRule(/^\s*(\[ \])\s$/, type)];
    }
  }, {
    key: "name",
    get: function get() {
      return 'todo_list';
    }
  }, {
    key: "schema",
    get: function get() {
      var _this = this;

      return {
        group: 'block',
        content: 'todo_item+',
        toDOM: function toDOM() {
          return ['ul', {
            'data-type': _this.name
          }, 0];
        },
        parseDOM: [{
          priority: 51,
          tag: "[data-type=\"".concat(this.name, "\"]")
        }]
      };
    }
  }]);

  return TodoList;
}(Node);

var Bold =
/*#__PURE__*/
function (_Mark) {
  _inherits(Bold, _Mark);

  function Bold() {
    _classCallCheck(this, Bold);

    return _possibleConstructorReturn(this, _getPrototypeOf(Bold).apply(this, arguments));
  }

  _createClass(Bold, [{
    key: "keys",
    value: function keys(_ref) {
      var type = _ref.type;
      return {
        'Mod-b': toggleMark(type)
      };
    }
  }, {
    key: "commands",
    value: function commands(_ref2) {
      var type = _ref2.type;
      return function () {
        return toggleMark(type);
      };
    }
  }, {
    key: "inputRules",
    value: function inputRules(_ref3) {
      var type = _ref3.type;
      return [markInputRule(/(?:\*\*|__)([^*_]+)(?:\*\*|__)$/, type)];
    }
  }, {
    key: "pasteRules",
    value: function pasteRules(_ref4) {
      var type = _ref4.type;
      return [markPasteRule(/(?:\*\*|__)([^*_]+)(?:\*\*|__)/g, type)];
    }
  }, {
    key: "name",
    get: function get() {
      return 'bold';
    }
  }, {
    key: "schema",
    get: function get() {
      return {
        parseDOM: [{
          tag: 'strong'
        }, {
          tag: 'b',
          getAttrs: function getAttrs(node) {
            return node.style.fontWeight !== 'normal' && null;
          }
        }, {
          style: 'font-weight',
          getAttrs: function getAttrs(value) {
            return /^(bold(er)?|[5-9]\d{2,})$/.test(value) && null;
          }
        }],
        toDOM: function toDOM() {
          return ['strong', 0];
        }
      };
    }
  }]);

  return Bold;
}(Mark);

var Code =
/*#__PURE__*/
function (_Mark) {
  _inherits(Code, _Mark);

  function Code() {
    _classCallCheck(this, Code);

    return _possibleConstructorReturn(this, _getPrototypeOf(Code).apply(this, arguments));
  }

  _createClass(Code, [{
    key: "keys",
    value: function keys(_ref) {
      var type = _ref.type;
      return {
        'Mod-`': toggleMark(type)
      };
    }
  }, {
    key: "commands",
    value: function commands(_ref2) {
      var type = _ref2.type;
      return function () {
        return toggleMark(type);
      };
    }
  }, {
    key: "inputRules",
    value: function inputRules(_ref3) {
      var type = _ref3.type;
      return [markInputRule(/(?:`)([^`]+)(?:`)$/, type)];
    }
  }, {
    key: "pasteRules",
    value: function pasteRules(_ref4) {
      var type = _ref4.type;
      return [markPasteRule(/(?:`)([^`]+)(?:`)/g, type)];
    }
  }, {
    key: "name",
    get: function get() {
      return 'code';
    }
  }, {
    key: "schema",
    get: function get() {
      return {
        excludes: '_',
        parseDOM: [{
          tag: 'code'
        }],
        toDOM: function toDOM() {
          return ['code', 0];
        }
      };
    }
  }]);

  return Code;
}(Mark);

var Italic =
/*#__PURE__*/
function (_Mark) {
  _inherits(Italic, _Mark);

  function Italic() {
    _classCallCheck(this, Italic);

    return _possibleConstructorReturn(this, _getPrototypeOf(Italic).apply(this, arguments));
  }

  _createClass(Italic, [{
    key: "keys",
    value: function keys(_ref) {
      var type = _ref.type;
      return {
        'Mod-i': toggleMark(type)
      };
    }
  }, {
    key: "commands",
    value: function commands(_ref2) {
      var type = _ref2.type;
      return function () {
        return toggleMark(type);
      };
    }
  }, {
    key: "inputRules",
    value: function inputRules(_ref3) {
      var type = _ref3.type;
      return [markInputRule(/(?:^|[^_])(_([^_]+)_)$/, type), markInputRule(/(?:^|[^*])(\*([^*]+)\*)$/, type)];
    }
  }, {
    key: "pasteRules",
    value: function pasteRules(_ref4) {
      var type = _ref4.type;
      return [markPasteRule(/_([^_]+)_/g, type), markPasteRule(/\*([^*]+)\*/g, type)];
    }
  }, {
    key: "name",
    get: function get() {
      return 'italic';
    }
  }, {
    key: "schema",
    get: function get() {
      return {
        parseDOM: [{
          tag: 'i'
        }, {
          tag: 'em'
        }, {
          style: 'font-style=italic'
        }],
        toDOM: function toDOM() {
          return ['em', 0];
        }
      };
    }
  }]);

  return Italic;
}(Mark);

var Link =
/*#__PURE__*/
function (_Mark) {
  _inherits(Link, _Mark);

  function Link() {
    _classCallCheck(this, Link);

    return _possibleConstructorReturn(this, _getPrototypeOf(Link).apply(this, arguments));
  }

  _createClass(Link, [{
    key: "commands",
    value: function commands(_ref) {
      var type = _ref.type;
      return function (attrs) {
        if (attrs.href) {
          return updateMark(type, attrs);
        }

        return removeMark(type);
      };
    }
  }, {
    key: "pasteRules",
    value: function pasteRules(_ref2) {
      var type = _ref2.type;
      return [pasteRule(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-zA-Z]{2,}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/g, type, function (url) {
        return {
          href: url
        };
      })];
    }
  }, {
    key: "name",
    get: function get() {
      return 'link';
    }
  }, {
    key: "defaultOptions",
    get: function get() {
      return {
        openOnClick: true
      };
    }
  }, {
    key: "schema",
    get: function get() {
      return {
        attrs: {
          href: {
            default: null
          }
        },
        inclusive: false,
        parseDOM: [{
          tag: 'a[href]',
          getAttrs: function getAttrs(dom) {
            return {
              href: dom.getAttribute('href')
            };
          }
        }],
        toDOM: function toDOM(node) {
          return ['a', _objectSpread2({}, node.attrs, {
            rel: 'noopener noreferrer nofollow'
          }), 0];
        }
      };
    }
  }, {
    key: "plugins",
    get: function get() {
      if (!this.options.openOnClick) {
        return [];
      }

      return [new Plugin({
        props: {
          handleClick: function handleClick(view, pos, event) {
            var schema = view.state.schema;
            var attrs = getMarkAttrs(view.state, schema.marks.link);

            if (attrs.href && event.target instanceof HTMLAnchorElement) {
              event.stopPropagation();
              window.open(attrs.href);
            }
          }
        }
      })];
    }
  }]);

  return Link;
}(Mark);

var Strike =
/*#__PURE__*/
function (_Mark) {
  _inherits(Strike, _Mark);

  function Strike() {
    _classCallCheck(this, Strike);

    return _possibleConstructorReturn(this, _getPrototypeOf(Strike).apply(this, arguments));
  }

  _createClass(Strike, [{
    key: "keys",
    value: function keys(_ref) {
      var type = _ref.type;
      return {
        'Mod-d': toggleMark(type)
      };
    }
  }, {
    key: "commands",
    value: function commands(_ref2) {
      var type = _ref2.type;
      return function () {
        return toggleMark(type);
      };
    }
  }, {
    key: "inputRules",
    value: function inputRules(_ref3) {
      var type = _ref3.type;
      return [markInputRule(/~([^~]+)~$/, type)];
    }
  }, {
    key: "pasteRules",
    value: function pasteRules(_ref4) {
      var type = _ref4.type;
      return [markPasteRule(/~([^~]+)~/g, type)];
    }
  }, {
    key: "name",
    get: function get() {
      return 'strike';
    }
  }, {
    key: "schema",
    get: function get() {
      return {
        parseDOM: [{
          tag: 's'
        }, {
          tag: 'del'
        }, {
          tag: 'strike'
        }, {
          style: 'text-decoration',
          getAttrs: function getAttrs(value) {
            return value === 'line-through';
          }
        }],
        toDOM: function toDOM() {
          return ['s', 0];
        }
      };
    }
  }]);

  return Strike;
}(Mark);

var Underline =
/*#__PURE__*/
function (_Mark) {
  _inherits(Underline, _Mark);

  function Underline() {
    _classCallCheck(this, Underline);

    return _possibleConstructorReturn(this, _getPrototypeOf(Underline).apply(this, arguments));
  }

  _createClass(Underline, [{
    key: "keys",
    value: function keys(_ref) {
      var type = _ref.type;
      return {
        'Mod-u': toggleMark(type)
      };
    }
  }, {
    key: "commands",
    value: function commands(_ref2) {
      var type = _ref2.type;
      return function () {
        return toggleMark(type);
      };
    }
  }, {
    key: "name",
    get: function get() {
      return 'underline';
    }
  }, {
    key: "schema",
    get: function get() {
      return {
        parseDOM: [{
          tag: 'u'
        }, {
          style: 'text-decoration',
          getAttrs: function getAttrs(value) {
            return value === 'underline';
          }
        }],
        toDOM: function toDOM() {
          return ['u', 0];
        }
      };
    }
  }]);

  return Underline;
}(Mark);

var Collaboration =
/*#__PURE__*/
function (_Extension) {
  _inherits(Collaboration, _Extension);

  function Collaboration() {
    _classCallCheck(this, Collaboration);

    return _possibleConstructorReturn(this, _getPrototypeOf(Collaboration).apply(this, arguments));
  }

  _createClass(Collaboration, [{
    key: "init",
    value: function init() {
      var _this = this;

      this.getSendableSteps = this.debounce(function (state) {
        var sendable = sendableSteps(state);

        if (sendable) {
          _this.options.onSendable({
            editor: _this.editor,
            sendable: {
              version: sendable.version,
              steps: sendable.steps.map(function (step) {
                return step.toJSON();
              }),
              clientID: sendable.clientID
            }
          });
        }
      }, this.options.debounce);
      this.editor.on('transaction', function (_ref) {
        var state = _ref.state;

        _this.getSendableSteps(state);
      });
    }
  }, {
    key: "debounce",
    value: function debounce(fn, delay) {
      var timeout;
      return function () {
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        if (timeout) {
          clearTimeout(timeout);
        }

        timeout = setTimeout(function () {
          fn.apply(void 0, args);
          timeout = null;
        }, delay);
      };
    }
  }, {
    key: "name",
    get: function get() {
      return 'collaboration';
    }
  }, {
    key: "defaultOptions",
    get: function get() {
      var _this2 = this;

      return {
        version: 0,
        clientID: Math.floor(Math.random() * 0xFFFFFFFF),
        debounce: 250,
        onSendable: function onSendable() {},
        update: function update(_ref2) {
          var steps = _ref2.steps,
              version = _ref2.version;
          var _this2$editor = _this2.editor,
              state = _this2$editor.state,
              view = _this2$editor.view,
              schema = _this2$editor.schema;

          if (getVersion(state) > version) {
            return;
          }

          view.dispatch(receiveTransaction(state, steps.map(function (item) {
            return Step.fromJSON(schema, item.step);
          }), steps.map(function (item) {
            return item.clientID;
          })));
        }
      };
    }
  }, {
    key: "plugins",
    get: function get() {
      return [collab({
        version: this.options.version,
        clientID: this.options.clientID
      })];
    }
  }]);

  return Collaboration;
}(Extension);

var Focus =
/*#__PURE__*/
function (_Extension) {
  _inherits(Focus, _Extension);

  function Focus() {
    _classCallCheck(this, Focus);

    return _possibleConstructorReturn(this, _getPrototypeOf(Focus).apply(this, arguments));
  }

  _createClass(Focus, [{
    key: "name",
    get: function get() {
      return 'focus';
    }
  }, {
    key: "defaultOptions",
    get: function get() {
      return {
        className: 'has-focus',
        nested: false
      };
    }
  }, {
    key: "plugins",
    get: function get() {
      var _this = this;

      return [new Plugin({
        props: {
          decorations: function decorations(_ref) {
            var doc = _ref.doc,
                plugins = _ref.plugins,
                selection = _ref.selection;
            var editablePlugin = plugins.find(function (plugin) {
              return plugin.key.startsWith('editable$');
            });
            var editable = editablePlugin.props.editable();
            var active = editable && _this.options.className;
            var focused = _this.editor.focused;
            var anchor = selection.anchor;
            var decorations = [];

            if (!active || !focused) {
              return false;
            }

            doc.descendants(function (node, pos) {
              var hasAnchor = anchor >= pos && anchor <= pos + node.nodeSize;

              if (hasAnchor && !node.isText) {
                var decoration = Decoration.node(pos, pos + node.nodeSize, {
                  class: _this.options.className
                });
                decorations.push(decoration);
              }

              return _this.options.nested;
            });
            return DecorationSet.create(doc, decorations);
          }
        }
      })];
    }
  }]);

  return Focus;
}(Extension);

var History =
/*#__PURE__*/
function (_Extension) {
  _inherits(History, _Extension);

  function History() {
    _classCallCheck(this, History);

    return _possibleConstructorReturn(this, _getPrototypeOf(History).apply(this, arguments));
  }

  _createClass(History, [{
    key: "keys",
    value: function keys() {
      var keymap = {
        'Mod-z': undo,
        'Mod-y': redo,
        'Shift-Mod-z': redo
      };
      return keymap;
    }
  }, {
    key: "commands",
    value: function commands() {
      return {
        undo: function undo$1() {
          return undo;
        },
        redo: function redo$1() {
          return redo;
        },
        undoDepth: function undoDepth$1() {
          return undoDepth;
        },
        redoDepth: function redoDepth$1() {
          return redoDepth;
        }
      };
    }
  }, {
    key: "name",
    get: function get() {
      return 'history';
    }
  }, {
    key: "defaultOptions",
    get: function get() {
      return {
        depth: '',
        newGroupDelay: ''
      };
    }
  }, {
    key: "plugins",
    get: function get() {
      return [history({
        depth: this.options.depth,
        newGroupDelay: this.options.newGroupDelay
      })];
    }
  }]);

  return History;
}(Extension);

var Placeholder =
/*#__PURE__*/
function (_Extension) {
  _inherits(Placeholder, _Extension);

  function Placeholder() {
    _classCallCheck(this, Placeholder);

    return _possibleConstructorReturn(this, _getPrototypeOf(Placeholder).apply(this, arguments));
  }

  _createClass(Placeholder, [{
    key: "name",
    get: function get() {
      return 'placeholder';
    }
  }, {
    key: "defaultOptions",
    get: function get() {
      return {
        emptyEditorClass: 'is-editor-empty',
        emptyNodeClass: 'is-empty',
        emptyNodeText: 'Write something …',
        showOnlyWhenEditable: true,
        showOnlyCurrent: true
      };
    }
  }, {
    key: "update",
    get: function get() {
      return function (view) {
        view.updateState(view.state);
      };
    }
  }, {
    key: "plugins",
    get: function get() {
      var _this = this;

      return [new Plugin({
        props: {
          decorations: function decorations(_ref) {
            var doc = _ref.doc,
                plugins = _ref.plugins,
                selection = _ref.selection;
            var editablePlugin = plugins.find(function (plugin) {
              return plugin.key.startsWith('editable$');
            });
            var editable = editablePlugin.props.editable();
            var active = editable || !_this.options.showOnlyWhenEditable;
            var anchor = selection.anchor;
            var decorations = [];
            var isEditorEmpty = doc.textContent.length === 0;

            if (!active) {
              return false;
            }

            doc.descendants(function (node, pos) {
              var hasAnchor = anchor >= pos && anchor <= pos + node.nodeSize;
              var isNodeEmpty = node.content.size === 0;

              if ((hasAnchor || !_this.options.showOnlyCurrent) && isNodeEmpty) {
                var classes = [_this.options.emptyNodeClass];

                if (isEditorEmpty) {
                  classes.push(_this.options.emptyEditorClass);
                }

                var decoration = Decoration.node(pos, pos + node.nodeSize, {
                  class: classes.join(' '),
                  'data-empty-text': typeof _this.options.emptyNodeText === 'function' ? _this.options.emptyNodeText(node) : _this.options.emptyNodeText
                });
                decorations.push(decoration);
              }

              return false;
            });
            return DecorationSet.create(doc, decorations);
          }
        }
      })];
    }
  }]);

  return Placeholder;
}(Extension);

var Search =
/*#__PURE__*/
function (_Extension) {
  _inherits(Search, _Extension);

  function Search() {
    var _this;

    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Search);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Search).call(this, options));
    _this.results = [];
    _this.searchTerm = null;
    _this._updating = false;
    return _this;
  }

  _createClass(Search, [{
    key: "commands",
    value: function commands() {
      var _this2 = this;

      return {
        find: function find(attrs) {
          return _this2.find(attrs);
        },
        replace: function replace(attrs) {
          return _this2.replace(attrs);
        },
        replaceAll: function replaceAll(attrs) {
          return _this2.replaceAll(attrs);
        },
        clearSearch: function clearSearch() {
          return _this2.clear();
        }
      };
    }
  }, {
    key: "_search",
    value: function _search(doc) {
      var _this3 = this;

      this.results = [];
      var mergedTextNodes = [];
      var index = 0;

      if (!this.searchTerm) {
        return;
      }

      doc.descendants(function (node, pos) {
        if (node.isText) {
          if (mergedTextNodes[index]) {
            mergedTextNodes[index] = {
              text: mergedTextNodes[index].text + node.text,
              pos: mergedTextNodes[index].pos
            };
          } else {
            mergedTextNodes[index] = {
              text: node.text,
              pos: pos
            };
          }
        } else {
          index += 1;
        }
      });
      mergedTextNodes.forEach(function (_ref) {
        var text = _ref.text,
            pos = _ref.pos;
        var search = _this3.findRegExp;
        var m; // eslint-disable-next-line no-cond-assign

        while (m = search.exec(text)) {
          if (m[0] === '') {
            break;
          }

          _this3.results.push({
            from: pos + m.index,
            to: pos + m.index + m[0].length
          });
        }
      });
    }
  }, {
    key: "replace",
    value: function replace(_replace) {
      var _this4 = this;

      return function (state, dispatch) {
        var firstResult = _this4.results[0];

        if (!firstResult) {
          return;
        }

        var _this4$results$ = _this4.results[0],
            from = _this4$results$.from,
            to = _this4$results$.to;
        dispatch(state.tr.insertText(_replace, from, to));

        _this4.editor.commands.find(_this4.searchTerm);
      };
    }
  }, {
    key: "rebaseNextResult",
    value: function rebaseNextResult(replace, index) {
      var lastOffset = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      var nextIndex = index + 1;

      if (!this.results[nextIndex]) {
        return null;
      }

      var _this$results$index = this.results[index],
          currentFrom = _this$results$index.from,
          currentTo = _this$results$index.to;
      var offset = currentTo - currentFrom - replace.length + lastOffset;
      var _this$results$nextInd = this.results[nextIndex],
          from = _this$results$nextInd.from,
          to = _this$results$nextInd.to;
      this.results[nextIndex] = {
        to: to - offset,
        from: from - offset
      };
      return offset;
    }
  }, {
    key: "replaceAll",
    value: function replaceAll(replace) {
      var _this5 = this;

      return function (_ref2, dispatch) {
        var tr = _ref2.tr;
        var offset;

        if (!_this5.results.length) {
          return;
        }

        _this5.results.forEach(function (_ref3, index) {
          var from = _ref3.from,
              to = _ref3.to;
          tr.insertText(replace, from, to);
          offset = _this5.rebaseNextResult(replace, index, offset);
        });

        dispatch(tr);

        _this5.editor.commands.find(_this5.searchTerm);
      };
    }
  }, {
    key: "find",
    value: function find(searchTerm) {
      var _this6 = this;

      return function (state, dispatch) {
        _this6.searchTerm = _this6.options.disableRegex ? searchTerm.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&') : searchTerm;

        _this6.updateView(state, dispatch);
      };
    }
  }, {
    key: "clear",
    value: function clear() {
      var _this7 = this;

      return function (state, dispatch) {
        _this7.searchTerm = null;

        _this7.updateView(state, dispatch);
      };
    }
  }, {
    key: "updateView",
    value: function updateView(_ref4, dispatch) {
      var tr = _ref4.tr;
      this._updating = true;
      dispatch(tr);
      this._updating = false;
    }
  }, {
    key: "createDeco",
    value: function createDeco(doc) {
      this._search(doc);

      return this.decorations ? DecorationSet.create(doc, this.decorations) : [];
    }
  }, {
    key: "name",
    get: function get() {
      return 'search';
    }
  }, {
    key: "defaultOptions",
    get: function get() {
      return {
        autoSelectNext: true,
        findClass: 'find',
        searching: false,
        caseSensitive: false,
        disableRegex: true,
        alwaysSearch: false
      };
    }
  }, {
    key: "findRegExp",
    get: function get() {
      return RegExp(this.searchTerm, !this.options.caseSensitive ? 'gui' : 'gu');
    }
  }, {
    key: "decorations",
    get: function get() {
      var _this8 = this;

      return this.results.map(function (deco) {
        return Decoration.inline(deco.from, deco.to, {
          class: _this8.options.findClass
        });
      });
    }
  }, {
    key: "plugins",
    get: function get() {
      var _this9 = this;

      return [new Plugin({
        state: {
          init: function init() {
            return DecorationSet.empty;
          },
          apply: function apply(tr, old) {
            if (_this9._updating || _this9.options.searching || tr.docChanged && _this9.options.alwaysSearch) {
              return _this9.createDeco(tr.doc);
            }

            if (tr.docChanged) {
              return old.map(tr.mapping, tr.doc);
            }

            return old;
          }
        },
        props: {
          decorations: function decorations(state) {
            return this.getState(state);
          }
        }
      })];
    }
  }]);

  return Search;
}(Extension);

var TrailingNode =
/*#__PURE__*/
function (_Extension) {
  _inherits(TrailingNode, _Extension);

  function TrailingNode() {
    _classCallCheck(this, TrailingNode);

    return _possibleConstructorReturn(this, _getPrototypeOf(TrailingNode).apply(this, arguments));
  }

  _createClass(TrailingNode, [{
    key: "name",
    get: function get() {
      return 'trailing_node';
    }
  }, {
    key: "defaultOptions",
    get: function get() {
      return {
        node: 'paragraph',
        notAfter: ['paragraph']
      };
    }
  }, {
    key: "plugins",
    get: function get() {
      var _this = this;

      var plugin = new PluginKey(this.name);
      var disabledNodes = Object.entries(this.editor.schema.nodes).map(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
            value = _ref2[1];

        return value;
      }).filter(function (node) {
        return _this.options.notAfter.includes(node.name);
      });
      return [new Plugin({
        key: plugin,
        view: function view() {
          return {
            update: function update(view) {
              var state = view.state;
              var insertNodeAtEnd = plugin.getState(state);

              if (!insertNodeAtEnd) {
                return;
              }

              var doc = state.doc,
                  schema = state.schema,
                  tr = state.tr;
              var type = schema.nodes[_this.options.node];
              var transaction = tr.insert(doc.content.size, type.create());
              view.dispatch(transaction);
            }
          };
        },
        state: {
          init: function init(_, state) {
            var lastNode = state.tr.doc.lastChild;
            return !nodeEqualsType({
              node: lastNode,
              types: disabledNodes
            });
          },
          apply: function apply(tr, value) {
            if (!tr.docChanged) {
              return value;
            }

            var lastNode = tr.doc.lastChild;
            return !nodeEqualsType({
              node: lastNode,
              types: disabledNodes
            });
          }
        }
      })];
    }
  }]);

  return TrailingNode;
}(Extension);

export { Blockquote, Bold, BulletList, Code, CodeBlock, CodeBlockHighlight, Collaboration, Focus, HardBreak, Heading, HighlightPlugin as Highlight, History, HorizontalRule, Image, Italic, Link, ListItem, Mention, OrderedList, Placeholder, Search, Strike, SuggestionsPlugin as Suggestions, Table, TableCell, TableHeader, TableRow, TodoItem, TodoList, TrailingNode, Underline };
