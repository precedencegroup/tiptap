
    /*!
    * tiptap-commands v1.12.5
    * (c) 2020 Scrumpy UG (limited liability)
    * @license MIT
    */
  
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('prosemirror-commands'), require('prosemirror-schema-list'), require('prosemirror-inputrules'), require('prosemirror-state'), require('prosemirror-model'), require('tiptap-utils'), require('prosemirror-utils')) :
  typeof define === 'function' && define.amd ? define(['exports', 'prosemirror-commands', 'prosemirror-schema-list', 'prosemirror-inputrules', 'prosemirror-state', 'prosemirror-model', 'tiptap-utils', 'prosemirror-utils'], factory) :
  (global = global || self, factory(global.tiptapCommands = {}, global.prosemirrorCommands, global.prosemirrorSchemaList, global.prosemirrorInputrules, global.prosemirrorState, global.prosemirrorModel, global.tiptapUtils, global.prosemirrorUtils));
}(this, (function (exports, prosemirrorCommands, prosemirrorSchemaList, prosemirrorInputrules, prosemirrorState, prosemirrorModel, tiptapUtils, prosemirrorUtils) { 'use strict';

  function insertText () {
    var text = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    return function (state, dispatch) {
      var $from = state.selection.$from;
      var pos = $from.pos.pos;
      dispatch(state.tr.insertText(text, pos));
      return true;
    };
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

  function _iterableToArray(iter) {
    if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance");
  }

  function getMarksBetween(start, end, state) {
    var marks = [];
    state.doc.nodesBetween(start, end, function (node, pos) {
      marks = [].concat(_toConsumableArray(marks), _toConsumableArray(node.marks.map(function (mark) {
        return {
          start: pos,
          end: pos + node.nodeSize,
          mark: mark
        };
      })));
    });
    return marks;
  }

  function markInputRule (regexp, markType, getAttrs) {
    return new prosemirrorInputrules.InputRule(regexp, function (state, match, start, end) {
      var attrs = getAttrs instanceof Function ? getAttrs(match) : getAttrs;
      var tr = state.tr;
      var m = match.length - 1;
      var markEnd = end;
      var markStart = start;

      if (match[m]) {
        var matchStart = start + match[0].indexOf(match[m - 1]);
        var matchEnd = matchStart + match[m - 1].length - 1;
        var textStart = matchStart + match[m - 1].lastIndexOf(match[m]);
        var textEnd = textStart + match[m].length;
        var excludedMarks = getMarksBetween(start, end, state).filter(function (item) {
          var excluded = item.mark.type.excluded;
          return excluded.find(function (type) {
            return type.name === markType.name;
          });
        }).filter(function (item) {
          return item.end > matchStart;
        });

        if (excludedMarks.length) {
          return false;
        }

        if (textEnd < matchEnd) {
          tr.delete(textEnd, matchEnd);
        }

        if (textStart > matchStart) {
          tr.delete(matchStart, textStart);
        }

        markStart = matchStart;
        markEnd = markStart + match[m].length;
      }

      tr.addMark(markStart, markEnd, markType.create(attrs));
      tr.removeStoredMark(markType);
      return tr;
    });
  }

  function nodeInputRule (regexp, type, getAttrs) {
    return new prosemirrorInputrules.InputRule(regexp, function (state, match, start, end) {
      var attrs = getAttrs instanceof Function ? getAttrs(match) : getAttrs;
      var tr = state.tr;

      if (match[0]) {
        tr.replaceWith(start - 1, end, type.create(attrs));
      }

      return tr;
    });
  }

  function pasteRule (regexp, type, getAttrs) {
    var handler = function handler(fragment) {
      var nodes = [];
      fragment.forEach(function (child) {
        if (child.isText) {
          var text = child.text;
          var pos = 0;
          var match;

          do {
            match = regexp.exec(text);

            if (match) {
              var start = match.index;
              var end = start + match[0].length;
              var attrs = getAttrs instanceof Function ? getAttrs(match[0]) : getAttrs;

              if (start > 0) {
                nodes.push(child.cut(pos, start));
              }

              nodes.push(child.cut(start, end).mark(type.create(attrs).addToSet(child.marks)));
              pos = end;
            }
          } while (match);

          if (pos < text.length) {
            nodes.push(child.cut(pos));
          }
        } else {
          nodes.push(child.copy(handler(child.content)));
        }
      });
      return prosemirrorModel.Fragment.fromArray(nodes);
    };

    return new prosemirrorState.Plugin({
      props: {
        transformPasted: function transformPasted(slice) {
          return new prosemirrorModel.Slice(handler(slice.content), slice.openStart, slice.openEnd);
        }
      }
    });
  }

  function markPasteRule (regexp, type, getAttrs) {
    var handler = function handler(fragment) {
      var nodes = [];
      fragment.forEach(function (child) {
        if (child.isText) {
          var text = child.text,
              marks = child.marks;
          var pos = 0;
          var match;
          var isLink = !!marks.filter(function (x) {
            return x.type.name === 'link';
          })[0]; // eslint-disable-next-line

          while (!isLink && (match = regexp.exec(text)) !== null) {
            if (match[1]) {
              var start = match.index;
              var end = start + match[0].length;
              var textStart = start + match[0].indexOf(match[1]);
              var textEnd = textStart + match[1].length;
              var attrs = getAttrs instanceof Function ? getAttrs(match) : getAttrs; // adding text before markdown to nodes

              if (start > 0) {
                nodes.push(child.cut(pos, start));
              } // adding the markdown part to nodes


              nodes.push(child.cut(textStart, textEnd).mark(type.create(attrs).addToSet(child.marks)));
              pos = end;
            }
          } // adding rest of text to nodes


          if (pos < text.length) {
            nodes.push(child.cut(pos));
          }
        } else {
          nodes.push(child.copy(handler(child.content)));
        }
      });
      return prosemirrorModel.Fragment.fromArray(nodes);
    };

    return new prosemirrorState.Plugin({
      props: {
        transformPasted: function transformPasted(slice) {
          return new prosemirrorModel.Slice(handler(slice.content), slice.openStart, slice.openEnd);
        }
      }
    });
  }

  function removeMark (type) {
    return function (state, dispatch) {
      var tr = state.tr,
          selection = state.selection;
      var from = selection.from,
          to = selection.to;
      var $from = selection.$from,
          empty = selection.empty;

      if (empty) {
        var range = tiptapUtils.getMarkRange($from, type);
        from = range.from;
        to = range.to;
      }

      tr.removeMark(from, to, type);
      return dispatch(tr);
    };
  }

  function replaceText () {
    var range = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    var type = arguments.length > 1 ? arguments[1] : undefined;
    var attrs = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    return function (state, dispatch) {
      var _state$selection = state.selection,
          $from = _state$selection.$from,
          $to = _state$selection.$to;
      var index = $from.index();
      var from = range ? range.from : $from.pos;
      var to = range ? range.to : $to.pos;

      if (!$from.parent.canReplaceWith(index, index, type)) {
        return false;
      }

      if (dispatch) {
        dispatch(state.tr.replaceWith(from, to, type.create(attrs)));
      }

      return true;
    };
  }

  function setInlineBlockType (type) {
    var attrs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return function (state, dispatch) {
      var $from = state.selection.$from;
      var index = $from.index();

      if (!$from.parent.canReplaceWith(index, index, type)) {
        return false;
      }

      if (dispatch) {
        dispatch(state.tr.replaceSelectionWith(type.create(attrs)));
      }

      return true;
    };
  }

  // see https://github.com/ProseMirror/prosemirror-transform/blob/master/src/structure.js
  // Since this piece of code was "borrowed" from prosemirror, ESLint rules are ignored.

  /* eslint-disable max-len, no-plusplus, no-undef, eqeqeq */

  function canSplit(doc, pos) {
    var depth = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
    var typesAfter = arguments.length > 3 ? arguments[3] : undefined;
    var $pos = doc.resolve(pos);
    var base = $pos.depth - depth;
    var innerType = typesAfter && typesAfter[typesAfter.length - 1] || $pos.parent;
    if (base < 0 || $pos.parent.type.spec.isolating || !$pos.parent.canReplace($pos.index(), $pos.parent.childCount) || !innerType.type.validContent($pos.parent.content.cutByIndex($pos.index(), $pos.parent.childCount))) return false;

    for (var d = $pos.depth - 1, i = depth - 2; d > base; d--, i--) {
      var node = $pos.node(d);

      var _index = $pos.index(d);

      if (node.type.spec.isolating) return false;
      var rest = node.content.cutByIndex(_index, node.childCount);
      var after = typesAfter && typesAfter[i] || node;
      if (after != node) rest = rest.replaceChild(0, after.type.create(after.attrs));
      /* Change starts from here */
      // if (!node.canReplace(index + 1, node.childCount) || !after.type.validContent(rest))
      //   return false

      if (!node.canReplace(_index + 1, node.childCount)) return false;
      /* Change ends here */
    }

    var index = $pos.indexAfter(base);
    var baseType = typesAfter && typesAfter[0];
    return $pos.node(base).canReplaceWith(index, index, baseType ? baseType.type : $pos.node(base + 1).type);
  } // this is a copy of splitListItem
  // see https://github.com/ProseMirror/prosemirror-schema-list/blob/master/src/schema-list.js


  function splitToDefaultListItem(itemType) {
    return function (state, dispatch) {
      var _state$selection = state.selection,
          $from = _state$selection.$from,
          $to = _state$selection.$to,
          node = _state$selection.node;
      if (node && node.isBlock || $from.depth < 2 || !$from.sameParent($to)) return false;
      var grandParent = $from.node(-1);
      if (grandParent.type != itemType) return false;

      if ($from.parent.content.size == 0) {
        // In an empty block. If this is a nested list, the wrapping
        // list item should be split. Otherwise, bail out and let next
        // command handle lifting.
        if ($from.depth == 2 || $from.node(-3).type != itemType || $from.index(-2) != $from.node(-2).childCount - 1) return false;

        if (dispatch) {
          var wrap = prosemirrorModel.Fragment.empty;
          var keepItem = $from.index(-1) > 0; // Build a fragment containing empty versions of the structure
          // from the outer list item to the parent node of the cursor

          for (var d = $from.depth - (keepItem ? 1 : 2); d >= $from.depth - 3; d--) {
            wrap = prosemirrorModel.Fragment.from($from.node(d).copy(wrap));
          } // Add a second list item with an empty default start node


          wrap = wrap.append(prosemirrorModel.Fragment.from(itemType.createAndFill()));

          var _tr = state.tr.replace($from.before(keepItem ? null : -1), $from.after(-3), new prosemirrorModel.Slice(wrap, keepItem ? 3 : 2, 2));

          _tr.setSelection(state.selection.constructor.near(_tr.doc.resolve($from.pos + (keepItem ? 3 : 2))));

          dispatch(_tr.scrollIntoView());
        }

        return true;
      }

      var nextType = $to.pos == $from.end() ? grandParent.contentMatchAt($from.indexAfter(-1)).defaultType : null;
      var tr = state.tr.delete($from.pos, $to.pos);
      /* Change starts from here */
      // let types = nextType && [null, {type: nextType}]

      var types = nextType && [{
        type: itemType
      }, {
        type: nextType
      }];
      if (!types) types = [{
        type: itemType
      }, null];
      /* Change ends here */

      if (!canSplit(tr.doc, $from.pos, 2, types)) return false;
      if (dispatch) dispatch(tr.split($from.pos, 2, types).scrollIntoView());
      return true;
    };
  }
  /* eslint-enable max-len, no-plusplus, no-undef, eqeqeq */

  function toggleBlockType (type, toggletype) {
    var attrs = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    return function (state, dispatch, view) {
      var isActive = tiptapUtils.nodeIsActive(state, type, attrs);

      if (isActive) {
        return prosemirrorCommands.setBlockType(toggletype)(state, dispatch, view);
      }

      return prosemirrorCommands.setBlockType(type, attrs)(state, dispatch, view);
    };
  }

  function isList(node, schema) {
    return node.type === schema.nodes.bullet_list || node.type === schema.nodes.ordered_list || node.type === schema.nodes.todo_list;
  }

  function toggleList(listType, itemType) {
    return function (state, dispatch, view) {
      var schema = state.schema,
          selection = state.selection;
      var $from = selection.$from,
          $to = selection.$to;
      var range = $from.blockRange($to);

      if (!range) {
        return false;
      }

      var parentList = prosemirrorUtils.findParentNode(function (node) {
        return isList(node, schema);
      })(selection);

      if (range.depth >= 1 && parentList && range.depth - parentList.depth <= 1) {
        if (parentList.node.type === listType) {
          return prosemirrorSchemaList.liftListItem(itemType)(state, dispatch, view);
        }

        if (isList(parentList.node, schema) && listType.validContent(parentList.node.content)) {
          var tr = state.tr;
          tr.setNodeMarkup(parentList.pos, listType);

          if (dispatch) {
            dispatch(tr);
          }

          return false;
        }
      }

      return prosemirrorSchemaList.wrapInList(listType)(state, dispatch, view);
    };
  }

  function toggleWrap (type) {
    return function (state, dispatch, view) {
      var isActive = tiptapUtils.nodeIsActive(state, type);

      if (isActive) {
        return prosemirrorCommands.lift(state, dispatch);
      }

      return prosemirrorCommands.wrapIn(type)(state, dispatch, view);
    };
  }

  function updateMark (type, attrs) {
    return function (state, dispatch) {
      var tr = state.tr,
          selection = state.selection,
          doc = state.doc;
      var from = selection.from,
          to = selection.to;
      var $from = selection.$from,
          empty = selection.empty;

      if (empty) {
        var range = tiptapUtils.getMarkRange($from, type);
        from = range.from;
        to = range.to;
      }

      var hasMark = doc.rangeHasMark(from, to, type);

      if (hasMark) {
        tr.removeMark(from, to, type);
      }

      tr.addMark(from, to, type.create(attrs));
      return dispatch(tr);
    };
  }

  Object.defineProperty(exports, 'autoJoin', {
    enumerable: true,
    get: function () {
      return prosemirrorCommands.autoJoin;
    }
  });
  Object.defineProperty(exports, 'baseKeymap', {
    enumerable: true,
    get: function () {
      return prosemirrorCommands.baseKeymap;
    }
  });
  Object.defineProperty(exports, 'chainCommands', {
    enumerable: true,
    get: function () {
      return prosemirrorCommands.chainCommands;
    }
  });
  Object.defineProperty(exports, 'createParagraphNear', {
    enumerable: true,
    get: function () {
      return prosemirrorCommands.createParagraphNear;
    }
  });
  Object.defineProperty(exports, 'deleteSelection', {
    enumerable: true,
    get: function () {
      return prosemirrorCommands.deleteSelection;
    }
  });
  Object.defineProperty(exports, 'exitCode', {
    enumerable: true,
    get: function () {
      return prosemirrorCommands.exitCode;
    }
  });
  Object.defineProperty(exports, 'joinBackward', {
    enumerable: true,
    get: function () {
      return prosemirrorCommands.joinBackward;
    }
  });
  Object.defineProperty(exports, 'joinDown', {
    enumerable: true,
    get: function () {
      return prosemirrorCommands.joinDown;
    }
  });
  Object.defineProperty(exports, 'joinForward', {
    enumerable: true,
    get: function () {
      return prosemirrorCommands.joinForward;
    }
  });
  Object.defineProperty(exports, 'joinUp', {
    enumerable: true,
    get: function () {
      return prosemirrorCommands.joinUp;
    }
  });
  Object.defineProperty(exports, 'lift', {
    enumerable: true,
    get: function () {
      return prosemirrorCommands.lift;
    }
  });
  Object.defineProperty(exports, 'liftEmptyBlock', {
    enumerable: true,
    get: function () {
      return prosemirrorCommands.liftEmptyBlock;
    }
  });
  Object.defineProperty(exports, 'macBaseKeymap', {
    enumerable: true,
    get: function () {
      return prosemirrorCommands.macBaseKeymap;
    }
  });
  Object.defineProperty(exports, 'newlineInCode', {
    enumerable: true,
    get: function () {
      return prosemirrorCommands.newlineInCode;
    }
  });
  Object.defineProperty(exports, 'pcBaseKeymap', {
    enumerable: true,
    get: function () {
      return prosemirrorCommands.pcBaseKeymap;
    }
  });
  Object.defineProperty(exports, 'selectAll', {
    enumerable: true,
    get: function () {
      return prosemirrorCommands.selectAll;
    }
  });
  Object.defineProperty(exports, 'selectNodeBackward', {
    enumerable: true,
    get: function () {
      return prosemirrorCommands.selectNodeBackward;
    }
  });
  Object.defineProperty(exports, 'selectNodeForward', {
    enumerable: true,
    get: function () {
      return prosemirrorCommands.selectNodeForward;
    }
  });
  Object.defineProperty(exports, 'selectParentNode', {
    enumerable: true,
    get: function () {
      return prosemirrorCommands.selectParentNode;
    }
  });
  Object.defineProperty(exports, 'setBlockType', {
    enumerable: true,
    get: function () {
      return prosemirrorCommands.setBlockType;
    }
  });
  Object.defineProperty(exports, 'splitBlock', {
    enumerable: true,
    get: function () {
      return prosemirrorCommands.splitBlock;
    }
  });
  Object.defineProperty(exports, 'splitBlockKeepMarks', {
    enumerable: true,
    get: function () {
      return prosemirrorCommands.splitBlockKeepMarks;
    }
  });
  Object.defineProperty(exports, 'toggleMark', {
    enumerable: true,
    get: function () {
      return prosemirrorCommands.toggleMark;
    }
  });
  Object.defineProperty(exports, 'wrapIn', {
    enumerable: true,
    get: function () {
      return prosemirrorCommands.wrapIn;
    }
  });
  Object.defineProperty(exports, 'addListNodes', {
    enumerable: true,
    get: function () {
      return prosemirrorSchemaList.addListNodes;
    }
  });
  Object.defineProperty(exports, 'liftListItem', {
    enumerable: true,
    get: function () {
      return prosemirrorSchemaList.liftListItem;
    }
  });
  Object.defineProperty(exports, 'sinkListItem', {
    enumerable: true,
    get: function () {
      return prosemirrorSchemaList.sinkListItem;
    }
  });
  Object.defineProperty(exports, 'splitListItem', {
    enumerable: true,
    get: function () {
      return prosemirrorSchemaList.splitListItem;
    }
  });
  Object.defineProperty(exports, 'wrapInList', {
    enumerable: true,
    get: function () {
      return prosemirrorSchemaList.wrapInList;
    }
  });
  Object.defineProperty(exports, 'textblockTypeInputRule', {
    enumerable: true,
    get: function () {
      return prosemirrorInputrules.textblockTypeInputRule;
    }
  });
  Object.defineProperty(exports, 'wrappingInputRule', {
    enumerable: true,
    get: function () {
      return prosemirrorInputrules.wrappingInputRule;
    }
  });
  exports.insertText = insertText;
  exports.markInputRule = markInputRule;
  exports.markPasteRule = markPasteRule;
  exports.nodeInputRule = nodeInputRule;
  exports.pasteRule = pasteRule;
  exports.removeMark = removeMark;
  exports.replaceText = replaceText;
  exports.setInlineBlockType = setInlineBlockType;
  exports.splitToDefaultListItem = splitToDefaultListItem;
  exports.toggleBlockType = toggleBlockType;
  exports.toggleList = toggleList;
  exports.toggleWrap = toggleWrap;
  exports.updateMark = updateMark;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
