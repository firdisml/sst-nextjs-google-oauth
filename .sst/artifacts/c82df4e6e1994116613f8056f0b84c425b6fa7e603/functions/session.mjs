import { createRequire as topLevelCreateRequire } from 'module';
const require = topLevelCreateRequire(import.meta.url);
import { fileURLToPath as topLevelFileUrlToPath, URL as topLevelURL } from "url"
const __dirname = topLevelFileUrlToPath(new topLevelURL(".", import.meta.url))

var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __require = /* @__PURE__ */ ((x3) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x3, {
  get: (a6, b6) => (typeof require !== "undefined" ? require : a6)[b6]
}) : x3)(function(x3) {
  if (typeof require !== "undefined")
    return require.apply(this, arguments);
  throw new Error('Dynamic require of "' + x3 + '" is not supported');
});
var __commonJS = (cb, mod) => function __require2() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/fast-xml-parser/src/util.js
var require_util = __commonJS({
  "node_modules/fast-xml-parser/src/util.js"(exports) {
    "use strict";
    var nameStartChar = ":A-Za-z_\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD";
    var nameChar = nameStartChar + "\\-.\\d\\u00B7\\u0300-\\u036F\\u203F-\\u2040";
    var nameRegexp = "[" + nameStartChar + "][" + nameChar + "]*";
    var regexName = new RegExp("^" + nameRegexp + "$");
    var getAllMatches = /* @__PURE__ */ __name(function(string, regex) {
      const matches = [];
      let match = regex.exec(string);
      while (match) {
        const allmatches = [];
        allmatches.startIndex = regex.lastIndex - match[0].length;
        const len = match.length;
        for (let index = 0; index < len; index++) {
          allmatches.push(match[index]);
        }
        matches.push(allmatches);
        match = regex.exec(string);
      }
      return matches;
    }, "getAllMatches");
    var isName = /* @__PURE__ */ __name(function(string) {
      const match = regexName.exec(string);
      return !(match === null || typeof match === "undefined");
    }, "isName");
    exports.isExist = function(v5) {
      return typeof v5 !== "undefined";
    };
    exports.isEmptyObject = function(obj) {
      return Object.keys(obj).length === 0;
    };
    exports.merge = function(target, a6, arrayMode) {
      if (a6) {
        const keys = Object.keys(a6);
        const len = keys.length;
        for (let i6 = 0; i6 < len; i6++) {
          if (arrayMode === "strict") {
            target[keys[i6]] = [a6[keys[i6]]];
          } else {
            target[keys[i6]] = a6[keys[i6]];
          }
        }
      }
    };
    exports.getValue = function(v5) {
      if (exports.isExist(v5)) {
        return v5;
      } else {
        return "";
      }
    };
    exports.isName = isName;
    exports.getAllMatches = getAllMatches;
    exports.nameRegexp = nameRegexp;
  }
});

// node_modules/fast-xml-parser/src/validator.js
var require_validator = __commonJS({
  "node_modules/fast-xml-parser/src/validator.js"(exports) {
    "use strict";
    var util = require_util();
    var defaultOptions = {
      allowBooleanAttributes: false,
      unpairedTags: []
    };
    exports.validate = function(xmlData, options) {
      options = Object.assign({}, defaultOptions, options);
      const tags = [];
      let tagFound = false;
      let reachedRoot = false;
      if (xmlData[0] === "\uFEFF") {
        xmlData = xmlData.substr(1);
      }
      for (let i6 = 0; i6 < xmlData.length; i6++) {
        if (xmlData[i6] === "<" && xmlData[i6 + 1] === "?") {
          i6 += 2;
          i6 = readPI(xmlData, i6);
          if (i6.err)
            return i6;
        } else if (xmlData[i6] === "<") {
          let tagStartPos = i6;
          i6++;
          if (xmlData[i6] === "!") {
            i6 = readCommentAndCDATA(xmlData, i6);
            continue;
          } else {
            let closingTag = false;
            if (xmlData[i6] === "/") {
              closingTag = true;
              i6++;
            }
            let tagName = "";
            for (; i6 < xmlData.length && xmlData[i6] !== ">" && xmlData[i6] !== " " && xmlData[i6] !== "	" && xmlData[i6] !== "\n" && xmlData[i6] !== "\r"; i6++) {
              tagName += xmlData[i6];
            }
            tagName = tagName.trim();
            if (tagName[tagName.length - 1] === "/") {
              tagName = tagName.substring(0, tagName.length - 1);
              i6--;
            }
            if (!validateTagName(tagName)) {
              let msg;
              if (tagName.trim().length === 0) {
                msg = "Invalid space after '<'.";
              } else {
                msg = "Tag '" + tagName + "' is an invalid name.";
              }
              return getErrorObject("InvalidTag", msg, getLineNumberForPosition(xmlData, i6));
            }
            const result = readAttributeStr(xmlData, i6);
            if (result === false) {
              return getErrorObject("InvalidAttr", "Attributes for '" + tagName + "' have open quote.", getLineNumberForPosition(xmlData, i6));
            }
            let attrStr = result.value;
            i6 = result.index;
            if (attrStr[attrStr.length - 1] === "/") {
              const attrStrStart = i6 - attrStr.length;
              attrStr = attrStr.substring(0, attrStr.length - 1);
              const isValid = validateAttributeString(attrStr, options);
              if (isValid === true) {
                tagFound = true;
              } else {
                return getErrorObject(isValid.err.code, isValid.err.msg, getLineNumberForPosition(xmlData, attrStrStart + isValid.err.line));
              }
            } else if (closingTag) {
              if (!result.tagClosed) {
                return getErrorObject("InvalidTag", "Closing tag '" + tagName + "' doesn't have proper closing.", getLineNumberForPosition(xmlData, i6));
              } else if (attrStr.trim().length > 0) {
                return getErrorObject("InvalidTag", "Closing tag '" + tagName + "' can't have attributes or invalid starting.", getLineNumberForPosition(xmlData, tagStartPos));
              } else {
                const otg = tags.pop();
                if (tagName !== otg.tagName) {
                  let openPos = getLineNumberForPosition(xmlData, otg.tagStartPos);
                  return getErrorObject(
                    "InvalidTag",
                    "Expected closing tag '" + otg.tagName + "' (opened in line " + openPos.line + ", col " + openPos.col + ") instead of closing tag '" + tagName + "'.",
                    getLineNumberForPosition(xmlData, tagStartPos)
                  );
                }
                if (tags.length == 0) {
                  reachedRoot = true;
                }
              }
            } else {
              const isValid = validateAttributeString(attrStr, options);
              if (isValid !== true) {
                return getErrorObject(isValid.err.code, isValid.err.msg, getLineNumberForPosition(xmlData, i6 - attrStr.length + isValid.err.line));
              }
              if (reachedRoot === true) {
                return getErrorObject("InvalidXml", "Multiple possible root nodes found.", getLineNumberForPosition(xmlData, i6));
              } else if (options.unpairedTags.indexOf(tagName) !== -1) {
              } else {
                tags.push({ tagName, tagStartPos });
              }
              tagFound = true;
            }
            for (i6++; i6 < xmlData.length; i6++) {
              if (xmlData[i6] === "<") {
                if (xmlData[i6 + 1] === "!") {
                  i6++;
                  i6 = readCommentAndCDATA(xmlData, i6);
                  continue;
                } else if (xmlData[i6 + 1] === "?") {
                  i6 = readPI(xmlData, ++i6);
                  if (i6.err)
                    return i6;
                } else {
                  break;
                }
              } else if (xmlData[i6] === "&") {
                const afterAmp = validateAmpersand(xmlData, i6);
                if (afterAmp == -1)
                  return getErrorObject("InvalidChar", "char '&' is not expected.", getLineNumberForPosition(xmlData, i6));
                i6 = afterAmp;
              } else {
                if (reachedRoot === true && !isWhiteSpace(xmlData[i6])) {
                  return getErrorObject("InvalidXml", "Extra text at the end", getLineNumberForPosition(xmlData, i6));
                }
              }
            }
            if (xmlData[i6] === "<") {
              i6--;
            }
          }
        } else {
          if (isWhiteSpace(xmlData[i6])) {
            continue;
          }
          return getErrorObject("InvalidChar", "char '" + xmlData[i6] + "' is not expected.", getLineNumberForPosition(xmlData, i6));
        }
      }
      if (!tagFound) {
        return getErrorObject("InvalidXml", "Start tag expected.", 1);
      } else if (tags.length == 1) {
        return getErrorObject("InvalidTag", "Unclosed tag '" + tags[0].tagName + "'.", getLineNumberForPosition(xmlData, tags[0].tagStartPos));
      } else if (tags.length > 0) {
        return getErrorObject("InvalidXml", "Invalid '" + JSON.stringify(tags.map((t4) => t4.tagName), null, 4).replace(/\r?\n/g, "") + "' found.", { line: 1, col: 1 });
      }
      return true;
    };
    function isWhiteSpace(char) {
      return char === " " || char === "	" || char === "\n" || char === "\r";
    }
    __name(isWhiteSpace, "isWhiteSpace");
    function readPI(xmlData, i6) {
      const start = i6;
      for (; i6 < xmlData.length; i6++) {
        if (xmlData[i6] == "?" || xmlData[i6] == " ") {
          const tagname = xmlData.substr(start, i6 - start);
          if (i6 > 5 && tagname === "xml") {
            return getErrorObject("InvalidXml", "XML declaration allowed only at the start of the document.", getLineNumberForPosition(xmlData, i6));
          } else if (xmlData[i6] == "?" && xmlData[i6 + 1] == ">") {
            i6++;
            break;
          } else {
            continue;
          }
        }
      }
      return i6;
    }
    __name(readPI, "readPI");
    function readCommentAndCDATA(xmlData, i6) {
      if (xmlData.length > i6 + 5 && xmlData[i6 + 1] === "-" && xmlData[i6 + 2] === "-") {
        for (i6 += 3; i6 < xmlData.length; i6++) {
          if (xmlData[i6] === "-" && xmlData[i6 + 1] === "-" && xmlData[i6 + 2] === ">") {
            i6 += 2;
            break;
          }
        }
      } else if (xmlData.length > i6 + 8 && xmlData[i6 + 1] === "D" && xmlData[i6 + 2] === "O" && xmlData[i6 + 3] === "C" && xmlData[i6 + 4] === "T" && xmlData[i6 + 5] === "Y" && xmlData[i6 + 6] === "P" && xmlData[i6 + 7] === "E") {
        let angleBracketsCount = 1;
        for (i6 += 8; i6 < xmlData.length; i6++) {
          if (xmlData[i6] === "<") {
            angleBracketsCount++;
          } else if (xmlData[i6] === ">") {
            angleBracketsCount--;
            if (angleBracketsCount === 0) {
              break;
            }
          }
        }
      } else if (xmlData.length > i6 + 9 && xmlData[i6 + 1] === "[" && xmlData[i6 + 2] === "C" && xmlData[i6 + 3] === "D" && xmlData[i6 + 4] === "A" && xmlData[i6 + 5] === "T" && xmlData[i6 + 6] === "A" && xmlData[i6 + 7] === "[") {
        for (i6 += 8; i6 < xmlData.length; i6++) {
          if (xmlData[i6] === "]" && xmlData[i6 + 1] === "]" && xmlData[i6 + 2] === ">") {
            i6 += 2;
            break;
          }
        }
      }
      return i6;
    }
    __name(readCommentAndCDATA, "readCommentAndCDATA");
    var doubleQuote = '"';
    var singleQuote = "'";
    function readAttributeStr(xmlData, i6) {
      let attrStr = "";
      let startChar = "";
      let tagClosed = false;
      for (; i6 < xmlData.length; i6++) {
        if (xmlData[i6] === doubleQuote || xmlData[i6] === singleQuote) {
          if (startChar === "") {
            startChar = xmlData[i6];
          } else if (startChar !== xmlData[i6]) {
          } else {
            startChar = "";
          }
        } else if (xmlData[i6] === ">") {
          if (startChar === "") {
            tagClosed = true;
            break;
          }
        }
        attrStr += xmlData[i6];
      }
      if (startChar !== "") {
        return false;
      }
      return {
        value: attrStr,
        index: i6,
        tagClosed
      };
    }
    __name(readAttributeStr, "readAttributeStr");
    var validAttrStrRegxp = new RegExp(`(\\s*)([^\\s=]+)(\\s*=)?(\\s*(['"])(([\\s\\S])*?)\\5)?`, "g");
    function validateAttributeString(attrStr, options) {
      const matches = util.getAllMatches(attrStr, validAttrStrRegxp);
      const attrNames = {};
      for (let i6 = 0; i6 < matches.length; i6++) {
        if (matches[i6][1].length === 0) {
          return getErrorObject("InvalidAttr", "Attribute '" + matches[i6][2] + "' has no space in starting.", getPositionFromMatch(matches[i6]));
        } else if (matches[i6][3] !== void 0 && matches[i6][4] === void 0) {
          return getErrorObject("InvalidAttr", "Attribute '" + matches[i6][2] + "' is without value.", getPositionFromMatch(matches[i6]));
        } else if (matches[i6][3] === void 0 && !options.allowBooleanAttributes) {
          return getErrorObject("InvalidAttr", "boolean attribute '" + matches[i6][2] + "' is not allowed.", getPositionFromMatch(matches[i6]));
        }
        const attrName = matches[i6][2];
        if (!validateAttrName(attrName)) {
          return getErrorObject("InvalidAttr", "Attribute '" + attrName + "' is an invalid name.", getPositionFromMatch(matches[i6]));
        }
        if (!attrNames.hasOwnProperty(attrName)) {
          attrNames[attrName] = 1;
        } else {
          return getErrorObject("InvalidAttr", "Attribute '" + attrName + "' is repeated.", getPositionFromMatch(matches[i6]));
        }
      }
      return true;
    }
    __name(validateAttributeString, "validateAttributeString");
    function validateNumberAmpersand(xmlData, i6) {
      let re = /\d/;
      if (xmlData[i6] === "x") {
        i6++;
        re = /[\da-fA-F]/;
      }
      for (; i6 < xmlData.length; i6++) {
        if (xmlData[i6] === ";")
          return i6;
        if (!xmlData[i6].match(re))
          break;
      }
      return -1;
    }
    __name(validateNumberAmpersand, "validateNumberAmpersand");
    function validateAmpersand(xmlData, i6) {
      i6++;
      if (xmlData[i6] === ";")
        return -1;
      if (xmlData[i6] === "#") {
        i6++;
        return validateNumberAmpersand(xmlData, i6);
      }
      let count = 0;
      for (; i6 < xmlData.length; i6++, count++) {
        if (xmlData[i6].match(/\w/) && count < 20)
          continue;
        if (xmlData[i6] === ";")
          break;
        return -1;
      }
      return i6;
    }
    __name(validateAmpersand, "validateAmpersand");
    function getErrorObject(code, message, lineNumber) {
      return {
        err: {
          code,
          msg: message,
          line: lineNumber.line || lineNumber,
          col: lineNumber.col
        }
      };
    }
    __name(getErrorObject, "getErrorObject");
    function validateAttrName(attrName) {
      return util.isName(attrName);
    }
    __name(validateAttrName, "validateAttrName");
    function validateTagName(tagname) {
      return util.isName(tagname);
    }
    __name(validateTagName, "validateTagName");
    function getLineNumberForPosition(xmlData, index) {
      const lines = xmlData.substring(0, index).split(/\r?\n/);
      return {
        line: lines.length,
        col: lines[lines.length - 1].length + 1
      };
    }
    __name(getLineNumberForPosition, "getLineNumberForPosition");
    function getPositionFromMatch(match) {
      return match.startIndex + match[1].length;
    }
    __name(getPositionFromMatch, "getPositionFromMatch");
  }
});

// node_modules/fast-xml-parser/src/xmlparser/OptionsBuilder.js
var require_OptionsBuilder = __commonJS({
  "node_modules/fast-xml-parser/src/xmlparser/OptionsBuilder.js"(exports) {
    var defaultOptions = {
      preserveOrder: false,
      attributeNamePrefix: "@_",
      attributesGroupName: false,
      textNodeName: "#text",
      ignoreAttributes: true,
      removeNSPrefix: false,
      allowBooleanAttributes: false,
      parseTagValue: true,
      parseAttributeValue: false,
      trimValues: true,
      cdataPropName: false,
      numberParseOptions: {
        hex: true,
        leadingZeros: true,
        eNotation: true
      },
      tagValueProcessor: function(tagName, val) {
        return val;
      },
      attributeValueProcessor: function(attrName, val) {
        return val;
      },
      stopNodes: [],
      alwaysCreateTextNode: false,
      isArray: () => false,
      commentPropName: false,
      unpairedTags: [],
      processEntities: true,
      htmlEntities: false,
      ignoreDeclaration: false,
      ignorePiTags: false,
      transformTagName: false,
      transformAttributeName: false
    };
    var buildOptions = /* @__PURE__ */ __name(function(options) {
      return Object.assign({}, defaultOptions, options);
    }, "buildOptions");
    exports.buildOptions = buildOptions;
    exports.defaultOptions = defaultOptions;
  }
});

// node_modules/fast-xml-parser/src/xmlparser/xmlNode.js
var require_xmlNode = __commonJS({
  "node_modules/fast-xml-parser/src/xmlparser/xmlNode.js"(exports, module2) {
    "use strict";
    var XmlNode = class {
      constructor(tagname) {
        this.tagname = tagname;
        this.child = [];
        this[":@"] = {};
      }
      add(key, val) {
        if (key === "__proto__")
          key = "#__proto__";
        this.child.push({ [key]: val });
      }
      addChild(node) {
        if (node.tagname === "__proto__")
          node.tagname = "#__proto__";
        if (node[":@"] && Object.keys(node[":@"]).length > 0) {
          this.child.push({ [node.tagname]: node.child, [":@"]: node[":@"] });
        } else {
          this.child.push({ [node.tagname]: node.child });
        }
      }
    };
    __name(XmlNode, "XmlNode");
    module2.exports = XmlNode;
  }
});

// node_modules/fast-xml-parser/src/xmlparser/DocTypeReader.js
var require_DocTypeReader = __commonJS({
  "node_modules/fast-xml-parser/src/xmlparser/DocTypeReader.js"(exports, module2) {
    function readDocType(xmlData, i6) {
      const entities = {};
      if (xmlData[i6 + 3] === "O" && xmlData[i6 + 4] === "C" && xmlData[i6 + 5] === "T" && xmlData[i6 + 6] === "Y" && xmlData[i6 + 7] === "P" && xmlData[i6 + 8] === "E") {
        i6 = i6 + 9;
        let angleBracketsCount = 1;
        let hasBody = false, entity = false, comment = false;
        let exp = "";
        for (; i6 < xmlData.length; i6++) {
          if (xmlData[i6] === "<" && !comment) {
            if (hasBody && xmlData[i6 + 1] === "!" && xmlData[i6 + 2] === "E" && xmlData[i6 + 3] === "N" && xmlData[i6 + 4] === "T" && xmlData[i6 + 5] === "I" && xmlData[i6 + 6] === "T" && xmlData[i6 + 7] === "Y") {
              i6 += 7;
              entity = true;
            } else if (hasBody && xmlData[i6 + 1] === "!" && xmlData[i6 + 2] === "E" && xmlData[i6 + 3] === "L" && xmlData[i6 + 4] === "E" && xmlData[i6 + 5] === "M" && xmlData[i6 + 6] === "E" && xmlData[i6 + 7] === "N" && xmlData[i6 + 8] === "T") {
              i6 += 8;
            } else if (hasBody && xmlData[i6 + 1] === "!" && xmlData[i6 + 2] === "A" && xmlData[i6 + 3] === "T" && xmlData[i6 + 4] === "T" && xmlData[i6 + 5] === "L" && xmlData[i6 + 6] === "I" && xmlData[i6 + 7] === "S" && xmlData[i6 + 8] === "T") {
              i6 += 8;
            } else if (hasBody && xmlData[i6 + 1] === "!" && xmlData[i6 + 2] === "N" && xmlData[i6 + 3] === "O" && xmlData[i6 + 4] === "T" && xmlData[i6 + 5] === "A" && xmlData[i6 + 6] === "T" && xmlData[i6 + 7] === "I" && xmlData[i6 + 8] === "O" && xmlData[i6 + 9] === "N") {
              i6 += 9;
            } else if (xmlData[i6 + 1] === "!" && xmlData[i6 + 2] === "-" && xmlData[i6 + 3] === "-") {
              comment = true;
            } else {
              throw new Error("Invalid DOCTYPE");
            }
            angleBracketsCount++;
            exp = "";
          } else if (xmlData[i6] === ">") {
            if (comment) {
              if (xmlData[i6 - 1] === "-" && xmlData[i6 - 2] === "-") {
                comment = false;
                angleBracketsCount--;
              }
            } else {
              if (entity) {
                parseEntityExp(exp, entities);
                entity = false;
              }
              angleBracketsCount--;
            }
            if (angleBracketsCount === 0) {
              break;
            }
          } else if (xmlData[i6] === "[") {
            hasBody = true;
          } else {
            exp += xmlData[i6];
          }
        }
        if (angleBracketsCount !== 0) {
          throw new Error(`Unclosed DOCTYPE`);
        }
      } else {
        throw new Error(`Invalid Tag instead of DOCTYPE`);
      }
      return { entities, i: i6 };
    }
    __name(readDocType, "readDocType");
    var entityRegex = RegExp(`^\\s([a-zA-z0-0]+)[ 	](['"])([^&]+)\\2`);
    function parseEntityExp(exp, entities) {
      const match = entityRegex.exec(exp);
      if (match) {
        entities[match[1]] = {
          regx: RegExp(`&${match[1]};`, "g"),
          val: match[3]
        };
      }
    }
    __name(parseEntityExp, "parseEntityExp");
    module2.exports = readDocType;
  }
});

// node_modules/strnum/strnum.js
var require_strnum = __commonJS({
  "node_modules/strnum/strnum.js"(exports, module2) {
    var hexRegex = /^[-+]?0x[a-fA-F0-9]+$/;
    var numRegex = /^([\-\+])?(0*)(\.[0-9]+([eE]\-?[0-9]+)?|[0-9]+(\.[0-9]+([eE]\-?[0-9]+)?)?)$/;
    if (!Number.parseInt && window.parseInt) {
      Number.parseInt = window.parseInt;
    }
    if (!Number.parseFloat && window.parseFloat) {
      Number.parseFloat = window.parseFloat;
    }
    var consider = {
      hex: true,
      leadingZeros: true,
      decimalPoint: ".",
      eNotation: true
    };
    function toNumber(str, options = {}) {
      options = Object.assign({}, consider, options);
      if (!str || typeof str !== "string")
        return str;
      let trimmedStr = str.trim();
      if (options.skipLike !== void 0 && options.skipLike.test(trimmedStr))
        return str;
      else if (options.hex && hexRegex.test(trimmedStr)) {
        return Number.parseInt(trimmedStr, 16);
      } else {
        const match = numRegex.exec(trimmedStr);
        if (match) {
          const sign = match[1];
          const leadingZeros = match[2];
          let numTrimmedByZeros = trimZeros(match[3]);
          const eNotation = match[4] || match[6];
          if (!options.leadingZeros && leadingZeros.length > 0 && sign && trimmedStr[2] !== ".")
            return str;
          else if (!options.leadingZeros && leadingZeros.length > 0 && !sign && trimmedStr[1] !== ".")
            return str;
          else {
            const num = Number(trimmedStr);
            const numStr = "" + num;
            if (numStr.search(/[eE]/) !== -1) {
              if (options.eNotation)
                return num;
              else
                return str;
            } else if (eNotation) {
              if (options.eNotation)
                return num;
              else
                return str;
            } else if (trimmedStr.indexOf(".") !== -1) {
              if (numStr === "0" && numTrimmedByZeros === "")
                return num;
              else if (numStr === numTrimmedByZeros)
                return num;
              else if (sign && numStr === "-" + numTrimmedByZeros)
                return num;
              else
                return str;
            }
            if (leadingZeros) {
              if (numTrimmedByZeros === numStr)
                return num;
              else if (sign + numTrimmedByZeros === numStr)
                return num;
              else
                return str;
            }
            if (trimmedStr === numStr)
              return num;
            else if (trimmedStr === sign + numStr)
              return num;
            return str;
          }
        } else {
          return str;
        }
      }
    }
    __name(toNumber, "toNumber");
    function trimZeros(numStr) {
      if (numStr && numStr.indexOf(".") !== -1) {
        numStr = numStr.replace(/0+$/, "");
        if (numStr === ".")
          numStr = "0";
        else if (numStr[0] === ".")
          numStr = "0" + numStr;
        else if (numStr[numStr.length - 1] === ".")
          numStr = numStr.substr(0, numStr.length - 1);
        return numStr;
      }
      return numStr;
    }
    __name(trimZeros, "trimZeros");
    module2.exports = toNumber;
  }
});

// node_modules/fast-xml-parser/src/xmlparser/OrderedObjParser.js
var require_OrderedObjParser = __commonJS({
  "node_modules/fast-xml-parser/src/xmlparser/OrderedObjParser.js"(exports, module2) {
    "use strict";
    var util = require_util();
    var xmlNode = require_xmlNode();
    var readDocType = require_DocTypeReader();
    var toNumber = require_strnum();
    var regx = "<((!\\[CDATA\\[([\\s\\S]*?)(]]>))|((NAME:)?(NAME))([^>]*)>|((\\/)(NAME)\\s*>))([^<]*)".replace(/NAME/g, util.nameRegexp);
    var OrderedObjParser = class {
      constructor(options) {
        this.options = options;
        this.currentNode = null;
        this.tagsNodeStack = [];
        this.docTypeEntities = {};
        this.lastEntities = {
          "apos": { regex: /&(apos|#39|#x27);/g, val: "'" },
          "gt": { regex: /&(gt|#62|#x3E);/g, val: ">" },
          "lt": { regex: /&(lt|#60|#x3C);/g, val: "<" },
          "quot": { regex: /&(quot|#34|#x22);/g, val: '"' }
        };
        this.ampEntity = { regex: /&(amp|#38|#x26);/g, val: "&" };
        this.htmlEntities = {
          "space": { regex: /&(nbsp|#160);/g, val: " " },
          "cent": { regex: /&(cent|#162);/g, val: "\xA2" },
          "pound": { regex: /&(pound|#163);/g, val: "\xA3" },
          "yen": { regex: /&(yen|#165);/g, val: "\xA5" },
          "euro": { regex: /&(euro|#8364);/g, val: "\u20AC" },
          "copyright": { regex: /&(copy|#169);/g, val: "\xA9" },
          "reg": { regex: /&(reg|#174);/g, val: "\xAE" },
          "inr": { regex: /&(inr|#8377);/g, val: "\u20B9" }
        };
        this.addExternalEntities = addExternalEntities;
        this.parseXml = parseXml;
        this.parseTextData = parseTextData;
        this.resolveNameSpace = resolveNameSpace;
        this.buildAttributesMap = buildAttributesMap;
        this.isItStopNode = isItStopNode;
        this.replaceEntitiesValue = replaceEntitiesValue;
        this.readStopNodeData = readStopNodeData;
        this.saveTextToParentTag = saveTextToParentTag;
      }
    };
    __name(OrderedObjParser, "OrderedObjParser");
    function addExternalEntities(externalEntities) {
      const entKeys = Object.keys(externalEntities);
      for (let i6 = 0; i6 < entKeys.length; i6++) {
        const ent = entKeys[i6];
        this.lastEntities[ent] = {
          regex: new RegExp("&" + ent + ";", "g"),
          val: externalEntities[ent]
        };
      }
    }
    __name(addExternalEntities, "addExternalEntities");
    function parseTextData(val, tagName, jPath, dontTrim, hasAttributes, isLeafNode, escapeEntities) {
      if (val !== void 0) {
        if (this.options.trimValues && !dontTrim) {
          val = val.trim();
        }
        if (val.length > 0) {
          if (!escapeEntities)
            val = this.replaceEntitiesValue(val);
          const newval = this.options.tagValueProcessor(tagName, val, jPath, hasAttributes, isLeafNode);
          if (newval === null || newval === void 0) {
            return val;
          } else if (typeof newval !== typeof val || newval !== val) {
            return newval;
          } else if (this.options.trimValues) {
            return parseValue(val, this.options.parseTagValue, this.options.numberParseOptions);
          } else {
            const trimmedVal = val.trim();
            if (trimmedVal === val) {
              return parseValue(val, this.options.parseTagValue, this.options.numberParseOptions);
            } else {
              return val;
            }
          }
        }
      }
    }
    __name(parseTextData, "parseTextData");
    function resolveNameSpace(tagname) {
      if (this.options.removeNSPrefix) {
        const tags = tagname.split(":");
        const prefix2 = tagname.charAt(0) === "/" ? "/" : "";
        if (tags[0] === "xmlns") {
          return "";
        }
        if (tags.length === 2) {
          tagname = prefix2 + tags[1];
        }
      }
      return tagname;
    }
    __name(resolveNameSpace, "resolveNameSpace");
    var attrsRegx = new RegExp(`([^\\s=]+)\\s*(=\\s*(['"])([\\s\\S]*?)\\3)?`, "gm");
    function buildAttributesMap(attrStr, jPath) {
      if (!this.options.ignoreAttributes && typeof attrStr === "string") {
        const matches = util.getAllMatches(attrStr, attrsRegx);
        const len = matches.length;
        const attrs = {};
        for (let i6 = 0; i6 < len; i6++) {
          const attrName = this.resolveNameSpace(matches[i6][1]);
          let oldVal = matches[i6][4];
          let aName = this.options.attributeNamePrefix + attrName;
          if (attrName.length) {
            if (this.options.transformAttributeName) {
              aName = this.options.transformAttributeName(aName);
            }
            if (aName === "__proto__")
              aName = "#__proto__";
            if (oldVal !== void 0) {
              if (this.options.trimValues) {
                oldVal = oldVal.trim();
              }
              oldVal = this.replaceEntitiesValue(oldVal);
              const newVal = this.options.attributeValueProcessor(attrName, oldVal, jPath);
              if (newVal === null || newVal === void 0) {
                attrs[aName] = oldVal;
              } else if (typeof newVal !== typeof oldVal || newVal !== oldVal) {
                attrs[aName] = newVal;
              } else {
                attrs[aName] = parseValue(
                  oldVal,
                  this.options.parseAttributeValue,
                  this.options.numberParseOptions
                );
              }
            } else if (this.options.allowBooleanAttributes) {
              attrs[aName] = true;
            }
          }
        }
        if (!Object.keys(attrs).length) {
          return;
        }
        if (this.options.attributesGroupName) {
          const attrCollection = {};
          attrCollection[this.options.attributesGroupName] = attrs;
          return attrCollection;
        }
        return attrs;
      }
    }
    __name(buildAttributesMap, "buildAttributesMap");
    var parseXml = /* @__PURE__ */ __name(function(xmlData) {
      xmlData = xmlData.replace(/\r\n?/g, "\n");
      const xmlObj = new xmlNode("!xml");
      let currentNode = xmlObj;
      let textData = "";
      let jPath = "";
      for (let i6 = 0; i6 < xmlData.length; i6++) {
        const ch = xmlData[i6];
        if (ch === "<") {
          if (xmlData[i6 + 1] === "/") {
            const closeIndex = findClosingIndex(xmlData, ">", i6, "Closing Tag is not closed.");
            let tagName = xmlData.substring(i6 + 2, closeIndex).trim();
            if (this.options.removeNSPrefix) {
              const colonIndex = tagName.indexOf(":");
              if (colonIndex !== -1) {
                tagName = tagName.substr(colonIndex + 1);
              }
            }
            if (this.options.transformTagName) {
              tagName = this.options.transformTagName(tagName);
            }
            if (currentNode) {
              textData = this.saveTextToParentTag(textData, currentNode, jPath);
            }
            jPath = jPath.substr(0, jPath.lastIndexOf("."));
            currentNode = this.tagsNodeStack.pop();
            textData = "";
            i6 = closeIndex;
          } else if (xmlData[i6 + 1] === "?") {
            let tagData = readTagExp(xmlData, i6, false, "?>");
            if (!tagData)
              throw new Error("Pi Tag is not closed.");
            textData = this.saveTextToParentTag(textData, currentNode, jPath);
            if (this.options.ignoreDeclaration && tagData.tagName === "?xml" || this.options.ignorePiTags) {
            } else {
              const childNode = new xmlNode(tagData.tagName);
              childNode.add(this.options.textNodeName, "");
              if (tagData.tagName !== tagData.tagExp && tagData.attrExpPresent) {
                childNode[":@"] = this.buildAttributesMap(tagData.tagExp, jPath);
              }
              currentNode.addChild(childNode);
            }
            i6 = tagData.closeIndex + 1;
          } else if (xmlData.substr(i6 + 1, 3) === "!--") {
            const endIndex = findClosingIndex(xmlData, "-->", i6 + 4, "Comment is not closed.");
            if (this.options.commentPropName) {
              const comment = xmlData.substring(i6 + 4, endIndex - 2);
              textData = this.saveTextToParentTag(textData, currentNode, jPath);
              currentNode.add(this.options.commentPropName, [{ [this.options.textNodeName]: comment }]);
            }
            i6 = endIndex;
          } else if (xmlData.substr(i6 + 1, 2) === "!D") {
            const result = readDocType(xmlData, i6);
            this.docTypeEntities = result.entities;
            i6 = result.i;
          } else if (xmlData.substr(i6 + 1, 2) === "![") {
            const closeIndex = findClosingIndex(xmlData, "]]>", i6, "CDATA is not closed.") - 2;
            const tagExp = xmlData.substring(i6 + 9, closeIndex);
            textData = this.saveTextToParentTag(textData, currentNode, jPath);
            if (this.options.cdataPropName) {
              currentNode.add(this.options.cdataPropName, [{ [this.options.textNodeName]: tagExp }]);
            } else {
              let val = this.parseTextData(tagExp, currentNode.tagname, jPath, true, false, true);
              if (val == void 0)
                val = "";
              currentNode.add(this.options.textNodeName, val);
            }
            i6 = closeIndex + 2;
          } else {
            let result = readTagExp(xmlData, i6, this.options.removeNSPrefix);
            let tagName = result.tagName;
            let tagExp = result.tagExp;
            let attrExpPresent = result.attrExpPresent;
            let closeIndex = result.closeIndex;
            if (this.options.transformTagName) {
              tagName = this.options.transformTagName(tagName);
            }
            if (currentNode && textData) {
              if (currentNode.tagname !== "!xml") {
                textData = this.saveTextToParentTag(textData, currentNode, jPath, false);
              }
            }
            if (tagName !== xmlObj.tagname) {
              jPath += jPath ? "." + tagName : tagName;
            }
            const lastTag = currentNode;
            if (lastTag && this.options.unpairedTags.indexOf(lastTag.tagname) !== -1) {
              currentNode = this.tagsNodeStack.pop();
            }
            if (this.isItStopNode(this.options.stopNodes, jPath, tagName)) {
              let tagContent = "";
              if (tagExp.length > 0 && tagExp.lastIndexOf("/") === tagExp.length - 1) {
                i6 = result.closeIndex;
              } else if (this.options.unpairedTags.indexOf(tagName) !== -1) {
                i6 = result.closeIndex;
              } else {
                const result2 = this.readStopNodeData(xmlData, tagName, closeIndex + 1);
                if (!result2)
                  throw new Error(`Unexpected end of ${tagName}`);
                i6 = result2.i;
                tagContent = result2.tagContent;
              }
              const childNode = new xmlNode(tagName);
              if (tagName !== tagExp && attrExpPresent) {
                childNode[":@"] = this.buildAttributesMap(tagExp, jPath);
              }
              if (tagContent) {
                tagContent = this.parseTextData(tagContent, tagName, jPath, true, attrExpPresent, true, true);
              }
              jPath = jPath.substr(0, jPath.lastIndexOf("."));
              childNode.add(this.options.textNodeName, tagContent);
              currentNode.addChild(childNode);
            } else {
              if (tagExp.length > 0 && tagExp.lastIndexOf("/") === tagExp.length - 1) {
                if (tagName[tagName.length - 1] === "/") {
                  tagName = tagName.substr(0, tagName.length - 1);
                  tagExp = tagName;
                } else {
                  tagExp = tagExp.substr(0, tagExp.length - 1);
                }
                if (this.options.transformTagName) {
                  tagName = this.options.transformTagName(tagName);
                }
                const childNode = new xmlNode(tagName);
                if (tagName !== tagExp && attrExpPresent) {
                  childNode[":@"] = this.buildAttributesMap(tagExp, jPath);
                }
                jPath = jPath.substr(0, jPath.lastIndexOf("."));
                currentNode.addChild(childNode);
              } else {
                const childNode = new xmlNode(tagName);
                this.tagsNodeStack.push(currentNode);
                if (tagName !== tagExp && attrExpPresent) {
                  childNode[":@"] = this.buildAttributesMap(tagExp, jPath);
                }
                currentNode.addChild(childNode);
                currentNode = childNode;
              }
              textData = "";
              i6 = closeIndex;
            }
          }
        } else {
          textData += xmlData[i6];
        }
      }
      return xmlObj.child;
    }, "parseXml");
    var replaceEntitiesValue = /* @__PURE__ */ __name(function(val) {
      if (this.options.processEntities) {
        for (let entityName in this.docTypeEntities) {
          const entity = this.docTypeEntities[entityName];
          val = val.replace(entity.regx, entity.val);
        }
        for (let entityName in this.lastEntities) {
          const entity = this.lastEntities[entityName];
          val = val.replace(entity.regex, entity.val);
        }
        if (this.options.htmlEntities) {
          for (let entityName in this.htmlEntities) {
            const entity = this.htmlEntities[entityName];
            val = val.replace(entity.regex, entity.val);
          }
        }
        val = val.replace(this.ampEntity.regex, this.ampEntity.val);
      }
      return val;
    }, "replaceEntitiesValue");
    function saveTextToParentTag(textData, currentNode, jPath, isLeafNode) {
      if (textData) {
        if (isLeafNode === void 0)
          isLeafNode = Object.keys(currentNode.child).length === 0;
        textData = this.parseTextData(
          textData,
          currentNode.tagname,
          jPath,
          false,
          currentNode[":@"] ? Object.keys(currentNode[":@"]).length !== 0 : false,
          isLeafNode
        );
        if (textData !== void 0 && textData !== "")
          currentNode.add(this.options.textNodeName, textData);
        textData = "";
      }
      return textData;
    }
    __name(saveTextToParentTag, "saveTextToParentTag");
    function isItStopNode(stopNodes, jPath, currentTagName) {
      const allNodesExp = "*." + currentTagName;
      for (const stopNodePath in stopNodes) {
        const stopNodeExp = stopNodes[stopNodePath];
        if (allNodesExp === stopNodeExp || jPath === stopNodeExp)
          return true;
      }
      return false;
    }
    __name(isItStopNode, "isItStopNode");
    function tagExpWithClosingIndex(xmlData, i6, closingChar = ">") {
      let attrBoundary;
      let tagExp = "";
      for (let index = i6; index < xmlData.length; index++) {
        let ch = xmlData[index];
        if (attrBoundary) {
          if (ch === attrBoundary)
            attrBoundary = "";
        } else if (ch === '"' || ch === "'") {
          attrBoundary = ch;
        } else if (ch === closingChar[0]) {
          if (closingChar[1]) {
            if (xmlData[index + 1] === closingChar[1]) {
              return {
                data: tagExp,
                index
              };
            }
          } else {
            return {
              data: tagExp,
              index
            };
          }
        } else if (ch === "	") {
          ch = " ";
        }
        tagExp += ch;
      }
    }
    __name(tagExpWithClosingIndex, "tagExpWithClosingIndex");
    function findClosingIndex(xmlData, str, i6, errMsg) {
      const closingIndex = xmlData.indexOf(str, i6);
      if (closingIndex === -1) {
        throw new Error(errMsg);
      } else {
        return closingIndex + str.length - 1;
      }
    }
    __name(findClosingIndex, "findClosingIndex");
    function readTagExp(xmlData, i6, removeNSPrefix, closingChar = ">") {
      const result = tagExpWithClosingIndex(xmlData, i6 + 1, closingChar);
      if (!result)
        return;
      let tagExp = result.data;
      const closeIndex = result.index;
      const separatorIndex = tagExp.search(/\s/);
      let tagName = tagExp;
      let attrExpPresent = true;
      if (separatorIndex !== -1) {
        tagName = tagExp.substr(0, separatorIndex).replace(/\s\s*$/, "");
        tagExp = tagExp.substr(separatorIndex + 1);
      }
      if (removeNSPrefix) {
        const colonIndex = tagName.indexOf(":");
        if (colonIndex !== -1) {
          tagName = tagName.substr(colonIndex + 1);
          attrExpPresent = tagName !== result.data.substr(colonIndex + 1);
        }
      }
      return {
        tagName,
        tagExp,
        closeIndex,
        attrExpPresent
      };
    }
    __name(readTagExp, "readTagExp");
    function readStopNodeData(xmlData, tagName, i6) {
      const startIndex = i6;
      let openTagCount = 1;
      for (; i6 < xmlData.length; i6++) {
        if (xmlData[i6] === "<") {
          if (xmlData[i6 + 1] === "/") {
            const closeIndex = findClosingIndex(xmlData, ">", i6, `${tagName} is not closed`);
            let closeTagName = xmlData.substring(i6 + 2, closeIndex).trim();
            if (closeTagName === tagName) {
              openTagCount--;
              if (openTagCount === 0) {
                return {
                  tagContent: xmlData.substring(startIndex, i6),
                  i: closeIndex
                };
              }
            }
            i6 = closeIndex;
          } else if (xmlData[i6 + 1] === "?") {
            const closeIndex = findClosingIndex(xmlData, "?>", i6 + 1, "StopNode is not closed.");
            i6 = closeIndex;
          } else if (xmlData.substr(i6 + 1, 3) === "!--") {
            const closeIndex = findClosingIndex(xmlData, "-->", i6 + 3, "StopNode is not closed.");
            i6 = closeIndex;
          } else if (xmlData.substr(i6 + 1, 2) === "![") {
            const closeIndex = findClosingIndex(xmlData, "]]>", i6, "StopNode is not closed.") - 2;
            i6 = closeIndex;
          } else {
            const tagData = readTagExp(xmlData, i6, ">");
            if (tagData) {
              const openTagName = tagData && tagData.tagName;
              if (openTagName === tagName && tagData.tagExp[tagData.tagExp.length - 1] !== "/") {
                openTagCount++;
              }
              i6 = tagData.closeIndex;
            }
          }
        }
      }
    }
    __name(readStopNodeData, "readStopNodeData");
    function parseValue(val, shouldParse, options) {
      if (shouldParse && typeof val === "string") {
        const newval = val.trim();
        if (newval === "true")
          return true;
        else if (newval === "false")
          return false;
        else
          return toNumber(val, options);
      } else {
        if (util.isExist(val)) {
          return val;
        } else {
          return "";
        }
      }
    }
    __name(parseValue, "parseValue");
    module2.exports = OrderedObjParser;
  }
});

// node_modules/fast-xml-parser/src/xmlparser/node2json.js
var require_node2json = __commonJS({
  "node_modules/fast-xml-parser/src/xmlparser/node2json.js"(exports) {
    "use strict";
    function prettify(node, options) {
      return compress(node, options);
    }
    __name(prettify, "prettify");
    function compress(arr, options, jPath) {
      let text;
      const compressedObj = {};
      for (let i6 = 0; i6 < arr.length; i6++) {
        const tagObj = arr[i6];
        const property = propName(tagObj);
        let newJpath = "";
        if (jPath === void 0)
          newJpath = property;
        else
          newJpath = jPath + "." + property;
        if (property === options.textNodeName) {
          if (text === void 0)
            text = tagObj[property];
          else
            text += "" + tagObj[property];
        } else if (property === void 0) {
          continue;
        } else if (tagObj[property]) {
          let val = compress(tagObj[property], options, newJpath);
          const isLeaf = isLeafTag(val, options);
          if (tagObj[":@"]) {
            assignAttributes(val, tagObj[":@"], newJpath, options);
          } else if (Object.keys(val).length === 1 && val[options.textNodeName] !== void 0 && !options.alwaysCreateTextNode) {
            val = val[options.textNodeName];
          } else if (Object.keys(val).length === 0) {
            if (options.alwaysCreateTextNode)
              val[options.textNodeName] = "";
            else
              val = "";
          }
          if (compressedObj[property] !== void 0 && compressedObj.hasOwnProperty(property)) {
            if (!Array.isArray(compressedObj[property])) {
              compressedObj[property] = [compressedObj[property]];
            }
            compressedObj[property].push(val);
          } else {
            if (options.isArray(property, newJpath, isLeaf)) {
              compressedObj[property] = [val];
            } else {
              compressedObj[property] = val;
            }
          }
        }
      }
      if (typeof text === "string") {
        if (text.length > 0)
          compressedObj[options.textNodeName] = text;
      } else if (text !== void 0)
        compressedObj[options.textNodeName] = text;
      return compressedObj;
    }
    __name(compress, "compress");
    function propName(obj) {
      const keys = Object.keys(obj);
      for (let i6 = 0; i6 < keys.length; i6++) {
        const key = keys[i6];
        if (key !== ":@")
          return key;
      }
    }
    __name(propName, "propName");
    function assignAttributes(obj, attrMap, jpath, options) {
      if (attrMap) {
        const keys = Object.keys(attrMap);
        const len = keys.length;
        for (let i6 = 0; i6 < len; i6++) {
          const atrrName = keys[i6];
          if (options.isArray(atrrName, jpath + "." + atrrName, true, true)) {
            obj[atrrName] = [attrMap[atrrName]];
          } else {
            obj[atrrName] = attrMap[atrrName];
          }
        }
      }
    }
    __name(assignAttributes, "assignAttributes");
    function isLeafTag(obj, options) {
      const propCount = Object.keys(obj).length;
      if (propCount === 0 || propCount === 1 && obj[options.textNodeName])
        return true;
      return false;
    }
    __name(isLeafTag, "isLeafTag");
    exports.prettify = prettify;
  }
});

// node_modules/fast-xml-parser/src/xmlparser/XMLParser.js
var require_XMLParser = __commonJS({
  "node_modules/fast-xml-parser/src/xmlparser/XMLParser.js"(exports, module2) {
    var { buildOptions } = require_OptionsBuilder();
    var OrderedObjParser = require_OrderedObjParser();
    var { prettify } = require_node2json();
    var validator = require_validator();
    var XMLParser2 = class {
      constructor(options) {
        this.externalEntities = {};
        this.options = buildOptions(options);
      }
      parse(xmlData, validationOption) {
        if (typeof xmlData === "string") {
        } else if (xmlData.toString) {
          xmlData = xmlData.toString();
        } else {
          throw new Error("XML data is accepted in String or Bytes[] form.");
        }
        if (validationOption) {
          if (validationOption === true)
            validationOption = {};
          const result = validator.validate(xmlData, validationOption);
          if (result !== true) {
            throw Error(`${result.err.msg}:${result.err.line}:${result.err.col}`);
          }
        }
        const orderedObjParser = new OrderedObjParser(this.options);
        orderedObjParser.addExternalEntities(this.externalEntities);
        const orderedResult = orderedObjParser.parseXml(xmlData);
        if (this.options.preserveOrder || orderedResult === void 0)
          return orderedResult;
        else
          return prettify(orderedResult, this.options);
      }
      addEntity(key, value) {
        if (value.indexOf("&") !== -1) {
          throw new Error("Entity value can't have '&'");
        } else if (key.indexOf("&") !== -1 || key.indexOf(";") !== -1) {
          throw new Error("An entity must be set without '&' and ';'. Eg. use '#xD' for '&#xD;'");
        } else if (value === "&") {
          throw new Error("An entity with value '&' is not permitted");
        } else {
          this.externalEntities[key] = value;
        }
      }
    };
    __name(XMLParser2, "XMLParser");
    module2.exports = XMLParser2;
  }
});

// node_modules/fast-xml-parser/src/xmlbuilder/orderedJs2Xml.js
var require_orderedJs2Xml = __commonJS({
  "node_modules/fast-xml-parser/src/xmlbuilder/orderedJs2Xml.js"(exports, module2) {
    var EOL = "\n";
    function toXml(jArray, options) {
      let indentation = "";
      if (options.format && options.indentBy.length > 0) {
        indentation = EOL;
      }
      return arrToStr(jArray, options, "", indentation);
    }
    __name(toXml, "toXml");
    function arrToStr(arr, options, jPath, indentation) {
      let xmlStr = "";
      let isPreviousElementTag = false;
      for (let i6 = 0; i6 < arr.length; i6++) {
        const tagObj = arr[i6];
        const tagName = propName(tagObj);
        let newJPath = "";
        if (jPath.length === 0)
          newJPath = tagName;
        else
          newJPath = `${jPath}.${tagName}`;
        if (tagName === options.textNodeName) {
          let tagText = tagObj[tagName];
          if (!isStopNode(newJPath, options)) {
            tagText = options.tagValueProcessor(tagName, tagText);
            tagText = replaceEntitiesValue(tagText, options);
          }
          if (isPreviousElementTag) {
            xmlStr += indentation;
          }
          xmlStr += tagText;
          isPreviousElementTag = false;
          continue;
        } else if (tagName === options.cdataPropName) {
          if (isPreviousElementTag) {
            xmlStr += indentation;
          }
          xmlStr += `<![CDATA[${tagObj[tagName][0][options.textNodeName]}]]>`;
          isPreviousElementTag = false;
          continue;
        } else if (tagName === options.commentPropName) {
          xmlStr += indentation + `<!--${tagObj[tagName][0][options.textNodeName]}-->`;
          isPreviousElementTag = true;
          continue;
        } else if (tagName[0] === "?") {
          const attStr2 = attr_to_str(tagObj[":@"], options);
          const tempInd = tagName === "?xml" ? "" : indentation;
          let piTextNodeName = tagObj[tagName][0][options.textNodeName];
          piTextNodeName = piTextNodeName.length !== 0 ? " " + piTextNodeName : "";
          xmlStr += tempInd + `<${tagName}${piTextNodeName}${attStr2}?>`;
          isPreviousElementTag = true;
          continue;
        }
        let newIdentation = indentation;
        if (newIdentation !== "") {
          newIdentation += options.indentBy;
        }
        const attStr = attr_to_str(tagObj[":@"], options);
        const tagStart = indentation + `<${tagName}${attStr}`;
        const tagValue = arrToStr(tagObj[tagName], options, newJPath, newIdentation);
        if (options.unpairedTags.indexOf(tagName) !== -1) {
          if (options.suppressUnpairedNode)
            xmlStr += tagStart + ">";
          else
            xmlStr += tagStart + "/>";
        } else if ((!tagValue || tagValue.length === 0) && options.suppressEmptyNode) {
          xmlStr += tagStart + "/>";
        } else if (tagValue && tagValue.endsWith(">")) {
          xmlStr += tagStart + `>${tagValue}${indentation}</${tagName}>`;
        } else {
          xmlStr += tagStart + ">";
          if (tagValue && indentation !== "" && (tagValue.includes("/>") || tagValue.includes("</"))) {
            xmlStr += indentation + options.indentBy + tagValue + indentation;
          } else {
            xmlStr += tagValue;
          }
          xmlStr += `</${tagName}>`;
        }
        isPreviousElementTag = true;
      }
      return xmlStr;
    }
    __name(arrToStr, "arrToStr");
    function propName(obj) {
      const keys = Object.keys(obj);
      for (let i6 = 0; i6 < keys.length; i6++) {
        const key = keys[i6];
        if (key !== ":@")
          return key;
      }
    }
    __name(propName, "propName");
    function attr_to_str(attrMap, options) {
      let attrStr = "";
      if (attrMap && !options.ignoreAttributes) {
        for (let attr in attrMap) {
          let attrVal = options.attributeValueProcessor(attr, attrMap[attr]);
          attrVal = replaceEntitiesValue(attrVal, options);
          if (attrVal === true && options.suppressBooleanAttributes) {
            attrStr += ` ${attr.substr(options.attributeNamePrefix.length)}`;
          } else {
            attrStr += ` ${attr.substr(options.attributeNamePrefix.length)}="${attrVal}"`;
          }
        }
      }
      return attrStr;
    }
    __name(attr_to_str, "attr_to_str");
    function isStopNode(jPath, options) {
      jPath = jPath.substr(0, jPath.length - options.textNodeName.length - 1);
      let tagName = jPath.substr(jPath.lastIndexOf(".") + 1);
      for (let index in options.stopNodes) {
        if (options.stopNodes[index] === jPath || options.stopNodes[index] === "*." + tagName)
          return true;
      }
      return false;
    }
    __name(isStopNode, "isStopNode");
    function replaceEntitiesValue(textValue, options) {
      if (textValue && textValue.length > 0 && options.processEntities) {
        for (let i6 = 0; i6 < options.entities.length; i6++) {
          const entity = options.entities[i6];
          textValue = textValue.replace(entity.regex, entity.val);
        }
      }
      return textValue;
    }
    __name(replaceEntitiesValue, "replaceEntitiesValue");
    module2.exports = toXml;
  }
});

// node_modules/fast-xml-parser/src/xmlbuilder/json2xml.js
var require_json2xml = __commonJS({
  "node_modules/fast-xml-parser/src/xmlbuilder/json2xml.js"(exports, module2) {
    "use strict";
    var buildFromOrderedJs = require_orderedJs2Xml();
    var defaultOptions = {
      attributeNamePrefix: "@_",
      attributesGroupName: false,
      textNodeName: "#text",
      ignoreAttributes: true,
      cdataPropName: false,
      format: false,
      indentBy: "  ",
      suppressEmptyNode: false,
      suppressUnpairedNode: true,
      suppressBooleanAttributes: true,
      tagValueProcessor: function(key, a6) {
        return a6;
      },
      attributeValueProcessor: function(attrName, a6) {
        return a6;
      },
      preserveOrder: false,
      commentPropName: false,
      unpairedTags: [],
      entities: [
        { regex: new RegExp("&", "g"), val: "&amp;" },
        { regex: new RegExp(">", "g"), val: "&gt;" },
        { regex: new RegExp("<", "g"), val: "&lt;" },
        { regex: new RegExp("'", "g"), val: "&apos;" },
        { regex: new RegExp('"', "g"), val: "&quot;" }
      ],
      processEntities: true,
      stopNodes: []
    };
    function Builder(options) {
      this.options = Object.assign({}, defaultOptions, options);
      if (this.options.ignoreAttributes || this.options.attributesGroupName) {
        this.isAttribute = function() {
          return false;
        };
      } else {
        this.attrPrefixLen = this.options.attributeNamePrefix.length;
        this.isAttribute = isAttribute;
      }
      this.processTextOrObjNode = processTextOrObjNode;
      if (this.options.format) {
        this.indentate = indentate;
        this.tagEndChar = ">\n";
        this.newLine = "\n";
      } else {
        this.indentate = function() {
          return "";
        };
        this.tagEndChar = ">";
        this.newLine = "";
      }
    }
    __name(Builder, "Builder");
    Builder.prototype.build = function(jObj) {
      if (this.options.preserveOrder) {
        return buildFromOrderedJs(jObj, this.options);
      } else {
        if (Array.isArray(jObj) && this.options.arrayNodeName && this.options.arrayNodeName.length > 1) {
          jObj = {
            [this.options.arrayNodeName]: jObj
          };
        }
        return this.j2x(jObj, 0).val;
      }
    };
    Builder.prototype.j2x = function(jObj, level) {
      let attrStr = "";
      let val = "";
      for (let key in jObj) {
        if (typeof jObj[key] === "undefined") {
        } else if (jObj[key] === null) {
          if (key[0] === "?")
            val += this.indentate(level) + "<" + key + "?" + this.tagEndChar;
          else
            val += this.indentate(level) + "<" + key + "/" + this.tagEndChar;
        } else if (jObj[key] instanceof Date) {
          val += this.buildTextValNode(jObj[key], key, "", level);
        } else if (typeof jObj[key] !== "object") {
          const attr = this.isAttribute(key);
          if (attr) {
            attrStr += this.buildAttrPairStr(attr, "" + jObj[key]);
          } else {
            if (key === this.options.textNodeName) {
              let newval = this.options.tagValueProcessor(key, "" + jObj[key]);
              val += this.replaceEntitiesValue(newval);
            } else {
              val += this.buildTextValNode(jObj[key], key, "", level);
            }
          }
        } else if (Array.isArray(jObj[key])) {
          const arrLen = jObj[key].length;
          for (let j6 = 0; j6 < arrLen; j6++) {
            const item = jObj[key][j6];
            if (typeof item === "undefined") {
            } else if (item === null) {
              if (key[0] === "?")
                val += this.indentate(level) + "<" + key + "?" + this.tagEndChar;
              else
                val += this.indentate(level) + "<" + key + "/" + this.tagEndChar;
            } else if (typeof item === "object") {
              val += this.processTextOrObjNode(item, key, level);
            } else {
              val += this.buildTextValNode(item, key, "", level);
            }
          }
        } else {
          if (this.options.attributesGroupName && key === this.options.attributesGroupName) {
            const Ks = Object.keys(jObj[key]);
            const L = Ks.length;
            for (let j6 = 0; j6 < L; j6++) {
              attrStr += this.buildAttrPairStr(Ks[j6], "" + jObj[key][Ks[j6]]);
            }
          } else {
            val += this.processTextOrObjNode(jObj[key], key, level);
          }
        }
      }
      return { attrStr, val };
    };
    Builder.prototype.buildAttrPairStr = function(attrName, val) {
      val = this.options.attributeValueProcessor(attrName, "" + val);
      val = this.replaceEntitiesValue(val);
      if (this.options.suppressBooleanAttributes && val === "true") {
        return " " + attrName;
      } else
        return " " + attrName + '="' + val + '"';
    };
    function processTextOrObjNode(object, key, level) {
      const result = this.j2x(object, level + 1);
      if (object[this.options.textNodeName] !== void 0 && Object.keys(object).length === 1) {
        return this.buildTextValNode(object[this.options.textNodeName], key, result.attrStr, level);
      } else {
        return this.buildObjectNode(result.val, key, result.attrStr, level);
      }
    }
    __name(processTextOrObjNode, "processTextOrObjNode");
    Builder.prototype.buildObjectNode = function(val, key, attrStr, level) {
      if (val === "") {
        if (key[0] === "?")
          return this.indentate(level) + "<" + key + attrStr + "?" + this.tagEndChar;
        else {
          return this.indentate(level) + "<" + key + attrStr + this.closeTag(key) + this.tagEndChar;
        }
      } else {
        let tagEndExp = "</" + key + this.tagEndChar;
        let piClosingChar = "";
        if (key[0] === "?") {
          piClosingChar = "?";
          tagEndExp = "";
        }
        if (attrStr && val.indexOf("<") === -1) {
          return this.indentate(level) + "<" + key + attrStr + piClosingChar + ">" + val + tagEndExp;
        } else if (this.options.commentPropName !== false && key === this.options.commentPropName && piClosingChar.length === 0) {
          return this.indentate(level) + `<!--${val}-->` + this.newLine;
        } else {
          return this.indentate(level) + "<" + key + attrStr + piClosingChar + this.tagEndChar + val + this.indentate(level) + tagEndExp;
        }
      }
    };
    Builder.prototype.closeTag = function(key) {
      let closeTag = "";
      if (this.options.unpairedTags.indexOf(key) !== -1) {
        if (!this.options.suppressUnpairedNode)
          closeTag = "/";
      } else if (this.options.suppressEmptyNode) {
        closeTag = "/";
      } else {
        closeTag = `></${key}`;
      }
      return closeTag;
    };
    Builder.prototype.buildTextValNode = function(val, key, attrStr, level) {
      if (this.options.cdataPropName !== false && key === this.options.cdataPropName) {
        return this.indentate(level) + `<![CDATA[${val}]]>` + this.newLine;
      } else if (this.options.commentPropName !== false && key === this.options.commentPropName) {
        return this.indentate(level) + `<!--${val}-->` + this.newLine;
      } else if (key[0] === "?") {
        return this.indentate(level) + "<" + key + attrStr + "?" + this.tagEndChar;
      } else {
        let textValue = this.options.tagValueProcessor(key, val);
        textValue = this.replaceEntitiesValue(textValue);
        if (textValue === "") {
          return this.indentate(level) + "<" + key + attrStr + this.closeTag(key) + this.tagEndChar;
        } else {
          return this.indentate(level) + "<" + key + attrStr + ">" + textValue + "</" + key + this.tagEndChar;
        }
      }
    };
    Builder.prototype.replaceEntitiesValue = function(textValue) {
      if (textValue && textValue.length > 0 && this.options.processEntities) {
        for (let i6 = 0; i6 < this.options.entities.length; i6++) {
          const entity = this.options.entities[i6];
          textValue = textValue.replace(entity.regex, entity.val);
        }
      }
      return textValue;
    };
    function indentate(level) {
      return this.options.indentBy.repeat(level);
    }
    __name(indentate, "indentate");
    function isAttribute(name) {
      if (name.startsWith(this.options.attributeNamePrefix)) {
        return name.substr(this.attrPrefixLen);
      } else {
        return false;
      }
    }
    __name(isAttribute, "isAttribute");
    module2.exports = Builder;
  }
});

// node_modules/fast-xml-parser/src/fxp.js
var require_fxp = __commonJS({
  "node_modules/fast-xml-parser/src/fxp.js"(exports, module2) {
    "use strict";
    var validator = require_validator();
    var XMLParser2 = require_XMLParser();
    var XMLBuilder = require_json2xml();
    module2.exports = {
      XMLParser: XMLParser2,
      XMLValidator: validator,
      XMLBuilder
    };
  }
});

// node_modules/aws-crt/dist/common/promise.js
var require_promise = __commonJS({
  "node_modules/aws-crt/dist/common/promise.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.newLiftedPromise = exports.makeSelfCleaningPromise = void 0;
    function makeSelfCleaningPromise(promise, cleaner) {
      if (!cleaner) {
        return promise;
      }
      return promise.finally(() => {
        cleaner();
      });
    }
    __name(makeSelfCleaningPromise, "makeSelfCleaningPromise");
    exports.makeSelfCleaningPromise = makeSelfCleaningPromise;
    function newLiftedPromise(promiseBody) {
      let localResolve = void 0;
      let localReject = void 0;
      let promise = new Promise((resolve, reject) => {
        localResolve = resolve;
        localReject = reject;
      });
      if (!localResolve || !localReject) {
        throw new Error("Failed to bind resolve and reject when making lifted promise");
      }
      if (promiseBody) {
        promiseBody(localResolve, localReject);
      }
      return {
        promise,
        resolve: localResolve,
        reject: localReject
      };
    }
    __name(newLiftedPromise, "newLiftedPromise");
    exports.newLiftedPromise = newLiftedPromise;
  }
});

// node_modules/aws-crt/dist/common/cancel.js
var require_cancel = __commonJS({
  "node_modules/aws-crt/dist/common/cancel.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o6, m6, k6, k22) {
      if (k22 === void 0)
        k22 = k6;
      var desc = Object.getOwnPropertyDescriptor(m6, k6);
      if (!desc || ("get" in desc ? !m6.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m6[k6];
        } };
      }
      Object.defineProperty(o6, k22, desc);
    } : function(o6, m6, k6, k22) {
      if (k22 === void 0)
        k22 = k6;
      o6[k22] = m6[k6];
    });
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? function(o6, v5) {
      Object.defineProperty(o6, "default", { enumerable: true, value: v5 });
    } : function(o6, v5) {
      o6["default"] = v5;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule)
        return mod;
      var result = {};
      if (mod != null) {
        for (var k6 in mod)
          if (k6 !== "default" && Object.prototype.hasOwnProperty.call(mod, k6))
            __createBinding(result, mod, k6);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.newCancellablePromiseFromNextEvent = exports.CancelController = exports.EVENT_NAME = void 0;
    var events_1 = __require("events");
    var promise = __importStar(require_promise());
    exports.EVENT_NAME = "cancelled";
    var CancelController = class {
      constructor(options) {
        this.cancelled = false;
        if (options && options.emitterFactory) {
          this.emitter = options.emitterFactory();
        } else {
          this.emitter = new events_1.EventEmitter();
        }
      }
      cancel() {
        if (!this.cancelled) {
          this.cancelled = true;
          this.emitter.emit(exports.EVENT_NAME);
          this.emitter.removeAllListeners(exports.EVENT_NAME);
        }
      }
      hasBeenCancelled() {
        return this.cancelled;
      }
      addListener(listener) {
        if (this.cancelled) {
          listener();
          return void 0;
        }
        this.emitter.on(exports.EVENT_NAME, listener);
        return () => {
          this.emitter.removeListener(exports.EVENT_NAME, listener);
        };
      }
    };
    __name(CancelController, "CancelController");
    exports.CancelController = CancelController;
    function newCancellablePromiseFromNextEvent(config) {
      let onEvent = void 0;
      let cancelRemoveListener = void 0;
      let liftedPromise = promise.newLiftedPromise();
      onEvent = /* @__PURE__ */ __name((eventData) => {
        try {
          if (config.eventDataTransformer) {
            liftedPromise.resolve(config.eventDataTransformer(eventData));
          } else {
            liftedPromise.resolve(eventData);
          }
        } catch (err) {
          liftedPromise.reject(err);
        }
      }, "onEvent");
      config.emitter.addListener(config.eventName, onEvent);
      if (config.cancelController) {
        cancelRemoveListener = config.cancelController.addListener(() => {
          liftedPromise.reject(config.cancelMessage);
        });
      }
      return promise.makeSelfCleaningPromise(liftedPromise.promise, () => {
        if (onEvent) {
          config.emitter.removeListener(config.eventName, onEvent);
        }
        if (cancelRemoveListener) {
          cancelRemoveListener();
        }
      });
    }
    __name(newCancellablePromiseFromNextEvent, "newCancellablePromiseFromNextEvent");
    exports.newCancellablePromiseFromNextEvent = newCancellablePromiseFromNextEvent;
  }
});

// node_modules/aws-crt/package.json
var require_package = __commonJS({
  "node_modules/aws-crt/package.json"(exports, module2) {
    module2.exports = {
      name: "aws-crt",
      version: "1.15.16",
      description: "NodeJS/browser bindings to the aws-c-* libraries",
      homepage: "https://github.com/awslabs/aws-crt-nodejs",
      repository: {
        type: "git",
        url: "git+https://github.com/awslabs/aws-crt-nodejs.git"
      },
      contributors: [
        "AWS Common Runtime Team <aws-sdk-common-runtime@amazon.com>"
      ],
      license: "Apache-2.0",
      main: "./dist/index.js",
      browser: "./dist.browser/browser.js",
      types: "./dist/index.d.ts",
      scripts: {
        tsc: "node ./scripts/tsc.js",
        test: "npm run test:native",
        "test:node": "npm run test:native",
        "test:native": "npx jest --runInBand --verbose --config test/native/jest.config.js --forceExit",
        "test:browser": "npx jest --runInBand --verbose --config test/browser/jest.config.js --forceExit",
        "test:browser:ci": "npm run install:puppeteer && npm run test:browser",
        "install:puppeteer": "npm install --save-dev jest-puppeteer puppeteer @types/puppeteer",
        prepare: "node ./scripts/tsc.js && node ./scripts/install.js",
        install: "node ./scripts/install.js"
      },
      devDependencies: {
        "@types/crypto-js": "^3.1.43",
        "@types/jest": "^27.0.1",
        "@types/node": "^10.17.54",
        "@types/prettier": "2.6.0",
        "@types/puppeteer": "^5.4.7",
        "@types/uuid": "^3.4.8",
        "@types/ws": "^7.4.7",
        "aws-sdk": "^2.848.0",
        "cmake-js": "^6.3.2",
        "https-proxy-agent": "^5.0.1",
        jest: "^27.2.1",
        "jest-puppeteer": "^5.0.4",
        "jest-runtime": "^27.2.1",
        puppeteer: "^3.3.0",
        tar: "^6.1.11",
        "ts-jest": "^27.0.5",
        typedoc: "^0.22.18",
        "typedoc-plugin-merge-modules": "^3.1.0",
        typescript: "^4.7.4",
        uuid: "^8.3.2",
        yargs: "^17.2.1"
      },
      dependencies: {
        "@aws-sdk/util-utf8-browser": "^3.109.0",
        "@httptoolkit/websocket-stream": "^6.0.0",
        axios: "^0.24.0",
        buffer: "^6.0.3",
        "cmake-js": "^6.3.2",
        "crypto-js": "^4.0.0",
        mqtt: "^4.3.7",
        process: "^0.11.10",
        tar: "^6.1.11"
      }
    };
  }
});

// node_modules/aws-crt/dist/common/platform.js
var require_platform = __commonJS({
  "node_modules/aws-crt/dist/common/platform.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.crt_version = exports.package_info = exports.is_browser = exports.is_nodejs = void 0;
    function is_nodejs() {
      return typeof process === "object" && typeof process.versions === "object" && typeof process.versions.node !== "undefined";
    }
    __name(is_nodejs, "is_nodejs");
    exports.is_nodejs = is_nodejs;
    function is_browser() {
      return !is_nodejs();
    }
    __name(is_browser, "is_browser");
    exports.is_browser = is_browser;
    function package_info() {
      try {
        const pkg = require_package();
        return pkg;
      } catch (err) {
        return {
          name: "aws-crt-nodejs",
          version: "UNKNOWN"
        };
      }
    }
    __name(package_info, "package_info");
    exports.package_info = package_info;
    function crt_version() {
      const pkg = package_info();
      return pkg.version;
    }
    __name(crt_version, "crt_version");
    exports.crt_version = crt_version;
  }
});

// node_modules/aws-crt/dist/common/resource_safety.js
var require_resource_safety = __commonJS({
  "node_modules/aws-crt/dist/common/resource_safety.js"(exports) {
    "use strict";
    var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      __name(adopt, "adopt");
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e6) {
            reject(e6);
          }
        }
        __name(fulfilled, "fulfilled");
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e6) {
            reject(e6);
          }
        }
        __name(rejected, "rejected");
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        __name(step, "step");
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.using = void 0;
    function using(resource, func) {
      return __awaiter(this, void 0, void 0, function* () {
        try {
          yield func(resource);
        } finally {
          resource.close();
        }
      });
    }
    __name(using, "using");
    exports.using = using;
  }
});

// node_modules/aws-crt/dist/native/binding.js
var require_binding = __commonJS({
  "node_modules/aws-crt/dist/native/binding.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o6, m6, k6, k22) {
      if (k22 === void 0)
        k22 = k6;
      var desc = Object.getOwnPropertyDescriptor(m6, k6);
      if (!desc || ("get" in desc ? !m6.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m6[k6];
        } };
      }
      Object.defineProperty(o6, k22, desc);
    } : function(o6, m6, k6, k22) {
      if (k22 === void 0)
        k22 = k6;
      o6[k22] = m6[k6];
    });
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? function(o6, v5) {
      Object.defineProperty(o6, "default", { enumerable: true, value: v5 });
    } : function(o6, v5) {
      o6["default"] = v5;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule)
        return mod;
      var result = {};
      if (mod != null) {
        for (var k6 in mod)
          if (k6 !== "default" && Object.prototype.hasOwnProperty.call(mod, k6))
            __createBinding(result, mod, k6);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    var path = __importStar(__require("path"));
    var os_1 = __require("os");
    var fs_1 = __require("fs");
    var process_1 = __require("process");
    var upgrade_string = "Please upgrade to node >=10.16.0, or use the provided browser implementation.";
    if ("napi" in process_1.versions) {
      const napi_version = parseInt(process_1.versions["napi"]);
      if (napi_version < 4) {
        throw new Error("The AWS CRT native implementation requires that NAPI version 4 be present. " + upgrade_string);
      }
    } else {
      throw new Error("The current runtime is not reporting an NAPI version. " + upgrade_string);
    }
    var binary_name = "aws-crt-nodejs";
    var platformDir = `${os_1.platform}-${os_1.arch}`;
    var source_root = path.resolve(__dirname, "..", "..");
    var dist = path.join(source_root, "dist");
    if ((0, fs_1.existsSync)(dist)) {
      source_root = dist;
    }
    var bin_path = path.resolve(source_root, "bin");
    var search_paths = [
      path.join(bin_path, platformDir, binary_name)
    ];
    var binding;
    for (const path2 of search_paths) {
      if ((0, fs_1.existsSync)(path2 + ".node")) {
        binding = __require(path2);
        break;
      }
    }
    if (binding == void 0) {
      throw new Error("AWS CRT binary not present in any of the following locations:\n	" + search_paths.join("\n	"));
    }
    exports.default = binding;
  }
});

// node_modules/aws-crt/dist/native/error.js
var require_error = __commonJS({
  "node_modules/aws-crt/dist/native/error.js"(exports) {
    "use strict";
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CrtError = void 0;
    var binding_1 = __importDefault(require_binding());
    var CrtError = class extends Error {
      constructor(error) {
        super(extract_message(error));
        this.error = error;
        this.error_code = extract_code(error);
        this.error_name = extract_name(error);
      }
    };
    __name(CrtError, "CrtError");
    exports.CrtError = CrtError;
    function extract_message(error) {
      if (typeof error === "number") {
        return binding_1.default.error_code_to_string(error);
      } else if (error instanceof CrtError) {
        return error.message;
      }
      return error.toString();
    }
    __name(extract_message, "extract_message");
    function extract_code(error) {
      if (typeof error === "number") {
        return error;
      } else if (error instanceof CrtError) {
        return error.error_code;
      }
      return void 0;
    }
    __name(extract_code, "extract_code");
    function extract_name(error) {
      if (typeof error === "number") {
        return binding_1.default.error_code_to_name(error);
      } else if (error instanceof CrtError) {
        return error.error_name;
      }
      return void 0;
    }
    __name(extract_name, "extract_name");
  }
});

// node_modules/aws-crt/dist/native/native_resource.js
var require_native_resource = __commonJS({
  "node_modules/aws-crt/dist/native/native_resource.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.NativeResourceMixin = exports.NativeResource = void 0;
    var NativeResource = class {
      constructor(handle) {
        this.handle = handle;
      }
      native_handle() {
        return this.handle;
      }
    };
    __name(NativeResource, "NativeResource");
    exports.NativeResource = NativeResource;
    function NativeResourceMixin(Base) {
      return class extends Base {
        constructor(...args) {
          const handle = args.shift();
          super(...args);
          this._handle = handle;
        }
        _super(handle) {
          this._handle = handle;
        }
        native_handle() {
          return this._handle;
        }
      };
    }
    __name(NativeResourceMixin, "NativeResourceMixin");
    exports.NativeResourceMixin = NativeResourceMixin;
  }
});

// node_modules/aws-crt/dist/common/io.js
var require_io = __commonJS({
  "node_modules/aws-crt/dist/common/io.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SocketDomain = exports.SocketType = exports.TlsVersion = void 0;
    var TlsVersion;
    (function(TlsVersion2) {
      TlsVersion2[TlsVersion2["SSLv3"] = 0] = "SSLv3";
      TlsVersion2[TlsVersion2["TLSv1"] = 1] = "TLSv1";
      TlsVersion2[TlsVersion2["TLSv1_1"] = 2] = "TLSv1_1";
      TlsVersion2[TlsVersion2["TLSv1_2"] = 3] = "TLSv1_2";
      TlsVersion2[TlsVersion2["TLSv1_3"] = 4] = "TLSv1_3";
      TlsVersion2[TlsVersion2["Default"] = 128] = "Default";
    })(TlsVersion = exports.TlsVersion || (exports.TlsVersion = {}));
    var SocketType;
    (function(SocketType2) {
      SocketType2[SocketType2["STREAM"] = 0] = "STREAM";
      SocketType2[SocketType2["DGRAM"] = 1] = "DGRAM";
    })(SocketType = exports.SocketType || (exports.SocketType = {}));
    var SocketDomain;
    (function(SocketDomain2) {
      SocketDomain2[SocketDomain2["IPV4"] = 0] = "IPV4";
      SocketDomain2[SocketDomain2["IPV6"] = 1] = "IPV6";
      SocketDomain2[SocketDomain2["LOCAL"] = 2] = "LOCAL";
    })(SocketDomain = exports.SocketDomain || (exports.SocketDomain = {}));
  }
});

// node_modules/aws-crt/dist/native/io.js
var require_io2 = __commonJS({
  "node_modules/aws-crt/dist/native/io.js"(exports) {
    "use strict";
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Pkcs11Lib = exports.TlsConnectionOptions = exports.ServerTlsContext = exports.ClientTlsContext = exports.TlsContext = exports.TlsContextOptions = exports.SocketOptions = exports.ClientBootstrap = exports.InputStream = exports.is_alpn_available = exports.enable_logging = exports.LogLevel = exports.error_code_to_name = exports.error_code_to_string = exports.SocketDomain = exports.SocketType = exports.TlsVersion = void 0;
    var binding_1 = __importDefault(require_binding());
    var native_resource_1 = require_native_resource();
    var io_1 = require_io();
    var io_2 = require_io();
    Object.defineProperty(exports, "TlsVersion", { enumerable: true, get: function() {
      return io_2.TlsVersion;
    } });
    Object.defineProperty(exports, "SocketType", { enumerable: true, get: function() {
      return io_2.SocketType;
    } });
    Object.defineProperty(exports, "SocketDomain", { enumerable: true, get: function() {
      return io_2.SocketDomain;
    } });
    var error_1 = require_error();
    function error_code_to_string(error_code) {
      return binding_1.default.error_code_to_string(error_code);
    }
    __name(error_code_to_string, "error_code_to_string");
    exports.error_code_to_string = error_code_to_string;
    function error_code_to_name(error_code) {
      return binding_1.default.error_code_to_name(error_code);
    }
    __name(error_code_to_name, "error_code_to_name");
    exports.error_code_to_name = error_code_to_name;
    var LogLevel;
    (function(LogLevel2) {
      LogLevel2[LogLevel2["NONE"] = 0] = "NONE";
      LogLevel2[LogLevel2["FATAL"] = 1] = "FATAL";
      LogLevel2[LogLevel2["ERROR"] = 2] = "ERROR";
      LogLevel2[LogLevel2["WARN"] = 3] = "WARN";
      LogLevel2[LogLevel2["INFO"] = 4] = "INFO";
      LogLevel2[LogLevel2["DEBUG"] = 5] = "DEBUG";
      LogLevel2[LogLevel2["TRACE"] = 6] = "TRACE";
    })(LogLevel = exports.LogLevel || (exports.LogLevel = {}));
    function enable_logging(level) {
      binding_1.default.io_logging_enable(level);
    }
    __name(enable_logging, "enable_logging");
    exports.enable_logging = enable_logging;
    function is_alpn_available() {
      return binding_1.default.is_alpn_available();
    }
    __name(is_alpn_available, "is_alpn_available");
    exports.is_alpn_available = is_alpn_available;
    var InputStream = class extends native_resource_1.NativeResource {
      constructor(source) {
        super(binding_1.default.io_input_stream_new(16 * 1024));
        this.source = source;
        this.source.on("data", (data) => {
          data = Buffer.isBuffer(data) ? data : Buffer.from(data.toString());
          binding_1.default.io_input_stream_append(this.native_handle(), data);
        });
        this.source.on("end", () => {
          binding_1.default.io_input_stream_append(this.native_handle(), void 0);
        });
      }
    };
    __name(InputStream, "InputStream");
    exports.InputStream = InputStream;
    var ClientBootstrap = class extends native_resource_1.NativeResource {
      constructor() {
        super(binding_1.default.io_client_bootstrap_new());
      }
    };
    __name(ClientBootstrap, "ClientBootstrap");
    exports.ClientBootstrap = ClientBootstrap;
    var SocketOptions = class extends native_resource_1.NativeResource {
      constructor(type = io_1.SocketType.STREAM, domain = io_1.SocketDomain.IPV6, connect_timeout_ms = 5e3, keepalive = false, keep_alive_interval_sec = 0, keep_alive_timeout_sec = 0, keep_alive_max_failed_probes = 0) {
        super(binding_1.default.io_socket_options_new(type, domain, connect_timeout_ms, keep_alive_interval_sec, keep_alive_timeout_sec, keep_alive_max_failed_probes, keepalive));
      }
    };
    __name(SocketOptions, "SocketOptions");
    exports.SocketOptions = SocketOptions;
    var TlsContextOptions = class {
      constructor() {
        this.min_tls_version = io_1.TlsVersion.Default;
        this.alpn_list = [];
        this.verify_peer = true;
      }
      override_default_trust_store_from_path(ca_dirpath, ca_filepath) {
        this.ca_dirpath = ca_dirpath;
        this.ca_filepath = ca_filepath;
      }
      override_default_trust_store(certificate_authority) {
        this.certificate_authority = certificate_authority;
      }
      static create_client_with_mtls(certificate, private_key) {
        let opt = new TlsContextOptions();
        opt.certificate = certificate;
        opt.private_key = private_key;
        opt.verify_peer = true;
        return opt;
      }
      static create_client_with_mtls_from_path(certificate_filepath, private_key_filepath) {
        let opt = new TlsContextOptions();
        opt.certificate_filepath = certificate_filepath;
        opt.private_key_filepath = private_key_filepath;
        opt.verify_peer = true;
        return opt;
      }
      static create_client_with_mtls_pkcs12_from_path(pkcs12_filepath, pkcs12_password) {
        let opt = new TlsContextOptions();
        opt.pkcs12_filepath = pkcs12_filepath;
        opt.pkcs12_password = pkcs12_password;
        opt.verify_peer = true;
        return opt;
      }
      static create_client_with_mtls_pkcs_from_path(pkcs12_filepath, pkcs12_password) {
        return this.create_client_with_mtls_pkcs12_from_path(pkcs12_filepath, pkcs12_password);
      }
      static create_client_with_mtls_pkcs11(options) {
        let opt = new TlsContextOptions();
        opt.pkcs11_options = options;
        opt.verify_peer = true;
        return opt;
      }
      static create_client_with_mtls_windows_cert_store_path(certificate_path) {
        let opt = new TlsContextOptions();
        opt.windows_cert_store_path = certificate_path;
        opt.verify_peer = true;
        return opt;
      }
      static create_server_with_mtls_from_path(certificate_filepath, private_key_filepath) {
        let opt = new TlsContextOptions();
        opt.certificate_filepath = certificate_filepath;
        opt.private_key_filepath = private_key_filepath;
        opt.verify_peer = false;
        return opt;
      }
      static create_server_with_mtls_pkcs_from_path(pkcs12_filepath, pkcs12_password) {
        let opt = new TlsContextOptions();
        opt.pkcs12_filepath = pkcs12_filepath;
        opt.pkcs12_password = pkcs12_password;
        opt.verify_peer = false;
        return opt;
      }
    };
    __name(TlsContextOptions, "TlsContextOptions");
    exports.TlsContextOptions = TlsContextOptions;
    var TlsContext = class extends native_resource_1.NativeResource {
      constructor(ctx_opt) {
        if (ctx_opt == null || ctx_opt == void 0) {
          throw new error_1.CrtError("TlsContext constructor: ctx_opt not defined");
        }
        super(binding_1.default.io_tls_ctx_new(ctx_opt.min_tls_version, ctx_opt.ca_filepath, ctx_opt.ca_dirpath, ctx_opt.certificate_authority, ctx_opt.alpn_list && ctx_opt.alpn_list.length > 0 ? ctx_opt.alpn_list.join(";") : void 0, ctx_opt.certificate_filepath, ctx_opt.certificate, ctx_opt.private_key_filepath, ctx_opt.private_key, ctx_opt.pkcs12_filepath, ctx_opt.pkcs12_password, ctx_opt.pkcs11_options, ctx_opt.windows_cert_store_path, ctx_opt.verify_peer));
      }
    };
    __name(TlsContext, "TlsContext");
    exports.TlsContext = TlsContext;
    var ClientTlsContext = class extends TlsContext {
      constructor(ctx_opt) {
        if (!ctx_opt) {
          ctx_opt = new TlsContextOptions();
          ctx_opt.verify_peer = true;
        }
        super(ctx_opt);
      }
    };
    __name(ClientTlsContext, "ClientTlsContext");
    exports.ClientTlsContext = ClientTlsContext;
    var ServerTlsContext = class extends TlsContext {
      constructor(ctx_opt) {
        if (!ctx_opt) {
          ctx_opt = new TlsContextOptions();
          ctx_opt.verify_peer = false;
        }
        super(ctx_opt);
      }
    };
    __name(ServerTlsContext, "ServerTlsContext");
    exports.ServerTlsContext = ServerTlsContext;
    var TlsConnectionOptions = class extends native_resource_1.NativeResource {
      constructor(tls_ctx, server_name, alpn_list = []) {
        if (tls_ctx == null || tls_ctx == void 0) {
          throw new error_1.CrtError("TlsConnectionOptions constructor: tls_ctx not defined");
        }
        super(binding_1.default.io_tls_connection_options_new(tls_ctx.native_handle(), server_name, alpn_list && alpn_list.length > 0 ? alpn_list.join(";") : void 0));
        this.tls_ctx = tls_ctx;
        this.server_name = server_name;
        this.alpn_list = alpn_list;
      }
    };
    __name(TlsConnectionOptions, "TlsConnectionOptions");
    exports.TlsConnectionOptions = TlsConnectionOptions;
    var Pkcs11Lib = class extends native_resource_1.NativeResource {
      constructor(path, behavior = Pkcs11Lib.InitializeFinalizeBehavior.DEFAULT) {
        super(binding_1.default.io_pkcs11_lib_new(path, behavior));
      }
      close() {
        binding_1.default.io_pkcs11_lib_close(this.native_handle());
      }
    };
    __name(Pkcs11Lib, "Pkcs11Lib");
    exports.Pkcs11Lib = Pkcs11Lib;
    (function(Pkcs11Lib2) {
      let InitializeFinalizeBehavior;
      (function(InitializeFinalizeBehavior2) {
        InitializeFinalizeBehavior2[InitializeFinalizeBehavior2["DEFAULT"] = 0] = "DEFAULT";
        InitializeFinalizeBehavior2[InitializeFinalizeBehavior2["OMIT"] = 1] = "OMIT";
        InitializeFinalizeBehavior2[InitializeFinalizeBehavior2["STRICT"] = 2] = "STRICT";
      })(InitializeFinalizeBehavior = Pkcs11Lib2.InitializeFinalizeBehavior || (Pkcs11Lib2.InitializeFinalizeBehavior = {}));
    })(Pkcs11Lib = exports.Pkcs11Lib || (exports.Pkcs11Lib = {}));
  }
});

// node_modules/aws-crt/dist/native/auth.js
var require_auth = __commonJS({
  "node_modules/aws-crt/dist/native/auth.js"(exports) {
    "use strict";
    var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      __name(adopt, "adopt");
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e6) {
            reject(e6);
          }
        }
        __name(fulfilled, "fulfilled");
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e6) {
            reject(e6);
          }
        }
        __name(rejected, "rejected");
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        __name(step, "step");
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.aws_verify_sigv4a_signing = exports.aws_sign_request = exports.AwsSignedBodyHeaderType = exports.AwsSignedBodyValue = exports.AwsSignatureType = exports.AwsSigningAlgorithm = exports.AwsCredentialsProvider = void 0;
    var binding_1 = __importDefault(require_binding());
    var error_1 = require_error();
    var io_1 = require_io2();
    var AwsCredentialsProvider = class extends binding_1.default.AwsCredentialsProvider {
      static newDefault(bootstrap = void 0) {
        return super.newDefault(bootstrap != null ? bootstrap.native_handle() : null);
      }
      static newStatic(access_key, secret_key, session_token) {
        return super.newStatic(access_key, secret_key, session_token);
      }
      static newCognito(config) {
        if (config == null || config == void 0) {
          throw new error_1.CrtError("AwsCredentialsProvider newCognito: Cognito config not defined");
        }
        return super.newCognito(config, config.tlsContext != null ? config.tlsContext.native_handle() : new io_1.ClientTlsContext().native_handle(), config.bootstrap != null ? config.bootstrap.native_handle() : null, config.httpProxyOptions ? config.httpProxyOptions.create_native_handle() : null);
      }
      static newX509(config) {
        if (config == null || config == void 0) {
          throw new error_1.CrtError("AwsCredentialsProvider newX509: X509 config not defined");
        }
        return super.newX509(config, config.tlsContext.native_handle(), config.httpProxyOptions ? config.httpProxyOptions.create_native_handle() : null);
      }
    };
    __name(AwsCredentialsProvider, "AwsCredentialsProvider");
    exports.AwsCredentialsProvider = AwsCredentialsProvider;
    var AwsSigningAlgorithm;
    (function(AwsSigningAlgorithm2) {
      AwsSigningAlgorithm2[AwsSigningAlgorithm2["SigV4"] = 0] = "SigV4";
      AwsSigningAlgorithm2[AwsSigningAlgorithm2["SigV4Asymmetric"] = 1] = "SigV4Asymmetric";
    })(AwsSigningAlgorithm = exports.AwsSigningAlgorithm || (exports.AwsSigningAlgorithm = {}));
    var AwsSignatureType;
    (function(AwsSignatureType2) {
      AwsSignatureType2[AwsSignatureType2["HttpRequestViaHeaders"] = 0] = "HttpRequestViaHeaders";
      AwsSignatureType2[AwsSignatureType2["HttpRequestViaQueryParams"] = 1] = "HttpRequestViaQueryParams";
      AwsSignatureType2[AwsSignatureType2["HttpRequestChunk"] = 2] = "HttpRequestChunk";
      AwsSignatureType2[AwsSignatureType2["HttpRequestEvent"] = 3] = "HttpRequestEvent";
    })(AwsSignatureType = exports.AwsSignatureType || (exports.AwsSignatureType = {}));
    var AwsSignedBodyValue;
    (function(AwsSignedBodyValue2) {
      AwsSignedBodyValue2["EmptySha256"] = "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";
      AwsSignedBodyValue2["UnsignedPayload"] = "UNSIGNED-PAYLOAD";
      AwsSignedBodyValue2["StreamingAws4HmacSha256Payload"] = "STREAMING-AWS4-HMAC-SHA256-PAYLOAD";
      AwsSignedBodyValue2["StreamingAws4HmacSha256Events"] = "STREAMING-AWS4-HMAC-SHA256-EVENTS";
    })(AwsSignedBodyValue = exports.AwsSignedBodyValue || (exports.AwsSignedBodyValue = {}));
    var AwsSignedBodyHeaderType;
    (function(AwsSignedBodyHeaderType2) {
      AwsSignedBodyHeaderType2[AwsSignedBodyHeaderType2["None"] = 0] = "None";
      AwsSignedBodyHeaderType2[AwsSignedBodyHeaderType2["XAmzContentSha256"] = 1] = "XAmzContentSha256";
    })(AwsSignedBodyHeaderType = exports.AwsSignedBodyHeaderType || (exports.AwsSignedBodyHeaderType = {}));
    function aws_sign_request(request2, config) {
      return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
          try {
            binding_1.default.aws_sign_request(request2, config, (error_code) => {
              if (error_code == 0) {
                resolve(request2);
              } else {
                reject(new error_1.CrtError(error_code));
              }
            });
          } catch (error) {
            reject(error);
          }
        });
      });
    }
    __name(aws_sign_request, "aws_sign_request");
    exports.aws_sign_request = aws_sign_request;
    function aws_verify_sigv4a_signing(request2, config, expected_canonical_request, signature, ecc_key_pub_x, ecc_key_pub_y) {
      return binding_1.default.aws_verify_sigv4a_signing(request2, config, expected_canonical_request, signature, ecc_key_pub_x, ecc_key_pub_y);
    }
    __name(aws_verify_sigv4a_signing, "aws_verify_sigv4a_signing");
    exports.aws_verify_sigv4a_signing = aws_verify_sigv4a_signing;
  }
});

// node_modules/aws-crt/dist/native/checksums.js
var require_checksums = __commonJS({
  "node_modules/aws-crt/dist/native/checksums.js"(exports) {
    "use strict";
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.crc32c = exports.crc32 = void 0;
    var binding_1 = __importDefault(require_binding());
    function crc32(data, previous) {
      return binding_1.default.checksums_crc32(data, previous);
    }
    __name(crc32, "crc32");
    exports.crc32 = crc32;
    function crc32c(data, previous) {
      return binding_1.default.checksums_crc32c(data, previous);
    }
    __name(crc32c, "crc32c");
    exports.crc32c = crc32c;
  }
});

// node_modules/aws-crt/dist/native/crt.js
var require_crt = __commonJS({
  "node_modules/aws-crt/dist/native/crt.js"(exports) {
    "use strict";
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.native_memory_dump = exports.native_memory = void 0;
    var binding_1 = __importDefault(require_binding());
    function native_memory() {
      return binding_1.default.native_memory();
    }
    __name(native_memory, "native_memory");
    exports.native_memory = native_memory;
    function native_memory_dump() {
      return binding_1.default.native_memory_dump();
    }
    __name(native_memory_dump, "native_memory_dump");
    exports.native_memory_dump = native_memory_dump;
  }
});

// node_modules/aws-crt/dist/native/crypto.js
var require_crypto = __commonJS({
  "node_modules/aws-crt/dist/native/crypto.js"(exports) {
    "use strict";
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.hmac_sha256 = exports.Sha256Hmac = exports.hash_sha1 = exports.Sha1Hash = exports.hash_sha256 = exports.Sha256Hash = exports.hash_md5 = exports.Md5Hash = void 0;
    var binding_1 = __importDefault(require_binding());
    var native_resource_1 = require_native_resource();
    var Hash2 = class extends native_resource_1.NativeResource {
      update(data) {
        binding_1.default.hash_update(this.native_handle(), data);
      }
      finalize(truncate_to) {
        return binding_1.default.hash_digest(this.native_handle(), truncate_to);
      }
      constructor(hash_handle) {
        super(hash_handle);
      }
    };
    __name(Hash2, "Hash");
    var Md5Hash = class extends Hash2 {
      constructor() {
        super(binding_1.default.hash_md5_new());
      }
    };
    __name(Md5Hash, "Md5Hash");
    exports.Md5Hash = Md5Hash;
    function hash_md5(data, truncate_to) {
      return binding_1.default.hash_md5_compute(data, truncate_to);
    }
    __name(hash_md5, "hash_md5");
    exports.hash_md5 = hash_md5;
    var Sha256Hash = class extends Hash2 {
      constructor() {
        super(binding_1.default.hash_sha256_new());
      }
    };
    __name(Sha256Hash, "Sha256Hash");
    exports.Sha256Hash = Sha256Hash;
    function hash_sha256(data, truncate_to) {
      return binding_1.default.hash_sha256_compute(data, truncate_to);
    }
    __name(hash_sha256, "hash_sha256");
    exports.hash_sha256 = hash_sha256;
    var Sha1Hash = class extends Hash2 {
      constructor() {
        super(binding_1.default.hash_sha1_new());
      }
    };
    __name(Sha1Hash, "Sha1Hash");
    exports.Sha1Hash = Sha1Hash;
    function hash_sha1(data, truncate_to) {
      return binding_1.default.hash_sha1_compute(data, truncate_to);
    }
    __name(hash_sha1, "hash_sha1");
    exports.hash_sha1 = hash_sha1;
    var Hmac = class extends native_resource_1.NativeResource {
      update(data) {
        binding_1.default.hmac_update(this.native_handle(), data);
      }
      finalize(truncate_to) {
        return binding_1.default.hmac_digest(this.native_handle(), truncate_to);
      }
      constructor(hash_handle) {
        super(hash_handle);
      }
    };
    __name(Hmac, "Hmac");
    var Sha256Hmac = class extends Hmac {
      constructor(secret) {
        super(binding_1.default.hmac_sha256_new(secret));
      }
    };
    __name(Sha256Hmac, "Sha256Hmac");
    exports.Sha256Hmac = Sha256Hmac;
    function hmac_sha256(secret, data, truncate_to) {
      return binding_1.default.hmac_sha256_compute(secret, data, truncate_to);
    }
    __name(hmac_sha256, "hmac_sha256");
    exports.hmac_sha256 = hmac_sha256;
  }
});

// node_modules/aws-crt/dist/common/event.js
var require_event = __commonJS({
  "node_modules/aws-crt/dist/common/event.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BufferedEventEmitter = void 0;
    var events_1 = __require("events");
    var BufferedEvent = class {
      constructor(event, args) {
        this.event = event;
        this.args = args;
      }
    };
    __name(BufferedEvent, "BufferedEvent");
    var BufferedEventEmitter = class extends events_1.EventEmitter {
      constructor() {
        super();
        this.corked = false;
      }
      cork() {
        this.corked = true;
      }
      uncork() {
        this.corked = false;
        while (this.eventQueue) {
          const event = this.eventQueue;
          super.emit(event.event, ...event.args);
          this.eventQueue = this.eventQueue.next;
        }
      }
      emit(event, ...args) {
        if (this.corked) {
          let last = this.lastQueuedEvent;
          this.lastQueuedEvent = new BufferedEvent(event, args);
          if (last) {
            last.next = this.lastQueuedEvent;
          } else {
            this.eventQueue = this.lastQueuedEvent;
          }
          return this.listeners(event).length > 0;
        }
        return super.emit(event, ...args);
      }
    };
    __name(BufferedEventEmitter, "BufferedEventEmitter");
    exports.BufferedEventEmitter = BufferedEventEmitter;
  }
});

// node_modules/aws-crt/dist/native/eventstream_utils.js
var require_eventstream_utils = __commonJS({
  "node_modules/aws-crt/dist/native/eventstream_utils.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.unmarshalInt64BigintFromBuffer = exports.marshalInt64BigintAsBuffer = exports.MIN_INT64 = exports.MAX_INT64 = exports.MIN_INT32 = exports.MAX_INT32 = exports.MIN_INT16 = exports.MAX_INT16 = exports.MIN_INT8 = exports.MAX_INT8 = void 0;
    var error_1 = require_error();
    exports.MAX_INT8 = 127;
    exports.MIN_INT8 = -128;
    exports.MAX_INT16 = 32767;
    exports.MIN_INT16 = -32768;
    exports.MAX_INT32 = 2147483647;
    exports.MIN_INT32 = -2147483648;
    exports.MAX_INT64 = BigInt("9223372036854775807");
    exports.MIN_INT64 = BigInt("-9223372036854775808");
    var MAX_UINT8_AS_BIGINT = BigInt("256");
    function marshalInt64BigintAsBuffer(value) {
      if (value < exports.MIN_INT64 || value > exports.MAX_INT64) {
        throw new error_1.CrtError("marshalInt64BigintAsBuffer expects a value that can fit in 8 bytes");
      }
      let buffer = new Uint8Array(8);
      if (value < 0) {
        value = -value - BigInt(1);
        for (let i6 = 0; i6 < 8; ++i6) {
          buffer[i6] = 255 - Number(value % MAX_UINT8_AS_BIGINT);
          value /= MAX_UINT8_AS_BIGINT;
        }
      } else {
        for (let i6 = 0; i6 < 8; ++i6) {
          buffer[i6] = Number(value % MAX_UINT8_AS_BIGINT);
          value /= MAX_UINT8_AS_BIGINT;
        }
      }
      return buffer;
    }
    __name(marshalInt64BigintAsBuffer, "marshalInt64BigintAsBuffer");
    exports.marshalInt64BigintAsBuffer = marshalInt64BigintAsBuffer;
    function unmarshalInt64BigintFromBuffer(buffer) {
      let value = BigInt(0);
      let byteView = new Uint8Array(buffer);
      if (byteView.length != 8) {
        throw new error_1.CrtError("unmarshalInt64BigintFromBuffer expects a byte buffer of length 8");
      }
      let shift = BigInt(1);
      let isNegative = (byteView[7] & 128) != 0;
      if (isNegative) {
        for (let i6 = 0; i6 < byteView.length; ++i6) {
          let byteValue = BigInt(255 - byteView[i6]);
          value += byteValue * shift;
          shift *= MAX_UINT8_AS_BIGINT;
        }
        value += BigInt(1);
        value = -value;
      } else {
        for (let i6 = 0; i6 < byteView.length; ++i6) {
          let byteValue = BigInt(byteView[i6]);
          value += byteValue * shift;
          shift *= MAX_UINT8_AS_BIGINT;
        }
      }
      return value;
    }
    __name(unmarshalInt64BigintFromBuffer, "unmarshalInt64BigintFromBuffer");
    exports.unmarshalInt64BigintFromBuffer = unmarshalInt64BigintFromBuffer;
  }
});

// node_modules/aws-crt/dist/native/eventstream.js
var require_eventstream = __commonJS({
  "node_modules/aws-crt/dist/native/eventstream.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o6, m6, k6, k22) {
      if (k22 === void 0)
        k22 = k6;
      var desc = Object.getOwnPropertyDescriptor(m6, k6);
      if (!desc || ("get" in desc ? !m6.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m6[k6];
        } };
      }
      Object.defineProperty(o6, k22, desc);
    } : function(o6, m6, k6, k22) {
      if (k22 === void 0)
        k22 = k6;
      o6[k22] = m6[k6];
    });
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? function(o6, v5) {
      Object.defineProperty(o6, "default", { enumerable: true, value: v5 });
    } : function(o6, v5) {
      o6["default"] = v5;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule)
        return mod;
      var result = {};
      if (mod != null) {
        for (var k6 in mod)
          if (k6 !== "default" && Object.prototype.hasOwnProperty.call(mod, k6))
            __createBinding(result, mod, k6);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      __name(adopt, "adopt");
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e6) {
            reject(e6);
          }
        }
        __name(fulfilled, "fulfilled");
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e6) {
            reject(e6);
          }
        }
        __name(rejected, "rejected");
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        __name(step, "step");
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ClientStream = exports.ClientConnection = exports.MessageType = exports.MessageFlags = exports.Header = exports.HeaderType = void 0;
    var native_resource_1 = require_native_resource();
    var event_1 = require_event();
    var error_1 = require_error();
    var io = __importStar(require_io2());
    var eventstream_utils = __importStar(require_eventstream_utils());
    var promise = __importStar(require_promise());
    var binding_1 = __importDefault(require_binding());
    var HeaderType;
    (function(HeaderType2) {
      HeaderType2[HeaderType2["BooleanTrue"] = 0] = "BooleanTrue";
      HeaderType2[HeaderType2["BooleanFalse"] = 1] = "BooleanFalse";
      HeaderType2[HeaderType2["Byte"] = 2] = "Byte";
      HeaderType2[HeaderType2["Int16"] = 3] = "Int16";
      HeaderType2[HeaderType2["Int32"] = 4] = "Int32";
      HeaderType2[HeaderType2["Int64"] = 5] = "Int64";
      HeaderType2[HeaderType2["ByteBuffer"] = 6] = "ByteBuffer";
      HeaderType2[HeaderType2["String"] = 7] = "String";
      HeaderType2[HeaderType2["Timestamp"] = 8] = "Timestamp";
      HeaderType2[HeaderType2["UUID"] = 9] = "UUID";
    })(HeaderType = exports.HeaderType || (exports.HeaderType = {}));
    var AWS_MAXIMUM_EVENT_STREAM_HEADER_NAME_LENGTH = 127;
    var Header = class {
      constructor(name, type, value) {
        this.name = name;
        this.type = type;
        this.value = value;
      }
      static validateHeaderName(name) {
        if (name.length == 0 || name.length > AWS_MAXIMUM_EVENT_STREAM_HEADER_NAME_LENGTH) {
          throw new error_1.CrtError(`Event stream header name (${name}) is not valid`);
        }
      }
      static newBoolean(name, value) {
        Header.validateHeaderName(name);
        if (value) {
          return new Header(name, HeaderType.BooleanTrue);
        } else {
          return new Header(name, HeaderType.BooleanFalse);
        }
      }
      static newByte(name, value) {
        Header.validateHeaderName(name);
        if (value >= eventstream_utils.MIN_INT8 && value <= eventstream_utils.MAX_INT8 && Number.isSafeInteger(value)) {
          return new Header(name, HeaderType.Byte, value);
        }
        throw new error_1.CrtError(`Illegal value for eventstream byte-valued header: ${value}`);
      }
      static newInt16(name, value) {
        Header.validateHeaderName(name);
        if (value >= eventstream_utils.MIN_INT16 && value <= eventstream_utils.MAX_INT16 && Number.isSafeInteger(value)) {
          return new Header(name, HeaderType.Int16, value);
        }
        throw new error_1.CrtError(`Illegal value for eventstream int16-valued header: ${value}`);
      }
      static newInt32(name, value) {
        Header.validateHeaderName(name);
        if (value >= eventstream_utils.MIN_INT32 && value <= eventstream_utils.MAX_INT32 && Number.isSafeInteger(value)) {
          return new Header(name, HeaderType.Int32, value);
        }
        throw new error_1.CrtError(`Illegal value for eventstream int32-valued header: ${value}`);
      }
      static newInt64FromNumber(name, value) {
        Header.validateHeaderName(name);
        if (Number.isSafeInteger(value)) {
          return new Header(name, HeaderType.Int64, eventstream_utils.marshalInt64BigintAsBuffer(BigInt(value)));
        }
        throw new error_1.CrtError(`Illegal value for eventstream int64-valued header: ${value}`);
      }
      static newInt64FromBigint(name, value) {
        Header.validateHeaderName(name);
        if (value >= eventstream_utils.MIN_INT64 && value <= eventstream_utils.MAX_INT64) {
          return new Header(name, HeaderType.Int64, eventstream_utils.marshalInt64BigintAsBuffer(value));
        }
        throw new error_1.CrtError(`Illegal value for eventstream int64-valued header: ${value}`);
      }
      static newByteBuffer(name, value) {
        Header.validateHeaderName(name);
        return new Header(name, HeaderType.ByteBuffer, value);
      }
      static newString(name, value) {
        Header.validateHeaderName(name);
        return new Header(name, HeaderType.String, value);
      }
      static newTimeStampFromSecondsSinceEpoch(name, secondsSinceEpoch) {
        Header.validateHeaderName(name);
        if (Number.isSafeInteger(secondsSinceEpoch) && secondsSinceEpoch >= 0) {
          return new Header(name, HeaderType.Timestamp, secondsSinceEpoch);
        }
        throw new error_1.CrtError(`Illegal value for eventstream timestamp-valued header: ${secondsSinceEpoch}`);
      }
      static newTimeStampFromDate(name, date) {
        Header.validateHeaderName(name);
        const secondsSinceEpoch = date.getTime();
        if (Number.isSafeInteger(secondsSinceEpoch)) {
          return new Header(name, HeaderType.Timestamp, secondsSinceEpoch);
        }
        throw new error_1.CrtError(`Illegal value for eventstream timestamp-valued header: ${date}`);
      }
      static newUUID(name, value) {
        Header.validateHeaderName(name);
        if (value.byteLength == 16) {
          return new Header(name, HeaderType.UUID, value);
        }
        throw new error_1.CrtError(`Illegal value for eventstream uuid-valued header: ${value}`);
      }
      toValue(type) {
        if (type != this.type) {
          throw new error_1.CrtError(`Header of type (${this.type}) cannot be converted to type (${type})`);
        }
        return this.value;
      }
      asBoolean() {
        switch (this.type) {
          case HeaderType.BooleanFalse:
            return false;
          case HeaderType.BooleanTrue:
            return true;
          default:
            throw new error_1.CrtError(`Header of type (${this.type}) cannot be converted to type (boolean)`);
        }
      }
      asByte() {
        return this.toValue(HeaderType.Byte);
      }
      asInt16() {
        return this.toValue(HeaderType.Int16);
      }
      asInt32() {
        return this.toValue(HeaderType.Int32);
      }
      asInt64() {
        return eventstream_utils.unmarshalInt64BigintFromBuffer(this.toValue(HeaderType.Int64));
      }
      asByteBuffer() {
        return this.toValue(HeaderType.ByteBuffer);
      }
      asString() {
        return this.toValue(HeaderType.String);
      }
      asTimestamp() {
        return this.toValue(HeaderType.Timestamp);
      }
      asUUID() {
        return this.toValue(HeaderType.UUID);
      }
    };
    __name(Header, "Header");
    exports.Header = Header;
    var MessageFlags;
    (function(MessageFlags2) {
      MessageFlags2[MessageFlags2["None"] = 0] = "None";
      MessageFlags2[MessageFlags2["ConnectionAccepted"] = 1] = "ConnectionAccepted";
      MessageFlags2[MessageFlags2["TerminateStream"] = 2] = "TerminateStream";
    })(MessageFlags = exports.MessageFlags || (exports.MessageFlags = {}));
    var MessageType;
    (function(MessageType2) {
      MessageType2[MessageType2["ApplicationMessage"] = 0] = "ApplicationMessage";
      MessageType2[MessageType2["ApplicationError"] = 1] = "ApplicationError";
      MessageType2[MessageType2["Ping"] = 2] = "Ping";
      MessageType2[MessageType2["PingResponse"] = 3] = "PingResponse";
      MessageType2[MessageType2["Connect"] = 4] = "Connect";
      MessageType2[MessageType2["ConnectAck"] = 5] = "ConnectAck";
      MessageType2[MessageType2["ProtocolError"] = 6] = "ProtocolError";
      MessageType2[MessageType2["InternalError"] = 7] = "InternalError";
    })(MessageType = exports.MessageType || (exports.MessageType = {}));
    function mapPodHeadersToJSHeaders(headers) {
      return Array.from(headers, (header) => {
        return new Header(header.name, header.type, header.value);
      });
    }
    __name(mapPodHeadersToJSHeaders, "mapPodHeadersToJSHeaders");
    function mapPodMessageToJSMessage(message) {
      let jsMessage = {
        type: message.type,
        flags: message.flags,
        payload: message.payload
      };
      if (message.headers) {
        jsMessage.headers = mapPodHeadersToJSHeaders(message.headers);
      }
      return jsMessage;
    }
    __name(mapPodMessageToJSMessage, "mapPodMessageToJSMessage");
    var ClientConnectionState;
    (function(ClientConnectionState2) {
      ClientConnectionState2[ClientConnectionState2["None"] = 0] = "None";
      ClientConnectionState2[ClientConnectionState2["Connecting"] = 1] = "Connecting";
      ClientConnectionState2[ClientConnectionState2["Connected"] = 2] = "Connected";
      ClientConnectionState2[ClientConnectionState2["Disconnected"] = 3] = "Disconnected";
      ClientConnectionState2[ClientConnectionState2["Closed"] = 4] = "Closed";
    })(ClientConnectionState || (ClientConnectionState = {}));
    var ClientConnection = class extends (0, native_resource_1.NativeResourceMixin)(event_1.BufferedEventEmitter) {
      constructor(config) {
        if (config === void 0) {
          throw new error_1.CrtError("Invalid configuration passed to eventstream ClientConnection constructor");
        }
        super();
        this.state = ClientConnectionState.None;
        this._super(binding_1.default.event_stream_client_connection_new(this, config, (connection, errorCode) => {
          ClientConnection._s_on_disconnect(connection, errorCode);
        }, (connection, message) => {
          ClientConnection._s_on_protocol_message(connection, message);
        }, config.socketOptions ? config.socketOptions.native_handle() : null, config.tlsCtx ? config.tlsCtx.native_handle() : null));
      }
      close() {
        if (this.state != ClientConnectionState.Closed) {
          this.state = ClientConnectionState.Closed;
          binding_1.default.event_stream_client_connection_close(this.native_handle());
        }
      }
      connect(options) {
        return __awaiter(this, void 0, void 0, function* () {
          let cleanupCancelListener = void 0;
          let connectPromise = new Promise((resolve, reject) => {
            if (!options) {
              reject(new error_1.CrtError("Invalid options passed to event stream ClientConnection.connect"));
              return;
            }
            if (this.state != ClientConnectionState.None) {
              reject(new error_1.CrtError(`Event stream connection in a state (${this.state}) where connect() is not allowed.`));
              return;
            }
            this.state = ClientConnectionState.Connecting;
            if (options.cancelController) {
              let cancel = /* @__PURE__ */ __name(() => {
                reject(new error_1.CrtError(`Event stream connection connect() cancelled by external request.`));
                setImmediate(() => {
                  this.close();
                });
              }, "cancel");
              cleanupCancelListener = options.cancelController.addListener(cancel);
              if (!cleanupCancelListener) {
                return;
              }
            }
            function curriedPromiseCallback(connection, errorCode) {
              return ClientConnection._s_on_connection_setup(resolve, reject, connection, errorCode);
            }
            __name(curriedPromiseCallback, "curriedPromiseCallback");
            try {
              binding_1.default.event_stream_client_connection_connect(this.native_handle(), curriedPromiseCallback);
            } catch (e6) {
              this.state = ClientConnectionState.Disconnected;
              reject(e6);
            }
          });
          return promise.makeSelfCleaningPromise(connectPromise, cleanupCancelListener);
        });
      }
      sendProtocolMessage(options) {
        return __awaiter(this, void 0, void 0, function* () {
          let cleanupCancelListener = void 0;
          let sendProtocolMessagePromise = new Promise((resolve, reject) => {
            try {
              let curriedPromiseCallback = function(errorCode) {
                return ClientConnection._s_on_connection_send_protocol_message_completion(resolve, reject, errorCode);
              };
              __name(curriedPromiseCallback, "curriedPromiseCallback");
              if (!options) {
                reject(new error_1.CrtError("Invalid options passed to event stream ClientConnection.sendProtocolMessage"));
                return;
              }
              if (!this.isConnected()) {
                reject(new error_1.CrtError(`Event stream connection in a state (${this.state}) where sending protocol messages is not allowed.`));
                return;
              }
              if (options.cancelController) {
                let cancel = /* @__PURE__ */ __name(() => {
                  reject(new error_1.CrtError(`Event stream connection sendProtocolMessage() cancelled by external request.`));
                  setImmediate(() => {
                    this.close();
                  });
                }, "cancel");
                cleanupCancelListener = options.cancelController.addListener(cancel);
                if (!cleanupCancelListener) {
                  return;
                }
              }
              binding_1.default.event_stream_client_connection_send_protocol_message(this.native_handle(), options, curriedPromiseCallback);
            } catch (e6) {
              reject(e6);
            }
          });
          return promise.makeSelfCleaningPromise(sendProtocolMessagePromise, cleanupCancelListener);
        });
      }
      isConnected() {
        return this.state == ClientConnectionState.Connected;
      }
      newStream() {
        if (!this.isConnected()) {
          throw new error_1.CrtError(`Event stream connection in a state (${this.state}) where creating new streams is forbidden.`);
        }
        return new ClientStream(this);
      }
      on(event, listener) {
        super.on(event, listener);
        return this;
      }
      static _s_on_connection_setup(resolve, reject, connection, errorCode) {
        if (errorCode == 0 && connection.state == ClientConnectionState.Connecting) {
          connection.state = ClientConnectionState.Connected;
          resolve();
        } else {
          if (connection.state != ClientConnectionState.Closed) {
            connection.state = ClientConnectionState.Disconnected;
          }
          reject(io.error_code_to_string(errorCode));
        }
      }
      static _s_on_disconnect(connection, errorCode) {
        if (connection.state != ClientConnectionState.Closed) {
          connection.state = ClientConnectionState.Disconnected;
        }
        process.nextTick(() => {
          connection.emit("disconnection", { errorCode });
        });
      }
      static _s_on_protocol_message(connection, message) {
        process.nextTick(() => {
          connection.emit("protocolMessage", { message: mapPodMessageToJSMessage(message) });
        });
      }
      static _s_on_connection_send_protocol_message_completion(resolve, reject, errorCode) {
        if (errorCode == 0) {
          resolve();
        } else {
          reject(io.error_code_to_string(errorCode));
        }
      }
    };
    __name(ClientConnection, "ClientConnection");
    exports.ClientConnection = ClientConnection;
    ClientConnection.DISCONNECTION = "disconnection";
    ClientConnection.PROTOCOL_MESSAGE = "protocolMessage";
    var ClientStreamState;
    (function(ClientStreamState2) {
      ClientStreamState2[ClientStreamState2["None"] = 0] = "None";
      ClientStreamState2[ClientStreamState2["Activating"] = 1] = "Activating";
      ClientStreamState2[ClientStreamState2["Activated"] = 2] = "Activated";
      ClientStreamState2[ClientStreamState2["Ended"] = 3] = "Ended";
      ClientStreamState2[ClientStreamState2["Closed"] = 4] = "Closed";
    })(ClientStreamState || (ClientStreamState = {}));
    var ClientStream = class extends (0, native_resource_1.NativeResourceMixin)(event_1.BufferedEventEmitter) {
      constructor(connection) {
        super();
        this._super(binding_1.default.event_stream_client_stream_new(this, connection.native_handle(), (stream) => {
          ClientStream._s_on_stream_ended(stream);
        }, (stream, message) => {
          ClientStream._s_on_stream_message(stream, message);
        }));
        this.state = ClientStreamState.None;
      }
      close() {
        if (this.state != ClientStreamState.Closed) {
          this.state = ClientStreamState.Closed;
          binding_1.default.event_stream_client_stream_close(this.native_handle());
        }
      }
      activate(options) {
        return __awaiter(this, void 0, void 0, function* () {
          let cleanupCancelListener = void 0;
          let activatePromise = new Promise((resolve, reject) => {
            try {
              let curriedPromiseCallback = function(stream, errorCode) {
                return ClientStream._s_on_stream_activated(resolve, reject, stream, errorCode);
              };
              __name(curriedPromiseCallback, "curriedPromiseCallback");
              if (this.state != ClientStreamState.None) {
                reject(new error_1.CrtError(`Event stream in a state (${this.state}) where activation is not allowed.`));
                return;
              }
              if (options === void 0) {
                this.state = ClientStreamState.Ended;
                reject(new error_1.CrtError("Invalid options passed to ClientStream.activate"));
                return;
              }
              this.state = ClientStreamState.Activating;
              if (options.cancelController) {
                let cancel = /* @__PURE__ */ __name(() => {
                  reject(new error_1.CrtError(`Event stream activate() cancelled by external request.`));
                  setImmediate(() => {
                    this.close();
                  });
                }, "cancel");
                cleanupCancelListener = options.cancelController.addListener(cancel);
                if (!cleanupCancelListener) {
                  return;
                }
              }
              binding_1.default.event_stream_client_stream_activate(this.native_handle(), options, curriedPromiseCallback);
            } catch (e6) {
              this.state = ClientStreamState.Ended;
              reject(e6);
            }
          });
          return promise.makeSelfCleaningPromise(activatePromise, cleanupCancelListener);
        });
      }
      sendMessage(options) {
        return __awaiter(this, void 0, void 0, function* () {
          let cleanupCancelListener = void 0;
          let sendMessagePromise = new Promise((resolve, reject) => {
            try {
              let curriedPromiseCallback = function(errorCode) {
                return ClientStream._s_on_stream_send_message_completion(resolve, reject, errorCode);
              };
              __name(curriedPromiseCallback, "curriedPromiseCallback");
              if (!options) {
                reject(new error_1.CrtError("Invalid options passed to ClientStream.sendMessage"));
                return;
              }
              if (this.state != ClientStreamState.Activated) {
                reject(new error_1.CrtError(`Event stream in a state (${this.state}) where sending messages is not allowed.`));
                return;
              }
              if (options.cancelController) {
                let cancel = /* @__PURE__ */ __name(() => {
                  reject(new error_1.CrtError(`Event stream sendMessage() cancelled by external request.`));
                  setImmediate(() => {
                    this.close();
                  });
                }, "cancel");
                cleanupCancelListener = options.cancelController.addListener(cancel);
                if (!cleanupCancelListener) {
                  return;
                }
              }
              binding_1.default.event_stream_client_stream_send_message(this.native_handle(), options, curriedPromiseCallback);
            } catch (e6) {
              reject(e6);
            }
          });
          return promise.makeSelfCleaningPromise(sendMessagePromise, cleanupCancelListener);
        });
      }
      isActive() {
        return this.state == ClientStreamState.Activated;
      }
      on(event, listener) {
        super.on(event, listener);
        return this;
      }
      static _s_on_stream_activated(resolve, reject, stream, errorCode) {
        if (errorCode == 0 && stream.state == ClientStreamState.Activating) {
          stream.state = ClientStreamState.Activated;
          resolve();
        } else {
          if (stream.state != ClientStreamState.Closed) {
            stream.state = ClientStreamState.Ended;
          }
          reject(io.error_code_to_string(errorCode));
        }
      }
      static _s_on_stream_send_message_completion(resolve, reject, errorCode) {
        if (errorCode == 0) {
          resolve();
        } else {
          reject(io.error_code_to_string(errorCode));
        }
      }
      static _s_on_stream_ended(stream) {
        process.nextTick(() => {
          stream.emit(ClientStream.ENDED, {});
        });
      }
      static _s_on_stream_message(stream, message) {
        process.nextTick(() => {
          stream.emit(ClientStream.MESSAGE, { message: mapPodMessageToJSMessage(message) });
        });
      }
    };
    __name(ClientStream, "ClientStream");
    exports.ClientStream = ClientStream;
    ClientStream.ENDED = "ended";
    ClientStream.MESSAGE = "message";
  }
});

// node_modules/aws-crt/dist/common/http.js
var require_http = __commonJS({
  "node_modules/aws-crt/dist/common/http.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CommonHttpProxyOptions = exports.HttpProxyAuthenticationType = exports.HttpVersion = void 0;
    var HttpVersion;
    (function(HttpVersion2) {
      HttpVersion2[HttpVersion2["Unknown"] = 0] = "Unknown";
      HttpVersion2[HttpVersion2["Http1_0"] = 1] = "Http1_0";
      HttpVersion2[HttpVersion2["Http1_1"] = 2] = "Http1_1";
      HttpVersion2[HttpVersion2["Http2"] = 3] = "Http2";
    })(HttpVersion = exports.HttpVersion || (exports.HttpVersion = {}));
    var HttpProxyAuthenticationType;
    (function(HttpProxyAuthenticationType2) {
      HttpProxyAuthenticationType2[HttpProxyAuthenticationType2["None"] = 0] = "None";
      HttpProxyAuthenticationType2[HttpProxyAuthenticationType2["Basic"] = 1] = "Basic";
    })(HttpProxyAuthenticationType = exports.HttpProxyAuthenticationType || (exports.HttpProxyAuthenticationType = {}));
    var CommonHttpProxyOptions = class {
      constructor(host_name, port, auth_method = HttpProxyAuthenticationType.None, auth_username, auth_password) {
        this.host_name = host_name;
        this.port = port;
        this.auth_method = auth_method;
        this.auth_username = auth_username;
        this.auth_password = auth_password;
      }
    };
    __name(CommonHttpProxyOptions, "CommonHttpProxyOptions");
    exports.CommonHttpProxyOptions = CommonHttpProxyOptions;
  }
});

// node_modules/aws-crt/dist/native/http.js
var require_http2 = __commonJS({
  "node_modules/aws-crt/dist/native/http.js"(exports) {
    "use strict";
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.HttpClientConnectionManager = exports.HttpClientStream = exports.HttpStream = exports.HttpClientConnection = exports.HttpProxyOptions = exports.HttpProxyConnectionType = exports.HttpConnection = exports.HttpRequest = exports.HttpHeaders = exports.HttpProxyAuthenticationType = void 0;
    var binding_1 = __importDefault(require_binding());
    var native_resource_1 = require_native_resource();
    var error_1 = require_error();
    var http_1 = require_http();
    var http_2 = require_http();
    Object.defineProperty(exports, "HttpProxyAuthenticationType", { enumerable: true, get: function() {
      return http_2.HttpProxyAuthenticationType;
    } });
    var event_1 = require_event();
    exports.HttpHeaders = binding_1.default.HttpHeaders;
    var nativeHttpRequest = binding_1.default.HttpRequest;
    var HttpRequest2 = class extends nativeHttpRequest {
      constructor(method, path, headers, body) {
        super(method, path, headers, body === null || body === void 0 ? void 0 : body.native_handle());
      }
    };
    __name(HttpRequest2, "HttpRequest");
    exports.HttpRequest = HttpRequest2;
    var HttpConnection = class extends (0, native_resource_1.NativeResourceMixin)(event_1.BufferedEventEmitter) {
      constructor(native_handle) {
        super();
        this._super(native_handle);
      }
      close() {
        binding_1.default.http_connection_close(this.native_handle());
      }
      on(event, listener) {
        super.on(event, listener);
        if (event == "connect") {
          process.nextTick(() => {
            this.uncork();
          });
        }
        return this;
      }
    };
    __name(HttpConnection, "HttpConnection");
    exports.HttpConnection = HttpConnection;
    HttpConnection.CONNECT = "connect";
    HttpConnection.ERROR = "error";
    HttpConnection.CLOSE = "close";
    var HttpProxyConnectionType;
    (function(HttpProxyConnectionType2) {
      HttpProxyConnectionType2[HttpProxyConnectionType2["Legacy"] = 0] = "Legacy";
      HttpProxyConnectionType2[HttpProxyConnectionType2["Forwarding"] = 1] = "Forwarding";
      HttpProxyConnectionType2[HttpProxyConnectionType2["Tunneling"] = 2] = "Tunneling";
    })(HttpProxyConnectionType = exports.HttpProxyConnectionType || (exports.HttpProxyConnectionType = {}));
    var HttpProxyOptions = class extends http_1.CommonHttpProxyOptions {
      constructor(host_name, port, auth_method = http_1.HttpProxyAuthenticationType.None, auth_username, auth_password, tls_opts, connection_type) {
        super(host_name, port, auth_method, auth_username, auth_password);
        this.tls_opts = tls_opts;
        this.connection_type = connection_type;
      }
      create_native_handle() {
        return binding_1.default.http_proxy_options_new(this.host_name, this.port, this.auth_method, this.auth_username, this.auth_password, this.tls_opts ? this.tls_opts.native_handle() : void 0, this.connection_type ? this.connection_type : HttpProxyConnectionType.Legacy);
      }
    };
    __name(HttpProxyOptions, "HttpProxyOptions");
    exports.HttpProxyOptions = HttpProxyOptions;
    var HttpClientConnection = class extends HttpConnection {
      constructor(bootstrap, host_name, port, socket_options, tls_opts, proxy_options, handle) {
        if (socket_options == null || socket_options == void 0) {
          throw new error_1.CrtError("HttpClientConnection constructor: socket_options not defined");
        }
        super(handle ? handle : binding_1.default.http_connection_new(bootstrap != null ? bootstrap.native_handle() : null, (handle2, error_code) => {
          this._on_setup(handle2, error_code);
        }, (handle2, error_code) => {
          this._on_shutdown(handle2, error_code);
        }, host_name, port, socket_options.native_handle(), tls_opts ? tls_opts.native_handle() : void 0, proxy_options ? proxy_options.create_native_handle() : void 0));
        this.bootstrap = bootstrap;
        this.socket_options = socket_options;
        this.tls_opts = tls_opts;
      }
      _on_setup(native_handle, error_code) {
        if (error_code) {
          this.emit("error", new error_1.CrtError(error_code));
          return;
        }
        this.emit("connect");
      }
      _on_shutdown(native_handle, error_code) {
        if (error_code) {
          this.emit("error", new error_1.CrtError(error_code));
          return;
        }
        this.emit("close");
      }
      request(request2) {
        let stream;
        const on_response_impl = /* @__PURE__ */ __name((status_code, headers) => {
          stream._on_response(status_code, headers);
        }, "on_response_impl");
        const on_body_impl = /* @__PURE__ */ __name((data) => {
          stream._on_body(data);
        }, "on_body_impl");
        const on_complete_impl = /* @__PURE__ */ __name((error_code) => {
          stream._on_complete(error_code);
        }, "on_complete_impl");
        const native_handle = binding_1.default.http_stream_new(this.native_handle(), request2, on_complete_impl, on_response_impl, on_body_impl);
        return stream = new HttpClientStream(native_handle, this, request2);
      }
    };
    __name(HttpClientConnection, "HttpClientConnection");
    exports.HttpClientConnection = HttpClientConnection;
    var HttpStream = class extends (0, native_resource_1.NativeResourceMixin)(event_1.BufferedEventEmitter) {
      constructor(native_handle, connection) {
        super();
        this.connection = connection;
        this._super(native_handle);
        this.cork();
      }
      activate() {
        binding_1.default.http_stream_activate(this.native_handle());
      }
      close() {
        binding_1.default.http_stream_close(this.native_handle());
      }
      _on_body(data) {
        this.emit("data", data);
      }
      _on_complete(error_code) {
        if (error_code) {
          this.emit("error", new error_1.CrtError(error_code));
          this.close();
          return;
        }
        this.on("end", () => {
          this.close();
        });
        this.emit("end");
      }
    };
    __name(HttpStream, "HttpStream");
    exports.HttpStream = HttpStream;
    var HttpClientStream = class extends HttpStream {
      constructor(native_handle, connection, request2) {
        super(native_handle, connection);
        this.request = request2;
      }
      status_code() {
        return this.response_status_code;
      }
      on(event, listener) {
        super.on(event, listener);
        if (event == "response") {
          process.nextTick(() => {
            this.uncork();
          });
        }
        return this;
      }
      _on_response(status_code, header_array) {
        this.response_status_code = status_code;
        let headers = new exports.HttpHeaders(header_array);
        this.emit("response", status_code, headers);
      }
    };
    __name(HttpClientStream, "HttpClientStream");
    exports.HttpClientStream = HttpClientStream;
    HttpClientStream.RESPONSE = "response";
    HttpClientStream.DATA = "data";
    HttpClientStream.ERROR = "error";
    HttpClientStream.END = "end";
    HttpClientStream.HEADERS = "headers";
    var HttpClientConnectionManager = class extends native_resource_1.NativeResource {
      constructor(bootstrap, host, port, max_connections, initial_window_size, socket_options, tls_opts, proxy_options) {
        if (socket_options == null || socket_options == void 0) {
          throw new error_1.CrtError("HttpClientConnectionManager constructor: socket_options not defined");
        }
        super(binding_1.default.http_connection_manager_new(bootstrap != null ? bootstrap.native_handle() : null, host, port, max_connections, initial_window_size, socket_options.native_handle(), tls_opts ? tls_opts.native_handle() : void 0, proxy_options ? proxy_options.create_native_handle() : void 0, void 0));
        this.bootstrap = bootstrap;
        this.host = host;
        this.port = port;
        this.max_connections = max_connections;
        this.initial_window_size = initial_window_size;
        this.socket_options = socket_options;
        this.tls_opts = tls_opts;
        this.proxy_options = proxy_options;
        this.connections = /* @__PURE__ */ new Map();
      }
      acquire() {
        return new Promise((resolve, reject) => {
          const on_acquired = /* @__PURE__ */ __name((handle, error_code) => {
            if (error_code) {
              reject(new error_1.CrtError(error_code));
              return;
            }
            let connection = this.connections.get(handle);
            if (!connection) {
              connection = new HttpClientConnection(this.bootstrap, this.host, this.port, this.socket_options, this.tls_opts, this.proxy_options, handle);
              this.connections.set(handle, connection);
              connection.on("close", () => {
                this.connections.delete(handle);
              });
            }
            resolve(connection);
          }, "on_acquired");
          binding_1.default.http_connection_manager_acquire(this.native_handle(), on_acquired);
        });
      }
      release(connection) {
        if (connection == null || connection == void 0) {
          throw new error_1.CrtError("HttpClientConnectionManager release: connection not defined");
        }
        binding_1.default.http_connection_manager_release(this.native_handle(), connection.native_handle());
      }
      close() {
        binding_1.default.http_connection_manager_close(this.native_handle());
      }
    };
    __name(HttpClientConnectionManager, "HttpClientConnectionManager");
    exports.HttpClientConnectionManager = HttpClientConnectionManager;
  }
});

// node_modules/aws-crt/dist/common/mqtt.js
var require_mqtt = __commonJS({
  "node_modules/aws-crt/dist/common/mqtt.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DEFAULT_RECONNECT_MIN_SEC = exports.DEFAULT_RECONNECT_MAX_SEC = exports.MqttWill = exports.QoS = void 0;
    var QoS;
    (function(QoS2) {
      QoS2[QoS2["AtMostOnce"] = 0] = "AtMostOnce";
      QoS2[QoS2["AtLeastOnce"] = 1] = "AtLeastOnce";
      QoS2[QoS2["ExactlyOnce"] = 2] = "ExactlyOnce";
    })(QoS = exports.QoS || (exports.QoS = {}));
    var MqttWill = class {
      constructor(topic, qos, payload, retain = false) {
        this.topic = topic;
        this.qos = qos;
        this.payload = payload;
        this.retain = retain;
      }
    };
    __name(MqttWill, "MqttWill");
    exports.MqttWill = MqttWill;
    exports.DEFAULT_RECONNECT_MAX_SEC = 128;
    exports.DEFAULT_RECONNECT_MIN_SEC = 1;
  }
});

// node_modules/aws-crt/dist/common/aws_iot_shared.js
var require_aws_iot_shared = __commonJS({
  "node_modules/aws-crt/dist/common/aws_iot_shared.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o6, m6, k6, k22) {
      if (k22 === void 0)
        k22 = k6;
      var desc = Object.getOwnPropertyDescriptor(m6, k6);
      if (!desc || ("get" in desc ? !m6.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m6[k6];
        } };
      }
      Object.defineProperty(o6, k22, desc);
    } : function(o6, m6, k6, k22) {
      if (k22 === void 0)
        k22 = k6;
      o6[k22] = m6[k6];
    });
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? function(o6, v5) {
      Object.defineProperty(o6, "default", { enumerable: true, value: v5 });
    } : function(o6, v5) {
      o6["default"] = v5;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule)
        return mod;
      var result = {};
      if (mod != null) {
        for (var k6 in mod)
          if (k6 !== "default" && Object.prototype.hasOwnProperty.call(mod, k6))
            __createBinding(result, mod, k6);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.extractRegionFromEndpoint = exports.buildMqtt5FinalUsername = exports.populate_username_string_with_custom_authorizer = exports.is_string_and_not_empty = exports.add_to_username_parameter = void 0;
    var platform2 = __importStar(require_platform());
    function add_to_username_parameter(current_username, parameter_value, parameter_pre_text) {
      let return_string = current_username;
      if (return_string.indexOf("?") != -1) {
        return_string += "&";
      } else {
        return_string += "?";
      }
      if (parameter_value.indexOf(parameter_pre_text) != -1) {
        return return_string + parameter_value;
      } else {
        return return_string + parameter_pre_text + parameter_value;
      }
    }
    __name(add_to_username_parameter, "add_to_username_parameter");
    exports.add_to_username_parameter = add_to_username_parameter;
    function is_string_and_not_empty(item) {
      return item != void 0 && typeof item == "string" && item != "";
    }
    __name(is_string_and_not_empty, "is_string_and_not_empty");
    exports.is_string_and_not_empty = is_string_and_not_empty;
    function populate_username_string_with_custom_authorizer(current_username, input_username, input_authorizer, input_signature, input_builder_username, input_token_key_name, input_token_value) {
      let username_string = "";
      if (current_username) {
        username_string += current_username;
      }
      if (is_string_and_not_empty(input_username) == false) {
        if (is_string_and_not_empty(input_builder_username) && input_builder_username) {
          username_string += input_builder_username;
        }
      } else {
        username_string += input_username;
      }
      if (is_string_and_not_empty(input_authorizer) && input_authorizer) {
        username_string = add_to_username_parameter(username_string, input_authorizer, "x-amz-customauthorizer-name=");
      }
      if (is_string_and_not_empty(input_signature) && input_signature) {
        username_string = add_to_username_parameter(username_string, input_signature, "x-amz-customauthorizer-signature=");
        if (is_string_and_not_empty(input_token_key_name) && input_token_key_name || is_string_and_not_empty(input_token_value) && input_token_value) {
          console.log("Warning: Signed custom authorizers with signature will not work without a token key name and token value. Your connection may be rejected/stalled on the IoT Core side due to this. Please set the token key name and token value to connect to a signed custom authorizer.");
        }
      }
      if (is_string_and_not_empty(input_signature) || is_string_and_not_empty(input_token_value) || is_string_and_not_empty(input_token_key_name)) {
        if (!input_token_value || !input_token_key_name) {
          throw new Error("Token-based custom authentication requires all token-related properties to be set");
        }
        username_string = add_to_username_parameter(username_string, input_token_value, input_token_key_name + "=");
      }
      return username_string;
    }
    __name(populate_username_string_with_custom_authorizer, "populate_username_string_with_custom_authorizer");
    exports.populate_username_string_with_custom_authorizer = populate_username_string_with_custom_authorizer;
    function addParam(paramName, paramValue, paramSet) {
      if (paramValue) {
        paramSet.push([paramName, paramValue]);
      }
    }
    __name(addParam, "addParam");
    function buildMqtt5FinalUsername(customAuthConfig) {
      let path = "";
      let paramList = [];
      if (customAuthConfig) {
        let usingSigning = false;
        if (customAuthConfig.tokenValue || customAuthConfig.tokenKeyName || customAuthConfig.tokenSignature) {
          usingSigning = true;
          if (!customAuthConfig.tokenValue || !customAuthConfig.tokenKeyName || !customAuthConfig.tokenSignature) {
            throw new Error("Token-based custom authentication requires all token-related properties to be set");
          }
        }
        let username = customAuthConfig.username;
        let pathSplit = (username !== null && username !== void 0 ? username : "").split("?");
        let params = pathSplit.slice(1);
        path = pathSplit[0];
        if (params.length > 1) {
          throw new Error("Custom auth username property value is invalid");
        } else if (params.length == 1) {
          params[0].split("&").forEach((keyValue, index, array) => {
            var _a;
            let kvPair = keyValue.split("=");
            paramList.push([kvPair[0], (_a = kvPair[1]) !== null && _a !== void 0 ? _a : ""]);
          });
        }
        addParam("x-amz-customauthorizer-name", customAuthConfig.authorizerName, paramList);
        if (usingSigning) {
          addParam(customAuthConfig.tokenKeyName, customAuthConfig.tokenValue, paramList);
          addParam("x-amz-customauthorizer-signature", customAuthConfig.tokenSignature, paramList);
        }
      }
      paramList.push(["SDK", "NodeJSv2"]);
      paramList.push(["Version", platform2.crt_version()]);
      return (path !== null && path !== void 0 ? path : "") + "?" + paramList.map((value) => `${value[0]}=${value[1]}`).join("&");
    }
    __name(buildMqtt5FinalUsername, "buildMqtt5FinalUsername");
    exports.buildMqtt5FinalUsername = buildMqtt5FinalUsername;
    function extractRegionFromEndpoint(endpoint) {
      const regexpRegion = /^[\w\-]+\.[\w\-]+\.([\w+\-]+)\./;
      const match = endpoint.match(regexpRegion);
      if (match) {
        return match[1];
      }
      throw new Error("AWS region could not be extracted from endpoint.  Use 'region' property on WebsocketConfig to set manually.");
    }
    __name(extractRegionFromEndpoint, "extractRegionFromEndpoint");
    exports.extractRegionFromEndpoint = extractRegionFromEndpoint;
  }
});

// node_modules/aws-crt/dist/native/aws_iot.js
var require_aws_iot = __commonJS({
  "node_modules/aws-crt/dist/native/aws_iot.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o6, m6, k6, k22) {
      if (k22 === void 0)
        k22 = k6;
      var desc = Object.getOwnPropertyDescriptor(m6, k6);
      if (!desc || ("get" in desc ? !m6.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m6[k6];
        } };
      }
      Object.defineProperty(o6, k22, desc);
    } : function(o6, m6, k6, k22) {
      if (k22 === void 0)
        k22 = k6;
      o6[k22] = m6[k6];
    });
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? function(o6, v5) {
      Object.defineProperty(o6, "default", { enumerable: true, value: v5 });
    } : function(o6, v5) {
      o6["default"] = v5;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule)
        return mod;
      var result = {};
      if (mod != null) {
        for (var k6 in mod)
          if (k6 !== "default" && Object.prototype.hasOwnProperty.call(mod, k6))
            __createBinding(result, mod, k6);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      __name(adopt, "adopt");
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e6) {
            reject(e6);
          }
        }
        __name(fulfilled, "fulfilled");
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e6) {
            reject(e6);
          }
        }
        __name(rejected, "rejected");
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        __name(step, "step");
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AwsIotMqttConnectionConfigBuilder = void 0;
    var mqtt_1 = require_mqtt();
    var io = __importStar(require_io2());
    var io_1 = require_io2();
    var platform2 = __importStar(require_platform());
    var error_1 = require_error();
    var auth_1 = require_auth();
    var iot_shared = __importStar(require_aws_iot_shared());
    var AwsIotMqttConnectionConfigBuilder = class {
      constructor(tls_ctx_options) {
        this.tls_ctx_options = tls_ctx_options;
        this.params = {
          client_id: "",
          host_name: "",
          socket_options: new io.SocketOptions(),
          port: 8883,
          use_websocket: false,
          clean_session: false,
          keep_alive: void 0,
          will: void 0,
          username: "",
          password: void 0,
          tls_ctx: void 0,
          reconnect_min_sec: mqtt_1.DEFAULT_RECONNECT_MIN_SEC,
          reconnect_max_sec: mqtt_1.DEFAULT_RECONNECT_MAX_SEC
        };
        this.is_using_custom_authorizer = false;
      }
      static new_mtls_builder_from_path(cert_path, key_path) {
        let builder = new AwsIotMqttConnectionConfigBuilder(io_1.TlsContextOptions.create_client_with_mtls_from_path(cert_path, key_path));
        builder.params.port = 8883;
        if (io.is_alpn_available()) {
          builder.tls_ctx_options.alpn_list.unshift("x-amzn-mqtt-ca");
        }
        return builder;
      }
      static new_mtls_builder(cert, private_key) {
        let builder = new AwsIotMqttConnectionConfigBuilder(io_1.TlsContextOptions.create_client_with_mtls(cert, private_key));
        builder.params.port = 8883;
        if (io.is_alpn_available()) {
          builder.tls_ctx_options.alpn_list.unshift("x-amzn-mqtt-ca");
        }
        return builder;
      }
      static new_mtls_pkcs11_builder(pkcs11_options) {
        let builder = new AwsIotMqttConnectionConfigBuilder(io_1.TlsContextOptions.create_client_with_mtls_pkcs11(pkcs11_options));
        builder.params.port = 8883;
        if (io.is_alpn_available()) {
          builder.tls_ctx_options.alpn_list.unshift("x-amzn-mqtt-ca");
        }
        return builder;
      }
      static new_mtls_pkcs12_builder(pkcs12_options) {
        let builder = new AwsIotMqttConnectionConfigBuilder(io_1.TlsContextOptions.create_client_with_mtls_pkcs12_from_path(pkcs12_options.pkcs12_file, pkcs12_options.pkcs12_password));
        builder.params.port = 8883;
        if (io.is_alpn_available()) {
          builder.tls_ctx_options.alpn_list.unshift("x-amzn-mqtt-ca");
        }
        return builder;
      }
      static new_mtls_windows_cert_store_path_builder(certificate_path) {
        let builder = new AwsIotMqttConnectionConfigBuilder(io_1.TlsContextOptions.create_client_with_mtls_windows_cert_store_path(certificate_path));
        builder.params.port = 8883;
        if (io.is_alpn_available()) {
          builder.tls_ctx_options.alpn_list.unshift("x-amzn-mqtt-ca");
        }
        return builder;
      }
      static new_default_builder() {
        let ctx_options = new io.TlsContextOptions();
        let builder = new AwsIotMqttConnectionConfigBuilder(ctx_options);
        return builder;
      }
      static new_websocket_builder(...args) {
        return this.new_with_websockets(...args);
      }
      static configure_websocket_handshake(builder, options) {
        if (options) {
          if (builder == null || builder == void 0) {
            throw new error_1.CrtError("AwsIotMqttConnectionConfigBuilder configure_websocket_handshake: builder not defined");
          }
          builder.params.websocket_handshake_transform = (request2, done) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            const signing_config = (_b = (_a = options.create_signing_config) === null || _a === void 0 ? void 0 : _a.call(options)) !== null && _b !== void 0 ? _b : {
              algorithm: auth_1.AwsSigningAlgorithm.SigV4,
              signature_type: auth_1.AwsSignatureType.HttpRequestViaQueryParams,
              provider: options.credentials_provider,
              region: options.region,
              service: (_c = options.service) !== null && _c !== void 0 ? _c : "iotdevicegateway",
              signed_body_value: auth_1.AwsSignedBodyValue.EmptySha256,
              omit_session_token: true
            };
            try {
              yield (0, auth_1.aws_sign_request)(request2, signing_config);
              done();
            } catch (error) {
              if (error instanceof error_1.CrtError) {
                done(error.error_code);
              } else {
                done(3);
              }
            }
          });
        }
        return builder;
      }
      static new_with_websockets(options) {
        let tls_ctx_options = options === null || options === void 0 ? void 0 : options.tls_ctx_options;
        if (!tls_ctx_options) {
          tls_ctx_options = new io_1.TlsContextOptions();
          tls_ctx_options.alpn_list = [];
        }
        let builder = new AwsIotMqttConnectionConfigBuilder(tls_ctx_options);
        builder.params.use_websocket = true;
        builder.params.proxy_options = options === null || options === void 0 ? void 0 : options.proxy_options;
        if (builder.tls_ctx_options) {
          builder.params.port = 443;
        }
        this.configure_websocket_handshake(builder, options);
        return builder;
      }
      static new_builder_for_websocket() {
        return this.new_with_websockets();
      }
      with_certificate_authority_from_path(ca_dirpath, ca_filepath) {
        this.tls_ctx_options.override_default_trust_store_from_path(ca_dirpath, ca_filepath);
        return this;
      }
      with_certificate_authority(ca) {
        this.tls_ctx_options.override_default_trust_store(ca);
        return this;
      }
      with_endpoint(endpoint) {
        this.params.host_name = endpoint;
        return this;
      }
      with_port(port) {
        this.params.port = port;
        return this;
      }
      with_client_id(client_id) {
        this.params.client_id = client_id;
        return this;
      }
      with_clean_session(clean_session) {
        this.params.clean_session = clean_session;
        return this;
      }
      with_keep_alive_seconds(keep_alive) {
        this.params.keep_alive = keep_alive;
        return this;
      }
      with_timeout_ms(timeout_ms) {
        this.with_ping_timeout_ms(timeout_ms);
        return this;
      }
      with_ping_timeout_ms(ping_timeout) {
        this.params.ping_timeout = ping_timeout;
        return this;
      }
      with_protocol_operation_timeout_ms(protocol_operation_timeout) {
        this.params.protocol_operation_timeout = protocol_operation_timeout;
        return this;
      }
      with_will(will) {
        this.params.will = will;
        return this;
      }
      with_socket_options(socket_options) {
        this.params.socket_options = socket_options;
        return this;
      }
      with_credentials(aws_region, aws_access_id, aws_secret_key, aws_sts_token) {
        return AwsIotMqttConnectionConfigBuilder.configure_websocket_handshake(this, {
          credentials_provider: auth_1.AwsCredentialsProvider.newStatic(aws_access_id, aws_secret_key, aws_sts_token),
          region: aws_region,
          service: "iotdevicegateway"
        });
      }
      with_http_proxy_options(proxy_options) {
        this.params.proxy_options = proxy_options;
        return this;
      }
      with_custom_authorizer(username, authorizer_name, authorizer_signature, password, token_key_name, token_value) {
        this.is_using_custom_authorizer = true;
        let username_string = iot_shared.populate_username_string_with_custom_authorizer("", username, authorizer_name, authorizer_signature, this.params.username, token_key_name, token_value);
        this.params.username = username_string;
        this.params.password = password;
        if (!this.params.use_websocket) {
          this.tls_ctx_options.alpn_list = ["mqtt"];
        }
        this.params.port = 443;
        return this;
      }
      with_username(username) {
        this.params.username = username;
        return this;
      }
      with_password(password) {
        this.params.password = password;
        return this;
      }
      with_reconnect_max_sec(max_sec) {
        this.params.reconnect_max_sec = max_sec;
        return this;
      }
      with_reconnect_min_sec(min_sec) {
        this.params.reconnect_min_sec = min_sec;
        return this;
      }
      build() {
        var _a, _b, _c;
        if (this.params.client_id === void 0 || this.params.host_name === void 0) {
          throw "client_id and endpoint are required";
        }
        if (this.is_using_custom_authorizer == false) {
          if (iot_shared.is_string_and_not_empty(this.params.username)) {
            if (((_a = this.params.username) === null || _a === void 0 ? void 0 : _a.indexOf("x-amz-customauthorizer-name=")) != -1 || ((_b = this.params.username) === null || _b === void 0 ? void 0 : _b.indexOf("x-amz-customauthorizer-signature=")) != -1) {
              this.is_using_custom_authorizer = true;
            }
          }
        }
        if (this.is_using_custom_authorizer == true) {
          if (this.params.port != 443) {
            console.log("Warning: Attempting to connect to authorizer with unsupported port. Port is not 443...");
          }
        }
        if (this.params.tls_ctx === void 0) {
          this.params.tls_ctx = new io.ClientTlsContext(this.tls_ctx_options);
        }
        if (iot_shared.is_string_and_not_empty(this.params.username) == false) {
          this.params.username = "?SDK=NodeJSv2&Version=";
        } else {
          if (((_c = this.params.username) === null || _c === void 0 ? void 0 : _c.indexOf("?")) != -1) {
            this.params.username += "&SDK=NodeJSv2&Version=";
          } else {
            this.params.username += "?SDK=NodeJSv2&Version=";
          }
        }
        this.params.username += platform2.crt_version();
        return this.params;
      }
    };
    __name(AwsIotMqttConnectionConfigBuilder, "AwsIotMqttConnectionConfigBuilder");
    exports.AwsIotMqttConnectionConfigBuilder = AwsIotMqttConnectionConfigBuilder;
  }
});

// node_modules/aws-crt/dist/common/mqtt_shared.js
var require_mqtt_shared = __commonJS({
  "node_modules/aws-crt/dist/common/mqtt_shared.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DEFAULT_KEEP_ALIVE = exports.normalize_payload = void 0;
    function normalize_payload(payload) {
      if (payload instanceof Buffer) {
        return payload;
      }
      if (typeof payload === "string") {
        return payload;
      }
      if (ArrayBuffer.isView(payload)) {
        const view = payload;
        return Buffer.from(view.buffer, view.byteOffset, view.byteLength);
      }
      if (payload instanceof ArrayBuffer) {
        return Buffer.from(payload);
      }
      if (typeof payload === "object") {
        return JSON.stringify(payload);
      }
      if (!payload) {
        return "";
      }
      throw new TypeError("payload parameter must be a string, object, or DataView.");
    }
    __name(normalize_payload, "normalize_payload");
    exports.normalize_payload = normalize_payload;
    exports.DEFAULT_KEEP_ALIVE = 1200;
  }
});

// node_modules/aws-crt/dist/common/mqtt5.js
var require_mqtt5 = __commonJS({
  "node_modules/aws-crt/dist/common/mqtt5.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RetryJitterType = exports.ClientSessionBehavior = void 0;
    var ClientSessionBehavior;
    (function(ClientSessionBehavior2) {
      ClientSessionBehavior2[ClientSessionBehavior2["Default"] = 0] = "Default";
      ClientSessionBehavior2[ClientSessionBehavior2["Clean"] = 1] = "Clean";
      ClientSessionBehavior2[ClientSessionBehavior2["RejoinPostSuccess"] = 2] = "RejoinPostSuccess";
      ClientSessionBehavior2[ClientSessionBehavior2["RejoinAlways"] = 3] = "RejoinAlways";
    })(ClientSessionBehavior = exports.ClientSessionBehavior || (exports.ClientSessionBehavior = {}));
    var RetryJitterType;
    (function(RetryJitterType2) {
      RetryJitterType2[RetryJitterType2["Default"] = 0] = "Default";
      RetryJitterType2[RetryJitterType2["None"] = 1] = "None";
      RetryJitterType2[RetryJitterType2["Full"] = 2] = "Full";
      RetryJitterType2[RetryJitterType2["Decorrelated"] = 3] = "Decorrelated";
    })(RetryJitterType = exports.RetryJitterType || (exports.RetryJitterType = {}));
  }
});

// node_modules/aws-crt/dist/common/mqtt5_packet.js
var require_mqtt5_packet = __commonJS({
  "node_modules/aws-crt/dist/common/mqtt5_packet.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PacketType = exports.RetainHandlingType = exports.QoS = exports.PayloadFormatIndicator = exports.isSuccessfulPubackReasonCode = exports.PubackReasonCode = exports.isSuccessfulUnsubackReasonCode = exports.UnsubackReasonCode = exports.isSuccessfulSubackReasonCode = exports.SubackReasonCode = exports.isSuccessfulDisconnectReasonCode = exports.DisconnectReasonCode = exports.isSuccessfulConnectReasonCode = exports.ConnectReasonCode = void 0;
    var ConnectReasonCode;
    (function(ConnectReasonCode2) {
      ConnectReasonCode2[ConnectReasonCode2["Success"] = 0] = "Success";
      ConnectReasonCode2[ConnectReasonCode2["UnspecifiedError"] = 128] = "UnspecifiedError";
      ConnectReasonCode2[ConnectReasonCode2["MalformedPacket"] = 129] = "MalformedPacket";
      ConnectReasonCode2[ConnectReasonCode2["ProtocolError"] = 130] = "ProtocolError";
      ConnectReasonCode2[ConnectReasonCode2["ImplementationSpecificError"] = 131] = "ImplementationSpecificError";
      ConnectReasonCode2[ConnectReasonCode2["UnsupportedProtocolVersion"] = 132] = "UnsupportedProtocolVersion";
      ConnectReasonCode2[ConnectReasonCode2["ClientIdentifierNotValid"] = 133] = "ClientIdentifierNotValid";
      ConnectReasonCode2[ConnectReasonCode2["BadUsernameOrPassword"] = 134] = "BadUsernameOrPassword";
      ConnectReasonCode2[ConnectReasonCode2["NotAuthorized"] = 135] = "NotAuthorized";
      ConnectReasonCode2[ConnectReasonCode2["ServerUnavailable"] = 136] = "ServerUnavailable";
      ConnectReasonCode2[ConnectReasonCode2["ServerBusy"] = 137] = "ServerBusy";
      ConnectReasonCode2[ConnectReasonCode2["Banned"] = 138] = "Banned";
      ConnectReasonCode2[ConnectReasonCode2["BadAuthenticationMethod"] = 140] = "BadAuthenticationMethod";
      ConnectReasonCode2[ConnectReasonCode2["TopicNameInvalid"] = 144] = "TopicNameInvalid";
      ConnectReasonCode2[ConnectReasonCode2["PacketTooLarge"] = 149] = "PacketTooLarge";
      ConnectReasonCode2[ConnectReasonCode2["QuotaExceeded"] = 151] = "QuotaExceeded";
      ConnectReasonCode2[ConnectReasonCode2["PayloadFormatInvalid"] = 153] = "PayloadFormatInvalid";
      ConnectReasonCode2[ConnectReasonCode2["RetainNotSupported"] = 154] = "RetainNotSupported";
      ConnectReasonCode2[ConnectReasonCode2["QosNotSupported"] = 155] = "QosNotSupported";
      ConnectReasonCode2[ConnectReasonCode2["UseAnotherServer"] = 156] = "UseAnotherServer";
      ConnectReasonCode2[ConnectReasonCode2["ServerMoved"] = 157] = "ServerMoved";
      ConnectReasonCode2[ConnectReasonCode2["ConnectionRateExceeded"] = 159] = "ConnectionRateExceeded";
    })(ConnectReasonCode = exports.ConnectReasonCode || (exports.ConnectReasonCode = {}));
    function isSuccessfulConnectReasonCode(reasonCode) {
      return reasonCode < 128;
    }
    __name(isSuccessfulConnectReasonCode, "isSuccessfulConnectReasonCode");
    exports.isSuccessfulConnectReasonCode = isSuccessfulConnectReasonCode;
    var DisconnectReasonCode;
    (function(DisconnectReasonCode2) {
      DisconnectReasonCode2[DisconnectReasonCode2["NormalDisconnection"] = 0] = "NormalDisconnection";
      DisconnectReasonCode2[DisconnectReasonCode2["DisconnectWithWillMessage"] = 4] = "DisconnectWithWillMessage";
      DisconnectReasonCode2[DisconnectReasonCode2["UnspecifiedError"] = 128] = "UnspecifiedError";
      DisconnectReasonCode2[DisconnectReasonCode2["MalformedPacket"] = 129] = "MalformedPacket";
      DisconnectReasonCode2[DisconnectReasonCode2["ProtocolError"] = 130] = "ProtocolError";
      DisconnectReasonCode2[DisconnectReasonCode2["ImplementationSpecificError"] = 131] = "ImplementationSpecificError";
      DisconnectReasonCode2[DisconnectReasonCode2["NotAuthorized"] = 135] = "NotAuthorized";
      DisconnectReasonCode2[DisconnectReasonCode2["ServerBusy"] = 137] = "ServerBusy";
      DisconnectReasonCode2[DisconnectReasonCode2["ServerShuttingDown"] = 139] = "ServerShuttingDown";
      DisconnectReasonCode2[DisconnectReasonCode2["KeepAliveTimeout"] = 141] = "KeepAliveTimeout";
      DisconnectReasonCode2[DisconnectReasonCode2["SessionTakenOver"] = 142] = "SessionTakenOver";
      DisconnectReasonCode2[DisconnectReasonCode2["TopicFilterInvalid"] = 143] = "TopicFilterInvalid";
      DisconnectReasonCode2[DisconnectReasonCode2["TopicNameInvalid"] = 144] = "TopicNameInvalid";
      DisconnectReasonCode2[DisconnectReasonCode2["ReceiveMaximumExceeded"] = 147] = "ReceiveMaximumExceeded";
      DisconnectReasonCode2[DisconnectReasonCode2["TopicAliasInvalid"] = 148] = "TopicAliasInvalid";
      DisconnectReasonCode2[DisconnectReasonCode2["PacketTooLarge"] = 149] = "PacketTooLarge";
      DisconnectReasonCode2[DisconnectReasonCode2["MessageRateTooHigh"] = 150] = "MessageRateTooHigh";
      DisconnectReasonCode2[DisconnectReasonCode2["QuotaExceeded"] = 151] = "QuotaExceeded";
      DisconnectReasonCode2[DisconnectReasonCode2["AdministrativeAction"] = 152] = "AdministrativeAction";
      DisconnectReasonCode2[DisconnectReasonCode2["PayloadFormatInvalid"] = 153] = "PayloadFormatInvalid";
      DisconnectReasonCode2[DisconnectReasonCode2["RetainNotSupported"] = 154] = "RetainNotSupported";
      DisconnectReasonCode2[DisconnectReasonCode2["QosNotSupported"] = 155] = "QosNotSupported";
      DisconnectReasonCode2[DisconnectReasonCode2["UseAnotherServer"] = 156] = "UseAnotherServer";
      DisconnectReasonCode2[DisconnectReasonCode2["ServerMoved"] = 157] = "ServerMoved";
      DisconnectReasonCode2[DisconnectReasonCode2["SharedSubscriptionsNotSupported"] = 158] = "SharedSubscriptionsNotSupported";
      DisconnectReasonCode2[DisconnectReasonCode2["ConnectionRateExceeded"] = 159] = "ConnectionRateExceeded";
      DisconnectReasonCode2[DisconnectReasonCode2["MaximumConnectTime"] = 160] = "MaximumConnectTime";
      DisconnectReasonCode2[DisconnectReasonCode2["SubscriptionIdentifiersNotSupported"] = 161] = "SubscriptionIdentifiersNotSupported";
      DisconnectReasonCode2[DisconnectReasonCode2["WildcardSubscriptionsNotSupported"] = 162] = "WildcardSubscriptionsNotSupported";
    })(DisconnectReasonCode = exports.DisconnectReasonCode || (exports.DisconnectReasonCode = {}));
    function isSuccessfulDisconnectReasonCode(reasonCode) {
      return reasonCode < 128;
    }
    __name(isSuccessfulDisconnectReasonCode, "isSuccessfulDisconnectReasonCode");
    exports.isSuccessfulDisconnectReasonCode = isSuccessfulDisconnectReasonCode;
    var SubackReasonCode;
    (function(SubackReasonCode2) {
      SubackReasonCode2[SubackReasonCode2["GrantedQoS0"] = 0] = "GrantedQoS0";
      SubackReasonCode2[SubackReasonCode2["GrantedQoS1"] = 1] = "GrantedQoS1";
      SubackReasonCode2[SubackReasonCode2["GrantedQoS2"] = 2] = "GrantedQoS2";
      SubackReasonCode2[SubackReasonCode2["UnspecifiedError"] = 128] = "UnspecifiedError";
      SubackReasonCode2[SubackReasonCode2["ImplementationSpecificError"] = 131] = "ImplementationSpecificError";
      SubackReasonCode2[SubackReasonCode2["NotAuthorized"] = 135] = "NotAuthorized";
      SubackReasonCode2[SubackReasonCode2["TopicFilterInvalid"] = 143] = "TopicFilterInvalid";
      SubackReasonCode2[SubackReasonCode2["PacketIdentifierInUse"] = 145] = "PacketIdentifierInUse";
      SubackReasonCode2[SubackReasonCode2["QuotaExceeded"] = 151] = "QuotaExceeded";
      SubackReasonCode2[SubackReasonCode2["SharedSubscriptionsNotSupported"] = 158] = "SharedSubscriptionsNotSupported";
      SubackReasonCode2[SubackReasonCode2["SubscriptionIdentifiersNotSupported"] = 161] = "SubscriptionIdentifiersNotSupported";
      SubackReasonCode2[SubackReasonCode2["WildcardSubscriptionsNotSupported"] = 162] = "WildcardSubscriptionsNotSupported";
    })(SubackReasonCode = exports.SubackReasonCode || (exports.SubackReasonCode = {}));
    function isSuccessfulSubackReasonCode(reasonCode) {
      return reasonCode < 128;
    }
    __name(isSuccessfulSubackReasonCode, "isSuccessfulSubackReasonCode");
    exports.isSuccessfulSubackReasonCode = isSuccessfulSubackReasonCode;
    var UnsubackReasonCode;
    (function(UnsubackReasonCode2) {
      UnsubackReasonCode2[UnsubackReasonCode2["Success"] = 0] = "Success";
      UnsubackReasonCode2[UnsubackReasonCode2["NoSubscriptionExisted"] = 17] = "NoSubscriptionExisted";
      UnsubackReasonCode2[UnsubackReasonCode2["UnspecifiedError"] = 128] = "UnspecifiedError";
      UnsubackReasonCode2[UnsubackReasonCode2["ImplementationSpecificError"] = 131] = "ImplementationSpecificError";
      UnsubackReasonCode2[UnsubackReasonCode2["NotAuthorized"] = 135] = "NotAuthorized";
      UnsubackReasonCode2[UnsubackReasonCode2["TopicFilterInvalid"] = 143] = "TopicFilterInvalid";
      UnsubackReasonCode2[UnsubackReasonCode2["PacketIdentifierInUse"] = 145] = "PacketIdentifierInUse";
    })(UnsubackReasonCode = exports.UnsubackReasonCode || (exports.UnsubackReasonCode = {}));
    function isSuccessfulUnsubackReasonCode(reasonCode) {
      return reasonCode < 128;
    }
    __name(isSuccessfulUnsubackReasonCode, "isSuccessfulUnsubackReasonCode");
    exports.isSuccessfulUnsubackReasonCode = isSuccessfulUnsubackReasonCode;
    var PubackReasonCode;
    (function(PubackReasonCode2) {
      PubackReasonCode2[PubackReasonCode2["Success"] = 0] = "Success";
      PubackReasonCode2[PubackReasonCode2["NoMatchingSubscribers"] = 16] = "NoMatchingSubscribers";
      PubackReasonCode2[PubackReasonCode2["UnspecifiedError"] = 128] = "UnspecifiedError";
      PubackReasonCode2[PubackReasonCode2["ImplementationSpecificError"] = 131] = "ImplementationSpecificError";
      PubackReasonCode2[PubackReasonCode2["NotAuthorized"] = 135] = "NotAuthorized";
      PubackReasonCode2[PubackReasonCode2["TopicNameInvalid"] = 144] = "TopicNameInvalid";
      PubackReasonCode2[PubackReasonCode2["PacketIdentifierInUse"] = 145] = "PacketIdentifierInUse";
      PubackReasonCode2[PubackReasonCode2["QuotaExceeded"] = 151] = "QuotaExceeded";
      PubackReasonCode2[PubackReasonCode2["PayloadFormatInvalid"] = 153] = "PayloadFormatInvalid";
    })(PubackReasonCode = exports.PubackReasonCode || (exports.PubackReasonCode = {}));
    function isSuccessfulPubackReasonCode(reasonCode) {
      return reasonCode < 128;
    }
    __name(isSuccessfulPubackReasonCode, "isSuccessfulPubackReasonCode");
    exports.isSuccessfulPubackReasonCode = isSuccessfulPubackReasonCode;
    var PayloadFormatIndicator;
    (function(PayloadFormatIndicator2) {
      PayloadFormatIndicator2[PayloadFormatIndicator2["Bytes"] = 0] = "Bytes";
      PayloadFormatIndicator2[PayloadFormatIndicator2["Utf8"] = 1] = "Utf8";
    })(PayloadFormatIndicator = exports.PayloadFormatIndicator || (exports.PayloadFormatIndicator = {}));
    var QoS;
    (function(QoS2) {
      QoS2[QoS2["AtMostOnce"] = 0] = "AtMostOnce";
      QoS2[QoS2["AtLeastOnce"] = 1] = "AtLeastOnce";
      QoS2[QoS2["ExactlyOnce"] = 2] = "ExactlyOnce";
    })(QoS = exports.QoS || (exports.QoS = {}));
    var RetainHandlingType;
    (function(RetainHandlingType2) {
      RetainHandlingType2[RetainHandlingType2["SendOnSubscribe"] = 0] = "SendOnSubscribe";
      RetainHandlingType2[RetainHandlingType2["SendOnSubscribeIfNew"] = 1] = "SendOnSubscribeIfNew";
      RetainHandlingType2[RetainHandlingType2["DontSend"] = 2] = "DontSend";
    })(RetainHandlingType = exports.RetainHandlingType || (exports.RetainHandlingType = {}));
    var PacketType;
    (function(PacketType2) {
      PacketType2[PacketType2["Connect"] = 1] = "Connect";
      PacketType2[PacketType2["Connack"] = 2] = "Connack";
      PacketType2[PacketType2["Publish"] = 3] = "Publish";
      PacketType2[PacketType2["Puback"] = 4] = "Puback";
      PacketType2[PacketType2["Pubrec"] = 5] = "Pubrec";
      PacketType2[PacketType2["Pubrel"] = 6] = "Pubrel";
      PacketType2[PacketType2["Pubcomp"] = 7] = "Pubcomp";
      PacketType2[PacketType2["Subscribe"] = 8] = "Subscribe";
      PacketType2[PacketType2["Suback"] = 9] = "Suback";
      PacketType2[PacketType2["Unsubscribe"] = 10] = "Unsubscribe";
      PacketType2[PacketType2["Unsuback"] = 11] = "Unsuback";
      PacketType2[PacketType2["Pingreq"] = 12] = "Pingreq";
      PacketType2[PacketType2["Pingresp"] = 13] = "Pingresp";
      PacketType2[PacketType2["Disconnect"] = 14] = "Disconnect";
      PacketType2[PacketType2["Auth"] = 15] = "Auth";
    })(PacketType = exports.PacketType || (exports.PacketType = {}));
  }
});

// node_modules/aws-crt/dist/native/mqtt5.js
var require_mqtt52 = __commonJS({
  "node_modules/aws-crt/dist/native/mqtt5.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o6, m6, k6, k22) {
      if (k22 === void 0)
        k22 = k6;
      var desc = Object.getOwnPropertyDescriptor(m6, k6);
      if (!desc || ("get" in desc ? !m6.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m6[k6];
        } };
      }
      Object.defineProperty(o6, k22, desc);
    } : function(o6, m6, k6, k22) {
      if (k22 === void 0)
        k22 = k6;
      o6[k22] = m6[k6];
    });
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? function(o6, v5) {
      Object.defineProperty(o6, "default", { enumerable: true, value: v5 });
    } : function(o6, v5) {
      o6["default"] = v5;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule)
        return mod;
      var result = {};
      if (mod != null) {
        for (var k6 in mod)
          if (k6 !== "default" && Object.prototype.hasOwnProperty.call(mod, k6))
            __createBinding(result, mod, k6);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    var __exportStar = exports && exports.__exportStar || function(m6, exports2) {
      for (var p6 in m6)
        if (p6 !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p6))
          __createBinding(exports2, m6, p6);
    };
    var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      __name(adopt, "adopt");
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e6) {
            reject(e6);
          }
        }
        __name(fulfilled, "fulfilled");
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e6) {
            reject(e6);
          }
        }
        __name(rejected, "rejected");
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        __name(step, "step");
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Mqtt5Client = exports.ClientExtendedValidationAndFlowControl = exports.ClientOperationQueueBehavior = exports.HttpProxyOptions = void 0;
    var binding_1 = __importDefault(require_binding());
    var native_resource_1 = require_native_resource();
    var event_1 = require_event();
    var io = __importStar(require_io2());
    var mqtt_shared = __importStar(require_mqtt_shared());
    var error_1 = require_error();
    var http_1 = require_http2();
    Object.defineProperty(exports, "HttpProxyOptions", { enumerable: true, get: function() {
      return http_1.HttpProxyOptions;
    } });
    __exportStar(require_mqtt5(), exports);
    __exportStar(require_mqtt5_packet(), exports);
    var ClientOperationQueueBehavior;
    (function(ClientOperationQueueBehavior2) {
      ClientOperationQueueBehavior2[ClientOperationQueueBehavior2["Default"] = 0] = "Default";
      ClientOperationQueueBehavior2[ClientOperationQueueBehavior2["FailNonQos1PublishOnDisconnect"] = 1] = "FailNonQos1PublishOnDisconnect";
      ClientOperationQueueBehavior2[ClientOperationQueueBehavior2["FailQos0PublishOnDisconnect"] = 2] = "FailQos0PublishOnDisconnect";
      ClientOperationQueueBehavior2[ClientOperationQueueBehavior2["FailAllOnDisconnect"] = 3] = "FailAllOnDisconnect";
    })(ClientOperationQueueBehavior = exports.ClientOperationQueueBehavior || (exports.ClientOperationQueueBehavior = {}));
    var ClientExtendedValidationAndFlowControl;
    (function(ClientExtendedValidationAndFlowControl2) {
      ClientExtendedValidationAndFlowControl2[ClientExtendedValidationAndFlowControl2["None"] = 0] = "None";
      ClientExtendedValidationAndFlowControl2[ClientExtendedValidationAndFlowControl2["AwsIotCoreDefaults"] = 1] = "AwsIotCoreDefaults";
    })(ClientExtendedValidationAndFlowControl = exports.ClientExtendedValidationAndFlowControl || (exports.ClientExtendedValidationAndFlowControl = {}));
    var Mqtt5Client = class extends (0, native_resource_1.NativeResourceMixin)(event_1.BufferedEventEmitter) {
      constructor(config) {
        super();
        this._super(binding_1.default.mqtt5_client_new(this, config, (client) => {
          Mqtt5Client._s_on_stopped(client);
        }, (client) => {
          Mqtt5Client._s_on_attempting_connect(client);
        }, (client, connack, settings) => {
          Mqtt5Client._s_on_connection_success(client, connack, settings);
        }, (client, errorCode, connack) => {
          Mqtt5Client._s_on_connection_failure(client, new error_1.CrtError(errorCode), connack);
        }, (client, errorCode, disconnect) => {
          Mqtt5Client._s_on_disconnection(client, new error_1.CrtError(errorCode), disconnect);
        }, (client, message) => {
          Mqtt5Client._s_on_message_received(client, message);
        }, config.clientBootstrap ? config.clientBootstrap.native_handle() : null, config.socketOptions ? config.socketOptions.native_handle() : null, config.tlsCtx ? config.tlsCtx.native_handle() : null, config.httpProxyOptions ? config.httpProxyOptions.create_native_handle() : null));
      }
      close() {
        binding_1.default.mqtt5_client_close(this.native_handle());
      }
      start() {
        binding_1.default.mqtt5_client_start(this.native_handle());
      }
      stop(disconnectPacket) {
        binding_1.default.mqtt5_client_stop(this.native_handle(), disconnectPacket);
      }
      subscribe(packet) {
        return __awaiter(this, void 0, void 0, function* () {
          return new Promise((resolve, reject) => {
            function curriedPromiseCallback(client, errorCode, suback) {
              return Mqtt5Client._s_on_suback_callback(resolve, reject, client, errorCode, suback);
            }
            __name(curriedPromiseCallback, "curriedPromiseCallback");
            try {
              binding_1.default.mqtt5_client_subscribe(this.native_handle(), packet, curriedPromiseCallback);
            } catch (e6) {
              reject(e6);
            }
          });
        });
      }
      unsubscribe(packet) {
        return __awaiter(this, void 0, void 0, function* () {
          return new Promise((resolve, reject) => {
            function curriedPromiseCallback(client, errorCode, unsuback) {
              return Mqtt5Client._s_on_unsuback_callback(resolve, reject, client, errorCode, unsuback);
            }
            __name(curriedPromiseCallback, "curriedPromiseCallback");
            try {
              binding_1.default.mqtt5_client_unsubscribe(this.native_handle(), packet, curriedPromiseCallback);
            } catch (e6) {
              reject(e6);
            }
          });
        });
      }
      publish(packet) {
        return __awaiter(this, void 0, void 0, function* () {
          return new Promise((resolve, reject) => {
            if (packet && packet.payload) {
              packet.payload = mqtt_shared.normalize_payload(packet.payload);
            }
            function curriedPromiseCallback(client, errorCode, result) {
              return Mqtt5Client._s_on_puback_callback(resolve, reject, client, errorCode, result);
            }
            __name(curriedPromiseCallback, "curriedPromiseCallback");
            try {
              binding_1.default.mqtt5_client_publish(this.native_handle(), packet, curriedPromiseCallback);
            } catch (e6) {
              reject(e6);
            }
          });
        });
      }
      getQueueStatistics() {
        return binding_1.default.mqtt5_client_get_queue_statistics(this.native_handle());
      }
      on(event, listener) {
        super.on(event, listener);
        return this;
      }
      static _s_on_stopped(client) {
        process.nextTick(() => {
          let stoppedEvent = {};
          client.emit(Mqtt5Client.STOPPED, stoppedEvent);
        });
      }
      static _s_on_attempting_connect(client) {
        process.nextTick(() => {
          let attemptingConnectEvent = {};
          client.emit(Mqtt5Client.ATTEMPTING_CONNECT, attemptingConnectEvent);
        });
      }
      static _s_on_connection_success(client, connack, settings) {
        let connectionSuccessEvent = {
          connack,
          settings
        };
        process.nextTick(() => {
          client.emit(Mqtt5Client.CONNECTION_SUCCESS, connectionSuccessEvent);
        });
      }
      static _s_on_connection_failure(client, error, connack) {
        let connectionFailureEvent = {
          error
        };
        if (connack !== null && connack !== void 0) {
          connectionFailureEvent.connack = connack;
        }
        process.nextTick(() => {
          client.emit(Mqtt5Client.CONNECTION_FAILURE, connectionFailureEvent);
        });
      }
      static _s_on_disconnection(client, error, disconnect) {
        let disconnectionEvent = {
          error
        };
        if (disconnect !== null && disconnect !== void 0) {
          disconnectionEvent.disconnect = disconnect;
        }
        process.nextTick(() => {
          client.emit(Mqtt5Client.DISCONNECTION, disconnectionEvent);
        });
      }
      static _s_on_suback_callback(resolve, reject, client, errorCode, suback) {
        if (errorCode == 0 && suback !== void 0) {
          resolve(suback);
        } else {
          reject(io.error_code_to_string(errorCode));
        }
      }
      static _s_on_unsuback_callback(resolve, reject, client, errorCode, unsuback) {
        if (errorCode == 0 && unsuback !== void 0) {
          resolve(unsuback);
        } else {
          reject(io.error_code_to_string(errorCode));
        }
      }
      static _s_on_puback_callback(resolve, reject, client, errorCode, result) {
        if (errorCode == 0) {
          resolve(result);
        } else {
          reject(io.error_code_to_string(errorCode));
        }
      }
      static _s_on_message_received(client, message) {
        let messageReceivedEvent = {
          message
        };
        process.nextTick(() => {
          client.emit(Mqtt5Client.MESSAGE_RECEIVED, messageReceivedEvent);
        });
      }
    };
    __name(Mqtt5Client, "Mqtt5Client");
    exports.Mqtt5Client = Mqtt5Client;
    Mqtt5Client.ERROR = "error";
    Mqtt5Client.MESSAGE_RECEIVED = "messageReceived";
    Mqtt5Client.ATTEMPTING_CONNECT = "attemptingConnect";
    Mqtt5Client.CONNECTION_SUCCESS = "connectionSuccess";
    Mqtt5Client.CONNECTION_FAILURE = "connectionFailure";
    Mqtt5Client.DISCONNECTION = "disconnection";
    Mqtt5Client.STOPPED = "stopped";
  }
});

// node_modules/aws-crt/dist/native/aws_iot_mqtt5.js
var require_aws_iot_mqtt5 = __commonJS({
  "node_modules/aws-crt/dist/native/aws_iot_mqtt5.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o6, m6, k6, k22) {
      if (k22 === void 0)
        k22 = k6;
      var desc = Object.getOwnPropertyDescriptor(m6, k6);
      if (!desc || ("get" in desc ? !m6.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m6[k6];
        } };
      }
      Object.defineProperty(o6, k22, desc);
    } : function(o6, m6, k6, k22) {
      if (k22 === void 0)
        k22 = k6;
      o6[k22] = m6[k6];
    });
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? function(o6, v5) {
      Object.defineProperty(o6, "default", { enumerable: true, value: v5 });
    } : function(o6, v5) {
      o6["default"] = v5;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule)
        return mod;
      var result = {};
      if (mod != null) {
        for (var k6 in mod)
          if (k6 !== "default" && Object.prototype.hasOwnProperty.call(mod, k6))
            __createBinding(result, mod, k6);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      __name(adopt, "adopt");
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e6) {
            reject(e6);
          }
        }
        __name(fulfilled, "fulfilled");
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e6) {
            reject(e6);
          }
        }
        __name(rejected, "rejected");
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        __name(step, "step");
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AwsIotMqtt5ClientConfigBuilder = void 0;
    var mqtt5 = __importStar(require_mqtt52());
    var io = __importStar(require_io2());
    var auth = __importStar(require_auth());
    var error_1 = require_error();
    var iot_shared = __importStar(require_aws_iot_shared());
    var mqtt_shared = __importStar(require_mqtt_shared());
    var AwsIotMqtt5ClientConfigBuilder = class {
      constructor(hostName, port, tlsContextOptions) {
        this.tlsContextOptions = tlsContextOptions;
        this.config = {
          hostName,
          port,
          connectProperties: {
            keepAliveIntervalSeconds: mqtt_shared.DEFAULT_KEEP_ALIVE
          },
          extendedValidationAndFlowControlOptions: mqtt5.ClientExtendedValidationAndFlowControl.AwsIotCoreDefaults
        };
      }
      static newDirectMqttBuilderWithMtlsFromPath(hostName, certPath, keyPath) {
        let builder = new AwsIotMqtt5ClientConfigBuilder(hostName, AwsIotMqtt5ClientConfigBuilder.DEFAULT_DIRECT_MQTT_PORT, io.TlsContextOptions.create_client_with_mtls_from_path(certPath, keyPath));
        if (io.is_alpn_available()) {
          builder.tlsContextOptions.alpn_list.unshift("x-amzn-mqtt-ca");
        }
        return builder;
      }
      static newDirectMqttBuilderWithMtlsFromMemory(hostName, cert, privateKey2) {
        let builder = new AwsIotMqtt5ClientConfigBuilder(hostName, AwsIotMqtt5ClientConfigBuilder.DEFAULT_DIRECT_MQTT_PORT, io.TlsContextOptions.create_client_with_mtls(cert, privateKey2));
        if (io.is_alpn_available()) {
          builder.tlsContextOptions.alpn_list.unshift("x-amzn-mqtt-ca");
        }
        return builder;
      }
      static newDirectMqttBuilderWithMtlsFromPkcs11(hostName, pkcs11Options) {
        let builder = new AwsIotMqtt5ClientConfigBuilder(hostName, AwsIotMqtt5ClientConfigBuilder.DEFAULT_DIRECT_MQTT_PORT, io.TlsContextOptions.create_client_with_mtls_pkcs11(pkcs11Options));
        if (io.is_alpn_available()) {
          builder.tlsContextOptions.alpn_list.unshift("x-amzn-mqtt-ca");
        }
        return builder;
      }
      static newDirectMqttBuilderWithMtlsFromPkcs12(hostName, pkcs12_options) {
        let builder = new AwsIotMqtt5ClientConfigBuilder(hostName, AwsIotMqtt5ClientConfigBuilder.DEFAULT_DIRECT_MQTT_PORT, io.TlsContextOptions.create_client_with_mtls_pkcs12_from_path(pkcs12_options.pkcs12_file, pkcs12_options.pkcs12_password));
        if (io.is_alpn_available()) {
          builder.tlsContextOptions.alpn_list.unshift("x-amzn-mqtt-ca");
        }
        return builder;
      }
      static newDirectMqttBuilderWithMtlsFromWindowsCertStorePath(hostName, certificatePath) {
        let builder = new AwsIotMqtt5ClientConfigBuilder(hostName, AwsIotMqtt5ClientConfigBuilder.DEFAULT_DIRECT_MQTT_PORT, io.TlsContextOptions.create_client_with_mtls_windows_cert_store_path(certificatePath));
        if (io.is_alpn_available()) {
          builder.tlsContextOptions.alpn_list.unshift("x-amzn-mqtt-ca");
        }
        return builder;
      }
      static newDirectMqttBuilderWithCustomAuth(hostName, customAuthConfig) {
        let builder = new AwsIotMqtt5ClientConfigBuilder(hostName, AwsIotMqtt5ClientConfigBuilder.DEFAULT_WEBSOCKET_MQTT_PORT, new io.TlsContextOptions());
        builder.customAuthConfig = customAuthConfig;
        builder.tlsContextOptions.alpn_list = ["mqtt"];
        return builder;
      }
      static newWebsocketMqttBuilderWithSigv4Auth(hostName, options) {
        let tlsContextOptions = new io.TlsContextOptions();
        tlsContextOptions.alpn_list = [];
        let builder = new AwsIotMqtt5ClientConfigBuilder(hostName, AwsIotMqtt5ClientConfigBuilder.DEFAULT_WEBSOCKET_MQTT_PORT, tlsContextOptions);
        let credentialsProvider = options === null || options === void 0 ? void 0 : options.credentialsProvider;
        if (!credentialsProvider) {
          credentialsProvider = auth.AwsCredentialsProvider.newDefault();
        }
        builder.config.websocketHandshakeTransform = (request2, done) => __awaiter(this, void 0, void 0, function* () {
          var _a;
          try {
            const signingConfig = {
              algorithm: auth.AwsSigningAlgorithm.SigV4,
              signature_type: auth.AwsSignatureType.HttpRequestViaQueryParams,
              provider: credentialsProvider,
              region: (_a = options === null || options === void 0 ? void 0 : options.region) !== null && _a !== void 0 ? _a : iot_shared.extractRegionFromEndpoint(hostName),
              service: "iotdevicegateway",
              signed_body_value: auth.AwsSignedBodyValue.EmptySha256,
              omit_session_token: true
            };
            yield auth.aws_sign_request(request2, signingConfig);
            done();
          } catch (error) {
            if (error instanceof error_1.CrtError) {
              done(error.error_code);
            } else {
              done(3);
            }
          }
        });
        return builder;
      }
      static newWebsocketMqttBuilderWithCustomAuth(hostName, customAuthConfig) {
        let builder = new AwsIotMqtt5ClientConfigBuilder(hostName, AwsIotMqtt5ClientConfigBuilder.DEFAULT_WEBSOCKET_MQTT_PORT, new io.TlsContextOptions());
        builder.customAuthConfig = customAuthConfig;
        builder.config.websocketHandshakeTransform = (request2, done) => __awaiter(this, void 0, void 0, function* () {
          done(0);
        });
        return builder;
      }
      withCertificateAuthorityFromPath(caDirpath, caFilepath) {
        this.tlsContextOptions.override_default_trust_store_from_path(caDirpath, caFilepath);
        return this;
      }
      withCertificateAuthority(ca) {
        this.tlsContextOptions.override_default_trust_store(ca);
        return this;
      }
      withPort(port) {
        this.config.port = port;
        return this;
      }
      withConnectProperties(connectPacket) {
        this.config.connectProperties = connectPacket;
        return this;
      }
      withSessionBehavior(sessionBehavior) {
        this.config.sessionBehavior = sessionBehavior;
        return this;
      }
      withRetryJitterMode(retryJitterMode) {
        this.config.retryJitterMode = retryJitterMode;
        return this;
      }
      withMinReconnectDelayMs(minReconnectDelayMs) {
        this.config.minReconnectDelayMs = minReconnectDelayMs;
        return this;
      }
      withMaxReconnectDelayMs(maxReconnectDelayMs) {
        this.config.maxReconnectDelayMs = maxReconnectDelayMs;
        return this;
      }
      withMinConnectedTimeToResetReconnectDelayMs(minConnectedTimeToResetReconnectDelayMs) {
        this.config.minConnectedTimeToResetReconnectDelayMs = minConnectedTimeToResetReconnectDelayMs;
        return this;
      }
      withConnackTimeoutMs(connackTimeoutMs) {
        this.config.connackTimeoutMs = connackTimeoutMs;
        return this;
      }
      withOfflineQueueBehavior(offlineQueueBehavior) {
        this.config.offlineQueueBehavior = offlineQueueBehavior;
        return this;
      }
      withPingTimeoutMs(pingTimeoutMs) {
        this.config.pingTimeoutMs = pingTimeoutMs;
        return this;
      }
      withAckTimeoutSeconds(ackTimeoutSeconds) {
        this.config.ackTimeoutSeconds = ackTimeoutSeconds;
        return this;
      }
      withSocketOptions(socketOptions) {
        this.config.socketOptions = socketOptions;
        return this;
      }
      withHttpProxyOptions(httpProxyOptions) {
        this.config.httpProxyOptions = httpProxyOptions;
        return this;
      }
      withExtendedValidationAndFlowControlOptions(extendedValidationAndFlowControlOptions) {
        this.config.extendedValidationAndFlowControlOptions = extendedValidationAndFlowControlOptions;
        return this;
      }
      build() {
        var _a, _b;
        if (this.config.tlsCtx === void 0) {
          this.config.tlsCtx = new io.ClientTlsContext(this.tlsContextOptions);
        }
        if (this.config.connectProperties) {
          this.config.connectProperties.username = iot_shared.buildMqtt5FinalUsername(this.customAuthConfig);
          if ((_a = this.customAuthConfig) === null || _a === void 0 ? void 0 : _a.password) {
            this.config.connectProperties.password = (_b = this.customAuthConfig) === null || _b === void 0 ? void 0 : _b.password;
          }
        }
        return this.config;
      }
    };
    __name(AwsIotMqtt5ClientConfigBuilder, "AwsIotMqtt5ClientConfigBuilder");
    exports.AwsIotMqtt5ClientConfigBuilder = AwsIotMqtt5ClientConfigBuilder;
    AwsIotMqtt5ClientConfigBuilder.DEFAULT_WEBSOCKET_MQTT_PORT = 443;
    AwsIotMqtt5ClientConfigBuilder.DEFAULT_DIRECT_MQTT_PORT = 8883;
  }
});

// node_modules/aws-crt/dist/native/iot.js
var require_iot = __commonJS({
  "node_modules/aws-crt/dist/native/iot.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o6, m6, k6, k22) {
      if (k22 === void 0)
        k22 = k6;
      var desc = Object.getOwnPropertyDescriptor(m6, k6);
      if (!desc || ("get" in desc ? !m6.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m6[k6];
        } };
      }
      Object.defineProperty(o6, k22, desc);
    } : function(o6, m6, k6, k22) {
      if (k22 === void 0)
        k22 = k6;
      o6[k22] = m6[k6];
    });
    var __exportStar = exports && exports.__exportStar || function(m6, exports2) {
      for (var p6 in m6)
        if (p6 !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p6))
          __createBinding(exports2, m6, p6);
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    __exportStar(require_aws_iot(), exports);
    __exportStar(require_aws_iot_mqtt5(), exports);
  }
});

// node_modules/aws-crt/dist/native/mqtt.js
var require_mqtt2 = __commonJS({
  "node_modules/aws-crt/dist/native/mqtt.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o6, m6, k6, k22) {
      if (k22 === void 0)
        k22 = k6;
      var desc = Object.getOwnPropertyDescriptor(m6, k6);
      if (!desc || ("get" in desc ? !m6.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m6[k6];
        } };
      }
      Object.defineProperty(o6, k22, desc);
    } : function(o6, m6, k6, k22) {
      if (k22 === void 0)
        k22 = k6;
      o6[k22] = m6[k6];
    });
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? function(o6, v5) {
      Object.defineProperty(o6, "default", { enumerable: true, value: v5 });
    } : function(o6, v5) {
      o6["default"] = v5;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule)
        return mod;
      var result = {};
      if (mod != null) {
        for (var k6 in mod)
          if (k6 !== "default" && Object.prototype.hasOwnProperty.call(mod, k6))
            __createBinding(result, mod, k6);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      __name(adopt, "adopt");
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e6) {
            reject(e6);
          }
        }
        __name(fulfilled, "fulfilled");
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e6) {
            reject(e6);
          }
        }
        __name(rejected, "rejected");
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        __name(step, "step");
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MqttClientConnection = exports.MqttClient = exports.MqttWill = exports.QoS = exports.HttpProxyOptions = void 0;
    var binding_1 = __importDefault(require_binding());
    var native_resource_1 = require_native_resource();
    var event_1 = require_event();
    var crt = __importStar(require_mqtt_shared());
    var error_1 = require_error();
    var io = __importStar(require_io2());
    var http_1 = require_http2();
    Object.defineProperty(exports, "HttpProxyOptions", { enumerable: true, get: function() {
      return http_1.HttpProxyOptions;
    } });
    var mqtt_1 = require_mqtt();
    var mqtt_2 = require_mqtt();
    Object.defineProperty(exports, "QoS", { enumerable: true, get: function() {
      return mqtt_2.QoS;
    } });
    Object.defineProperty(exports, "MqttWill", { enumerable: true, get: function() {
      return mqtt_2.MqttWill;
    } });
    var MqttClient = class extends native_resource_1.NativeResource {
      constructor(bootstrap = void 0) {
        super(binding_1.default.mqtt_client_new(bootstrap != null ? bootstrap.native_handle() : null));
        this.bootstrap = bootstrap;
      }
      new_connection(config) {
        return new MqttClientConnection(this, config);
      }
    };
    __name(MqttClient, "MqttClient");
    exports.MqttClient = MqttClient;
    var MqttClientConnection = class extends (0, native_resource_1.NativeResourceMixin)(event_1.BufferedEventEmitter) {
      constructor(client, config) {
        super();
        this.client = client;
        this.config = config;
        if (config == null || config == void 0) {
          throw new error_1.CrtError("MqttClientConnection constructor: config not defined");
        }
        const will = config.will ? {
          topic: config.will.topic,
          qos: config.will.qos,
          payload: crt.normalize_payload(config.will.payload),
          retain: config.will.retain
        } : void 0;
        var min_sec = mqtt_1.DEFAULT_RECONNECT_MIN_SEC;
        var max_sec = mqtt_1.DEFAULT_RECONNECT_MAX_SEC;
        if (config.reconnect_min_sec) {
          min_sec = config.reconnect_min_sec;
          max_sec = Math.max(min_sec, max_sec);
        }
        if (config.reconnect_max_sec) {
          max_sec = config.reconnect_max_sec;
          min_sec = Math.min(min_sec, max_sec);
        }
        if (client == void 0 || client == null) {
          throw new error_1.CrtError("MqttClientConnection constructor: client not defined");
        }
        if (config.socket_options == void 0 || config.socket_options == null) {
          throw new error_1.CrtError("MqttClientConnection constructor: socket_options in configuration not defined");
        }
        this._super(binding_1.default.mqtt_client_connection_new(client.native_handle(), (error_code) => {
          this._on_connection_interrupted(error_code);
        }, (return_code, session_present) => {
          this._on_connection_resumed(return_code, session_present);
        }, config.tls_ctx ? config.tls_ctx.native_handle() : null, will, config.username, config.password, config.use_websocket, config.proxy_options ? config.proxy_options.create_native_handle() : void 0, config.websocket_handshake_transform, min_sec, max_sec));
        this.tls_ctx = config.tls_ctx;
        binding_1.default.mqtt_client_connection_on_message(this.native_handle(), this._on_any_publish.bind(this));
        this.on("error", (error) => {
        });
      }
      close() {
        binding_1.default.mqtt_client_connection_close(this.native_handle());
      }
      on(event, listener) {
        super.on(event, listener);
        if (event == "connect") {
          process.nextTick(() => {
            this.uncork();
          });
        }
        return this;
      }
      connect() {
        return __awaiter(this, void 0, void 0, function* () {
          return new Promise((resolve, reject) => {
            reject = this._reject(reject);
            if (this.config.socket_options == null || this.config.socket_options == void 0) {
              throw new error_1.CrtError("MqttClientConnection connect: socket_options in configuration not defined");
            }
            try {
              binding_1.default.mqtt_client_connection_connect(this.native_handle(), this.config.client_id, this.config.host_name, this.config.port, this.config.socket_options.native_handle(), this.config.keep_alive, this.config.ping_timeout, this.config.protocol_operation_timeout, this.config.clean_session, this._on_connect_callback.bind(this, resolve, reject));
            } catch (e6) {
              reject(e6);
            }
          });
        });
      }
      reconnect() {
        return __awaiter(this, void 0, void 0, function* () {
          return new Promise((resolve, reject) => {
            reject = this._reject(reject);
            try {
              binding_1.default.mqtt_client_connection_reconnect(this.native_handle(), this._on_connect_callback.bind(this, resolve, reject));
            } catch (e6) {
              reject(e6);
            }
          });
        });
      }
      publish(topic, payload, qos, retain = false) {
        return __awaiter(this, void 0, void 0, function* () {
          return new Promise((resolve, reject) => {
            reject = this._reject(reject);
            try {
              binding_1.default.mqtt_client_connection_publish(this.native_handle(), topic, crt.normalize_payload(payload), qos, retain, this._on_puback_callback.bind(this, resolve, reject));
            } catch (e6) {
              reject(e6);
            }
          });
        });
      }
      subscribe(topic, qos, on_message) {
        return __awaiter(this, void 0, void 0, function* () {
          return new Promise((resolve, reject) => {
            reject = this._reject(reject);
            try {
              binding_1.default.mqtt_client_connection_subscribe(this.native_handle(), topic, qos, on_message, this._on_suback_callback.bind(this, resolve, reject));
            } catch (e6) {
              reject(e6);
            }
          });
        });
      }
      unsubscribe(topic) {
        return __awaiter(this, void 0, void 0, function* () {
          return new Promise((resolve, reject) => {
            reject = this._reject(reject);
            try {
              binding_1.default.mqtt_client_connection_unsubscribe(this.native_handle(), topic, this._on_unsuback_callback.bind(this, resolve, reject));
            } catch (e6) {
              reject(e6);
            }
          });
        });
      }
      disconnect() {
        return __awaiter(this, void 0, void 0, function* () {
          return new Promise((resolve, reject) => {
            reject = this._reject(reject);
            try {
              binding_1.default.mqtt_client_connection_disconnect(this.native_handle(), this._on_disconnect_callback.bind(this, resolve));
            } catch (e6) {
              reject(e6);
            }
          });
        });
      }
      getQueueStatistics() {
        return binding_1.default.mqtt_client_connection_get_queue_statistics(this.native_handle());
      }
      _reject(reject) {
        return (reason) => {
          reject(reason);
          process.nextTick(() => {
            this.emit("error", new error_1.CrtError(reason));
          });
        };
      }
      _on_connection_interrupted(error_code) {
        this.emit("interrupt", new error_1.CrtError(error_code));
      }
      _on_connection_resumed(return_code, session_present) {
        this.emit("resume", return_code, session_present);
      }
      _on_any_publish(topic, payload, dup, qos, retain) {
        this.emit("message", topic, payload, dup, qos, retain);
      }
      _on_connect_callback(resolve, reject, error_code, return_code, session_present) {
        if (error_code == 0 && return_code == 0) {
          resolve(session_present);
          this.emit("connect", session_present);
        } else if (error_code != 0) {
          reject("Failed to connect: " + io.error_code_to_string(error_code));
        } else {
          reject("Server rejected connection.");
        }
      }
      _on_puback_callback(resolve, reject, packet_id, error_code) {
        if (error_code == 0) {
          resolve({ packet_id });
        } else {
          reject("Failed to publish: " + io.error_code_to_string(error_code));
        }
      }
      _on_suback_callback(resolve, reject, packet_id, topic, qos, error_code) {
        if (error_code == 0) {
          resolve({ packet_id, topic, qos, error_code });
        } else {
          reject("Failed to subscribe: " + io.error_code_to_string(error_code));
        }
      }
      _on_unsuback_callback(resolve, reject, packet_id, error_code) {
        if (error_code == 0) {
          resolve({ packet_id });
        } else {
          reject("Failed to unsubscribe: " + io.error_code_to_string(error_code));
        }
      }
      _on_disconnect_callback(resolve) {
        resolve();
        this.emit("disconnect");
        this.close();
      }
    };
    __name(MqttClientConnection, "MqttClientConnection");
    exports.MqttClientConnection = MqttClientConnection;
    MqttClientConnection.CONNECT = "connect";
    MqttClientConnection.DISCONNECT = "disconnect";
    MqttClientConnection.ERROR = "error";
    MqttClientConnection.INTERRUPT = "interrupt";
    MqttClientConnection.RESUME = "resume";
    MqttClientConnection.MESSAGE = "message";
  }
});

// node_modules/aws-crt/dist/index.js
var require_dist = __commonJS({
  "node_modules/aws-crt/dist/index.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o6, m6, k6, k22) {
      if (k22 === void 0)
        k22 = k6;
      var desc = Object.getOwnPropertyDescriptor(m6, k6);
      if (!desc || ("get" in desc ? !m6.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m6[k6];
        } };
      }
      Object.defineProperty(o6, k22, desc);
    } : function(o6, m6, k6, k22) {
      if (k22 === void 0)
        k22 = k6;
      o6[k22] = m6[k6];
    });
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? function(o6, v5) {
      Object.defineProperty(o6, "default", { enumerable: true, value: v5 });
    } : function(o6, v5) {
      o6["default"] = v5;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule)
        return mod;
      var result = {};
      if (mod != null) {
        for (var k6 in mod)
          if (k6 !== "default" && Object.prototype.hasOwnProperty.call(mod, k6))
            __createBinding(result, mod, k6);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CrtError = exports.resource_safety = exports.promise = exports.platform = exports.mqtt5 = exports.mqtt = exports.iot = exports.io = exports.http = exports.eventstream = exports.crt = exports.crypto = exports.checksums = exports.cancel = exports.auth = void 0;
    var cancel = __importStar(require_cancel());
    exports.cancel = cancel;
    var platform2 = __importStar(require_platform());
    exports.platform = platform2;
    var promise = __importStar(require_promise());
    exports.promise = promise;
    var resource_safety = __importStar(require_resource_safety());
    exports.resource_safety = resource_safety;
    var auth = __importStar(require_auth());
    exports.auth = auth;
    var checksums = __importStar(require_checksums());
    exports.checksums = checksums;
    var crt = __importStar(require_crt());
    exports.crt = crt;
    var crypto2 = __importStar(require_crypto());
    exports.crypto = crypto2;
    var eventstream = __importStar(require_eventstream());
    exports.eventstream = eventstream;
    var http = __importStar(require_http2());
    exports.http = http;
    var io = __importStar(require_io2());
    exports.io = io;
    var iot = __importStar(require_iot());
    exports.iot = iot;
    var mqtt = __importStar(require_mqtt2());
    exports.mqtt = mqtt;
    var mqtt5 = __importStar(require_mqtt52());
    exports.mqtt5 = mqtt5;
    var error_1 = require_error();
    Object.defineProperty(exports, "CrtError", { enumerable: true, get: function() {
      return error_1.CrtError;
    } });
  }
});

// node_modules/fast-jwt/src/error.js
var require_error2 = __commonJS({
  "node_modules/fast-jwt/src/error.js"(exports, module2) {
    "use strict";
    var TokenError = class extends Error {
      constructor(code, message, additional) {
        super(message);
        Error.captureStackTrace(this, this.constructor);
        this.code = code;
        if (additional) {
          for (const k6 in additional) {
            this[k6] = additional[k6];
          }
        }
      }
    };
    __name(TokenError, "TokenError");
    TokenError.codes = {
      invalidType: "FAST_JWT_INVALID_TYPE",
      invalidOption: "FAST_JWT_INVALID_OPTION",
      invalidAlgorithm: "FAST_JWT_INVALID_ALGORITHM",
      invalidClaimType: "FAST_JWT_INVALID_CLAIM_TYPE",
      invalidClaimValue: "FAST_JWT_INVALID_CLAIM_VALUE",
      invalidKey: "FAST_JWT_INVALID_KEY",
      invalidSignature: "FAST_JWT_INVALID_SIGNATURE",
      invalidPayload: "FAST_JWT_INVALID_PAYLOAD",
      malformed: "FAST_JWT_MALFORMED",
      inactive: "FAST_JWT_INACTIVE",
      expired: "FAST_JWT_EXPIRED",
      missingKey: "FAST_JWT_MISSING_KEY",
      keyFetchingError: "FAST_JWT_KEY_FETCHING_ERROR",
      signError: "FAST_JWT_SIGN_ERROR",
      verifyError: "FAST_JWT_VERIFY_ERROR",
      missingRequiredClaim: "FAST_JWT_MISSING_REQUIRED_CLAIM"
    };
    TokenError.wrap = function(originalError, code, message) {
      if (originalError instanceof TokenError) {
        return originalError;
      }
      return new TokenError(code, message, { originalError });
    };
    module2.exports = TokenError;
  }
});

// node_modules/fast-jwt/src/decoder.js
var require_decoder = __commonJS({
  "node_modules/fast-jwt/src/decoder.js"(exports, module2) {
    "use strict";
    var TokenError = require_error2();
    function decode({ complete, checkTyp }, token) {
      if (token instanceof Buffer) {
        token = token.toString("utf-8");
      } else if (typeof token !== "string") {
        throw new TokenError(TokenError.codes.invalidType, "The token must be a string or a buffer.");
      }
      const firstSeparator = token.indexOf(".");
      const lastSeparator = token.lastIndexOf(".");
      if (firstSeparator === -1 || firstSeparator >= lastSeparator) {
        throw new TokenError(TokenError.codes.malformed, "The token is malformed.");
      }
      let validHeader = false;
      try {
        const header = JSON.parse(Buffer.from(token.slice(0, firstSeparator), "base64").toString("utf-8"));
        if (checkTyp && header.typ !== checkTyp) {
          throw new TokenError(TokenError.codes.invalidType, `The type must be "${checkTyp}".`, { header });
        }
        validHeader = true;
        let payload = Buffer.from(token.slice(firstSeparator + 1, lastSeparator), "base64").toString("utf-8");
        payload = JSON.parse(payload);
        if (!payload || typeof payload !== "object") {
          throw new TokenError(TokenError.codes.invalidPayload, "The payload must be an object", { payload });
        }
        return complete ? { header, payload, signature: token.slice(lastSeparator + 1), input: token.slice(0, lastSeparator) } : payload;
      } catch (e6) {
        throw TokenError.wrap(
          e6,
          TokenError.codes.malformed,
          `The token ${validHeader ? "payload" : "header"} is not a valid base64url serialized JSON.`
        );
      }
    }
    __name(decode, "decode");
    module2.exports = /* @__PURE__ */ __name(function createDecoder(options = {}) {
      const complete = options.complete || false;
      const checkTyp = options.checkTyp;
      return decode.bind(null, { complete, checkTyp });
    }, "createDecoder");
  }
});

// node_modules/obliterator/iterator.js
var require_iterator = __commonJS({
  "node_modules/obliterator/iterator.js"(exports, module2) {
    function Iterator(next) {
      if (typeof next !== "function")
        throw new Error("obliterator/iterator: expecting a function!");
      this.next = next;
    }
    __name(Iterator, "Iterator");
    if (typeof Symbol !== "undefined")
      Iterator.prototype[Symbol.iterator] = function() {
        return this;
      };
    Iterator.of = function() {
      var args = arguments, l6 = args.length, i6 = 0;
      return new Iterator(function() {
        if (i6 >= l6)
          return { done: true };
        return { done: false, value: args[i6++] };
      });
    };
    Iterator.empty = function() {
      var iterator = new Iterator(function() {
        return { done: true };
      });
      return iterator;
    };
    Iterator.fromSequence = function(sequence) {
      var i6 = 0, l6 = sequence.length;
      return new Iterator(function() {
        if (i6 >= l6)
          return { done: true };
        return { done: false, value: sequence[i6++] };
      });
    };
    Iterator.is = function(value) {
      if (value instanceof Iterator)
        return true;
      return typeof value === "object" && value !== null && typeof value.next === "function";
    };
    module2.exports = Iterator;
  }
});

// node_modules/obliterator/support.js
var require_support = __commonJS({
  "node_modules/obliterator/support.js"(exports) {
    exports.ARRAY_BUFFER_SUPPORT = typeof ArrayBuffer !== "undefined";
    exports.SYMBOL_SUPPORT = typeof Symbol !== "undefined";
  }
});

// node_modules/obliterator/foreach.js
var require_foreach = __commonJS({
  "node_modules/obliterator/foreach.js"(exports, module2) {
    var support = require_support();
    var ARRAY_BUFFER_SUPPORT = support.ARRAY_BUFFER_SUPPORT;
    var SYMBOL_SUPPORT = support.SYMBOL_SUPPORT;
    module2.exports = /* @__PURE__ */ __name(function forEach(iterable, callback) {
      var iterator, k6, i6, l6, s6;
      if (!iterable)
        throw new Error("obliterator/forEach: invalid iterable.");
      if (typeof callback !== "function")
        throw new Error("obliterator/forEach: expecting a callback.");
      if (Array.isArray(iterable) || ARRAY_BUFFER_SUPPORT && ArrayBuffer.isView(iterable) || typeof iterable === "string" || iterable.toString() === "[object Arguments]") {
        for (i6 = 0, l6 = iterable.length; i6 < l6; i6++)
          callback(iterable[i6], i6);
        return;
      }
      if (typeof iterable.forEach === "function") {
        iterable.forEach(callback);
        return;
      }
      if (SYMBOL_SUPPORT && Symbol.iterator in iterable && typeof iterable.next !== "function") {
        iterable = iterable[Symbol.iterator]();
      }
      if (typeof iterable.next === "function") {
        iterator = iterable;
        i6 = 0;
        while (s6 = iterator.next(), s6.done !== true) {
          callback(s6.value, i6);
          i6++;
        }
        return;
      }
      for (k6 in iterable) {
        if (iterable.hasOwnProperty(k6)) {
          callback(iterable[k6], k6);
        }
      }
      return;
    }, "forEach");
  }
});

// node_modules/mnemonist/utils/typed-arrays.js
var require_typed_arrays = __commonJS({
  "node_modules/mnemonist/utils/typed-arrays.js"(exports) {
    var MAX_8BIT_INTEGER = Math.pow(2, 8) - 1;
    var MAX_16BIT_INTEGER = Math.pow(2, 16) - 1;
    var MAX_32BIT_INTEGER = Math.pow(2, 32) - 1;
    var MAX_SIGNED_8BIT_INTEGER = Math.pow(2, 7) - 1;
    var MAX_SIGNED_16BIT_INTEGER = Math.pow(2, 15) - 1;
    var MAX_SIGNED_32BIT_INTEGER = Math.pow(2, 31) - 1;
    exports.getPointerArray = function(size) {
      var maxIndex = size - 1;
      if (maxIndex <= MAX_8BIT_INTEGER)
        return Uint8Array;
      if (maxIndex <= MAX_16BIT_INTEGER)
        return Uint16Array;
      if (maxIndex <= MAX_32BIT_INTEGER)
        return Uint32Array;
      throw new Error("mnemonist: Pointer Array of size > 4294967295 is not supported.");
    };
    exports.getSignedPointerArray = function(size) {
      var maxIndex = size - 1;
      if (maxIndex <= MAX_SIGNED_8BIT_INTEGER)
        return Int8Array;
      if (maxIndex <= MAX_SIGNED_16BIT_INTEGER)
        return Int16Array;
      if (maxIndex <= MAX_SIGNED_32BIT_INTEGER)
        return Int32Array;
      return Float64Array;
    };
    exports.getNumberType = function(value) {
      if (value === (value | 0)) {
        if (Math.sign(value) === -1) {
          if (value <= 127 && value >= -128)
            return Int8Array;
          if (value <= 32767 && value >= -32768)
            return Int16Array;
          return Int32Array;
        } else {
          if (value <= 255)
            return Uint8Array;
          if (value <= 65535)
            return Uint16Array;
          return Uint32Array;
        }
      }
      return Float64Array;
    };
    var TYPE_PRIORITY = {
      Uint8Array: 1,
      Int8Array: 2,
      Uint16Array: 3,
      Int16Array: 4,
      Uint32Array: 5,
      Int32Array: 6,
      Float32Array: 7,
      Float64Array: 8
    };
    exports.getMinimalRepresentation = function(array, getter) {
      var maxType = null, maxPriority = 0, p6, t4, v5, i6, l6;
      for (i6 = 0, l6 = array.length; i6 < l6; i6++) {
        v5 = getter ? getter(array[i6]) : array[i6];
        t4 = exports.getNumberType(v5);
        p6 = TYPE_PRIORITY[t4.name];
        if (p6 > maxPriority) {
          maxPriority = p6;
          maxType = t4;
        }
      }
      return maxType;
    };
    exports.isTypedArray = function(value) {
      return typeof ArrayBuffer !== "undefined" && ArrayBuffer.isView(value);
    };
    exports.concat = function() {
      var length = 0, i6, o6, l6;
      for (i6 = 0, l6 = arguments.length; i6 < l6; i6++)
        length += arguments[i6].length;
      var array = new arguments[0].constructor(length);
      for (i6 = 0, o6 = 0; i6 < l6; i6++) {
        array.set(arguments[i6], o6);
        o6 += arguments[i6].length;
      }
      return array;
    };
    exports.indices = function(length) {
      var PointerArray = exports.getPointerArray(length);
      var array = new PointerArray(length);
      for (var i6 = 0; i6 < length; i6++)
        array[i6] = i6;
      return array;
    };
  }
});

// node_modules/mnemonist/utils/iterables.js
var require_iterables = __commonJS({
  "node_modules/mnemonist/utils/iterables.js"(exports) {
    var forEach = require_foreach();
    var typed = require_typed_arrays();
    function isArrayLike(target) {
      return Array.isArray(target) || typed.isTypedArray(target);
    }
    __name(isArrayLike, "isArrayLike");
    function guessLength(target) {
      if (typeof target.length === "number")
        return target.length;
      if (typeof target.size === "number")
        return target.size;
      return;
    }
    __name(guessLength, "guessLength");
    function toArray(target) {
      var l6 = guessLength(target);
      var array = typeof l6 === "number" ? new Array(l6) : [];
      var i6 = 0;
      forEach(target, function(value) {
        array[i6++] = value;
      });
      return array;
    }
    __name(toArray, "toArray");
    function toArrayWithIndices(target) {
      var l6 = guessLength(target);
      var IndexArray = typeof l6 === "number" ? typed.getPointerArray(l6) : Array;
      var array = typeof l6 === "number" ? new Array(l6) : [];
      var indices = typeof l6 === "number" ? new IndexArray(l6) : [];
      var i6 = 0;
      forEach(target, function(value) {
        array[i6] = value;
        indices[i6] = i6++;
      });
      return [array, indices];
    }
    __name(toArrayWithIndices, "toArrayWithIndices");
    exports.isArrayLike = isArrayLike;
    exports.guessLength = guessLength;
    exports.toArray = toArray;
    exports.toArrayWithIndices = toArrayWithIndices;
  }
});

// node_modules/mnemonist/lru-cache.js
var require_lru_cache = __commonJS({
  "node_modules/mnemonist/lru-cache.js"(exports, module2) {
    var Iterator = require_iterator();
    var forEach = require_foreach();
    var typed = require_typed_arrays();
    var iterables = require_iterables();
    function LRUCache2(Keys, Values, capacity) {
      if (arguments.length < 2) {
        capacity = Keys;
        Keys = null;
        Values = null;
      }
      this.capacity = capacity;
      if (typeof this.capacity !== "number" || this.capacity <= 0)
        throw new Error("mnemonist/lru-cache: capacity should be positive number.");
      else if (!isFinite(this.capacity) || Math.floor(this.capacity) !== this.capacity)
        throw new Error("mnemonist/lru-cache: capacity should be a finite positive integer.");
      var PointerArray = typed.getPointerArray(capacity);
      this.forward = new PointerArray(capacity);
      this.backward = new PointerArray(capacity);
      this.K = typeof Keys === "function" ? new Keys(capacity) : new Array(capacity);
      this.V = typeof Values === "function" ? new Values(capacity) : new Array(capacity);
      this.size = 0;
      this.head = 0;
      this.tail = 0;
      this.items = {};
    }
    __name(LRUCache2, "LRUCache");
    LRUCache2.prototype.clear = function() {
      this.size = 0;
      this.head = 0;
      this.tail = 0;
      this.items = {};
    };
    LRUCache2.prototype.splayOnTop = function(pointer) {
      var oldHead = this.head;
      if (this.head === pointer)
        return this;
      var previous = this.backward[pointer], next = this.forward[pointer];
      if (this.tail === pointer) {
        this.tail = previous;
      } else {
        this.backward[next] = previous;
      }
      this.forward[previous] = next;
      this.backward[oldHead] = pointer;
      this.head = pointer;
      this.forward[pointer] = oldHead;
      return this;
    };
    LRUCache2.prototype.set = function(key, value) {
      var pointer = this.items[key];
      if (typeof pointer !== "undefined") {
        this.splayOnTop(pointer);
        this.V[pointer] = value;
        return;
      }
      if (this.size < this.capacity) {
        pointer = this.size++;
      } else {
        pointer = this.tail;
        this.tail = this.backward[pointer];
        delete this.items[this.K[pointer]];
      }
      this.items[key] = pointer;
      this.K[pointer] = key;
      this.V[pointer] = value;
      this.forward[pointer] = this.head;
      this.backward[this.head] = pointer;
      this.head = pointer;
    };
    LRUCache2.prototype.setpop = function(key, value) {
      var oldValue = null;
      var oldKey = null;
      var pointer = this.items[key];
      if (typeof pointer !== "undefined") {
        this.splayOnTop(pointer);
        oldValue = this.V[pointer];
        this.V[pointer] = value;
        return { evicted: false, key, value: oldValue };
      }
      if (this.size < this.capacity) {
        pointer = this.size++;
      } else {
        pointer = this.tail;
        this.tail = this.backward[pointer];
        oldValue = this.V[pointer];
        oldKey = this.K[pointer];
        delete this.items[this.K[pointer]];
      }
      this.items[key] = pointer;
      this.K[pointer] = key;
      this.V[pointer] = value;
      this.forward[pointer] = this.head;
      this.backward[this.head] = pointer;
      this.head = pointer;
      if (oldKey) {
        return { evicted: true, key: oldKey, value: oldValue };
      } else {
        return null;
      }
    };
    LRUCache2.prototype.has = function(key) {
      return key in this.items;
    };
    LRUCache2.prototype.get = function(key) {
      var pointer = this.items[key];
      if (typeof pointer === "undefined")
        return;
      this.splayOnTop(pointer);
      return this.V[pointer];
    };
    LRUCache2.prototype.peek = function(key) {
      var pointer = this.items[key];
      if (typeof pointer === "undefined")
        return;
      return this.V[pointer];
    };
    LRUCache2.prototype.forEach = function(callback, scope) {
      scope = arguments.length > 1 ? scope : this;
      var i6 = 0, l6 = this.size;
      var pointer = this.head, keys = this.K, values = this.V, forward = this.forward;
      while (i6 < l6) {
        callback.call(scope, values[pointer], keys[pointer], this);
        pointer = forward[pointer];
        i6++;
      }
    };
    LRUCache2.prototype.keys = function() {
      var i6 = 0, l6 = this.size;
      var pointer = this.head, keys = this.K, forward = this.forward;
      return new Iterator(function() {
        if (i6 >= l6)
          return { done: true };
        var key = keys[pointer];
        i6++;
        if (i6 < l6)
          pointer = forward[pointer];
        return {
          done: false,
          value: key
        };
      });
    };
    LRUCache2.prototype.values = function() {
      var i6 = 0, l6 = this.size;
      var pointer = this.head, values = this.V, forward = this.forward;
      return new Iterator(function() {
        if (i6 >= l6)
          return { done: true };
        var value = values[pointer];
        i6++;
        if (i6 < l6)
          pointer = forward[pointer];
        return {
          done: false,
          value
        };
      });
    };
    LRUCache2.prototype.entries = function() {
      var i6 = 0, l6 = this.size;
      var pointer = this.head, keys = this.K, values = this.V, forward = this.forward;
      return new Iterator(function() {
        if (i6 >= l6)
          return { done: true };
        var key = keys[pointer], value = values[pointer];
        i6++;
        if (i6 < l6)
          pointer = forward[pointer];
        return {
          done: false,
          value: [key, value]
        };
      });
    };
    if (typeof Symbol !== "undefined")
      LRUCache2.prototype[Symbol.iterator] = LRUCache2.prototype.entries;
    LRUCache2.prototype.inspect = function() {
      var proxy = /* @__PURE__ */ new Map();
      var iterator = this.entries(), step;
      while (step = iterator.next(), !step.done)
        proxy.set(step.value[0], step.value[1]);
      Object.defineProperty(proxy, "constructor", {
        value: LRUCache2,
        enumerable: false
      });
      return proxy;
    };
    if (typeof Symbol !== "undefined")
      LRUCache2.prototype[Symbol.for("nodejs.util.inspect.custom")] = LRUCache2.prototype.inspect;
    LRUCache2.from = function(iterable, Keys, Values, capacity) {
      if (arguments.length < 2) {
        capacity = iterables.guessLength(iterable);
        if (typeof capacity !== "number")
          throw new Error("mnemonist/lru-cache.from: could not guess iterable length. Please provide desired capacity as last argument.");
      } else if (arguments.length === 2) {
        capacity = Keys;
        Keys = null;
        Values = null;
      }
      var cache = new LRUCache2(Keys, Values, capacity);
      forEach(iterable, function(value, key) {
        cache.set(key, value);
      });
      return cache;
    };
    module2.exports = LRUCache2;
  }
});

// node_modules/bn.js/lib/bn.js
var require_bn = __commonJS({
  "node_modules/bn.js/lib/bn.js"(exports, module2) {
    (function(module3, exports2) {
      "use strict";
      function assert(val, msg) {
        if (!val)
          throw new Error(msg || "Assertion failed");
      }
      __name(assert, "assert");
      function inherits(ctor, superCtor) {
        ctor.super_ = superCtor;
        var TempCtor = /* @__PURE__ */ __name(function() {
        }, "TempCtor");
        TempCtor.prototype = superCtor.prototype;
        ctor.prototype = new TempCtor();
        ctor.prototype.constructor = ctor;
      }
      __name(inherits, "inherits");
      function BN(number, base, endian) {
        if (BN.isBN(number)) {
          return number;
        }
        this.negative = 0;
        this.words = null;
        this.length = 0;
        this.red = null;
        if (number !== null) {
          if (base === "le" || base === "be") {
            endian = base;
            base = 10;
          }
          this._init(number || 0, base || 10, endian || "be");
        }
      }
      __name(BN, "BN");
      if (typeof module3 === "object") {
        module3.exports = BN;
      } else {
        exports2.BN = BN;
      }
      BN.BN = BN;
      BN.wordSize = 26;
      var Buffer5;
      try {
        if (typeof window !== "undefined" && typeof window.Buffer !== "undefined") {
          Buffer5 = window.Buffer;
        } else {
          Buffer5 = __require("buffer").Buffer;
        }
      } catch (e6) {
      }
      BN.isBN = /* @__PURE__ */ __name(function isBN(num) {
        if (num instanceof BN) {
          return true;
        }
        return num !== null && typeof num === "object" && num.constructor.wordSize === BN.wordSize && Array.isArray(num.words);
      }, "isBN");
      BN.max = /* @__PURE__ */ __name(function max(left, right) {
        if (left.cmp(right) > 0)
          return left;
        return right;
      }, "max");
      BN.min = /* @__PURE__ */ __name(function min(left, right) {
        if (left.cmp(right) < 0)
          return left;
        return right;
      }, "min");
      BN.prototype._init = /* @__PURE__ */ __name(function init(number, base, endian) {
        if (typeof number === "number") {
          return this._initNumber(number, base, endian);
        }
        if (typeof number === "object") {
          return this._initArray(number, base, endian);
        }
        if (base === "hex") {
          base = 16;
        }
        assert(base === (base | 0) && base >= 2 && base <= 36);
        number = number.toString().replace(/\s+/g, "");
        var start = 0;
        if (number[0] === "-") {
          start++;
          this.negative = 1;
        }
        if (start < number.length) {
          if (base === 16) {
            this._parseHex(number, start, endian);
          } else {
            this._parseBase(number, base, start);
            if (endian === "le") {
              this._initArray(this.toArray(), base, endian);
            }
          }
        }
      }, "init");
      BN.prototype._initNumber = /* @__PURE__ */ __name(function _initNumber(number, base, endian) {
        if (number < 0) {
          this.negative = 1;
          number = -number;
        }
        if (number < 67108864) {
          this.words = [number & 67108863];
          this.length = 1;
        } else if (number < 4503599627370496) {
          this.words = [
            number & 67108863,
            number / 67108864 & 67108863
          ];
          this.length = 2;
        } else {
          assert(number < 9007199254740992);
          this.words = [
            number & 67108863,
            number / 67108864 & 67108863,
            1
          ];
          this.length = 3;
        }
        if (endian !== "le")
          return;
        this._initArray(this.toArray(), base, endian);
      }, "_initNumber");
      BN.prototype._initArray = /* @__PURE__ */ __name(function _initArray(number, base, endian) {
        assert(typeof number.length === "number");
        if (number.length <= 0) {
          this.words = [0];
          this.length = 1;
          return this;
        }
        this.length = Math.ceil(number.length / 3);
        this.words = new Array(this.length);
        for (var i6 = 0; i6 < this.length; i6++) {
          this.words[i6] = 0;
        }
        var j6, w3;
        var off = 0;
        if (endian === "be") {
          for (i6 = number.length - 1, j6 = 0; i6 >= 0; i6 -= 3) {
            w3 = number[i6] | number[i6 - 1] << 8 | number[i6 - 2] << 16;
            this.words[j6] |= w3 << off & 67108863;
            this.words[j6 + 1] = w3 >>> 26 - off & 67108863;
            off += 24;
            if (off >= 26) {
              off -= 26;
              j6++;
            }
          }
        } else if (endian === "le") {
          for (i6 = 0, j6 = 0; i6 < number.length; i6 += 3) {
            w3 = number[i6] | number[i6 + 1] << 8 | number[i6 + 2] << 16;
            this.words[j6] |= w3 << off & 67108863;
            this.words[j6 + 1] = w3 >>> 26 - off & 67108863;
            off += 24;
            if (off >= 26) {
              off -= 26;
              j6++;
            }
          }
        }
        return this.strip();
      }, "_initArray");
      function parseHex4Bits(string, index) {
        var c6 = string.charCodeAt(index);
        if (c6 >= 65 && c6 <= 70) {
          return c6 - 55;
        } else if (c6 >= 97 && c6 <= 102) {
          return c6 - 87;
        } else {
          return c6 - 48 & 15;
        }
      }
      __name(parseHex4Bits, "parseHex4Bits");
      function parseHexByte(string, lowerBound, index) {
        var r6 = parseHex4Bits(string, index);
        if (index - 1 >= lowerBound) {
          r6 |= parseHex4Bits(string, index - 1) << 4;
        }
        return r6;
      }
      __name(parseHexByte, "parseHexByte");
      BN.prototype._parseHex = /* @__PURE__ */ __name(function _parseHex(number, start, endian) {
        this.length = Math.ceil((number.length - start) / 6);
        this.words = new Array(this.length);
        for (var i6 = 0; i6 < this.length; i6++) {
          this.words[i6] = 0;
        }
        var off = 0;
        var j6 = 0;
        var w3;
        if (endian === "be") {
          for (i6 = number.length - 1; i6 >= start; i6 -= 2) {
            w3 = parseHexByte(number, start, i6) << off;
            this.words[j6] |= w3 & 67108863;
            if (off >= 18) {
              off -= 18;
              j6 += 1;
              this.words[j6] |= w3 >>> 26;
            } else {
              off += 8;
            }
          }
        } else {
          var parseLength = number.length - start;
          for (i6 = parseLength % 2 === 0 ? start + 1 : start; i6 < number.length; i6 += 2) {
            w3 = parseHexByte(number, start, i6) << off;
            this.words[j6] |= w3 & 67108863;
            if (off >= 18) {
              off -= 18;
              j6 += 1;
              this.words[j6] |= w3 >>> 26;
            } else {
              off += 8;
            }
          }
        }
        this.strip();
      }, "_parseHex");
      function parseBase(str, start, end, mul) {
        var r6 = 0;
        var len = Math.min(str.length, end);
        for (var i6 = start; i6 < len; i6++) {
          var c6 = str.charCodeAt(i6) - 48;
          r6 *= mul;
          if (c6 >= 49) {
            r6 += c6 - 49 + 10;
          } else if (c6 >= 17) {
            r6 += c6 - 17 + 10;
          } else {
            r6 += c6;
          }
        }
        return r6;
      }
      __name(parseBase, "parseBase");
      BN.prototype._parseBase = /* @__PURE__ */ __name(function _parseBase(number, base, start) {
        this.words = [0];
        this.length = 1;
        for (var limbLen = 0, limbPow = 1; limbPow <= 67108863; limbPow *= base) {
          limbLen++;
        }
        limbLen--;
        limbPow = limbPow / base | 0;
        var total = number.length - start;
        var mod = total % limbLen;
        var end = Math.min(total, total - mod) + start;
        var word = 0;
        for (var i6 = start; i6 < end; i6 += limbLen) {
          word = parseBase(number, i6, i6 + limbLen, base);
          this.imuln(limbPow);
          if (this.words[0] + word < 67108864) {
            this.words[0] += word;
          } else {
            this._iaddn(word);
          }
        }
        if (mod !== 0) {
          var pow = 1;
          word = parseBase(number, i6, number.length, base);
          for (i6 = 0; i6 < mod; i6++) {
            pow *= base;
          }
          this.imuln(pow);
          if (this.words[0] + word < 67108864) {
            this.words[0] += word;
          } else {
            this._iaddn(word);
          }
        }
        this.strip();
      }, "_parseBase");
      BN.prototype.copy = /* @__PURE__ */ __name(function copy(dest) {
        dest.words = new Array(this.length);
        for (var i6 = 0; i6 < this.length; i6++) {
          dest.words[i6] = this.words[i6];
        }
        dest.length = this.length;
        dest.negative = this.negative;
        dest.red = this.red;
      }, "copy");
      BN.prototype.clone = /* @__PURE__ */ __name(function clone() {
        var r6 = new BN(null);
        this.copy(r6);
        return r6;
      }, "clone");
      BN.prototype._expand = /* @__PURE__ */ __name(function _expand(size) {
        while (this.length < size) {
          this.words[this.length++] = 0;
        }
        return this;
      }, "_expand");
      BN.prototype.strip = /* @__PURE__ */ __name(function strip() {
        while (this.length > 1 && this.words[this.length - 1] === 0) {
          this.length--;
        }
        return this._normSign();
      }, "strip");
      BN.prototype._normSign = /* @__PURE__ */ __name(function _normSign() {
        if (this.length === 1 && this.words[0] === 0) {
          this.negative = 0;
        }
        return this;
      }, "_normSign");
      BN.prototype.inspect = /* @__PURE__ */ __name(function inspect() {
        return (this.red ? "<BN-R: " : "<BN: ") + this.toString(16) + ">";
      }, "inspect");
      var zeros = [
        "",
        "0",
        "00",
        "000",
        "0000",
        "00000",
        "000000",
        "0000000",
        "00000000",
        "000000000",
        "0000000000",
        "00000000000",
        "000000000000",
        "0000000000000",
        "00000000000000",
        "000000000000000",
        "0000000000000000",
        "00000000000000000",
        "000000000000000000",
        "0000000000000000000",
        "00000000000000000000",
        "000000000000000000000",
        "0000000000000000000000",
        "00000000000000000000000",
        "000000000000000000000000",
        "0000000000000000000000000"
      ];
      var groupSizes = [
        0,
        0,
        25,
        16,
        12,
        11,
        10,
        9,
        8,
        8,
        7,
        7,
        7,
        7,
        6,
        6,
        6,
        6,
        6,
        6,
        6,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5
      ];
      var groupBases = [
        0,
        0,
        33554432,
        43046721,
        16777216,
        48828125,
        60466176,
        40353607,
        16777216,
        43046721,
        1e7,
        19487171,
        35831808,
        62748517,
        7529536,
        11390625,
        16777216,
        24137569,
        34012224,
        47045881,
        64e6,
        4084101,
        5153632,
        6436343,
        7962624,
        9765625,
        11881376,
        14348907,
        17210368,
        20511149,
        243e5,
        28629151,
        33554432,
        39135393,
        45435424,
        52521875,
        60466176
      ];
      BN.prototype.toString = /* @__PURE__ */ __name(function toString(base, padding) {
        base = base || 10;
        padding = padding | 0 || 1;
        var out;
        if (base === 16 || base === "hex") {
          out = "";
          var off = 0;
          var carry = 0;
          for (var i6 = 0; i6 < this.length; i6++) {
            var w3 = this.words[i6];
            var word = ((w3 << off | carry) & 16777215).toString(16);
            carry = w3 >>> 24 - off & 16777215;
            if (carry !== 0 || i6 !== this.length - 1) {
              out = zeros[6 - word.length] + word + out;
            } else {
              out = word + out;
            }
            off += 2;
            if (off >= 26) {
              off -= 26;
              i6--;
            }
          }
          if (carry !== 0) {
            out = carry.toString(16) + out;
          }
          while (out.length % padding !== 0) {
            out = "0" + out;
          }
          if (this.negative !== 0) {
            out = "-" + out;
          }
          return out;
        }
        if (base === (base | 0) && base >= 2 && base <= 36) {
          var groupSize = groupSizes[base];
          var groupBase = groupBases[base];
          out = "";
          var c6 = this.clone();
          c6.negative = 0;
          while (!c6.isZero()) {
            var r6 = c6.modn(groupBase).toString(base);
            c6 = c6.idivn(groupBase);
            if (!c6.isZero()) {
              out = zeros[groupSize - r6.length] + r6 + out;
            } else {
              out = r6 + out;
            }
          }
          if (this.isZero()) {
            out = "0" + out;
          }
          while (out.length % padding !== 0) {
            out = "0" + out;
          }
          if (this.negative !== 0) {
            out = "-" + out;
          }
          return out;
        }
        assert(false, "Base should be between 2 and 36");
      }, "toString");
      BN.prototype.toNumber = /* @__PURE__ */ __name(function toNumber() {
        var ret = this.words[0];
        if (this.length === 2) {
          ret += this.words[1] * 67108864;
        } else if (this.length === 3 && this.words[2] === 1) {
          ret += 4503599627370496 + this.words[1] * 67108864;
        } else if (this.length > 2) {
          assert(false, "Number can only safely store up to 53 bits");
        }
        return this.negative !== 0 ? -ret : ret;
      }, "toNumber");
      BN.prototype.toJSON = /* @__PURE__ */ __name(function toJSON() {
        return this.toString(16);
      }, "toJSON");
      BN.prototype.toBuffer = /* @__PURE__ */ __name(function toBuffer(endian, length) {
        assert(typeof Buffer5 !== "undefined");
        return this.toArrayLike(Buffer5, endian, length);
      }, "toBuffer");
      BN.prototype.toArray = /* @__PURE__ */ __name(function toArray(endian, length) {
        return this.toArrayLike(Array, endian, length);
      }, "toArray");
      BN.prototype.toArrayLike = /* @__PURE__ */ __name(function toArrayLike(ArrayType, endian, length) {
        var byteLength = this.byteLength();
        var reqLength = length || Math.max(1, byteLength);
        assert(byteLength <= reqLength, "byte array longer than desired length");
        assert(reqLength > 0, "Requested array length <= 0");
        this.strip();
        var littleEndian = endian === "le";
        var res = new ArrayType(reqLength);
        var b6, i6;
        var q6 = this.clone();
        if (!littleEndian) {
          for (i6 = 0; i6 < reqLength - byteLength; i6++) {
            res[i6] = 0;
          }
          for (i6 = 0; !q6.isZero(); i6++) {
            b6 = q6.andln(255);
            q6.iushrn(8);
            res[reqLength - i6 - 1] = b6;
          }
        } else {
          for (i6 = 0; !q6.isZero(); i6++) {
            b6 = q6.andln(255);
            q6.iushrn(8);
            res[i6] = b6;
          }
          for (; i6 < reqLength; i6++) {
            res[i6] = 0;
          }
        }
        return res;
      }, "toArrayLike");
      if (Math.clz32) {
        BN.prototype._countBits = /* @__PURE__ */ __name(function _countBits(w3) {
          return 32 - Math.clz32(w3);
        }, "_countBits");
      } else {
        BN.prototype._countBits = /* @__PURE__ */ __name(function _countBits(w3) {
          var t4 = w3;
          var r6 = 0;
          if (t4 >= 4096) {
            r6 += 13;
            t4 >>>= 13;
          }
          if (t4 >= 64) {
            r6 += 7;
            t4 >>>= 7;
          }
          if (t4 >= 8) {
            r6 += 4;
            t4 >>>= 4;
          }
          if (t4 >= 2) {
            r6 += 2;
            t4 >>>= 2;
          }
          return r6 + t4;
        }, "_countBits");
      }
      BN.prototype._zeroBits = /* @__PURE__ */ __name(function _zeroBits(w3) {
        if (w3 === 0)
          return 26;
        var t4 = w3;
        var r6 = 0;
        if ((t4 & 8191) === 0) {
          r6 += 13;
          t4 >>>= 13;
        }
        if ((t4 & 127) === 0) {
          r6 += 7;
          t4 >>>= 7;
        }
        if ((t4 & 15) === 0) {
          r6 += 4;
          t4 >>>= 4;
        }
        if ((t4 & 3) === 0) {
          r6 += 2;
          t4 >>>= 2;
        }
        if ((t4 & 1) === 0) {
          r6++;
        }
        return r6;
      }, "_zeroBits");
      BN.prototype.bitLength = /* @__PURE__ */ __name(function bitLength() {
        var w3 = this.words[this.length - 1];
        var hi = this._countBits(w3);
        return (this.length - 1) * 26 + hi;
      }, "bitLength");
      function toBitArray(num) {
        var w3 = new Array(num.bitLength());
        for (var bit = 0; bit < w3.length; bit++) {
          var off = bit / 26 | 0;
          var wbit = bit % 26;
          w3[bit] = (num.words[off] & 1 << wbit) >>> wbit;
        }
        return w3;
      }
      __name(toBitArray, "toBitArray");
      BN.prototype.zeroBits = /* @__PURE__ */ __name(function zeroBits() {
        if (this.isZero())
          return 0;
        var r6 = 0;
        for (var i6 = 0; i6 < this.length; i6++) {
          var b6 = this._zeroBits(this.words[i6]);
          r6 += b6;
          if (b6 !== 26)
            break;
        }
        return r6;
      }, "zeroBits");
      BN.prototype.byteLength = /* @__PURE__ */ __name(function byteLength() {
        return Math.ceil(this.bitLength() / 8);
      }, "byteLength");
      BN.prototype.toTwos = /* @__PURE__ */ __name(function toTwos(width) {
        if (this.negative !== 0) {
          return this.abs().inotn(width).iaddn(1);
        }
        return this.clone();
      }, "toTwos");
      BN.prototype.fromTwos = /* @__PURE__ */ __name(function fromTwos(width) {
        if (this.testn(width - 1)) {
          return this.notn(width).iaddn(1).ineg();
        }
        return this.clone();
      }, "fromTwos");
      BN.prototype.isNeg = /* @__PURE__ */ __name(function isNeg() {
        return this.negative !== 0;
      }, "isNeg");
      BN.prototype.neg = /* @__PURE__ */ __name(function neg() {
        return this.clone().ineg();
      }, "neg");
      BN.prototype.ineg = /* @__PURE__ */ __name(function ineg() {
        if (!this.isZero()) {
          this.negative ^= 1;
        }
        return this;
      }, "ineg");
      BN.prototype.iuor = /* @__PURE__ */ __name(function iuor(num) {
        while (this.length < num.length) {
          this.words[this.length++] = 0;
        }
        for (var i6 = 0; i6 < num.length; i6++) {
          this.words[i6] = this.words[i6] | num.words[i6];
        }
        return this.strip();
      }, "iuor");
      BN.prototype.ior = /* @__PURE__ */ __name(function ior(num) {
        assert((this.negative | num.negative) === 0);
        return this.iuor(num);
      }, "ior");
      BN.prototype.or = /* @__PURE__ */ __name(function or(num) {
        if (this.length > num.length)
          return this.clone().ior(num);
        return num.clone().ior(this);
      }, "or");
      BN.prototype.uor = /* @__PURE__ */ __name(function uor(num) {
        if (this.length > num.length)
          return this.clone().iuor(num);
        return num.clone().iuor(this);
      }, "uor");
      BN.prototype.iuand = /* @__PURE__ */ __name(function iuand(num) {
        var b6;
        if (this.length > num.length) {
          b6 = num;
        } else {
          b6 = this;
        }
        for (var i6 = 0; i6 < b6.length; i6++) {
          this.words[i6] = this.words[i6] & num.words[i6];
        }
        this.length = b6.length;
        return this.strip();
      }, "iuand");
      BN.prototype.iand = /* @__PURE__ */ __name(function iand(num) {
        assert((this.negative | num.negative) === 0);
        return this.iuand(num);
      }, "iand");
      BN.prototype.and = /* @__PURE__ */ __name(function and(num) {
        if (this.length > num.length)
          return this.clone().iand(num);
        return num.clone().iand(this);
      }, "and");
      BN.prototype.uand = /* @__PURE__ */ __name(function uand(num) {
        if (this.length > num.length)
          return this.clone().iuand(num);
        return num.clone().iuand(this);
      }, "uand");
      BN.prototype.iuxor = /* @__PURE__ */ __name(function iuxor(num) {
        var a6;
        var b6;
        if (this.length > num.length) {
          a6 = this;
          b6 = num;
        } else {
          a6 = num;
          b6 = this;
        }
        for (var i6 = 0; i6 < b6.length; i6++) {
          this.words[i6] = a6.words[i6] ^ b6.words[i6];
        }
        if (this !== a6) {
          for (; i6 < a6.length; i6++) {
            this.words[i6] = a6.words[i6];
          }
        }
        this.length = a6.length;
        return this.strip();
      }, "iuxor");
      BN.prototype.ixor = /* @__PURE__ */ __name(function ixor(num) {
        assert((this.negative | num.negative) === 0);
        return this.iuxor(num);
      }, "ixor");
      BN.prototype.xor = /* @__PURE__ */ __name(function xor(num) {
        if (this.length > num.length)
          return this.clone().ixor(num);
        return num.clone().ixor(this);
      }, "xor");
      BN.prototype.uxor = /* @__PURE__ */ __name(function uxor(num) {
        if (this.length > num.length)
          return this.clone().iuxor(num);
        return num.clone().iuxor(this);
      }, "uxor");
      BN.prototype.inotn = /* @__PURE__ */ __name(function inotn(width) {
        assert(typeof width === "number" && width >= 0);
        var bytesNeeded = Math.ceil(width / 26) | 0;
        var bitsLeft = width % 26;
        this._expand(bytesNeeded);
        if (bitsLeft > 0) {
          bytesNeeded--;
        }
        for (var i6 = 0; i6 < bytesNeeded; i6++) {
          this.words[i6] = ~this.words[i6] & 67108863;
        }
        if (bitsLeft > 0) {
          this.words[i6] = ~this.words[i6] & 67108863 >> 26 - bitsLeft;
        }
        return this.strip();
      }, "inotn");
      BN.prototype.notn = /* @__PURE__ */ __name(function notn(width) {
        return this.clone().inotn(width);
      }, "notn");
      BN.prototype.setn = /* @__PURE__ */ __name(function setn(bit, val) {
        assert(typeof bit === "number" && bit >= 0);
        var off = bit / 26 | 0;
        var wbit = bit % 26;
        this._expand(off + 1);
        if (val) {
          this.words[off] = this.words[off] | 1 << wbit;
        } else {
          this.words[off] = this.words[off] & ~(1 << wbit);
        }
        return this.strip();
      }, "setn");
      BN.prototype.iadd = /* @__PURE__ */ __name(function iadd(num) {
        var r6;
        if (this.negative !== 0 && num.negative === 0) {
          this.negative = 0;
          r6 = this.isub(num);
          this.negative ^= 1;
          return this._normSign();
        } else if (this.negative === 0 && num.negative !== 0) {
          num.negative = 0;
          r6 = this.isub(num);
          num.negative = 1;
          return r6._normSign();
        }
        var a6, b6;
        if (this.length > num.length) {
          a6 = this;
          b6 = num;
        } else {
          a6 = num;
          b6 = this;
        }
        var carry = 0;
        for (var i6 = 0; i6 < b6.length; i6++) {
          r6 = (a6.words[i6] | 0) + (b6.words[i6] | 0) + carry;
          this.words[i6] = r6 & 67108863;
          carry = r6 >>> 26;
        }
        for (; carry !== 0 && i6 < a6.length; i6++) {
          r6 = (a6.words[i6] | 0) + carry;
          this.words[i6] = r6 & 67108863;
          carry = r6 >>> 26;
        }
        this.length = a6.length;
        if (carry !== 0) {
          this.words[this.length] = carry;
          this.length++;
        } else if (a6 !== this) {
          for (; i6 < a6.length; i6++) {
            this.words[i6] = a6.words[i6];
          }
        }
        return this;
      }, "iadd");
      BN.prototype.add = /* @__PURE__ */ __name(function add(num) {
        var res;
        if (num.negative !== 0 && this.negative === 0) {
          num.negative = 0;
          res = this.sub(num);
          num.negative ^= 1;
          return res;
        } else if (num.negative === 0 && this.negative !== 0) {
          this.negative = 0;
          res = num.sub(this);
          this.negative = 1;
          return res;
        }
        if (this.length > num.length)
          return this.clone().iadd(num);
        return num.clone().iadd(this);
      }, "add");
      BN.prototype.isub = /* @__PURE__ */ __name(function isub(num) {
        if (num.negative !== 0) {
          num.negative = 0;
          var r6 = this.iadd(num);
          num.negative = 1;
          return r6._normSign();
        } else if (this.negative !== 0) {
          this.negative = 0;
          this.iadd(num);
          this.negative = 1;
          return this._normSign();
        }
        var cmp = this.cmp(num);
        if (cmp === 0) {
          this.negative = 0;
          this.length = 1;
          this.words[0] = 0;
          return this;
        }
        var a6, b6;
        if (cmp > 0) {
          a6 = this;
          b6 = num;
        } else {
          a6 = num;
          b6 = this;
        }
        var carry = 0;
        for (var i6 = 0; i6 < b6.length; i6++) {
          r6 = (a6.words[i6] | 0) - (b6.words[i6] | 0) + carry;
          carry = r6 >> 26;
          this.words[i6] = r6 & 67108863;
        }
        for (; carry !== 0 && i6 < a6.length; i6++) {
          r6 = (a6.words[i6] | 0) + carry;
          carry = r6 >> 26;
          this.words[i6] = r6 & 67108863;
        }
        if (carry === 0 && i6 < a6.length && a6 !== this) {
          for (; i6 < a6.length; i6++) {
            this.words[i6] = a6.words[i6];
          }
        }
        this.length = Math.max(this.length, i6);
        if (a6 !== this) {
          this.negative = 1;
        }
        return this.strip();
      }, "isub");
      BN.prototype.sub = /* @__PURE__ */ __name(function sub(num) {
        return this.clone().isub(num);
      }, "sub");
      function smallMulTo(self, num, out) {
        out.negative = num.negative ^ self.negative;
        var len = self.length + num.length | 0;
        out.length = len;
        len = len - 1 | 0;
        var a6 = self.words[0] | 0;
        var b6 = num.words[0] | 0;
        var r6 = a6 * b6;
        var lo = r6 & 67108863;
        var carry = r6 / 67108864 | 0;
        out.words[0] = lo;
        for (var k6 = 1; k6 < len; k6++) {
          var ncarry = carry >>> 26;
          var rword = carry & 67108863;
          var maxJ = Math.min(k6, num.length - 1);
          for (var j6 = Math.max(0, k6 - self.length + 1); j6 <= maxJ; j6++) {
            var i6 = k6 - j6 | 0;
            a6 = self.words[i6] | 0;
            b6 = num.words[j6] | 0;
            r6 = a6 * b6 + rword;
            ncarry += r6 / 67108864 | 0;
            rword = r6 & 67108863;
          }
          out.words[k6] = rword | 0;
          carry = ncarry | 0;
        }
        if (carry !== 0) {
          out.words[k6] = carry | 0;
        } else {
          out.length--;
        }
        return out.strip();
      }
      __name(smallMulTo, "smallMulTo");
      var comb10MulTo = /* @__PURE__ */ __name(function comb10MulTo2(self, num, out) {
        var a6 = self.words;
        var b6 = num.words;
        var o6 = out.words;
        var c6 = 0;
        var lo;
        var mid;
        var hi;
        var a0 = a6[0] | 0;
        var al0 = a0 & 8191;
        var ah0 = a0 >>> 13;
        var a1 = a6[1] | 0;
        var al1 = a1 & 8191;
        var ah1 = a1 >>> 13;
        var a22 = a6[2] | 0;
        var al2 = a22 & 8191;
        var ah2 = a22 >>> 13;
        var a32 = a6[3] | 0;
        var al3 = a32 & 8191;
        var ah3 = a32 >>> 13;
        var a42 = a6[4] | 0;
        var al4 = a42 & 8191;
        var ah4 = a42 >>> 13;
        var a52 = a6[5] | 0;
        var al5 = a52 & 8191;
        var ah5 = a52 >>> 13;
        var a62 = a6[6] | 0;
        var al6 = a62 & 8191;
        var ah6 = a62 >>> 13;
        var a7 = a6[7] | 0;
        var al7 = a7 & 8191;
        var ah7 = a7 >>> 13;
        var a8 = a6[8] | 0;
        var al8 = a8 & 8191;
        var ah8 = a8 >>> 13;
        var a9 = a6[9] | 0;
        var al9 = a9 & 8191;
        var ah9 = a9 >>> 13;
        var b0 = b6[0] | 0;
        var bl0 = b0 & 8191;
        var bh0 = b0 >>> 13;
        var b1 = b6[1] | 0;
        var bl1 = b1 & 8191;
        var bh1 = b1 >>> 13;
        var b22 = b6[2] | 0;
        var bl2 = b22 & 8191;
        var bh2 = b22 >>> 13;
        var b32 = b6[3] | 0;
        var bl3 = b32 & 8191;
        var bh3 = b32 >>> 13;
        var b42 = b6[4] | 0;
        var bl4 = b42 & 8191;
        var bh4 = b42 >>> 13;
        var b52 = b6[5] | 0;
        var bl5 = b52 & 8191;
        var bh5 = b52 >>> 13;
        var b62 = b6[6] | 0;
        var bl6 = b62 & 8191;
        var bh6 = b62 >>> 13;
        var b7 = b6[7] | 0;
        var bl7 = b7 & 8191;
        var bh7 = b7 >>> 13;
        var b8 = b6[8] | 0;
        var bl8 = b8 & 8191;
        var bh8 = b8 >>> 13;
        var b9 = b6[9] | 0;
        var bl9 = b9 & 8191;
        var bh9 = b9 >>> 13;
        out.negative = self.negative ^ num.negative;
        out.length = 19;
        lo = Math.imul(al0, bl0);
        mid = Math.imul(al0, bh0);
        mid = mid + Math.imul(ah0, bl0) | 0;
        hi = Math.imul(ah0, bh0);
        var w0 = (c6 + lo | 0) + ((mid & 8191) << 13) | 0;
        c6 = (hi + (mid >>> 13) | 0) + (w0 >>> 26) | 0;
        w0 &= 67108863;
        lo = Math.imul(al1, bl0);
        mid = Math.imul(al1, bh0);
        mid = mid + Math.imul(ah1, bl0) | 0;
        hi = Math.imul(ah1, bh0);
        lo = lo + Math.imul(al0, bl1) | 0;
        mid = mid + Math.imul(al0, bh1) | 0;
        mid = mid + Math.imul(ah0, bl1) | 0;
        hi = hi + Math.imul(ah0, bh1) | 0;
        var w1 = (c6 + lo | 0) + ((mid & 8191) << 13) | 0;
        c6 = (hi + (mid >>> 13) | 0) + (w1 >>> 26) | 0;
        w1 &= 67108863;
        lo = Math.imul(al2, bl0);
        mid = Math.imul(al2, bh0);
        mid = mid + Math.imul(ah2, bl0) | 0;
        hi = Math.imul(ah2, bh0);
        lo = lo + Math.imul(al1, bl1) | 0;
        mid = mid + Math.imul(al1, bh1) | 0;
        mid = mid + Math.imul(ah1, bl1) | 0;
        hi = hi + Math.imul(ah1, bh1) | 0;
        lo = lo + Math.imul(al0, bl2) | 0;
        mid = mid + Math.imul(al0, bh2) | 0;
        mid = mid + Math.imul(ah0, bl2) | 0;
        hi = hi + Math.imul(ah0, bh2) | 0;
        var w22 = (c6 + lo | 0) + ((mid & 8191) << 13) | 0;
        c6 = (hi + (mid >>> 13) | 0) + (w22 >>> 26) | 0;
        w22 &= 67108863;
        lo = Math.imul(al3, bl0);
        mid = Math.imul(al3, bh0);
        mid = mid + Math.imul(ah3, bl0) | 0;
        hi = Math.imul(ah3, bh0);
        lo = lo + Math.imul(al2, bl1) | 0;
        mid = mid + Math.imul(al2, bh1) | 0;
        mid = mid + Math.imul(ah2, bl1) | 0;
        hi = hi + Math.imul(ah2, bh1) | 0;
        lo = lo + Math.imul(al1, bl2) | 0;
        mid = mid + Math.imul(al1, bh2) | 0;
        mid = mid + Math.imul(ah1, bl2) | 0;
        hi = hi + Math.imul(ah1, bh2) | 0;
        lo = lo + Math.imul(al0, bl3) | 0;
        mid = mid + Math.imul(al0, bh3) | 0;
        mid = mid + Math.imul(ah0, bl3) | 0;
        hi = hi + Math.imul(ah0, bh3) | 0;
        var w3 = (c6 + lo | 0) + ((mid & 8191) << 13) | 0;
        c6 = (hi + (mid >>> 13) | 0) + (w3 >>> 26) | 0;
        w3 &= 67108863;
        lo = Math.imul(al4, bl0);
        mid = Math.imul(al4, bh0);
        mid = mid + Math.imul(ah4, bl0) | 0;
        hi = Math.imul(ah4, bh0);
        lo = lo + Math.imul(al3, bl1) | 0;
        mid = mid + Math.imul(al3, bh1) | 0;
        mid = mid + Math.imul(ah3, bl1) | 0;
        hi = hi + Math.imul(ah3, bh1) | 0;
        lo = lo + Math.imul(al2, bl2) | 0;
        mid = mid + Math.imul(al2, bh2) | 0;
        mid = mid + Math.imul(ah2, bl2) | 0;
        hi = hi + Math.imul(ah2, bh2) | 0;
        lo = lo + Math.imul(al1, bl3) | 0;
        mid = mid + Math.imul(al1, bh3) | 0;
        mid = mid + Math.imul(ah1, bl3) | 0;
        hi = hi + Math.imul(ah1, bh3) | 0;
        lo = lo + Math.imul(al0, bl4) | 0;
        mid = mid + Math.imul(al0, bh4) | 0;
        mid = mid + Math.imul(ah0, bl4) | 0;
        hi = hi + Math.imul(ah0, bh4) | 0;
        var w4 = (c6 + lo | 0) + ((mid & 8191) << 13) | 0;
        c6 = (hi + (mid >>> 13) | 0) + (w4 >>> 26) | 0;
        w4 &= 67108863;
        lo = Math.imul(al5, bl0);
        mid = Math.imul(al5, bh0);
        mid = mid + Math.imul(ah5, bl0) | 0;
        hi = Math.imul(ah5, bh0);
        lo = lo + Math.imul(al4, bl1) | 0;
        mid = mid + Math.imul(al4, bh1) | 0;
        mid = mid + Math.imul(ah4, bl1) | 0;
        hi = hi + Math.imul(ah4, bh1) | 0;
        lo = lo + Math.imul(al3, bl2) | 0;
        mid = mid + Math.imul(al3, bh2) | 0;
        mid = mid + Math.imul(ah3, bl2) | 0;
        hi = hi + Math.imul(ah3, bh2) | 0;
        lo = lo + Math.imul(al2, bl3) | 0;
        mid = mid + Math.imul(al2, bh3) | 0;
        mid = mid + Math.imul(ah2, bl3) | 0;
        hi = hi + Math.imul(ah2, bh3) | 0;
        lo = lo + Math.imul(al1, bl4) | 0;
        mid = mid + Math.imul(al1, bh4) | 0;
        mid = mid + Math.imul(ah1, bl4) | 0;
        hi = hi + Math.imul(ah1, bh4) | 0;
        lo = lo + Math.imul(al0, bl5) | 0;
        mid = mid + Math.imul(al0, bh5) | 0;
        mid = mid + Math.imul(ah0, bl5) | 0;
        hi = hi + Math.imul(ah0, bh5) | 0;
        var w5 = (c6 + lo | 0) + ((mid & 8191) << 13) | 0;
        c6 = (hi + (mid >>> 13) | 0) + (w5 >>> 26) | 0;
        w5 &= 67108863;
        lo = Math.imul(al6, bl0);
        mid = Math.imul(al6, bh0);
        mid = mid + Math.imul(ah6, bl0) | 0;
        hi = Math.imul(ah6, bh0);
        lo = lo + Math.imul(al5, bl1) | 0;
        mid = mid + Math.imul(al5, bh1) | 0;
        mid = mid + Math.imul(ah5, bl1) | 0;
        hi = hi + Math.imul(ah5, bh1) | 0;
        lo = lo + Math.imul(al4, bl2) | 0;
        mid = mid + Math.imul(al4, bh2) | 0;
        mid = mid + Math.imul(ah4, bl2) | 0;
        hi = hi + Math.imul(ah4, bh2) | 0;
        lo = lo + Math.imul(al3, bl3) | 0;
        mid = mid + Math.imul(al3, bh3) | 0;
        mid = mid + Math.imul(ah3, bl3) | 0;
        hi = hi + Math.imul(ah3, bh3) | 0;
        lo = lo + Math.imul(al2, bl4) | 0;
        mid = mid + Math.imul(al2, bh4) | 0;
        mid = mid + Math.imul(ah2, bl4) | 0;
        hi = hi + Math.imul(ah2, bh4) | 0;
        lo = lo + Math.imul(al1, bl5) | 0;
        mid = mid + Math.imul(al1, bh5) | 0;
        mid = mid + Math.imul(ah1, bl5) | 0;
        hi = hi + Math.imul(ah1, bh5) | 0;
        lo = lo + Math.imul(al0, bl6) | 0;
        mid = mid + Math.imul(al0, bh6) | 0;
        mid = mid + Math.imul(ah0, bl6) | 0;
        hi = hi + Math.imul(ah0, bh6) | 0;
        var w6 = (c6 + lo | 0) + ((mid & 8191) << 13) | 0;
        c6 = (hi + (mid >>> 13) | 0) + (w6 >>> 26) | 0;
        w6 &= 67108863;
        lo = Math.imul(al7, bl0);
        mid = Math.imul(al7, bh0);
        mid = mid + Math.imul(ah7, bl0) | 0;
        hi = Math.imul(ah7, bh0);
        lo = lo + Math.imul(al6, bl1) | 0;
        mid = mid + Math.imul(al6, bh1) | 0;
        mid = mid + Math.imul(ah6, bl1) | 0;
        hi = hi + Math.imul(ah6, bh1) | 0;
        lo = lo + Math.imul(al5, bl2) | 0;
        mid = mid + Math.imul(al5, bh2) | 0;
        mid = mid + Math.imul(ah5, bl2) | 0;
        hi = hi + Math.imul(ah5, bh2) | 0;
        lo = lo + Math.imul(al4, bl3) | 0;
        mid = mid + Math.imul(al4, bh3) | 0;
        mid = mid + Math.imul(ah4, bl3) | 0;
        hi = hi + Math.imul(ah4, bh3) | 0;
        lo = lo + Math.imul(al3, bl4) | 0;
        mid = mid + Math.imul(al3, bh4) | 0;
        mid = mid + Math.imul(ah3, bl4) | 0;
        hi = hi + Math.imul(ah3, bh4) | 0;
        lo = lo + Math.imul(al2, bl5) | 0;
        mid = mid + Math.imul(al2, bh5) | 0;
        mid = mid + Math.imul(ah2, bl5) | 0;
        hi = hi + Math.imul(ah2, bh5) | 0;
        lo = lo + Math.imul(al1, bl6) | 0;
        mid = mid + Math.imul(al1, bh6) | 0;
        mid = mid + Math.imul(ah1, bl6) | 0;
        hi = hi + Math.imul(ah1, bh6) | 0;
        lo = lo + Math.imul(al0, bl7) | 0;
        mid = mid + Math.imul(al0, bh7) | 0;
        mid = mid + Math.imul(ah0, bl7) | 0;
        hi = hi + Math.imul(ah0, bh7) | 0;
        var w7 = (c6 + lo | 0) + ((mid & 8191) << 13) | 0;
        c6 = (hi + (mid >>> 13) | 0) + (w7 >>> 26) | 0;
        w7 &= 67108863;
        lo = Math.imul(al8, bl0);
        mid = Math.imul(al8, bh0);
        mid = mid + Math.imul(ah8, bl0) | 0;
        hi = Math.imul(ah8, bh0);
        lo = lo + Math.imul(al7, bl1) | 0;
        mid = mid + Math.imul(al7, bh1) | 0;
        mid = mid + Math.imul(ah7, bl1) | 0;
        hi = hi + Math.imul(ah7, bh1) | 0;
        lo = lo + Math.imul(al6, bl2) | 0;
        mid = mid + Math.imul(al6, bh2) | 0;
        mid = mid + Math.imul(ah6, bl2) | 0;
        hi = hi + Math.imul(ah6, bh2) | 0;
        lo = lo + Math.imul(al5, bl3) | 0;
        mid = mid + Math.imul(al5, bh3) | 0;
        mid = mid + Math.imul(ah5, bl3) | 0;
        hi = hi + Math.imul(ah5, bh3) | 0;
        lo = lo + Math.imul(al4, bl4) | 0;
        mid = mid + Math.imul(al4, bh4) | 0;
        mid = mid + Math.imul(ah4, bl4) | 0;
        hi = hi + Math.imul(ah4, bh4) | 0;
        lo = lo + Math.imul(al3, bl5) | 0;
        mid = mid + Math.imul(al3, bh5) | 0;
        mid = mid + Math.imul(ah3, bl5) | 0;
        hi = hi + Math.imul(ah3, bh5) | 0;
        lo = lo + Math.imul(al2, bl6) | 0;
        mid = mid + Math.imul(al2, bh6) | 0;
        mid = mid + Math.imul(ah2, bl6) | 0;
        hi = hi + Math.imul(ah2, bh6) | 0;
        lo = lo + Math.imul(al1, bl7) | 0;
        mid = mid + Math.imul(al1, bh7) | 0;
        mid = mid + Math.imul(ah1, bl7) | 0;
        hi = hi + Math.imul(ah1, bh7) | 0;
        lo = lo + Math.imul(al0, bl8) | 0;
        mid = mid + Math.imul(al0, bh8) | 0;
        mid = mid + Math.imul(ah0, bl8) | 0;
        hi = hi + Math.imul(ah0, bh8) | 0;
        var w8 = (c6 + lo | 0) + ((mid & 8191) << 13) | 0;
        c6 = (hi + (mid >>> 13) | 0) + (w8 >>> 26) | 0;
        w8 &= 67108863;
        lo = Math.imul(al9, bl0);
        mid = Math.imul(al9, bh0);
        mid = mid + Math.imul(ah9, bl0) | 0;
        hi = Math.imul(ah9, bh0);
        lo = lo + Math.imul(al8, bl1) | 0;
        mid = mid + Math.imul(al8, bh1) | 0;
        mid = mid + Math.imul(ah8, bl1) | 0;
        hi = hi + Math.imul(ah8, bh1) | 0;
        lo = lo + Math.imul(al7, bl2) | 0;
        mid = mid + Math.imul(al7, bh2) | 0;
        mid = mid + Math.imul(ah7, bl2) | 0;
        hi = hi + Math.imul(ah7, bh2) | 0;
        lo = lo + Math.imul(al6, bl3) | 0;
        mid = mid + Math.imul(al6, bh3) | 0;
        mid = mid + Math.imul(ah6, bl3) | 0;
        hi = hi + Math.imul(ah6, bh3) | 0;
        lo = lo + Math.imul(al5, bl4) | 0;
        mid = mid + Math.imul(al5, bh4) | 0;
        mid = mid + Math.imul(ah5, bl4) | 0;
        hi = hi + Math.imul(ah5, bh4) | 0;
        lo = lo + Math.imul(al4, bl5) | 0;
        mid = mid + Math.imul(al4, bh5) | 0;
        mid = mid + Math.imul(ah4, bl5) | 0;
        hi = hi + Math.imul(ah4, bh5) | 0;
        lo = lo + Math.imul(al3, bl6) | 0;
        mid = mid + Math.imul(al3, bh6) | 0;
        mid = mid + Math.imul(ah3, bl6) | 0;
        hi = hi + Math.imul(ah3, bh6) | 0;
        lo = lo + Math.imul(al2, bl7) | 0;
        mid = mid + Math.imul(al2, bh7) | 0;
        mid = mid + Math.imul(ah2, bl7) | 0;
        hi = hi + Math.imul(ah2, bh7) | 0;
        lo = lo + Math.imul(al1, bl8) | 0;
        mid = mid + Math.imul(al1, bh8) | 0;
        mid = mid + Math.imul(ah1, bl8) | 0;
        hi = hi + Math.imul(ah1, bh8) | 0;
        lo = lo + Math.imul(al0, bl9) | 0;
        mid = mid + Math.imul(al0, bh9) | 0;
        mid = mid + Math.imul(ah0, bl9) | 0;
        hi = hi + Math.imul(ah0, bh9) | 0;
        var w9 = (c6 + lo | 0) + ((mid & 8191) << 13) | 0;
        c6 = (hi + (mid >>> 13) | 0) + (w9 >>> 26) | 0;
        w9 &= 67108863;
        lo = Math.imul(al9, bl1);
        mid = Math.imul(al9, bh1);
        mid = mid + Math.imul(ah9, bl1) | 0;
        hi = Math.imul(ah9, bh1);
        lo = lo + Math.imul(al8, bl2) | 0;
        mid = mid + Math.imul(al8, bh2) | 0;
        mid = mid + Math.imul(ah8, bl2) | 0;
        hi = hi + Math.imul(ah8, bh2) | 0;
        lo = lo + Math.imul(al7, bl3) | 0;
        mid = mid + Math.imul(al7, bh3) | 0;
        mid = mid + Math.imul(ah7, bl3) | 0;
        hi = hi + Math.imul(ah7, bh3) | 0;
        lo = lo + Math.imul(al6, bl4) | 0;
        mid = mid + Math.imul(al6, bh4) | 0;
        mid = mid + Math.imul(ah6, bl4) | 0;
        hi = hi + Math.imul(ah6, bh4) | 0;
        lo = lo + Math.imul(al5, bl5) | 0;
        mid = mid + Math.imul(al5, bh5) | 0;
        mid = mid + Math.imul(ah5, bl5) | 0;
        hi = hi + Math.imul(ah5, bh5) | 0;
        lo = lo + Math.imul(al4, bl6) | 0;
        mid = mid + Math.imul(al4, bh6) | 0;
        mid = mid + Math.imul(ah4, bl6) | 0;
        hi = hi + Math.imul(ah4, bh6) | 0;
        lo = lo + Math.imul(al3, bl7) | 0;
        mid = mid + Math.imul(al3, bh7) | 0;
        mid = mid + Math.imul(ah3, bl7) | 0;
        hi = hi + Math.imul(ah3, bh7) | 0;
        lo = lo + Math.imul(al2, bl8) | 0;
        mid = mid + Math.imul(al2, bh8) | 0;
        mid = mid + Math.imul(ah2, bl8) | 0;
        hi = hi + Math.imul(ah2, bh8) | 0;
        lo = lo + Math.imul(al1, bl9) | 0;
        mid = mid + Math.imul(al1, bh9) | 0;
        mid = mid + Math.imul(ah1, bl9) | 0;
        hi = hi + Math.imul(ah1, bh9) | 0;
        var w10 = (c6 + lo | 0) + ((mid & 8191) << 13) | 0;
        c6 = (hi + (mid >>> 13) | 0) + (w10 >>> 26) | 0;
        w10 &= 67108863;
        lo = Math.imul(al9, bl2);
        mid = Math.imul(al9, bh2);
        mid = mid + Math.imul(ah9, bl2) | 0;
        hi = Math.imul(ah9, bh2);
        lo = lo + Math.imul(al8, bl3) | 0;
        mid = mid + Math.imul(al8, bh3) | 0;
        mid = mid + Math.imul(ah8, bl3) | 0;
        hi = hi + Math.imul(ah8, bh3) | 0;
        lo = lo + Math.imul(al7, bl4) | 0;
        mid = mid + Math.imul(al7, bh4) | 0;
        mid = mid + Math.imul(ah7, bl4) | 0;
        hi = hi + Math.imul(ah7, bh4) | 0;
        lo = lo + Math.imul(al6, bl5) | 0;
        mid = mid + Math.imul(al6, bh5) | 0;
        mid = mid + Math.imul(ah6, bl5) | 0;
        hi = hi + Math.imul(ah6, bh5) | 0;
        lo = lo + Math.imul(al5, bl6) | 0;
        mid = mid + Math.imul(al5, bh6) | 0;
        mid = mid + Math.imul(ah5, bl6) | 0;
        hi = hi + Math.imul(ah5, bh6) | 0;
        lo = lo + Math.imul(al4, bl7) | 0;
        mid = mid + Math.imul(al4, bh7) | 0;
        mid = mid + Math.imul(ah4, bl7) | 0;
        hi = hi + Math.imul(ah4, bh7) | 0;
        lo = lo + Math.imul(al3, bl8) | 0;
        mid = mid + Math.imul(al3, bh8) | 0;
        mid = mid + Math.imul(ah3, bl8) | 0;
        hi = hi + Math.imul(ah3, bh8) | 0;
        lo = lo + Math.imul(al2, bl9) | 0;
        mid = mid + Math.imul(al2, bh9) | 0;
        mid = mid + Math.imul(ah2, bl9) | 0;
        hi = hi + Math.imul(ah2, bh9) | 0;
        var w11 = (c6 + lo | 0) + ((mid & 8191) << 13) | 0;
        c6 = (hi + (mid >>> 13) | 0) + (w11 >>> 26) | 0;
        w11 &= 67108863;
        lo = Math.imul(al9, bl3);
        mid = Math.imul(al9, bh3);
        mid = mid + Math.imul(ah9, bl3) | 0;
        hi = Math.imul(ah9, bh3);
        lo = lo + Math.imul(al8, bl4) | 0;
        mid = mid + Math.imul(al8, bh4) | 0;
        mid = mid + Math.imul(ah8, bl4) | 0;
        hi = hi + Math.imul(ah8, bh4) | 0;
        lo = lo + Math.imul(al7, bl5) | 0;
        mid = mid + Math.imul(al7, bh5) | 0;
        mid = mid + Math.imul(ah7, bl5) | 0;
        hi = hi + Math.imul(ah7, bh5) | 0;
        lo = lo + Math.imul(al6, bl6) | 0;
        mid = mid + Math.imul(al6, bh6) | 0;
        mid = mid + Math.imul(ah6, bl6) | 0;
        hi = hi + Math.imul(ah6, bh6) | 0;
        lo = lo + Math.imul(al5, bl7) | 0;
        mid = mid + Math.imul(al5, bh7) | 0;
        mid = mid + Math.imul(ah5, bl7) | 0;
        hi = hi + Math.imul(ah5, bh7) | 0;
        lo = lo + Math.imul(al4, bl8) | 0;
        mid = mid + Math.imul(al4, bh8) | 0;
        mid = mid + Math.imul(ah4, bl8) | 0;
        hi = hi + Math.imul(ah4, bh8) | 0;
        lo = lo + Math.imul(al3, bl9) | 0;
        mid = mid + Math.imul(al3, bh9) | 0;
        mid = mid + Math.imul(ah3, bl9) | 0;
        hi = hi + Math.imul(ah3, bh9) | 0;
        var w12 = (c6 + lo | 0) + ((mid & 8191) << 13) | 0;
        c6 = (hi + (mid >>> 13) | 0) + (w12 >>> 26) | 0;
        w12 &= 67108863;
        lo = Math.imul(al9, bl4);
        mid = Math.imul(al9, bh4);
        mid = mid + Math.imul(ah9, bl4) | 0;
        hi = Math.imul(ah9, bh4);
        lo = lo + Math.imul(al8, bl5) | 0;
        mid = mid + Math.imul(al8, bh5) | 0;
        mid = mid + Math.imul(ah8, bl5) | 0;
        hi = hi + Math.imul(ah8, bh5) | 0;
        lo = lo + Math.imul(al7, bl6) | 0;
        mid = mid + Math.imul(al7, bh6) | 0;
        mid = mid + Math.imul(ah7, bl6) | 0;
        hi = hi + Math.imul(ah7, bh6) | 0;
        lo = lo + Math.imul(al6, bl7) | 0;
        mid = mid + Math.imul(al6, bh7) | 0;
        mid = mid + Math.imul(ah6, bl7) | 0;
        hi = hi + Math.imul(ah6, bh7) | 0;
        lo = lo + Math.imul(al5, bl8) | 0;
        mid = mid + Math.imul(al5, bh8) | 0;
        mid = mid + Math.imul(ah5, bl8) | 0;
        hi = hi + Math.imul(ah5, bh8) | 0;
        lo = lo + Math.imul(al4, bl9) | 0;
        mid = mid + Math.imul(al4, bh9) | 0;
        mid = mid + Math.imul(ah4, bl9) | 0;
        hi = hi + Math.imul(ah4, bh9) | 0;
        var w13 = (c6 + lo | 0) + ((mid & 8191) << 13) | 0;
        c6 = (hi + (mid >>> 13) | 0) + (w13 >>> 26) | 0;
        w13 &= 67108863;
        lo = Math.imul(al9, bl5);
        mid = Math.imul(al9, bh5);
        mid = mid + Math.imul(ah9, bl5) | 0;
        hi = Math.imul(ah9, bh5);
        lo = lo + Math.imul(al8, bl6) | 0;
        mid = mid + Math.imul(al8, bh6) | 0;
        mid = mid + Math.imul(ah8, bl6) | 0;
        hi = hi + Math.imul(ah8, bh6) | 0;
        lo = lo + Math.imul(al7, bl7) | 0;
        mid = mid + Math.imul(al7, bh7) | 0;
        mid = mid + Math.imul(ah7, bl7) | 0;
        hi = hi + Math.imul(ah7, bh7) | 0;
        lo = lo + Math.imul(al6, bl8) | 0;
        mid = mid + Math.imul(al6, bh8) | 0;
        mid = mid + Math.imul(ah6, bl8) | 0;
        hi = hi + Math.imul(ah6, bh8) | 0;
        lo = lo + Math.imul(al5, bl9) | 0;
        mid = mid + Math.imul(al5, bh9) | 0;
        mid = mid + Math.imul(ah5, bl9) | 0;
        hi = hi + Math.imul(ah5, bh9) | 0;
        var w14 = (c6 + lo | 0) + ((mid & 8191) << 13) | 0;
        c6 = (hi + (mid >>> 13) | 0) + (w14 >>> 26) | 0;
        w14 &= 67108863;
        lo = Math.imul(al9, bl6);
        mid = Math.imul(al9, bh6);
        mid = mid + Math.imul(ah9, bl6) | 0;
        hi = Math.imul(ah9, bh6);
        lo = lo + Math.imul(al8, bl7) | 0;
        mid = mid + Math.imul(al8, bh7) | 0;
        mid = mid + Math.imul(ah8, bl7) | 0;
        hi = hi + Math.imul(ah8, bh7) | 0;
        lo = lo + Math.imul(al7, bl8) | 0;
        mid = mid + Math.imul(al7, bh8) | 0;
        mid = mid + Math.imul(ah7, bl8) | 0;
        hi = hi + Math.imul(ah7, bh8) | 0;
        lo = lo + Math.imul(al6, bl9) | 0;
        mid = mid + Math.imul(al6, bh9) | 0;
        mid = mid + Math.imul(ah6, bl9) | 0;
        hi = hi + Math.imul(ah6, bh9) | 0;
        var w15 = (c6 + lo | 0) + ((mid & 8191) << 13) | 0;
        c6 = (hi + (mid >>> 13) | 0) + (w15 >>> 26) | 0;
        w15 &= 67108863;
        lo = Math.imul(al9, bl7);
        mid = Math.imul(al9, bh7);
        mid = mid + Math.imul(ah9, bl7) | 0;
        hi = Math.imul(ah9, bh7);
        lo = lo + Math.imul(al8, bl8) | 0;
        mid = mid + Math.imul(al8, bh8) | 0;
        mid = mid + Math.imul(ah8, bl8) | 0;
        hi = hi + Math.imul(ah8, bh8) | 0;
        lo = lo + Math.imul(al7, bl9) | 0;
        mid = mid + Math.imul(al7, bh9) | 0;
        mid = mid + Math.imul(ah7, bl9) | 0;
        hi = hi + Math.imul(ah7, bh9) | 0;
        var w16 = (c6 + lo | 0) + ((mid & 8191) << 13) | 0;
        c6 = (hi + (mid >>> 13) | 0) + (w16 >>> 26) | 0;
        w16 &= 67108863;
        lo = Math.imul(al9, bl8);
        mid = Math.imul(al9, bh8);
        mid = mid + Math.imul(ah9, bl8) | 0;
        hi = Math.imul(ah9, bh8);
        lo = lo + Math.imul(al8, bl9) | 0;
        mid = mid + Math.imul(al8, bh9) | 0;
        mid = mid + Math.imul(ah8, bl9) | 0;
        hi = hi + Math.imul(ah8, bh9) | 0;
        var w17 = (c6 + lo | 0) + ((mid & 8191) << 13) | 0;
        c6 = (hi + (mid >>> 13) | 0) + (w17 >>> 26) | 0;
        w17 &= 67108863;
        lo = Math.imul(al9, bl9);
        mid = Math.imul(al9, bh9);
        mid = mid + Math.imul(ah9, bl9) | 0;
        hi = Math.imul(ah9, bh9);
        var w18 = (c6 + lo | 0) + ((mid & 8191) << 13) | 0;
        c6 = (hi + (mid >>> 13) | 0) + (w18 >>> 26) | 0;
        w18 &= 67108863;
        o6[0] = w0;
        o6[1] = w1;
        o6[2] = w22;
        o6[3] = w3;
        o6[4] = w4;
        o6[5] = w5;
        o6[6] = w6;
        o6[7] = w7;
        o6[8] = w8;
        o6[9] = w9;
        o6[10] = w10;
        o6[11] = w11;
        o6[12] = w12;
        o6[13] = w13;
        o6[14] = w14;
        o6[15] = w15;
        o6[16] = w16;
        o6[17] = w17;
        o6[18] = w18;
        if (c6 !== 0) {
          o6[19] = c6;
          out.length++;
        }
        return out;
      }, "comb10MulTo");
      if (!Math.imul) {
        comb10MulTo = smallMulTo;
      }
      function bigMulTo(self, num, out) {
        out.negative = num.negative ^ self.negative;
        out.length = self.length + num.length;
        var carry = 0;
        var hncarry = 0;
        for (var k6 = 0; k6 < out.length - 1; k6++) {
          var ncarry = hncarry;
          hncarry = 0;
          var rword = carry & 67108863;
          var maxJ = Math.min(k6, num.length - 1);
          for (var j6 = Math.max(0, k6 - self.length + 1); j6 <= maxJ; j6++) {
            var i6 = k6 - j6;
            var a6 = self.words[i6] | 0;
            var b6 = num.words[j6] | 0;
            var r6 = a6 * b6;
            var lo = r6 & 67108863;
            ncarry = ncarry + (r6 / 67108864 | 0) | 0;
            lo = lo + rword | 0;
            rword = lo & 67108863;
            ncarry = ncarry + (lo >>> 26) | 0;
            hncarry += ncarry >>> 26;
            ncarry &= 67108863;
          }
          out.words[k6] = rword;
          carry = ncarry;
          ncarry = hncarry;
        }
        if (carry !== 0) {
          out.words[k6] = carry;
        } else {
          out.length--;
        }
        return out.strip();
      }
      __name(bigMulTo, "bigMulTo");
      function jumboMulTo(self, num, out) {
        var fftm = new FFTM();
        return fftm.mulp(self, num, out);
      }
      __name(jumboMulTo, "jumboMulTo");
      BN.prototype.mulTo = /* @__PURE__ */ __name(function mulTo(num, out) {
        var res;
        var len = this.length + num.length;
        if (this.length === 10 && num.length === 10) {
          res = comb10MulTo(this, num, out);
        } else if (len < 63) {
          res = smallMulTo(this, num, out);
        } else if (len < 1024) {
          res = bigMulTo(this, num, out);
        } else {
          res = jumboMulTo(this, num, out);
        }
        return res;
      }, "mulTo");
      function FFTM(x3, y2) {
        this.x = x3;
        this.y = y2;
      }
      __name(FFTM, "FFTM");
      FFTM.prototype.makeRBT = /* @__PURE__ */ __name(function makeRBT(N) {
        var t4 = new Array(N);
        var l6 = BN.prototype._countBits(N) - 1;
        for (var i6 = 0; i6 < N; i6++) {
          t4[i6] = this.revBin(i6, l6, N);
        }
        return t4;
      }, "makeRBT");
      FFTM.prototype.revBin = /* @__PURE__ */ __name(function revBin(x3, l6, N) {
        if (x3 === 0 || x3 === N - 1)
          return x3;
        var rb = 0;
        for (var i6 = 0; i6 < l6; i6++) {
          rb |= (x3 & 1) << l6 - i6 - 1;
          x3 >>= 1;
        }
        return rb;
      }, "revBin");
      FFTM.prototype.permute = /* @__PURE__ */ __name(function permute(rbt, rws, iws, rtws, itws, N) {
        for (var i6 = 0; i6 < N; i6++) {
          rtws[i6] = rws[rbt[i6]];
          itws[i6] = iws[rbt[i6]];
        }
      }, "permute");
      FFTM.prototype.transform = /* @__PURE__ */ __name(function transform(rws, iws, rtws, itws, N, rbt) {
        this.permute(rbt, rws, iws, rtws, itws, N);
        for (var s6 = 1; s6 < N; s6 <<= 1) {
          var l6 = s6 << 1;
          var rtwdf = Math.cos(2 * Math.PI / l6);
          var itwdf = Math.sin(2 * Math.PI / l6);
          for (var p6 = 0; p6 < N; p6 += l6) {
            var rtwdf_ = rtwdf;
            var itwdf_ = itwdf;
            for (var j6 = 0; j6 < s6; j6++) {
              var re = rtws[p6 + j6];
              var ie = itws[p6 + j6];
              var ro = rtws[p6 + j6 + s6];
              var io = itws[p6 + j6 + s6];
              var rx = rtwdf_ * ro - itwdf_ * io;
              io = rtwdf_ * io + itwdf_ * ro;
              ro = rx;
              rtws[p6 + j6] = re + ro;
              itws[p6 + j6] = ie + io;
              rtws[p6 + j6 + s6] = re - ro;
              itws[p6 + j6 + s6] = ie - io;
              if (j6 !== l6) {
                rx = rtwdf * rtwdf_ - itwdf * itwdf_;
                itwdf_ = rtwdf * itwdf_ + itwdf * rtwdf_;
                rtwdf_ = rx;
              }
            }
          }
        }
      }, "transform");
      FFTM.prototype.guessLen13b = /* @__PURE__ */ __name(function guessLen13b(n6, m6) {
        var N = Math.max(m6, n6) | 1;
        var odd = N & 1;
        var i6 = 0;
        for (N = N / 2 | 0; N; N = N >>> 1) {
          i6++;
        }
        return 1 << i6 + 1 + odd;
      }, "guessLen13b");
      FFTM.prototype.conjugate = /* @__PURE__ */ __name(function conjugate(rws, iws, N) {
        if (N <= 1)
          return;
        for (var i6 = 0; i6 < N / 2; i6++) {
          var t4 = rws[i6];
          rws[i6] = rws[N - i6 - 1];
          rws[N - i6 - 1] = t4;
          t4 = iws[i6];
          iws[i6] = -iws[N - i6 - 1];
          iws[N - i6 - 1] = -t4;
        }
      }, "conjugate");
      FFTM.prototype.normalize13b = /* @__PURE__ */ __name(function normalize13b(ws, N) {
        var carry = 0;
        for (var i6 = 0; i6 < N / 2; i6++) {
          var w3 = Math.round(ws[2 * i6 + 1] / N) * 8192 + Math.round(ws[2 * i6] / N) + carry;
          ws[i6] = w3 & 67108863;
          if (w3 < 67108864) {
            carry = 0;
          } else {
            carry = w3 / 67108864 | 0;
          }
        }
        return ws;
      }, "normalize13b");
      FFTM.prototype.convert13b = /* @__PURE__ */ __name(function convert13b(ws, len, rws, N) {
        var carry = 0;
        for (var i6 = 0; i6 < len; i6++) {
          carry = carry + (ws[i6] | 0);
          rws[2 * i6] = carry & 8191;
          carry = carry >>> 13;
          rws[2 * i6 + 1] = carry & 8191;
          carry = carry >>> 13;
        }
        for (i6 = 2 * len; i6 < N; ++i6) {
          rws[i6] = 0;
        }
        assert(carry === 0);
        assert((carry & ~8191) === 0);
      }, "convert13b");
      FFTM.prototype.stub = /* @__PURE__ */ __name(function stub(N) {
        var ph = new Array(N);
        for (var i6 = 0; i6 < N; i6++) {
          ph[i6] = 0;
        }
        return ph;
      }, "stub");
      FFTM.prototype.mulp = /* @__PURE__ */ __name(function mulp(x3, y2, out) {
        var N = 2 * this.guessLen13b(x3.length, y2.length);
        var rbt = this.makeRBT(N);
        var _ = this.stub(N);
        var rws = new Array(N);
        var rwst = new Array(N);
        var iwst = new Array(N);
        var nrws = new Array(N);
        var nrwst = new Array(N);
        var niwst = new Array(N);
        var rmws = out.words;
        rmws.length = N;
        this.convert13b(x3.words, x3.length, rws, N);
        this.convert13b(y2.words, y2.length, nrws, N);
        this.transform(rws, _, rwst, iwst, N, rbt);
        this.transform(nrws, _, nrwst, niwst, N, rbt);
        for (var i6 = 0; i6 < N; i6++) {
          var rx = rwst[i6] * nrwst[i6] - iwst[i6] * niwst[i6];
          iwst[i6] = rwst[i6] * niwst[i6] + iwst[i6] * nrwst[i6];
          rwst[i6] = rx;
        }
        this.conjugate(rwst, iwst, N);
        this.transform(rwst, iwst, rmws, _, N, rbt);
        this.conjugate(rmws, _, N);
        this.normalize13b(rmws, N);
        out.negative = x3.negative ^ y2.negative;
        out.length = x3.length + y2.length;
        return out.strip();
      }, "mulp");
      BN.prototype.mul = /* @__PURE__ */ __name(function mul(num) {
        var out = new BN(null);
        out.words = new Array(this.length + num.length);
        return this.mulTo(num, out);
      }, "mul");
      BN.prototype.mulf = /* @__PURE__ */ __name(function mulf(num) {
        var out = new BN(null);
        out.words = new Array(this.length + num.length);
        return jumboMulTo(this, num, out);
      }, "mulf");
      BN.prototype.imul = /* @__PURE__ */ __name(function imul(num) {
        return this.clone().mulTo(num, this);
      }, "imul");
      BN.prototype.imuln = /* @__PURE__ */ __name(function imuln(num) {
        assert(typeof num === "number");
        assert(num < 67108864);
        var carry = 0;
        for (var i6 = 0; i6 < this.length; i6++) {
          var w3 = (this.words[i6] | 0) * num;
          var lo = (w3 & 67108863) + (carry & 67108863);
          carry >>= 26;
          carry += w3 / 67108864 | 0;
          carry += lo >>> 26;
          this.words[i6] = lo & 67108863;
        }
        if (carry !== 0) {
          this.words[i6] = carry;
          this.length++;
        }
        return this;
      }, "imuln");
      BN.prototype.muln = /* @__PURE__ */ __name(function muln(num) {
        return this.clone().imuln(num);
      }, "muln");
      BN.prototype.sqr = /* @__PURE__ */ __name(function sqr() {
        return this.mul(this);
      }, "sqr");
      BN.prototype.isqr = /* @__PURE__ */ __name(function isqr() {
        return this.imul(this.clone());
      }, "isqr");
      BN.prototype.pow = /* @__PURE__ */ __name(function pow(num) {
        var w3 = toBitArray(num);
        if (w3.length === 0)
          return new BN(1);
        var res = this;
        for (var i6 = 0; i6 < w3.length; i6++, res = res.sqr()) {
          if (w3[i6] !== 0)
            break;
        }
        if (++i6 < w3.length) {
          for (var q6 = res.sqr(); i6 < w3.length; i6++, q6 = q6.sqr()) {
            if (w3[i6] === 0)
              continue;
            res = res.mul(q6);
          }
        }
        return res;
      }, "pow");
      BN.prototype.iushln = /* @__PURE__ */ __name(function iushln(bits) {
        assert(typeof bits === "number" && bits >= 0);
        var r6 = bits % 26;
        var s6 = (bits - r6) / 26;
        var carryMask = 67108863 >>> 26 - r6 << 26 - r6;
        var i6;
        if (r6 !== 0) {
          var carry = 0;
          for (i6 = 0; i6 < this.length; i6++) {
            var newCarry = this.words[i6] & carryMask;
            var c6 = (this.words[i6] | 0) - newCarry << r6;
            this.words[i6] = c6 | carry;
            carry = newCarry >>> 26 - r6;
          }
          if (carry) {
            this.words[i6] = carry;
            this.length++;
          }
        }
        if (s6 !== 0) {
          for (i6 = this.length - 1; i6 >= 0; i6--) {
            this.words[i6 + s6] = this.words[i6];
          }
          for (i6 = 0; i6 < s6; i6++) {
            this.words[i6] = 0;
          }
          this.length += s6;
        }
        return this.strip();
      }, "iushln");
      BN.prototype.ishln = /* @__PURE__ */ __name(function ishln(bits) {
        assert(this.negative === 0);
        return this.iushln(bits);
      }, "ishln");
      BN.prototype.iushrn = /* @__PURE__ */ __name(function iushrn(bits, hint, extended) {
        assert(typeof bits === "number" && bits >= 0);
        var h6;
        if (hint) {
          h6 = (hint - hint % 26) / 26;
        } else {
          h6 = 0;
        }
        var r6 = bits % 26;
        var s6 = Math.min((bits - r6) / 26, this.length);
        var mask = 67108863 ^ 67108863 >>> r6 << r6;
        var maskedWords = extended;
        h6 -= s6;
        h6 = Math.max(0, h6);
        if (maskedWords) {
          for (var i6 = 0; i6 < s6; i6++) {
            maskedWords.words[i6] = this.words[i6];
          }
          maskedWords.length = s6;
        }
        if (s6 === 0) {
        } else if (this.length > s6) {
          this.length -= s6;
          for (i6 = 0; i6 < this.length; i6++) {
            this.words[i6] = this.words[i6 + s6];
          }
        } else {
          this.words[0] = 0;
          this.length = 1;
        }
        var carry = 0;
        for (i6 = this.length - 1; i6 >= 0 && (carry !== 0 || i6 >= h6); i6--) {
          var word = this.words[i6] | 0;
          this.words[i6] = carry << 26 - r6 | word >>> r6;
          carry = word & mask;
        }
        if (maskedWords && carry !== 0) {
          maskedWords.words[maskedWords.length++] = carry;
        }
        if (this.length === 0) {
          this.words[0] = 0;
          this.length = 1;
        }
        return this.strip();
      }, "iushrn");
      BN.prototype.ishrn = /* @__PURE__ */ __name(function ishrn(bits, hint, extended) {
        assert(this.negative === 0);
        return this.iushrn(bits, hint, extended);
      }, "ishrn");
      BN.prototype.shln = /* @__PURE__ */ __name(function shln(bits) {
        return this.clone().ishln(bits);
      }, "shln");
      BN.prototype.ushln = /* @__PURE__ */ __name(function ushln(bits) {
        return this.clone().iushln(bits);
      }, "ushln");
      BN.prototype.shrn = /* @__PURE__ */ __name(function shrn(bits) {
        return this.clone().ishrn(bits);
      }, "shrn");
      BN.prototype.ushrn = /* @__PURE__ */ __name(function ushrn(bits) {
        return this.clone().iushrn(bits);
      }, "ushrn");
      BN.prototype.testn = /* @__PURE__ */ __name(function testn(bit) {
        assert(typeof bit === "number" && bit >= 0);
        var r6 = bit % 26;
        var s6 = (bit - r6) / 26;
        var q6 = 1 << r6;
        if (this.length <= s6)
          return false;
        var w3 = this.words[s6];
        return !!(w3 & q6);
      }, "testn");
      BN.prototype.imaskn = /* @__PURE__ */ __name(function imaskn(bits) {
        assert(typeof bits === "number" && bits >= 0);
        var r6 = bits % 26;
        var s6 = (bits - r6) / 26;
        assert(this.negative === 0, "imaskn works only with positive numbers");
        if (this.length <= s6) {
          return this;
        }
        if (r6 !== 0) {
          s6++;
        }
        this.length = Math.min(s6, this.length);
        if (r6 !== 0) {
          var mask = 67108863 ^ 67108863 >>> r6 << r6;
          this.words[this.length - 1] &= mask;
        }
        return this.strip();
      }, "imaskn");
      BN.prototype.maskn = /* @__PURE__ */ __name(function maskn(bits) {
        return this.clone().imaskn(bits);
      }, "maskn");
      BN.prototype.iaddn = /* @__PURE__ */ __name(function iaddn(num) {
        assert(typeof num === "number");
        assert(num < 67108864);
        if (num < 0)
          return this.isubn(-num);
        if (this.negative !== 0) {
          if (this.length === 1 && (this.words[0] | 0) < num) {
            this.words[0] = num - (this.words[0] | 0);
            this.negative = 0;
            return this;
          }
          this.negative = 0;
          this.isubn(num);
          this.negative = 1;
          return this;
        }
        return this._iaddn(num);
      }, "iaddn");
      BN.prototype._iaddn = /* @__PURE__ */ __name(function _iaddn(num) {
        this.words[0] += num;
        for (var i6 = 0; i6 < this.length && this.words[i6] >= 67108864; i6++) {
          this.words[i6] -= 67108864;
          if (i6 === this.length - 1) {
            this.words[i6 + 1] = 1;
          } else {
            this.words[i6 + 1]++;
          }
        }
        this.length = Math.max(this.length, i6 + 1);
        return this;
      }, "_iaddn");
      BN.prototype.isubn = /* @__PURE__ */ __name(function isubn(num) {
        assert(typeof num === "number");
        assert(num < 67108864);
        if (num < 0)
          return this.iaddn(-num);
        if (this.negative !== 0) {
          this.negative = 0;
          this.iaddn(num);
          this.negative = 1;
          return this;
        }
        this.words[0] -= num;
        if (this.length === 1 && this.words[0] < 0) {
          this.words[0] = -this.words[0];
          this.negative = 1;
        } else {
          for (var i6 = 0; i6 < this.length && this.words[i6] < 0; i6++) {
            this.words[i6] += 67108864;
            this.words[i6 + 1] -= 1;
          }
        }
        return this.strip();
      }, "isubn");
      BN.prototype.addn = /* @__PURE__ */ __name(function addn(num) {
        return this.clone().iaddn(num);
      }, "addn");
      BN.prototype.subn = /* @__PURE__ */ __name(function subn(num) {
        return this.clone().isubn(num);
      }, "subn");
      BN.prototype.iabs = /* @__PURE__ */ __name(function iabs() {
        this.negative = 0;
        return this;
      }, "iabs");
      BN.prototype.abs = /* @__PURE__ */ __name(function abs() {
        return this.clone().iabs();
      }, "abs");
      BN.prototype._ishlnsubmul = /* @__PURE__ */ __name(function _ishlnsubmul(num, mul, shift) {
        var len = num.length + shift;
        var i6;
        this._expand(len);
        var w3;
        var carry = 0;
        for (i6 = 0; i6 < num.length; i6++) {
          w3 = (this.words[i6 + shift] | 0) + carry;
          var right = (num.words[i6] | 0) * mul;
          w3 -= right & 67108863;
          carry = (w3 >> 26) - (right / 67108864 | 0);
          this.words[i6 + shift] = w3 & 67108863;
        }
        for (; i6 < this.length - shift; i6++) {
          w3 = (this.words[i6 + shift] | 0) + carry;
          carry = w3 >> 26;
          this.words[i6 + shift] = w3 & 67108863;
        }
        if (carry === 0)
          return this.strip();
        assert(carry === -1);
        carry = 0;
        for (i6 = 0; i6 < this.length; i6++) {
          w3 = -(this.words[i6] | 0) + carry;
          carry = w3 >> 26;
          this.words[i6] = w3 & 67108863;
        }
        this.negative = 1;
        return this.strip();
      }, "_ishlnsubmul");
      BN.prototype._wordDiv = /* @__PURE__ */ __name(function _wordDiv(num, mode) {
        var shift = this.length - num.length;
        var a6 = this.clone();
        var b6 = num;
        var bhi = b6.words[b6.length - 1] | 0;
        var bhiBits = this._countBits(bhi);
        shift = 26 - bhiBits;
        if (shift !== 0) {
          b6 = b6.ushln(shift);
          a6.iushln(shift);
          bhi = b6.words[b6.length - 1] | 0;
        }
        var m6 = a6.length - b6.length;
        var q6;
        if (mode !== "mod") {
          q6 = new BN(null);
          q6.length = m6 + 1;
          q6.words = new Array(q6.length);
          for (var i6 = 0; i6 < q6.length; i6++) {
            q6.words[i6] = 0;
          }
        }
        var diff = a6.clone()._ishlnsubmul(b6, 1, m6);
        if (diff.negative === 0) {
          a6 = diff;
          if (q6) {
            q6.words[m6] = 1;
          }
        }
        for (var j6 = m6 - 1; j6 >= 0; j6--) {
          var qj = (a6.words[b6.length + j6] | 0) * 67108864 + (a6.words[b6.length + j6 - 1] | 0);
          qj = Math.min(qj / bhi | 0, 67108863);
          a6._ishlnsubmul(b6, qj, j6);
          while (a6.negative !== 0) {
            qj--;
            a6.negative = 0;
            a6._ishlnsubmul(b6, 1, j6);
            if (!a6.isZero()) {
              a6.negative ^= 1;
            }
          }
          if (q6) {
            q6.words[j6] = qj;
          }
        }
        if (q6) {
          q6.strip();
        }
        a6.strip();
        if (mode !== "div" && shift !== 0) {
          a6.iushrn(shift);
        }
        return {
          div: q6 || null,
          mod: a6
        };
      }, "_wordDiv");
      BN.prototype.divmod = /* @__PURE__ */ __name(function divmod(num, mode, positive) {
        assert(!num.isZero());
        if (this.isZero()) {
          return {
            div: new BN(0),
            mod: new BN(0)
          };
        }
        var div, mod, res;
        if (this.negative !== 0 && num.negative === 0) {
          res = this.neg().divmod(num, mode);
          if (mode !== "mod") {
            div = res.div.neg();
          }
          if (mode !== "div") {
            mod = res.mod.neg();
            if (positive && mod.negative !== 0) {
              mod.iadd(num);
            }
          }
          return {
            div,
            mod
          };
        }
        if (this.negative === 0 && num.negative !== 0) {
          res = this.divmod(num.neg(), mode);
          if (mode !== "mod") {
            div = res.div.neg();
          }
          return {
            div,
            mod: res.mod
          };
        }
        if ((this.negative & num.negative) !== 0) {
          res = this.neg().divmod(num.neg(), mode);
          if (mode !== "div") {
            mod = res.mod.neg();
            if (positive && mod.negative !== 0) {
              mod.isub(num);
            }
          }
          return {
            div: res.div,
            mod
          };
        }
        if (num.length > this.length || this.cmp(num) < 0) {
          return {
            div: new BN(0),
            mod: this
          };
        }
        if (num.length === 1) {
          if (mode === "div") {
            return {
              div: this.divn(num.words[0]),
              mod: null
            };
          }
          if (mode === "mod") {
            return {
              div: null,
              mod: new BN(this.modn(num.words[0]))
            };
          }
          return {
            div: this.divn(num.words[0]),
            mod: new BN(this.modn(num.words[0]))
          };
        }
        return this._wordDiv(num, mode);
      }, "divmod");
      BN.prototype.div = /* @__PURE__ */ __name(function div(num) {
        return this.divmod(num, "div", false).div;
      }, "div");
      BN.prototype.mod = /* @__PURE__ */ __name(function mod(num) {
        return this.divmod(num, "mod", false).mod;
      }, "mod");
      BN.prototype.umod = /* @__PURE__ */ __name(function umod(num) {
        return this.divmod(num, "mod", true).mod;
      }, "umod");
      BN.prototype.divRound = /* @__PURE__ */ __name(function divRound(num) {
        var dm = this.divmod(num);
        if (dm.mod.isZero())
          return dm.div;
        var mod = dm.div.negative !== 0 ? dm.mod.isub(num) : dm.mod;
        var half = num.ushrn(1);
        var r22 = num.andln(1);
        var cmp = mod.cmp(half);
        if (cmp < 0 || r22 === 1 && cmp === 0)
          return dm.div;
        return dm.div.negative !== 0 ? dm.div.isubn(1) : dm.div.iaddn(1);
      }, "divRound");
      BN.prototype.modn = /* @__PURE__ */ __name(function modn(num) {
        assert(num <= 67108863);
        var p6 = (1 << 26) % num;
        var acc = 0;
        for (var i6 = this.length - 1; i6 >= 0; i6--) {
          acc = (p6 * acc + (this.words[i6] | 0)) % num;
        }
        return acc;
      }, "modn");
      BN.prototype.idivn = /* @__PURE__ */ __name(function idivn(num) {
        assert(num <= 67108863);
        var carry = 0;
        for (var i6 = this.length - 1; i6 >= 0; i6--) {
          var w3 = (this.words[i6] | 0) + carry * 67108864;
          this.words[i6] = w3 / num | 0;
          carry = w3 % num;
        }
        return this.strip();
      }, "idivn");
      BN.prototype.divn = /* @__PURE__ */ __name(function divn(num) {
        return this.clone().idivn(num);
      }, "divn");
      BN.prototype.egcd = /* @__PURE__ */ __name(function egcd(p6) {
        assert(p6.negative === 0);
        assert(!p6.isZero());
        var x3 = this;
        var y2 = p6.clone();
        if (x3.negative !== 0) {
          x3 = x3.umod(p6);
        } else {
          x3 = x3.clone();
        }
        var A2 = new BN(1);
        var B2 = new BN(0);
        var C2 = new BN(0);
        var D2 = new BN(1);
        var g6 = 0;
        while (x3.isEven() && y2.isEven()) {
          x3.iushrn(1);
          y2.iushrn(1);
          ++g6;
        }
        var yp = y2.clone();
        var xp = x3.clone();
        while (!x3.isZero()) {
          for (var i6 = 0, im = 1; (x3.words[0] & im) === 0 && i6 < 26; ++i6, im <<= 1)
            ;
          if (i6 > 0) {
            x3.iushrn(i6);
            while (i6-- > 0) {
              if (A2.isOdd() || B2.isOdd()) {
                A2.iadd(yp);
                B2.isub(xp);
              }
              A2.iushrn(1);
              B2.iushrn(1);
            }
          }
          for (var j6 = 0, jm = 1; (y2.words[0] & jm) === 0 && j6 < 26; ++j6, jm <<= 1)
            ;
          if (j6 > 0) {
            y2.iushrn(j6);
            while (j6-- > 0) {
              if (C2.isOdd() || D2.isOdd()) {
                C2.iadd(yp);
                D2.isub(xp);
              }
              C2.iushrn(1);
              D2.iushrn(1);
            }
          }
          if (x3.cmp(y2) >= 0) {
            x3.isub(y2);
            A2.isub(C2);
            B2.isub(D2);
          } else {
            y2.isub(x3);
            C2.isub(A2);
            D2.isub(B2);
          }
        }
        return {
          a: C2,
          b: D2,
          gcd: y2.iushln(g6)
        };
      }, "egcd");
      BN.prototype._invmp = /* @__PURE__ */ __name(function _invmp(p6) {
        assert(p6.negative === 0);
        assert(!p6.isZero());
        var a6 = this;
        var b6 = p6.clone();
        if (a6.negative !== 0) {
          a6 = a6.umod(p6);
        } else {
          a6 = a6.clone();
        }
        var x1 = new BN(1);
        var x22 = new BN(0);
        var delta = b6.clone();
        while (a6.cmpn(1) > 0 && b6.cmpn(1) > 0) {
          for (var i6 = 0, im = 1; (a6.words[0] & im) === 0 && i6 < 26; ++i6, im <<= 1)
            ;
          if (i6 > 0) {
            a6.iushrn(i6);
            while (i6-- > 0) {
              if (x1.isOdd()) {
                x1.iadd(delta);
              }
              x1.iushrn(1);
            }
          }
          for (var j6 = 0, jm = 1; (b6.words[0] & jm) === 0 && j6 < 26; ++j6, jm <<= 1)
            ;
          if (j6 > 0) {
            b6.iushrn(j6);
            while (j6-- > 0) {
              if (x22.isOdd()) {
                x22.iadd(delta);
              }
              x22.iushrn(1);
            }
          }
          if (a6.cmp(b6) >= 0) {
            a6.isub(b6);
            x1.isub(x22);
          } else {
            b6.isub(a6);
            x22.isub(x1);
          }
        }
        var res;
        if (a6.cmpn(1) === 0) {
          res = x1;
        } else {
          res = x22;
        }
        if (res.cmpn(0) < 0) {
          res.iadd(p6);
        }
        return res;
      }, "_invmp");
      BN.prototype.gcd = /* @__PURE__ */ __name(function gcd(num) {
        if (this.isZero())
          return num.abs();
        if (num.isZero())
          return this.abs();
        var a6 = this.clone();
        var b6 = num.clone();
        a6.negative = 0;
        b6.negative = 0;
        for (var shift = 0; a6.isEven() && b6.isEven(); shift++) {
          a6.iushrn(1);
          b6.iushrn(1);
        }
        do {
          while (a6.isEven()) {
            a6.iushrn(1);
          }
          while (b6.isEven()) {
            b6.iushrn(1);
          }
          var r6 = a6.cmp(b6);
          if (r6 < 0) {
            var t4 = a6;
            a6 = b6;
            b6 = t4;
          } else if (r6 === 0 || b6.cmpn(1) === 0) {
            break;
          }
          a6.isub(b6);
        } while (true);
        return b6.iushln(shift);
      }, "gcd");
      BN.prototype.invm = /* @__PURE__ */ __name(function invm(num) {
        return this.egcd(num).a.umod(num);
      }, "invm");
      BN.prototype.isEven = /* @__PURE__ */ __name(function isEven() {
        return (this.words[0] & 1) === 0;
      }, "isEven");
      BN.prototype.isOdd = /* @__PURE__ */ __name(function isOdd() {
        return (this.words[0] & 1) === 1;
      }, "isOdd");
      BN.prototype.andln = /* @__PURE__ */ __name(function andln(num) {
        return this.words[0] & num;
      }, "andln");
      BN.prototype.bincn = /* @__PURE__ */ __name(function bincn(bit) {
        assert(typeof bit === "number");
        var r6 = bit % 26;
        var s6 = (bit - r6) / 26;
        var q6 = 1 << r6;
        if (this.length <= s6) {
          this._expand(s6 + 1);
          this.words[s6] |= q6;
          return this;
        }
        var carry = q6;
        for (var i6 = s6; carry !== 0 && i6 < this.length; i6++) {
          var w3 = this.words[i6] | 0;
          w3 += carry;
          carry = w3 >>> 26;
          w3 &= 67108863;
          this.words[i6] = w3;
        }
        if (carry !== 0) {
          this.words[i6] = carry;
          this.length++;
        }
        return this;
      }, "bincn");
      BN.prototype.isZero = /* @__PURE__ */ __name(function isZero() {
        return this.length === 1 && this.words[0] === 0;
      }, "isZero");
      BN.prototype.cmpn = /* @__PURE__ */ __name(function cmpn(num) {
        var negative = num < 0;
        if (this.negative !== 0 && !negative)
          return -1;
        if (this.negative === 0 && negative)
          return 1;
        this.strip();
        var res;
        if (this.length > 1) {
          res = 1;
        } else {
          if (negative) {
            num = -num;
          }
          assert(num <= 67108863, "Number is too big");
          var w3 = this.words[0] | 0;
          res = w3 === num ? 0 : w3 < num ? -1 : 1;
        }
        if (this.negative !== 0)
          return -res | 0;
        return res;
      }, "cmpn");
      BN.prototype.cmp = /* @__PURE__ */ __name(function cmp(num) {
        if (this.negative !== 0 && num.negative === 0)
          return -1;
        if (this.negative === 0 && num.negative !== 0)
          return 1;
        var res = this.ucmp(num);
        if (this.negative !== 0)
          return -res | 0;
        return res;
      }, "cmp");
      BN.prototype.ucmp = /* @__PURE__ */ __name(function ucmp(num) {
        if (this.length > num.length)
          return 1;
        if (this.length < num.length)
          return -1;
        var res = 0;
        for (var i6 = this.length - 1; i6 >= 0; i6--) {
          var a6 = this.words[i6] | 0;
          var b6 = num.words[i6] | 0;
          if (a6 === b6)
            continue;
          if (a6 < b6) {
            res = -1;
          } else if (a6 > b6) {
            res = 1;
          }
          break;
        }
        return res;
      }, "ucmp");
      BN.prototype.gtn = /* @__PURE__ */ __name(function gtn(num) {
        return this.cmpn(num) === 1;
      }, "gtn");
      BN.prototype.gt = /* @__PURE__ */ __name(function gt(num) {
        return this.cmp(num) === 1;
      }, "gt");
      BN.prototype.gten = /* @__PURE__ */ __name(function gten(num) {
        return this.cmpn(num) >= 0;
      }, "gten");
      BN.prototype.gte = /* @__PURE__ */ __name(function gte(num) {
        return this.cmp(num) >= 0;
      }, "gte");
      BN.prototype.ltn = /* @__PURE__ */ __name(function ltn(num) {
        return this.cmpn(num) === -1;
      }, "ltn");
      BN.prototype.lt = /* @__PURE__ */ __name(function lt(num) {
        return this.cmp(num) === -1;
      }, "lt");
      BN.prototype.lten = /* @__PURE__ */ __name(function lten(num) {
        return this.cmpn(num) <= 0;
      }, "lten");
      BN.prototype.lte = /* @__PURE__ */ __name(function lte(num) {
        return this.cmp(num) <= 0;
      }, "lte");
      BN.prototype.eqn = /* @__PURE__ */ __name(function eqn(num) {
        return this.cmpn(num) === 0;
      }, "eqn");
      BN.prototype.eq = /* @__PURE__ */ __name(function eq(num) {
        return this.cmp(num) === 0;
      }, "eq");
      BN.red = /* @__PURE__ */ __name(function red(num) {
        return new Red(num);
      }, "red");
      BN.prototype.toRed = /* @__PURE__ */ __name(function toRed(ctx) {
        assert(!this.red, "Already a number in reduction context");
        assert(this.negative === 0, "red works only with positives");
        return ctx.convertTo(this)._forceRed(ctx);
      }, "toRed");
      BN.prototype.fromRed = /* @__PURE__ */ __name(function fromRed() {
        assert(this.red, "fromRed works only with numbers in reduction context");
        return this.red.convertFrom(this);
      }, "fromRed");
      BN.prototype._forceRed = /* @__PURE__ */ __name(function _forceRed(ctx) {
        this.red = ctx;
        return this;
      }, "_forceRed");
      BN.prototype.forceRed = /* @__PURE__ */ __name(function forceRed(ctx) {
        assert(!this.red, "Already a number in reduction context");
        return this._forceRed(ctx);
      }, "forceRed");
      BN.prototype.redAdd = /* @__PURE__ */ __name(function redAdd(num) {
        assert(this.red, "redAdd works only with red numbers");
        return this.red.add(this, num);
      }, "redAdd");
      BN.prototype.redIAdd = /* @__PURE__ */ __name(function redIAdd(num) {
        assert(this.red, "redIAdd works only with red numbers");
        return this.red.iadd(this, num);
      }, "redIAdd");
      BN.prototype.redSub = /* @__PURE__ */ __name(function redSub(num) {
        assert(this.red, "redSub works only with red numbers");
        return this.red.sub(this, num);
      }, "redSub");
      BN.prototype.redISub = /* @__PURE__ */ __name(function redISub(num) {
        assert(this.red, "redISub works only with red numbers");
        return this.red.isub(this, num);
      }, "redISub");
      BN.prototype.redShl = /* @__PURE__ */ __name(function redShl(num) {
        assert(this.red, "redShl works only with red numbers");
        return this.red.shl(this, num);
      }, "redShl");
      BN.prototype.redMul = /* @__PURE__ */ __name(function redMul(num) {
        assert(this.red, "redMul works only with red numbers");
        this.red._verify2(this, num);
        return this.red.mul(this, num);
      }, "redMul");
      BN.prototype.redIMul = /* @__PURE__ */ __name(function redIMul(num) {
        assert(this.red, "redMul works only with red numbers");
        this.red._verify2(this, num);
        return this.red.imul(this, num);
      }, "redIMul");
      BN.prototype.redSqr = /* @__PURE__ */ __name(function redSqr() {
        assert(this.red, "redSqr works only with red numbers");
        this.red._verify1(this);
        return this.red.sqr(this);
      }, "redSqr");
      BN.prototype.redISqr = /* @__PURE__ */ __name(function redISqr() {
        assert(this.red, "redISqr works only with red numbers");
        this.red._verify1(this);
        return this.red.isqr(this);
      }, "redISqr");
      BN.prototype.redSqrt = /* @__PURE__ */ __name(function redSqrt() {
        assert(this.red, "redSqrt works only with red numbers");
        this.red._verify1(this);
        return this.red.sqrt(this);
      }, "redSqrt");
      BN.prototype.redInvm = /* @__PURE__ */ __name(function redInvm() {
        assert(this.red, "redInvm works only with red numbers");
        this.red._verify1(this);
        return this.red.invm(this);
      }, "redInvm");
      BN.prototype.redNeg = /* @__PURE__ */ __name(function redNeg() {
        assert(this.red, "redNeg works only with red numbers");
        this.red._verify1(this);
        return this.red.neg(this);
      }, "redNeg");
      BN.prototype.redPow = /* @__PURE__ */ __name(function redPow(num) {
        assert(this.red && !num.red, "redPow(normalNum)");
        this.red._verify1(this);
        return this.red.pow(this, num);
      }, "redPow");
      var primes = {
        k256: null,
        p224: null,
        p192: null,
        p25519: null
      };
      function MPrime(name, p6) {
        this.name = name;
        this.p = new BN(p6, 16);
        this.n = this.p.bitLength();
        this.k = new BN(1).iushln(this.n).isub(this.p);
        this.tmp = this._tmp();
      }
      __name(MPrime, "MPrime");
      MPrime.prototype._tmp = /* @__PURE__ */ __name(function _tmp() {
        var tmp = new BN(null);
        tmp.words = new Array(Math.ceil(this.n / 13));
        return tmp;
      }, "_tmp");
      MPrime.prototype.ireduce = /* @__PURE__ */ __name(function ireduce(num) {
        var r6 = num;
        var rlen;
        do {
          this.split(r6, this.tmp);
          r6 = this.imulK(r6);
          r6 = r6.iadd(this.tmp);
          rlen = r6.bitLength();
        } while (rlen > this.n);
        var cmp = rlen < this.n ? -1 : r6.ucmp(this.p);
        if (cmp === 0) {
          r6.words[0] = 0;
          r6.length = 1;
        } else if (cmp > 0) {
          r6.isub(this.p);
        } else {
          if (r6.strip !== void 0) {
            r6.strip();
          } else {
            r6._strip();
          }
        }
        return r6;
      }, "ireduce");
      MPrime.prototype.split = /* @__PURE__ */ __name(function split(input, out) {
        input.iushrn(this.n, 0, out);
      }, "split");
      MPrime.prototype.imulK = /* @__PURE__ */ __name(function imulK(num) {
        return num.imul(this.k);
      }, "imulK");
      function K256() {
        MPrime.call(
          this,
          "k256",
          "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f"
        );
      }
      __name(K256, "K256");
      inherits(K256, MPrime);
      K256.prototype.split = /* @__PURE__ */ __name(function split(input, output) {
        var mask = 4194303;
        var outLen = Math.min(input.length, 9);
        for (var i6 = 0; i6 < outLen; i6++) {
          output.words[i6] = input.words[i6];
        }
        output.length = outLen;
        if (input.length <= 9) {
          input.words[0] = 0;
          input.length = 1;
          return;
        }
        var prev = input.words[9];
        output.words[output.length++] = prev & mask;
        for (i6 = 10; i6 < input.length; i6++) {
          var next = input.words[i6] | 0;
          input.words[i6 - 10] = (next & mask) << 4 | prev >>> 22;
          prev = next;
        }
        prev >>>= 22;
        input.words[i6 - 10] = prev;
        if (prev === 0 && input.length > 10) {
          input.length -= 10;
        } else {
          input.length -= 9;
        }
      }, "split");
      K256.prototype.imulK = /* @__PURE__ */ __name(function imulK(num) {
        num.words[num.length] = 0;
        num.words[num.length + 1] = 0;
        num.length += 2;
        var lo = 0;
        for (var i6 = 0; i6 < num.length; i6++) {
          var w3 = num.words[i6] | 0;
          lo += w3 * 977;
          num.words[i6] = lo & 67108863;
          lo = w3 * 64 + (lo / 67108864 | 0);
        }
        if (num.words[num.length - 1] === 0) {
          num.length--;
          if (num.words[num.length - 1] === 0) {
            num.length--;
          }
        }
        return num;
      }, "imulK");
      function P224() {
        MPrime.call(
          this,
          "p224",
          "ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001"
        );
      }
      __name(P224, "P224");
      inherits(P224, MPrime);
      function P192() {
        MPrime.call(
          this,
          "p192",
          "ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff"
        );
      }
      __name(P192, "P192");
      inherits(P192, MPrime);
      function P25519() {
        MPrime.call(
          this,
          "25519",
          "7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed"
        );
      }
      __name(P25519, "P25519");
      inherits(P25519, MPrime);
      P25519.prototype.imulK = /* @__PURE__ */ __name(function imulK(num) {
        var carry = 0;
        for (var i6 = 0; i6 < num.length; i6++) {
          var hi = (num.words[i6] | 0) * 19 + carry;
          var lo = hi & 67108863;
          hi >>>= 26;
          num.words[i6] = lo;
          carry = hi;
        }
        if (carry !== 0) {
          num.words[num.length++] = carry;
        }
        return num;
      }, "imulK");
      BN._prime = /* @__PURE__ */ __name(function prime(name) {
        if (primes[name])
          return primes[name];
        var prime2;
        if (name === "k256") {
          prime2 = new K256();
        } else if (name === "p224") {
          prime2 = new P224();
        } else if (name === "p192") {
          prime2 = new P192();
        } else if (name === "p25519") {
          prime2 = new P25519();
        } else {
          throw new Error("Unknown prime " + name);
        }
        primes[name] = prime2;
        return prime2;
      }, "prime");
      function Red(m6) {
        if (typeof m6 === "string") {
          var prime = BN._prime(m6);
          this.m = prime.p;
          this.prime = prime;
        } else {
          assert(m6.gtn(1), "modulus must be greater than 1");
          this.m = m6;
          this.prime = null;
        }
      }
      __name(Red, "Red");
      Red.prototype._verify1 = /* @__PURE__ */ __name(function _verify1(a6) {
        assert(a6.negative === 0, "red works only with positives");
        assert(a6.red, "red works only with red numbers");
      }, "_verify1");
      Red.prototype._verify2 = /* @__PURE__ */ __name(function _verify2(a6, b6) {
        assert((a6.negative | b6.negative) === 0, "red works only with positives");
        assert(
          a6.red && a6.red === b6.red,
          "red works only with red numbers"
        );
      }, "_verify2");
      Red.prototype.imod = /* @__PURE__ */ __name(function imod(a6) {
        if (this.prime)
          return this.prime.ireduce(a6)._forceRed(this);
        return a6.umod(this.m)._forceRed(this);
      }, "imod");
      Red.prototype.neg = /* @__PURE__ */ __name(function neg(a6) {
        if (a6.isZero()) {
          return a6.clone();
        }
        return this.m.sub(a6)._forceRed(this);
      }, "neg");
      Red.prototype.add = /* @__PURE__ */ __name(function add(a6, b6) {
        this._verify2(a6, b6);
        var res = a6.add(b6);
        if (res.cmp(this.m) >= 0) {
          res.isub(this.m);
        }
        return res._forceRed(this);
      }, "add");
      Red.prototype.iadd = /* @__PURE__ */ __name(function iadd(a6, b6) {
        this._verify2(a6, b6);
        var res = a6.iadd(b6);
        if (res.cmp(this.m) >= 0) {
          res.isub(this.m);
        }
        return res;
      }, "iadd");
      Red.prototype.sub = /* @__PURE__ */ __name(function sub(a6, b6) {
        this._verify2(a6, b6);
        var res = a6.sub(b6);
        if (res.cmpn(0) < 0) {
          res.iadd(this.m);
        }
        return res._forceRed(this);
      }, "sub");
      Red.prototype.isub = /* @__PURE__ */ __name(function isub(a6, b6) {
        this._verify2(a6, b6);
        var res = a6.isub(b6);
        if (res.cmpn(0) < 0) {
          res.iadd(this.m);
        }
        return res;
      }, "isub");
      Red.prototype.shl = /* @__PURE__ */ __name(function shl(a6, num) {
        this._verify1(a6);
        return this.imod(a6.ushln(num));
      }, "shl");
      Red.prototype.imul = /* @__PURE__ */ __name(function imul(a6, b6) {
        this._verify2(a6, b6);
        return this.imod(a6.imul(b6));
      }, "imul");
      Red.prototype.mul = /* @__PURE__ */ __name(function mul(a6, b6) {
        this._verify2(a6, b6);
        return this.imod(a6.mul(b6));
      }, "mul");
      Red.prototype.isqr = /* @__PURE__ */ __name(function isqr(a6) {
        return this.imul(a6, a6.clone());
      }, "isqr");
      Red.prototype.sqr = /* @__PURE__ */ __name(function sqr(a6) {
        return this.mul(a6, a6);
      }, "sqr");
      Red.prototype.sqrt = /* @__PURE__ */ __name(function sqrt(a6) {
        if (a6.isZero())
          return a6.clone();
        var mod3 = this.m.andln(3);
        assert(mod3 % 2 === 1);
        if (mod3 === 3) {
          var pow = this.m.add(new BN(1)).iushrn(2);
          return this.pow(a6, pow);
        }
        var q6 = this.m.subn(1);
        var s6 = 0;
        while (!q6.isZero() && q6.andln(1) === 0) {
          s6++;
          q6.iushrn(1);
        }
        assert(!q6.isZero());
        var one = new BN(1).toRed(this);
        var nOne = one.redNeg();
        var lpow = this.m.subn(1).iushrn(1);
        var z2 = this.m.bitLength();
        z2 = new BN(2 * z2 * z2).toRed(this);
        while (this.pow(z2, lpow).cmp(nOne) !== 0) {
          z2.redIAdd(nOne);
        }
        var c6 = this.pow(z2, q6);
        var r6 = this.pow(a6, q6.addn(1).iushrn(1));
        var t4 = this.pow(a6, q6);
        var m6 = s6;
        while (t4.cmp(one) !== 0) {
          var tmp = t4;
          for (var i6 = 0; tmp.cmp(one) !== 0; i6++) {
            tmp = tmp.redSqr();
          }
          assert(i6 < m6);
          var b6 = this.pow(c6, new BN(1).iushln(m6 - i6 - 1));
          r6 = r6.redMul(b6);
          c6 = b6.redSqr();
          t4 = t4.redMul(c6);
          m6 = i6;
        }
        return r6;
      }, "sqrt");
      Red.prototype.invm = /* @__PURE__ */ __name(function invm(a6) {
        var inv = a6._invmp(this.m);
        if (inv.negative !== 0) {
          inv.negative = 0;
          return this.imod(inv).redNeg();
        } else {
          return this.imod(inv);
        }
      }, "invm");
      Red.prototype.pow = /* @__PURE__ */ __name(function pow(a6, num) {
        if (num.isZero())
          return new BN(1).toRed(this);
        if (num.cmpn(1) === 0)
          return a6.clone();
        var windowSize = 4;
        var wnd = new Array(1 << windowSize);
        wnd[0] = new BN(1).toRed(this);
        wnd[1] = a6;
        for (var i6 = 2; i6 < wnd.length; i6++) {
          wnd[i6] = this.mul(wnd[i6 - 1], a6);
        }
        var res = wnd[0];
        var current = 0;
        var currentLen = 0;
        var start = num.bitLength() % 26;
        if (start === 0) {
          start = 26;
        }
        for (i6 = num.length - 1; i6 >= 0; i6--) {
          var word = num.words[i6];
          for (var j6 = start - 1; j6 >= 0; j6--) {
            var bit = word >> j6 & 1;
            if (res !== wnd[0]) {
              res = this.sqr(res);
            }
            if (bit === 0 && current === 0) {
              currentLen = 0;
              continue;
            }
            current <<= 1;
            current |= bit;
            currentLen++;
            if (currentLen !== windowSize && (i6 !== 0 || j6 !== 0))
              continue;
            res = this.mul(res, wnd[current]);
            currentLen = 0;
            current = 0;
          }
          start = 26;
        }
        return res;
      }, "pow");
      Red.prototype.convertTo = /* @__PURE__ */ __name(function convertTo(num) {
        var r6 = num.umod(this.m);
        return r6 === num ? r6.clone() : r6;
      }, "convertTo");
      Red.prototype.convertFrom = /* @__PURE__ */ __name(function convertFrom(num) {
        var res = num.clone();
        res.red = null;
        return res;
      }, "convertFrom");
      BN.mont = /* @__PURE__ */ __name(function mont(num) {
        return new Mont(num);
      }, "mont");
      function Mont(m6) {
        Red.call(this, m6);
        this.shift = this.m.bitLength();
        if (this.shift % 26 !== 0) {
          this.shift += 26 - this.shift % 26;
        }
        this.r = new BN(1).iushln(this.shift);
        this.r2 = this.imod(this.r.sqr());
        this.rinv = this.r._invmp(this.m);
        this.minv = this.rinv.mul(this.r).isubn(1).div(this.m);
        this.minv = this.minv.umod(this.r);
        this.minv = this.r.sub(this.minv);
      }
      __name(Mont, "Mont");
      inherits(Mont, Red);
      Mont.prototype.convertTo = /* @__PURE__ */ __name(function convertTo(num) {
        return this.imod(num.ushln(this.shift));
      }, "convertTo");
      Mont.prototype.convertFrom = /* @__PURE__ */ __name(function convertFrom(num) {
        var r6 = this.imod(num.mul(this.rinv));
        r6.red = null;
        return r6;
      }, "convertFrom");
      Mont.prototype.imul = /* @__PURE__ */ __name(function imul(a6, b6) {
        if (a6.isZero() || b6.isZero()) {
          a6.words[0] = 0;
          a6.length = 1;
          return a6;
        }
        var t4 = a6.imul(b6);
        var c6 = t4.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m);
        var u4 = t4.isub(c6).iushrn(this.shift);
        var res = u4;
        if (u4.cmp(this.m) >= 0) {
          res = u4.isub(this.m);
        } else if (u4.cmpn(0) < 0) {
          res = u4.iadd(this.m);
        }
        return res._forceRed(this);
      }, "imul");
      Mont.prototype.mul = /* @__PURE__ */ __name(function mul(a6, b6) {
        if (a6.isZero() || b6.isZero())
          return new BN(0)._forceRed(this);
        var t4 = a6.mul(b6);
        var c6 = t4.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m);
        var u4 = t4.isub(c6).iushrn(this.shift);
        var res = u4;
        if (u4.cmp(this.m) >= 0) {
          res = u4.isub(this.m);
        } else if (u4.cmpn(0) < 0) {
          res = u4.iadd(this.m);
        }
        return res._forceRed(this);
      }, "mul");
      Mont.prototype.invm = /* @__PURE__ */ __name(function invm(a6) {
        var res = this.imod(a6._invmp(this.m).mul(this.r2));
        return res._forceRed(this);
      }, "invm");
    })(typeof module2 === "undefined" || module2, exports);
  }
});

// node_modules/inherits/inherits_browser.js
var require_inherits_browser = __commonJS({
  "node_modules/inherits/inherits_browser.js"(exports, module2) {
    if (typeof Object.create === "function") {
      module2.exports = /* @__PURE__ */ __name(function inherits(ctor, superCtor) {
        if (superCtor) {
          ctor.super_ = superCtor;
          ctor.prototype = Object.create(superCtor.prototype, {
            constructor: {
              value: ctor,
              enumerable: false,
              writable: true,
              configurable: true
            }
          });
        }
      }, "inherits");
    } else {
      module2.exports = /* @__PURE__ */ __name(function inherits(ctor, superCtor) {
        if (superCtor) {
          ctor.super_ = superCtor;
          var TempCtor = /* @__PURE__ */ __name(function() {
          }, "TempCtor");
          TempCtor.prototype = superCtor.prototype;
          ctor.prototype = new TempCtor();
          ctor.prototype.constructor = ctor;
        }
      }, "inherits");
    }
  }
});

// node_modules/inherits/inherits.js
var require_inherits = __commonJS({
  "node_modules/inherits/inherits.js"(exports, module2) {
    try {
      util = __require("util");
      if (typeof util.inherits !== "function")
        throw "";
      module2.exports = util.inherits;
    } catch (e6) {
      module2.exports = require_inherits_browser();
    }
    var util;
  }
});

// node_modules/safer-buffer/safer.js
var require_safer = __commonJS({
  "node_modules/safer-buffer/safer.js"(exports, module2) {
    "use strict";
    var buffer = __require("buffer");
    var Buffer5 = buffer.Buffer;
    var safer = {};
    var key;
    for (key in buffer) {
      if (!buffer.hasOwnProperty(key))
        continue;
      if (key === "SlowBuffer" || key === "Buffer")
        continue;
      safer[key] = buffer[key];
    }
    var Safer = safer.Buffer = {};
    for (key in Buffer5) {
      if (!Buffer5.hasOwnProperty(key))
        continue;
      if (key === "allocUnsafe" || key === "allocUnsafeSlow")
        continue;
      Safer[key] = Buffer5[key];
    }
    safer.Buffer.prototype = Buffer5.prototype;
    if (!Safer.from || Safer.from === Uint8Array.from) {
      Safer.from = function(value, encodingOrOffset, length) {
        if (typeof value === "number") {
          throw new TypeError('The "value" argument must not be of type number. Received type ' + typeof value);
        }
        if (value && typeof value.length === "undefined") {
          throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof value);
        }
        return Buffer5(value, encodingOrOffset, length);
      };
    }
    if (!Safer.alloc) {
      Safer.alloc = function(size, fill, encoding) {
        if (typeof size !== "number") {
          throw new TypeError('The "size" argument must be of type number. Received type ' + typeof size);
        }
        if (size < 0 || size >= 2 * (1 << 30)) {
          throw new RangeError('The value "' + size + '" is invalid for option "size"');
        }
        var buf = Buffer5(size);
        if (!fill || fill.length === 0) {
          buf.fill(0);
        } else if (typeof encoding === "string") {
          buf.fill(fill, encoding);
        } else {
          buf.fill(fill);
        }
        return buf;
      };
    }
    if (!safer.kStringMaxLength) {
      try {
        safer.kStringMaxLength = process.binding("buffer").kStringMaxLength;
      } catch (e6) {
      }
    }
    if (!safer.constants) {
      safer.constants = {
        MAX_LENGTH: safer.kMaxLength
      };
      if (safer.kStringMaxLength) {
        safer.constants.MAX_STRING_LENGTH = safer.kStringMaxLength;
      }
    }
    module2.exports = safer;
  }
});

// node_modules/asn1.js/lib/asn1/base/reporter.js
var require_reporter = __commonJS({
  "node_modules/asn1.js/lib/asn1/base/reporter.js"(exports) {
    "use strict";
    var inherits = require_inherits();
    function Reporter(options) {
      this._reporterState = {
        obj: null,
        path: [],
        options: options || {},
        errors: []
      };
    }
    __name(Reporter, "Reporter");
    exports.Reporter = Reporter;
    Reporter.prototype.isError = /* @__PURE__ */ __name(function isError(obj) {
      return obj instanceof ReporterError;
    }, "isError");
    Reporter.prototype.save = /* @__PURE__ */ __name(function save() {
      const state2 = this._reporterState;
      return { obj: state2.obj, pathLen: state2.path.length };
    }, "save");
    Reporter.prototype.restore = /* @__PURE__ */ __name(function restore(data) {
      const state2 = this._reporterState;
      state2.obj = data.obj;
      state2.path = state2.path.slice(0, data.pathLen);
    }, "restore");
    Reporter.prototype.enterKey = /* @__PURE__ */ __name(function enterKey(key) {
      return this._reporterState.path.push(key);
    }, "enterKey");
    Reporter.prototype.exitKey = /* @__PURE__ */ __name(function exitKey(index) {
      const state2 = this._reporterState;
      state2.path = state2.path.slice(0, index - 1);
    }, "exitKey");
    Reporter.prototype.leaveKey = /* @__PURE__ */ __name(function leaveKey(index, key, value) {
      const state2 = this._reporterState;
      this.exitKey(index);
      if (state2.obj !== null)
        state2.obj[key] = value;
    }, "leaveKey");
    Reporter.prototype.path = /* @__PURE__ */ __name(function path() {
      return this._reporterState.path.join("/");
    }, "path");
    Reporter.prototype.enterObject = /* @__PURE__ */ __name(function enterObject() {
      const state2 = this._reporterState;
      const prev = state2.obj;
      state2.obj = {};
      return prev;
    }, "enterObject");
    Reporter.prototype.leaveObject = /* @__PURE__ */ __name(function leaveObject(prev) {
      const state2 = this._reporterState;
      const now = state2.obj;
      state2.obj = prev;
      return now;
    }, "leaveObject");
    Reporter.prototype.error = /* @__PURE__ */ __name(function error(msg) {
      let err;
      const state2 = this._reporterState;
      const inherited = msg instanceof ReporterError;
      if (inherited) {
        err = msg;
      } else {
        err = new ReporterError(state2.path.map(function(elem) {
          return "[" + JSON.stringify(elem) + "]";
        }).join(""), msg.message || msg, msg.stack);
      }
      if (!state2.options.partial)
        throw err;
      if (!inherited)
        state2.errors.push(err);
      return err;
    }, "error");
    Reporter.prototype.wrapResult = /* @__PURE__ */ __name(function wrapResult(result) {
      const state2 = this._reporterState;
      if (!state2.options.partial)
        return result;
      return {
        result: this.isError(result) ? null : result,
        errors: state2.errors
      };
    }, "wrapResult");
    function ReporterError(path, msg) {
      this.path = path;
      this.rethrow(msg);
    }
    __name(ReporterError, "ReporterError");
    inherits(ReporterError, Error);
    ReporterError.prototype.rethrow = /* @__PURE__ */ __name(function rethrow(msg) {
      this.message = msg + " at: " + (this.path || "(shallow)");
      if (Error.captureStackTrace)
        Error.captureStackTrace(this, ReporterError);
      if (!this.stack) {
        try {
          throw new Error(this.message);
        } catch (e6) {
          this.stack = e6.stack;
        }
      }
      return this;
    }, "rethrow");
  }
});

// node_modules/asn1.js/lib/asn1/base/buffer.js
var require_buffer = __commonJS({
  "node_modules/asn1.js/lib/asn1/base/buffer.js"(exports) {
    "use strict";
    var inherits = require_inherits();
    var Reporter = require_reporter().Reporter;
    var Buffer5 = require_safer().Buffer;
    function DecoderBuffer(base, options) {
      Reporter.call(this, options);
      if (!Buffer5.isBuffer(base)) {
        this.error("Input not Buffer");
        return;
      }
      this.base = base;
      this.offset = 0;
      this.length = base.length;
    }
    __name(DecoderBuffer, "DecoderBuffer");
    inherits(DecoderBuffer, Reporter);
    exports.DecoderBuffer = DecoderBuffer;
    DecoderBuffer.isDecoderBuffer = /* @__PURE__ */ __name(function isDecoderBuffer(data) {
      if (data instanceof DecoderBuffer) {
        return true;
      }
      const isCompatible = typeof data === "object" && Buffer5.isBuffer(data.base) && data.constructor.name === "DecoderBuffer" && typeof data.offset === "number" && typeof data.length === "number" && typeof data.save === "function" && typeof data.restore === "function" && typeof data.isEmpty === "function" && typeof data.readUInt8 === "function" && typeof data.skip === "function" && typeof data.raw === "function";
      return isCompatible;
    }, "isDecoderBuffer");
    DecoderBuffer.prototype.save = /* @__PURE__ */ __name(function save() {
      return { offset: this.offset, reporter: Reporter.prototype.save.call(this) };
    }, "save");
    DecoderBuffer.prototype.restore = /* @__PURE__ */ __name(function restore(save) {
      const res = new DecoderBuffer(this.base);
      res.offset = save.offset;
      res.length = this.offset;
      this.offset = save.offset;
      Reporter.prototype.restore.call(this, save.reporter);
      return res;
    }, "restore");
    DecoderBuffer.prototype.isEmpty = /* @__PURE__ */ __name(function isEmpty() {
      return this.offset === this.length;
    }, "isEmpty");
    DecoderBuffer.prototype.readUInt8 = /* @__PURE__ */ __name(function readUInt8(fail) {
      if (this.offset + 1 <= this.length)
        return this.base.readUInt8(this.offset++, true);
      else
        return this.error(fail || "DecoderBuffer overrun");
    }, "readUInt8");
    DecoderBuffer.prototype.skip = /* @__PURE__ */ __name(function skip(bytes, fail) {
      if (!(this.offset + bytes <= this.length))
        return this.error(fail || "DecoderBuffer overrun");
      const res = new DecoderBuffer(this.base);
      res._reporterState = this._reporterState;
      res.offset = this.offset;
      res.length = this.offset + bytes;
      this.offset += bytes;
      return res;
    }, "skip");
    DecoderBuffer.prototype.raw = /* @__PURE__ */ __name(function raw(save) {
      return this.base.slice(save ? save.offset : this.offset, this.length);
    }, "raw");
    function EncoderBuffer(value, reporter) {
      if (Array.isArray(value)) {
        this.length = 0;
        this.value = value.map(function(item) {
          if (!EncoderBuffer.isEncoderBuffer(item))
            item = new EncoderBuffer(item, reporter);
          this.length += item.length;
          return item;
        }, this);
      } else if (typeof value === "number") {
        if (!(0 <= value && value <= 255))
          return reporter.error("non-byte EncoderBuffer value");
        this.value = value;
        this.length = 1;
      } else if (typeof value === "string") {
        this.value = value;
        this.length = Buffer5.byteLength(value);
      } else if (Buffer5.isBuffer(value)) {
        this.value = value;
        this.length = value.length;
      } else {
        return reporter.error("Unsupported type: " + typeof value);
      }
    }
    __name(EncoderBuffer, "EncoderBuffer");
    exports.EncoderBuffer = EncoderBuffer;
    EncoderBuffer.isEncoderBuffer = /* @__PURE__ */ __name(function isEncoderBuffer(data) {
      if (data instanceof EncoderBuffer) {
        return true;
      }
      const isCompatible = typeof data === "object" && data.constructor.name === "EncoderBuffer" && typeof data.length === "number" && typeof data.join === "function";
      return isCompatible;
    }, "isEncoderBuffer");
    EncoderBuffer.prototype.join = /* @__PURE__ */ __name(function join4(out, offset) {
      if (!out)
        out = Buffer5.alloc(this.length);
      if (!offset)
        offset = 0;
      if (this.length === 0)
        return out;
      if (Array.isArray(this.value)) {
        this.value.forEach(function(item) {
          item.join(out, offset);
          offset += item.length;
        });
      } else {
        if (typeof this.value === "number")
          out[offset] = this.value;
        else if (typeof this.value === "string")
          out.write(this.value, offset);
        else if (Buffer5.isBuffer(this.value))
          this.value.copy(out, offset);
        offset += this.length;
      }
      return out;
    }, "join");
  }
});

// node_modules/minimalistic-assert/index.js
var require_minimalistic_assert = __commonJS({
  "node_modules/minimalistic-assert/index.js"(exports, module2) {
    module2.exports = assert;
    function assert(val, msg) {
      if (!val)
        throw new Error(msg || "Assertion failed");
    }
    __name(assert, "assert");
    assert.equal = /* @__PURE__ */ __name(function assertEqual(l6, r6, msg) {
      if (l6 != r6)
        throw new Error(msg || "Assertion failed: " + l6 + " != " + r6);
    }, "assertEqual");
  }
});

// node_modules/asn1.js/lib/asn1/base/node.js
var require_node = __commonJS({
  "node_modules/asn1.js/lib/asn1/base/node.js"(exports, module2) {
    "use strict";
    var Reporter = require_reporter().Reporter;
    var EncoderBuffer = require_buffer().EncoderBuffer;
    var DecoderBuffer = require_buffer().DecoderBuffer;
    var assert = require_minimalistic_assert();
    var tags = [
      "seq",
      "seqof",
      "set",
      "setof",
      "objid",
      "bool",
      "gentime",
      "utctime",
      "null_",
      "enum",
      "int",
      "objDesc",
      "bitstr",
      "bmpstr",
      "charstr",
      "genstr",
      "graphstr",
      "ia5str",
      "iso646str",
      "numstr",
      "octstr",
      "printstr",
      "t61str",
      "unistr",
      "utf8str",
      "videostr"
    ];
    var methods = [
      "key",
      "obj",
      "use",
      "optional",
      "explicit",
      "implicit",
      "def",
      "choice",
      "any",
      "contains"
    ].concat(tags);
    var overrided = [
      "_peekTag",
      "_decodeTag",
      "_use",
      "_decodeStr",
      "_decodeObjid",
      "_decodeTime",
      "_decodeNull",
      "_decodeInt",
      "_decodeBool",
      "_decodeList",
      "_encodeComposite",
      "_encodeStr",
      "_encodeObjid",
      "_encodeTime",
      "_encodeNull",
      "_encodeInt",
      "_encodeBool"
    ];
    function Node(enc, parent, name) {
      const state2 = {};
      this._baseState = state2;
      state2.name = name;
      state2.enc = enc;
      state2.parent = parent || null;
      state2.children = null;
      state2.tag = null;
      state2.args = null;
      state2.reverseArgs = null;
      state2.choice = null;
      state2.optional = false;
      state2.any = false;
      state2.obj = false;
      state2.use = null;
      state2.useDecoder = null;
      state2.key = null;
      state2["default"] = null;
      state2.explicit = null;
      state2.implicit = null;
      state2.contains = null;
      if (!state2.parent) {
        state2.children = [];
        this._wrap();
      }
    }
    __name(Node, "Node");
    module2.exports = Node;
    var stateProps = [
      "enc",
      "parent",
      "children",
      "tag",
      "args",
      "reverseArgs",
      "choice",
      "optional",
      "any",
      "obj",
      "use",
      "alteredUse",
      "key",
      "default",
      "explicit",
      "implicit",
      "contains"
    ];
    Node.prototype.clone = /* @__PURE__ */ __name(function clone() {
      const state2 = this._baseState;
      const cstate = {};
      stateProps.forEach(function(prop) {
        cstate[prop] = state2[prop];
      });
      const res = new this.constructor(cstate.parent);
      res._baseState = cstate;
      return res;
    }, "clone");
    Node.prototype._wrap = /* @__PURE__ */ __name(function wrap() {
      const state2 = this._baseState;
      methods.forEach(function(method) {
        this[method] = /* @__PURE__ */ __name(function _wrappedMethod() {
          const clone = new this.constructor(this);
          state2.children.push(clone);
          return clone[method].apply(clone, arguments);
        }, "_wrappedMethod");
      }, this);
    }, "wrap");
    Node.prototype._init = /* @__PURE__ */ __name(function init(body) {
      const state2 = this._baseState;
      assert(state2.parent === null);
      body.call(this);
      state2.children = state2.children.filter(function(child) {
        return child._baseState.parent === this;
      }, this);
      assert.equal(state2.children.length, 1, "Root node can have only one child");
    }, "init");
    Node.prototype._useArgs = /* @__PURE__ */ __name(function useArgs(args) {
      const state2 = this._baseState;
      const children = args.filter(function(arg) {
        return arg instanceof this.constructor;
      }, this);
      args = args.filter(function(arg) {
        return !(arg instanceof this.constructor);
      }, this);
      if (children.length !== 0) {
        assert(state2.children === null);
        state2.children = children;
        children.forEach(function(child) {
          child._baseState.parent = this;
        }, this);
      }
      if (args.length !== 0) {
        assert(state2.args === null);
        state2.args = args;
        state2.reverseArgs = args.map(function(arg) {
          if (typeof arg !== "object" || arg.constructor !== Object)
            return arg;
          const res = {};
          Object.keys(arg).forEach(function(key) {
            if (key == (key | 0))
              key |= 0;
            const value = arg[key];
            res[value] = key;
          });
          return res;
        });
      }
    }, "useArgs");
    overrided.forEach(function(method) {
      Node.prototype[method] = /* @__PURE__ */ __name(function _overrided() {
        const state2 = this._baseState;
        throw new Error(method + " not implemented for encoding: " + state2.enc);
      }, "_overrided");
    });
    tags.forEach(function(tag) {
      Node.prototype[tag] = /* @__PURE__ */ __name(function _tagMethod() {
        const state2 = this._baseState;
        const args = Array.prototype.slice.call(arguments);
        assert(state2.tag === null);
        state2.tag = tag;
        this._useArgs(args);
        return this;
      }, "_tagMethod");
    });
    Node.prototype.use = /* @__PURE__ */ __name(function use(item) {
      assert(item);
      const state2 = this._baseState;
      assert(state2.use === null);
      state2.use = item;
      return this;
    }, "use");
    Node.prototype.optional = /* @__PURE__ */ __name(function optional() {
      const state2 = this._baseState;
      state2.optional = true;
      return this;
    }, "optional");
    Node.prototype.def = /* @__PURE__ */ __name(function def(val) {
      const state2 = this._baseState;
      assert(state2["default"] === null);
      state2["default"] = val;
      state2.optional = true;
      return this;
    }, "def");
    Node.prototype.explicit = /* @__PURE__ */ __name(function explicit(num) {
      const state2 = this._baseState;
      assert(state2.explicit === null && state2.implicit === null);
      state2.explicit = num;
      return this;
    }, "explicit");
    Node.prototype.implicit = /* @__PURE__ */ __name(function implicit(num) {
      const state2 = this._baseState;
      assert(state2.explicit === null && state2.implicit === null);
      state2.implicit = num;
      return this;
    }, "implicit");
    Node.prototype.obj = /* @__PURE__ */ __name(function obj() {
      const state2 = this._baseState;
      const args = Array.prototype.slice.call(arguments);
      state2.obj = true;
      if (args.length !== 0)
        this._useArgs(args);
      return this;
    }, "obj");
    Node.prototype.key = /* @__PURE__ */ __name(function key(newKey) {
      const state2 = this._baseState;
      assert(state2.key === null);
      state2.key = newKey;
      return this;
    }, "key");
    Node.prototype.any = /* @__PURE__ */ __name(function any() {
      const state2 = this._baseState;
      state2.any = true;
      return this;
    }, "any");
    Node.prototype.choice = /* @__PURE__ */ __name(function choice(obj) {
      const state2 = this._baseState;
      assert(state2.choice === null);
      state2.choice = obj;
      this._useArgs(Object.keys(obj).map(function(key) {
        return obj[key];
      }));
      return this;
    }, "choice");
    Node.prototype.contains = /* @__PURE__ */ __name(function contains(item) {
      const state2 = this._baseState;
      assert(state2.use === null);
      state2.contains = item;
      return this;
    }, "contains");
    Node.prototype._decode = /* @__PURE__ */ __name(function decode(input, options) {
      const state2 = this._baseState;
      if (state2.parent === null)
        return input.wrapResult(state2.children[0]._decode(input, options));
      let result = state2["default"];
      let present = true;
      let prevKey = null;
      if (state2.key !== null)
        prevKey = input.enterKey(state2.key);
      if (state2.optional) {
        let tag = null;
        if (state2.explicit !== null)
          tag = state2.explicit;
        else if (state2.implicit !== null)
          tag = state2.implicit;
        else if (state2.tag !== null)
          tag = state2.tag;
        if (tag === null && !state2.any) {
          const save = input.save();
          try {
            if (state2.choice === null)
              this._decodeGeneric(state2.tag, input, options);
            else
              this._decodeChoice(input, options);
            present = true;
          } catch (e6) {
            present = false;
          }
          input.restore(save);
        } else {
          present = this._peekTag(input, tag, state2.any);
          if (input.isError(present))
            return present;
        }
      }
      let prevObj;
      if (state2.obj && present)
        prevObj = input.enterObject();
      if (present) {
        if (state2.explicit !== null) {
          const explicit = this._decodeTag(input, state2.explicit);
          if (input.isError(explicit))
            return explicit;
          input = explicit;
        }
        const start = input.offset;
        if (state2.use === null && state2.choice === null) {
          let save;
          if (state2.any)
            save = input.save();
          const body = this._decodeTag(
            input,
            state2.implicit !== null ? state2.implicit : state2.tag,
            state2.any
          );
          if (input.isError(body))
            return body;
          if (state2.any)
            result = input.raw(save);
          else
            input = body;
        }
        if (options && options.track && state2.tag !== null)
          options.track(input.path(), start, input.length, "tagged");
        if (options && options.track && state2.tag !== null)
          options.track(input.path(), input.offset, input.length, "content");
        if (state2.any) {
        } else if (state2.choice === null) {
          result = this._decodeGeneric(state2.tag, input, options);
        } else {
          result = this._decodeChoice(input, options);
        }
        if (input.isError(result))
          return result;
        if (!state2.any && state2.choice === null && state2.children !== null) {
          state2.children.forEach(/* @__PURE__ */ __name(function decodeChildren(child) {
            child._decode(input, options);
          }, "decodeChildren"));
        }
        if (state2.contains && (state2.tag === "octstr" || state2.tag === "bitstr")) {
          const data = new DecoderBuffer(result);
          result = this._getUse(state2.contains, input._reporterState.obj)._decode(data, options);
        }
      }
      if (state2.obj && present)
        result = input.leaveObject(prevObj);
      if (state2.key !== null && (result !== null || present === true))
        input.leaveKey(prevKey, state2.key, result);
      else if (prevKey !== null)
        input.exitKey(prevKey);
      return result;
    }, "decode");
    Node.prototype._decodeGeneric = /* @__PURE__ */ __name(function decodeGeneric(tag, input, options) {
      const state2 = this._baseState;
      if (tag === "seq" || tag === "set")
        return null;
      if (tag === "seqof" || tag === "setof")
        return this._decodeList(input, tag, state2.args[0], options);
      else if (/str$/.test(tag))
        return this._decodeStr(input, tag, options);
      else if (tag === "objid" && state2.args)
        return this._decodeObjid(input, state2.args[0], state2.args[1], options);
      else if (tag === "objid")
        return this._decodeObjid(input, null, null, options);
      else if (tag === "gentime" || tag === "utctime")
        return this._decodeTime(input, tag, options);
      else if (tag === "null_")
        return this._decodeNull(input, options);
      else if (tag === "bool")
        return this._decodeBool(input, options);
      else if (tag === "objDesc")
        return this._decodeStr(input, tag, options);
      else if (tag === "int" || tag === "enum")
        return this._decodeInt(input, state2.args && state2.args[0], options);
      if (state2.use !== null) {
        return this._getUse(state2.use, input._reporterState.obj)._decode(input, options);
      } else {
        return input.error("unknown tag: " + tag);
      }
    }, "decodeGeneric");
    Node.prototype._getUse = /* @__PURE__ */ __name(function _getUse(entity, obj) {
      const state2 = this._baseState;
      state2.useDecoder = this._use(entity, obj);
      assert(state2.useDecoder._baseState.parent === null);
      state2.useDecoder = state2.useDecoder._baseState.children[0];
      if (state2.implicit !== state2.useDecoder._baseState.implicit) {
        state2.useDecoder = state2.useDecoder.clone();
        state2.useDecoder._baseState.implicit = state2.implicit;
      }
      return state2.useDecoder;
    }, "_getUse");
    Node.prototype._decodeChoice = /* @__PURE__ */ __name(function decodeChoice(input, options) {
      const state2 = this._baseState;
      let result = null;
      let match = false;
      Object.keys(state2.choice).some(function(key) {
        const save = input.save();
        const node = state2.choice[key];
        try {
          const value = node._decode(input, options);
          if (input.isError(value))
            return false;
          result = { type: key, value };
          match = true;
        } catch (e6) {
          input.restore(save);
          return false;
        }
        return true;
      }, this);
      if (!match)
        return input.error("Choice not matched");
      return result;
    }, "decodeChoice");
    Node.prototype._createEncoderBuffer = /* @__PURE__ */ __name(function createEncoderBuffer(data) {
      return new EncoderBuffer(data, this.reporter);
    }, "createEncoderBuffer");
    Node.prototype._encode = /* @__PURE__ */ __name(function encode(data, reporter, parent) {
      const state2 = this._baseState;
      if (state2["default"] !== null && state2["default"] === data)
        return;
      const result = this._encodeValue(data, reporter, parent);
      if (result === void 0)
        return;
      if (this._skipDefault(result, reporter, parent))
        return;
      return result;
    }, "encode");
    Node.prototype._encodeValue = /* @__PURE__ */ __name(function encode(data, reporter, parent) {
      const state2 = this._baseState;
      if (state2.parent === null)
        return state2.children[0]._encode(data, reporter || new Reporter());
      let result = null;
      this.reporter = reporter;
      if (state2.optional && data === void 0) {
        if (state2["default"] !== null)
          data = state2["default"];
        else
          return;
      }
      let content = null;
      let primitive = false;
      if (state2.any) {
        result = this._createEncoderBuffer(data);
      } else if (state2.choice) {
        result = this._encodeChoice(data, reporter);
      } else if (state2.contains) {
        content = this._getUse(state2.contains, parent)._encode(data, reporter);
        primitive = true;
      } else if (state2.children) {
        content = state2.children.map(function(child) {
          if (child._baseState.tag === "null_")
            return child._encode(null, reporter, data);
          if (child._baseState.key === null)
            return reporter.error("Child should have a key");
          const prevKey = reporter.enterKey(child._baseState.key);
          if (typeof data !== "object")
            return reporter.error("Child expected, but input is not object");
          const res = child._encode(data[child._baseState.key], reporter, data);
          reporter.leaveKey(prevKey);
          return res;
        }, this).filter(function(child) {
          return child;
        });
        content = this._createEncoderBuffer(content);
      } else {
        if (state2.tag === "seqof" || state2.tag === "setof") {
          if (!(state2.args && state2.args.length === 1))
            return reporter.error("Too many args for : " + state2.tag);
          if (!Array.isArray(data))
            return reporter.error("seqof/setof, but data is not Array");
          const child = this.clone();
          child._baseState.implicit = null;
          content = this._createEncoderBuffer(data.map(function(item) {
            const state3 = this._baseState;
            return this._getUse(state3.args[0], data)._encode(item, reporter);
          }, child));
        } else if (state2.use !== null) {
          result = this._getUse(state2.use, parent)._encode(data, reporter);
        } else {
          content = this._encodePrimitive(state2.tag, data);
          primitive = true;
        }
      }
      if (!state2.any && state2.choice === null) {
        const tag = state2.implicit !== null ? state2.implicit : state2.tag;
        const cls = state2.implicit === null ? "universal" : "context";
        if (tag === null) {
          if (state2.use === null)
            reporter.error("Tag could be omitted only for .use()");
        } else {
          if (state2.use === null)
            result = this._encodeComposite(tag, primitive, cls, content);
        }
      }
      if (state2.explicit !== null)
        result = this._encodeComposite(state2.explicit, false, "context", result);
      return result;
    }, "encode");
    Node.prototype._encodeChoice = /* @__PURE__ */ __name(function encodeChoice(data, reporter) {
      const state2 = this._baseState;
      const node = state2.choice[data.type];
      if (!node) {
        assert(
          false,
          data.type + " not found in " + JSON.stringify(Object.keys(state2.choice))
        );
      }
      return node._encode(data.value, reporter);
    }, "encodeChoice");
    Node.prototype._encodePrimitive = /* @__PURE__ */ __name(function encodePrimitive(tag, data) {
      const state2 = this._baseState;
      if (/str$/.test(tag))
        return this._encodeStr(data, tag);
      else if (tag === "objid" && state2.args)
        return this._encodeObjid(data, state2.reverseArgs[0], state2.args[1]);
      else if (tag === "objid")
        return this._encodeObjid(data, null, null);
      else if (tag === "gentime" || tag === "utctime")
        return this._encodeTime(data, tag);
      else if (tag === "null_")
        return this._encodeNull();
      else if (tag === "int" || tag === "enum")
        return this._encodeInt(data, state2.args && state2.reverseArgs[0]);
      else if (tag === "bool")
        return this._encodeBool(data);
      else if (tag === "objDesc")
        return this._encodeStr(data, tag);
      else
        throw new Error("Unsupported tag: " + tag);
    }, "encodePrimitive");
    Node.prototype._isNumstr = /* @__PURE__ */ __name(function isNumstr(str) {
      return /^[0-9 ]*$/.test(str);
    }, "isNumstr");
    Node.prototype._isPrintstr = /* @__PURE__ */ __name(function isPrintstr(str) {
      return /^[A-Za-z0-9 '()+,-./:=?]*$/.test(str);
    }, "isPrintstr");
  }
});

// node_modules/asn1.js/lib/asn1/constants/der.js
var require_der = __commonJS({
  "node_modules/asn1.js/lib/asn1/constants/der.js"(exports) {
    "use strict";
    function reverse(map2) {
      const res = {};
      Object.keys(map2).forEach(function(key) {
        if ((key | 0) == key)
          key = key | 0;
        const value = map2[key];
        res[value] = key;
      });
      return res;
    }
    __name(reverse, "reverse");
    exports.tagClass = {
      0: "universal",
      1: "application",
      2: "context",
      3: "private"
    };
    exports.tagClassByName = reverse(exports.tagClass);
    exports.tag = {
      0: "end",
      1: "bool",
      2: "int",
      3: "bitstr",
      4: "octstr",
      5: "null_",
      6: "objid",
      7: "objDesc",
      8: "external",
      9: "real",
      10: "enum",
      11: "embed",
      12: "utf8str",
      13: "relativeOid",
      16: "seq",
      17: "set",
      18: "numstr",
      19: "printstr",
      20: "t61str",
      21: "videostr",
      22: "ia5str",
      23: "utctime",
      24: "gentime",
      25: "graphstr",
      26: "iso646str",
      27: "genstr",
      28: "unistr",
      29: "charstr",
      30: "bmpstr"
    };
    exports.tagByName = reverse(exports.tag);
  }
});

// node_modules/asn1.js/lib/asn1/encoders/der.js
var require_der2 = __commonJS({
  "node_modules/asn1.js/lib/asn1/encoders/der.js"(exports, module2) {
    "use strict";
    var inherits = require_inherits();
    var Buffer5 = require_safer().Buffer;
    var Node = require_node();
    var der = require_der();
    function DEREncoder(entity) {
      this.enc = "der";
      this.name = entity.name;
      this.entity = entity;
      this.tree = new DERNode();
      this.tree._init(entity.body);
    }
    __name(DEREncoder, "DEREncoder");
    module2.exports = DEREncoder;
    DEREncoder.prototype.encode = /* @__PURE__ */ __name(function encode(data, reporter) {
      return this.tree._encode(data, reporter).join();
    }, "encode");
    function DERNode(parent) {
      Node.call(this, "der", parent);
    }
    __name(DERNode, "DERNode");
    inherits(DERNode, Node);
    DERNode.prototype._encodeComposite = /* @__PURE__ */ __name(function encodeComposite(tag, primitive, cls, content) {
      const encodedTag = encodeTag(tag, primitive, cls, this.reporter);
      if (content.length < 128) {
        const header2 = Buffer5.alloc(2);
        header2[0] = encodedTag;
        header2[1] = content.length;
        return this._createEncoderBuffer([header2, content]);
      }
      let lenOctets = 1;
      for (let i6 = content.length; i6 >= 256; i6 >>= 8)
        lenOctets++;
      const header = Buffer5.alloc(1 + 1 + lenOctets);
      header[0] = encodedTag;
      header[1] = 128 | lenOctets;
      for (let i6 = 1 + lenOctets, j6 = content.length; j6 > 0; i6--, j6 >>= 8)
        header[i6] = j6 & 255;
      return this._createEncoderBuffer([header, content]);
    }, "encodeComposite");
    DERNode.prototype._encodeStr = /* @__PURE__ */ __name(function encodeStr(str, tag) {
      if (tag === "bitstr") {
        return this._createEncoderBuffer([str.unused | 0, str.data]);
      } else if (tag === "bmpstr") {
        const buf = Buffer5.alloc(str.length * 2);
        for (let i6 = 0; i6 < str.length; i6++) {
          buf.writeUInt16BE(str.charCodeAt(i6), i6 * 2);
        }
        return this._createEncoderBuffer(buf);
      } else if (tag === "numstr") {
        if (!this._isNumstr(str)) {
          return this.reporter.error("Encoding of string type: numstr supports only digits and space");
        }
        return this._createEncoderBuffer(str);
      } else if (tag === "printstr") {
        if (!this._isPrintstr(str)) {
          return this.reporter.error("Encoding of string type: printstr supports only latin upper and lower case letters, digits, space, apostrophe, left and rigth parenthesis, plus sign, comma, hyphen, dot, slash, colon, equal sign, question mark");
        }
        return this._createEncoderBuffer(str);
      } else if (/str$/.test(tag)) {
        return this._createEncoderBuffer(str);
      } else if (tag === "objDesc") {
        return this._createEncoderBuffer(str);
      } else {
        return this.reporter.error("Encoding of string type: " + tag + " unsupported");
      }
    }, "encodeStr");
    DERNode.prototype._encodeObjid = /* @__PURE__ */ __name(function encodeObjid(id, values, relative) {
      if (typeof id === "string") {
        if (!values)
          return this.reporter.error("string objid given, but no values map found");
        if (!values.hasOwnProperty(id))
          return this.reporter.error("objid not found in values map");
        id = values[id].split(/[\s.]+/g);
        for (let i6 = 0; i6 < id.length; i6++)
          id[i6] |= 0;
      } else if (Array.isArray(id)) {
        id = id.slice();
        for (let i6 = 0; i6 < id.length; i6++)
          id[i6] |= 0;
      }
      if (!Array.isArray(id)) {
        return this.reporter.error("objid() should be either array or string, got: " + JSON.stringify(id));
      }
      if (!relative) {
        if (id[1] >= 40)
          return this.reporter.error("Second objid identifier OOB");
        id.splice(0, 2, id[0] * 40 + id[1]);
      }
      let size = 0;
      for (let i6 = 0; i6 < id.length; i6++) {
        let ident = id[i6];
        for (size++; ident >= 128; ident >>= 7)
          size++;
      }
      const objid = Buffer5.alloc(size);
      let offset = objid.length - 1;
      for (let i6 = id.length - 1; i6 >= 0; i6--) {
        let ident = id[i6];
        objid[offset--] = ident & 127;
        while ((ident >>= 7) > 0)
          objid[offset--] = 128 | ident & 127;
      }
      return this._createEncoderBuffer(objid);
    }, "encodeObjid");
    function two(num) {
      if (num < 10)
        return "0" + num;
      else
        return num;
    }
    __name(two, "two");
    DERNode.prototype._encodeTime = /* @__PURE__ */ __name(function encodeTime(time, tag) {
      let str;
      const date = new Date(time);
      if (tag === "gentime") {
        str = [
          two(date.getUTCFullYear()),
          two(date.getUTCMonth() + 1),
          two(date.getUTCDate()),
          two(date.getUTCHours()),
          two(date.getUTCMinutes()),
          two(date.getUTCSeconds()),
          "Z"
        ].join("");
      } else if (tag === "utctime") {
        str = [
          two(date.getUTCFullYear() % 100),
          two(date.getUTCMonth() + 1),
          two(date.getUTCDate()),
          two(date.getUTCHours()),
          two(date.getUTCMinutes()),
          two(date.getUTCSeconds()),
          "Z"
        ].join("");
      } else {
        this.reporter.error("Encoding " + tag + " time is not supported yet");
      }
      return this._encodeStr(str, "octstr");
    }, "encodeTime");
    DERNode.prototype._encodeNull = /* @__PURE__ */ __name(function encodeNull() {
      return this._createEncoderBuffer("");
    }, "encodeNull");
    DERNode.prototype._encodeInt = /* @__PURE__ */ __name(function encodeInt(num, values) {
      if (typeof num === "string") {
        if (!values)
          return this.reporter.error("String int or enum given, but no values map");
        if (!values.hasOwnProperty(num)) {
          return this.reporter.error("Values map doesn't contain: " + JSON.stringify(num));
        }
        num = values[num];
      }
      if (typeof num !== "number" && !Buffer5.isBuffer(num)) {
        const numArray = num.toArray();
        if (!num.sign && numArray[0] & 128) {
          numArray.unshift(0);
        }
        num = Buffer5.from(numArray);
      }
      if (Buffer5.isBuffer(num)) {
        let size2 = num.length;
        if (num.length === 0)
          size2++;
        const out2 = Buffer5.alloc(size2);
        num.copy(out2);
        if (num.length === 0)
          out2[0] = 0;
        return this._createEncoderBuffer(out2);
      }
      if (num < 128)
        return this._createEncoderBuffer(num);
      if (num < 256)
        return this._createEncoderBuffer([0, num]);
      let size = 1;
      for (let i6 = num; i6 >= 256; i6 >>= 8)
        size++;
      const out = new Array(size);
      for (let i6 = out.length - 1; i6 >= 0; i6--) {
        out[i6] = num & 255;
        num >>= 8;
      }
      if (out[0] & 128) {
        out.unshift(0);
      }
      return this._createEncoderBuffer(Buffer5.from(out));
    }, "encodeInt");
    DERNode.prototype._encodeBool = /* @__PURE__ */ __name(function encodeBool(value) {
      return this._createEncoderBuffer(value ? 255 : 0);
    }, "encodeBool");
    DERNode.prototype._use = /* @__PURE__ */ __name(function use(entity, obj) {
      if (typeof entity === "function")
        entity = entity(obj);
      return entity._getEncoder("der").tree;
    }, "use");
    DERNode.prototype._skipDefault = /* @__PURE__ */ __name(function skipDefault(dataBuffer, reporter, parent) {
      const state2 = this._baseState;
      let i6;
      if (state2["default"] === null)
        return false;
      const data = dataBuffer.join();
      if (state2.defaultBuffer === void 0)
        state2.defaultBuffer = this._encodeValue(state2["default"], reporter, parent).join();
      if (data.length !== state2.defaultBuffer.length)
        return false;
      for (i6 = 0; i6 < data.length; i6++)
        if (data[i6] !== state2.defaultBuffer[i6])
          return false;
      return true;
    }, "skipDefault");
    function encodeTag(tag, primitive, cls, reporter) {
      let res;
      if (tag === "seqof")
        tag = "seq";
      else if (tag === "setof")
        tag = "set";
      if (der.tagByName.hasOwnProperty(tag))
        res = der.tagByName[tag];
      else if (typeof tag === "number" && (tag | 0) === tag)
        res = tag;
      else
        return reporter.error("Unknown tag: " + tag);
      if (res >= 31)
        return reporter.error("Multi-octet tag encoding unsupported");
      if (!primitive)
        res |= 32;
      res |= der.tagClassByName[cls || "universal"] << 6;
      return res;
    }
    __name(encodeTag, "encodeTag");
  }
});

// node_modules/asn1.js/lib/asn1/encoders/pem.js
var require_pem = __commonJS({
  "node_modules/asn1.js/lib/asn1/encoders/pem.js"(exports, module2) {
    "use strict";
    var inherits = require_inherits();
    var DEREncoder = require_der2();
    function PEMEncoder(entity) {
      DEREncoder.call(this, entity);
      this.enc = "pem";
    }
    __name(PEMEncoder, "PEMEncoder");
    inherits(PEMEncoder, DEREncoder);
    module2.exports = PEMEncoder;
    PEMEncoder.prototype.encode = /* @__PURE__ */ __name(function encode(data, options) {
      const buf = DEREncoder.prototype.encode.call(this, data);
      const p6 = buf.toString("base64");
      const out = ["-----BEGIN " + options.label + "-----"];
      for (let i6 = 0; i6 < p6.length; i6 += 64)
        out.push(p6.slice(i6, i6 + 64));
      out.push("-----END " + options.label + "-----");
      return out.join("\n");
    }, "encode");
  }
});

// node_modules/asn1.js/lib/asn1/encoders/index.js
var require_encoders = __commonJS({
  "node_modules/asn1.js/lib/asn1/encoders/index.js"(exports) {
    "use strict";
    var encoders = exports;
    encoders.der = require_der2();
    encoders.pem = require_pem();
  }
});

// node_modules/asn1.js/lib/asn1/decoders/der.js
var require_der3 = __commonJS({
  "node_modules/asn1.js/lib/asn1/decoders/der.js"(exports, module2) {
    "use strict";
    var inherits = require_inherits();
    var bignum = require_bn();
    var DecoderBuffer = require_buffer().DecoderBuffer;
    var Node = require_node();
    var der = require_der();
    function DERDecoder(entity) {
      this.enc = "der";
      this.name = entity.name;
      this.entity = entity;
      this.tree = new DERNode();
      this.tree._init(entity.body);
    }
    __name(DERDecoder, "DERDecoder");
    module2.exports = DERDecoder;
    DERDecoder.prototype.decode = /* @__PURE__ */ __name(function decode(data, options) {
      if (!DecoderBuffer.isDecoderBuffer(data)) {
        data = new DecoderBuffer(data, options);
      }
      return this.tree._decode(data, options);
    }, "decode");
    function DERNode(parent) {
      Node.call(this, "der", parent);
    }
    __name(DERNode, "DERNode");
    inherits(DERNode, Node);
    DERNode.prototype._peekTag = /* @__PURE__ */ __name(function peekTag(buffer, tag, any) {
      if (buffer.isEmpty())
        return false;
      const state2 = buffer.save();
      const decodedTag = derDecodeTag(buffer, 'Failed to peek tag: "' + tag + '"');
      if (buffer.isError(decodedTag))
        return decodedTag;
      buffer.restore(state2);
      return decodedTag.tag === tag || decodedTag.tagStr === tag || decodedTag.tagStr + "of" === tag || any;
    }, "peekTag");
    DERNode.prototype._decodeTag = /* @__PURE__ */ __name(function decodeTag(buffer, tag, any) {
      const decodedTag = derDecodeTag(
        buffer,
        'Failed to decode tag of "' + tag + '"'
      );
      if (buffer.isError(decodedTag))
        return decodedTag;
      let len = derDecodeLen(
        buffer,
        decodedTag.primitive,
        'Failed to get length of "' + tag + '"'
      );
      if (buffer.isError(len))
        return len;
      if (!any && decodedTag.tag !== tag && decodedTag.tagStr !== tag && decodedTag.tagStr + "of" !== tag) {
        return buffer.error('Failed to match tag: "' + tag + '"');
      }
      if (decodedTag.primitive || len !== null)
        return buffer.skip(len, 'Failed to match body of: "' + tag + '"');
      const state2 = buffer.save();
      const res = this._skipUntilEnd(
        buffer,
        'Failed to skip indefinite length body: "' + this.tag + '"'
      );
      if (buffer.isError(res))
        return res;
      len = buffer.offset - state2.offset;
      buffer.restore(state2);
      return buffer.skip(len, 'Failed to match body of: "' + tag + '"');
    }, "decodeTag");
    DERNode.prototype._skipUntilEnd = /* @__PURE__ */ __name(function skipUntilEnd(buffer, fail) {
      for (; ; ) {
        const tag = derDecodeTag(buffer, fail);
        if (buffer.isError(tag))
          return tag;
        const len = derDecodeLen(buffer, tag.primitive, fail);
        if (buffer.isError(len))
          return len;
        let res;
        if (tag.primitive || len !== null)
          res = buffer.skip(len);
        else
          res = this._skipUntilEnd(buffer, fail);
        if (buffer.isError(res))
          return res;
        if (tag.tagStr === "end")
          break;
      }
    }, "skipUntilEnd");
    DERNode.prototype._decodeList = /* @__PURE__ */ __name(function decodeList(buffer, tag, decoder, options) {
      const result = [];
      while (!buffer.isEmpty()) {
        const possibleEnd = this._peekTag(buffer, "end");
        if (buffer.isError(possibleEnd))
          return possibleEnd;
        const res = decoder.decode(buffer, "der", options);
        if (buffer.isError(res) && possibleEnd)
          break;
        result.push(res);
      }
      return result;
    }, "decodeList");
    DERNode.prototype._decodeStr = /* @__PURE__ */ __name(function decodeStr(buffer, tag) {
      if (tag === "bitstr") {
        const unused = buffer.readUInt8();
        if (buffer.isError(unused))
          return unused;
        return { unused, data: buffer.raw() };
      } else if (tag === "bmpstr") {
        const raw = buffer.raw();
        if (raw.length % 2 === 1)
          return buffer.error("Decoding of string type: bmpstr length mismatch");
        let str = "";
        for (let i6 = 0; i6 < raw.length / 2; i6++) {
          str += String.fromCharCode(raw.readUInt16BE(i6 * 2));
        }
        return str;
      } else if (tag === "numstr") {
        const numstr = buffer.raw().toString("ascii");
        if (!this._isNumstr(numstr)) {
          return buffer.error("Decoding of string type: numstr unsupported characters");
        }
        return numstr;
      } else if (tag === "octstr") {
        return buffer.raw();
      } else if (tag === "objDesc") {
        return buffer.raw();
      } else if (tag === "printstr") {
        const printstr = buffer.raw().toString("ascii");
        if (!this._isPrintstr(printstr)) {
          return buffer.error("Decoding of string type: printstr unsupported characters");
        }
        return printstr;
      } else if (/str$/.test(tag)) {
        return buffer.raw().toString();
      } else {
        return buffer.error("Decoding of string type: " + tag + " unsupported");
      }
    }, "decodeStr");
    DERNode.prototype._decodeObjid = /* @__PURE__ */ __name(function decodeObjid(buffer, values, relative) {
      let result;
      const identifiers = [];
      let ident = 0;
      let subident = 0;
      while (!buffer.isEmpty()) {
        subident = buffer.readUInt8();
        ident <<= 7;
        ident |= subident & 127;
        if ((subident & 128) === 0) {
          identifiers.push(ident);
          ident = 0;
        }
      }
      if (subident & 128)
        identifiers.push(ident);
      const first = identifiers[0] / 40 | 0;
      const second = identifiers[0] % 40;
      if (relative)
        result = identifiers;
      else
        result = [first, second].concat(identifiers.slice(1));
      if (values) {
        let tmp = values[result.join(" ")];
        if (tmp === void 0)
          tmp = values[result.join(".")];
        if (tmp !== void 0)
          result = tmp;
      }
      return result;
    }, "decodeObjid");
    DERNode.prototype._decodeTime = /* @__PURE__ */ __name(function decodeTime(buffer, tag) {
      const str = buffer.raw().toString();
      let year;
      let mon;
      let day;
      let hour;
      let min;
      let sec;
      if (tag === "gentime") {
        year = str.slice(0, 4) | 0;
        mon = str.slice(4, 6) | 0;
        day = str.slice(6, 8) | 0;
        hour = str.slice(8, 10) | 0;
        min = str.slice(10, 12) | 0;
        sec = str.slice(12, 14) | 0;
      } else if (tag === "utctime") {
        year = str.slice(0, 2) | 0;
        mon = str.slice(2, 4) | 0;
        day = str.slice(4, 6) | 0;
        hour = str.slice(6, 8) | 0;
        min = str.slice(8, 10) | 0;
        sec = str.slice(10, 12) | 0;
        if (year < 70)
          year = 2e3 + year;
        else
          year = 1900 + year;
      } else {
        return buffer.error("Decoding " + tag + " time is not supported yet");
      }
      return Date.UTC(year, mon - 1, day, hour, min, sec, 0);
    }, "decodeTime");
    DERNode.prototype._decodeNull = /* @__PURE__ */ __name(function decodeNull() {
      return null;
    }, "decodeNull");
    DERNode.prototype._decodeBool = /* @__PURE__ */ __name(function decodeBool(buffer) {
      const res = buffer.readUInt8();
      if (buffer.isError(res))
        return res;
      else
        return res !== 0;
    }, "decodeBool");
    DERNode.prototype._decodeInt = /* @__PURE__ */ __name(function decodeInt(buffer, values) {
      const raw = buffer.raw();
      let res = new bignum(raw);
      if (values)
        res = values[res.toString(10)] || res;
      return res;
    }, "decodeInt");
    DERNode.prototype._use = /* @__PURE__ */ __name(function use(entity, obj) {
      if (typeof entity === "function")
        entity = entity(obj);
      return entity._getDecoder("der").tree;
    }, "use");
    function derDecodeTag(buf, fail) {
      let tag = buf.readUInt8(fail);
      if (buf.isError(tag))
        return tag;
      const cls = der.tagClass[tag >> 6];
      const primitive = (tag & 32) === 0;
      if ((tag & 31) === 31) {
        let oct = tag;
        tag = 0;
        while ((oct & 128) === 128) {
          oct = buf.readUInt8(fail);
          if (buf.isError(oct))
            return oct;
          tag <<= 7;
          tag |= oct & 127;
        }
      } else {
        tag &= 31;
      }
      const tagStr = der.tag[tag];
      return {
        cls,
        primitive,
        tag,
        tagStr
      };
    }
    __name(derDecodeTag, "derDecodeTag");
    function derDecodeLen(buf, primitive, fail) {
      let len = buf.readUInt8(fail);
      if (buf.isError(len))
        return len;
      if (!primitive && len === 128)
        return null;
      if ((len & 128) === 0) {
        return len;
      }
      const num = len & 127;
      if (num > 4)
        return buf.error("length octect is too long");
      len = 0;
      for (let i6 = 0; i6 < num; i6++) {
        len <<= 8;
        const j6 = buf.readUInt8(fail);
        if (buf.isError(j6))
          return j6;
        len |= j6;
      }
      return len;
    }
    __name(derDecodeLen, "derDecodeLen");
  }
});

// node_modules/asn1.js/lib/asn1/decoders/pem.js
var require_pem2 = __commonJS({
  "node_modules/asn1.js/lib/asn1/decoders/pem.js"(exports, module2) {
    "use strict";
    var inherits = require_inherits();
    var Buffer5 = require_safer().Buffer;
    var DERDecoder = require_der3();
    function PEMDecoder(entity) {
      DERDecoder.call(this, entity);
      this.enc = "pem";
    }
    __name(PEMDecoder, "PEMDecoder");
    inherits(PEMDecoder, DERDecoder);
    module2.exports = PEMDecoder;
    PEMDecoder.prototype.decode = /* @__PURE__ */ __name(function decode(data, options) {
      const lines = data.toString().split(/[\r\n]+/g);
      const label = options.label.toUpperCase();
      const re = /^-----(BEGIN|END) ([^-]+)-----$/;
      let start = -1;
      let end = -1;
      for (let i6 = 0; i6 < lines.length; i6++) {
        const match = lines[i6].match(re);
        if (match === null)
          continue;
        if (match[2] !== label)
          continue;
        if (start === -1) {
          if (match[1] !== "BEGIN")
            break;
          start = i6;
        } else {
          if (match[1] !== "END")
            break;
          end = i6;
          break;
        }
      }
      if (start === -1 || end === -1)
        throw new Error("PEM section not found for: " + label);
      const base64 = lines.slice(start + 1, end).join("");
      base64.replace(/[^a-z0-9+/=]+/gi, "");
      const input = Buffer5.from(base64, "base64");
      return DERDecoder.prototype.decode.call(this, input, options);
    }, "decode");
  }
});

// node_modules/asn1.js/lib/asn1/decoders/index.js
var require_decoders = __commonJS({
  "node_modules/asn1.js/lib/asn1/decoders/index.js"(exports) {
    "use strict";
    var decoders = exports;
    decoders.der = require_der3();
    decoders.pem = require_pem2();
  }
});

// node_modules/asn1.js/lib/asn1/api.js
var require_api = __commonJS({
  "node_modules/asn1.js/lib/asn1/api.js"(exports) {
    "use strict";
    var encoders = require_encoders();
    var decoders = require_decoders();
    var inherits = require_inherits();
    var api = exports;
    api.define = /* @__PURE__ */ __name(function define(name, body) {
      return new Entity(name, body);
    }, "define");
    function Entity(name, body) {
      this.name = name;
      this.body = body;
      this.decoders = {};
      this.encoders = {};
    }
    __name(Entity, "Entity");
    Entity.prototype._createNamed = /* @__PURE__ */ __name(function createNamed(Base) {
      const name = this.name;
      function Generated(entity) {
        this._initNamed(entity, name);
      }
      __name(Generated, "Generated");
      inherits(Generated, Base);
      Generated.prototype._initNamed = /* @__PURE__ */ __name(function _initNamed(entity, name2) {
        Base.call(this, entity, name2);
      }, "_initNamed");
      return new Generated(this);
    }, "createNamed");
    Entity.prototype._getDecoder = /* @__PURE__ */ __name(function _getDecoder(enc) {
      enc = enc || "der";
      if (!this.decoders.hasOwnProperty(enc))
        this.decoders[enc] = this._createNamed(decoders[enc]);
      return this.decoders[enc];
    }, "_getDecoder");
    Entity.prototype.decode = /* @__PURE__ */ __name(function decode(data, enc, options) {
      return this._getDecoder(enc).decode(data, options);
    }, "decode");
    Entity.prototype._getEncoder = /* @__PURE__ */ __name(function _getEncoder(enc) {
      enc = enc || "der";
      if (!this.encoders.hasOwnProperty(enc))
        this.encoders[enc] = this._createNamed(encoders[enc]);
      return this.encoders[enc];
    }, "_getEncoder");
    Entity.prototype.encode = /* @__PURE__ */ __name(function encode(data, enc, reporter) {
      return this._getEncoder(enc).encode(data, reporter);
    }, "encode");
  }
});

// node_modules/asn1.js/lib/asn1/base/index.js
var require_base = __commonJS({
  "node_modules/asn1.js/lib/asn1/base/index.js"(exports) {
    "use strict";
    var base = exports;
    base.Reporter = require_reporter().Reporter;
    base.DecoderBuffer = require_buffer().DecoderBuffer;
    base.EncoderBuffer = require_buffer().EncoderBuffer;
    base.Node = require_node();
  }
});

// node_modules/asn1.js/lib/asn1/constants/index.js
var require_constants = __commonJS({
  "node_modules/asn1.js/lib/asn1/constants/index.js"(exports) {
    "use strict";
    var constants = exports;
    constants._reverse = /* @__PURE__ */ __name(function reverse(map2) {
      const res = {};
      Object.keys(map2).forEach(function(key) {
        if ((key | 0) == key)
          key = key | 0;
        const value = map2[key];
        res[value] = key;
      });
      return res;
    }, "reverse");
    constants.der = require_der();
  }
});

// node_modules/asn1.js/lib/asn1.js
var require_asn1 = __commonJS({
  "node_modules/asn1.js/lib/asn1.js"(exports) {
    "use strict";
    var asn1 = exports;
    asn1.bignum = require_bn();
    asn1.define = require_api().define;
    asn1.base = require_base();
    asn1.constants = require_constants();
    asn1.decoders = require_decoders();
    asn1.encoders = require_encoders();
  }
});

// node_modules/safe-buffer/index.js
var require_safe_buffer = __commonJS({
  "node_modules/safe-buffer/index.js"(exports, module2) {
    var buffer = __require("buffer");
    var Buffer5 = buffer.Buffer;
    function copyProps(src, dst) {
      for (var key in src) {
        dst[key] = src[key];
      }
    }
    __name(copyProps, "copyProps");
    if (Buffer5.from && Buffer5.alloc && Buffer5.allocUnsafe && Buffer5.allocUnsafeSlow) {
      module2.exports = buffer;
    } else {
      copyProps(buffer, exports);
      exports.Buffer = SafeBuffer;
    }
    function SafeBuffer(arg, encodingOrOffset, length) {
      return Buffer5(arg, encodingOrOffset, length);
    }
    __name(SafeBuffer, "SafeBuffer");
    SafeBuffer.prototype = Object.create(Buffer5.prototype);
    copyProps(Buffer5, SafeBuffer);
    SafeBuffer.from = function(arg, encodingOrOffset, length) {
      if (typeof arg === "number") {
        throw new TypeError("Argument must not be a number");
      }
      return Buffer5(arg, encodingOrOffset, length);
    };
    SafeBuffer.alloc = function(size, fill, encoding) {
      if (typeof size !== "number") {
        throw new TypeError("Argument must be a number");
      }
      var buf = Buffer5(size);
      if (fill !== void 0) {
        if (typeof encoding === "string") {
          buf.fill(fill, encoding);
        } else {
          buf.fill(fill);
        }
      } else {
        buf.fill(0);
      }
      return buf;
    };
    SafeBuffer.allocUnsafe = function(size) {
      if (typeof size !== "number") {
        throw new TypeError("Argument must be a number");
      }
      return Buffer5(size);
    };
    SafeBuffer.allocUnsafeSlow = function(size) {
      if (typeof size !== "number") {
        throw new TypeError("Argument must be a number");
      }
      return buffer.SlowBuffer(size);
    };
  }
});

// node_modules/ecdsa-sig-formatter/src/param-bytes-for-alg.js
var require_param_bytes_for_alg = __commonJS({
  "node_modules/ecdsa-sig-formatter/src/param-bytes-for-alg.js"(exports, module2) {
    "use strict";
    function getParamSize(keySize) {
      var result = (keySize / 8 | 0) + (keySize % 8 === 0 ? 0 : 1);
      return result;
    }
    __name(getParamSize, "getParamSize");
    var paramBytesForAlg = {
      ES256: getParamSize(256),
      ES384: getParamSize(384),
      ES512: getParamSize(521)
    };
    function getParamBytesForAlg(alg) {
      var paramBytes = paramBytesForAlg[alg];
      if (paramBytes) {
        return paramBytes;
      }
      throw new Error('Unknown algorithm "' + alg + '"');
    }
    __name(getParamBytesForAlg, "getParamBytesForAlg");
    module2.exports = getParamBytesForAlg;
  }
});

// node_modules/ecdsa-sig-formatter/src/ecdsa-sig-formatter.js
var require_ecdsa_sig_formatter = __commonJS({
  "node_modules/ecdsa-sig-formatter/src/ecdsa-sig-formatter.js"(exports, module2) {
    "use strict";
    var Buffer5 = require_safe_buffer().Buffer;
    var getParamBytesForAlg = require_param_bytes_for_alg();
    var MAX_OCTET = 128;
    var CLASS_UNIVERSAL = 0;
    var PRIMITIVE_BIT = 32;
    var TAG_SEQ = 16;
    var TAG_INT = 2;
    var ENCODED_TAG_SEQ = TAG_SEQ | PRIMITIVE_BIT | CLASS_UNIVERSAL << 6;
    var ENCODED_TAG_INT = TAG_INT | CLASS_UNIVERSAL << 6;
    function base64Url(base64) {
      return base64.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
    }
    __name(base64Url, "base64Url");
    function signatureAsBuffer(signature) {
      if (Buffer5.isBuffer(signature)) {
        return signature;
      } else if ("string" === typeof signature) {
        return Buffer5.from(signature, "base64");
      }
      throw new TypeError("ECDSA signature must be a Base64 string or a Buffer");
    }
    __name(signatureAsBuffer, "signatureAsBuffer");
    function derToJose(signature, alg) {
      signature = signatureAsBuffer(signature);
      var paramBytes = getParamBytesForAlg(alg);
      var maxEncodedParamLength = paramBytes + 1;
      var inputLength = signature.length;
      var offset = 0;
      if (signature[offset++] !== ENCODED_TAG_SEQ) {
        throw new Error('Could not find expected "seq"');
      }
      var seqLength = signature[offset++];
      if (seqLength === (MAX_OCTET | 1)) {
        seqLength = signature[offset++];
      }
      if (inputLength - offset < seqLength) {
        throw new Error('"seq" specified length of "' + seqLength + '", only "' + (inputLength - offset) + '" remaining');
      }
      if (signature[offset++] !== ENCODED_TAG_INT) {
        throw new Error('Could not find expected "int" for "r"');
      }
      var rLength = signature[offset++];
      if (inputLength - offset - 2 < rLength) {
        throw new Error('"r" specified length of "' + rLength + '", only "' + (inputLength - offset - 2) + '" available');
      }
      if (maxEncodedParamLength < rLength) {
        throw new Error('"r" specified length of "' + rLength + '", max of "' + maxEncodedParamLength + '" is acceptable');
      }
      var rOffset = offset;
      offset += rLength;
      if (signature[offset++] !== ENCODED_TAG_INT) {
        throw new Error('Could not find expected "int" for "s"');
      }
      var sLength = signature[offset++];
      if (inputLength - offset !== sLength) {
        throw new Error('"s" specified length of "' + sLength + '", expected "' + (inputLength - offset) + '"');
      }
      if (maxEncodedParamLength < sLength) {
        throw new Error('"s" specified length of "' + sLength + '", max of "' + maxEncodedParamLength + '" is acceptable');
      }
      var sOffset = offset;
      offset += sLength;
      if (offset !== inputLength) {
        throw new Error('Expected to consume entire buffer, but "' + (inputLength - offset) + '" bytes remain');
      }
      var rPadding = paramBytes - rLength, sPadding = paramBytes - sLength;
      var dst = Buffer5.allocUnsafe(rPadding + rLength + sPadding + sLength);
      for (offset = 0; offset < rPadding; ++offset) {
        dst[offset] = 0;
      }
      signature.copy(dst, offset, rOffset + Math.max(-rPadding, 0), rOffset + rLength);
      offset = paramBytes;
      for (var o6 = offset; offset < o6 + sPadding; ++offset) {
        dst[offset] = 0;
      }
      signature.copy(dst, offset, sOffset + Math.max(-sPadding, 0), sOffset + sLength);
      dst = dst.toString("base64");
      dst = base64Url(dst);
      return dst;
    }
    __name(derToJose, "derToJose");
    function countPadding(buf, start, stop) {
      var padding = 0;
      while (start + padding < stop && buf[start + padding] === 0) {
        ++padding;
      }
      var needsSign = buf[start + padding] >= MAX_OCTET;
      if (needsSign) {
        --padding;
      }
      return padding;
    }
    __name(countPadding, "countPadding");
    function joseToDer(signature, alg) {
      signature = signatureAsBuffer(signature);
      var paramBytes = getParamBytesForAlg(alg);
      var signatureBytes = signature.length;
      if (signatureBytes !== paramBytes * 2) {
        throw new TypeError('"' + alg + '" signatures must be "' + paramBytes * 2 + '" bytes, saw "' + signatureBytes + '"');
      }
      var rPadding = countPadding(signature, 0, paramBytes);
      var sPadding = countPadding(signature, paramBytes, signature.length);
      var rLength = paramBytes - rPadding;
      var sLength = paramBytes - sPadding;
      var rsBytes = 1 + 1 + rLength + 1 + 1 + sLength;
      var shortLength = rsBytes < MAX_OCTET;
      var dst = Buffer5.allocUnsafe((shortLength ? 2 : 3) + rsBytes);
      var offset = 0;
      dst[offset++] = ENCODED_TAG_SEQ;
      if (shortLength) {
        dst[offset++] = rsBytes;
      } else {
        dst[offset++] = MAX_OCTET | 1;
        dst[offset++] = rsBytes & 255;
      }
      dst[offset++] = ENCODED_TAG_INT;
      dst[offset++] = rLength;
      if (rPadding < 0) {
        dst[offset++] = 0;
        offset += signature.copy(dst, offset, 0, paramBytes);
      } else {
        offset += signature.copy(dst, offset, rPadding, paramBytes);
      }
      dst[offset++] = ENCODED_TAG_INT;
      dst[offset++] = sLength;
      if (sPadding < 0) {
        dst[offset++] = 0;
        signature.copy(dst, offset, paramBytes);
      } else {
        signature.copy(dst, offset, paramBytes + sPadding);
      }
      return dst;
    }
    __name(joseToDer, "joseToDer");
    module2.exports = {
      derToJose,
      joseToDer
    };
  }
});

// node_modules/fast-jwt/src/crypto.js
var require_crypto2 = __commonJS({
  "node_modules/fast-jwt/src/crypto.js"(exports, module2) {
    "use strict";
    var asn = require_asn1();
    var {
      createHmac: createHmac2,
      createVerify,
      createSign,
      timingSafeEqual,
      createPublicKey,
      constants: {
        RSA_PKCS1_PSS_PADDING,
        RSA_PSS_SALTLEN_DIGEST,
        RSA_PKCS1_PADDING,
        RSA_PSS_SALTLEN_MAX_SIGN,
        RSA_PSS_SALTLEN_AUTO
      }
    } = __require("crypto");
    var { sign: directSign, verify: directVerify } = __require("crypto");
    var { joseToDer, derToJose } = require_ecdsa_sig_formatter();
    var Cache = require_lru_cache();
    var TokenError = require_error2();
    var useNewCrypto = typeof directSign === "function";
    var base64UrlMatcher = /[=+/]/g;
    var encoderMap = { "=": "", "+": "-", "/": "_" };
    var privateKeyPemMatcher = /^-----BEGIN(?: (RSA|EC|ENCRYPTED))? PRIVATE KEY-----/;
    var publicKeyPemMatcher = "-----BEGIN PUBLIC KEY-----";
    var publicKeyX509CertMatcher = "-----BEGIN CERTIFICATE-----";
    var privateKeysCache = new Cache(1e3);
    var publicKeysCache = new Cache(1e3);
    var hsAlgorithms = ["HS256", "HS384", "HS512"];
    var esAlgorithms = ["ES256", "ES384", "ES512"];
    var rsaAlgorithms = ["RS256", "RS384", "RS512", "PS256", "PS384", "PS512"];
    var edAlgorithms = ["EdDSA"];
    var ecCurves = {
      "1.2.840.10045.3.1.7": { bits: "256", names: ["P-256", "prime256v1"] },
      "1.3.132.0.10": { bits: "256", names: ["secp256k1"] },
      "1.3.132.0.34": { bits: "384", names: ["P-384", "secp384r1"] },
      "1.3.132.0.35": { bits: "512", names: ["P-521", "secp521r1"] }
    };
    if (!useNewCrypto) {
      directSign = /* @__PURE__ */ __name(function(alg, data, options) {
        if (typeof alg === "undefined") {
          throw new TokenError(TokenError.codes.signError, "EdDSA algorithms are not supported by your Node.js version.");
        }
        return createSign(alg).update(data).sign(options);
      }, "directSign");
    }
    var PrivateKey = asn.define("PrivateKey", function() {
      this.seq().obj(
        this.key("version").int(),
        this.key("algorithm").seq().obj(
          this.key("algorithm").objid(),
          this.key("parameters").optional().objid()
        )
      );
    });
    var PublicKey = asn.define("PublicKey", function() {
      this.seq().obj(
        this.key("algorithm").seq().obj(
          this.key("algorithm").objid(),
          this.key("parameters").optional().objid()
        )
      );
    });
    var ECPrivateKey = asn.define("ECPrivateKey", function() {
      this.seq().obj(
        this.key("version").int(),
        this.key("privateKey").octstr(),
        this.key("parameters").explicit(0).optional().choice({ namedCurve: this.objid() })
      );
    });
    function base64UrlReplacer(c6) {
      return encoderMap[c6];
    }
    __name(base64UrlReplacer, "base64UrlReplacer");
    function cacheSet(cache, key, value, error) {
      cache.set(key, [value, error]);
      return value || error;
    }
    __name(cacheSet, "cacheSet");
    function performDetectPrivateKeyAlgorithm(key) {
      if (key.includes(publicKeyPemMatcher) || key.includes(publicKeyX509CertMatcher)) {
        throw new TokenError(TokenError.codes.invalidKey, "Public keys are not supported for signing.");
      }
      const pemData = key.trim().match(privateKeyPemMatcher);
      if (!pemData) {
        return "HS256";
      }
      let keyData;
      let oid;
      let curveId;
      switch (pemData[1]) {
        case "RSA":
          return "RS256";
        case "EC":
          keyData = ECPrivateKey.decode(key, "pem", { label: "EC PRIVATE KEY" });
          curveId = keyData.parameters.value.join(".");
          break;
        case "ENCRYPTED":
          return "ENCRYPTED";
        default:
          keyData = PrivateKey.decode(key, "pem", { label: "PRIVATE KEY" });
          oid = keyData.algorithm.algorithm.join(".");
          switch (oid) {
            case "1.2.840.113549.1.1.1":
              return "RS256";
            case "1.2.840.10045.2.1":
              curveId = keyData.algorithm.parameters.join(".");
              break;
            case "1.3.101.112":
            case "1.3.101.113":
              return "EdDSA";
            default:
              throw new TokenError(TokenError.codes.invalidKey, `Unsupported PEM PCKS8 private key with OID ${oid}.`);
          }
      }
      const curve = ecCurves[curveId];
      if (!curve) {
        throw new TokenError(TokenError.codes.invalidKey, `Unsupported EC private key with curve ${curveId}.`);
      }
      return `ES${curve.bits}`;
    }
    __name(performDetectPrivateKeyAlgorithm, "performDetectPrivateKeyAlgorithm");
    function performDetectPublicKeyAlgorithms(key) {
      if (key.match(privateKeyPemMatcher)) {
        throw new TokenError(TokenError.codes.invalidKey, "Private keys are not supported for verifying.");
      } else if (!key.includes(publicKeyPemMatcher) && !key.includes(publicKeyX509CertMatcher)) {
        return hsAlgorithms;
      }
      if (key.includes(publicKeyX509CertMatcher)) {
        key = createPublicKey(key).export({ type: "spki", format: "pem" });
      }
      const keyData = PublicKey.decode(key, "pem", { label: "PUBLIC KEY" });
      const oid = keyData.algorithm.algorithm.join(".");
      let curveId;
      switch (oid) {
        case "1.2.840.113549.1.1.1":
          return rsaAlgorithms;
        case "1.2.840.10045.2.1":
          curveId = keyData.algorithm.parameters.join(".");
          break;
        case "1.3.101.112":
        case "1.3.101.113":
          return ["EdDSA"];
        default:
          throw new TokenError(TokenError.codes.invalidKey, `Unsupported PEM PCKS8 public key with OID ${oid}.`);
      }
      const curve = ecCurves[curveId];
      if (!curve) {
        throw new TokenError(TokenError.codes.invalidKey, `Unsupported EC public key with curve ${curveId}.`);
      }
      return [`ES${curve.bits}`];
    }
    __name(performDetectPublicKeyAlgorithms, "performDetectPublicKeyAlgorithms");
    function detectPrivateKeyAlgorithm(key, providedAlgorithm) {
      if (key instanceof Buffer) {
        key = key.toString("utf-8");
      } else if (typeof key !== "string") {
        throw new TokenError(TokenError.codes.invalidKey, "The private key must be a string or a buffer.");
      }
      const [cached, error] = privateKeysCache.get(key) || [];
      if (cached) {
        return cached;
      } else if (error) {
        throw error;
      }
      try {
        const detectedAlgorithm = performDetectPrivateKeyAlgorithm(key);
        if (detectedAlgorithm === "ENCRYPTED") {
          return cacheSet(privateKeysCache, key, providedAlgorithm);
        }
        return cacheSet(privateKeysCache, key, detectedAlgorithm);
      } catch (e6) {
        throw cacheSet(privateKeysCache, key, null, TokenError.wrap(e6, TokenError.codes.invalidKey, "Unsupported PEM private key."));
      }
    }
    __name(detectPrivateKeyAlgorithm, "detectPrivateKeyAlgorithm");
    function detectPublicKeyAlgorithms(key) {
      if (!key) {
        return "none";
      }
      const [cached, error] = publicKeysCache.get(key) || [];
      if (cached) {
        return cached;
      } else if (error) {
        throw error;
      }
      try {
        if (key instanceof Buffer) {
          key = key.toString("utf-8");
        } else if (typeof key !== "string") {
          throw new TokenError(TokenError.codes.invalidKey, "The public key must be a string or a buffer.");
        }
        return cacheSet(publicKeysCache, key, performDetectPublicKeyAlgorithms(key));
      } catch (e6) {
        throw cacheSet(
          publicKeysCache,
          key,
          null,
          TokenError.wrap(e6, TokenError.codes.invalidKey, "Unsupported PEM public key.")
        );
      }
    }
    __name(detectPublicKeyAlgorithms, "detectPublicKeyAlgorithms");
    function createSignature(algorithm, key, input) {
      try {
        const type = algorithm.slice(0, 2);
        const alg = `sha${algorithm.slice(2)}`;
        let raw;
        let options;
        switch (type) {
          case "HS":
            raw = createHmac2(alg, key).update(input).digest("base64");
            break;
          case "ES":
            raw = derToJose(directSign(alg, Buffer.from(input, "utf-8"), key), algorithm).toString("base64");
            break;
          case "RS":
          case "PS":
            options = {
              key,
              padding: RSA_PKCS1_PADDING,
              saltLength: RSA_PSS_SALTLEN_MAX_SIGN
            };
            if (type === "PS") {
              options.padding = RSA_PKCS1_PSS_PADDING;
              options.saltLength = RSA_PSS_SALTLEN_DIGEST;
            }
            raw = createSign(alg).update(input).sign(options).toString("base64");
            break;
          case "Ed":
            raw = directSign(void 0, Buffer.from(input, "utf-8"), key).toString("base64");
        }
        return raw.replace(base64UrlMatcher, base64UrlReplacer);
      } catch (e6) {
        throw new TokenError(TokenError.codes.signError, "Cannot create the signature.", { originalError: e6 });
      }
    }
    __name(createSignature, "createSignature");
    function verifySignature(algorithm, key, input, signature) {
      try {
        const type = algorithm.slice(0, 2);
        const alg = `SHA${algorithm.slice(2)}`;
        signature = Buffer.from(signature, "base64");
        if (type === "HS") {
          try {
            return timingSafeEqual(
              createHmac2(alg, key).update(input).digest(),
              signature
            );
          } catch (e6) {
            return false;
          }
        } else if (type === "Ed") {
          if (typeof directVerify === "function") {
            return directVerify(void 0, Buffer.from(input, "utf-8"), key, signature);
          } else {
            throw new TokenError(TokenError.codes.signError, "EdDSA algorithms are not supported by your Node.js version.");
          }
        }
        const options = { key, padding: RSA_PKCS1_PADDING, saltLength: RSA_PSS_SALTLEN_AUTO };
        if (type === "PS") {
          options.padding = RSA_PKCS1_PSS_PADDING;
          options.saltLength = RSA_PSS_SALTLEN_DIGEST;
        } else if (type === "ES") {
          signature = joseToDer(signature, algorithm);
        }
        return createVerify("RSA-" + alg).update(input).verify(options, signature);
      } catch (e6) {
        throw new TokenError(TokenError.codes.verifyError, "Cannot verify the signature.", { originalError: e6 });
      }
    }
    __name(verifySignature, "verifySignature");
    module2.exports = {
      useNewCrypto,
      base64UrlMatcher,
      base64UrlReplacer,
      hsAlgorithms,
      rsaAlgorithms,
      esAlgorithms,
      edAlgorithms,
      detectPrivateKeyAlgorithm,
      detectPublicKeyAlgorithms,
      createSignature,
      verifySignature
    };
  }
});

// node_modules/fast-jwt/src/utils.js
var require_utils = __commonJS({
  "node_modules/fast-jwt/src/utils.js"(exports, module2) {
    "use strict";
    var { createHash: createHash3 } = __require("crypto");
    var algorithmMatcher = /"alg"\s*:\s*"[HERP]S(256|384)"/m;
    var edAlgorithmMatcher = /"alg"\s*:\s*"EdDSA"/m;
    var ed448CurveMatcher = /"crv"\s*:\s*"Ed448"/m;
    function getAsyncKey(handler2, header, callback) {
      const result = handler2(header, callback);
      if (result && typeof result.then === "function") {
        result.then((key) => {
          process.nextTick(() => callback(null, key));
        }).catch(callback);
      }
    }
    __name(getAsyncKey, "getAsyncKey");
    function ensurePromiseCallback(callback) {
      if (typeof callback === "function") {
        return [callback];
      }
      let promiseResolve, promiseReject;
      const promise = new Promise((resolve, reject) => {
        promiseResolve = resolve;
        promiseReject = reject;
      });
      return [
        function(err, token) {
          if (err) {
            return promiseReject(err);
          }
          return promiseResolve(token);
        },
        promise
      ];
    }
    __name(ensurePromiseCallback, "ensurePromiseCallback");
    function hashToken(token) {
      const rawHeader = token.split(".", 1)[0];
      const header = Buffer.from(rawHeader, "base64").toString("utf-8");
      let hasher = null;
      if (header.match(edAlgorithmMatcher) && header.match(ed448CurveMatcher)) {
        hasher = createHash3("shake256", { outputLength: 114 });
      } else {
        const mo = header.match(algorithmMatcher);
        hasher = createHash3(`sha${mo ? mo[1] : "512"}`);
      }
      return hasher.update(token).digest("hex");
    }
    __name(hashToken, "hashToken");
    module2.exports = {
      getAsyncKey,
      ensurePromiseCallback,
      hashToken
    };
  }
});

// node_modules/fast-jwt/src/verifier.js
var require_verifier = __commonJS({
  "node_modules/fast-jwt/src/verifier.js"(exports, module2) {
    "use strict";
    var { createPublicKey, createSecretKey } = __require("crypto");
    var Cache = require_lru_cache();
    var { useNewCrypto, hsAlgorithms, verifySignature, detectPublicKeyAlgorithms } = require_crypto2();
    var createDecoder = require_decoder();
    var TokenError = require_error2();
    var { getAsyncKey, ensurePromiseCallback, hashToken } = require_utils();
    var defaultCacheSize = 1e3;
    function exactStringClaimMatcher(allowed, actual) {
      return allowed === actual;
    }
    __name(exactStringClaimMatcher, "exactStringClaimMatcher");
    function checkAreCompatibleAlgorithms(expected, actual) {
      let valid = false;
      for (const expectedAlg of expected) {
        valid = actual.indexOf(expectedAlg) !== -1;
        if (valid) {
          break;
        }
      }
      if (!valid) {
        throw new TokenError(
          TokenError.codes.invalidKey,
          `Invalid public key provided for algorithms ${expected.join(", ")}.`
        );
      }
    }
    __name(checkAreCompatibleAlgorithms, "checkAreCompatibleAlgorithms");
    function prepareKeyOrSecret(key, isSecret) {
      if (typeof key === "string") {
        key = Buffer.from(key, "utf-8");
      }
      if (useNewCrypto) {
        key = isSecret ? createSecretKey(key) : createPublicKey(key);
      }
      return key;
    }
    __name(prepareKeyOrSecret, "prepareKeyOrSecret");
    function ensureStringClaimMatcher(raw) {
      if (!Array.isArray(raw)) {
        raw = [raw];
      }
      return raw.filter((r6) => r6).map((r6) => {
        if (r6 && typeof r6.test === "function") {
          return r6;
        }
        return { test: exactStringClaimMatcher.bind(null, r6) };
      });
    }
    __name(ensureStringClaimMatcher, "ensureStringClaimMatcher");
    function createCache(rawSize) {
      const size = parseInt(rawSize === true ? defaultCacheSize : rawSize, 10);
      return size > 0 ? new Cache(size) : null;
    }
    __name(createCache, "createCache");
    function cacheSet({ cache, token, cacheTTL, payload, ignoreExpiration, ignoreNotBefore, maxAge, clockTimestamp, clockTolerance }, value) {
      if (!cache) {
        return value;
      }
      const cacheValue = [value, 0, 0];
      const hasIat = payload && typeof payload.iat === "number";
      if (hasIat) {
        cacheValue[1] = !ignoreNotBefore && typeof payload.nbf === "number" ? payload.nbf * 1e3 - clockTolerance : 0;
        if (!ignoreExpiration) {
          if (typeof payload.exp === "number") {
            cacheValue[2] = payload.exp * 1e3 + clockTolerance;
          } else if (maxAge) {
            cacheValue[2] = payload.iat * 1e3 + maxAge + clockTolerance;
          }
        }
      }
      const maxTTL = (clockTimestamp || Date.now()) + clockTolerance + cacheTTL;
      cacheValue[2] = cacheValue[2] === 0 ? maxTTL : Math.min(cacheValue[2], maxTTL);
      cache.set(hashToken(token), cacheValue);
      return value;
    }
    __name(cacheSet, "cacheSet");
    function handleCachedResult(cached, callback, promise) {
      if (cached instanceof TokenError) {
        if (!callback) {
          throw cached;
        }
        callback(cached);
      } else {
        if (!callback) {
          return cached;
        }
        callback(null, cached);
      }
      return promise;
    }
    __name(handleCachedResult, "handleCachedResult");
    function validateAlgorithmAndSignature(input, header, signature, key, allowedAlgorithms) {
      const algorithms = allowedAlgorithms;
      if (!algorithms.includes(header.alg)) {
        throw new TokenError(TokenError.codes.invalidAlgorithm, "The token algorithm is invalid.");
      }
      if (signature && !verifySignature(header.alg, key, input, signature)) {
        throw new TokenError(TokenError.codes.invalidSignature, "The token signature is invalid.");
      }
    }
    __name(validateAlgorithmAndSignature, "validateAlgorithmAndSignature");
    function validateClaimType(values, claim, array, type) {
      const typeFailureMessage = array ? `The ${claim} claim must be a ${type} or an array of ${type}s.` : `The ${claim} claim must be a ${type}.`;
      if (values.map((v5) => typeof v5).some((t4) => t4 !== type)) {
        throw new TokenError(TokenError.codes.invalidClaimType, typeFailureMessage);
      }
    }
    __name(validateClaimType, "validateClaimType");
    function validateClaimValues(values, claim, allowed, arrayValue) {
      const failureMessage = arrayValue ? `None of ${claim} claim values are allowed.` : `The ${claim} claim value is not allowed.`;
      if (!values.some((v5) => allowed.some((a6) => a6.test(v5)))) {
        throw new TokenError(TokenError.codes.invalidClaimValue, failureMessage);
      }
    }
    __name(validateClaimValues, "validateClaimValues");
    function validateClaimDateValue(value, modifier, now, greater, errorCode, errorVerb) {
      const adjusted = value * 1e3 + (modifier || 0);
      const valid = greater ? now >= adjusted : now <= adjusted;
      if (!valid) {
        throw new TokenError(TokenError.codes[errorCode], `The token ${errorVerb} at ${new Date(adjusted).toISOString()}.`);
      }
    }
    __name(validateClaimDateValue, "validateClaimDateValue");
    function verifyToken(key, { input, header, payload, signature }, { validators, allowedAlgorithms, checkTyp, clockTimestamp, clockTolerance, requiredClaims }) {
      const hasKey = key instanceof Buffer ? key.length : !!key;
      if (hasKey && !signature) {
        throw new TokenError(TokenError.codes.missingSignature, "The token signature is missing.");
      } else if (!hasKey && signature) {
        throw new TokenError(TokenError.codes.missingKey, "The key option is missing.");
      }
      validateAlgorithmAndSignature(input, header, signature, key, allowedAlgorithms);
      if (checkTyp) {
        if (typeof header.typ !== "string" || checkTyp !== header.typ.toLowerCase().replace(/^application\//, "")) {
          throw new TokenError(TokenError.codes.invalidType, "Invalid typ.");
        }
      }
      const now = clockTimestamp || Date.now();
      for (const validator of validators) {
        const { type, claim, allowed, array, modifier, greater, errorCode, errorVerb } = validator;
        const value = payload[claim];
        const arrayValue = Array.isArray(value);
        const values = arrayValue ? value : [value];
        if (!(claim in payload)) {
          if (requiredClaims && requiredClaims.includes(claim)) {
            throw new TokenError(TokenError.codes.missingRequiredClaim, `The ${claim} claim is required.`);
          }
          continue;
        }
        validateClaimType(values, claim, array, type === "date" ? "number" : "string");
        if (type === "date") {
          validateClaimDateValue(value, modifier, now, greater, errorCode, errorVerb);
        } else {
          validateClaimValues(values, claim, allowed, arrayValue);
        }
      }
    }
    __name(verifyToken, "verifyToken");
    function verify({
      key,
      allowedAlgorithms,
      complete,
      cacheTTL,
      checkTyp,
      clockTimestamp,
      clockTolerance,
      ignoreExpiration,
      ignoreNotBefore,
      maxAge,
      isAsync,
      validators,
      decode,
      cache,
      requiredClaims
    }, token, cb) {
      const [callback, promise] = isAsync ? ensurePromiseCallback(cb) : [];
      const cacheContext = {
        cache,
        token,
        cacheTTL,
        payload: void 0,
        ignoreExpiration,
        ignoreNotBefore,
        maxAge,
        clockTimestamp,
        clockTolerance
      };
      if (cache) {
        const [value, min, max] = cache.get(hashToken(token)) || [void 0, 0, 0];
        const now = clockTimestamp || Date.now();
        if (typeof value !== "undefined" && (min === 0 || now < min && value.code === "FAST_JWT_INACTIVE" || now >= min && value.code !== "FAST_JWT_INACTIVE") && (max === 0 || now <= max)) {
          return handleCachedResult(value, callback, promise);
        }
      }
      let decoded;
      try {
        decoded = decode(token);
      } catch (e6) {
        if (callback) {
          callback(e6);
          return promise;
        }
        throw e6;
      }
      const { header, payload, signature } = decoded;
      cacheContext.payload = payload;
      const validationContext = { validators, allowedAlgorithms, checkTyp, clockTimestamp, clockTolerance, requiredClaims };
      if (!callback) {
        try {
          verifyToken(key, decoded, validationContext);
          return cacheSet(cacheContext, complete ? { header, payload, signature } : payload);
        } catch (e6) {
          throw cacheSet(cacheContext, e6);
        }
      }
      getAsyncKey(key, header, (err, currentKey) => {
        if (err) {
          return callback(
            cacheSet(cacheContext, TokenError.wrap(err, TokenError.codes.keyFetchingError, "Cannot fetch key."))
          );
        }
        if (typeof currentKey === "string") {
          currentKey = Buffer.from(currentKey, "utf-8");
        } else if (!(currentKey instanceof Buffer)) {
          return callback(
            cacheSet(
              cacheContext,
              new TokenError(
                TokenError.codes.keyFetchingError,
                "The key returned from the callback must be a string or a buffer containing a secret or a public key."
              )
            )
          );
        }
        try {
          const availableAlgorithms = detectPublicKeyAlgorithms(currentKey);
          if (validationContext.allowedAlgorithms.length) {
            checkAreCompatibleAlgorithms(allowedAlgorithms, availableAlgorithms);
          } else {
            validationContext.allowedAlgorithms = availableAlgorithms;
          }
          currentKey = prepareKeyOrSecret(currentKey, availableAlgorithms[0] === hsAlgorithms[0]);
          verifyToken(currentKey, decoded, validationContext);
        } catch (e6) {
          return callback(cacheSet(cacheContext, e6));
        }
        callback(null, cacheSet(cacheContext, complete ? { header, payload, signature } : payload));
      });
      return promise;
    }
    __name(verify, "verify");
    module2.exports = /* @__PURE__ */ __name(function createVerifier2(options) {
      let {
        key,
        algorithms: allowedAlgorithms,
        complete,
        cache: cacheSize,
        cacheTTL,
        checkTyp,
        clockTimestamp,
        clockTolerance,
        ignoreExpiration,
        ignoreNotBefore,
        maxAge,
        allowedJti,
        allowedAud,
        allowedIss,
        allowedSub,
        allowedNonce,
        requiredClaims
      } = { cacheTTL: 6e5, clockTolerance: 0, ...options };
      if (!Array.isArray(allowedAlgorithms)) {
        allowedAlgorithms = [];
      }
      const keyType = typeof key;
      if (keyType !== "string" && keyType !== "object" && keyType !== "function") {
        throw new TokenError(
          TokenError.codes.INVALID_OPTION,
          "The key option must be a string, a buffer or a function returning the algorithm secret or public key."
        );
      }
      if (key && keyType !== "function") {
        const availableAlgorithms = detectPublicKeyAlgorithms(key);
        if (allowedAlgorithms.length) {
          checkAreCompatibleAlgorithms(allowedAlgorithms, availableAlgorithms);
        } else {
          allowedAlgorithms = availableAlgorithms;
        }
        key = prepareKeyOrSecret(key, availableAlgorithms[0] === hsAlgorithms[0]);
      }
      if (clockTimestamp && (typeof clockTimestamp !== "number" || clockTimestamp < 0)) {
        throw new TokenError(TokenError.codes.invalidOption, "The clockTimestamp option must be a positive number.");
      }
      if (clockTolerance && (typeof clockTolerance !== "number" || clockTolerance < 0)) {
        throw new TokenError(TokenError.codes.invalidOption, "The clockTolerance option must be a positive number.");
      }
      if (cacheTTL && (typeof cacheTTL !== "number" || cacheTTL < 0)) {
        throw new TokenError(TokenError.codes.invalidOption, "The cacheTTL option must be a positive number.");
      }
      if (requiredClaims && !Array.isArray(requiredClaims)) {
        throw new TokenError(TokenError.codes.invalidOption, "The requiredClaims option must be an array.");
      }
      const validators = [];
      if (!ignoreNotBefore) {
        validators.push({ type: "date", claim: "nbf", errorCode: "inactive", errorVerb: "will be active", greater: true, modifier: -clockTolerance });
      }
      if (!ignoreExpiration) {
        validators.push({ type: "date", claim: "exp", errorCode: "expired", errorVerb: "has expired", modifier: +clockTolerance });
      }
      if (typeof maxAge === "number") {
        validators.push({ type: "date", claim: "iat", errorCode: "expired", errorVerb: "has expired", modifier: maxAge });
      }
      if (allowedJti) {
        validators.push({ type: "string", claim: "jti", allowed: ensureStringClaimMatcher(allowedJti) });
      }
      if (allowedAud) {
        validators.push({ type: "string", claim: "aud", allowed: ensureStringClaimMatcher(allowedAud), array: true });
      }
      if (allowedIss) {
        validators.push({ type: "string", claim: "iss", allowed: ensureStringClaimMatcher(allowedIss) });
      }
      if (allowedSub) {
        validators.push({ type: "string", claim: "sub", allowed: ensureStringClaimMatcher(allowedSub) });
      }
      if (allowedNonce) {
        validators.push({ type: "string", claim: "nonce", allowed: ensureStringClaimMatcher(allowedNonce) });
      }
      let normalizedTyp = null;
      if (checkTyp) {
        normalizedTyp = checkTyp.toLowerCase().replace(/^application\//, "");
      }
      const context = {
        key,
        allowedAlgorithms,
        complete,
        cacheTTL,
        checkTyp: normalizedTyp,
        clockTimestamp,
        clockTolerance,
        ignoreExpiration,
        ignoreNotBefore,
        maxAge,
        isAsync: keyType === "function",
        validators,
        decode: createDecoder({ complete: true }),
        cache: createCache(cacheSize),
        requiredClaims
      };
      const verifier = verify.bind(null, context);
      verifier.cache = context.cache;
      return verifier;
    }, "createVerifier");
  }
});

// node_modules/fast-jwt/src/signer.js
var require_signer = __commonJS({
  "node_modules/fast-jwt/src/signer.js"(exports, module2) {
    "use strict";
    var {
      base64UrlMatcher,
      base64UrlReplacer,
      useNewCrypto,
      hsAlgorithms,
      esAlgorithms,
      rsaAlgorithms,
      edAlgorithms,
      detectPrivateKeyAlgorithm,
      createSignature
    } = require_crypto2();
    var TokenError = require_error2();
    var { getAsyncKey, ensurePromiseCallback } = require_utils();
    var { createPrivateKey, createSecretKey } = __require("crypto");
    var supportedAlgorithms = Array.from(
      /* @__PURE__ */ new Set([...hsAlgorithms, ...esAlgorithms, ...rsaAlgorithms, ...edAlgorithms, "none"])
    ).join(", ");
    function checkIsCompatibleAlgorithm(expected, actual) {
      const expectedType = expected.slice(0, 2);
      const actualType = actual.slice(0, 2);
      let valid = true;
      if (expectedType === "RS" || expectedType === "PS") {
        valid = actualType === "RS" || expectedType === "RS" && actual === "ENCRYPTED";
      } else if (expectedType === "ES" || expectedType === "Ed") {
        valid = expectedType === actualType || expectedType === "ES" && actual === "ENCRYPTED";
      }
      if (!valid) {
        throw new TokenError(TokenError.codes.invalidKey, `Invalid private key provided for algorithm ${expected}.`);
      }
    }
    __name(checkIsCompatibleAlgorithm, "checkIsCompatibleAlgorithm");
    function prepareKeyOrSecret(key, algorithm) {
      if (typeof key === "string") {
        key = Buffer.from(key, "utf-8");
      }
      if (useNewCrypto) {
        key = algorithm[0] === "H" ? createSecretKey(key) : createPrivateKey(key);
      }
      return key;
    }
    __name(prepareKeyOrSecret, "prepareKeyOrSecret");
    function sign({
      key,
      algorithm,
      noTimestamp,
      mutatePayload,
      clockTimestamp,
      expiresIn,
      notBefore,
      kid,
      typ,
      isAsync,
      additionalHeader,
      fixedPayload
    }, payload, cb) {
      const [callback, promise] = isAsync ? ensurePromiseCallback(cb) : [];
      if (typeof payload !== "object") {
        throw new TokenError(TokenError.codes.invalidType, "The payload must be an object.");
      }
      if (payload.exp && (!Number.isInteger(payload.exp) || payload.exp < 0)) {
        throw new TokenError(TokenError.codes.invalidClaimValue, "The exp claim must be a positive integer.");
      }
      const header = {
        alg: algorithm,
        typ: typ || "JWT",
        kid,
        ...additionalHeader
      };
      let encodedPayload = "";
      const iat = payload.iat * 1e3 || clockTimestamp || Date.now();
      const finalPayload = {
        ...payload,
        ...fixedPayload,
        iat: noTimestamp ? void 0 : Math.floor(iat / 1e3),
        exp: payload.exp ? payload.exp : expiresIn ? Math.floor((iat + expiresIn) / 1e3) : void 0,
        nbf: notBefore ? Math.floor((iat + notBefore) / 1e3) : void 0
      };
      if (mutatePayload) {
        Object.assign(payload, finalPayload);
      }
      encodedPayload = Buffer.from(JSON.stringify(finalPayload), "utf-8").toString("base64").replace(base64UrlMatcher, base64UrlReplacer);
      if (!callback) {
        const encodedHeader = Buffer.from(JSON.stringify(header), "utf-8").toString("base64").replace(base64UrlMatcher, base64UrlReplacer);
        const input = encodedHeader + "." + encodedPayload;
        const signature = algorithm === "none" ? "" : createSignature(algorithm, key, input);
        return input + "." + signature;
      }
      getAsyncKey(key, header, (err, currentKey) => {
        if (err) {
          const error = TokenError.wrap(err, TokenError.codes.keyFetchingError, "Cannot fetch key.");
          return callback(error);
        }
        if (typeof currentKey === "string") {
          currentKey = Buffer.from(currentKey, "utf-8");
        } else if (!(currentKey instanceof Buffer)) {
          return callback(
            new TokenError(
              TokenError.codes.keyFetchingError,
              "The key returned from the callback must be a string or a buffer containing a secret or a private key."
            )
          );
        }
        let token;
        try {
          const availableAlgorithm = detectPrivateKeyAlgorithm(currentKey, algorithm);
          if (algorithm) {
            checkIsCompatibleAlgorithm(algorithm, availableAlgorithm);
          } else {
            header.alg = algorithm = availableAlgorithm;
          }
          currentKey = prepareKeyOrSecret(currentKey, algorithm);
          const encodedHeader = Buffer.from(JSON.stringify(header), "utf-8").toString("base64").replace(base64UrlMatcher, base64UrlReplacer);
          const input = encodedHeader + "." + encodedPayload;
          token = input + "." + createSignature(algorithm, currentKey, input);
        } catch (e6) {
          return callback(e6);
        }
        callback(null, token);
      });
      return promise;
    }
    __name(sign, "sign");
    module2.exports = /* @__PURE__ */ __name(function createSigner2(options) {
      let {
        key,
        algorithm,
        noTimestamp,
        mutatePayload,
        clockTimestamp,
        expiresIn,
        notBefore,
        jti,
        aud,
        iss,
        sub,
        nonce,
        kid,
        typ,
        header: additionalHeader
      } = { clockTimestamp: 0, ...options };
      if (algorithm && algorithm !== "none" && !hsAlgorithms.includes(algorithm) && !esAlgorithms.includes(algorithm) && !rsaAlgorithms.includes(algorithm) && !edAlgorithms.includes(algorithm)) {
        throw new TokenError(
          TokenError.codes.invalidOption,
          `The algorithm option must be one of the following values: ${supportedAlgorithms}.`
        );
      }
      const keyType = typeof key;
      const isKeyPasswordProtected = keyType === "object" && key && key.key && key.passphrase;
      if (algorithm === "none") {
        if (key) {
          throw new TokenError(
            TokenError.codes.invalidOption,
            'The key option must not be provided when the algorithm option is "none".'
          );
        }
      } else if (!key || keyType !== "string" && !(key instanceof Buffer) && keyType !== "function" && !isKeyPasswordProtected) {
        throw new TokenError(
          TokenError.codes.invalidOption,
          "The key option must be a string, a buffer, an object containing key/passphrase properties or a function returning the algorithm secret or private key."
        );
      } else if (isKeyPasswordProtected && !algorithm) {
        throw new TokenError(
          TokenError.codes.invalidAlgorithm,
          "When using password protected key you must provide the algorithm option."
        );
      }
      if (key && keyType !== "function") {
        const availableAlgorithm = detectPrivateKeyAlgorithm(isKeyPasswordProtected ? key.key : key, algorithm);
        if (algorithm) {
          checkIsCompatibleAlgorithm(algorithm, availableAlgorithm);
        } else {
          algorithm = availableAlgorithm;
        }
        key = prepareKeyOrSecret(key, algorithm);
      }
      if (expiresIn && (typeof expiresIn !== "number" || expiresIn < 0)) {
        throw new TokenError(TokenError.codes.invalidOption, "The expiresIn option must be a positive number.");
      }
      if (notBefore && (typeof notBefore !== "number" || notBefore < 0)) {
        throw new TokenError(TokenError.codes.invalidOption, "The notBefore option must be a positive number.");
      }
      if (clockTimestamp && (typeof clockTimestamp !== "number" || clockTimestamp < 0)) {
        throw new TokenError(TokenError.codes.invalidOption, "The clockTimestamp option must be a positive number.");
      }
      if (jti && typeof jti !== "string") {
        throw new TokenError(TokenError.codes.invalidOption, "The jti option must be a string.");
      }
      if (aud && typeof aud !== "string" && !Array.isArray(aud)) {
        throw new TokenError(TokenError.codes.invalidOption, "The aud option must be a string or an array of strings.");
      }
      if (iss && typeof iss !== "string") {
        throw new TokenError(TokenError.codes.invalidOption, "The iss option must be a string.");
      }
      if (sub && typeof sub !== "string") {
        throw new TokenError(TokenError.codes.invalidOption, "The sub option must be a string.");
      }
      if (nonce && typeof nonce !== "string") {
        throw new TokenError(TokenError.codes.invalidOption, "The nonce option must be a string.");
      }
      if (kid && typeof kid !== "string") {
        throw new TokenError(TokenError.codes.invalidOption, "The kid option must be a string.");
      }
      if (additionalHeader && typeof additionalHeader !== "object") {
        throw new TokenError(TokenError.codes.invalidOption, "The header option must be a object.");
      }
      const fpo = { jti, aud, iss, sub, nonce };
      const fixedPayload = Object.keys(fpo).reduce((obj, key2) => {
        return fpo[key2] !== void 0 ? Object.assign(obj, { [key2]: fpo[key2] }) : obj;
      }, {});
      const context = {
        key,
        algorithm,
        noTimestamp,
        mutatePayload,
        clockTimestamp,
        expiresIn,
        notBefore,
        kid,
        typ,
        isAsync: keyType === "function",
        additionalHeader,
        fixedPayload
      };
      return sign.bind(null, context);
    }, "createSigner");
  }
});

// node_modules/fast-jwt/src/index.js
var require_src = __commonJS({
  "node_modules/fast-jwt/src/index.js"(exports, module2) {
    "use strict";
    var TokenError = require_error2();
    var createDecoder = require_decoder();
    var createVerifier2 = require_verifier();
    var createSigner2 = require_signer();
    module2.exports = {
      TokenError,
      createDecoder,
      createVerifier: createVerifier2,
      createSigner: createSigner2
    };
  }
});

// node_modules/@aws-sdk/endpoint-cache/node_modules/obliterator/iterator.js
var require_iterator2 = __commonJS({
  "node_modules/@aws-sdk/endpoint-cache/node_modules/obliterator/iterator.js"(exports, module2) {
    function Iterator(next) {
      Object.defineProperty(this, "_next", {
        writable: false,
        enumerable: false,
        value: next
      });
      this.done = false;
    }
    __name(Iterator, "Iterator");
    Iterator.prototype.next = function() {
      if (this.done)
        return { done: true };
      var step = this._next();
      if (step.done)
        this.done = true;
      return step;
    };
    if (typeof Symbol !== "undefined")
      Iterator.prototype[Symbol.iterator] = function() {
        return this;
      };
    Iterator.of = function() {
      var args = arguments, l6 = args.length, i6 = 0;
      return new Iterator(function() {
        if (i6 >= l6)
          return { done: true };
        return { done: false, value: args[i6++] };
      });
    };
    Iterator.empty = function() {
      var iterator = new Iterator(null);
      iterator.done = true;
      return iterator;
    };
    Iterator.is = function(value) {
      if (value instanceof Iterator)
        return true;
      return typeof value === "object" && value !== null && typeof value.next === "function";
    };
    module2.exports = Iterator;
  }
});

// node_modules/@aws-sdk/endpoint-cache/node_modules/obliterator/foreach.js
var require_foreach2 = __commonJS({
  "node_modules/@aws-sdk/endpoint-cache/node_modules/obliterator/foreach.js"(exports, module2) {
    var ARRAY_BUFFER_SUPPORT = typeof ArrayBuffer !== "undefined";
    var SYMBOL_SUPPORT = typeof Symbol !== "undefined";
    function forEach(iterable, callback) {
      var iterator, k6, i6, l6, s6;
      if (!iterable)
        throw new Error("obliterator/forEach: invalid iterable.");
      if (typeof callback !== "function")
        throw new Error("obliterator/forEach: expecting a callback.");
      if (Array.isArray(iterable) || ARRAY_BUFFER_SUPPORT && ArrayBuffer.isView(iterable) || typeof iterable === "string" || iterable.toString() === "[object Arguments]") {
        for (i6 = 0, l6 = iterable.length; i6 < l6; i6++)
          callback(iterable[i6], i6);
        return;
      }
      if (typeof iterable.forEach === "function") {
        iterable.forEach(callback);
        return;
      }
      if (SYMBOL_SUPPORT && Symbol.iterator in iterable && typeof iterable.next !== "function") {
        iterable = iterable[Symbol.iterator]();
      }
      if (typeof iterable.next === "function") {
        iterator = iterable;
        i6 = 0;
        while (s6 = iterator.next(), s6.done !== true) {
          callback(s6.value, i6);
          i6++;
        }
        return;
      }
      for (k6 in iterable) {
        if (iterable.hasOwnProperty(k6)) {
          callback(iterable[k6], k6);
        }
      }
      return;
    }
    __name(forEach, "forEach");
    forEach.forEachWithNullKeys = function(iterable, callback) {
      var iterator, k6, i6, l6, s6;
      if (!iterable)
        throw new Error("obliterator/forEachWithNullKeys: invalid iterable.");
      if (typeof callback !== "function")
        throw new Error("obliterator/forEachWithNullKeys: expecting a callback.");
      if (Array.isArray(iterable) || ARRAY_BUFFER_SUPPORT && ArrayBuffer.isView(iterable) || typeof iterable === "string" || iterable.toString() === "[object Arguments]") {
        for (i6 = 0, l6 = iterable.length; i6 < l6; i6++)
          callback(iterable[i6], null);
        return;
      }
      if (iterable instanceof Set) {
        iterable.forEach(function(value) {
          callback(value, null);
        });
        return;
      }
      if (typeof iterable.forEach === "function") {
        iterable.forEach(callback);
        return;
      }
      if (SYMBOL_SUPPORT && Symbol.iterator in iterable && typeof iterable.next !== "function") {
        iterable = iterable[Symbol.iterator]();
      }
      if (typeof iterable.next === "function") {
        iterator = iterable;
        i6 = 0;
        while (s6 = iterator.next(), s6.done !== true) {
          callback(s6.value, null);
          i6++;
        }
        return;
      }
      for (k6 in iterable) {
        if (iterable.hasOwnProperty(k6)) {
          callback(iterable[k6], k6);
        }
      }
      return;
    };
    module2.exports = forEach;
  }
});

// node_modules/@aws-sdk/endpoint-cache/node_modules/mnemonist/utils/typed-arrays.js
var require_typed_arrays2 = __commonJS({
  "node_modules/@aws-sdk/endpoint-cache/node_modules/mnemonist/utils/typed-arrays.js"(exports) {
    var MAX_8BIT_INTEGER = Math.pow(2, 8) - 1;
    var MAX_16BIT_INTEGER = Math.pow(2, 16) - 1;
    var MAX_32BIT_INTEGER = Math.pow(2, 32) - 1;
    var MAX_SIGNED_8BIT_INTEGER = Math.pow(2, 7) - 1;
    var MAX_SIGNED_16BIT_INTEGER = Math.pow(2, 15) - 1;
    var MAX_SIGNED_32BIT_INTEGER = Math.pow(2, 31) - 1;
    exports.getPointerArray = function(size) {
      var maxIndex = size - 1;
      if (maxIndex <= MAX_8BIT_INTEGER)
        return Uint8Array;
      if (maxIndex <= MAX_16BIT_INTEGER)
        return Uint16Array;
      if (maxIndex <= MAX_32BIT_INTEGER)
        return Uint32Array;
      return Float64Array;
    };
    exports.getSignedPointerArray = function(size) {
      var maxIndex = size - 1;
      if (maxIndex <= MAX_SIGNED_8BIT_INTEGER)
        return Int8Array;
      if (maxIndex <= MAX_SIGNED_16BIT_INTEGER)
        return Int16Array;
      if (maxIndex <= MAX_SIGNED_32BIT_INTEGER)
        return Int32Array;
      return Float64Array;
    };
    exports.getNumberType = function(value) {
      if (value === (value | 0)) {
        if (Math.sign(value) === -1) {
          if (value <= 127 && value >= -128)
            return Int8Array;
          if (value <= 32767 && value >= -32768)
            return Int16Array;
          return Int32Array;
        } else {
          if (value <= 255)
            return Uint8Array;
          if (value <= 65535)
            return Uint16Array;
          return Uint32Array;
        }
      }
      return Float64Array;
    };
    var TYPE_PRIORITY = {
      Uint8Array: 1,
      Int8Array: 2,
      Uint16Array: 3,
      Int16Array: 4,
      Uint32Array: 5,
      Int32Array: 6,
      Float32Array: 7,
      Float64Array: 8
    };
    exports.getMinimalRepresentation = function(array, getter) {
      var maxType = null, maxPriority = 0, p6, t4, v5, i6, l6;
      for (i6 = 0, l6 = array.length; i6 < l6; i6++) {
        v5 = getter ? getter(array[i6]) : array[i6];
        t4 = exports.getNumberType(v5);
        p6 = TYPE_PRIORITY[t4.name];
        if (p6 > maxPriority) {
          maxPriority = p6;
          maxType = t4;
        }
      }
      return maxType;
    };
    exports.isTypedArray = function(value) {
      return typeof ArrayBuffer !== "undefined" && ArrayBuffer.isView(value);
    };
    exports.concat = function() {
      var length = 0, i6, o6, l6;
      for (i6 = 0, l6 = arguments.length; i6 < l6; i6++)
        length += arguments[i6].length;
      var array = new arguments[0].constructor(length);
      for (i6 = 0, o6 = 0; i6 < l6; i6++) {
        array.set(arguments[i6], o6);
        o6 += arguments[i6].length;
      }
      return array;
    };
    exports.indices = function(length) {
      var PointerArray = exports.getPointerArray(length);
      var array = new PointerArray(length);
      for (var i6 = 0; i6 < length; i6++)
        array[i6] = i6;
      return array;
    };
  }
});

// node_modules/@aws-sdk/endpoint-cache/node_modules/mnemonist/utils/iterables.js
var require_iterables2 = __commonJS({
  "node_modules/@aws-sdk/endpoint-cache/node_modules/mnemonist/utils/iterables.js"(exports) {
    var forEach = require_foreach2();
    var typed = require_typed_arrays2();
    function isArrayLike(target) {
      return Array.isArray(target) || typed.isTypedArray(target);
    }
    __name(isArrayLike, "isArrayLike");
    function guessLength(target) {
      if (typeof target.length === "number")
        return target.length;
      if (typeof target.size === "number")
        return target.size;
      return;
    }
    __name(guessLength, "guessLength");
    function toArray(target) {
      var l6 = guessLength(target);
      var array = typeof l6 === "number" ? new Array(l6) : [];
      var i6 = 0;
      forEach(target, function(value) {
        array[i6++] = value;
      });
      return array;
    }
    __name(toArray, "toArray");
    function toArrayWithIndices(target) {
      var l6 = guessLength(target);
      var IndexArray = typeof l6 === "number" ? typed.getPointerArray(l6) : Array;
      var array = typeof l6 === "number" ? new Array(l6) : [];
      var indices = typeof l6 === "number" ? new IndexArray(l6) : [];
      var i6 = 0;
      forEach(target, function(value) {
        array[i6] = value;
        indices[i6] = i6++;
      });
      return [array, indices];
    }
    __name(toArrayWithIndices, "toArrayWithIndices");
    exports.isArrayLike = isArrayLike;
    exports.guessLength = guessLength;
    exports.toArray = toArray;
    exports.toArrayWithIndices = toArrayWithIndices;
  }
});

// node_modules/@aws-sdk/endpoint-cache/node_modules/mnemonist/lru-cache.js
var require_lru_cache2 = __commonJS({
  "node_modules/@aws-sdk/endpoint-cache/node_modules/mnemonist/lru-cache.js"(exports, module2) {
    var Iterator = require_iterator2();
    var forEach = require_foreach2();
    var typed = require_typed_arrays2();
    var iterables = require_iterables2();
    function LRUCache2(Keys, Values, capacity) {
      if (arguments.length < 2) {
        capacity = Keys;
        Keys = null;
        Values = null;
      }
      this.capacity = capacity;
      if (typeof this.capacity !== "number" || this.capacity <= 0)
        throw new Error("mnemonist/lru-cache: capacity should be positive number.");
      var PointerArray = typed.getPointerArray(capacity);
      this.forward = new PointerArray(capacity);
      this.backward = new PointerArray(capacity);
      this.K = typeof Keys === "function" ? new Keys(capacity) : new Array(capacity);
      this.V = typeof Values === "function" ? new Values(capacity) : new Array(capacity);
      this.size = 0;
      this.head = 0;
      this.tail = 0;
      this.items = {};
    }
    __name(LRUCache2, "LRUCache");
    LRUCache2.prototype.clear = function() {
      this.size = 0;
      this.head = 0;
      this.tail = 0;
      this.items = {};
    };
    LRUCache2.prototype.splayOnTop = function(pointer) {
      var oldHead = this.head;
      if (this.head === pointer)
        return this;
      var previous = this.backward[pointer], next = this.forward[pointer];
      if (this.tail === pointer) {
        this.tail = previous;
      } else {
        this.backward[next] = previous;
      }
      this.forward[previous] = next;
      this.backward[oldHead] = pointer;
      this.head = pointer;
      this.forward[pointer] = oldHead;
      return this;
    };
    LRUCache2.prototype.set = function(key, value) {
      var pointer = this.items[key];
      if (typeof pointer !== "undefined") {
        this.splayOnTop(pointer);
        this.V[pointer] = value;
        return;
      }
      if (this.size < this.capacity) {
        pointer = this.size++;
      } else {
        pointer = this.tail;
        this.tail = this.backward[pointer];
        delete this.items[this.K[pointer]];
      }
      this.items[key] = pointer;
      this.K[pointer] = key;
      this.V[pointer] = value;
      this.forward[pointer] = this.head;
      this.backward[this.head] = pointer;
      this.head = pointer;
    };
    LRUCache2.prototype.setpop = function(key, value) {
      var oldValue = null;
      var oldKey = null;
      var pointer = this.items[key];
      if (typeof pointer !== "undefined") {
        this.splayOnTop(pointer);
        oldValue = this.V[pointer];
        this.V[pointer] = value;
        return { evicted: false, key, value: oldValue };
      }
      if (this.size < this.capacity) {
        pointer = this.size++;
      } else {
        pointer = this.tail;
        this.tail = this.backward[pointer];
        oldValue = this.V[pointer];
        oldKey = this.K[pointer];
        delete this.items[this.K[pointer]];
      }
      this.items[key] = pointer;
      this.K[pointer] = key;
      this.V[pointer] = value;
      this.forward[pointer] = this.head;
      this.backward[this.head] = pointer;
      this.head = pointer;
      if (oldKey) {
        return { evicted: true, key: oldKey, value: oldValue };
      } else {
        return null;
      }
    };
    LRUCache2.prototype.has = function(key) {
      return key in this.items;
    };
    LRUCache2.prototype.get = function(key) {
      var pointer = this.items[key];
      if (typeof pointer === "undefined")
        return;
      this.splayOnTop(pointer);
      return this.V[pointer];
    };
    LRUCache2.prototype.peek = function(key) {
      var pointer = this.items[key];
      if (typeof pointer === "undefined")
        return;
      return this.V[pointer];
    };
    LRUCache2.prototype.forEach = function(callback, scope) {
      scope = arguments.length > 1 ? scope : this;
      var i6 = 0, l6 = this.size;
      var pointer = this.head, keys = this.K, values = this.V, forward = this.forward;
      while (i6 < l6) {
        callback.call(scope, values[pointer], keys[pointer], this);
        pointer = forward[pointer];
        i6++;
      }
    };
    LRUCache2.prototype.keys = function() {
      var i6 = 0, l6 = this.size;
      var pointer = this.head, keys = this.K, forward = this.forward;
      return new Iterator(function() {
        if (i6 >= l6)
          return { done: true };
        var key = keys[pointer];
        i6++;
        if (i6 < l6)
          pointer = forward[pointer];
        return {
          done: false,
          value: key
        };
      });
    };
    LRUCache2.prototype.values = function() {
      var i6 = 0, l6 = this.size;
      var pointer = this.head, values = this.V, forward = this.forward;
      return new Iterator(function() {
        if (i6 >= l6)
          return { done: true };
        var value = values[pointer];
        i6++;
        if (i6 < l6)
          pointer = forward[pointer];
        return {
          done: false,
          value
        };
      });
    };
    LRUCache2.prototype.entries = function() {
      var i6 = 0, l6 = this.size;
      var pointer = this.head, keys = this.K, values = this.V, forward = this.forward;
      return new Iterator(function() {
        if (i6 >= l6)
          return { done: true };
        var key = keys[pointer], value = values[pointer];
        i6++;
        if (i6 < l6)
          pointer = forward[pointer];
        return {
          done: false,
          value: [key, value]
        };
      });
    };
    if (typeof Symbol !== "undefined")
      LRUCache2.prototype[Symbol.iterator] = LRUCache2.prototype.entries;
    LRUCache2.prototype.inspect = function() {
      var proxy = /* @__PURE__ */ new Map();
      var iterator = this.entries(), step;
      while (step = iterator.next(), !step.done)
        proxy.set(step.value[0], step.value[1]);
      Object.defineProperty(proxy, "constructor", {
        value: LRUCache2,
        enumerable: false
      });
      return proxy;
    };
    if (typeof Symbol !== "undefined")
      LRUCache2.prototype[Symbol.for("nodejs.util.inspect.custom")] = LRUCache2.prototype.inspect;
    LRUCache2.from = function(iterable, Keys, Values, capacity) {
      if (arguments.length < 2) {
        capacity = iterables.guessLength(iterable);
        if (typeof capacity !== "number")
          throw new Error("mnemonist/lru-cache.from: could not guess iterable length. Please provide desired capacity as last argument.");
      } else if (arguments.length === 2) {
        capacity = Keys;
        Keys = null;
        Values = null;
      }
      var cache = new LRUCache2(Keys, Values, capacity);
      forEach(iterable, function(value, key) {
        cache.set(key, value);
      });
      return cache;
    };
    module2.exports = LRUCache2;
  }
});

// node_modules/@aws-sdk/smithy-client/dist-es/NoOpLogger.js
var NoOpLogger = class {
  trace() {
  }
  debug() {
  }
  info() {
  }
  warn() {
  }
  error() {
  }
};
__name(NoOpLogger, "NoOpLogger");

// node_modules/@aws-sdk/middleware-stack/dist-es/MiddlewareStack.js
var constructStack = /* @__PURE__ */ __name(() => {
  let absoluteEntries = [];
  let relativeEntries = [];
  const entriesNameSet = /* @__PURE__ */ new Set();
  const sort = /* @__PURE__ */ __name((entries) => entries.sort((a6, b6) => stepWeights[b6.step] - stepWeights[a6.step] || priorityWeights[b6.priority || "normal"] - priorityWeights[a6.priority || "normal"]), "sort");
  const removeByName = /* @__PURE__ */ __name((toRemove) => {
    let isRemoved = false;
    const filterCb = /* @__PURE__ */ __name((entry) => {
      if (entry.name && entry.name === toRemove) {
        isRemoved = true;
        entriesNameSet.delete(toRemove);
        return false;
      }
      return true;
    }, "filterCb");
    absoluteEntries = absoluteEntries.filter(filterCb);
    relativeEntries = relativeEntries.filter(filterCb);
    return isRemoved;
  }, "removeByName");
  const removeByReference = /* @__PURE__ */ __name((toRemove) => {
    let isRemoved = false;
    const filterCb = /* @__PURE__ */ __name((entry) => {
      if (entry.middleware === toRemove) {
        isRemoved = true;
        if (entry.name)
          entriesNameSet.delete(entry.name);
        return false;
      }
      return true;
    }, "filterCb");
    absoluteEntries = absoluteEntries.filter(filterCb);
    relativeEntries = relativeEntries.filter(filterCb);
    return isRemoved;
  }, "removeByReference");
  const cloneTo = /* @__PURE__ */ __name((toStack) => {
    absoluteEntries.forEach((entry) => {
      toStack.add(entry.middleware, { ...entry });
    });
    relativeEntries.forEach((entry) => {
      toStack.addRelativeTo(entry.middleware, { ...entry });
    });
    return toStack;
  }, "cloneTo");
  const expandRelativeMiddlewareList = /* @__PURE__ */ __name((from) => {
    const expandedMiddlewareList = [];
    from.before.forEach((entry) => {
      if (entry.before.length === 0 && entry.after.length === 0) {
        expandedMiddlewareList.push(entry);
      } else {
        expandedMiddlewareList.push(...expandRelativeMiddlewareList(entry));
      }
    });
    expandedMiddlewareList.push(from);
    from.after.reverse().forEach((entry) => {
      if (entry.before.length === 0 && entry.after.length === 0) {
        expandedMiddlewareList.push(entry);
      } else {
        expandedMiddlewareList.push(...expandRelativeMiddlewareList(entry));
      }
    });
    return expandedMiddlewareList;
  }, "expandRelativeMiddlewareList");
  const getMiddlewareList = /* @__PURE__ */ __name((debug = false) => {
    const normalizedAbsoluteEntries = [];
    const normalizedRelativeEntries = [];
    const normalizedEntriesNameMap = {};
    absoluteEntries.forEach((entry) => {
      const normalizedEntry = {
        ...entry,
        before: [],
        after: []
      };
      if (normalizedEntry.name)
        normalizedEntriesNameMap[normalizedEntry.name] = normalizedEntry;
      normalizedAbsoluteEntries.push(normalizedEntry);
    });
    relativeEntries.forEach((entry) => {
      const normalizedEntry = {
        ...entry,
        before: [],
        after: []
      };
      if (normalizedEntry.name)
        normalizedEntriesNameMap[normalizedEntry.name] = normalizedEntry;
      normalizedRelativeEntries.push(normalizedEntry);
    });
    normalizedRelativeEntries.forEach((entry) => {
      if (entry.toMiddleware) {
        const toMiddleware = normalizedEntriesNameMap[entry.toMiddleware];
        if (toMiddleware === void 0) {
          if (debug) {
            return;
          }
          throw new Error(`${entry.toMiddleware} is not found when adding ${entry.name || "anonymous"} middleware ${entry.relation} ${entry.toMiddleware}`);
        }
        if (entry.relation === "after") {
          toMiddleware.after.push(entry);
        }
        if (entry.relation === "before") {
          toMiddleware.before.push(entry);
        }
      }
    });
    const mainChain = sort(normalizedAbsoluteEntries).map(expandRelativeMiddlewareList).reduce((wholeList, expendedMiddlewareList) => {
      wholeList.push(...expendedMiddlewareList);
      return wholeList;
    }, []);
    return mainChain;
  }, "getMiddlewareList");
  const stack = {
    add: (middleware, options = {}) => {
      const { name, override } = options;
      const entry = {
        step: "initialize",
        priority: "normal",
        middleware,
        ...options
      };
      if (name) {
        if (entriesNameSet.has(name)) {
          if (!override)
            throw new Error(`Duplicate middleware name '${name}'`);
          const toOverrideIndex = absoluteEntries.findIndex((entry2) => entry2.name === name);
          const toOverride = absoluteEntries[toOverrideIndex];
          if (toOverride.step !== entry.step || toOverride.priority !== entry.priority) {
            throw new Error(`"${name}" middleware with ${toOverride.priority} priority in ${toOverride.step} step cannot be overridden by same-name middleware with ${entry.priority} priority in ${entry.step} step.`);
          }
          absoluteEntries.splice(toOverrideIndex, 1);
        }
        entriesNameSet.add(name);
      }
      absoluteEntries.push(entry);
    },
    addRelativeTo: (middleware, options) => {
      const { name, override } = options;
      const entry = {
        middleware,
        ...options
      };
      if (name) {
        if (entriesNameSet.has(name)) {
          if (!override)
            throw new Error(`Duplicate middleware name '${name}'`);
          const toOverrideIndex = relativeEntries.findIndex((entry2) => entry2.name === name);
          const toOverride = relativeEntries[toOverrideIndex];
          if (toOverride.toMiddleware !== entry.toMiddleware || toOverride.relation !== entry.relation) {
            throw new Error(`"${name}" middleware ${toOverride.relation} "${toOverride.toMiddleware}" middleware cannot be overridden by same-name middleware ${entry.relation} "${entry.toMiddleware}" middleware.`);
          }
          relativeEntries.splice(toOverrideIndex, 1);
        }
        entriesNameSet.add(name);
      }
      relativeEntries.push(entry);
    },
    clone: () => cloneTo(constructStack()),
    use: (plugin) => {
      plugin.applyToStack(stack);
    },
    remove: (toRemove) => {
      if (typeof toRemove === "string")
        return removeByName(toRemove);
      else
        return removeByReference(toRemove);
    },
    removeByTag: (toRemove) => {
      let isRemoved = false;
      const filterCb = /* @__PURE__ */ __name((entry) => {
        const { tags, name } = entry;
        if (tags && tags.includes(toRemove)) {
          if (name)
            entriesNameSet.delete(name);
          isRemoved = true;
          return false;
        }
        return true;
      }, "filterCb");
      absoluteEntries = absoluteEntries.filter(filterCb);
      relativeEntries = relativeEntries.filter(filterCb);
      return isRemoved;
    },
    concat: (from) => {
      const cloned = cloneTo(constructStack());
      cloned.use(from);
      return cloned;
    },
    applyToStack: cloneTo,
    identify: () => {
      return getMiddlewareList(true).map((mw) => {
        return mw.name + ": " + (mw.tags || []).join(",");
      });
    },
    resolve: (handler2, context) => {
      for (const middleware of getMiddlewareList().map((entry) => entry.middleware).reverse()) {
        handler2 = middleware(handler2, context);
      }
      return handler2;
    }
  };
  return stack;
}, "constructStack");
var stepWeights = {
  initialize: 5,
  serialize: 4,
  build: 3,
  finalizeRequest: 2,
  deserialize: 1
};
var priorityWeights = {
  high: 3,
  normal: 2,
  low: 1
};

// node_modules/@aws-sdk/smithy-client/dist-es/client.js
var Client = class {
  constructor(config) {
    this.middlewareStack = constructStack();
    this.config = config;
  }
  send(command, optionsOrCb, cb) {
    const options = typeof optionsOrCb !== "function" ? optionsOrCb : void 0;
    const callback = typeof optionsOrCb === "function" ? optionsOrCb : cb;
    const handler2 = command.resolveMiddleware(this.middlewareStack, this.config, options);
    if (callback) {
      handler2(command).then((result) => callback(null, result.output), (err) => callback(err)).catch(() => {
      });
    } else {
      return handler2(command).then((result) => result.output);
    }
  }
  destroy() {
    if (this.config.requestHandler.destroy)
      this.config.requestHandler.destroy();
  }
};
__name(Client, "Client");

// node_modules/@aws-sdk/smithy-client/dist-es/command.js
var Command = class {
  constructor() {
    this.middlewareStack = constructStack();
  }
};
__name(Command, "Command");

// node_modules/@aws-sdk/smithy-client/dist-es/constants.js
var SENSITIVE_STRING = "***SensitiveInformation***";

// node_modules/@aws-sdk/smithy-client/dist-es/parse-utils.js
var expectBoolean = /* @__PURE__ */ __name((value) => {
  if (value === null || value === void 0) {
    return void 0;
  }
  if (typeof value === "number") {
    if (value === 0 || value === 1) {
      logger.warn(stackTraceWarning(`Expected boolean, got ${typeof value}: ${value}`));
    }
    if (value === 0) {
      return false;
    }
    if (value === 1) {
      return true;
    }
  }
  if (typeof value === "string") {
    const lower = value.toLowerCase();
    if (lower === "false" || lower === "true") {
      logger.warn(stackTraceWarning(`Expected boolean, got ${typeof value}: ${value}`));
    }
    if (lower === "false") {
      return false;
    }
    if (lower === "true") {
      return true;
    }
  }
  if (typeof value === "boolean") {
    return value;
  }
  throw new TypeError(`Expected boolean, got ${typeof value}: ${value}`);
}, "expectBoolean");
var expectNumber = /* @__PURE__ */ __name((value) => {
  if (value === null || value === void 0) {
    return void 0;
  }
  if (typeof value === "string") {
    const parsed = parseFloat(value);
    if (!Number.isNaN(parsed)) {
      if (String(parsed) !== String(value)) {
        logger.warn(stackTraceWarning(`Expected number but observed string: ${value}`));
      }
      return parsed;
    }
  }
  if (typeof value === "number") {
    return value;
  }
  throw new TypeError(`Expected number, got ${typeof value}: ${value}`);
}, "expectNumber");
var MAX_FLOAT = Math.ceil(2 ** 127 * (2 - 2 ** -23));
var expectFloat32 = /* @__PURE__ */ __name((value) => {
  const expected = expectNumber(value);
  if (expected !== void 0 && !Number.isNaN(expected) && expected !== Infinity && expected !== -Infinity) {
    if (Math.abs(expected) > MAX_FLOAT) {
      throw new TypeError(`Expected 32-bit float, got ${value}`);
    }
  }
  return expected;
}, "expectFloat32");
var expectLong = /* @__PURE__ */ __name((value) => {
  if (value === null || value === void 0) {
    return void 0;
  }
  if (Number.isInteger(value) && !Number.isNaN(value)) {
    return value;
  }
  throw new TypeError(`Expected integer, got ${typeof value}: ${value}`);
}, "expectLong");
var expectInt32 = /* @__PURE__ */ __name((value) => expectSizedInt(value, 32), "expectInt32");
var expectShort = /* @__PURE__ */ __name((value) => expectSizedInt(value, 16), "expectShort");
var expectByte = /* @__PURE__ */ __name((value) => expectSizedInt(value, 8), "expectByte");
var expectSizedInt = /* @__PURE__ */ __name((value, size) => {
  const expected = expectLong(value);
  if (expected !== void 0 && castInt(expected, size) !== expected) {
    throw new TypeError(`Expected ${size}-bit integer, got ${value}`);
  }
  return expected;
}, "expectSizedInt");
var castInt = /* @__PURE__ */ __name((value, size) => {
  switch (size) {
    case 32:
      return Int32Array.of(value)[0];
    case 16:
      return Int16Array.of(value)[0];
    case 8:
      return Int8Array.of(value)[0];
  }
}, "castInt");
var expectNonNull = /* @__PURE__ */ __name((value, location) => {
  if (value === null || value === void 0) {
    if (location) {
      throw new TypeError(`Expected a non-null value for ${location}`);
    }
    throw new TypeError("Expected a non-null value");
  }
  return value;
}, "expectNonNull");
var expectObject = /* @__PURE__ */ __name((value) => {
  if (value === null || value === void 0) {
    return void 0;
  }
  if (typeof value === "object" && !Array.isArray(value)) {
    return value;
  }
  const receivedType = Array.isArray(value) ? "array" : typeof value;
  throw new TypeError(`Expected object, got ${receivedType}: ${value}`);
}, "expectObject");
var expectString = /* @__PURE__ */ __name((value) => {
  if (value === null || value === void 0) {
    return void 0;
  }
  if (typeof value === "string") {
    return value;
  }
  if (["boolean", "number", "bigint"].includes(typeof value)) {
    logger.warn(stackTraceWarning(`Expected string, got ${typeof value}: ${value}`));
    return String(value);
  }
  throw new TypeError(`Expected string, got ${typeof value}: ${value}`);
}, "expectString");
var expectUnion = /* @__PURE__ */ __name((value) => {
  if (value === null || value === void 0) {
    return void 0;
  }
  const asObject = expectObject(value);
  const setKeys = Object.entries(asObject).filter(([, v5]) => v5 != null).map(([k6]) => k6);
  if (setKeys.length === 0) {
    throw new TypeError(`Unions must have exactly one non-null member. None were found.`);
  }
  if (setKeys.length > 1) {
    throw new TypeError(`Unions must have exactly one non-null member. Keys ${setKeys} were not null.`);
  }
  return asObject;
}, "expectUnion");
var strictParseDouble = /* @__PURE__ */ __name((value) => {
  if (typeof value == "string") {
    return expectNumber(parseNumber(value));
  }
  return expectNumber(value);
}, "strictParseDouble");
var strictParseFloat32 = /* @__PURE__ */ __name((value) => {
  if (typeof value == "string") {
    return expectFloat32(parseNumber(value));
  }
  return expectFloat32(value);
}, "strictParseFloat32");
var NUMBER_REGEX = /(-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?)|(-?Infinity)|(NaN)/g;
var parseNumber = /* @__PURE__ */ __name((value) => {
  const matches = value.match(NUMBER_REGEX);
  if (matches === null || matches[0].length !== value.length) {
    throw new TypeError(`Expected real number, got implicit NaN`);
  }
  return parseFloat(value);
}, "parseNumber");
var limitedParseDouble = /* @__PURE__ */ __name((value) => {
  if (typeof value == "string") {
    return parseFloatString(value);
  }
  return expectNumber(value);
}, "limitedParseDouble");
var parseFloatString = /* @__PURE__ */ __name((value) => {
  switch (value) {
    case "NaN":
      return NaN;
    case "Infinity":
      return Infinity;
    case "-Infinity":
      return -Infinity;
    default:
      throw new Error(`Unable to parse float value: ${value}`);
  }
}, "parseFloatString");
var strictParseInt32 = /* @__PURE__ */ __name((value) => {
  if (typeof value === "string") {
    return expectInt32(parseNumber(value));
  }
  return expectInt32(value);
}, "strictParseInt32");
var strictParseShort = /* @__PURE__ */ __name((value) => {
  if (typeof value === "string") {
    return expectShort(parseNumber(value));
  }
  return expectShort(value);
}, "strictParseShort");
var strictParseByte = /* @__PURE__ */ __name((value) => {
  if (typeof value === "string") {
    return expectByte(parseNumber(value));
  }
  return expectByte(value);
}, "strictParseByte");
var stackTraceWarning = /* @__PURE__ */ __name((message) => {
  return String(new TypeError(message).stack || message).split("\n").slice(0, 5).filter((s6) => !s6.includes("stackTraceWarning")).join("\n");
}, "stackTraceWarning");
var logger = {
  warn: console.warn
};

// node_modules/@aws-sdk/smithy-client/dist-es/date-utils.js
var MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
var RFC3339 = new RegExp(/^(\d{4})-(\d{2})-(\d{2})[tT](\d{2}):(\d{2}):(\d{2})(?:\.(\d+))?[zZ]$/);
var RFC3339_WITH_OFFSET = new RegExp(/^(\d{4})-(\d{2})-(\d{2})[tT](\d{2}):(\d{2}):(\d{2})(?:\.(\d+))?(([-+]\d{2}\:\d{2})|[zZ])$/);
var parseRfc3339DateTimeWithOffset = /* @__PURE__ */ __name((value) => {
  if (value === null || value === void 0) {
    return void 0;
  }
  if (typeof value !== "string") {
    throw new TypeError("RFC-3339 date-times must be expressed as strings");
  }
  const match = RFC3339_WITH_OFFSET.exec(value);
  if (!match) {
    throw new TypeError("Invalid RFC-3339 date-time value");
  }
  const [_, yearStr, monthStr, dayStr, hours, minutes, seconds, fractionalMilliseconds, offsetStr] = match;
  const year = strictParseShort(stripLeadingZeroes(yearStr));
  const month = parseDateValue(monthStr, "month", 1, 12);
  const day = parseDateValue(dayStr, "day", 1, 31);
  const date = buildDate(year, month, day, { hours, minutes, seconds, fractionalMilliseconds });
  if (offsetStr.toUpperCase() != "Z") {
    date.setTime(date.getTime() - parseOffsetToMilliseconds(offsetStr));
  }
  return date;
}, "parseRfc3339DateTimeWithOffset");
var IMF_FIXDATE = new RegExp(/^(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun), (\d{2}) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) (\d{4}) (\d{1,2}):(\d{2}):(\d{2})(?:\.(\d+))? GMT$/);
var RFC_850_DATE = new RegExp(/^(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday), (\d{2})-(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)-(\d{2}) (\d{1,2}):(\d{2}):(\d{2})(?:\.(\d+))? GMT$/);
var ASC_TIME = new RegExp(/^(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) ( [1-9]|\d{2}) (\d{1,2}):(\d{2}):(\d{2})(?:\.(\d+))? (\d{4})$/);
var parseEpochTimestamp = /* @__PURE__ */ __name((value) => {
  if (value === null || value === void 0) {
    return void 0;
  }
  let valueAsDouble;
  if (typeof value === "number") {
    valueAsDouble = value;
  } else if (typeof value === "string") {
    valueAsDouble = strictParseDouble(value);
  } else {
    throw new TypeError("Epoch timestamps must be expressed as floating point numbers or their string representation");
  }
  if (Number.isNaN(valueAsDouble) || valueAsDouble === Infinity || valueAsDouble === -Infinity) {
    throw new TypeError("Epoch timestamps must be valid, non-Infinite, non-NaN numerics");
  }
  return new Date(Math.round(valueAsDouble * 1e3));
}, "parseEpochTimestamp");
var buildDate = /* @__PURE__ */ __name((year, month, day, time) => {
  const adjustedMonth = month - 1;
  validateDayOfMonth(year, adjustedMonth, day);
  return new Date(Date.UTC(year, adjustedMonth, day, parseDateValue(time.hours, "hour", 0, 23), parseDateValue(time.minutes, "minute", 0, 59), parseDateValue(time.seconds, "seconds", 0, 60), parseMilliseconds(time.fractionalMilliseconds)));
}, "buildDate");
var FIFTY_YEARS_IN_MILLIS = 50 * 365 * 24 * 60 * 60 * 1e3;
var DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
var validateDayOfMonth = /* @__PURE__ */ __name((year, month, day) => {
  let maxDays = DAYS_IN_MONTH[month];
  if (month === 1 && isLeapYear(year)) {
    maxDays = 29;
  }
  if (day > maxDays) {
    throw new TypeError(`Invalid day for ${MONTHS[month]} in ${year}: ${day}`);
  }
}, "validateDayOfMonth");
var isLeapYear = /* @__PURE__ */ __name((year) => {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}, "isLeapYear");
var parseDateValue = /* @__PURE__ */ __name((value, type, lower, upper) => {
  const dateVal = strictParseByte(stripLeadingZeroes(value));
  if (dateVal < lower || dateVal > upper) {
    throw new TypeError(`${type} must be between ${lower} and ${upper}, inclusive`);
  }
  return dateVal;
}, "parseDateValue");
var parseMilliseconds = /* @__PURE__ */ __name((value) => {
  if (value === null || value === void 0) {
    return 0;
  }
  return strictParseFloat32("0." + value) * 1e3;
}, "parseMilliseconds");
var parseOffsetToMilliseconds = /* @__PURE__ */ __name((value) => {
  const directionStr = value[0];
  let direction = 1;
  if (directionStr == "+") {
    direction = 1;
  } else if (directionStr == "-") {
    direction = -1;
  } else {
    throw new TypeError(`Offset direction, ${directionStr}, must be "+" or "-"`);
  }
  const hour = Number(value.substring(1, 3));
  const minute = Number(value.substring(4, 6));
  return direction * (hour * 60 + minute) * 60 * 1e3;
}, "parseOffsetToMilliseconds");
var stripLeadingZeroes = /* @__PURE__ */ __name((value) => {
  let idx = 0;
  while (idx < value.length - 1 && value.charAt(idx) === "0") {
    idx++;
  }
  if (idx === 0) {
    return value;
  }
  return value.slice(idx);
}, "stripLeadingZeroes");

// node_modules/@aws-sdk/smithy-client/dist-es/exceptions.js
var ServiceException = class extends Error {
  constructor(options) {
    super(options.message);
    Object.setPrototypeOf(this, ServiceException.prototype);
    this.name = options.name;
    this.$fault = options.$fault;
    this.$metadata = options.$metadata;
  }
};
__name(ServiceException, "ServiceException");
var decorateServiceException = /* @__PURE__ */ __name((exception, additions = {}) => {
  Object.entries(additions).filter(([, v5]) => v5 !== void 0).forEach(([k6, v5]) => {
    if (exception[k6] == void 0 || exception[k6] === "") {
      exception[k6] = v5;
    }
  });
  const message = exception.message || exception.Message || "UnknownError";
  exception.message = message;
  delete exception.Message;
  return exception;
}, "decorateServiceException");

// node_modules/@aws-sdk/smithy-client/dist-es/default-error-handler.js
var throwDefaultError = /* @__PURE__ */ __name(({ output, parsedBody, exceptionCtor, errorCode }) => {
  const $metadata = deserializeMetadata(output);
  const statusCode = $metadata.httpStatusCode ? $metadata.httpStatusCode + "" : void 0;
  const response = new exceptionCtor({
    name: parsedBody?.code || parsedBody?.Code || errorCode || statusCode || "UnknownError",
    $fault: "client",
    $metadata
  });
  throw decorateServiceException(response, parsedBody);
}, "throwDefaultError");
var withBaseException = /* @__PURE__ */ __name((ExceptionCtor) => {
  return ({ output, parsedBody, errorCode }) => {
    throwDefaultError({ output, parsedBody, exceptionCtor: ExceptionCtor, errorCode });
  };
}, "withBaseException");
var deserializeMetadata = /* @__PURE__ */ __name((output) => ({
  httpStatusCode: output.statusCode,
  requestId: output.headers["x-amzn-requestid"] ?? output.headers["x-amzn-request-id"] ?? output.headers["x-amz-request-id"],
  extendedRequestId: output.headers["x-amz-id-2"],
  cfId: output.headers["x-amz-cf-id"]
}), "deserializeMetadata");

// node_modules/@aws-sdk/smithy-client/dist-es/defaults-mode.js
var loadConfigsForDefaultMode = /* @__PURE__ */ __name((mode) => {
  switch (mode) {
    case "standard":
      return {
        retryMode: "standard",
        connectionTimeout: 3100
      };
    case "in-region":
      return {
        retryMode: "standard",
        connectionTimeout: 1100
      };
    case "cross-region":
      return {
        retryMode: "standard",
        connectionTimeout: 3100
      };
    case "mobile":
      return {
        retryMode: "standard",
        connectionTimeout: 3e4
      };
    default:
      return {};
  }
}, "loadConfigsForDefaultMode");

// node_modules/@aws-sdk/smithy-client/dist-es/emitWarningIfUnsupportedVersion.js
var warningEmitted = false;
var emitWarningIfUnsupportedVersion = /* @__PURE__ */ __name((version) => {
  if (version && !warningEmitted && parseInt(version.substring(1, version.indexOf("."))) < 14) {
    warningEmitted = true;
  }
}, "emitWarningIfUnsupportedVersion");

// node_modules/@aws-sdk/smithy-client/dist-es/extended-encode-uri-component.js
function extendedEncodeURIComponent(str) {
  return encodeURIComponent(str).replace(/[!'()*]/g, function(c6) {
    return "%" + c6.charCodeAt(0).toString(16).toUpperCase();
  });
}
__name(extendedEncodeURIComponent, "extendedEncodeURIComponent");

// node_modules/@aws-sdk/smithy-client/dist-es/get-value-from-text-node.js
var getValueFromTextNode = /* @__PURE__ */ __name((obj) => {
  const textNodeName = "#text";
  for (const key in obj) {
    if (obj.hasOwnProperty(key) && obj[key][textNodeName] !== void 0) {
      obj[key] = obj[key][textNodeName];
    } else if (typeof obj[key] === "object" && obj[key] !== null) {
      obj[key] = getValueFromTextNode(obj[key]);
    }
  }
  return obj;
}, "getValueFromTextNode");

// node_modules/@aws-sdk/smithy-client/dist-es/lazy-json.js
var StringWrapper = /* @__PURE__ */ __name(function() {
  const Class = Object.getPrototypeOf(this).constructor;
  const Constructor = Function.bind.apply(String, [null, ...arguments]);
  const instance = new Constructor();
  Object.setPrototypeOf(instance, Class.prototype);
  return instance;
}, "StringWrapper");
StringWrapper.prototype = Object.create(String.prototype, {
  constructor: {
    value: StringWrapper,
    enumerable: false,
    writable: true,
    configurable: true
  }
});
Object.setPrototypeOf(StringWrapper, String);

// node_modules/@aws-sdk/smithy-client/dist-es/object-mapping.js
function map(arg0, arg1, arg2) {
  let target;
  let filter;
  let instructions;
  if (typeof arg1 === "undefined" && typeof arg2 === "undefined") {
    target = {};
    instructions = arg0;
  } else {
    target = arg0;
    if (typeof arg1 === "function") {
      filter = arg1;
      instructions = arg2;
      return mapWithFilter(target, filter, instructions);
    } else {
      instructions = arg1;
    }
  }
  for (const key of Object.keys(instructions)) {
    if (!Array.isArray(instructions[key])) {
      target[key] = instructions[key];
      continue;
    }
    applyInstruction(target, null, instructions, key);
  }
  return target;
}
__name(map, "map");
var take = /* @__PURE__ */ __name((source, instructions) => {
  const out = {};
  for (const key in instructions) {
    applyInstruction(out, source, instructions, key);
  }
  return out;
}, "take");
var mapWithFilter = /* @__PURE__ */ __name((target, filter, instructions) => {
  return map(target, Object.entries(instructions).reduce((_instructions, [key, value]) => {
    if (Array.isArray(value)) {
      _instructions[key] = value;
    } else {
      if (typeof value === "function") {
        _instructions[key] = [filter, value()];
      } else {
        _instructions[key] = [filter, value];
      }
    }
    return _instructions;
  }, {}));
}, "mapWithFilter");
var applyInstruction = /* @__PURE__ */ __name((target, source, instructions, targetKey) => {
  if (source !== null) {
    let instruction = instructions[targetKey];
    if (typeof instruction === "function") {
      instruction = [, instruction];
    }
    const [filter2 = nonNullish, valueFn = pass, sourceKey = targetKey] = instruction;
    if (typeof filter2 === "function" && filter2(source[sourceKey]) || typeof filter2 !== "function" && !!filter2) {
      target[targetKey] = valueFn(source[sourceKey]);
    }
    return;
  }
  let [filter, value] = instructions[targetKey];
  if (typeof value === "function") {
    let _value;
    const defaultFilterPassed = filter === void 0 && (_value = value()) != null;
    const customFilterPassed = typeof filter === "function" && !!filter(void 0) || typeof filter !== "function" && !!filter;
    if (defaultFilterPassed) {
      target[targetKey] = _value;
    } else if (customFilterPassed) {
      target[targetKey] = value();
    }
  } else {
    const defaultFilterPassed = filter === void 0 && value != null;
    const customFilterPassed = typeof filter === "function" && !!filter(value) || typeof filter !== "function" && !!filter;
    if (defaultFilterPassed || customFilterPassed) {
      target[targetKey] = value;
    }
  }
}, "applyInstruction");
var nonNullish = /* @__PURE__ */ __name((_) => _ != null, "nonNullish");
var pass = /* @__PURE__ */ __name((_) => _, "pass");

// node_modules/@aws-sdk/smithy-client/dist-es/serde-json.js
var _json = /* @__PURE__ */ __name((obj) => {
  if (obj == null) {
    return {};
  }
  if (Array.isArray(obj)) {
    return obj.filter((_) => _ != null);
  }
  if (typeof obj === "object") {
    const target = {};
    for (const key of Object.keys(obj)) {
      if (obj[key] == null) {
        continue;
      }
      target[key] = _json(obj[key]);
    }
    return target;
  }
  return obj;
}, "_json");

// node_modules/@aws-sdk/middleware-endpoint/dist-es/service-customizations/s3.js
var resolveParamsForS3 = /* @__PURE__ */ __name(async (endpointParams) => {
  const bucket = endpointParams?.Bucket || "";
  if (typeof endpointParams.Bucket === "string") {
    endpointParams.Bucket = bucket.replace(/#/g, encodeURIComponent("#")).replace(/\?/g, encodeURIComponent("?"));
  }
  if (isArnBucketName(bucket)) {
    if (endpointParams.ForcePathStyle === true) {
      throw new Error("Path-style addressing cannot be used with ARN buckets");
    }
  } else if (!isDnsCompatibleBucketName(bucket) || bucket.indexOf(".") !== -1 && !String(endpointParams.Endpoint).startsWith("http:") || bucket.toLowerCase() !== bucket || bucket.length < 3) {
    endpointParams.ForcePathStyle = true;
  }
  if (endpointParams.DisableMultiRegionAccessPoints) {
    endpointParams.disableMultiRegionAccessPoints = true;
    endpointParams.DisableMRAP = true;
  }
  return endpointParams;
}, "resolveParamsForS3");
var DOMAIN_PATTERN = /^[a-z0-9][a-z0-9\.\-]{1,61}[a-z0-9]$/;
var IP_ADDRESS_PATTERN = /(\d+\.){3}\d+/;
var DOTS_PATTERN = /\.\./;
var isDnsCompatibleBucketName = /* @__PURE__ */ __name((bucketName) => DOMAIN_PATTERN.test(bucketName) && !IP_ADDRESS_PATTERN.test(bucketName) && !DOTS_PATTERN.test(bucketName), "isDnsCompatibleBucketName");
var isArnBucketName = /* @__PURE__ */ __name((bucketName) => {
  const [arn, partition2, service, region, account, typeOrId] = bucketName.split(":");
  const isArn = arn === "arn" && bucketName.split(":").length >= 6;
  const isValidArn = [arn, partition2, service, account, typeOrId].filter(Boolean).length === 5;
  if (isArn && !isValidArn) {
    throw new Error(`Invalid ARN: ${bucketName} was an invalid ARN.`);
  }
  return arn === "arn" && !!partition2 && !!service && !!account && !!typeOrId;
}, "isArnBucketName");

// node_modules/@aws-sdk/middleware-endpoint/dist-es/adaptors/createConfigValueProvider.js
var createConfigValueProvider = /* @__PURE__ */ __name((configKey, canonicalEndpointParamKey, config) => {
  const configProvider = /* @__PURE__ */ __name(async () => {
    const configValue = config[configKey] ?? config[canonicalEndpointParamKey];
    if (typeof configValue === "function") {
      return configValue();
    }
    return configValue;
  }, "configProvider");
  if (configKey === "endpoint" || canonicalEndpointParamKey === "endpoint") {
    return async () => {
      const endpoint = await configProvider();
      if (endpoint && typeof endpoint === "object") {
        if ("url" in endpoint) {
          return endpoint.url.href;
        }
        if ("hostname" in endpoint) {
          const { protocol, hostname, port, path } = endpoint;
          return `${protocol}//${hostname}${port ? ":" + port : ""}${path}`;
        }
      }
      return endpoint;
    };
  }
  return configProvider;
}, "createConfigValueProvider");

// node_modules/@aws-sdk/middleware-endpoint/dist-es/adaptors/getEndpointFromInstructions.js
var getEndpointFromInstructions = /* @__PURE__ */ __name(async (commandInput, instructionsSupplier, clientConfig, context) => {
  const endpointParams = await resolveParams(commandInput, instructionsSupplier, clientConfig);
  if (typeof clientConfig.endpointProvider !== "function") {
    throw new Error("config.endpointProvider is not set.");
  }
  const endpoint = clientConfig.endpointProvider(endpointParams, context);
  return endpoint;
}, "getEndpointFromInstructions");
var resolveParams = /* @__PURE__ */ __name(async (commandInput, instructionsSupplier, clientConfig) => {
  const endpointParams = {};
  const instructions = instructionsSupplier?.getEndpointParameterInstructions?.() || {};
  for (const [name, instruction] of Object.entries(instructions)) {
    switch (instruction.type) {
      case "staticContextParams":
        endpointParams[name] = instruction.value;
        break;
      case "contextParams":
        endpointParams[name] = commandInput[instruction.name];
        break;
      case "clientContextParams":
      case "builtInParams":
        endpointParams[name] = await createConfigValueProvider(instruction.name, name, clientConfig)();
        break;
      default:
        throw new Error("Unrecognized endpoint parameter instruction: " + JSON.stringify(instruction));
    }
  }
  if (Object.keys(instructions).length === 0) {
    Object.assign(endpointParams, clientConfig);
  }
  if (String(clientConfig.serviceId).toLowerCase() === "s3") {
    await resolveParamsForS3(endpointParams);
  }
  return endpointParams;
}, "resolveParams");

// node_modules/@aws-sdk/querystring-parser/dist-es/index.js
function parseQueryString(querystring) {
  const query = {};
  querystring = querystring.replace(/^\?/, "");
  if (querystring) {
    for (const pair of querystring.split("&")) {
      let [key, value = null] = pair.split("=");
      key = decodeURIComponent(key);
      if (value) {
        value = decodeURIComponent(value);
      }
      if (!(key in query)) {
        query[key] = value;
      } else if (Array.isArray(query[key])) {
        query[key].push(value);
      } else {
        query[key] = [query[key], value];
      }
    }
  }
  return query;
}
__name(parseQueryString, "parseQueryString");

// node_modules/@aws-sdk/url-parser/dist-es/index.js
var parseUrl = /* @__PURE__ */ __name((url) => {
  if (typeof url === "string") {
    return parseUrl(new URL(url));
  }
  const { hostname, pathname, port, protocol, search } = url;
  let query;
  if (search) {
    query = parseQueryString(search);
  }
  return {
    hostname,
    port: port ? parseInt(port) : void 0,
    protocol,
    path: pathname,
    query
  };
}, "parseUrl");

// node_modules/@aws-sdk/middleware-endpoint/dist-es/adaptors/toEndpointV1.js
var toEndpointV1 = /* @__PURE__ */ __name((endpoint) => {
  if (typeof endpoint === "object") {
    if ("url" in endpoint) {
      return parseUrl(endpoint.url);
    }
    return endpoint;
  }
  return parseUrl(endpoint);
}, "toEndpointV1");

// node_modules/@aws-sdk/middleware-endpoint/dist-es/endpointMiddleware.js
var endpointMiddleware = /* @__PURE__ */ __name(({ config, instructions }) => {
  return (next, context) => async (args) => {
    const endpoint = await getEndpointFromInstructions(args.input, {
      getEndpointParameterInstructions() {
        return instructions;
      }
    }, { ...config }, context);
    context.endpointV2 = endpoint;
    context.authSchemes = endpoint.properties?.authSchemes;
    const authScheme = context.authSchemes?.[0];
    if (authScheme) {
      context["signing_region"] = authScheme.signingRegion;
      context["signing_service"] = authScheme.signingName;
    }
    return next({
      ...args
    });
  };
}, "endpointMiddleware");

// node_modules/@aws-sdk/middleware-serde/dist-es/deserializerMiddleware.js
var deserializerMiddleware = /* @__PURE__ */ __name((options, deserializer) => (next, context) => async (args) => {
  const { response } = await next(args);
  try {
    const parsed = await deserializer(response, options);
    return {
      response,
      output: parsed
    };
  } catch (error) {
    Object.defineProperty(error, "$response", {
      value: response
    });
    if (!("$metadata" in error)) {
      const hint = `Deserialization error: to see the raw response, inspect the hidden field {error}.$response on this object.`;
      error.message += "\n  " + hint;
    }
    throw error;
  }
}, "deserializerMiddleware");

// node_modules/@aws-sdk/middleware-serde/dist-es/serializerMiddleware.js
var serializerMiddleware = /* @__PURE__ */ __name((options, serializer) => (next, context) => async (args) => {
  const endpoint = context.endpointV2?.url && options.urlParser ? async () => options.urlParser(context.endpointV2.url) : options.endpoint;
  if (!endpoint) {
    throw new Error("No valid endpoint provider available.");
  }
  const request2 = await serializer(args.input, { ...options, endpoint });
  return next({
    ...args,
    request: request2
  });
}, "serializerMiddleware");

// node_modules/@aws-sdk/middleware-serde/dist-es/serdePlugin.js
var deserializerMiddlewareOption = {
  name: "deserializerMiddleware",
  step: "deserialize",
  tags: ["DESERIALIZER"],
  override: true
};
var serializerMiddlewareOption = {
  name: "serializerMiddleware",
  step: "serialize",
  tags: ["SERIALIZER"],
  override: true
};
function getSerdePlugin(config, serializer, deserializer) {
  return {
    applyToStack: (commandStack) => {
      commandStack.add(deserializerMiddleware(config, deserializer), deserializerMiddlewareOption);
      commandStack.add(serializerMiddleware(config, serializer), serializerMiddlewareOption);
    }
  };
}
__name(getSerdePlugin, "getSerdePlugin");

// node_modules/@aws-sdk/middleware-endpoint/dist-es/getEndpointPlugin.js
var endpointMiddlewareOptions = {
  step: "serialize",
  tags: ["ENDPOINT_PARAMETERS", "ENDPOINT_V2", "ENDPOINT"],
  name: "endpointV2Middleware",
  override: true,
  relation: "before",
  toMiddleware: serializerMiddlewareOption.name
};
var getEndpointPlugin = /* @__PURE__ */ __name((config, instructions) => ({
  applyToStack: (clientStack) => {
    clientStack.addRelativeTo(endpointMiddleware({
      config,
      instructions
    }), endpointMiddlewareOptions);
  }
}), "getEndpointPlugin");

// node_modules/@aws-sdk/util-middleware/dist-es/normalizeProvider.js
var normalizeProvider = /* @__PURE__ */ __name((input) => {
  if (typeof input === "function")
    return input;
  const promisified = Promise.resolve(input);
  return () => promisified;
}, "normalizeProvider");

// node_modules/@aws-sdk/middleware-endpoint/dist-es/resolveEndpointConfig.js
var resolveEndpointConfig = /* @__PURE__ */ __name((input) => {
  const tls = input.tls ?? true;
  const { endpoint } = input;
  const customEndpointProvider = endpoint != null ? async () => toEndpointV1(await normalizeProvider(endpoint)()) : void 0;
  const isCustomEndpoint = !!endpoint;
  return {
    ...input,
    endpoint: customEndpointProvider,
    tls,
    isCustomEndpoint,
    useDualstackEndpoint: normalizeProvider(input.useDualstackEndpoint ?? false),
    useFipsEndpoint: normalizeProvider(input.useFipsEndpoint ?? false)
  };
}, "resolveEndpointConfig");

// node_modules/@aws-sdk/protocol-http/dist-es/FieldPosition.js
var FieldPosition;
(function(FieldPosition2) {
  FieldPosition2[FieldPosition2["HEADER"] = 0] = "HEADER";
  FieldPosition2[FieldPosition2["TRAILER"] = 1] = "TRAILER";
})(FieldPosition || (FieldPosition = {}));

// node_modules/@aws-sdk/protocol-http/dist-es/httpRequest.js
var HttpRequest = class {
  constructor(options) {
    this.method = options.method || "GET";
    this.hostname = options.hostname || "localhost";
    this.port = options.port;
    this.query = options.query || {};
    this.headers = options.headers || {};
    this.body = options.body;
    this.protocol = options.protocol ? options.protocol.slice(-1) !== ":" ? `${options.protocol}:` : options.protocol : "https:";
    this.path = options.path ? options.path.charAt(0) !== "/" ? `/${options.path}` : options.path : "/";
  }
  static isInstance(request2) {
    if (!request2)
      return false;
    const req = request2;
    return "method" in req && "protocol" in req && "hostname" in req && "path" in req && typeof req["query"] === "object" && typeof req["headers"] === "object";
  }
  clone() {
    const cloned = new HttpRequest({
      ...this,
      headers: { ...this.headers }
    });
    if (cloned.query)
      cloned.query = cloneQuery(cloned.query);
    return cloned;
  }
};
__name(HttpRequest, "HttpRequest");
function cloneQuery(query) {
  return Object.keys(query).reduce((carry, paramName) => {
    const param = query[paramName];
    return {
      ...carry,
      [paramName]: Array.isArray(param) ? [...param] : param
    };
  }, {});
}
__name(cloneQuery, "cloneQuery");

// node_modules/@aws-sdk/protocol-http/dist-es/httpResponse.js
var HttpResponse = class {
  constructor(options) {
    this.statusCode = options.statusCode;
    this.headers = options.headers || {};
    this.body = options.body;
  }
  static isInstance(response) {
    if (!response)
      return false;
    const resp = response;
    return typeof resp.statusCode === "number" && typeof resp.headers === "object";
  }
};
__name(HttpResponse, "HttpResponse");

// node_modules/uuid/dist/esm-node/rng.js
import crypto from "crypto";
var rnds8Pool = new Uint8Array(256);
var poolPtr = rnds8Pool.length;
function rng() {
  if (poolPtr > rnds8Pool.length - 16) {
    crypto.randomFillSync(rnds8Pool);
    poolPtr = 0;
  }
  return rnds8Pool.slice(poolPtr, poolPtr += 16);
}
__name(rng, "rng");

// node_modules/uuid/dist/esm-node/regex.js
var regex_default = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;

// node_modules/uuid/dist/esm-node/validate.js
function validate(uuid) {
  return typeof uuid === "string" && regex_default.test(uuid);
}
__name(validate, "validate");
var validate_default = validate;

// node_modules/uuid/dist/esm-node/stringify.js
var byteToHex = [];
for (let i6 = 0; i6 < 256; ++i6) {
  byteToHex.push((i6 + 256).toString(16).substr(1));
}
function stringify(arr, offset = 0) {
  const uuid = (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + "-" + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + "-" + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + "-" + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + "-" + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase();
  if (!validate_default(uuid)) {
    throw TypeError("Stringified UUID is invalid");
  }
  return uuid;
}
__name(stringify, "stringify");
var stringify_default = stringify;

// node_modules/uuid/dist/esm-node/v4.js
function v4(options, buf, offset) {
  options = options || {};
  const rnds = options.random || (options.rng || rng)();
  rnds[6] = rnds[6] & 15 | 64;
  rnds[8] = rnds[8] & 63 | 128;
  if (buf) {
    offset = offset || 0;
    for (let i6 = 0; i6 < 16; ++i6) {
      buf[offset + i6] = rnds[i6];
    }
    return buf;
  }
  return stringify_default(rnds);
}
__name(v4, "v4");
var v4_default = v4;

// node_modules/@aws-sdk/client-ssm/dist-es/models/SSMServiceException.js
var SSMServiceException = class extends ServiceException {
  constructor(options) {
    super(options);
    Object.setPrototypeOf(this, SSMServiceException.prototype);
  }
};
__name(SSMServiceException, "SSMServiceException");

// node_modules/@aws-sdk/client-ssm/dist-es/models/models_0.js
var InternalServerError = class extends SSMServiceException {
  constructor(opts) {
    super({
      name: "InternalServerError",
      $fault: "server",
      ...opts
    });
    this.name = "InternalServerError";
    this.$fault = "server";
    Object.setPrototypeOf(this, InternalServerError.prototype);
    this.Message = opts.Message;
  }
};
__name(InternalServerError, "InternalServerError");

// node_modules/@aws-sdk/client-ssm/dist-es/models/models_1.js
var InvalidKeyId = class extends SSMServiceException {
  constructor(opts) {
    super({
      name: "InvalidKeyId",
      $fault: "client",
      ...opts
    });
    this.name = "InvalidKeyId";
    this.$fault = "client";
    Object.setPrototypeOf(this, InvalidKeyId.prototype);
  }
};
__name(InvalidKeyId, "InvalidKeyId");
var ParameterFilterSensitiveLog = /* @__PURE__ */ __name((obj) => ({
  ...obj,
  ...obj.Value && { Value: SENSITIVE_STRING }
}), "ParameterFilterSensitiveLog");
var GetParametersResultFilterSensitiveLog = /* @__PURE__ */ __name((obj) => ({
  ...obj,
  ...obj.Parameters && { Parameters: obj.Parameters.map((item) => ParameterFilterSensitiveLog(item)) }
}), "GetParametersResultFilterSensitiveLog");

// node_modules/@aws-sdk/client-ssm/dist-es/protocols/Aws_json1_1.js
var se_GetParametersCommand = /* @__PURE__ */ __name(async (input, context) => {
  const headers = sharedHeaders("GetParameters");
  let body;
  body = JSON.stringify(_json(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
}, "se_GetParametersCommand");
var de_GetParametersCommand = /* @__PURE__ */ __name(async (output, context) => {
  if (output.statusCode >= 300) {
    return de_GetParametersCommandError(output, context);
  }
  const data = await parseBody(output.body, context);
  let contents = {};
  contents = de_GetParametersResult(data, context);
  const response = {
    $metadata: deserializeMetadata2(output),
    ...contents
  };
  return response;
}, "de_GetParametersCommand");
var de_GetParametersCommandError = /* @__PURE__ */ __name(async (output, context) => {
  const parsedOutput = {
    ...output,
    body: await parseErrorBody(output.body, context)
  };
  const errorCode = loadRestJsonErrorCode(output, parsedOutput.body);
  switch (errorCode) {
    case "InternalServerError":
    case "com.amazonaws.ssm#InternalServerError":
      throw await de_InternalServerErrorRes(parsedOutput, context);
    case "InvalidKeyId":
    case "com.amazonaws.ssm#InvalidKeyId":
      throw await de_InvalidKeyIdRes(parsedOutput, context);
    default:
      const parsedBody = parsedOutput.body;
      return throwDefaultError2({
        output,
        parsedBody,
        errorCode
      });
  }
}, "de_GetParametersCommandError");
var de_InternalServerErrorRes = /* @__PURE__ */ __name(async (parsedOutput, context) => {
  const body = parsedOutput.body;
  const deserialized = _json(body);
  const exception = new InternalServerError({
    $metadata: deserializeMetadata2(parsedOutput),
    ...deserialized
  });
  return decorateServiceException(exception, body);
}, "de_InternalServerErrorRes");
var de_InvalidKeyIdRes = /* @__PURE__ */ __name(async (parsedOutput, context) => {
  const body = parsedOutput.body;
  const deserialized = _json(body);
  const exception = new InvalidKeyId({
    $metadata: deserializeMetadata2(parsedOutput),
    ...deserialized
  });
  return decorateServiceException(exception, body);
}, "de_InvalidKeyIdRes");
var de_GetParametersResult = /* @__PURE__ */ __name((output, context) => {
  return take(output, {
    InvalidParameters: _json,
    Parameters: (_) => de_ParameterList(_, context)
  });
}, "de_GetParametersResult");
var de_Parameter = /* @__PURE__ */ __name((output, context) => {
  return take(output, {
    ARN: expectString,
    DataType: expectString,
    LastModifiedDate: (_) => expectNonNull(parseEpochTimestamp(expectNumber(_))),
    Name: expectString,
    Selector: expectString,
    SourceResult: expectString,
    Type: expectString,
    Value: expectString,
    Version: expectLong
  });
}, "de_Parameter");
var de_ParameterList = /* @__PURE__ */ __name((output, context) => {
  const retVal = (output || []).filter((e6) => e6 != null).map((entry) => {
    return de_Parameter(entry, context);
  });
  return retVal;
}, "de_ParameterList");
var deserializeMetadata2 = /* @__PURE__ */ __name((output) => ({
  httpStatusCode: output.statusCode,
  requestId: output.headers["x-amzn-requestid"] ?? output.headers["x-amzn-request-id"] ?? output.headers["x-amz-request-id"],
  extendedRequestId: output.headers["x-amz-id-2"],
  cfId: output.headers["x-amz-cf-id"]
}), "deserializeMetadata");
var collectBody = /* @__PURE__ */ __name((streamBody = new Uint8Array(), context) => {
  if (streamBody instanceof Uint8Array) {
    return Promise.resolve(streamBody);
  }
  return context.streamCollector(streamBody) || Promise.resolve(new Uint8Array());
}, "collectBody");
var collectBodyString = /* @__PURE__ */ __name((streamBody, context) => collectBody(streamBody, context).then((body) => context.utf8Encoder(body)), "collectBodyString");
var throwDefaultError2 = withBaseException(SSMServiceException);
var buildHttpRpcRequest = /* @__PURE__ */ __name(async (context, headers, path, resolvedHostname, body) => {
  const { hostname, protocol = "https", port, path: basePath } = await context.endpoint();
  const contents = {
    protocol,
    hostname,
    port,
    method: "POST",
    path: basePath.endsWith("/") ? basePath.slice(0, -1) + path : basePath + path,
    headers
  };
  if (resolvedHostname !== void 0) {
    contents.hostname = resolvedHostname;
  }
  if (body !== void 0) {
    contents.body = body;
  }
  return new HttpRequest(contents);
}, "buildHttpRpcRequest");
function sharedHeaders(operation) {
  return {
    "content-type": "application/x-amz-json-1.1",
    "x-amz-target": `AmazonSSM.${operation}`
  };
}
__name(sharedHeaders, "sharedHeaders");
var parseBody = /* @__PURE__ */ __name((streamBody, context) => collectBodyString(streamBody, context).then((encoded) => {
  if (encoded.length) {
    return JSON.parse(encoded);
  }
  return {};
}), "parseBody");
var parseErrorBody = /* @__PURE__ */ __name(async (errorBody, context) => {
  const value = await parseBody(errorBody, context);
  value.message = value.message ?? value.Message;
  return value;
}, "parseErrorBody");
var loadRestJsonErrorCode = /* @__PURE__ */ __name((output, data) => {
  const findKey = /* @__PURE__ */ __name((object, key) => Object.keys(object).find((k6) => k6.toLowerCase() === key.toLowerCase()), "findKey");
  const sanitizeErrorCode = /* @__PURE__ */ __name((rawValue) => {
    let cleanValue = rawValue;
    if (typeof cleanValue === "number") {
      cleanValue = cleanValue.toString();
    }
    if (cleanValue.indexOf(",") >= 0) {
      cleanValue = cleanValue.split(",")[0];
    }
    if (cleanValue.indexOf(":") >= 0) {
      cleanValue = cleanValue.split(":")[0];
    }
    if (cleanValue.indexOf("#") >= 0) {
      cleanValue = cleanValue.split("#")[1];
    }
    return cleanValue;
  }, "sanitizeErrorCode");
  const headerKey = findKey(output.headers, "x-amzn-errortype");
  if (headerKey !== void 0) {
    return sanitizeErrorCode(output.headers[headerKey]);
  }
  if (data.code !== void 0) {
    return sanitizeErrorCode(data.code);
  }
  if (data["__type"] !== void 0) {
    return sanitizeErrorCode(data["__type"]);
  }
}, "loadRestJsonErrorCode");

// node_modules/@aws-sdk/client-ssm/dist-es/commands/GetParametersCommand.js
var GetParametersCommand = class extends Command {
  static getEndpointParameterInstructions() {
    return {
      UseFIPS: { type: "builtInParams", name: "useFipsEndpoint" },
      Endpoint: { type: "builtInParams", name: "endpoint" },
      Region: { type: "builtInParams", name: "region" },
      UseDualStack: { type: "builtInParams", name: "useDualstackEndpoint" }
    };
  }
  constructor(input) {
    super();
    this.input = input;
  }
  resolveMiddleware(clientStack, configuration, options) {
    this.middlewareStack.use(getSerdePlugin(configuration, this.serialize, this.deserialize));
    this.middlewareStack.use(getEndpointPlugin(configuration, GetParametersCommand.getEndpointParameterInstructions()));
    const stack = clientStack.concat(this.middlewareStack);
    const { logger: logger2 } = configuration;
    const clientName = "SSMClient";
    const commandName = "GetParametersCommand";
    const handlerExecutionContext = {
      logger: logger2,
      clientName,
      commandName,
      inputFilterSensitiveLog: (_) => _,
      outputFilterSensitiveLog: GetParametersResultFilterSensitiveLog
    };
    const { requestHandler } = configuration;
    return stack.resolve((request2) => requestHandler.handle(request2.request, options || {}), handlerExecutionContext);
  }
  serialize(input, context) {
    return se_GetParametersCommand(input, context);
  }
  deserialize(output, context) {
    return de_GetParametersCommand(output, context);
  }
};
__name(GetParametersCommand, "GetParametersCommand");

// node_modules/@aws-sdk/util-config-provider/dist-es/booleanSelector.js
var SelectorType;
(function(SelectorType2) {
  SelectorType2["ENV"] = "env";
  SelectorType2["CONFIG"] = "shared config entry";
})(SelectorType || (SelectorType = {}));
var booleanSelector = /* @__PURE__ */ __name((obj, key, type) => {
  if (!(key in obj))
    return void 0;
  if (obj[key] === "true")
    return true;
  if (obj[key] === "false")
    return false;
  throw new Error(`Cannot load ${type} "${key}". Expected "true" or "false", got ${obj[key]}.`);
}, "booleanSelector");

// node_modules/@aws-sdk/config-resolver/dist-es/endpointsConfig/NodeUseDualstackEndpointConfigOptions.js
var ENV_USE_DUALSTACK_ENDPOINT = "AWS_USE_DUALSTACK_ENDPOINT";
var CONFIG_USE_DUALSTACK_ENDPOINT = "use_dualstack_endpoint";
var NODE_USE_DUALSTACK_ENDPOINT_CONFIG_OPTIONS = {
  environmentVariableSelector: (env2) => booleanSelector(env2, ENV_USE_DUALSTACK_ENDPOINT, SelectorType.ENV),
  configFileSelector: (profile) => booleanSelector(profile, CONFIG_USE_DUALSTACK_ENDPOINT, SelectorType.CONFIG),
  default: false
};

// node_modules/@aws-sdk/config-resolver/dist-es/endpointsConfig/NodeUseFipsEndpointConfigOptions.js
var ENV_USE_FIPS_ENDPOINT = "AWS_USE_FIPS_ENDPOINT";
var CONFIG_USE_FIPS_ENDPOINT = "use_fips_endpoint";
var NODE_USE_FIPS_ENDPOINT_CONFIG_OPTIONS = {
  environmentVariableSelector: (env2) => booleanSelector(env2, ENV_USE_FIPS_ENDPOINT, SelectorType.ENV),
  configFileSelector: (profile) => booleanSelector(profile, CONFIG_USE_FIPS_ENDPOINT, SelectorType.CONFIG),
  default: false
};

// node_modules/@aws-sdk/config-resolver/dist-es/regionConfig/config.js
var REGION_ENV_NAME = "AWS_REGION";
var REGION_INI_NAME = "region";
var NODE_REGION_CONFIG_OPTIONS = {
  environmentVariableSelector: (env2) => env2[REGION_ENV_NAME],
  configFileSelector: (profile) => profile[REGION_INI_NAME],
  default: () => {
    throw new Error("Region is missing");
  }
};
var NODE_REGION_CONFIG_FILE_OPTIONS = {
  preferredFile: "credentials"
};

// node_modules/@aws-sdk/config-resolver/dist-es/regionConfig/isFipsRegion.js
var isFipsRegion = /* @__PURE__ */ __name((region) => typeof region === "string" && (region.startsWith("fips-") || region.endsWith("-fips")), "isFipsRegion");

// node_modules/@aws-sdk/config-resolver/dist-es/regionConfig/getRealRegion.js
var getRealRegion = /* @__PURE__ */ __name((region) => isFipsRegion(region) ? ["fips-aws-global", "aws-fips"].includes(region) ? "us-east-1" : region.replace(/fips-(dkr-|prod-)?|-fips/, "") : region, "getRealRegion");

// node_modules/@aws-sdk/config-resolver/dist-es/regionConfig/resolveRegionConfig.js
var resolveRegionConfig = /* @__PURE__ */ __name((input) => {
  const { region, useFipsEndpoint } = input;
  if (!region) {
    throw new Error("Region is missing");
  }
  return {
    ...input,
    region: async () => {
      if (typeof region === "string") {
        return getRealRegion(region);
      }
      const providedRegion = await region();
      return getRealRegion(providedRegion);
    },
    useFipsEndpoint: async () => {
      const providedRegion = typeof region === "string" ? region : await region();
      if (isFipsRegion(providedRegion)) {
        return true;
      }
      return typeof useFipsEndpoint !== "function" ? Promise.resolve(!!useFipsEndpoint) : useFipsEndpoint();
    }
  };
}, "resolveRegionConfig");

// node_modules/@aws-sdk/middleware-content-length/dist-es/index.js
var CONTENT_LENGTH_HEADER = "content-length";
function contentLengthMiddleware(bodyLengthChecker) {
  return (next) => async (args) => {
    const request2 = args.request;
    if (HttpRequest.isInstance(request2)) {
      const { body, headers } = request2;
      if (body && Object.keys(headers).map((str) => str.toLowerCase()).indexOf(CONTENT_LENGTH_HEADER) === -1) {
        try {
          const length = bodyLengthChecker(body);
          request2.headers = {
            ...request2.headers,
            [CONTENT_LENGTH_HEADER]: String(length)
          };
        } catch (error) {
        }
      }
    }
    return next({
      ...args,
      request: request2
    });
  };
}
__name(contentLengthMiddleware, "contentLengthMiddleware");
var contentLengthMiddlewareOptions = {
  step: "build",
  tags: ["SET_CONTENT_LENGTH", "CONTENT_LENGTH"],
  name: "contentLengthMiddleware",
  override: true
};
var getContentLengthPlugin = /* @__PURE__ */ __name((options) => ({
  applyToStack: (clientStack) => {
    clientStack.add(contentLengthMiddleware(options.bodyLengthChecker), contentLengthMiddlewareOptions);
  }
}), "getContentLengthPlugin");

// node_modules/@aws-sdk/middleware-host-header/dist-es/index.js
function resolveHostHeaderConfig(input) {
  return input;
}
__name(resolveHostHeaderConfig, "resolveHostHeaderConfig");
var hostHeaderMiddleware = /* @__PURE__ */ __name((options) => (next) => async (args) => {
  if (!HttpRequest.isInstance(args.request))
    return next(args);
  const { request: request2 } = args;
  const { handlerProtocol = "" } = options.requestHandler.metadata || {};
  if (handlerProtocol.indexOf("h2") >= 0 && !request2.headers[":authority"]) {
    delete request2.headers["host"];
    request2.headers[":authority"] = "";
  } else if (!request2.headers["host"]) {
    let host = request2.hostname;
    if (request2.port != null)
      host += `:${request2.port}`;
    request2.headers["host"] = host;
  }
  return next(args);
}, "hostHeaderMiddleware");
var hostHeaderMiddlewareOptions = {
  name: "hostHeaderMiddleware",
  step: "build",
  priority: "low",
  tags: ["HOST"],
  override: true
};
var getHostHeaderPlugin = /* @__PURE__ */ __name((options) => ({
  applyToStack: (clientStack) => {
    clientStack.add(hostHeaderMiddleware(options), hostHeaderMiddlewareOptions);
  }
}), "getHostHeaderPlugin");

// node_modules/@aws-sdk/middleware-logger/dist-es/loggerMiddleware.js
var loggerMiddleware = /* @__PURE__ */ __name(() => (next, context) => async (args) => {
  try {
    const response = await next(args);
    const { clientName, commandName, logger: logger2, dynamoDbDocumentClientOptions = {} } = context;
    const { overrideInputFilterSensitiveLog, overrideOutputFilterSensitiveLog } = dynamoDbDocumentClientOptions;
    const inputFilterSensitiveLog = overrideInputFilterSensitiveLog ?? context.inputFilterSensitiveLog;
    const outputFilterSensitiveLog = overrideOutputFilterSensitiveLog ?? context.outputFilterSensitiveLog;
    const { $metadata, ...outputWithoutMetadata } = response.output;
    logger2?.info?.({
      clientName,
      commandName,
      input: inputFilterSensitiveLog(args.input),
      output: outputFilterSensitiveLog(outputWithoutMetadata),
      metadata: $metadata
    });
    return response;
  } catch (error) {
    const { clientName, commandName, logger: logger2, dynamoDbDocumentClientOptions = {} } = context;
    const { overrideInputFilterSensitiveLog } = dynamoDbDocumentClientOptions;
    const inputFilterSensitiveLog = overrideInputFilterSensitiveLog ?? context.inputFilterSensitiveLog;
    logger2?.error?.({
      clientName,
      commandName,
      input: inputFilterSensitiveLog(args.input),
      error,
      metadata: error.$metadata
    });
    throw error;
  }
}, "loggerMiddleware");
var loggerMiddlewareOptions = {
  name: "loggerMiddleware",
  tags: ["LOGGER"],
  step: "initialize",
  override: true
};
var getLoggerPlugin = /* @__PURE__ */ __name((options) => ({
  applyToStack: (clientStack) => {
    clientStack.add(loggerMiddleware(), loggerMiddlewareOptions);
  }
}), "getLoggerPlugin");

// node_modules/@aws-sdk/middleware-recursion-detection/dist-es/index.js
var TRACE_ID_HEADER_NAME = "X-Amzn-Trace-Id";
var ENV_LAMBDA_FUNCTION_NAME = "AWS_LAMBDA_FUNCTION_NAME";
var ENV_TRACE_ID = "_X_AMZN_TRACE_ID";
var recursionDetectionMiddleware = /* @__PURE__ */ __name((options) => (next) => async (args) => {
  const { request: request2 } = args;
  if (!HttpRequest.isInstance(request2) || options.runtime !== "node" || request2.headers.hasOwnProperty(TRACE_ID_HEADER_NAME)) {
    return next(args);
  }
  const functionName = process.env[ENV_LAMBDA_FUNCTION_NAME];
  const traceId = process.env[ENV_TRACE_ID];
  const nonEmptyString = /* @__PURE__ */ __name((str) => typeof str === "string" && str.length > 0, "nonEmptyString");
  if (nonEmptyString(functionName) && nonEmptyString(traceId)) {
    request2.headers[TRACE_ID_HEADER_NAME] = traceId;
  }
  return next({
    ...args,
    request: request2
  });
}, "recursionDetectionMiddleware");
var addRecursionDetectionMiddlewareOptions = {
  step: "build",
  tags: ["RECURSION_DETECTION"],
  name: "recursionDetectionMiddleware",
  override: true,
  priority: "low"
};
var getRecursionDetectionPlugin = /* @__PURE__ */ __name((options) => ({
  applyToStack: (clientStack) => {
    clientStack.add(recursionDetectionMiddleware(options), addRecursionDetectionMiddlewareOptions);
  }
}), "getRecursionDetectionPlugin");

// node_modules/@aws-sdk/util-retry/dist-es/config.js
var RETRY_MODES;
(function(RETRY_MODES2) {
  RETRY_MODES2["STANDARD"] = "standard";
  RETRY_MODES2["ADAPTIVE"] = "adaptive";
})(RETRY_MODES || (RETRY_MODES = {}));
var DEFAULT_MAX_ATTEMPTS = 3;
var DEFAULT_RETRY_MODE = RETRY_MODES.STANDARD;

// node_modules/@aws-sdk/service-error-classification/dist-es/constants.js
var THROTTLING_ERROR_CODES = [
  "BandwidthLimitExceeded",
  "EC2ThrottledException",
  "LimitExceededException",
  "PriorRequestNotComplete",
  "ProvisionedThroughputExceededException",
  "RequestLimitExceeded",
  "RequestThrottled",
  "RequestThrottledException",
  "SlowDown",
  "ThrottledException",
  "Throttling",
  "ThrottlingException",
  "TooManyRequestsException",
  "TransactionInProgressException"
];
var TRANSIENT_ERROR_CODES = ["AbortError", "TimeoutError", "RequestTimeout", "RequestTimeoutException"];
var TRANSIENT_ERROR_STATUS_CODES = [500, 502, 503, 504];
var NODEJS_TIMEOUT_ERROR_CODES = ["ECONNRESET", "ECONNREFUSED", "EPIPE", "ETIMEDOUT"];

// node_modules/@aws-sdk/service-error-classification/dist-es/index.js
var isThrottlingError = /* @__PURE__ */ __name((error) => error.$metadata?.httpStatusCode === 429 || THROTTLING_ERROR_CODES.includes(error.name) || error.$retryable?.throttling == true, "isThrottlingError");
var isTransientError = /* @__PURE__ */ __name((error) => TRANSIENT_ERROR_CODES.includes(error.name) || NODEJS_TIMEOUT_ERROR_CODES.includes(error?.code || "") || TRANSIENT_ERROR_STATUS_CODES.includes(error.$metadata?.httpStatusCode || 0), "isTransientError");
var isServerError = /* @__PURE__ */ __name((error) => {
  if (error.$metadata?.httpStatusCode !== void 0) {
    const statusCode = error.$metadata.httpStatusCode;
    if (500 <= statusCode && statusCode <= 599 && !isTransientError(error)) {
      return true;
    }
    return false;
  }
  return false;
}, "isServerError");

// node_modules/@aws-sdk/util-retry/dist-es/DefaultRateLimiter.js
var DefaultRateLimiter = class {
  constructor(options) {
    this.currentCapacity = 0;
    this.enabled = false;
    this.lastMaxRate = 0;
    this.measuredTxRate = 0;
    this.requestCount = 0;
    this.lastTimestamp = 0;
    this.timeWindow = 0;
    this.beta = options?.beta ?? 0.7;
    this.minCapacity = options?.minCapacity ?? 1;
    this.minFillRate = options?.minFillRate ?? 0.5;
    this.scaleConstant = options?.scaleConstant ?? 0.4;
    this.smooth = options?.smooth ?? 0.8;
    const currentTimeInSeconds = this.getCurrentTimeInSeconds();
    this.lastThrottleTime = currentTimeInSeconds;
    this.lastTxRateBucket = Math.floor(this.getCurrentTimeInSeconds());
    this.fillRate = this.minFillRate;
    this.maxCapacity = this.minCapacity;
  }
  getCurrentTimeInSeconds() {
    return Date.now() / 1e3;
  }
  async getSendToken() {
    return this.acquireTokenBucket(1);
  }
  async acquireTokenBucket(amount) {
    if (!this.enabled) {
      return;
    }
    this.refillTokenBucket();
    if (amount > this.currentCapacity) {
      const delay = (amount - this.currentCapacity) / this.fillRate * 1e3;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
    this.currentCapacity = this.currentCapacity - amount;
  }
  refillTokenBucket() {
    const timestamp = this.getCurrentTimeInSeconds();
    if (!this.lastTimestamp) {
      this.lastTimestamp = timestamp;
      return;
    }
    const fillAmount = (timestamp - this.lastTimestamp) * this.fillRate;
    this.currentCapacity = Math.min(this.maxCapacity, this.currentCapacity + fillAmount);
    this.lastTimestamp = timestamp;
  }
  updateClientSendingRate(response) {
    let calculatedRate;
    this.updateMeasuredRate();
    if (isThrottlingError(response)) {
      const rateToUse = !this.enabled ? this.measuredTxRate : Math.min(this.measuredTxRate, this.fillRate);
      this.lastMaxRate = rateToUse;
      this.calculateTimeWindow();
      this.lastThrottleTime = this.getCurrentTimeInSeconds();
      calculatedRate = this.cubicThrottle(rateToUse);
      this.enableTokenBucket();
    } else {
      this.calculateTimeWindow();
      calculatedRate = this.cubicSuccess(this.getCurrentTimeInSeconds());
    }
    const newRate = Math.min(calculatedRate, 2 * this.measuredTxRate);
    this.updateTokenBucketRate(newRate);
  }
  calculateTimeWindow() {
    this.timeWindow = this.getPrecise(Math.pow(this.lastMaxRate * (1 - this.beta) / this.scaleConstant, 1 / 3));
  }
  cubicThrottle(rateToUse) {
    return this.getPrecise(rateToUse * this.beta);
  }
  cubicSuccess(timestamp) {
    return this.getPrecise(this.scaleConstant * Math.pow(timestamp - this.lastThrottleTime - this.timeWindow, 3) + this.lastMaxRate);
  }
  enableTokenBucket() {
    this.enabled = true;
  }
  updateTokenBucketRate(newRate) {
    this.refillTokenBucket();
    this.fillRate = Math.max(newRate, this.minFillRate);
    this.maxCapacity = Math.max(newRate, this.minCapacity);
    this.currentCapacity = Math.min(this.currentCapacity, this.maxCapacity);
  }
  updateMeasuredRate() {
    const t4 = this.getCurrentTimeInSeconds();
    const timeBucket = Math.floor(t4 * 2) / 2;
    this.requestCount++;
    if (timeBucket > this.lastTxRateBucket) {
      const currentRate = this.requestCount / (timeBucket - this.lastTxRateBucket);
      this.measuredTxRate = this.getPrecise(currentRate * this.smooth + this.measuredTxRate * (1 - this.smooth));
      this.requestCount = 0;
      this.lastTxRateBucket = timeBucket;
    }
  }
  getPrecise(num) {
    return parseFloat(num.toFixed(8));
  }
};
__name(DefaultRateLimiter, "DefaultRateLimiter");

// node_modules/@aws-sdk/util-retry/dist-es/constants.js
var DEFAULT_RETRY_DELAY_BASE = 100;
var MAXIMUM_RETRY_DELAY = 20 * 1e3;
var THROTTLING_RETRY_DELAY_BASE = 500;
var INITIAL_RETRY_TOKENS = 500;
var RETRY_COST = 5;
var TIMEOUT_RETRY_COST = 10;
var NO_RETRY_INCREMENT = 1;
var INVOCATION_ID_HEADER = "amz-sdk-invocation-id";
var REQUEST_HEADER = "amz-sdk-request";

// node_modules/@aws-sdk/util-retry/dist-es/defaultRetryBackoffStrategy.js
var getDefaultRetryBackoffStrategy = /* @__PURE__ */ __name(() => {
  let delayBase = DEFAULT_RETRY_DELAY_BASE;
  const computeNextBackoffDelay = /* @__PURE__ */ __name((attempts) => {
    return Math.floor(Math.min(MAXIMUM_RETRY_DELAY, Math.random() * 2 ** attempts * delayBase));
  }, "computeNextBackoffDelay");
  const setDelayBase = /* @__PURE__ */ __name((delay) => {
    delayBase = delay;
  }, "setDelayBase");
  return {
    computeNextBackoffDelay,
    setDelayBase
  };
}, "getDefaultRetryBackoffStrategy");

// node_modules/@aws-sdk/util-retry/dist-es/defaultRetryToken.js
var getDefaultRetryToken = /* @__PURE__ */ __name((initialRetryTokens, initialRetryDelay, initialRetryCount, options) => {
  const MAX_CAPACITY = initialRetryTokens;
  const retryCost = options?.retryCost ?? RETRY_COST;
  const timeoutRetryCost = options?.timeoutRetryCost ?? TIMEOUT_RETRY_COST;
  const retryBackoffStrategy = options?.retryBackoffStrategy ?? getDefaultRetryBackoffStrategy();
  let availableCapacity = initialRetryTokens;
  let retryDelay = Math.min(MAXIMUM_RETRY_DELAY, initialRetryDelay);
  let lastRetryCost = void 0;
  let retryCount = initialRetryCount ?? 0;
  const getCapacityAmount = /* @__PURE__ */ __name((errorType) => errorType === "TRANSIENT" ? timeoutRetryCost : retryCost, "getCapacityAmount");
  const getRetryCount = /* @__PURE__ */ __name(() => retryCount, "getRetryCount");
  const getRetryDelay = /* @__PURE__ */ __name(() => retryDelay, "getRetryDelay");
  const getLastRetryCost = /* @__PURE__ */ __name(() => lastRetryCost, "getLastRetryCost");
  const hasRetryTokens = /* @__PURE__ */ __name((errorType) => getCapacityAmount(errorType) <= availableCapacity, "hasRetryTokens");
  const getRetryTokenCount = /* @__PURE__ */ __name((errorInfo) => {
    const errorType = errorInfo.errorType;
    if (!hasRetryTokens(errorType)) {
      throw new Error("No retry token available");
    }
    const capacityAmount = getCapacityAmount(errorType);
    const delayBase = errorType === "THROTTLING" ? THROTTLING_RETRY_DELAY_BASE : DEFAULT_RETRY_DELAY_BASE;
    retryBackoffStrategy.setDelayBase(delayBase);
    const delayFromErrorType = retryBackoffStrategy.computeNextBackoffDelay(retryCount);
    if (errorInfo.retryAfterHint) {
      const delayFromRetryAfterHint = errorInfo.retryAfterHint.getTime() - Date.now();
      retryDelay = Math.max(delayFromRetryAfterHint || 0, delayFromErrorType);
    } else {
      retryDelay = delayFromErrorType;
    }
    retryCount++;
    lastRetryCost = capacityAmount;
    availableCapacity -= capacityAmount;
    return capacityAmount;
  }, "getRetryTokenCount");
  const releaseRetryTokens = /* @__PURE__ */ __name((releaseAmount) => {
    availableCapacity += releaseAmount ?? NO_RETRY_INCREMENT;
    availableCapacity = Math.min(availableCapacity, MAX_CAPACITY);
  }, "releaseRetryTokens");
  return {
    getRetryCount,
    getRetryDelay,
    getLastRetryCost,
    hasRetryTokens,
    getRetryTokenCount,
    releaseRetryTokens
  };
}, "getDefaultRetryToken");

// node_modules/@aws-sdk/util-retry/dist-es/StandardRetryStrategy.js
var StandardRetryStrategy = class {
  constructor(maxAttempts) {
    this.maxAttempts = maxAttempts;
    this.mode = RETRY_MODES.STANDARD;
    this.retryToken = getDefaultRetryToken(INITIAL_RETRY_TOKENS, DEFAULT_RETRY_DELAY_BASE);
    this.maxAttemptsProvider = typeof maxAttempts === "function" ? maxAttempts : async () => maxAttempts;
  }
  async acquireInitialRetryToken(retryTokenScope) {
    return this.retryToken;
  }
  async refreshRetryTokenForRetry(tokenToRenew, errorInfo) {
    const maxAttempts = await this.getMaxAttempts();
    if (this.shouldRetry(tokenToRenew, errorInfo, maxAttempts)) {
      tokenToRenew.getRetryTokenCount(errorInfo);
      return tokenToRenew;
    }
    throw new Error("No retry token available");
  }
  recordSuccess(token) {
    this.retryToken.releaseRetryTokens(token.getLastRetryCost());
  }
  async getMaxAttempts() {
    let maxAttempts;
    try {
      return await this.maxAttemptsProvider();
    } catch (error) {
      console.warn(`Max attempts provider could not resolve. Using default of ${DEFAULT_MAX_ATTEMPTS}`);
      return DEFAULT_MAX_ATTEMPTS;
    }
  }
  shouldRetry(tokenToRenew, errorInfo, maxAttempts) {
    const attempts = tokenToRenew.getRetryCount();
    return attempts < maxAttempts && tokenToRenew.hasRetryTokens(errorInfo.errorType) && this.isRetryableError(errorInfo.errorType);
  }
  isRetryableError(errorType) {
    return errorType === "THROTTLING" || errorType === "TRANSIENT";
  }
};
__name(StandardRetryStrategy, "StandardRetryStrategy");

// node_modules/@aws-sdk/util-retry/dist-es/AdaptiveRetryStrategy.js
var AdaptiveRetryStrategy = class {
  constructor(maxAttemptsProvider, options) {
    this.maxAttemptsProvider = maxAttemptsProvider;
    this.mode = RETRY_MODES.ADAPTIVE;
    const { rateLimiter } = options ?? {};
    this.rateLimiter = rateLimiter ?? new DefaultRateLimiter();
    this.standardRetryStrategy = new StandardRetryStrategy(maxAttemptsProvider);
  }
  async acquireInitialRetryToken(retryTokenScope) {
    await this.rateLimiter.getSendToken();
    return this.standardRetryStrategy.acquireInitialRetryToken(retryTokenScope);
  }
  async refreshRetryTokenForRetry(tokenToRenew, errorInfo) {
    this.rateLimiter.updateClientSendingRate(errorInfo);
    return this.standardRetryStrategy.refreshRetryTokenForRetry(tokenToRenew, errorInfo);
  }
  recordSuccess(token) {
    this.rateLimiter.updateClientSendingRate({});
    this.standardRetryStrategy.recordSuccess(token);
  }
};
__name(AdaptiveRetryStrategy, "AdaptiveRetryStrategy");

// node_modules/@aws-sdk/middleware-retry/dist-es/util.js
var asSdkError = /* @__PURE__ */ __name((error) => {
  if (error instanceof Error)
    return error;
  if (error instanceof Object)
    return Object.assign(new Error(), error);
  if (typeof error === "string")
    return new Error(error);
  return new Error(`AWS SDK error wrapper for ${error}`);
}, "asSdkError");

// node_modules/@aws-sdk/middleware-retry/dist-es/configurations.js
var ENV_MAX_ATTEMPTS = "AWS_MAX_ATTEMPTS";
var CONFIG_MAX_ATTEMPTS = "max_attempts";
var NODE_MAX_ATTEMPT_CONFIG_OPTIONS = {
  environmentVariableSelector: (env2) => {
    const value = env2[ENV_MAX_ATTEMPTS];
    if (!value)
      return void 0;
    const maxAttempt = parseInt(value);
    if (Number.isNaN(maxAttempt)) {
      throw new Error(`Environment variable ${ENV_MAX_ATTEMPTS} mast be a number, got "${value}"`);
    }
    return maxAttempt;
  },
  configFileSelector: (profile) => {
    const value = profile[CONFIG_MAX_ATTEMPTS];
    if (!value)
      return void 0;
    const maxAttempt = parseInt(value);
    if (Number.isNaN(maxAttempt)) {
      throw new Error(`Shared config file entry ${CONFIG_MAX_ATTEMPTS} mast be a number, got "${value}"`);
    }
    return maxAttempt;
  },
  default: DEFAULT_MAX_ATTEMPTS
};
var resolveRetryConfig = /* @__PURE__ */ __name((input) => {
  const { retryStrategy } = input;
  const maxAttempts = normalizeProvider(input.maxAttempts ?? DEFAULT_MAX_ATTEMPTS);
  return {
    ...input,
    maxAttempts,
    retryStrategy: async () => {
      if (retryStrategy) {
        return retryStrategy;
      }
      const retryMode = await normalizeProvider(input.retryMode)();
      if (retryMode === RETRY_MODES.ADAPTIVE) {
        return new AdaptiveRetryStrategy(maxAttempts);
      }
      return new StandardRetryStrategy(maxAttempts);
    }
  };
}, "resolveRetryConfig");
var ENV_RETRY_MODE = "AWS_RETRY_MODE";
var CONFIG_RETRY_MODE = "retry_mode";
var NODE_RETRY_MODE_CONFIG_OPTIONS = {
  environmentVariableSelector: (env2) => env2[ENV_RETRY_MODE],
  configFileSelector: (profile) => profile[CONFIG_RETRY_MODE],
  default: DEFAULT_RETRY_MODE
};

// node_modules/@aws-sdk/middleware-retry/dist-es/retryMiddleware.js
var retryMiddleware = /* @__PURE__ */ __name((options) => (next, context) => async (args) => {
  let retryStrategy = await options.retryStrategy();
  const maxAttempts = await options.maxAttempts();
  if (isRetryStrategyV2(retryStrategy)) {
    retryStrategy = retryStrategy;
    let retryToken = await retryStrategy.acquireInitialRetryToken(context["partition_id"]);
    let lastError = new Error();
    let attempts = 0;
    let totalRetryDelay = 0;
    const { request: request2 } = args;
    if (HttpRequest.isInstance(request2)) {
      request2.headers[INVOCATION_ID_HEADER] = v4_default();
    }
    while (true) {
      try {
        if (HttpRequest.isInstance(request2)) {
          request2.headers[REQUEST_HEADER] = `attempt=${attempts + 1}; max=${maxAttempts}`;
        }
        const { response, output } = await next(args);
        retryStrategy.recordSuccess(retryToken);
        output.$metadata.attempts = attempts + 1;
        output.$metadata.totalRetryDelay = totalRetryDelay;
        return { response, output };
      } catch (e6) {
        const retryErrorInfo = getRetryErrorInfo(e6);
        lastError = asSdkError(e6);
        try {
          retryToken = await retryStrategy.refreshRetryTokenForRetry(retryToken, retryErrorInfo);
        } catch (refreshError) {
          if (!lastError.$metadata) {
            lastError.$metadata = {};
          }
          lastError.$metadata.attempts = attempts + 1;
          lastError.$metadata.totalRetryDelay = totalRetryDelay;
          throw lastError;
        }
        attempts = retryToken.getRetryCount();
        const delay = retryToken.getRetryDelay();
        totalRetryDelay += delay;
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  } else {
    retryStrategy = retryStrategy;
    if (retryStrategy?.mode)
      context.userAgent = [...context.userAgent || [], ["cfg/retry-mode", retryStrategy.mode]];
    return retryStrategy.retry(next, args);
  }
}, "retryMiddleware");
var isRetryStrategyV2 = /* @__PURE__ */ __name((retryStrategy) => typeof retryStrategy.acquireInitialRetryToken !== "undefined" && typeof retryStrategy.refreshRetryTokenForRetry !== "undefined" && typeof retryStrategy.recordSuccess !== "undefined", "isRetryStrategyV2");
var getRetryErrorInfo = /* @__PURE__ */ __name((error) => {
  const errorInfo = {
    errorType: getRetryErrorType(error)
  };
  const retryAfterHint = getRetryAfterHint(error.$response);
  if (retryAfterHint) {
    errorInfo.retryAfterHint = retryAfterHint;
  }
  return errorInfo;
}, "getRetryErrorInfo");
var getRetryErrorType = /* @__PURE__ */ __name((error) => {
  if (isThrottlingError(error))
    return "THROTTLING";
  if (isTransientError(error))
    return "TRANSIENT";
  if (isServerError(error))
    return "SERVER_ERROR";
  return "CLIENT_ERROR";
}, "getRetryErrorType");
var retryMiddlewareOptions = {
  name: "retryMiddleware",
  tags: ["RETRY"],
  step: "finalizeRequest",
  priority: "high",
  override: true
};
var getRetryPlugin = /* @__PURE__ */ __name((options) => ({
  applyToStack: (clientStack) => {
    clientStack.add(retryMiddleware(options), retryMiddlewareOptions);
  }
}), "getRetryPlugin");
var getRetryAfterHint = /* @__PURE__ */ __name((response) => {
  if (!HttpResponse.isInstance(response))
    return;
  const retryAfterHeaderName = Object.keys(response.headers).find((key) => key.toLowerCase() === "retry-after");
  if (!retryAfterHeaderName)
    return;
  const retryAfter = response.headers[retryAfterHeaderName];
  const retryAfterSeconds = Number(retryAfter);
  if (!Number.isNaN(retryAfterSeconds))
    return new Date(retryAfterSeconds * 1e3);
  const retryAfterDate = new Date(retryAfter);
  return retryAfterDate;
}, "getRetryAfterHint");

// node_modules/@aws-sdk/property-provider/dist-es/ProviderError.js
var ProviderError = class extends Error {
  constructor(message, tryNextLink = true) {
    super(message);
    this.tryNextLink = tryNextLink;
    this.name = "ProviderError";
    Object.setPrototypeOf(this, ProviderError.prototype);
  }
  static from(error, tryNextLink = true) {
    return Object.assign(new this(error.message, tryNextLink), error);
  }
};
__name(ProviderError, "ProviderError");

// node_modules/@aws-sdk/property-provider/dist-es/CredentialsProviderError.js
var CredentialsProviderError = class extends ProviderError {
  constructor(message, tryNextLink = true) {
    super(message, tryNextLink);
    this.tryNextLink = tryNextLink;
    this.name = "CredentialsProviderError";
    Object.setPrototypeOf(this, CredentialsProviderError.prototype);
  }
};
__name(CredentialsProviderError, "CredentialsProviderError");

// node_modules/@aws-sdk/property-provider/dist-es/TokenProviderError.js
var TokenProviderError = class extends ProviderError {
  constructor(message, tryNextLink = true) {
    super(message, tryNextLink);
    this.tryNextLink = tryNextLink;
    this.name = "TokenProviderError";
    Object.setPrototypeOf(this, TokenProviderError.prototype);
  }
};
__name(TokenProviderError, "TokenProviderError");

// node_modules/@aws-sdk/property-provider/dist-es/chain.js
function chain(...providers) {
  return () => {
    let promise = Promise.reject(new ProviderError("No providers in chain"));
    for (const provider of providers) {
      promise = promise.catch((err) => {
        if (err?.tryNextLink) {
          return provider();
        }
        throw err;
      });
    }
    return promise;
  };
}
__name(chain, "chain");

// node_modules/@aws-sdk/property-provider/dist-es/fromStatic.js
var fromStatic = /* @__PURE__ */ __name((staticValue) => () => Promise.resolve(staticValue), "fromStatic");

// node_modules/@aws-sdk/property-provider/dist-es/memoize.js
var memoize = /* @__PURE__ */ __name((provider, isExpired, requiresRefresh) => {
  let resolved;
  let pending;
  let hasResult;
  let isConstant = false;
  const coalesceProvider = /* @__PURE__ */ __name(async () => {
    if (!pending) {
      pending = provider();
    }
    try {
      resolved = await pending;
      hasResult = true;
      isConstant = false;
    } finally {
      pending = void 0;
    }
    return resolved;
  }, "coalesceProvider");
  if (isExpired === void 0) {
    return async (options) => {
      if (!hasResult || options?.forceRefresh) {
        resolved = await coalesceProvider();
      }
      return resolved;
    };
  }
  return async (options) => {
    if (!hasResult || options?.forceRefresh) {
      resolved = await coalesceProvider();
    }
    if (isConstant) {
      return resolved;
    }
    if (requiresRefresh && !requiresRefresh(resolved)) {
      isConstant = true;
      return resolved;
    }
    if (isExpired(resolved)) {
      await coalesceProvider();
      return resolved;
    }
    return resolved;
  };
}, "memoize");

// node_modules/@aws-sdk/util-hex-encoding/dist-es/index.js
var SHORT_TO_HEX = {};
var HEX_TO_SHORT = {};
for (let i6 = 0; i6 < 256; i6++) {
  let encodedByte = i6.toString(16).toLowerCase();
  if (encodedByte.length === 1) {
    encodedByte = `0${encodedByte}`;
  }
  SHORT_TO_HEX[i6] = encodedByte;
  HEX_TO_SHORT[encodedByte] = i6;
}
function toHex(bytes) {
  let out = "";
  for (let i6 = 0; i6 < bytes.byteLength; i6++) {
    out += SHORT_TO_HEX[bytes[i6]];
  }
  return out;
}
__name(toHex, "toHex");

// node_modules/@aws-sdk/is-array-buffer/dist-es/index.js
var isArrayBuffer = /* @__PURE__ */ __name((arg) => typeof ArrayBuffer === "function" && arg instanceof ArrayBuffer || Object.prototype.toString.call(arg) === "[object ArrayBuffer]", "isArrayBuffer");

// node_modules/@aws-sdk/util-buffer-from/dist-es/index.js
import { Buffer as Buffer2 } from "buffer";
var fromArrayBuffer = /* @__PURE__ */ __name((input, offset = 0, length = input.byteLength - offset) => {
  if (!isArrayBuffer(input)) {
    throw new TypeError(`The "input" argument must be ArrayBuffer. Received type ${typeof input} (${input})`);
  }
  return Buffer2.from(input, offset, length);
}, "fromArrayBuffer");
var fromString = /* @__PURE__ */ __name((input, encoding) => {
  if (typeof input !== "string") {
    throw new TypeError(`The "input" argument must be of type string. Received type ${typeof input} (${input})`);
  }
  return encoding ? Buffer2.from(input, encoding) : Buffer2.from(input);
}, "fromString");

// node_modules/@aws-sdk/util-utf8/dist-es/fromUtf8.js
var fromUtf8 = /* @__PURE__ */ __name((input) => {
  const buf = fromString(input, "utf8");
  return new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength / Uint8Array.BYTES_PER_ELEMENT);
}, "fromUtf8");

// node_modules/@aws-sdk/util-utf8/dist-es/toUint8Array.js
var toUint8Array = /* @__PURE__ */ __name((data) => {
  if (typeof data === "string") {
    return fromUtf8(data);
  }
  if (ArrayBuffer.isView(data)) {
    return new Uint8Array(data.buffer, data.byteOffset, data.byteLength / Uint8Array.BYTES_PER_ELEMENT);
  }
  return new Uint8Array(data);
}, "toUint8Array");

// node_modules/@aws-sdk/util-utf8/dist-es/toUtf8.js
var toUtf8 = /* @__PURE__ */ __name((input) => fromArrayBuffer(input.buffer, input.byteOffset, input.byteLength).toString("utf8"), "toUtf8");

// node_modules/@aws-sdk/signature-v4/dist-es/constants.js
var ALGORITHM_QUERY_PARAM = "X-Amz-Algorithm";
var CREDENTIAL_QUERY_PARAM = "X-Amz-Credential";
var AMZ_DATE_QUERY_PARAM = "X-Amz-Date";
var SIGNED_HEADERS_QUERY_PARAM = "X-Amz-SignedHeaders";
var EXPIRES_QUERY_PARAM = "X-Amz-Expires";
var SIGNATURE_QUERY_PARAM = "X-Amz-Signature";
var TOKEN_QUERY_PARAM = "X-Amz-Security-Token";
var AUTH_HEADER = "authorization";
var AMZ_DATE_HEADER = AMZ_DATE_QUERY_PARAM.toLowerCase();
var DATE_HEADER = "date";
var GENERATED_HEADERS = [AUTH_HEADER, AMZ_DATE_HEADER, DATE_HEADER];
var SIGNATURE_HEADER = SIGNATURE_QUERY_PARAM.toLowerCase();
var SHA256_HEADER = "x-amz-content-sha256";
var TOKEN_HEADER = TOKEN_QUERY_PARAM.toLowerCase();
var ALWAYS_UNSIGNABLE_HEADERS = {
  authorization: true,
  "cache-control": true,
  connection: true,
  expect: true,
  from: true,
  "keep-alive": true,
  "max-forwards": true,
  pragma: true,
  referer: true,
  te: true,
  trailer: true,
  "transfer-encoding": true,
  upgrade: true,
  "user-agent": true,
  "x-amzn-trace-id": true
};
var PROXY_HEADER_PATTERN = /^proxy-/;
var SEC_HEADER_PATTERN = /^sec-/;
var ALGORITHM_IDENTIFIER = "AWS4-HMAC-SHA256";
var EVENT_ALGORITHM_IDENTIFIER = "AWS4-HMAC-SHA256-PAYLOAD";
var UNSIGNED_PAYLOAD = "UNSIGNED-PAYLOAD";
var MAX_CACHE_SIZE = 50;
var KEY_TYPE_IDENTIFIER = "aws4_request";
var MAX_PRESIGNED_TTL = 60 * 60 * 24 * 7;

// node_modules/@aws-sdk/signature-v4/dist-es/credentialDerivation.js
var signingKeyCache = {};
var cacheQueue = [];
var createScope = /* @__PURE__ */ __name((shortDate, region, service) => `${shortDate}/${region}/${service}/${KEY_TYPE_IDENTIFIER}`, "createScope");
var getSigningKey = /* @__PURE__ */ __name(async (sha256Constructor, credentials, shortDate, region, service) => {
  const credsHash = await hmac(sha256Constructor, credentials.secretAccessKey, credentials.accessKeyId);
  const cacheKey = `${shortDate}:${region}:${service}:${toHex(credsHash)}:${credentials.sessionToken}`;
  if (cacheKey in signingKeyCache) {
    return signingKeyCache[cacheKey];
  }
  cacheQueue.push(cacheKey);
  while (cacheQueue.length > MAX_CACHE_SIZE) {
    delete signingKeyCache[cacheQueue.shift()];
  }
  let key = `AWS4${credentials.secretAccessKey}`;
  for (const signable of [shortDate, region, service, KEY_TYPE_IDENTIFIER]) {
    key = await hmac(sha256Constructor, key, signable);
  }
  return signingKeyCache[cacheKey] = key;
}, "getSigningKey");
var hmac = /* @__PURE__ */ __name((ctor, secret, data) => {
  const hash = new ctor(secret);
  hash.update(toUint8Array(data));
  return hash.digest();
}, "hmac");

// node_modules/@aws-sdk/signature-v4/dist-es/getCanonicalHeaders.js
var getCanonicalHeaders = /* @__PURE__ */ __name(({ headers }, unsignableHeaders, signableHeaders) => {
  const canonical = {};
  for (const headerName of Object.keys(headers).sort()) {
    if (headers[headerName] == void 0) {
      continue;
    }
    const canonicalHeaderName = headerName.toLowerCase();
    if (canonicalHeaderName in ALWAYS_UNSIGNABLE_HEADERS || unsignableHeaders?.has(canonicalHeaderName) || PROXY_HEADER_PATTERN.test(canonicalHeaderName) || SEC_HEADER_PATTERN.test(canonicalHeaderName)) {
      if (!signableHeaders || signableHeaders && !signableHeaders.has(canonicalHeaderName)) {
        continue;
      }
    }
    canonical[canonicalHeaderName] = headers[headerName].trim().replace(/\s+/g, " ");
  }
  return canonical;
}, "getCanonicalHeaders");

// node_modules/@aws-sdk/util-uri-escape/dist-es/escape-uri.js
var escapeUri = /* @__PURE__ */ __name((uri) => encodeURIComponent(uri).replace(/[!'()*]/g, hexEncode), "escapeUri");
var hexEncode = /* @__PURE__ */ __name((c6) => `%${c6.charCodeAt(0).toString(16).toUpperCase()}`, "hexEncode");

// node_modules/@aws-sdk/signature-v4/dist-es/getCanonicalQuery.js
var getCanonicalQuery = /* @__PURE__ */ __name(({ query = {} }) => {
  const keys = [];
  const serialized = {};
  for (const key of Object.keys(query).sort()) {
    if (key.toLowerCase() === SIGNATURE_HEADER) {
      continue;
    }
    keys.push(key);
    const value = query[key];
    if (typeof value === "string") {
      serialized[key] = `${escapeUri(key)}=${escapeUri(value)}`;
    } else if (Array.isArray(value)) {
      serialized[key] = value.slice(0).sort().reduce((encoded, value2) => encoded.concat([`${escapeUri(key)}=${escapeUri(value2)}`]), []).join("&");
    }
  }
  return keys.map((key) => serialized[key]).filter((serialized2) => serialized2).join("&");
}, "getCanonicalQuery");

// node_modules/@aws-sdk/signature-v4/dist-es/getPayloadHash.js
var getPayloadHash = /* @__PURE__ */ __name(async ({ headers, body }, hashConstructor) => {
  for (const headerName of Object.keys(headers)) {
    if (headerName.toLowerCase() === SHA256_HEADER) {
      return headers[headerName];
    }
  }
  if (body == void 0) {
    return "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";
  } else if (typeof body === "string" || ArrayBuffer.isView(body) || isArrayBuffer(body)) {
    const hashCtor = new hashConstructor();
    hashCtor.update(toUint8Array(body));
    return toHex(await hashCtor.digest());
  }
  return UNSIGNED_PAYLOAD;
}, "getPayloadHash");

// node_modules/@aws-sdk/signature-v4/dist-es/headerUtil.js
var hasHeader = /* @__PURE__ */ __name((soughtHeader, headers) => {
  soughtHeader = soughtHeader.toLowerCase();
  for (const headerName of Object.keys(headers)) {
    if (soughtHeader === headerName.toLowerCase()) {
      return true;
    }
  }
  return false;
}, "hasHeader");

// node_modules/@aws-sdk/signature-v4/dist-es/cloneRequest.js
var cloneRequest = /* @__PURE__ */ __name(({ headers, query, ...rest }) => ({
  ...rest,
  headers: { ...headers },
  query: query ? cloneQuery2(query) : void 0
}), "cloneRequest");
var cloneQuery2 = /* @__PURE__ */ __name((query) => Object.keys(query).reduce((carry, paramName) => {
  const param = query[paramName];
  return {
    ...carry,
    [paramName]: Array.isArray(param) ? [...param] : param
  };
}, {}), "cloneQuery");

// node_modules/@aws-sdk/signature-v4/dist-es/moveHeadersToQuery.js
var moveHeadersToQuery = /* @__PURE__ */ __name((request2, options = {}) => {
  const { headers, query = {} } = typeof request2.clone === "function" ? request2.clone() : cloneRequest(request2);
  for (const name of Object.keys(headers)) {
    const lname = name.toLowerCase();
    if (lname.slice(0, 6) === "x-amz-" && !options.unhoistableHeaders?.has(lname)) {
      query[name] = headers[name];
      delete headers[name];
    }
  }
  return {
    ...request2,
    headers,
    query
  };
}, "moveHeadersToQuery");

// node_modules/@aws-sdk/signature-v4/dist-es/prepareRequest.js
var prepareRequest = /* @__PURE__ */ __name((request2) => {
  request2 = typeof request2.clone === "function" ? request2.clone() : cloneRequest(request2);
  for (const headerName of Object.keys(request2.headers)) {
    if (GENERATED_HEADERS.indexOf(headerName.toLowerCase()) > -1) {
      delete request2.headers[headerName];
    }
  }
  return request2;
}, "prepareRequest");

// node_modules/@aws-sdk/signature-v4/dist-es/utilDate.js
var iso8601 = /* @__PURE__ */ __name((time) => toDate(time).toISOString().replace(/\.\d{3}Z$/, "Z"), "iso8601");
var toDate = /* @__PURE__ */ __name((time) => {
  if (typeof time === "number") {
    return new Date(time * 1e3);
  }
  if (typeof time === "string") {
    if (Number(time)) {
      return new Date(Number(time) * 1e3);
    }
    return new Date(time);
  }
  return time;
}, "toDate");

// node_modules/@aws-sdk/signature-v4/dist-es/SignatureV4.js
var SignatureV4 = class {
  constructor({ applyChecksum, credentials, region, service, sha256, uriEscapePath = true }) {
    this.service = service;
    this.sha256 = sha256;
    this.uriEscapePath = uriEscapePath;
    this.applyChecksum = typeof applyChecksum === "boolean" ? applyChecksum : true;
    this.regionProvider = normalizeProvider(region);
    this.credentialProvider = normalizeProvider(credentials);
  }
  async presign(originalRequest, options = {}) {
    const { signingDate = new Date(), expiresIn = 3600, unsignableHeaders, unhoistableHeaders, signableHeaders, signingRegion, signingService } = options;
    const credentials = await this.credentialProvider();
    this.validateResolvedCredentials(credentials);
    const region = signingRegion ?? await this.regionProvider();
    const { longDate, shortDate } = formatDate(signingDate);
    if (expiresIn > MAX_PRESIGNED_TTL) {
      return Promise.reject("Signature version 4 presigned URLs must have an expiration date less than one week in the future");
    }
    const scope = createScope(shortDate, region, signingService ?? this.service);
    const request2 = moveHeadersToQuery(prepareRequest(originalRequest), { unhoistableHeaders });
    if (credentials.sessionToken) {
      request2.query[TOKEN_QUERY_PARAM] = credentials.sessionToken;
    }
    request2.query[ALGORITHM_QUERY_PARAM] = ALGORITHM_IDENTIFIER;
    request2.query[CREDENTIAL_QUERY_PARAM] = `${credentials.accessKeyId}/${scope}`;
    request2.query[AMZ_DATE_QUERY_PARAM] = longDate;
    request2.query[EXPIRES_QUERY_PARAM] = expiresIn.toString(10);
    const canonicalHeaders = getCanonicalHeaders(request2, unsignableHeaders, signableHeaders);
    request2.query[SIGNED_HEADERS_QUERY_PARAM] = getCanonicalHeaderList(canonicalHeaders);
    request2.query[SIGNATURE_QUERY_PARAM] = await this.getSignature(longDate, scope, this.getSigningKey(credentials, region, shortDate, signingService), this.createCanonicalRequest(request2, canonicalHeaders, await getPayloadHash(originalRequest, this.sha256)));
    return request2;
  }
  async sign(toSign, options) {
    if (typeof toSign === "string") {
      return this.signString(toSign, options);
    } else if (toSign.headers && toSign.payload) {
      return this.signEvent(toSign, options);
    } else {
      return this.signRequest(toSign, options);
    }
  }
  async signEvent({ headers, payload }, { signingDate = new Date(), priorSignature, signingRegion, signingService }) {
    const region = signingRegion ?? await this.regionProvider();
    const { shortDate, longDate } = formatDate(signingDate);
    const scope = createScope(shortDate, region, signingService ?? this.service);
    const hashedPayload = await getPayloadHash({ headers: {}, body: payload }, this.sha256);
    const hash = new this.sha256();
    hash.update(headers);
    const hashedHeaders = toHex(await hash.digest());
    const stringToSign = [
      EVENT_ALGORITHM_IDENTIFIER,
      longDate,
      scope,
      priorSignature,
      hashedHeaders,
      hashedPayload
    ].join("\n");
    return this.signString(stringToSign, { signingDate, signingRegion: region, signingService });
  }
  async signString(stringToSign, { signingDate = new Date(), signingRegion, signingService } = {}) {
    const credentials = await this.credentialProvider();
    this.validateResolvedCredentials(credentials);
    const region = signingRegion ?? await this.regionProvider();
    const { shortDate } = formatDate(signingDate);
    const hash = new this.sha256(await this.getSigningKey(credentials, region, shortDate, signingService));
    hash.update(toUint8Array(stringToSign));
    return toHex(await hash.digest());
  }
  async signRequest(requestToSign, { signingDate = new Date(), signableHeaders, unsignableHeaders, signingRegion, signingService } = {}) {
    const credentials = await this.credentialProvider();
    this.validateResolvedCredentials(credentials);
    const region = signingRegion ?? await this.regionProvider();
    const request2 = prepareRequest(requestToSign);
    const { longDate, shortDate } = formatDate(signingDate);
    const scope = createScope(shortDate, region, signingService ?? this.service);
    request2.headers[AMZ_DATE_HEADER] = longDate;
    if (credentials.sessionToken) {
      request2.headers[TOKEN_HEADER] = credentials.sessionToken;
    }
    const payloadHash = await getPayloadHash(request2, this.sha256);
    if (!hasHeader(SHA256_HEADER, request2.headers) && this.applyChecksum) {
      request2.headers[SHA256_HEADER] = payloadHash;
    }
    const canonicalHeaders = getCanonicalHeaders(request2, unsignableHeaders, signableHeaders);
    const signature = await this.getSignature(longDate, scope, this.getSigningKey(credentials, region, shortDate, signingService), this.createCanonicalRequest(request2, canonicalHeaders, payloadHash));
    request2.headers[AUTH_HEADER] = `${ALGORITHM_IDENTIFIER} Credential=${credentials.accessKeyId}/${scope}, SignedHeaders=${getCanonicalHeaderList(canonicalHeaders)}, Signature=${signature}`;
    return request2;
  }
  createCanonicalRequest(request2, canonicalHeaders, payloadHash) {
    const sortedHeaders = Object.keys(canonicalHeaders).sort();
    return `${request2.method}
${this.getCanonicalPath(request2)}
${getCanonicalQuery(request2)}
${sortedHeaders.map((name) => `${name}:${canonicalHeaders[name]}`).join("\n")}

${sortedHeaders.join(";")}
${payloadHash}`;
  }
  async createStringToSign(longDate, credentialScope, canonicalRequest) {
    const hash = new this.sha256();
    hash.update(toUint8Array(canonicalRequest));
    const hashedRequest = await hash.digest();
    return `${ALGORITHM_IDENTIFIER}
${longDate}
${credentialScope}
${toHex(hashedRequest)}`;
  }
  getCanonicalPath({ path }) {
    if (this.uriEscapePath) {
      const normalizedPathSegments = [];
      for (const pathSegment of path.split("/")) {
        if (pathSegment?.length === 0)
          continue;
        if (pathSegment === ".")
          continue;
        if (pathSegment === "..") {
          normalizedPathSegments.pop();
        } else {
          normalizedPathSegments.push(pathSegment);
        }
      }
      const normalizedPath = `${path?.startsWith("/") ? "/" : ""}${normalizedPathSegments.join("/")}${normalizedPathSegments.length > 0 && path?.endsWith("/") ? "/" : ""}`;
      const doubleEncoded = encodeURIComponent(normalizedPath);
      return doubleEncoded.replace(/%2F/g, "/");
    }
    return path;
  }
  async getSignature(longDate, credentialScope, keyPromise, canonicalRequest) {
    const stringToSign = await this.createStringToSign(longDate, credentialScope, canonicalRequest);
    const hash = new this.sha256(await keyPromise);
    hash.update(toUint8Array(stringToSign));
    return toHex(await hash.digest());
  }
  getSigningKey(credentials, region, shortDate, service) {
    return getSigningKey(this.sha256, credentials, shortDate, region, service || this.service);
  }
  validateResolvedCredentials(credentials) {
    if (typeof credentials !== "object" || typeof credentials.accessKeyId !== "string" || typeof credentials.secretAccessKey !== "string") {
      throw new Error("Resolved credential object is not valid");
    }
  }
};
__name(SignatureV4, "SignatureV4");
var formatDate = /* @__PURE__ */ __name((now) => {
  const longDate = iso8601(now).replace(/[\-:]/g, "");
  return {
    longDate,
    shortDate: longDate.slice(0, 8)
  };
}, "formatDate");
var getCanonicalHeaderList = /* @__PURE__ */ __name((headers) => Object.keys(headers).sort().join(";"), "getCanonicalHeaderList");

// node_modules/@aws-sdk/middleware-signing/dist-es/configurations.js
var CREDENTIAL_EXPIRE_WINDOW = 3e5;
var resolveAwsAuthConfig = /* @__PURE__ */ __name((input) => {
  const normalizedCreds = input.credentials ? normalizeCredentialProvider(input.credentials) : input.credentialDefaultProvider(input);
  const { signingEscapePath = true, systemClockOffset = input.systemClockOffset || 0, sha256 } = input;
  let signer;
  if (input.signer) {
    signer = normalizeProvider(input.signer);
  } else if (input.regionInfoProvider) {
    signer = /* @__PURE__ */ __name(() => normalizeProvider(input.region)().then(async (region) => [
      await input.regionInfoProvider(region, {
        useFipsEndpoint: await input.useFipsEndpoint(),
        useDualstackEndpoint: await input.useDualstackEndpoint()
      }) || {},
      region
    ]).then(([regionInfo, region]) => {
      const { signingRegion, signingService } = regionInfo;
      input.signingRegion = input.signingRegion || signingRegion || region;
      input.signingName = input.signingName || signingService || input.serviceId;
      const params = {
        ...input,
        credentials: normalizedCreds,
        region: input.signingRegion,
        service: input.signingName,
        sha256,
        uriEscapePath: signingEscapePath
      };
      const SignerCtor = input.signerConstructor || SignatureV4;
      return new SignerCtor(params);
    }), "signer");
  } else {
    signer = /* @__PURE__ */ __name(async (authScheme) => {
      authScheme = Object.assign({}, {
        name: "sigv4",
        signingName: input.signingName || input.defaultSigningName,
        signingRegion: await normalizeProvider(input.region)(),
        properties: {}
      }, authScheme);
      const signingRegion = authScheme.signingRegion;
      const signingService = authScheme.signingName;
      input.signingRegion = input.signingRegion || signingRegion;
      input.signingName = input.signingName || signingService || input.serviceId;
      const params = {
        ...input,
        credentials: normalizedCreds,
        region: input.signingRegion,
        service: input.signingName,
        sha256,
        uriEscapePath: signingEscapePath
      };
      const SignerCtor = input.signerConstructor || SignatureV4;
      return new SignerCtor(params);
    }, "signer");
  }
  return {
    ...input,
    systemClockOffset,
    signingEscapePath,
    credentials: normalizedCreds,
    signer
  };
}, "resolveAwsAuthConfig");
var normalizeCredentialProvider = /* @__PURE__ */ __name((credentials) => {
  if (typeof credentials === "function") {
    return memoize(credentials, (credentials2) => credentials2.expiration !== void 0 && credentials2.expiration.getTime() - Date.now() < CREDENTIAL_EXPIRE_WINDOW, (credentials2) => credentials2.expiration !== void 0);
  }
  return normalizeProvider(credentials);
}, "normalizeCredentialProvider");

// node_modules/@aws-sdk/middleware-signing/dist-es/utils/getSkewCorrectedDate.js
var getSkewCorrectedDate = /* @__PURE__ */ __name((systemClockOffset) => new Date(Date.now() + systemClockOffset), "getSkewCorrectedDate");

// node_modules/@aws-sdk/middleware-signing/dist-es/utils/isClockSkewed.js
var isClockSkewed = /* @__PURE__ */ __name((clockTime, systemClockOffset) => Math.abs(getSkewCorrectedDate(systemClockOffset).getTime() - clockTime) >= 3e5, "isClockSkewed");

// node_modules/@aws-sdk/middleware-signing/dist-es/utils/getUpdatedSystemClockOffset.js
var getUpdatedSystemClockOffset = /* @__PURE__ */ __name((clockTime, currentSystemClockOffset) => {
  const clockTimeInMs = Date.parse(clockTime);
  if (isClockSkewed(clockTimeInMs, currentSystemClockOffset)) {
    return clockTimeInMs - Date.now();
  }
  return currentSystemClockOffset;
}, "getUpdatedSystemClockOffset");

// node_modules/@aws-sdk/middleware-signing/dist-es/middleware.js
var awsAuthMiddleware = /* @__PURE__ */ __name((options) => (next, context) => async function(args) {
  if (!HttpRequest.isInstance(args.request))
    return next(args);
  const authScheme = context.endpointV2?.properties?.authSchemes?.[0];
  const multiRegionOverride = authScheme?.name === "sigv4a" ? authScheme?.signingRegionSet?.join(",") : void 0;
  const signer = await options.signer(authScheme);
  const output = await next({
    ...args,
    request: await signer.sign(args.request, {
      signingDate: getSkewCorrectedDate(options.systemClockOffset),
      signingRegion: multiRegionOverride || context["signing_region"],
      signingService: context["signing_service"]
    })
  }).catch((error) => {
    const serverTime = error.ServerTime ?? getDateHeader(error.$response);
    if (serverTime) {
      options.systemClockOffset = getUpdatedSystemClockOffset(serverTime, options.systemClockOffset);
    }
    throw error;
  });
  const dateHeader = getDateHeader(output.response);
  if (dateHeader) {
    options.systemClockOffset = getUpdatedSystemClockOffset(dateHeader, options.systemClockOffset);
  }
  return output;
}, "awsAuthMiddleware");
var getDateHeader = /* @__PURE__ */ __name((response) => HttpResponse.isInstance(response) ? response.headers?.date ?? response.headers?.Date : void 0, "getDateHeader");
var awsAuthMiddlewareOptions = {
  name: "awsAuthMiddleware",
  tags: ["SIGNATURE", "AWSAUTH"],
  relation: "after",
  toMiddleware: "retryMiddleware",
  override: true
};
var getAwsAuthPlugin = /* @__PURE__ */ __name((options) => ({
  applyToStack: (clientStack) => {
    clientStack.addRelativeTo(awsAuthMiddleware(options), awsAuthMiddlewareOptions);
  }
}), "getAwsAuthPlugin");

// node_modules/@aws-sdk/middleware-user-agent/dist-es/configurations.js
function resolveUserAgentConfig(input) {
  return {
    ...input,
    customUserAgent: typeof input.customUserAgent === "string" ? [[input.customUserAgent]] : input.customUserAgent
  };
}
__name(resolveUserAgentConfig, "resolveUserAgentConfig");

// node_modules/@aws-sdk/util-endpoints/dist-es/lib/aws/partitions.json
var partitions_default = {
  partitions: [{
    id: "aws",
    outputs: {
      dnsSuffix: "amazonaws.com",
      dualStackDnsSuffix: "api.aws",
      name: "aws",
      supportsDualStack: true,
      supportsFIPS: true
    },
    regionRegex: "^(us|eu|ap|sa|ca|me|af)\\-\\w+\\-\\d+$",
    regions: {
      "af-south-1": {
        description: "Africa (Cape Town)"
      },
      "ap-east-1": {
        description: "Asia Pacific (Hong Kong)"
      },
      "ap-northeast-1": {
        description: "Asia Pacific (Tokyo)"
      },
      "ap-northeast-2": {
        description: "Asia Pacific (Seoul)"
      },
      "ap-northeast-3": {
        description: "Asia Pacific (Osaka)"
      },
      "ap-south-1": {
        description: "Asia Pacific (Mumbai)"
      },
      "ap-south-2": {
        description: "Asia Pacific (Hyderabad)"
      },
      "ap-southeast-1": {
        description: "Asia Pacific (Singapore)"
      },
      "ap-southeast-2": {
        description: "Asia Pacific (Sydney)"
      },
      "ap-southeast-3": {
        description: "Asia Pacific (Jakarta)"
      },
      "ap-southeast-4": {
        description: "Asia Pacific (Melbourne)"
      },
      "aws-global": {
        description: "AWS Standard global region"
      },
      "ca-central-1": {
        description: "Canada (Central)"
      },
      "eu-central-1": {
        description: "Europe (Frankfurt)"
      },
      "eu-central-2": {
        description: "Europe (Zurich)"
      },
      "eu-north-1": {
        description: "Europe (Stockholm)"
      },
      "eu-south-1": {
        description: "Europe (Milan)"
      },
      "eu-south-2": {
        description: "Europe (Spain)"
      },
      "eu-west-1": {
        description: "Europe (Ireland)"
      },
      "eu-west-2": {
        description: "Europe (London)"
      },
      "eu-west-3": {
        description: "Europe (Paris)"
      },
      "me-central-1": {
        description: "Middle East (UAE)"
      },
      "me-south-1": {
        description: "Middle East (Bahrain)"
      },
      "sa-east-1": {
        description: "South America (Sao Paulo)"
      },
      "us-east-1": {
        description: "US East (N. Virginia)"
      },
      "us-east-2": {
        description: "US East (Ohio)"
      },
      "us-west-1": {
        description: "US West (N. California)"
      },
      "us-west-2": {
        description: "US West (Oregon)"
      }
    }
  }, {
    id: "aws-cn",
    outputs: {
      dnsSuffix: "amazonaws.com.cn",
      dualStackDnsSuffix: "api.amazonwebservices.com.cn",
      name: "aws-cn",
      supportsDualStack: true,
      supportsFIPS: true
    },
    regionRegex: "^cn\\-\\w+\\-\\d+$",
    regions: {
      "aws-cn-global": {
        description: "AWS China global region"
      },
      "cn-north-1": {
        description: "China (Beijing)"
      },
      "cn-northwest-1": {
        description: "China (Ningxia)"
      }
    }
  }, {
    id: "aws-us-gov",
    outputs: {
      dnsSuffix: "amazonaws.com",
      dualStackDnsSuffix: "api.aws",
      name: "aws-us-gov",
      supportsDualStack: true,
      supportsFIPS: true
    },
    regionRegex: "^us\\-gov\\-\\w+\\-\\d+$",
    regions: {
      "aws-us-gov-global": {
        description: "AWS GovCloud (US) global region"
      },
      "us-gov-east-1": {
        description: "AWS GovCloud (US-East)"
      },
      "us-gov-west-1": {
        description: "AWS GovCloud (US-West)"
      }
    }
  }, {
    id: "aws-iso",
    outputs: {
      dnsSuffix: "c2s.ic.gov",
      dualStackDnsSuffix: "c2s.ic.gov",
      name: "aws-iso",
      supportsDualStack: false,
      supportsFIPS: true
    },
    regionRegex: "^us\\-iso\\-\\w+\\-\\d+$",
    regions: {
      "aws-iso-global": {
        description: "AWS ISO (US) global region"
      },
      "us-iso-east-1": {
        description: "US ISO East"
      },
      "us-iso-west-1": {
        description: "US ISO WEST"
      }
    }
  }, {
    id: "aws-iso-b",
    outputs: {
      dnsSuffix: "sc2s.sgov.gov",
      dualStackDnsSuffix: "sc2s.sgov.gov",
      name: "aws-iso-b",
      supportsDualStack: false,
      supportsFIPS: true
    },
    regionRegex: "^us\\-isob\\-\\w+\\-\\d+$",
    regions: {
      "aws-iso-b-global": {
        description: "AWS ISOB (US) global region"
      },
      "us-isob-east-1": {
        description: "US ISOB East (Ohio)"
      }
    }
  }, {
    id: "aws-iso-e",
    outputs: {
      dnsSuffix: "cloud.adc-e.uk",
      dualStackDnsSuffix: "cloud.adc-e.uk",
      name: "aws-iso-e",
      supportsDualStack: false,
      supportsFIPS: true
    },
    regionRegex: "^eu\\-isoe\\-\\w+\\-\\d+$",
    regions: {}
  }],
  version: "1.1"
};

// node_modules/@aws-sdk/util-endpoints/dist-es/lib/aws/partition.js
var selectedPartitionsInfo = partitions_default;
var selectedUserAgentPrefix = "";
var partition = /* @__PURE__ */ __name((value) => {
  const { partitions } = selectedPartitionsInfo;
  for (const partition2 of partitions) {
    const { regions, outputs } = partition2;
    for (const [region, regionData] of Object.entries(regions)) {
      if (region === value) {
        return {
          ...outputs,
          ...regionData
        };
      }
    }
  }
  for (const partition2 of partitions) {
    const { regionRegex, outputs } = partition2;
    if (new RegExp(regionRegex).test(value)) {
      return {
        ...outputs
      };
    }
  }
  const DEFAULT_PARTITION = partitions.find((partition2) => partition2.id === "aws");
  if (!DEFAULT_PARTITION) {
    throw new Error("Provided region was not found in the partition array or regex, and default partition with id 'aws' doesn't exist.");
  }
  return {
    ...DEFAULT_PARTITION.outputs
  };
}, "partition");
var setPartitionInfo = /* @__PURE__ */ __name((partitionsInfo, userAgentPrefix = "") => {
  selectedPartitionsInfo = partitionsInfo;
  selectedUserAgentPrefix = userAgentPrefix;
}, "setPartitionInfo");
var useDefaultPartitionInfo = /* @__PURE__ */ __name(() => {
  setPartitionInfo(partitions_default, "");
}, "useDefaultPartitionInfo");
var getUserAgentPrefix = /* @__PURE__ */ __name(() => selectedUserAgentPrefix, "getUserAgentPrefix");

// node_modules/@aws-sdk/util-endpoints/dist-es/debug/debugId.js
var debugId = "endpoints";

// node_modules/@aws-sdk/util-endpoints/dist-es/debug/toDebugString.js
function toDebugString(input) {
  if (typeof input !== "object" || input == null) {
    return input;
  }
  if ("ref" in input) {
    return `$${toDebugString(input.ref)}`;
  }
  if ("fn" in input) {
    return `${input.fn}(${(input.argv || []).map(toDebugString).join(", ")})`;
  }
  return JSON.stringify(input, null, 2);
}
__name(toDebugString, "toDebugString");

// node_modules/@aws-sdk/util-endpoints/dist-es/types/EndpointError.js
var EndpointError = class extends Error {
  constructor(message) {
    super(message);
    this.name = "EndpointError";
  }
};
__name(EndpointError, "EndpointError");

// node_modules/@aws-sdk/util-endpoints/dist-es/lib/index.js
var lib_exports = {};
__export(lib_exports, {
  aws: () => aws_exports,
  booleanEquals: () => booleanEquals,
  getAttr: () => getAttr,
  isSet: () => isSet,
  isValidHostLabel: () => isValidHostLabel,
  not: () => not,
  parseURL: () => parseURL,
  stringEquals: () => stringEquals,
  substring: () => substring,
  uriEncode: () => uriEncode
});

// node_modules/@aws-sdk/util-endpoints/dist-es/lib/aws/index.js
var aws_exports = {};
__export(aws_exports, {
  getUserAgentPrefix: () => getUserAgentPrefix,
  isVirtualHostableS3Bucket: () => isVirtualHostableS3Bucket,
  parseArn: () => parseArn,
  partition: () => partition,
  setPartitionInfo: () => setPartitionInfo,
  useDefaultPartitionInfo: () => useDefaultPartitionInfo
});

// node_modules/@aws-sdk/util-endpoints/dist-es/lib/isIpAddress.js
var IP_V4_REGEX = new RegExp(`^(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}$`);
var isIpAddress = /* @__PURE__ */ __name((value) => IP_V4_REGEX.test(value) || value.startsWith("[") && value.endsWith("]"), "isIpAddress");

// node_modules/@aws-sdk/util-endpoints/dist-es/lib/isValidHostLabel.js
var VALID_HOST_LABEL_REGEX = new RegExp(`^(?!.*-$)(?!-)[a-zA-Z0-9-]{1,63}$`);
var isValidHostLabel = /* @__PURE__ */ __name((value, allowSubDomains = false) => {
  if (!allowSubDomains) {
    return VALID_HOST_LABEL_REGEX.test(value);
  }
  const labels = value.split(".");
  for (const label of labels) {
    if (!isValidHostLabel(label)) {
      return false;
    }
  }
  return true;
}, "isValidHostLabel");

// node_modules/@aws-sdk/util-endpoints/dist-es/lib/aws/isVirtualHostableS3Bucket.js
var isVirtualHostableS3Bucket = /* @__PURE__ */ __name((value, allowSubDomains = false) => {
  if (allowSubDomains) {
    for (const label of value.split(".")) {
      if (!isVirtualHostableS3Bucket(label)) {
        return false;
      }
    }
    return true;
  }
  if (!isValidHostLabel(value)) {
    return false;
  }
  if (value.length < 3 || value.length > 63) {
    return false;
  }
  if (value !== value.toLowerCase()) {
    return false;
  }
  if (isIpAddress(value)) {
    return false;
  }
  return true;
}, "isVirtualHostableS3Bucket");

// node_modules/@aws-sdk/util-endpoints/dist-es/lib/aws/parseArn.js
var parseArn = /* @__PURE__ */ __name((value) => {
  const segments = value.split(":");
  if (segments.length < 6)
    return null;
  const [arn, partition2, service, region, accountId, ...resourceId] = segments;
  if (arn !== "arn" || partition2 === "" || service === "" || resourceId[0] === "")
    return null;
  return {
    partition: partition2,
    service,
    region,
    accountId,
    resourceId: resourceId[0].includes("/") ? resourceId[0].split("/") : resourceId
  };
}, "parseArn");

// node_modules/@aws-sdk/util-endpoints/dist-es/lib/booleanEquals.js
var booleanEquals = /* @__PURE__ */ __name((value1, value2) => value1 === value2, "booleanEquals");

// node_modules/@aws-sdk/util-endpoints/dist-es/lib/getAttrPathList.js
var getAttrPathList = /* @__PURE__ */ __name((path) => {
  const parts = path.split(".");
  const pathList = [];
  for (const part of parts) {
    const squareBracketIndex = part.indexOf("[");
    if (squareBracketIndex !== -1) {
      if (part.indexOf("]") !== part.length - 1) {
        throw new EndpointError(`Path: '${path}' does not end with ']'`);
      }
      const arrayIndex = part.slice(squareBracketIndex + 1, -1);
      if (Number.isNaN(parseInt(arrayIndex))) {
        throw new EndpointError(`Invalid array index: '${arrayIndex}' in path: '${path}'`);
      }
      if (squareBracketIndex !== 0) {
        pathList.push(part.slice(0, squareBracketIndex));
      }
      pathList.push(arrayIndex);
    } else {
      pathList.push(part);
    }
  }
  return pathList;
}, "getAttrPathList");

// node_modules/@aws-sdk/util-endpoints/dist-es/lib/getAttr.js
var getAttr = /* @__PURE__ */ __name((value, path) => getAttrPathList(path).reduce((acc, index) => {
  if (typeof acc !== "object") {
    throw new EndpointError(`Index '${index}' in '${path}' not found in '${JSON.stringify(value)}'`);
  } else if (Array.isArray(acc)) {
    return acc[parseInt(index)];
  }
  return acc[index];
}, value), "getAttr");

// node_modules/@aws-sdk/util-endpoints/dist-es/lib/isSet.js
var isSet = /* @__PURE__ */ __name((value) => value != null, "isSet");

// node_modules/@aws-sdk/util-endpoints/dist-es/lib/not.js
var not = /* @__PURE__ */ __name((value) => !value, "not");

// node_modules/@aws-sdk/types/dist-es/auth.js
var HttpAuthLocation;
(function(HttpAuthLocation2) {
  HttpAuthLocation2["HEADER"] = "header";
  HttpAuthLocation2["QUERY"] = "query";
})(HttpAuthLocation || (HttpAuthLocation = {}));

// node_modules/@aws-sdk/types/dist-es/dns.js
var HostAddressType;
(function(HostAddressType2) {
  HostAddressType2["AAAA"] = "AAAA";
  HostAddressType2["A"] = "A";
})(HostAddressType || (HostAddressType = {}));

// node_modules/@aws-sdk/types/dist-es/endpoint.js
var EndpointURLScheme;
(function(EndpointURLScheme2) {
  EndpointURLScheme2["HTTP"] = "http";
  EndpointURLScheme2["HTTPS"] = "https";
})(EndpointURLScheme || (EndpointURLScheme = {}));

// node_modules/@aws-sdk/types/dist-es/transfer.js
var RequestHandlerProtocol;
(function(RequestHandlerProtocol2) {
  RequestHandlerProtocol2["HTTP_0_9"] = "http/0.9";
  RequestHandlerProtocol2["HTTP_1_0"] = "http/1.0";
  RequestHandlerProtocol2["TDS_8_0"] = "tds/8.0";
})(RequestHandlerProtocol || (RequestHandlerProtocol = {}));

// node_modules/@aws-sdk/util-endpoints/dist-es/lib/parseURL.js
var DEFAULT_PORTS = {
  [EndpointURLScheme.HTTP]: 80,
  [EndpointURLScheme.HTTPS]: 443
};
var parseURL = /* @__PURE__ */ __name((value) => {
  const whatwgURL = (() => {
    try {
      if (value instanceof URL) {
        return value;
      }
      if (typeof value === "object" && "hostname" in value) {
        const { hostname: hostname2, port, protocol: protocol2 = "", path = "", query = {} } = value;
        const url = new URL(`${protocol2}//${hostname2}${port ? `:${port}` : ""}${path}`);
        url.search = Object.entries(query).map(([k6, v5]) => `${k6}=${v5}`).join("&");
        return url;
      }
      return new URL(value);
    } catch (error) {
      return null;
    }
  })();
  if (!whatwgURL) {
    console.error(`Unable to parse ${JSON.stringify(value)} as a whatwg URL.`);
    return null;
  }
  const urlString = whatwgURL.href;
  const { host, hostname, pathname, protocol, search } = whatwgURL;
  if (search) {
    return null;
  }
  const scheme = protocol.slice(0, -1);
  if (!Object.values(EndpointURLScheme).includes(scheme)) {
    return null;
  }
  const isIp = isIpAddress(hostname);
  const inputContainsDefaultPort = urlString.includes(`${host}:${DEFAULT_PORTS[scheme]}`) || typeof value === "string" && value.includes(`${host}:${DEFAULT_PORTS[scheme]}`);
  const authority = `${host}${inputContainsDefaultPort ? `:${DEFAULT_PORTS[scheme]}` : ``}`;
  return {
    scheme,
    authority,
    path: pathname,
    normalizedPath: pathname.endsWith("/") ? pathname : `${pathname}/`,
    isIp
  };
}, "parseURL");

// node_modules/@aws-sdk/util-endpoints/dist-es/lib/stringEquals.js
var stringEquals = /* @__PURE__ */ __name((value1, value2) => value1 === value2, "stringEquals");

// node_modules/@aws-sdk/util-endpoints/dist-es/lib/substring.js
var substring = /* @__PURE__ */ __name((input, start, stop, reverse) => {
  if (start >= stop || input.length < stop) {
    return null;
  }
  if (!reverse) {
    return input.substring(start, stop);
  }
  return input.substring(input.length - stop, input.length - start);
}, "substring");

// node_modules/@aws-sdk/util-endpoints/dist-es/lib/uriEncode.js
var uriEncode = /* @__PURE__ */ __name((value) => encodeURIComponent(value).replace(/[!*'()]/g, (c6) => `%${c6.charCodeAt(0).toString(16).toUpperCase()}`), "uriEncode");

// node_modules/@aws-sdk/util-endpoints/dist-es/utils/evaluateTemplate.js
var evaluateTemplate = /* @__PURE__ */ __name((template, options) => {
  const evaluatedTemplateArr = [];
  const templateContext = {
    ...options.endpointParams,
    ...options.referenceRecord
  };
  let currentIndex = 0;
  while (currentIndex < template.length) {
    const openingBraceIndex = template.indexOf("{", currentIndex);
    if (openingBraceIndex === -1) {
      evaluatedTemplateArr.push(template.slice(currentIndex));
      break;
    }
    evaluatedTemplateArr.push(template.slice(currentIndex, openingBraceIndex));
    const closingBraceIndex = template.indexOf("}", openingBraceIndex);
    if (closingBraceIndex === -1) {
      evaluatedTemplateArr.push(template.slice(openingBraceIndex));
      break;
    }
    if (template[openingBraceIndex + 1] === "{" && template[closingBraceIndex + 1] === "}") {
      evaluatedTemplateArr.push(template.slice(openingBraceIndex + 1, closingBraceIndex));
      currentIndex = closingBraceIndex + 2;
    }
    const parameterName = template.substring(openingBraceIndex + 1, closingBraceIndex);
    if (parameterName.includes("#")) {
      const [refName, attrName] = parameterName.split("#");
      evaluatedTemplateArr.push(getAttr(templateContext[refName], attrName));
    } else {
      evaluatedTemplateArr.push(templateContext[parameterName]);
    }
    currentIndex = closingBraceIndex + 1;
  }
  return evaluatedTemplateArr.join("");
}, "evaluateTemplate");

// node_modules/@aws-sdk/util-endpoints/dist-es/utils/getReferenceValue.js
var getReferenceValue = /* @__PURE__ */ __name(({ ref }, options) => {
  const referenceRecord = {
    ...options.endpointParams,
    ...options.referenceRecord
  };
  return referenceRecord[ref];
}, "getReferenceValue");

// node_modules/@aws-sdk/util-endpoints/dist-es/utils/evaluateExpression.js
var evaluateExpression = /* @__PURE__ */ __name((obj, keyName, options) => {
  if (typeof obj === "string") {
    return evaluateTemplate(obj, options);
  } else if (obj["fn"]) {
    return callFunction(obj, options);
  } else if (obj["ref"]) {
    return getReferenceValue(obj, options);
  }
  throw new EndpointError(`'${keyName}': ${String(obj)} is not a string, function or reference.`);
}, "evaluateExpression");

// node_modules/@aws-sdk/util-endpoints/dist-es/utils/callFunction.js
var callFunction = /* @__PURE__ */ __name(({ fn, argv }, options) => {
  const evaluatedArgs = argv.map((arg) => ["boolean", "number"].includes(typeof arg) ? arg : evaluateExpression(arg, "arg", options));
  return fn.split(".").reduce((acc, key) => acc[key], lib_exports)(...evaluatedArgs);
}, "callFunction");

// node_modules/@aws-sdk/util-endpoints/dist-es/utils/evaluateCondition.js
var evaluateCondition = /* @__PURE__ */ __name(({ assign, ...fnArgs }, options) => {
  if (assign && assign in options.referenceRecord) {
    throw new EndpointError(`'${assign}' is already defined in Reference Record.`);
  }
  const value = callFunction(fnArgs, options);
  options.logger?.debug?.(debugId, `evaluateCondition: ${toDebugString(fnArgs)} = ${toDebugString(value)}`);
  return {
    result: value === "" ? true : !!value,
    ...assign != null && { toAssign: { name: assign, value } }
  };
}, "evaluateCondition");

// node_modules/@aws-sdk/util-endpoints/dist-es/utils/evaluateConditions.js
var evaluateConditions = /* @__PURE__ */ __name((conditions = [], options) => {
  const conditionsReferenceRecord = {};
  for (const condition of conditions) {
    const { result, toAssign } = evaluateCondition(condition, {
      ...options,
      referenceRecord: {
        ...options.referenceRecord,
        ...conditionsReferenceRecord
      }
    });
    if (!result) {
      return { result };
    }
    if (toAssign) {
      conditionsReferenceRecord[toAssign.name] = toAssign.value;
      options.logger?.debug?.(debugId, `assign: ${toAssign.name} := ${toDebugString(toAssign.value)}`);
    }
  }
  return { result: true, referenceRecord: conditionsReferenceRecord };
}, "evaluateConditions");

// node_modules/@aws-sdk/util-endpoints/dist-es/utils/getEndpointHeaders.js
var getEndpointHeaders = /* @__PURE__ */ __name((headers, options) => Object.entries(headers).reduce((acc, [headerKey, headerVal]) => ({
  ...acc,
  [headerKey]: headerVal.map((headerValEntry) => {
    const processedExpr = evaluateExpression(headerValEntry, "Header value entry", options);
    if (typeof processedExpr !== "string") {
      throw new EndpointError(`Header '${headerKey}' value '${processedExpr}' is not a string`);
    }
    return processedExpr;
  })
}), {}), "getEndpointHeaders");

// node_modules/@aws-sdk/util-endpoints/dist-es/utils/getEndpointProperty.js
var getEndpointProperty = /* @__PURE__ */ __name((property, options) => {
  if (Array.isArray(property)) {
    return property.map((propertyEntry) => getEndpointProperty(propertyEntry, options));
  }
  switch (typeof property) {
    case "string":
      return evaluateTemplate(property, options);
    case "object":
      if (property === null) {
        throw new EndpointError(`Unexpected endpoint property: ${property}`);
      }
      return getEndpointProperties(property, options);
    case "boolean":
      return property;
    default:
      throw new EndpointError(`Unexpected endpoint property type: ${typeof property}`);
  }
}, "getEndpointProperty");

// node_modules/@aws-sdk/util-endpoints/dist-es/utils/getEndpointProperties.js
var getEndpointProperties = /* @__PURE__ */ __name((properties, options) => Object.entries(properties).reduce((acc, [propertyKey, propertyVal]) => ({
  ...acc,
  [propertyKey]: getEndpointProperty(propertyVal, options)
}), {}), "getEndpointProperties");

// node_modules/@aws-sdk/util-endpoints/dist-es/utils/getEndpointUrl.js
var getEndpointUrl = /* @__PURE__ */ __name((endpointUrl, options) => {
  const expression = evaluateExpression(endpointUrl, "Endpoint URL", options);
  if (typeof expression === "string") {
    try {
      return new URL(expression);
    } catch (error) {
      console.error(`Failed to construct URL with ${expression}`, error);
      throw error;
    }
  }
  throw new EndpointError(`Endpoint URL must be a string, got ${typeof expression}`);
}, "getEndpointUrl");

// node_modules/@aws-sdk/util-endpoints/dist-es/utils/evaluateEndpointRule.js
var evaluateEndpointRule = /* @__PURE__ */ __name((endpointRule, options) => {
  const { conditions, endpoint } = endpointRule;
  const { result, referenceRecord } = evaluateConditions(conditions, options);
  if (!result) {
    return;
  }
  const endpointRuleOptions = {
    ...options,
    referenceRecord: { ...options.referenceRecord, ...referenceRecord }
  };
  const { url, properties, headers } = endpoint;
  options.logger?.debug?.(debugId, `Resolving endpoint from template: ${toDebugString(endpoint)}`);
  return {
    ...headers != void 0 && {
      headers: getEndpointHeaders(headers, endpointRuleOptions)
    },
    ...properties != void 0 && {
      properties: getEndpointProperties(properties, endpointRuleOptions)
    },
    url: getEndpointUrl(url, endpointRuleOptions)
  };
}, "evaluateEndpointRule");

// node_modules/@aws-sdk/util-endpoints/dist-es/utils/evaluateErrorRule.js
var evaluateErrorRule = /* @__PURE__ */ __name((errorRule, options) => {
  const { conditions, error } = errorRule;
  const { result, referenceRecord } = evaluateConditions(conditions, options);
  if (!result) {
    return;
  }
  throw new EndpointError(evaluateExpression(error, "Error", {
    ...options,
    referenceRecord: { ...options.referenceRecord, ...referenceRecord }
  }));
}, "evaluateErrorRule");

// node_modules/@aws-sdk/util-endpoints/dist-es/utils/evaluateTreeRule.js
var evaluateTreeRule = /* @__PURE__ */ __name((treeRule, options) => {
  const { conditions, rules } = treeRule;
  const { result, referenceRecord } = evaluateConditions(conditions, options);
  if (!result) {
    return;
  }
  return evaluateRules(rules, {
    ...options,
    referenceRecord: { ...options.referenceRecord, ...referenceRecord }
  });
}, "evaluateTreeRule");

// node_modules/@aws-sdk/util-endpoints/dist-es/utils/evaluateRules.js
var evaluateRules = /* @__PURE__ */ __name((rules, options) => {
  for (const rule of rules) {
    if (rule.type === "endpoint") {
      const endpointOrUndefined = evaluateEndpointRule(rule, options);
      if (endpointOrUndefined) {
        return endpointOrUndefined;
      }
    } else if (rule.type === "error") {
      evaluateErrorRule(rule, options);
    } else if (rule.type === "tree") {
      const endpointOrUndefined = evaluateTreeRule(rule, options);
      if (endpointOrUndefined) {
        return endpointOrUndefined;
      }
    } else {
      throw new EndpointError(`Unknown endpoint rule: ${rule}`);
    }
  }
  throw new EndpointError(`Rules evaluation failed`);
}, "evaluateRules");

// node_modules/@aws-sdk/util-endpoints/dist-es/resolveEndpoint.js
var resolveEndpoint = /* @__PURE__ */ __name((ruleSetObject, options) => {
  const { endpointParams, logger: logger2 } = options;
  const { parameters, rules } = ruleSetObject;
  options.logger?.debug?.(debugId, `Initial EndpointParams: ${toDebugString(endpointParams)}`);
  const paramsWithDefault = Object.entries(parameters).filter(([, v5]) => v5.default != null).map(([k6, v5]) => [k6, v5.default]);
  if (paramsWithDefault.length > 0) {
    for (const [paramKey, paramDefaultValue] of paramsWithDefault) {
      endpointParams[paramKey] = endpointParams[paramKey] ?? paramDefaultValue;
    }
  }
  const requiredParams = Object.entries(parameters).filter(([, v5]) => v5.required).map(([k6]) => k6);
  for (const requiredParam of requiredParams) {
    if (endpointParams[requiredParam] == null) {
      throw new EndpointError(`Missing required parameter: '${requiredParam}'`);
    }
  }
  const endpoint = evaluateRules(rules, { endpointParams, logger: logger2, referenceRecord: {} });
  if (options.endpointParams?.Endpoint) {
    try {
      const givenEndpoint = new URL(options.endpointParams.Endpoint);
      const { protocol, port } = givenEndpoint;
      endpoint.url.protocol = protocol;
      endpoint.url.port = port;
    } catch (e6) {
    }
  }
  options.logger?.debug?.(debugId, `Resolved endpoint: ${toDebugString(endpoint)}`);
  return endpoint;
}, "resolveEndpoint");

// node_modules/@aws-sdk/middleware-user-agent/dist-es/constants.js
var USER_AGENT = "user-agent";
var X_AMZ_USER_AGENT = "x-amz-user-agent";
var SPACE = " ";
var UA_ESCAPE_REGEX = /[^\!\#\$\%\&\'\*\+\-\.\^\_\`\|\~\d\w]/g;

// node_modules/@aws-sdk/middleware-user-agent/dist-es/user-agent-middleware.js
var userAgentMiddleware = /* @__PURE__ */ __name((options) => (next, context) => async (args) => {
  const { request: request2 } = args;
  if (!HttpRequest.isInstance(request2))
    return next(args);
  const { headers } = request2;
  const userAgent = context?.userAgent?.map(escapeUserAgent) || [];
  const defaultUserAgent2 = (await options.defaultUserAgentProvider()).map(escapeUserAgent);
  const customUserAgent = options?.customUserAgent?.map(escapeUserAgent) || [];
  const prefix2 = getUserAgentPrefix();
  const sdkUserAgentValue = (prefix2 ? [prefix2] : []).concat([...defaultUserAgent2, ...userAgent, ...customUserAgent]).join(SPACE);
  const normalUAValue = [
    ...defaultUserAgent2.filter((section) => section.startsWith("aws-sdk-")),
    ...customUserAgent
  ].join(SPACE);
  if (options.runtime !== "browser") {
    if (normalUAValue) {
      headers[X_AMZ_USER_AGENT] = headers[X_AMZ_USER_AGENT] ? `${headers[USER_AGENT]} ${normalUAValue}` : normalUAValue;
    }
    headers[USER_AGENT] = sdkUserAgentValue;
  } else {
    headers[X_AMZ_USER_AGENT] = sdkUserAgentValue;
  }
  return next({
    ...args,
    request: request2
  });
}, "userAgentMiddleware");
var escapeUserAgent = /* @__PURE__ */ __name(([name, version]) => {
  const prefixSeparatorIndex = name.indexOf("/");
  const prefix2 = name.substring(0, prefixSeparatorIndex);
  let uaName = name.substring(prefixSeparatorIndex + 1);
  if (prefix2 === "api") {
    uaName = uaName.toLowerCase();
  }
  return [prefix2, uaName, version].filter((item) => item && item.length > 0).map((item) => item?.replace(UA_ESCAPE_REGEX, "_")).join("/");
}, "escapeUserAgent");
var getUserAgentMiddlewareOptions = {
  name: "getUserAgentMiddleware",
  step: "build",
  priority: "low",
  tags: ["SET_USER_AGENT", "USER_AGENT"],
  override: true
};
var getUserAgentPlugin = /* @__PURE__ */ __name((config) => ({
  applyToStack: (clientStack) => {
    clientStack.add(userAgentMiddleware(config), getUserAgentMiddlewareOptions);
  }
}), "getUserAgentPlugin");

// node_modules/@aws-sdk/client-ssm/dist-es/endpoint/EndpointParameters.js
var resolveClientEndpointParameters = /* @__PURE__ */ __name((options) => {
  return {
    ...options,
    useDualstackEndpoint: options.useDualstackEndpoint ?? false,
    useFipsEndpoint: options.useFipsEndpoint ?? false,
    defaultSigningName: "ssm"
  };
}, "resolveClientEndpointParameters");

// node_modules/@aws-sdk/client-ssm/package.json
var package_default = {
  name: "@aws-sdk/client-ssm",
  description: "AWS SDK for JavaScript Ssm Client for Node.js, Browser and React Native",
  version: "3.329.0",
  scripts: {
    build: "concurrently 'yarn:build:cjs' 'yarn:build:es' 'yarn:build:types'",
    "build:cjs": "tsc -p tsconfig.cjs.json",
    "build:docs": "typedoc",
    "build:es": "tsc -p tsconfig.es.json",
    "build:include:deps": "lerna run --scope $npm_package_name --include-dependencies build",
    "build:types": "tsc -p tsconfig.types.json",
    "build:types:downlevel": "downlevel-dts dist-types dist-types/ts3.4",
    clean: "rimraf ./dist-* && rimraf *.tsbuildinfo",
    "extract:docs": "api-extractor run --local",
    "generate:client": "node ../../scripts/generate-clients/single-service --solo ssm"
  },
  main: "./dist-cjs/index.js",
  types: "./dist-types/index.d.ts",
  module: "./dist-es/index.js",
  sideEffects: false,
  dependencies: {
    "@aws-crypto/sha256-browser": "3.0.0",
    "@aws-crypto/sha256-js": "3.0.0",
    "@aws-sdk/client-sts": "3.329.0",
    "@aws-sdk/config-resolver": "3.329.0",
    "@aws-sdk/credential-provider-node": "3.329.0",
    "@aws-sdk/fetch-http-handler": "3.329.0",
    "@aws-sdk/hash-node": "3.329.0",
    "@aws-sdk/invalid-dependency": "3.329.0",
    "@aws-sdk/middleware-content-length": "3.329.0",
    "@aws-sdk/middleware-endpoint": "3.329.0",
    "@aws-sdk/middleware-host-header": "3.329.0",
    "@aws-sdk/middleware-logger": "3.329.0",
    "@aws-sdk/middleware-recursion-detection": "3.329.0",
    "@aws-sdk/middleware-retry": "3.329.0",
    "@aws-sdk/middleware-serde": "3.329.0",
    "@aws-sdk/middleware-signing": "3.329.0",
    "@aws-sdk/middleware-stack": "3.329.0",
    "@aws-sdk/middleware-user-agent": "3.329.0",
    "@aws-sdk/node-config-provider": "3.329.0",
    "@aws-sdk/node-http-handler": "3.329.0",
    "@aws-sdk/protocol-http": "3.329.0",
    "@aws-sdk/smithy-client": "3.329.0",
    "@aws-sdk/types": "3.329.0",
    "@aws-sdk/url-parser": "3.329.0",
    "@aws-sdk/util-base64": "3.310.0",
    "@aws-sdk/util-body-length-browser": "3.310.0",
    "@aws-sdk/util-body-length-node": "3.310.0",
    "@aws-sdk/util-defaults-mode-browser": "3.329.0",
    "@aws-sdk/util-defaults-mode-node": "3.329.0",
    "@aws-sdk/util-endpoints": "3.329.0",
    "@aws-sdk/util-retry": "3.329.0",
    "@aws-sdk/util-user-agent-browser": "3.329.0",
    "@aws-sdk/util-user-agent-node": "3.329.0",
    "@aws-sdk/util-utf8": "3.310.0",
    "@aws-sdk/util-waiter": "3.329.0",
    tslib: "^2.5.0",
    uuid: "^8.3.2"
  },
  devDependencies: {
    "@aws-sdk/service-client-documentation-generator": "3.310.0",
    "@tsconfig/node14": "1.0.3",
    "@types/node": "^14.14.31",
    "@types/uuid": "^8.3.0",
    concurrently: "7.0.0",
    "downlevel-dts": "0.10.1",
    rimraf: "3.0.2",
    typedoc: "0.23.23",
    typescript: "~4.9.5"
  },
  engines: {
    node: ">=14.0.0"
  },
  typesVersions: {
    "<4.0": {
      "dist-types/*": [
        "dist-types/ts3.4/*"
      ]
    }
  },
  files: [
    "dist-*/**"
  ],
  author: {
    name: "AWS SDK for JavaScript Team",
    url: "https://aws.amazon.com/javascript/"
  },
  license: "Apache-2.0",
  browser: {
    "./dist-es/runtimeConfig": "./dist-es/runtimeConfig.browser"
  },
  "react-native": {
    "./dist-es/runtimeConfig": "./dist-es/runtimeConfig.native"
  },
  homepage: "https://github.com/aws/aws-sdk-js-v3/tree/main/clients/client-ssm",
  repository: {
    type: "git",
    url: "https://github.com/aws/aws-sdk-js-v3.git",
    directory: "clients/client-ssm"
  }
};

// node_modules/@aws-sdk/client-sts/dist-es/protocols/Aws_query.js
var import_fast_xml_parser = __toESM(require_fxp());

// node_modules/@aws-sdk/client-sts/dist-es/models/STSServiceException.js
var STSServiceException = class extends ServiceException {
  constructor(options) {
    super(options);
    Object.setPrototypeOf(this, STSServiceException.prototype);
  }
};
__name(STSServiceException, "STSServiceException");

// node_modules/@aws-sdk/client-sts/dist-es/models/models_0.js
var ExpiredTokenException = class extends STSServiceException {
  constructor(opts) {
    super({
      name: "ExpiredTokenException",
      $fault: "client",
      ...opts
    });
    this.name = "ExpiredTokenException";
    this.$fault = "client";
    Object.setPrototypeOf(this, ExpiredTokenException.prototype);
  }
};
__name(ExpiredTokenException, "ExpiredTokenException");
var MalformedPolicyDocumentException = class extends STSServiceException {
  constructor(opts) {
    super({
      name: "MalformedPolicyDocumentException",
      $fault: "client",
      ...opts
    });
    this.name = "MalformedPolicyDocumentException";
    this.$fault = "client";
    Object.setPrototypeOf(this, MalformedPolicyDocumentException.prototype);
  }
};
__name(MalformedPolicyDocumentException, "MalformedPolicyDocumentException");
var PackedPolicyTooLargeException = class extends STSServiceException {
  constructor(opts) {
    super({
      name: "PackedPolicyTooLargeException",
      $fault: "client",
      ...opts
    });
    this.name = "PackedPolicyTooLargeException";
    this.$fault = "client";
    Object.setPrototypeOf(this, PackedPolicyTooLargeException.prototype);
  }
};
__name(PackedPolicyTooLargeException, "PackedPolicyTooLargeException");
var RegionDisabledException = class extends STSServiceException {
  constructor(opts) {
    super({
      name: "RegionDisabledException",
      $fault: "client",
      ...opts
    });
    this.name = "RegionDisabledException";
    this.$fault = "client";
    Object.setPrototypeOf(this, RegionDisabledException.prototype);
  }
};
__name(RegionDisabledException, "RegionDisabledException");
var IDPRejectedClaimException = class extends STSServiceException {
  constructor(opts) {
    super({
      name: "IDPRejectedClaimException",
      $fault: "client",
      ...opts
    });
    this.name = "IDPRejectedClaimException";
    this.$fault = "client";
    Object.setPrototypeOf(this, IDPRejectedClaimException.prototype);
  }
};
__name(IDPRejectedClaimException, "IDPRejectedClaimException");
var InvalidIdentityTokenException = class extends STSServiceException {
  constructor(opts) {
    super({
      name: "InvalidIdentityTokenException",
      $fault: "client",
      ...opts
    });
    this.name = "InvalidIdentityTokenException";
    this.$fault = "client";
    Object.setPrototypeOf(this, InvalidIdentityTokenException.prototype);
  }
};
__name(InvalidIdentityTokenException, "InvalidIdentityTokenException");
var IDPCommunicationErrorException = class extends STSServiceException {
  constructor(opts) {
    super({
      name: "IDPCommunicationErrorException",
      $fault: "client",
      ...opts
    });
    this.name = "IDPCommunicationErrorException";
    this.$fault = "client";
    Object.setPrototypeOf(this, IDPCommunicationErrorException.prototype);
  }
};
__name(IDPCommunicationErrorException, "IDPCommunicationErrorException");

// node_modules/@aws-sdk/client-sts/dist-es/protocols/Aws_query.js
var se_AssumeRoleCommand = /* @__PURE__ */ __name(async (input, context) => {
  const headers = SHARED_HEADERS;
  let body;
  body = buildFormUrlencodedString({
    ...se_AssumeRoleRequest(input, context),
    Action: "AssumeRole",
    Version: "2011-06-15"
  });
  return buildHttpRpcRequest2(context, headers, "/", void 0, body);
}, "se_AssumeRoleCommand");
var se_AssumeRoleWithWebIdentityCommand = /* @__PURE__ */ __name(async (input, context) => {
  const headers = SHARED_HEADERS;
  let body;
  body = buildFormUrlencodedString({
    ...se_AssumeRoleWithWebIdentityRequest(input, context),
    Action: "AssumeRoleWithWebIdentity",
    Version: "2011-06-15"
  });
  return buildHttpRpcRequest2(context, headers, "/", void 0, body);
}, "se_AssumeRoleWithWebIdentityCommand");
var de_AssumeRoleCommand = /* @__PURE__ */ __name(async (output, context) => {
  if (output.statusCode >= 300) {
    return de_AssumeRoleCommandError(output, context);
  }
  const data = await parseBody2(output.body, context);
  let contents = {};
  contents = de_AssumeRoleResponse(data.AssumeRoleResult, context);
  const response = {
    $metadata: deserializeMetadata3(output),
    ...contents
  };
  return response;
}, "de_AssumeRoleCommand");
var de_AssumeRoleCommandError = /* @__PURE__ */ __name(async (output, context) => {
  const parsedOutput = {
    ...output,
    body: await parseErrorBody2(output.body, context)
  };
  const errorCode = loadQueryErrorCode(output, parsedOutput.body);
  switch (errorCode) {
    case "ExpiredTokenException":
    case "com.amazonaws.sts#ExpiredTokenException":
      throw await de_ExpiredTokenExceptionRes(parsedOutput, context);
    case "MalformedPolicyDocument":
    case "com.amazonaws.sts#MalformedPolicyDocumentException":
      throw await de_MalformedPolicyDocumentExceptionRes(parsedOutput, context);
    case "PackedPolicyTooLarge":
    case "com.amazonaws.sts#PackedPolicyTooLargeException":
      throw await de_PackedPolicyTooLargeExceptionRes(parsedOutput, context);
    case "RegionDisabledException":
    case "com.amazonaws.sts#RegionDisabledException":
      throw await de_RegionDisabledExceptionRes(parsedOutput, context);
    default:
      const parsedBody = parsedOutput.body;
      return throwDefaultError3({
        output,
        parsedBody: parsedBody.Error,
        errorCode
      });
  }
}, "de_AssumeRoleCommandError");
var de_AssumeRoleWithWebIdentityCommand = /* @__PURE__ */ __name(async (output, context) => {
  if (output.statusCode >= 300) {
    return de_AssumeRoleWithWebIdentityCommandError(output, context);
  }
  const data = await parseBody2(output.body, context);
  let contents = {};
  contents = de_AssumeRoleWithWebIdentityResponse(data.AssumeRoleWithWebIdentityResult, context);
  const response = {
    $metadata: deserializeMetadata3(output),
    ...contents
  };
  return response;
}, "de_AssumeRoleWithWebIdentityCommand");
var de_AssumeRoleWithWebIdentityCommandError = /* @__PURE__ */ __name(async (output, context) => {
  const parsedOutput = {
    ...output,
    body: await parseErrorBody2(output.body, context)
  };
  const errorCode = loadQueryErrorCode(output, parsedOutput.body);
  switch (errorCode) {
    case "ExpiredTokenException":
    case "com.amazonaws.sts#ExpiredTokenException":
      throw await de_ExpiredTokenExceptionRes(parsedOutput, context);
    case "IDPCommunicationError":
    case "com.amazonaws.sts#IDPCommunicationErrorException":
      throw await de_IDPCommunicationErrorExceptionRes(parsedOutput, context);
    case "IDPRejectedClaim":
    case "com.amazonaws.sts#IDPRejectedClaimException":
      throw await de_IDPRejectedClaimExceptionRes(parsedOutput, context);
    case "InvalidIdentityToken":
    case "com.amazonaws.sts#InvalidIdentityTokenException":
      throw await de_InvalidIdentityTokenExceptionRes(parsedOutput, context);
    case "MalformedPolicyDocument":
    case "com.amazonaws.sts#MalformedPolicyDocumentException":
      throw await de_MalformedPolicyDocumentExceptionRes(parsedOutput, context);
    case "PackedPolicyTooLarge":
    case "com.amazonaws.sts#PackedPolicyTooLargeException":
      throw await de_PackedPolicyTooLargeExceptionRes(parsedOutput, context);
    case "RegionDisabledException":
    case "com.amazonaws.sts#RegionDisabledException":
      throw await de_RegionDisabledExceptionRes(parsedOutput, context);
    default:
      const parsedBody = parsedOutput.body;
      return throwDefaultError3({
        output,
        parsedBody: parsedBody.Error,
        errorCode
      });
  }
}, "de_AssumeRoleWithWebIdentityCommandError");
var de_ExpiredTokenExceptionRes = /* @__PURE__ */ __name(async (parsedOutput, context) => {
  const body = parsedOutput.body;
  const deserialized = de_ExpiredTokenException(body.Error, context);
  const exception = new ExpiredTokenException({
    $metadata: deserializeMetadata3(parsedOutput),
    ...deserialized
  });
  return decorateServiceException(exception, body);
}, "de_ExpiredTokenExceptionRes");
var de_IDPCommunicationErrorExceptionRes = /* @__PURE__ */ __name(async (parsedOutput, context) => {
  const body = parsedOutput.body;
  const deserialized = de_IDPCommunicationErrorException(body.Error, context);
  const exception = new IDPCommunicationErrorException({
    $metadata: deserializeMetadata3(parsedOutput),
    ...deserialized
  });
  return decorateServiceException(exception, body);
}, "de_IDPCommunicationErrorExceptionRes");
var de_IDPRejectedClaimExceptionRes = /* @__PURE__ */ __name(async (parsedOutput, context) => {
  const body = parsedOutput.body;
  const deserialized = de_IDPRejectedClaimException(body.Error, context);
  const exception = new IDPRejectedClaimException({
    $metadata: deserializeMetadata3(parsedOutput),
    ...deserialized
  });
  return decorateServiceException(exception, body);
}, "de_IDPRejectedClaimExceptionRes");
var de_InvalidIdentityTokenExceptionRes = /* @__PURE__ */ __name(async (parsedOutput, context) => {
  const body = parsedOutput.body;
  const deserialized = de_InvalidIdentityTokenException(body.Error, context);
  const exception = new InvalidIdentityTokenException({
    $metadata: deserializeMetadata3(parsedOutput),
    ...deserialized
  });
  return decorateServiceException(exception, body);
}, "de_InvalidIdentityTokenExceptionRes");
var de_MalformedPolicyDocumentExceptionRes = /* @__PURE__ */ __name(async (parsedOutput, context) => {
  const body = parsedOutput.body;
  const deserialized = de_MalformedPolicyDocumentException(body.Error, context);
  const exception = new MalformedPolicyDocumentException({
    $metadata: deserializeMetadata3(parsedOutput),
    ...deserialized
  });
  return decorateServiceException(exception, body);
}, "de_MalformedPolicyDocumentExceptionRes");
var de_PackedPolicyTooLargeExceptionRes = /* @__PURE__ */ __name(async (parsedOutput, context) => {
  const body = parsedOutput.body;
  const deserialized = de_PackedPolicyTooLargeException(body.Error, context);
  const exception = new PackedPolicyTooLargeException({
    $metadata: deserializeMetadata3(parsedOutput),
    ...deserialized
  });
  return decorateServiceException(exception, body);
}, "de_PackedPolicyTooLargeExceptionRes");
var de_RegionDisabledExceptionRes = /* @__PURE__ */ __name(async (parsedOutput, context) => {
  const body = parsedOutput.body;
  const deserialized = de_RegionDisabledException(body.Error, context);
  const exception = new RegionDisabledException({
    $metadata: deserializeMetadata3(parsedOutput),
    ...deserialized
  });
  return decorateServiceException(exception, body);
}, "de_RegionDisabledExceptionRes");
var se_AssumeRoleRequest = /* @__PURE__ */ __name((input, context) => {
  const entries = {};
  if (input.RoleArn != null) {
    entries["RoleArn"] = input.RoleArn;
  }
  if (input.RoleSessionName != null) {
    entries["RoleSessionName"] = input.RoleSessionName;
  }
  if (input.PolicyArns != null) {
    const memberEntries = se_policyDescriptorListType(input.PolicyArns, context);
    if (input.PolicyArns?.length === 0) {
      entries.PolicyArns = [];
    }
    Object.entries(memberEntries).forEach(([key, value]) => {
      const loc = `PolicyArns.${key}`;
      entries[loc] = value;
    });
  }
  if (input.Policy != null) {
    entries["Policy"] = input.Policy;
  }
  if (input.DurationSeconds != null) {
    entries["DurationSeconds"] = input.DurationSeconds;
  }
  if (input.Tags != null) {
    const memberEntries = se_tagListType(input.Tags, context);
    if (input.Tags?.length === 0) {
      entries.Tags = [];
    }
    Object.entries(memberEntries).forEach(([key, value]) => {
      const loc = `Tags.${key}`;
      entries[loc] = value;
    });
  }
  if (input.TransitiveTagKeys != null) {
    const memberEntries = se_tagKeyListType(input.TransitiveTagKeys, context);
    if (input.TransitiveTagKeys?.length === 0) {
      entries.TransitiveTagKeys = [];
    }
    Object.entries(memberEntries).forEach(([key, value]) => {
      const loc = `TransitiveTagKeys.${key}`;
      entries[loc] = value;
    });
  }
  if (input.ExternalId != null) {
    entries["ExternalId"] = input.ExternalId;
  }
  if (input.SerialNumber != null) {
    entries["SerialNumber"] = input.SerialNumber;
  }
  if (input.TokenCode != null) {
    entries["TokenCode"] = input.TokenCode;
  }
  if (input.SourceIdentity != null) {
    entries["SourceIdentity"] = input.SourceIdentity;
  }
  return entries;
}, "se_AssumeRoleRequest");
var se_AssumeRoleWithWebIdentityRequest = /* @__PURE__ */ __name((input, context) => {
  const entries = {};
  if (input.RoleArn != null) {
    entries["RoleArn"] = input.RoleArn;
  }
  if (input.RoleSessionName != null) {
    entries["RoleSessionName"] = input.RoleSessionName;
  }
  if (input.WebIdentityToken != null) {
    entries["WebIdentityToken"] = input.WebIdentityToken;
  }
  if (input.ProviderId != null) {
    entries["ProviderId"] = input.ProviderId;
  }
  if (input.PolicyArns != null) {
    const memberEntries = se_policyDescriptorListType(input.PolicyArns, context);
    if (input.PolicyArns?.length === 0) {
      entries.PolicyArns = [];
    }
    Object.entries(memberEntries).forEach(([key, value]) => {
      const loc = `PolicyArns.${key}`;
      entries[loc] = value;
    });
  }
  if (input.Policy != null) {
    entries["Policy"] = input.Policy;
  }
  if (input.DurationSeconds != null) {
    entries["DurationSeconds"] = input.DurationSeconds;
  }
  return entries;
}, "se_AssumeRoleWithWebIdentityRequest");
var se_policyDescriptorListType = /* @__PURE__ */ __name((input, context) => {
  const entries = {};
  let counter = 1;
  for (const entry of input) {
    if (entry === null) {
      continue;
    }
    const memberEntries = se_PolicyDescriptorType(entry, context);
    Object.entries(memberEntries).forEach(([key, value]) => {
      entries[`member.${counter}.${key}`] = value;
    });
    counter++;
  }
  return entries;
}, "se_policyDescriptorListType");
var se_PolicyDescriptorType = /* @__PURE__ */ __name((input, context) => {
  const entries = {};
  if (input.arn != null) {
    entries["arn"] = input.arn;
  }
  return entries;
}, "se_PolicyDescriptorType");
var se_Tag = /* @__PURE__ */ __name((input, context) => {
  const entries = {};
  if (input.Key != null) {
    entries["Key"] = input.Key;
  }
  if (input.Value != null) {
    entries["Value"] = input.Value;
  }
  return entries;
}, "se_Tag");
var se_tagKeyListType = /* @__PURE__ */ __name((input, context) => {
  const entries = {};
  let counter = 1;
  for (const entry of input) {
    if (entry === null) {
      continue;
    }
    entries[`member.${counter}`] = entry;
    counter++;
  }
  return entries;
}, "se_tagKeyListType");
var se_tagListType = /* @__PURE__ */ __name((input, context) => {
  const entries = {};
  let counter = 1;
  for (const entry of input) {
    if (entry === null) {
      continue;
    }
    const memberEntries = se_Tag(entry, context);
    Object.entries(memberEntries).forEach(([key, value]) => {
      entries[`member.${counter}.${key}`] = value;
    });
    counter++;
  }
  return entries;
}, "se_tagListType");
var de_AssumedRoleUser = /* @__PURE__ */ __name((output, context) => {
  const contents = {};
  if (output["AssumedRoleId"] !== void 0) {
    contents.AssumedRoleId = expectString(output["AssumedRoleId"]);
  }
  if (output["Arn"] !== void 0) {
    contents.Arn = expectString(output["Arn"]);
  }
  return contents;
}, "de_AssumedRoleUser");
var de_AssumeRoleResponse = /* @__PURE__ */ __name((output, context) => {
  const contents = {};
  if (output["Credentials"] !== void 0) {
    contents.Credentials = de_Credentials(output["Credentials"], context);
  }
  if (output["AssumedRoleUser"] !== void 0) {
    contents.AssumedRoleUser = de_AssumedRoleUser(output["AssumedRoleUser"], context);
  }
  if (output["PackedPolicySize"] !== void 0) {
    contents.PackedPolicySize = strictParseInt32(output["PackedPolicySize"]);
  }
  if (output["SourceIdentity"] !== void 0) {
    contents.SourceIdentity = expectString(output["SourceIdentity"]);
  }
  return contents;
}, "de_AssumeRoleResponse");
var de_AssumeRoleWithWebIdentityResponse = /* @__PURE__ */ __name((output, context) => {
  const contents = {};
  if (output["Credentials"] !== void 0) {
    contents.Credentials = de_Credentials(output["Credentials"], context);
  }
  if (output["SubjectFromWebIdentityToken"] !== void 0) {
    contents.SubjectFromWebIdentityToken = expectString(output["SubjectFromWebIdentityToken"]);
  }
  if (output["AssumedRoleUser"] !== void 0) {
    contents.AssumedRoleUser = de_AssumedRoleUser(output["AssumedRoleUser"], context);
  }
  if (output["PackedPolicySize"] !== void 0) {
    contents.PackedPolicySize = strictParseInt32(output["PackedPolicySize"]);
  }
  if (output["Provider"] !== void 0) {
    contents.Provider = expectString(output["Provider"]);
  }
  if (output["Audience"] !== void 0) {
    contents.Audience = expectString(output["Audience"]);
  }
  if (output["SourceIdentity"] !== void 0) {
    contents.SourceIdentity = expectString(output["SourceIdentity"]);
  }
  return contents;
}, "de_AssumeRoleWithWebIdentityResponse");
var de_Credentials = /* @__PURE__ */ __name((output, context) => {
  const contents = {};
  if (output["AccessKeyId"] !== void 0) {
    contents.AccessKeyId = expectString(output["AccessKeyId"]);
  }
  if (output["SecretAccessKey"] !== void 0) {
    contents.SecretAccessKey = expectString(output["SecretAccessKey"]);
  }
  if (output["SessionToken"] !== void 0) {
    contents.SessionToken = expectString(output["SessionToken"]);
  }
  if (output["Expiration"] !== void 0) {
    contents.Expiration = expectNonNull(parseRfc3339DateTimeWithOffset(output["Expiration"]));
  }
  return contents;
}, "de_Credentials");
var de_ExpiredTokenException = /* @__PURE__ */ __name((output, context) => {
  const contents = {};
  if (output["message"] !== void 0) {
    contents.message = expectString(output["message"]);
  }
  return contents;
}, "de_ExpiredTokenException");
var de_IDPCommunicationErrorException = /* @__PURE__ */ __name((output, context) => {
  const contents = {};
  if (output["message"] !== void 0) {
    contents.message = expectString(output["message"]);
  }
  return contents;
}, "de_IDPCommunicationErrorException");
var de_IDPRejectedClaimException = /* @__PURE__ */ __name((output, context) => {
  const contents = {};
  if (output["message"] !== void 0) {
    contents.message = expectString(output["message"]);
  }
  return contents;
}, "de_IDPRejectedClaimException");
var de_InvalidIdentityTokenException = /* @__PURE__ */ __name((output, context) => {
  const contents = {};
  if (output["message"] !== void 0) {
    contents.message = expectString(output["message"]);
  }
  return contents;
}, "de_InvalidIdentityTokenException");
var de_MalformedPolicyDocumentException = /* @__PURE__ */ __name((output, context) => {
  const contents = {};
  if (output["message"] !== void 0) {
    contents.message = expectString(output["message"]);
  }
  return contents;
}, "de_MalformedPolicyDocumentException");
var de_PackedPolicyTooLargeException = /* @__PURE__ */ __name((output, context) => {
  const contents = {};
  if (output["message"] !== void 0) {
    contents.message = expectString(output["message"]);
  }
  return contents;
}, "de_PackedPolicyTooLargeException");
var de_RegionDisabledException = /* @__PURE__ */ __name((output, context) => {
  const contents = {};
  if (output["message"] !== void 0) {
    contents.message = expectString(output["message"]);
  }
  return contents;
}, "de_RegionDisabledException");
var deserializeMetadata3 = /* @__PURE__ */ __name((output) => ({
  httpStatusCode: output.statusCode,
  requestId: output.headers["x-amzn-requestid"] ?? output.headers["x-amzn-request-id"] ?? output.headers["x-amz-request-id"],
  extendedRequestId: output.headers["x-amz-id-2"],
  cfId: output.headers["x-amz-cf-id"]
}), "deserializeMetadata");
var collectBody2 = /* @__PURE__ */ __name((streamBody = new Uint8Array(), context) => {
  if (streamBody instanceof Uint8Array) {
    return Promise.resolve(streamBody);
  }
  return context.streamCollector(streamBody) || Promise.resolve(new Uint8Array());
}, "collectBody");
var collectBodyString2 = /* @__PURE__ */ __name((streamBody, context) => collectBody2(streamBody, context).then((body) => context.utf8Encoder(body)), "collectBodyString");
var throwDefaultError3 = withBaseException(STSServiceException);
var buildHttpRpcRequest2 = /* @__PURE__ */ __name(async (context, headers, path, resolvedHostname, body) => {
  const { hostname, protocol = "https", port, path: basePath } = await context.endpoint();
  const contents = {
    protocol,
    hostname,
    port,
    method: "POST",
    path: basePath.endsWith("/") ? basePath.slice(0, -1) + path : basePath + path,
    headers
  };
  if (resolvedHostname !== void 0) {
    contents.hostname = resolvedHostname;
  }
  if (body !== void 0) {
    contents.body = body;
  }
  return new HttpRequest(contents);
}, "buildHttpRpcRequest");
var SHARED_HEADERS = {
  "content-type": "application/x-www-form-urlencoded"
};
var parseBody2 = /* @__PURE__ */ __name((streamBody, context) => collectBodyString2(streamBody, context).then((encoded) => {
  if (encoded.length) {
    const parser = new import_fast_xml_parser.XMLParser({
      attributeNamePrefix: "",
      htmlEntities: true,
      ignoreAttributes: false,
      ignoreDeclaration: true,
      parseTagValue: false,
      trimValues: false,
      tagValueProcessor: (_, val) => val.trim() === "" && val.includes("\n") ? "" : void 0
    });
    parser.addEntity("#xD", "\r");
    parser.addEntity("#10", "\n");
    const parsedObj = parser.parse(encoded);
    const textNodeName = "#text";
    const key = Object.keys(parsedObj)[0];
    const parsedObjToReturn = parsedObj[key];
    if (parsedObjToReturn[textNodeName]) {
      parsedObjToReturn[key] = parsedObjToReturn[textNodeName];
      delete parsedObjToReturn[textNodeName];
    }
    return getValueFromTextNode(parsedObjToReturn);
  }
  return {};
}), "parseBody");
var parseErrorBody2 = /* @__PURE__ */ __name(async (errorBody, context) => {
  const value = await parseBody2(errorBody, context);
  if (value.Error) {
    value.Error.message = value.Error.message ?? value.Error.Message;
  }
  return value;
}, "parseErrorBody");
var buildFormUrlencodedString = /* @__PURE__ */ __name((formEntries) => Object.entries(formEntries).map(([key, value]) => extendedEncodeURIComponent(key) + "=" + extendedEncodeURIComponent(value)).join("&"), "buildFormUrlencodedString");
var loadQueryErrorCode = /* @__PURE__ */ __name((output, data) => {
  if (data.Error?.Code !== void 0) {
    return data.Error.Code;
  }
  if (output.statusCode == 404) {
    return "NotFound";
  }
}, "loadQueryErrorCode");

// node_modules/@aws-sdk/client-sts/dist-es/commands/AssumeRoleCommand.js
var AssumeRoleCommand = class extends Command {
  static getEndpointParameterInstructions() {
    return {
      UseGlobalEndpoint: { type: "builtInParams", name: "useGlobalEndpoint" },
      UseFIPS: { type: "builtInParams", name: "useFipsEndpoint" },
      Endpoint: { type: "builtInParams", name: "endpoint" },
      Region: { type: "builtInParams", name: "region" },
      UseDualStack: { type: "builtInParams", name: "useDualstackEndpoint" }
    };
  }
  constructor(input) {
    super();
    this.input = input;
  }
  resolveMiddleware(clientStack, configuration, options) {
    this.middlewareStack.use(getSerdePlugin(configuration, this.serialize, this.deserialize));
    this.middlewareStack.use(getEndpointPlugin(configuration, AssumeRoleCommand.getEndpointParameterInstructions()));
    this.middlewareStack.use(getAwsAuthPlugin(configuration));
    const stack = clientStack.concat(this.middlewareStack);
    const { logger: logger2 } = configuration;
    const clientName = "STSClient";
    const commandName = "AssumeRoleCommand";
    const handlerExecutionContext = {
      logger: logger2,
      clientName,
      commandName,
      inputFilterSensitiveLog: (_) => _,
      outputFilterSensitiveLog: (_) => _
    };
    const { requestHandler } = configuration;
    return stack.resolve((request2) => requestHandler.handle(request2.request, options || {}), handlerExecutionContext);
  }
  serialize(input, context) {
    return se_AssumeRoleCommand(input, context);
  }
  deserialize(output, context) {
    return de_AssumeRoleCommand(output, context);
  }
};
__name(AssumeRoleCommand, "AssumeRoleCommand");

// node_modules/@aws-sdk/client-sts/dist-es/commands/AssumeRoleWithWebIdentityCommand.js
var AssumeRoleWithWebIdentityCommand = class extends Command {
  static getEndpointParameterInstructions() {
    return {
      UseGlobalEndpoint: { type: "builtInParams", name: "useGlobalEndpoint" },
      UseFIPS: { type: "builtInParams", name: "useFipsEndpoint" },
      Endpoint: { type: "builtInParams", name: "endpoint" },
      Region: { type: "builtInParams", name: "region" },
      UseDualStack: { type: "builtInParams", name: "useDualstackEndpoint" }
    };
  }
  constructor(input) {
    super();
    this.input = input;
  }
  resolveMiddleware(clientStack, configuration, options) {
    this.middlewareStack.use(getSerdePlugin(configuration, this.serialize, this.deserialize));
    this.middlewareStack.use(getEndpointPlugin(configuration, AssumeRoleWithWebIdentityCommand.getEndpointParameterInstructions()));
    const stack = clientStack.concat(this.middlewareStack);
    const { logger: logger2 } = configuration;
    const clientName = "STSClient";
    const commandName = "AssumeRoleWithWebIdentityCommand";
    const handlerExecutionContext = {
      logger: logger2,
      clientName,
      commandName,
      inputFilterSensitiveLog: (_) => _,
      outputFilterSensitiveLog: (_) => _
    };
    const { requestHandler } = configuration;
    return stack.resolve((request2) => requestHandler.handle(request2.request, options || {}), handlerExecutionContext);
  }
  serialize(input, context) {
    return se_AssumeRoleWithWebIdentityCommand(input, context);
  }
  deserialize(output, context) {
    return de_AssumeRoleWithWebIdentityCommand(output, context);
  }
};
__name(AssumeRoleWithWebIdentityCommand, "AssumeRoleWithWebIdentityCommand");

// node_modules/@aws-sdk/middleware-sdk-sts/dist-es/index.js
var resolveStsAuthConfig = /* @__PURE__ */ __name((input, { stsClientCtor }) => resolveAwsAuthConfig({
  ...input,
  stsClientCtor
}), "resolveStsAuthConfig");

// node_modules/@aws-sdk/client-sts/dist-es/endpoint/EndpointParameters.js
var resolveClientEndpointParameters2 = /* @__PURE__ */ __name((options) => {
  return {
    ...options,
    useDualstackEndpoint: options.useDualstackEndpoint ?? false,
    useFipsEndpoint: options.useFipsEndpoint ?? false,
    useGlobalEndpoint: options.useGlobalEndpoint ?? false,
    defaultSigningName: "sts"
  };
}, "resolveClientEndpointParameters");

// node_modules/@aws-sdk/client-sts/package.json
var package_default2 = {
  name: "@aws-sdk/client-sts",
  description: "AWS SDK for JavaScript Sts Client for Node.js, Browser and React Native",
  version: "3.329.0",
  scripts: {
    build: "concurrently 'yarn:build:cjs' 'yarn:build:es' 'yarn:build:types'",
    "build:cjs": "tsc -p tsconfig.cjs.json",
    "build:docs": "typedoc",
    "build:es": "tsc -p tsconfig.es.json",
    "build:include:deps": "lerna run --scope $npm_package_name --include-dependencies build",
    "build:types": "tsc -p tsconfig.types.json",
    "build:types:downlevel": "downlevel-dts dist-types dist-types/ts3.4",
    clean: "rimraf ./dist-* && rimraf *.tsbuildinfo",
    "extract:docs": "api-extractor run --local",
    "generate:client": "node ../../scripts/generate-clients/single-service --solo sts",
    test: "yarn test:unit",
    "test:unit": "jest"
  },
  main: "./dist-cjs/index.js",
  types: "./dist-types/index.d.ts",
  module: "./dist-es/index.js",
  sideEffects: false,
  dependencies: {
    "@aws-crypto/sha256-browser": "3.0.0",
    "@aws-crypto/sha256-js": "3.0.0",
    "@aws-sdk/config-resolver": "3.329.0",
    "@aws-sdk/credential-provider-node": "3.329.0",
    "@aws-sdk/fetch-http-handler": "3.329.0",
    "@aws-sdk/hash-node": "3.329.0",
    "@aws-sdk/invalid-dependency": "3.329.0",
    "@aws-sdk/middleware-content-length": "3.329.0",
    "@aws-sdk/middleware-endpoint": "3.329.0",
    "@aws-sdk/middleware-host-header": "3.329.0",
    "@aws-sdk/middleware-logger": "3.329.0",
    "@aws-sdk/middleware-recursion-detection": "3.329.0",
    "@aws-sdk/middleware-retry": "3.329.0",
    "@aws-sdk/middleware-sdk-sts": "3.329.0",
    "@aws-sdk/middleware-serde": "3.329.0",
    "@aws-sdk/middleware-signing": "3.329.0",
    "@aws-sdk/middleware-stack": "3.329.0",
    "@aws-sdk/middleware-user-agent": "3.329.0",
    "@aws-sdk/node-config-provider": "3.329.0",
    "@aws-sdk/node-http-handler": "3.329.0",
    "@aws-sdk/protocol-http": "3.329.0",
    "@aws-sdk/smithy-client": "3.329.0",
    "@aws-sdk/types": "3.329.0",
    "@aws-sdk/url-parser": "3.329.0",
    "@aws-sdk/util-base64": "3.310.0",
    "@aws-sdk/util-body-length-browser": "3.310.0",
    "@aws-sdk/util-body-length-node": "3.310.0",
    "@aws-sdk/util-defaults-mode-browser": "3.329.0",
    "@aws-sdk/util-defaults-mode-node": "3.329.0",
    "@aws-sdk/util-endpoints": "3.329.0",
    "@aws-sdk/util-retry": "3.329.0",
    "@aws-sdk/util-user-agent-browser": "3.329.0",
    "@aws-sdk/util-user-agent-node": "3.329.0",
    "@aws-sdk/util-utf8": "3.310.0",
    "fast-xml-parser": "4.1.2",
    tslib: "^2.5.0"
  },
  devDependencies: {
    "@aws-sdk/service-client-documentation-generator": "3.310.0",
    "@tsconfig/node14": "1.0.3",
    "@types/node": "^14.14.31",
    concurrently: "7.0.0",
    "downlevel-dts": "0.10.1",
    rimraf: "3.0.2",
    typedoc: "0.23.23",
    typescript: "~4.9.5"
  },
  engines: {
    node: ">=14.0.0"
  },
  typesVersions: {
    "<4.0": {
      "dist-types/*": [
        "dist-types/ts3.4/*"
      ]
    }
  },
  files: [
    "dist-*/**"
  ],
  author: {
    name: "AWS SDK for JavaScript Team",
    url: "https://aws.amazon.com/javascript/"
  },
  license: "Apache-2.0",
  browser: {
    "./dist-es/runtimeConfig": "./dist-es/runtimeConfig.browser"
  },
  "react-native": {
    "./dist-es/runtimeConfig": "./dist-es/runtimeConfig.native"
  },
  homepage: "https://github.com/aws/aws-sdk-js-v3/tree/main/clients/client-sts",
  repository: {
    type: "git",
    url: "https://github.com/aws/aws-sdk-js-v3.git",
    directory: "clients/client-sts"
  }
};

// node_modules/@aws-sdk/client-sts/dist-es/defaultStsRoleAssumers.js
var ASSUME_ROLE_DEFAULT_REGION = "us-east-1";
var decorateDefaultRegion = /* @__PURE__ */ __name((region) => {
  if (typeof region !== "function") {
    return region === void 0 ? ASSUME_ROLE_DEFAULT_REGION : region;
  }
  return async () => {
    try {
      return await region();
    } catch (e6) {
      return ASSUME_ROLE_DEFAULT_REGION;
    }
  };
}, "decorateDefaultRegion");
var getDefaultRoleAssumer = /* @__PURE__ */ __name((stsOptions, stsClientCtor) => {
  let stsClient;
  let closureSourceCreds;
  return async (sourceCreds, params) => {
    closureSourceCreds = sourceCreds;
    if (!stsClient) {
      const { logger: logger2, region, requestHandler } = stsOptions;
      stsClient = new stsClientCtor({
        logger: logger2,
        credentialDefaultProvider: () => async () => closureSourceCreds,
        region: decorateDefaultRegion(region || stsOptions.region),
        ...requestHandler ? { requestHandler } : {}
      });
    }
    const { Credentials } = await stsClient.send(new AssumeRoleCommand(params));
    if (!Credentials || !Credentials.AccessKeyId || !Credentials.SecretAccessKey) {
      throw new Error(`Invalid response from STS.assumeRole call with role ${params.RoleArn}`);
    }
    return {
      accessKeyId: Credentials.AccessKeyId,
      secretAccessKey: Credentials.SecretAccessKey,
      sessionToken: Credentials.SessionToken,
      expiration: Credentials.Expiration
    };
  };
}, "getDefaultRoleAssumer");
var getDefaultRoleAssumerWithWebIdentity = /* @__PURE__ */ __name((stsOptions, stsClientCtor) => {
  let stsClient;
  return async (params) => {
    if (!stsClient) {
      const { logger: logger2, region, requestHandler } = stsOptions;
      stsClient = new stsClientCtor({
        logger: logger2,
        region: decorateDefaultRegion(region || stsOptions.region),
        ...requestHandler ? { requestHandler } : {}
      });
    }
    const { Credentials } = await stsClient.send(new AssumeRoleWithWebIdentityCommand(params));
    if (!Credentials || !Credentials.AccessKeyId || !Credentials.SecretAccessKey) {
      throw new Error(`Invalid response from STS.assumeRoleWithWebIdentity call with role ${params.RoleArn}`);
    }
    return {
      accessKeyId: Credentials.AccessKeyId,
      secretAccessKey: Credentials.SecretAccessKey,
      sessionToken: Credentials.SessionToken,
      expiration: Credentials.Expiration
    };
  };
}, "getDefaultRoleAssumerWithWebIdentity");
var decorateDefaultCredentialProvider = /* @__PURE__ */ __name((provider) => (input) => provider({
  roleAssumer: getDefaultRoleAssumer(input, input.stsClientCtor),
  roleAssumerWithWebIdentity: getDefaultRoleAssumerWithWebIdentity(input, input.stsClientCtor),
  ...input
}), "decorateDefaultCredentialProvider");

// node_modules/@aws-sdk/credential-provider-env/dist-es/fromEnv.js
var ENV_KEY = "AWS_ACCESS_KEY_ID";
var ENV_SECRET = "AWS_SECRET_ACCESS_KEY";
var ENV_SESSION = "AWS_SESSION_TOKEN";
var ENV_EXPIRATION = "AWS_CREDENTIAL_EXPIRATION";
var fromEnv = /* @__PURE__ */ __name(() => async () => {
  const accessKeyId = process.env[ENV_KEY];
  const secretAccessKey = process.env[ENV_SECRET];
  const sessionToken = process.env[ENV_SESSION];
  const expiry = process.env[ENV_EXPIRATION];
  if (accessKeyId && secretAccessKey) {
    return {
      accessKeyId,
      secretAccessKey,
      ...sessionToken && { sessionToken },
      ...expiry && { expiration: new Date(expiry) }
    };
  }
  throw new CredentialsProviderError("Unable to find environment variable credentials.");
}, "fromEnv");

// node_modules/@aws-sdk/shared-ini-file-loader/dist-es/getHomeDir.js
import { homedir } from "os";
import { sep } from "path";
var getHomeDir = /* @__PURE__ */ __name(() => {
  const { HOME, USERPROFILE, HOMEPATH, HOMEDRIVE = `C:${sep}` } = process.env;
  if (HOME)
    return HOME;
  if (USERPROFILE)
    return USERPROFILE;
  if (HOMEPATH)
    return `${HOMEDRIVE}${HOMEPATH}`;
  return homedir();
}, "getHomeDir");

// node_modules/@aws-sdk/shared-ini-file-loader/dist-es/getProfileName.js
var ENV_PROFILE = "AWS_PROFILE";
var DEFAULT_PROFILE = "default";
var getProfileName = /* @__PURE__ */ __name((init) => init.profile || process.env[ENV_PROFILE] || DEFAULT_PROFILE, "getProfileName");

// node_modules/@aws-sdk/shared-ini-file-loader/dist-es/getSSOTokenFilepath.js
import { createHash } from "crypto";
import { join } from "path";
var getSSOTokenFilepath = /* @__PURE__ */ __name((id) => {
  const hasher = createHash("sha1");
  const cacheName = hasher.update(id).digest("hex");
  return join(getHomeDir(), ".aws", "sso", "cache", `${cacheName}.json`);
}, "getSSOTokenFilepath");

// node_modules/@aws-sdk/shared-ini-file-loader/dist-es/getSSOTokenFromFile.js
import { promises as fsPromises } from "fs";
var { readFile } = fsPromises;
var getSSOTokenFromFile = /* @__PURE__ */ __name(async (id) => {
  const ssoTokenFilepath = getSSOTokenFilepath(id);
  const ssoTokenText = await readFile(ssoTokenFilepath, "utf8");
  return JSON.parse(ssoTokenText);
}, "getSSOTokenFromFile");

// node_modules/@aws-sdk/shared-ini-file-loader/dist-es/getConfigFilepath.js
import { join as join2 } from "path";
var ENV_CONFIG_PATH = "AWS_CONFIG_FILE";
var getConfigFilepath = /* @__PURE__ */ __name(() => process.env[ENV_CONFIG_PATH] || join2(getHomeDir(), ".aws", "config"), "getConfigFilepath");

// node_modules/@aws-sdk/shared-ini-file-loader/dist-es/getCredentialsFilepath.js
import { join as join3 } from "path";
var ENV_CREDENTIALS_PATH = "AWS_SHARED_CREDENTIALS_FILE";
var getCredentialsFilepath = /* @__PURE__ */ __name(() => process.env[ENV_CREDENTIALS_PATH] || join3(getHomeDir(), ".aws", "credentials"), "getCredentialsFilepath");

// node_modules/@aws-sdk/shared-ini-file-loader/dist-es/getProfileData.js
var profileKeyRegex = /^profile\s(["'])?([^\1]+)\1$/;
var getProfileData = /* @__PURE__ */ __name((data) => Object.entries(data).filter(([key]) => profileKeyRegex.test(key)).reduce((acc, [key, value]) => ({ ...acc, [profileKeyRegex.exec(key)[2]]: value }), {
  ...data.default && { default: data.default }
}), "getProfileData");

// node_modules/@aws-sdk/shared-ini-file-loader/dist-es/parseIni.js
var profileNameBlockList = ["__proto__", "profile __proto__"];
var parseIni = /* @__PURE__ */ __name((iniData) => {
  const map2 = {};
  let currentSection;
  for (let line of iniData.split(/\r?\n/)) {
    line = line.split(/(^|\s)[;#]/)[0].trim();
    const isSection = line[0] === "[" && line[line.length - 1] === "]";
    if (isSection) {
      currentSection = line.substring(1, line.length - 1);
      if (profileNameBlockList.includes(currentSection)) {
        throw new Error(`Found invalid profile name "${currentSection}"`);
      }
    } else if (currentSection) {
      const indexOfEqualsSign = line.indexOf("=");
      const start = 0;
      const end = line.length - 1;
      const isAssignment = indexOfEqualsSign !== -1 && indexOfEqualsSign !== start && indexOfEqualsSign !== end;
      if (isAssignment) {
        const [name, value] = [
          line.substring(0, indexOfEqualsSign).trim(),
          line.substring(indexOfEqualsSign + 1).trim()
        ];
        map2[currentSection] = map2[currentSection] || {};
        map2[currentSection][name] = value;
      }
    }
  }
  return map2;
}, "parseIni");

// node_modules/@aws-sdk/shared-ini-file-loader/dist-es/slurpFile.js
import { promises as fsPromises2 } from "fs";
var { readFile: readFile2 } = fsPromises2;
var filePromisesHash = {};
var slurpFile = /* @__PURE__ */ __name((path, options) => {
  if (!filePromisesHash[path] || options?.ignoreCache) {
    filePromisesHash[path] = readFile2(path, "utf8");
  }
  return filePromisesHash[path];
}, "slurpFile");

// node_modules/@aws-sdk/shared-ini-file-loader/dist-es/loadSharedConfigFiles.js
var swallowError = /* @__PURE__ */ __name(() => ({}), "swallowError");
var loadSharedConfigFiles = /* @__PURE__ */ __name(async (init = {}) => {
  const { filepath = getCredentialsFilepath(), configFilepath = getConfigFilepath() } = init;
  const parsedFiles = await Promise.all([
    slurpFile(configFilepath, {
      ignoreCache: init.ignoreCache
    }).then(parseIni).then(getProfileData).catch(swallowError),
    slurpFile(filepath, {
      ignoreCache: init.ignoreCache
    }).then(parseIni).catch(swallowError)
  ]);
  return {
    configFile: parsedFiles[0],
    credentialsFile: parsedFiles[1]
  };
}, "loadSharedConfigFiles");

// node_modules/@aws-sdk/shared-ini-file-loader/dist-es/getSsoSessionData.js
var ssoSessionKeyRegex = /^sso-session\s(["'])?([^\1]+)\1$/;
var getSsoSessionData = /* @__PURE__ */ __name((data) => Object.entries(data).filter(([key]) => ssoSessionKeyRegex.test(key)).reduce((acc, [key, value]) => ({ ...acc, [ssoSessionKeyRegex.exec(key)[2]]: value }), {}), "getSsoSessionData");

// node_modules/@aws-sdk/shared-ini-file-loader/dist-es/loadSsoSessionData.js
var swallowError2 = /* @__PURE__ */ __name(() => ({}), "swallowError");
var loadSsoSessionData = /* @__PURE__ */ __name(async (init = {}) => slurpFile(init.configFilepath ?? getConfigFilepath()).then(parseIni).then(getSsoSessionData).catch(swallowError2), "loadSsoSessionData");

// node_modules/@aws-sdk/shared-ini-file-loader/dist-es/mergeConfigFiles.js
var mergeConfigFiles = /* @__PURE__ */ __name((...files) => {
  const merged = {};
  for (const file of files) {
    for (const [key, values] of Object.entries(file)) {
      if (merged[key] !== void 0) {
        Object.assign(merged[key], values);
      } else {
        merged[key] = values;
      }
    }
  }
  return merged;
}, "mergeConfigFiles");

// node_modules/@aws-sdk/shared-ini-file-loader/dist-es/parseKnownFiles.js
var parseKnownFiles = /* @__PURE__ */ __name(async (init) => {
  const parsedFiles = await loadSharedConfigFiles(init);
  return mergeConfigFiles(parsedFiles.configFile, parsedFiles.credentialsFile);
}, "parseKnownFiles");

// node_modules/@aws-sdk/credential-provider-imds/dist-es/fromContainerMetadata.js
import { parse } from "url";

// node_modules/@aws-sdk/credential-provider-imds/dist-es/remoteProvider/httpRequest.js
import { Buffer as Buffer3 } from "buffer";
import { request } from "http";
function httpRequest(options) {
  return new Promise((resolve, reject) => {
    const req = request({
      method: "GET",
      ...options,
      hostname: options.hostname?.replace(/^\[(.+)\]$/, "$1")
    });
    req.on("error", (err) => {
      reject(Object.assign(new ProviderError("Unable to connect to instance metadata service"), err));
      req.destroy();
    });
    req.on("timeout", () => {
      reject(new ProviderError("TimeoutError from instance metadata service"));
      req.destroy();
    });
    req.on("response", (res) => {
      const { statusCode = 400 } = res;
      if (statusCode < 200 || 300 <= statusCode) {
        reject(Object.assign(new ProviderError("Error response received from instance metadata service"), { statusCode }));
        req.destroy();
      }
      const chunks = [];
      res.on("data", (chunk) => {
        chunks.push(chunk);
      });
      res.on("end", () => {
        resolve(Buffer3.concat(chunks));
        req.destroy();
      });
    });
    req.end();
  });
}
__name(httpRequest, "httpRequest");

// node_modules/@aws-sdk/credential-provider-imds/dist-es/remoteProvider/ImdsCredentials.js
var isImdsCredentials = /* @__PURE__ */ __name((arg) => Boolean(arg) && typeof arg === "object" && typeof arg.AccessKeyId === "string" && typeof arg.SecretAccessKey === "string" && typeof arg.Token === "string" && typeof arg.Expiration === "string", "isImdsCredentials");
var fromImdsCredentials = /* @__PURE__ */ __name((creds) => ({
  accessKeyId: creds.AccessKeyId,
  secretAccessKey: creds.SecretAccessKey,
  sessionToken: creds.Token,
  expiration: new Date(creds.Expiration)
}), "fromImdsCredentials");

// node_modules/@aws-sdk/credential-provider-imds/dist-es/remoteProvider/RemoteProviderInit.js
var DEFAULT_TIMEOUT = 1e3;
var DEFAULT_MAX_RETRIES = 0;
var providerConfigFromInit = /* @__PURE__ */ __name(({ maxRetries = DEFAULT_MAX_RETRIES, timeout = DEFAULT_TIMEOUT }) => ({ maxRetries, timeout }), "providerConfigFromInit");

// node_modules/@aws-sdk/credential-provider-imds/dist-es/remoteProvider/retry.js
var retry = /* @__PURE__ */ __name((toRetry, maxRetries) => {
  let promise = toRetry();
  for (let i6 = 0; i6 < maxRetries; i6++) {
    promise = promise.catch(toRetry);
  }
  return promise;
}, "retry");

// node_modules/@aws-sdk/credential-provider-imds/dist-es/fromContainerMetadata.js
var ENV_CMDS_FULL_URI = "AWS_CONTAINER_CREDENTIALS_FULL_URI";
var ENV_CMDS_RELATIVE_URI = "AWS_CONTAINER_CREDENTIALS_RELATIVE_URI";
var ENV_CMDS_AUTH_TOKEN = "AWS_CONTAINER_AUTHORIZATION_TOKEN";
var fromContainerMetadata = /* @__PURE__ */ __name((init = {}) => {
  const { timeout, maxRetries } = providerConfigFromInit(init);
  return () => retry(async () => {
    const requestOptions = await getCmdsUri();
    const credsResponse = JSON.parse(await requestFromEcsImds(timeout, requestOptions));
    if (!isImdsCredentials(credsResponse)) {
      throw new CredentialsProviderError("Invalid response received from instance metadata service.");
    }
    return fromImdsCredentials(credsResponse);
  }, maxRetries);
}, "fromContainerMetadata");
var requestFromEcsImds = /* @__PURE__ */ __name(async (timeout, options) => {
  if (process.env[ENV_CMDS_AUTH_TOKEN]) {
    options.headers = {
      ...options.headers,
      Authorization: process.env[ENV_CMDS_AUTH_TOKEN]
    };
  }
  const buffer = await httpRequest({
    ...options,
    timeout
  });
  return buffer.toString();
}, "requestFromEcsImds");
var CMDS_IP = "169.254.170.2";
var GREENGRASS_HOSTS = {
  localhost: true,
  "127.0.0.1": true
};
var GREENGRASS_PROTOCOLS = {
  "http:": true,
  "https:": true
};
var getCmdsUri = /* @__PURE__ */ __name(async () => {
  if (process.env[ENV_CMDS_RELATIVE_URI]) {
    return {
      hostname: CMDS_IP,
      path: process.env[ENV_CMDS_RELATIVE_URI]
    };
  }
  if (process.env[ENV_CMDS_FULL_URI]) {
    const parsed = parse(process.env[ENV_CMDS_FULL_URI]);
    if (!parsed.hostname || !(parsed.hostname in GREENGRASS_HOSTS)) {
      throw new CredentialsProviderError(`${parsed.hostname} is not a valid container metadata service hostname`, false);
    }
    if (!parsed.protocol || !(parsed.protocol in GREENGRASS_PROTOCOLS)) {
      throw new CredentialsProviderError(`${parsed.protocol} is not a valid container metadata service protocol`, false);
    }
    return {
      ...parsed,
      port: parsed.port ? parseInt(parsed.port, 10) : void 0
    };
  }
  throw new CredentialsProviderError(`The container metadata credential provider cannot be used unless the ${ENV_CMDS_RELATIVE_URI} or ${ENV_CMDS_FULL_URI} environment variable is set`, false);
}, "getCmdsUri");

// node_modules/@aws-sdk/node-config-provider/dist-es/fromEnv.js
var fromEnv2 = /* @__PURE__ */ __name((envVarSelector) => async () => {
  try {
    const config = envVarSelector(process.env);
    if (config === void 0) {
      throw new Error();
    }
    return config;
  } catch (e6) {
    throw new CredentialsProviderError(e6.message || `Cannot load config from environment variables with getter: ${envVarSelector}`);
  }
}, "fromEnv");

// node_modules/@aws-sdk/node-config-provider/dist-es/fromSharedConfigFiles.js
var fromSharedConfigFiles = /* @__PURE__ */ __name((configSelector, { preferredFile = "config", ...init } = {}) => async () => {
  const profile = getProfileName(init);
  const { configFile, credentialsFile } = await loadSharedConfigFiles(init);
  const profileFromCredentials = credentialsFile[profile] || {};
  const profileFromConfig = configFile[profile] || {};
  const mergedProfile = preferredFile === "config" ? { ...profileFromCredentials, ...profileFromConfig } : { ...profileFromConfig, ...profileFromCredentials };
  try {
    const configValue = configSelector(mergedProfile);
    if (configValue === void 0) {
      throw new Error();
    }
    return configValue;
  } catch (e6) {
    throw new CredentialsProviderError(e6.message || `Cannot load config for profile ${profile} in SDK configuration files with getter: ${configSelector}`);
  }
}, "fromSharedConfigFiles");

// node_modules/@aws-sdk/node-config-provider/dist-es/fromStatic.js
var isFunction = /* @__PURE__ */ __name((func) => typeof func === "function", "isFunction");
var fromStatic2 = /* @__PURE__ */ __name((defaultValue) => isFunction(defaultValue) ? async () => await defaultValue() : fromStatic(defaultValue), "fromStatic");

// node_modules/@aws-sdk/node-config-provider/dist-es/configLoader.js
var loadConfig = /* @__PURE__ */ __name(({ environmentVariableSelector, configFileSelector, default: defaultValue }, configuration = {}) => memoize(chain(fromEnv2(environmentVariableSelector), fromSharedConfigFiles(configFileSelector, configuration), fromStatic2(defaultValue))), "loadConfig");

// node_modules/@aws-sdk/credential-provider-imds/dist-es/config/Endpoint.js
var Endpoint;
(function(Endpoint2) {
  Endpoint2["IPv4"] = "http://169.254.169.254";
  Endpoint2["IPv6"] = "http://[fd00:ec2::254]";
})(Endpoint || (Endpoint = {}));

// node_modules/@aws-sdk/credential-provider-imds/dist-es/config/EndpointConfigOptions.js
var ENV_ENDPOINT_NAME = "AWS_EC2_METADATA_SERVICE_ENDPOINT";
var CONFIG_ENDPOINT_NAME = "ec2_metadata_service_endpoint";
var ENDPOINT_CONFIG_OPTIONS = {
  environmentVariableSelector: (env2) => env2[ENV_ENDPOINT_NAME],
  configFileSelector: (profile) => profile[CONFIG_ENDPOINT_NAME],
  default: void 0
};

// node_modules/@aws-sdk/credential-provider-imds/dist-es/config/EndpointMode.js
var EndpointMode;
(function(EndpointMode2) {
  EndpointMode2["IPv4"] = "IPv4";
  EndpointMode2["IPv6"] = "IPv6";
})(EndpointMode || (EndpointMode = {}));

// node_modules/@aws-sdk/credential-provider-imds/dist-es/config/EndpointModeConfigOptions.js
var ENV_ENDPOINT_MODE_NAME = "AWS_EC2_METADATA_SERVICE_ENDPOINT_MODE";
var CONFIG_ENDPOINT_MODE_NAME = "ec2_metadata_service_endpoint_mode";
var ENDPOINT_MODE_CONFIG_OPTIONS = {
  environmentVariableSelector: (env2) => env2[ENV_ENDPOINT_MODE_NAME],
  configFileSelector: (profile) => profile[CONFIG_ENDPOINT_MODE_NAME],
  default: EndpointMode.IPv4
};

// node_modules/@aws-sdk/credential-provider-imds/dist-es/utils/getInstanceMetadataEndpoint.js
var getInstanceMetadataEndpoint = /* @__PURE__ */ __name(async () => parseUrl(await getFromEndpointConfig() || await getFromEndpointModeConfig()), "getInstanceMetadataEndpoint");
var getFromEndpointConfig = /* @__PURE__ */ __name(async () => loadConfig(ENDPOINT_CONFIG_OPTIONS)(), "getFromEndpointConfig");
var getFromEndpointModeConfig = /* @__PURE__ */ __name(async () => {
  const endpointMode = await loadConfig(ENDPOINT_MODE_CONFIG_OPTIONS)();
  switch (endpointMode) {
    case EndpointMode.IPv4:
      return Endpoint.IPv4;
    case EndpointMode.IPv6:
      return Endpoint.IPv6;
    default:
      throw new Error(`Unsupported endpoint mode: ${endpointMode}. Select from ${Object.values(EndpointMode)}`);
  }
}, "getFromEndpointModeConfig");

// node_modules/@aws-sdk/credential-provider-imds/dist-es/utils/getExtendedInstanceMetadataCredentials.js
var STATIC_STABILITY_REFRESH_INTERVAL_SECONDS = 5 * 60;
var STATIC_STABILITY_REFRESH_INTERVAL_JITTER_WINDOW_SECONDS = 5 * 60;
var STATIC_STABILITY_DOC_URL = "https://docs.aws.amazon.com/sdkref/latest/guide/feature-static-credentials.html";
var getExtendedInstanceMetadataCredentials = /* @__PURE__ */ __name((credentials, logger2) => {
  const refreshInterval = STATIC_STABILITY_REFRESH_INTERVAL_SECONDS + Math.floor(Math.random() * STATIC_STABILITY_REFRESH_INTERVAL_JITTER_WINDOW_SECONDS);
  const newExpiration = new Date(Date.now() + refreshInterval * 1e3);
  logger2.warn("Attempting credential expiration extension due to a credential service availability issue. A refresh of these credentials will be attempted after ${new Date(newExpiration)}.\nFor more information, please visit: " + STATIC_STABILITY_DOC_URL);
  const originalExpiration = credentials.originalExpiration ?? credentials.expiration;
  return {
    ...credentials,
    ...originalExpiration ? { originalExpiration } : {},
    expiration: newExpiration
  };
}, "getExtendedInstanceMetadataCredentials");

// node_modules/@aws-sdk/credential-provider-imds/dist-es/utils/staticStabilityProvider.js
var staticStabilityProvider = /* @__PURE__ */ __name((provider, options = {}) => {
  const logger2 = options?.logger || console;
  let pastCredentials;
  return async () => {
    let credentials;
    try {
      credentials = await provider();
      if (credentials.expiration && credentials.expiration.getTime() < Date.now()) {
        credentials = getExtendedInstanceMetadataCredentials(credentials, logger2);
      }
    } catch (e6) {
      if (pastCredentials) {
        logger2.warn("Credential renew failed: ", e6);
        credentials = getExtendedInstanceMetadataCredentials(pastCredentials, logger2);
      } else {
        throw e6;
      }
    }
    pastCredentials = credentials;
    return credentials;
  };
}, "staticStabilityProvider");

// node_modules/@aws-sdk/credential-provider-imds/dist-es/fromInstanceMetadata.js
var IMDS_PATH = "/latest/meta-data/iam/security-credentials/";
var IMDS_TOKEN_PATH = "/latest/api/token";
var fromInstanceMetadata = /* @__PURE__ */ __name((init = {}) => staticStabilityProvider(getInstanceImdsProvider(init), { logger: init.logger }), "fromInstanceMetadata");
var getInstanceImdsProvider = /* @__PURE__ */ __name((init) => {
  let disableFetchToken = false;
  const { timeout, maxRetries } = providerConfigFromInit(init);
  const getCredentials = /* @__PURE__ */ __name(async (maxRetries2, options) => {
    const profile = (await retry(async () => {
      let profile2;
      try {
        profile2 = await getProfile(options);
      } catch (err) {
        if (err.statusCode === 401) {
          disableFetchToken = false;
        }
        throw err;
      }
      return profile2;
    }, maxRetries2)).trim();
    return retry(async () => {
      let creds;
      try {
        creds = await getCredentialsFromProfile(profile, options);
      } catch (err) {
        if (err.statusCode === 401) {
          disableFetchToken = false;
        }
        throw err;
      }
      return creds;
    }, maxRetries2);
  }, "getCredentials");
  return async () => {
    const endpoint = await getInstanceMetadataEndpoint();
    if (disableFetchToken) {
      return getCredentials(maxRetries, { ...endpoint, timeout });
    } else {
      let token;
      try {
        token = (await getMetadataToken({ ...endpoint, timeout })).toString();
      } catch (error) {
        if (error?.statusCode === 400) {
          throw Object.assign(error, {
            message: "EC2 Metadata token request returned error"
          });
        } else if (error.message === "TimeoutError" || [403, 404, 405].includes(error.statusCode)) {
          disableFetchToken = true;
        }
        return getCredentials(maxRetries, { ...endpoint, timeout });
      }
      return getCredentials(maxRetries, {
        ...endpoint,
        headers: {
          "x-aws-ec2-metadata-token": token
        },
        timeout
      });
    }
  };
}, "getInstanceImdsProvider");
var getMetadataToken = /* @__PURE__ */ __name(async (options) => httpRequest({
  ...options,
  path: IMDS_TOKEN_PATH,
  method: "PUT",
  headers: {
    "x-aws-ec2-metadata-token-ttl-seconds": "21600"
  }
}), "getMetadataToken");
var getProfile = /* @__PURE__ */ __name(async (options) => (await httpRequest({ ...options, path: IMDS_PATH })).toString(), "getProfile");
var getCredentialsFromProfile = /* @__PURE__ */ __name(async (profile, options) => {
  const credsResponse = JSON.parse((await httpRequest({
    ...options,
    path: IMDS_PATH + profile
  })).toString());
  if (!isImdsCredentials(credsResponse)) {
    throw new CredentialsProviderError("Invalid response received from instance metadata service.");
  }
  return fromImdsCredentials(credsResponse);
}, "getCredentialsFromProfile");

// node_modules/@aws-sdk/credential-provider-ini/dist-es/resolveCredentialSource.js
var resolveCredentialSource = /* @__PURE__ */ __name((credentialSource, profileName) => {
  const sourceProvidersMap = {
    EcsContainer: fromContainerMetadata,
    Ec2InstanceMetadata: fromInstanceMetadata,
    Environment: fromEnv
  };
  if (credentialSource in sourceProvidersMap) {
    return sourceProvidersMap[credentialSource]();
  } else {
    throw new CredentialsProviderError(`Unsupported credential source in profile ${profileName}. Got ${credentialSource}, expected EcsContainer or Ec2InstanceMetadata or Environment.`);
  }
}, "resolveCredentialSource");

// node_modules/@aws-sdk/credential-provider-ini/dist-es/resolveAssumeRoleCredentials.js
var isAssumeRoleProfile = /* @__PURE__ */ __name((arg) => Boolean(arg) && typeof arg === "object" && typeof arg.role_arn === "string" && ["undefined", "string"].indexOf(typeof arg.role_session_name) > -1 && ["undefined", "string"].indexOf(typeof arg.external_id) > -1 && ["undefined", "string"].indexOf(typeof arg.mfa_serial) > -1 && (isAssumeRoleWithSourceProfile(arg) || isAssumeRoleWithProviderProfile(arg)), "isAssumeRoleProfile");
var isAssumeRoleWithSourceProfile = /* @__PURE__ */ __name((arg) => typeof arg.source_profile === "string" && typeof arg.credential_source === "undefined", "isAssumeRoleWithSourceProfile");
var isAssumeRoleWithProviderProfile = /* @__PURE__ */ __name((arg) => typeof arg.credential_source === "string" && typeof arg.source_profile === "undefined", "isAssumeRoleWithProviderProfile");
var resolveAssumeRoleCredentials = /* @__PURE__ */ __name(async (profileName, profiles, options, visitedProfiles = {}) => {
  const data = profiles[profileName];
  if (!options.roleAssumer) {
    throw new CredentialsProviderError(`Profile ${profileName} requires a role to be assumed, but no role assumption callback was provided.`, false);
  }
  const { source_profile } = data;
  if (source_profile && source_profile in visitedProfiles) {
    throw new CredentialsProviderError(`Detected a cycle attempting to resolve credentials for profile ${getProfileName(options)}. Profiles visited: ` + Object.keys(visitedProfiles).join(", "), false);
  }
  const sourceCredsProvider = source_profile ? resolveProfileData(source_profile, profiles, options, {
    ...visitedProfiles,
    [source_profile]: true
  }) : resolveCredentialSource(data.credential_source, profileName)();
  const params = {
    RoleArn: data.role_arn,
    RoleSessionName: data.role_session_name || `aws-sdk-js-${Date.now()}`,
    ExternalId: data.external_id
  };
  const { mfa_serial } = data;
  if (mfa_serial) {
    if (!options.mfaCodeProvider) {
      throw new CredentialsProviderError(`Profile ${profileName} requires multi-factor authentication, but no MFA code callback was provided.`, false);
    }
    params.SerialNumber = mfa_serial;
    params.TokenCode = await options.mfaCodeProvider(mfa_serial);
  }
  const sourceCreds = await sourceCredsProvider;
  return options.roleAssumer(sourceCreds, params);
}, "resolveAssumeRoleCredentials");

// node_modules/@aws-sdk/credential-provider-process/dist-es/resolveProcessCredentials.js
import { exec } from "child_process";
import { promisify } from "util";

// node_modules/@aws-sdk/credential-provider-process/dist-es/getValidatedProcessCredentials.js
var getValidatedProcessCredentials = /* @__PURE__ */ __name((profileName, data) => {
  if (data.Version !== 1) {
    throw Error(`Profile ${profileName} credential_process did not return Version 1.`);
  }
  if (data.AccessKeyId === void 0 || data.SecretAccessKey === void 0) {
    throw Error(`Profile ${profileName} credential_process returned invalid credentials.`);
  }
  if (data.Expiration) {
    const currentTime = new Date();
    const expireTime = new Date(data.Expiration);
    if (expireTime < currentTime) {
      throw Error(`Profile ${profileName} credential_process returned expired credentials.`);
    }
  }
  return {
    accessKeyId: data.AccessKeyId,
    secretAccessKey: data.SecretAccessKey,
    ...data.SessionToken && { sessionToken: data.SessionToken },
    ...data.Expiration && { expiration: new Date(data.Expiration) }
  };
}, "getValidatedProcessCredentials");

// node_modules/@aws-sdk/credential-provider-process/dist-es/resolveProcessCredentials.js
var resolveProcessCredentials = /* @__PURE__ */ __name(async (profileName, profiles) => {
  const profile = profiles[profileName];
  if (profiles[profileName]) {
    const credentialProcess = profile["credential_process"];
    if (credentialProcess !== void 0) {
      const execPromise = promisify(exec);
      try {
        const { stdout } = await execPromise(credentialProcess);
        let data;
        try {
          data = JSON.parse(stdout.trim());
        } catch {
          throw Error(`Profile ${profileName} credential_process returned invalid JSON.`);
        }
        return getValidatedProcessCredentials(profileName, data);
      } catch (error) {
        throw new CredentialsProviderError(error.message);
      }
    } else {
      throw new CredentialsProviderError(`Profile ${profileName} did not contain credential_process.`);
    }
  } else {
    throw new CredentialsProviderError(`Profile ${profileName} could not be found in shared credentials file.`);
  }
}, "resolveProcessCredentials");

// node_modules/@aws-sdk/credential-provider-process/dist-es/fromProcess.js
var fromProcess = /* @__PURE__ */ __name((init = {}) => async () => {
  const profiles = await parseKnownFiles(init);
  return resolveProcessCredentials(getProfileName(init), profiles);
}, "fromProcess");

// node_modules/@aws-sdk/credential-provider-ini/dist-es/resolveProcessCredentials.js
var isProcessProfile = /* @__PURE__ */ __name((arg) => Boolean(arg) && typeof arg === "object" && typeof arg.credential_process === "string", "isProcessProfile");
var resolveProcessCredentials2 = /* @__PURE__ */ __name(async (options, profile) => fromProcess({
  ...options,
  profile
})(), "resolveProcessCredentials");

// node_modules/@aws-sdk/credential-provider-sso/dist-es/isSsoProfile.js
var isSsoProfile = /* @__PURE__ */ __name((arg) => arg && (typeof arg.sso_start_url === "string" || typeof arg.sso_account_id === "string" || typeof arg.sso_session === "string" || typeof arg.sso_region === "string" || typeof arg.sso_role_name === "string"), "isSsoProfile");

// node_modules/@aws-sdk/client-sso/dist-es/models/SSOServiceException.js
var SSOServiceException = class extends ServiceException {
  constructor(options) {
    super(options);
    Object.setPrototypeOf(this, SSOServiceException.prototype);
  }
};
__name(SSOServiceException, "SSOServiceException");

// node_modules/@aws-sdk/client-sso/dist-es/models/models_0.js
var InvalidRequestException = class extends SSOServiceException {
  constructor(opts) {
    super({
      name: "InvalidRequestException",
      $fault: "client",
      ...opts
    });
    this.name = "InvalidRequestException";
    this.$fault = "client";
    Object.setPrototypeOf(this, InvalidRequestException.prototype);
  }
};
__name(InvalidRequestException, "InvalidRequestException");
var ResourceNotFoundException = class extends SSOServiceException {
  constructor(opts) {
    super({
      name: "ResourceNotFoundException",
      $fault: "client",
      ...opts
    });
    this.name = "ResourceNotFoundException";
    this.$fault = "client";
    Object.setPrototypeOf(this, ResourceNotFoundException.prototype);
  }
};
__name(ResourceNotFoundException, "ResourceNotFoundException");
var TooManyRequestsException = class extends SSOServiceException {
  constructor(opts) {
    super({
      name: "TooManyRequestsException",
      $fault: "client",
      ...opts
    });
    this.name = "TooManyRequestsException";
    this.$fault = "client";
    Object.setPrototypeOf(this, TooManyRequestsException.prototype);
  }
};
__name(TooManyRequestsException, "TooManyRequestsException");
var UnauthorizedException = class extends SSOServiceException {
  constructor(opts) {
    super({
      name: "UnauthorizedException",
      $fault: "client",
      ...opts
    });
    this.name = "UnauthorizedException";
    this.$fault = "client";
    Object.setPrototypeOf(this, UnauthorizedException.prototype);
  }
};
__name(UnauthorizedException, "UnauthorizedException");
var GetRoleCredentialsRequestFilterSensitiveLog = /* @__PURE__ */ __name((obj) => ({
  ...obj,
  ...obj.accessToken && { accessToken: SENSITIVE_STRING }
}), "GetRoleCredentialsRequestFilterSensitiveLog");
var RoleCredentialsFilterSensitiveLog = /* @__PURE__ */ __name((obj) => ({
  ...obj,
  ...obj.secretAccessKey && { secretAccessKey: SENSITIVE_STRING },
  ...obj.sessionToken && { sessionToken: SENSITIVE_STRING }
}), "RoleCredentialsFilterSensitiveLog");
var GetRoleCredentialsResponseFilterSensitiveLog = /* @__PURE__ */ __name((obj) => ({
  ...obj,
  ...obj.roleCredentials && { roleCredentials: RoleCredentialsFilterSensitiveLog(obj.roleCredentials) }
}), "GetRoleCredentialsResponseFilterSensitiveLog");

// node_modules/@aws-sdk/client-sso/dist-es/protocols/Aws_restJson1.js
var se_GetRoleCredentialsCommand = /* @__PURE__ */ __name(async (input, context) => {
  const { hostname, protocol = "https", port, path: basePath } = await context.endpoint();
  const headers = map({}, isSerializableHeaderValue, {
    "x-amz-sso_bearer_token": input.accessToken
  });
  const resolvedPath = `${basePath?.endsWith("/") ? basePath.slice(0, -1) : basePath || ""}/federation/credentials`;
  const query = map({
    role_name: [, expectNonNull(input.roleName, `roleName`)],
    account_id: [, expectNonNull(input.accountId, `accountId`)]
  });
  let body;
  return new HttpRequest({
    protocol,
    hostname,
    port,
    method: "GET",
    headers,
    path: resolvedPath,
    query,
    body
  });
}, "se_GetRoleCredentialsCommand");
var de_GetRoleCredentialsCommand = /* @__PURE__ */ __name(async (output, context) => {
  if (output.statusCode !== 200 && output.statusCode >= 300) {
    return de_GetRoleCredentialsCommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata4(output)
  });
  const data = expectNonNull(expectObject(await parseBody3(output.body, context)), "body");
  const doc = take(data, {
    roleCredentials: _json
  });
  Object.assign(contents, doc);
  return contents;
}, "de_GetRoleCredentialsCommand");
var de_GetRoleCredentialsCommandError = /* @__PURE__ */ __name(async (output, context) => {
  const parsedOutput = {
    ...output,
    body: await parseErrorBody3(output.body, context)
  };
  const errorCode = loadRestJsonErrorCode2(output, parsedOutput.body);
  switch (errorCode) {
    case "InvalidRequestException":
    case "com.amazonaws.sso#InvalidRequestException":
      throw await de_InvalidRequestExceptionRes(parsedOutput, context);
    case "ResourceNotFoundException":
    case "com.amazonaws.sso#ResourceNotFoundException":
      throw await de_ResourceNotFoundExceptionRes(parsedOutput, context);
    case "TooManyRequestsException":
    case "com.amazonaws.sso#TooManyRequestsException":
      throw await de_TooManyRequestsExceptionRes(parsedOutput, context);
    case "UnauthorizedException":
    case "com.amazonaws.sso#UnauthorizedException":
      throw await de_UnauthorizedExceptionRes(parsedOutput, context);
    default:
      const parsedBody = parsedOutput.body;
      return throwDefaultError4({
        output,
        parsedBody,
        errorCode
      });
  }
}, "de_GetRoleCredentialsCommandError");
var throwDefaultError4 = withBaseException(SSOServiceException);
var de_InvalidRequestExceptionRes = /* @__PURE__ */ __name(async (parsedOutput, context) => {
  const contents = map({});
  const data = parsedOutput.body;
  const doc = take(data, {
    message: expectString
  });
  Object.assign(contents, doc);
  const exception = new InvalidRequestException({
    $metadata: deserializeMetadata4(parsedOutput),
    ...contents
  });
  return decorateServiceException(exception, parsedOutput.body);
}, "de_InvalidRequestExceptionRes");
var de_ResourceNotFoundExceptionRes = /* @__PURE__ */ __name(async (parsedOutput, context) => {
  const contents = map({});
  const data = parsedOutput.body;
  const doc = take(data, {
    message: expectString
  });
  Object.assign(contents, doc);
  const exception = new ResourceNotFoundException({
    $metadata: deserializeMetadata4(parsedOutput),
    ...contents
  });
  return decorateServiceException(exception, parsedOutput.body);
}, "de_ResourceNotFoundExceptionRes");
var de_TooManyRequestsExceptionRes = /* @__PURE__ */ __name(async (parsedOutput, context) => {
  const contents = map({});
  const data = parsedOutput.body;
  const doc = take(data, {
    message: expectString
  });
  Object.assign(contents, doc);
  const exception = new TooManyRequestsException({
    $metadata: deserializeMetadata4(parsedOutput),
    ...contents
  });
  return decorateServiceException(exception, parsedOutput.body);
}, "de_TooManyRequestsExceptionRes");
var de_UnauthorizedExceptionRes = /* @__PURE__ */ __name(async (parsedOutput, context) => {
  const contents = map({});
  const data = parsedOutput.body;
  const doc = take(data, {
    message: expectString
  });
  Object.assign(contents, doc);
  const exception = new UnauthorizedException({
    $metadata: deserializeMetadata4(parsedOutput),
    ...contents
  });
  return decorateServiceException(exception, parsedOutput.body);
}, "de_UnauthorizedExceptionRes");
var deserializeMetadata4 = /* @__PURE__ */ __name((output) => ({
  httpStatusCode: output.statusCode,
  requestId: output.headers["x-amzn-requestid"] ?? output.headers["x-amzn-request-id"] ?? output.headers["x-amz-request-id"],
  extendedRequestId: output.headers["x-amz-id-2"],
  cfId: output.headers["x-amz-cf-id"]
}), "deserializeMetadata");
var collectBody3 = /* @__PURE__ */ __name((streamBody = new Uint8Array(), context) => {
  if (streamBody instanceof Uint8Array) {
    return Promise.resolve(streamBody);
  }
  return context.streamCollector(streamBody) || Promise.resolve(new Uint8Array());
}, "collectBody");
var collectBodyString3 = /* @__PURE__ */ __name((streamBody, context) => collectBody3(streamBody, context).then((body) => context.utf8Encoder(body)), "collectBodyString");
var isSerializableHeaderValue = /* @__PURE__ */ __name((value) => value !== void 0 && value !== null && value !== "" && (!Object.getOwnPropertyNames(value).includes("length") || value.length != 0) && (!Object.getOwnPropertyNames(value).includes("size") || value.size != 0), "isSerializableHeaderValue");
var parseBody3 = /* @__PURE__ */ __name((streamBody, context) => collectBodyString3(streamBody, context).then((encoded) => {
  if (encoded.length) {
    return JSON.parse(encoded);
  }
  return {};
}), "parseBody");
var parseErrorBody3 = /* @__PURE__ */ __name(async (errorBody, context) => {
  const value = await parseBody3(errorBody, context);
  value.message = value.message ?? value.Message;
  return value;
}, "parseErrorBody");
var loadRestJsonErrorCode2 = /* @__PURE__ */ __name((output, data) => {
  const findKey = /* @__PURE__ */ __name((object, key) => Object.keys(object).find((k6) => k6.toLowerCase() === key.toLowerCase()), "findKey");
  const sanitizeErrorCode = /* @__PURE__ */ __name((rawValue) => {
    let cleanValue = rawValue;
    if (typeof cleanValue === "number") {
      cleanValue = cleanValue.toString();
    }
    if (cleanValue.indexOf(",") >= 0) {
      cleanValue = cleanValue.split(",")[0];
    }
    if (cleanValue.indexOf(":") >= 0) {
      cleanValue = cleanValue.split(":")[0];
    }
    if (cleanValue.indexOf("#") >= 0) {
      cleanValue = cleanValue.split("#")[1];
    }
    return cleanValue;
  }, "sanitizeErrorCode");
  const headerKey = findKey(output.headers, "x-amzn-errortype");
  if (headerKey !== void 0) {
    return sanitizeErrorCode(output.headers[headerKey]);
  }
  if (data.code !== void 0) {
    return sanitizeErrorCode(data.code);
  }
  if (data["__type"] !== void 0) {
    return sanitizeErrorCode(data["__type"]);
  }
}, "loadRestJsonErrorCode");

// node_modules/@aws-sdk/client-sso/dist-es/commands/GetRoleCredentialsCommand.js
var GetRoleCredentialsCommand = class extends Command {
  static getEndpointParameterInstructions() {
    return {
      UseFIPS: { type: "builtInParams", name: "useFipsEndpoint" },
      Endpoint: { type: "builtInParams", name: "endpoint" },
      Region: { type: "builtInParams", name: "region" },
      UseDualStack: { type: "builtInParams", name: "useDualstackEndpoint" }
    };
  }
  constructor(input) {
    super();
    this.input = input;
  }
  resolveMiddleware(clientStack, configuration, options) {
    this.middlewareStack.use(getSerdePlugin(configuration, this.serialize, this.deserialize));
    this.middlewareStack.use(getEndpointPlugin(configuration, GetRoleCredentialsCommand.getEndpointParameterInstructions()));
    const stack = clientStack.concat(this.middlewareStack);
    const { logger: logger2 } = configuration;
    const clientName = "SSOClient";
    const commandName = "GetRoleCredentialsCommand";
    const handlerExecutionContext = {
      logger: logger2,
      clientName,
      commandName,
      inputFilterSensitiveLog: GetRoleCredentialsRequestFilterSensitiveLog,
      outputFilterSensitiveLog: GetRoleCredentialsResponseFilterSensitiveLog
    };
    const { requestHandler } = configuration;
    return stack.resolve((request2) => requestHandler.handle(request2.request, options || {}), handlerExecutionContext);
  }
  serialize(input, context) {
    return se_GetRoleCredentialsCommand(input, context);
  }
  deserialize(output, context) {
    return de_GetRoleCredentialsCommand(output, context);
  }
};
__name(GetRoleCredentialsCommand, "GetRoleCredentialsCommand");

// node_modules/@aws-sdk/client-sso/dist-es/endpoint/EndpointParameters.js
var resolveClientEndpointParameters3 = /* @__PURE__ */ __name((options) => {
  return {
    ...options,
    useDualstackEndpoint: options.useDualstackEndpoint ?? false,
    useFipsEndpoint: options.useFipsEndpoint ?? false,
    defaultSigningName: "awsssoportal"
  };
}, "resolveClientEndpointParameters");

// node_modules/@aws-sdk/client-sso/package.json
var package_default3 = {
  name: "@aws-sdk/client-sso",
  description: "AWS SDK for JavaScript Sso Client for Node.js, Browser and React Native",
  version: "3.329.0",
  scripts: {
    build: "concurrently 'yarn:build:cjs' 'yarn:build:es' 'yarn:build:types'",
    "build:cjs": "tsc -p tsconfig.cjs.json",
    "build:docs": "typedoc",
    "build:es": "tsc -p tsconfig.es.json",
    "build:include:deps": "lerna run --scope $npm_package_name --include-dependencies build",
    "build:types": "tsc -p tsconfig.types.json",
    "build:types:downlevel": "downlevel-dts dist-types dist-types/ts3.4",
    clean: "rimraf ./dist-* && rimraf *.tsbuildinfo",
    "extract:docs": "api-extractor run --local",
    "generate:client": "node ../../scripts/generate-clients/single-service --solo sso"
  },
  main: "./dist-cjs/index.js",
  types: "./dist-types/index.d.ts",
  module: "./dist-es/index.js",
  sideEffects: false,
  dependencies: {
    "@aws-crypto/sha256-browser": "3.0.0",
    "@aws-crypto/sha256-js": "3.0.0",
    "@aws-sdk/config-resolver": "3.329.0",
    "@aws-sdk/fetch-http-handler": "3.329.0",
    "@aws-sdk/hash-node": "3.329.0",
    "@aws-sdk/invalid-dependency": "3.329.0",
    "@aws-sdk/middleware-content-length": "3.329.0",
    "@aws-sdk/middleware-endpoint": "3.329.0",
    "@aws-sdk/middleware-host-header": "3.329.0",
    "@aws-sdk/middleware-logger": "3.329.0",
    "@aws-sdk/middleware-recursion-detection": "3.329.0",
    "@aws-sdk/middleware-retry": "3.329.0",
    "@aws-sdk/middleware-serde": "3.329.0",
    "@aws-sdk/middleware-stack": "3.329.0",
    "@aws-sdk/middleware-user-agent": "3.329.0",
    "@aws-sdk/node-config-provider": "3.329.0",
    "@aws-sdk/node-http-handler": "3.329.0",
    "@aws-sdk/protocol-http": "3.329.0",
    "@aws-sdk/smithy-client": "3.329.0",
    "@aws-sdk/types": "3.329.0",
    "@aws-sdk/url-parser": "3.329.0",
    "@aws-sdk/util-base64": "3.310.0",
    "@aws-sdk/util-body-length-browser": "3.310.0",
    "@aws-sdk/util-body-length-node": "3.310.0",
    "@aws-sdk/util-defaults-mode-browser": "3.329.0",
    "@aws-sdk/util-defaults-mode-node": "3.329.0",
    "@aws-sdk/util-endpoints": "3.329.0",
    "@aws-sdk/util-retry": "3.329.0",
    "@aws-sdk/util-user-agent-browser": "3.329.0",
    "@aws-sdk/util-user-agent-node": "3.329.0",
    "@aws-sdk/util-utf8": "3.310.0",
    tslib: "^2.5.0"
  },
  devDependencies: {
    "@aws-sdk/service-client-documentation-generator": "3.310.0",
    "@tsconfig/node14": "1.0.3",
    "@types/node": "^14.14.31",
    concurrently: "7.0.0",
    "downlevel-dts": "0.10.1",
    rimraf: "3.0.2",
    typedoc: "0.23.23",
    typescript: "~4.9.5"
  },
  engines: {
    node: ">=14.0.0"
  },
  typesVersions: {
    "<4.0": {
      "dist-types/*": [
        "dist-types/ts3.4/*"
      ]
    }
  },
  files: [
    "dist-*/**"
  ],
  author: {
    name: "AWS SDK for JavaScript Team",
    url: "https://aws.amazon.com/javascript/"
  },
  license: "Apache-2.0",
  browser: {
    "./dist-es/runtimeConfig": "./dist-es/runtimeConfig.browser"
  },
  "react-native": {
    "./dist-es/runtimeConfig": "./dist-es/runtimeConfig.native"
  },
  homepage: "https://github.com/aws/aws-sdk-js-v3/tree/main/clients/client-sso",
  repository: {
    type: "git",
    url: "https://github.com/aws/aws-sdk-js-v3.git",
    directory: "clients/client-sso"
  }
};

// node_modules/@aws-sdk/hash-node/dist-es/index.js
import { Buffer as Buffer4 } from "buffer";
import { createHash as createHash2, createHmac } from "crypto";
var Hash = class {
  constructor(algorithmIdentifier, secret) {
    this.algorithmIdentifier = algorithmIdentifier;
    this.secret = secret;
    this.reset();
  }
  update(toHash, encoding) {
    this.hash.update(toUint8Array(castSourceData(toHash, encoding)));
  }
  digest() {
    return Promise.resolve(this.hash.digest());
  }
  reset() {
    this.hash = this.secret ? createHmac(this.algorithmIdentifier, castSourceData(this.secret)) : createHash2(this.algorithmIdentifier);
  }
};
__name(Hash, "Hash");
function castSourceData(toCast, encoding) {
  if (Buffer4.isBuffer(toCast)) {
    return toCast;
  }
  if (typeof toCast === "string") {
    return fromString(toCast, encoding);
  }
  if (ArrayBuffer.isView(toCast)) {
    return fromArrayBuffer(toCast.buffer, toCast.byteOffset, toCast.byteLength);
  }
  return fromArrayBuffer(toCast);
}
__name(castSourceData, "castSourceData");

// node_modules/@aws-sdk/querystring-builder/dist-es/index.js
function buildQueryString(query) {
  const parts = [];
  for (let key of Object.keys(query).sort()) {
    const value = query[key];
    key = escapeUri(key);
    if (Array.isArray(value)) {
      for (let i6 = 0, iLen = value.length; i6 < iLen; i6++) {
        parts.push(`${key}=${escapeUri(value[i6])}`);
      }
    } else {
      let qsEntry = key;
      if (value || typeof value === "string") {
        qsEntry += `=${escapeUri(value)}`;
      }
      parts.push(qsEntry);
    }
  }
  return parts.join("&");
}
__name(buildQueryString, "buildQueryString");

// node_modules/@aws-sdk/node-http-handler/dist-es/node-http-handler.js
import { Agent as hAgent, request as hRequest } from "http";
import { Agent as hsAgent, request as hsRequest } from "https";

// node_modules/@aws-sdk/node-http-handler/dist-es/constants.js
var NODEJS_TIMEOUT_ERROR_CODES2 = ["ECONNRESET", "EPIPE", "ETIMEDOUT"];

// node_modules/@aws-sdk/node-http-handler/dist-es/get-transformed-headers.js
var getTransformedHeaders = /* @__PURE__ */ __name((headers) => {
  const transformedHeaders = {};
  for (const name of Object.keys(headers)) {
    const headerValues = headers[name];
    transformedHeaders[name] = Array.isArray(headerValues) ? headerValues.join(",") : headerValues;
  }
  return transformedHeaders;
}, "getTransformedHeaders");

// node_modules/@aws-sdk/node-http-handler/dist-es/set-connection-timeout.js
var setConnectionTimeout = /* @__PURE__ */ __name((request2, reject, timeoutInMs = 0) => {
  if (!timeoutInMs) {
    return;
  }
  request2.on("socket", (socket) => {
    if (socket.connecting) {
      const timeoutId = setTimeout(() => {
        request2.destroy();
        reject(Object.assign(new Error(`Socket timed out without establishing a connection within ${timeoutInMs} ms`), {
          name: "TimeoutError"
        }));
      }, timeoutInMs);
      socket.on("connect", () => {
        clearTimeout(timeoutId);
      });
    }
  });
}, "setConnectionTimeout");

// node_modules/@aws-sdk/node-http-handler/dist-es/set-socket-timeout.js
var setSocketTimeout = /* @__PURE__ */ __name((request2, reject, timeoutInMs = 0) => {
  request2.setTimeout(timeoutInMs, () => {
    request2.destroy();
    reject(Object.assign(new Error(`Connection timed out after ${timeoutInMs} ms`), { name: "TimeoutError" }));
  });
}, "setSocketTimeout");

// node_modules/@aws-sdk/node-http-handler/dist-es/write-request-body.js
import { Readable } from "stream";
function writeRequestBody(httpRequest2, request2) {
  const expect = request2.headers["Expect"] || request2.headers["expect"];
  if (expect === "100-continue") {
    httpRequest2.on("continue", () => {
      writeBody(httpRequest2, request2.body);
    });
  } else {
    writeBody(httpRequest2, request2.body);
  }
}
__name(writeRequestBody, "writeRequestBody");
function writeBody(httpRequest2, body) {
  if (body instanceof Readable) {
    body.pipe(httpRequest2);
  } else if (body) {
    httpRequest2.end(Buffer.from(body));
  } else {
    httpRequest2.end();
  }
}
__name(writeBody, "writeBody");

// node_modules/@aws-sdk/node-http-handler/dist-es/set-socket-keep-alive.js
var setSocketKeepAlive = /* @__PURE__ */ __name((request2, { keepAlive, keepAliveMsecs }) => {
  if (keepAlive !== true) {
    return;
  }
  request2.on("socket", (socket) => {
    socket.setKeepAlive(keepAlive, keepAliveMsecs || 0);
  });
}, "setSocketKeepAlive");

// node_modules/@aws-sdk/node-http-handler/dist-es/node-http-handler.js
var NodeHttpHandler = class {
  constructor(options) {
    this.metadata = { handlerProtocol: "http/1.1" };
    this.configProvider = new Promise((resolve, reject) => {
      if (typeof options === "function") {
        options().then((_options) => {
          resolve(this.resolveDefaultConfig(_options));
        }).catch(reject);
      } else {
        resolve(this.resolveDefaultConfig(options));
      }
    });
  }
  resolveDefaultConfig(options) {
    const { requestTimeout, connectionTimeout, socketTimeout, httpAgent, httpsAgent } = options || {};
    const keepAlive = true;
    const maxSockets = 50;
    return {
      connectionTimeout,
      requestTimeout: requestTimeout ?? socketTimeout,
      httpAgent: httpAgent || new hAgent({ keepAlive, maxSockets }),
      httpsAgent: httpsAgent || new hsAgent({ keepAlive, maxSockets })
    };
  }
  destroy() {
    this.config?.httpAgent?.destroy();
    this.config?.httpsAgent?.destroy();
  }
  async handle(request2, { abortSignal } = {}) {
    if (!this.config) {
      this.config = await this.configProvider;
    }
    return new Promise((resolve, reject) => {
      if (!this.config) {
        throw new Error("Node HTTP request handler config is not resolved");
      }
      if (abortSignal?.aborted) {
        const abortError = new Error("Request aborted");
        abortError.name = "AbortError";
        reject(abortError);
        return;
      }
      const isSSL = request2.protocol === "https:";
      const queryString = buildQueryString(request2.query || {});
      const nodeHttpsOptions = {
        headers: request2.headers,
        host: request2.hostname,
        method: request2.method,
        path: queryString ? `${request2.path}?${queryString}` : request2.path,
        port: request2.port,
        agent: isSSL ? this.config.httpsAgent : this.config.httpAgent
      };
      const requestFunc = isSSL ? hsRequest : hRequest;
      const req = requestFunc(nodeHttpsOptions, (res) => {
        const httpResponse = new HttpResponse({
          statusCode: res.statusCode || -1,
          headers: getTransformedHeaders(res.headers),
          body: res
        });
        resolve({ response: httpResponse });
      });
      req.on("error", (err) => {
        if (NODEJS_TIMEOUT_ERROR_CODES2.includes(err.code)) {
          reject(Object.assign(err, { name: "TimeoutError" }));
        } else {
          reject(err);
        }
      });
      setConnectionTimeout(req, reject, this.config.connectionTimeout);
      setSocketTimeout(req, reject, this.config.requestTimeout);
      if (abortSignal) {
        abortSignal.onabort = () => {
          req.abort();
          const abortError = new Error("Request aborted");
          abortError.name = "AbortError";
          reject(abortError);
        };
      }
      const httpAgent = nodeHttpsOptions.agent;
      if (typeof httpAgent === "object" && "keepAlive" in httpAgent) {
        setSocketKeepAlive(req, {
          keepAlive: httpAgent.keepAlive,
          keepAliveMsecs: httpAgent.keepAliveMsecs
        });
      }
      writeRequestBody(req, request2);
    });
  }
};
__name(NodeHttpHandler, "NodeHttpHandler");

// node_modules/@aws-sdk/node-http-handler/dist-es/node-http2-connection-pool.js
var NodeHttp2ConnectionPool = class {
  constructor(sessions) {
    this.sessions = [];
    this.sessions = sessions ?? [];
  }
  poll() {
    if (this.sessions.length > 0) {
      return this.sessions.shift();
    }
  }
  offerLast(session) {
    this.sessions.push(session);
  }
  contains(session) {
    return this.sessions.includes(session);
  }
  remove(session) {
    this.sessions = this.sessions.filter((s6) => s6 !== session);
  }
  [Symbol.iterator]() {
    return this.sessions[Symbol.iterator]();
  }
  destroy(connection) {
    for (const session of this.sessions) {
      if (session === connection) {
        if (!session.destroyed) {
          session.destroy();
        }
      }
    }
  }
};
__name(NodeHttp2ConnectionPool, "NodeHttp2ConnectionPool");

// node_modules/@aws-sdk/node-http-handler/dist-es/stream-collector/collector.js
import { Writable } from "stream";
var Collector = class extends Writable {
  constructor() {
    super(...arguments);
    this.bufferedBytes = [];
  }
  _write(chunk, encoding, callback) {
    this.bufferedBytes.push(chunk);
    callback();
  }
};
__name(Collector, "Collector");

// node_modules/@aws-sdk/node-http-handler/dist-es/stream-collector/index.js
var streamCollector = /* @__PURE__ */ __name((stream) => new Promise((resolve, reject) => {
  const collector = new Collector();
  stream.pipe(collector);
  stream.on("error", (err) => {
    collector.end();
    reject(err);
  });
  collector.on("error", reject);
  collector.on("finish", function() {
    const bytes = new Uint8Array(Buffer.concat(this.bufferedBytes));
    resolve(bytes);
  });
}), "streamCollector");

// node_modules/@aws-sdk/util-body-length-node/dist-es/calculateBodyLength.js
import { fstatSync, lstatSync } from "fs";
var calculateBodyLength = /* @__PURE__ */ __name((body) => {
  if (!body) {
    return 0;
  }
  if (typeof body === "string") {
    return Buffer.from(body).length;
  } else if (typeof body.byteLength === "number") {
    return body.byteLength;
  } else if (typeof body.size === "number") {
    return body.size;
  } else if (typeof body.path === "string" || Buffer.isBuffer(body.path)) {
    return lstatSync(body.path).size;
  } else if (typeof body.fd === "number") {
    return fstatSync(body.fd).size;
  }
  throw new Error(`Body Length computation failed for ${body}`);
}, "calculateBodyLength");

// node_modules/@aws-sdk/util-user-agent-node/dist-es/index.js
import { platform, release } from "os";
import { env, versions } from "process";

// node_modules/@aws-sdk/util-user-agent-node/dist-es/is-crt-available.js
var isCrtAvailable = /* @__PURE__ */ __name(() => {
  try {
    if (typeof __require === "function" && typeof module !== "undefined" && require_dist()) {
      return ["md/crt-avail"];
    }
    return null;
  } catch (e6) {
    return null;
  }
}, "isCrtAvailable");

// node_modules/@aws-sdk/util-user-agent-node/dist-es/index.js
var UA_APP_ID_ENV_NAME = "AWS_SDK_UA_APP_ID";
var UA_APP_ID_INI_NAME = "sdk-ua-app-id";
var defaultUserAgent = /* @__PURE__ */ __name(({ serviceId, clientVersion }) => {
  const sections = [
    ["aws-sdk-js", clientVersion],
    [`os/${platform()}`, release()],
    ["lang/js"],
    ["md/nodejs", `${versions.node}`]
  ];
  const crtAvailable = isCrtAvailable();
  if (crtAvailable) {
    sections.push(crtAvailable);
  }
  if (serviceId) {
    sections.push([`api/${serviceId}`, clientVersion]);
  }
  if (env.AWS_EXECUTION_ENV) {
    sections.push([`exec-env/${env.AWS_EXECUTION_ENV}`]);
  }
  const appIdPromise = loadConfig({
    environmentVariableSelector: (env2) => env2[UA_APP_ID_ENV_NAME],
    configFileSelector: (profile) => profile[UA_APP_ID_INI_NAME],
    default: void 0
  })();
  let resolvedUserAgent = void 0;
  return async () => {
    if (!resolvedUserAgent) {
      const appId = await appIdPromise;
      resolvedUserAgent = appId ? [...sections, [`app/${appId}`]] : [...sections];
    }
    return resolvedUserAgent;
  };
}, "defaultUserAgent");

// node_modules/@aws-sdk/util-base64/dist-es/fromBase64.js
var BASE64_REGEX = /^[A-Za-z0-9+/]*={0,2}$/;
var fromBase64 = /* @__PURE__ */ __name((input) => {
  if (input.length * 3 % 4 !== 0) {
    throw new TypeError(`Incorrect padding on base64 string.`);
  }
  if (!BASE64_REGEX.exec(input)) {
    throw new TypeError(`Invalid base64 string.`);
  }
  const buffer = fromString(input, "base64");
  return new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength);
}, "fromBase64");

// node_modules/@aws-sdk/util-base64/dist-es/toBase64.js
var toBase64 = /* @__PURE__ */ __name((input) => fromArrayBuffer(input.buffer, input.byteOffset, input.byteLength).toString("base64"), "toBase64");

// node_modules/@aws-sdk/client-sso/dist-es/endpoint/ruleset.js
var p = "required";
var q = "fn";
var r = "argv";
var s = "ref";
var a = "PartitionResult";
var b = "tree";
var c = "error";
var d = "endpoint";
var e = { [p]: false, "type": "String" };
var f = { [p]: true, "default": false, "type": "Boolean" };
var g = { [s]: "Endpoint" };
var h = { [q]: "booleanEquals", [r]: [{ [s]: "UseFIPS" }, true] };
var i = { [q]: "booleanEquals", [r]: [{ [s]: "UseDualStack" }, true] };
var j = {};
var k = { [q]: "booleanEquals", [r]: [true, { [q]: "getAttr", [r]: [{ [s]: a }, "supportsFIPS"] }] };
var l = { [q]: "booleanEquals", [r]: [true, { [q]: "getAttr", [r]: [{ [s]: a }, "supportsDualStack"] }] };
var m = [g];
var n = [h];
var o = [i];
var _data = { version: "1.0", parameters: { Region: e, UseDualStack: f, UseFIPS: f, Endpoint: e }, rules: [{ conditions: [{ [q]: "aws.partition", [r]: [{ [s]: "Region" }], assign: a }], type: b, rules: [{ conditions: [{ [q]: "isSet", [r]: m }, { [q]: "parseURL", [r]: m, assign: "url" }], type: b, rules: [{ conditions: n, error: "Invalid Configuration: FIPS and custom endpoint are not supported", type: c }, { type: b, rules: [{ conditions: o, error: "Invalid Configuration: Dualstack and custom endpoint are not supported", type: c }, { endpoint: { url: g, properties: j, headers: j }, type: d }] }] }, { conditions: [h, i], type: b, rules: [{ conditions: [k, l], type: b, rules: [{ endpoint: { url: "https://portal.sso-fips.{Region}.{PartitionResult#dualStackDnsSuffix}", properties: j, headers: j }, type: d }] }, { error: "FIPS and DualStack are enabled, but this partition does not support one or both", type: c }] }, { conditions: n, type: b, rules: [{ conditions: [k], type: b, rules: [{ type: b, rules: [{ endpoint: { url: "https://portal.sso-fips.{Region}.{PartitionResult#dnsSuffix}", properties: j, headers: j }, type: d }] }] }, { error: "FIPS is enabled but this partition does not support FIPS", type: c }] }, { conditions: o, type: b, rules: [{ conditions: [l], type: b, rules: [{ endpoint: { url: "https://portal.sso.{Region}.{PartitionResult#dualStackDnsSuffix}", properties: j, headers: j }, type: d }] }, { error: "DualStack is enabled but this partition does not support DualStack", type: c }] }, { endpoint: { url: "https://portal.sso.{Region}.{PartitionResult#dnsSuffix}", properties: j, headers: j }, type: d }] }] };
var ruleSet = _data;

// node_modules/@aws-sdk/client-sso/dist-es/endpoint/endpointResolver.js
var defaultEndpointResolver = /* @__PURE__ */ __name((endpointParams, context = {}) => {
  return resolveEndpoint(ruleSet, {
    endpointParams,
    logger: context.logger
  });
}, "defaultEndpointResolver");

// node_modules/@aws-sdk/client-sso/dist-es/runtimeConfig.shared.js
var getRuntimeConfig = /* @__PURE__ */ __name((config) => ({
  apiVersion: "2019-06-10",
  base64Decoder: config?.base64Decoder ?? fromBase64,
  base64Encoder: config?.base64Encoder ?? toBase64,
  disableHostPrefix: config?.disableHostPrefix ?? false,
  endpointProvider: config?.endpointProvider ?? defaultEndpointResolver,
  logger: config?.logger ?? new NoOpLogger(),
  serviceId: config?.serviceId ?? "SSO",
  urlParser: config?.urlParser ?? parseUrl,
  utf8Decoder: config?.utf8Decoder ?? fromUtf8,
  utf8Encoder: config?.utf8Encoder ?? toUtf8
}), "getRuntimeConfig");

// node_modules/@aws-sdk/util-defaults-mode-node/dist-es/constants.js
var AWS_EXECUTION_ENV = "AWS_EXECUTION_ENV";
var AWS_REGION_ENV = "AWS_REGION";
var AWS_DEFAULT_REGION_ENV = "AWS_DEFAULT_REGION";
var ENV_IMDS_DISABLED = "AWS_EC2_METADATA_DISABLED";
var DEFAULTS_MODE_OPTIONS = ["in-region", "cross-region", "mobile", "standard", "legacy"];
var IMDS_REGION_PATH = "/latest/meta-data/placement/region";

// node_modules/@aws-sdk/util-defaults-mode-node/dist-es/defaultsModeConfig.js
var AWS_DEFAULTS_MODE_ENV = "AWS_DEFAULTS_MODE";
var AWS_DEFAULTS_MODE_CONFIG = "defaults_mode";
var NODE_DEFAULTS_MODE_CONFIG_OPTIONS = {
  environmentVariableSelector: (env2) => {
    return env2[AWS_DEFAULTS_MODE_ENV];
  },
  configFileSelector: (profile) => {
    return profile[AWS_DEFAULTS_MODE_CONFIG];
  },
  default: "legacy"
};

// node_modules/@aws-sdk/util-defaults-mode-node/dist-es/resolveDefaultsModeConfig.js
var resolveDefaultsModeConfig = /* @__PURE__ */ __name(({ region = loadConfig(NODE_REGION_CONFIG_OPTIONS), defaultsMode = loadConfig(NODE_DEFAULTS_MODE_CONFIG_OPTIONS) } = {}) => memoize(async () => {
  const mode = typeof defaultsMode === "function" ? await defaultsMode() : defaultsMode;
  switch (mode?.toLowerCase()) {
    case "auto":
      return resolveNodeDefaultsModeAuto(region);
    case "in-region":
    case "cross-region":
    case "mobile":
    case "standard":
    case "legacy":
      return Promise.resolve(mode?.toLocaleLowerCase());
    case void 0:
      return Promise.resolve("legacy");
    default:
      throw new Error(`Invalid parameter for "defaultsMode", expect ${DEFAULTS_MODE_OPTIONS.join(", ")}, got ${mode}`);
  }
}), "resolveDefaultsModeConfig");
var resolveNodeDefaultsModeAuto = /* @__PURE__ */ __name(async (clientRegion) => {
  if (clientRegion) {
    const resolvedRegion = typeof clientRegion === "function" ? await clientRegion() : clientRegion;
    const inferredRegion = await inferPhysicalRegion();
    if (!inferredRegion) {
      return "standard";
    }
    if (resolvedRegion === inferredRegion) {
      return "in-region";
    } else {
      return "cross-region";
    }
  }
  return "standard";
}, "resolveNodeDefaultsModeAuto");
var inferPhysicalRegion = /* @__PURE__ */ __name(async () => {
  if (process.env[AWS_EXECUTION_ENV] && (process.env[AWS_REGION_ENV] || process.env[AWS_DEFAULT_REGION_ENV])) {
    return process.env[AWS_REGION_ENV] ?? process.env[AWS_DEFAULT_REGION_ENV];
  }
  if (!process.env[ENV_IMDS_DISABLED]) {
    try {
      const endpoint = await getInstanceMetadataEndpoint();
      return (await httpRequest({ ...endpoint, path: IMDS_REGION_PATH })).toString();
    } catch (e6) {
    }
  }
}, "inferPhysicalRegion");

// node_modules/@aws-sdk/client-sso/dist-es/runtimeConfig.js
var getRuntimeConfig2 = /* @__PURE__ */ __name((config) => {
  emitWarningIfUnsupportedVersion(process.version);
  const defaultsMode = resolveDefaultsModeConfig(config);
  const defaultConfigProvider = /* @__PURE__ */ __name(() => defaultsMode().then(loadConfigsForDefaultMode), "defaultConfigProvider");
  const clientSharedValues = getRuntimeConfig(config);
  return {
    ...clientSharedValues,
    ...config,
    runtime: "node",
    defaultsMode,
    bodyLengthChecker: config?.bodyLengthChecker ?? calculateBodyLength,
    defaultUserAgentProvider: config?.defaultUserAgentProvider ?? defaultUserAgent({ serviceId: clientSharedValues.serviceId, clientVersion: package_default3.version }),
    maxAttempts: config?.maxAttempts ?? loadConfig(NODE_MAX_ATTEMPT_CONFIG_OPTIONS),
    region: config?.region ?? loadConfig(NODE_REGION_CONFIG_OPTIONS, NODE_REGION_CONFIG_FILE_OPTIONS),
    requestHandler: config?.requestHandler ?? new NodeHttpHandler(defaultConfigProvider),
    retryMode: config?.retryMode ?? loadConfig({
      ...NODE_RETRY_MODE_CONFIG_OPTIONS,
      default: async () => (await defaultConfigProvider()).retryMode || DEFAULT_RETRY_MODE
    }),
    sha256: config?.sha256 ?? Hash.bind(null, "sha256"),
    streamCollector: config?.streamCollector ?? streamCollector,
    useDualstackEndpoint: config?.useDualstackEndpoint ?? loadConfig(NODE_USE_DUALSTACK_ENDPOINT_CONFIG_OPTIONS),
    useFipsEndpoint: config?.useFipsEndpoint ?? loadConfig(NODE_USE_FIPS_ENDPOINT_CONFIG_OPTIONS)
  };
}, "getRuntimeConfig");

// node_modules/@aws-sdk/client-sso/dist-es/SSOClient.js
var SSOClient = class extends Client {
  constructor(configuration) {
    const _config_0 = getRuntimeConfig2(configuration);
    const _config_1 = resolveClientEndpointParameters3(_config_0);
    const _config_2 = resolveRegionConfig(_config_1);
    const _config_3 = resolveEndpointConfig(_config_2);
    const _config_4 = resolveRetryConfig(_config_3);
    const _config_5 = resolveHostHeaderConfig(_config_4);
    const _config_6 = resolveUserAgentConfig(_config_5);
    super(_config_6);
    this.config = _config_6;
    this.middlewareStack.use(getRetryPlugin(this.config));
    this.middlewareStack.use(getContentLengthPlugin(this.config));
    this.middlewareStack.use(getHostHeaderPlugin(this.config));
    this.middlewareStack.use(getLoggerPlugin(this.config));
    this.middlewareStack.use(getRecursionDetectionPlugin(this.config));
    this.middlewareStack.use(getUserAgentPlugin(this.config));
  }
  destroy() {
    super.destroy();
  }
};
__name(SSOClient, "SSOClient");

// node_modules/@aws-sdk/token-providers/dist-es/constants.js
var EXPIRE_WINDOW_MS = 5 * 60 * 1e3;
var REFRESH_MESSAGE = `To refresh this SSO session run 'aws sso login' with the corresponding profile.`;

// node_modules/@aws-sdk/client-sso-oidc/dist-es/models/SSOOIDCServiceException.js
var SSOOIDCServiceException = class extends ServiceException {
  constructor(options) {
    super(options);
    Object.setPrototypeOf(this, SSOOIDCServiceException.prototype);
  }
};
__name(SSOOIDCServiceException, "SSOOIDCServiceException");

// node_modules/@aws-sdk/client-sso-oidc/dist-es/models/models_0.js
var AccessDeniedException = class extends SSOOIDCServiceException {
  constructor(opts) {
    super({
      name: "AccessDeniedException",
      $fault: "client",
      ...opts
    });
    this.name = "AccessDeniedException";
    this.$fault = "client";
    Object.setPrototypeOf(this, AccessDeniedException.prototype);
    this.error = opts.error;
    this.error_description = opts.error_description;
  }
};
__name(AccessDeniedException, "AccessDeniedException");
var AuthorizationPendingException = class extends SSOOIDCServiceException {
  constructor(opts) {
    super({
      name: "AuthorizationPendingException",
      $fault: "client",
      ...opts
    });
    this.name = "AuthorizationPendingException";
    this.$fault = "client";
    Object.setPrototypeOf(this, AuthorizationPendingException.prototype);
    this.error = opts.error;
    this.error_description = opts.error_description;
  }
};
__name(AuthorizationPendingException, "AuthorizationPendingException");
var ExpiredTokenException2 = class extends SSOOIDCServiceException {
  constructor(opts) {
    super({
      name: "ExpiredTokenException",
      $fault: "client",
      ...opts
    });
    this.name = "ExpiredTokenException";
    this.$fault = "client";
    Object.setPrototypeOf(this, ExpiredTokenException2.prototype);
    this.error = opts.error;
    this.error_description = opts.error_description;
  }
};
__name(ExpiredTokenException2, "ExpiredTokenException");
var InternalServerException = class extends SSOOIDCServiceException {
  constructor(opts) {
    super({
      name: "InternalServerException",
      $fault: "server",
      ...opts
    });
    this.name = "InternalServerException";
    this.$fault = "server";
    Object.setPrototypeOf(this, InternalServerException.prototype);
    this.error = opts.error;
    this.error_description = opts.error_description;
  }
};
__name(InternalServerException, "InternalServerException");
var InvalidClientException = class extends SSOOIDCServiceException {
  constructor(opts) {
    super({
      name: "InvalidClientException",
      $fault: "client",
      ...opts
    });
    this.name = "InvalidClientException";
    this.$fault = "client";
    Object.setPrototypeOf(this, InvalidClientException.prototype);
    this.error = opts.error;
    this.error_description = opts.error_description;
  }
};
__name(InvalidClientException, "InvalidClientException");
var InvalidGrantException = class extends SSOOIDCServiceException {
  constructor(opts) {
    super({
      name: "InvalidGrantException",
      $fault: "client",
      ...opts
    });
    this.name = "InvalidGrantException";
    this.$fault = "client";
    Object.setPrototypeOf(this, InvalidGrantException.prototype);
    this.error = opts.error;
    this.error_description = opts.error_description;
  }
};
__name(InvalidGrantException, "InvalidGrantException");
var InvalidRequestException2 = class extends SSOOIDCServiceException {
  constructor(opts) {
    super({
      name: "InvalidRequestException",
      $fault: "client",
      ...opts
    });
    this.name = "InvalidRequestException";
    this.$fault = "client";
    Object.setPrototypeOf(this, InvalidRequestException2.prototype);
    this.error = opts.error;
    this.error_description = opts.error_description;
  }
};
__name(InvalidRequestException2, "InvalidRequestException");
var InvalidScopeException = class extends SSOOIDCServiceException {
  constructor(opts) {
    super({
      name: "InvalidScopeException",
      $fault: "client",
      ...opts
    });
    this.name = "InvalidScopeException";
    this.$fault = "client";
    Object.setPrototypeOf(this, InvalidScopeException.prototype);
    this.error = opts.error;
    this.error_description = opts.error_description;
  }
};
__name(InvalidScopeException, "InvalidScopeException");
var SlowDownException = class extends SSOOIDCServiceException {
  constructor(opts) {
    super({
      name: "SlowDownException",
      $fault: "client",
      ...opts
    });
    this.name = "SlowDownException";
    this.$fault = "client";
    Object.setPrototypeOf(this, SlowDownException.prototype);
    this.error = opts.error;
    this.error_description = opts.error_description;
  }
};
__name(SlowDownException, "SlowDownException");
var UnauthorizedClientException = class extends SSOOIDCServiceException {
  constructor(opts) {
    super({
      name: "UnauthorizedClientException",
      $fault: "client",
      ...opts
    });
    this.name = "UnauthorizedClientException";
    this.$fault = "client";
    Object.setPrototypeOf(this, UnauthorizedClientException.prototype);
    this.error = opts.error;
    this.error_description = opts.error_description;
  }
};
__name(UnauthorizedClientException, "UnauthorizedClientException");
var UnsupportedGrantTypeException = class extends SSOOIDCServiceException {
  constructor(opts) {
    super({
      name: "UnsupportedGrantTypeException",
      $fault: "client",
      ...opts
    });
    this.name = "UnsupportedGrantTypeException";
    this.$fault = "client";
    Object.setPrototypeOf(this, UnsupportedGrantTypeException.prototype);
    this.error = opts.error;
    this.error_description = opts.error_description;
  }
};
__name(UnsupportedGrantTypeException, "UnsupportedGrantTypeException");

// node_modules/@aws-sdk/client-sso-oidc/dist-es/protocols/Aws_restJson1.js
var se_CreateTokenCommand = /* @__PURE__ */ __name(async (input, context) => {
  const { hostname, protocol = "https", port, path: basePath } = await context.endpoint();
  const headers = {
    "content-type": "application/json"
  };
  const resolvedPath = `${basePath?.endsWith("/") ? basePath.slice(0, -1) : basePath || ""}/token`;
  let body;
  body = JSON.stringify(take(input, {
    clientId: [],
    clientSecret: [],
    code: [],
    deviceCode: [],
    grantType: [],
    redirectUri: [],
    refreshToken: [],
    scope: (_) => _json(_)
  }));
  return new HttpRequest({
    protocol,
    hostname,
    port,
    method: "POST",
    headers,
    path: resolvedPath,
    body
  });
}, "se_CreateTokenCommand");
var de_CreateTokenCommand = /* @__PURE__ */ __name(async (output, context) => {
  if (output.statusCode !== 200 && output.statusCode >= 300) {
    return de_CreateTokenCommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata5(output)
  });
  const data = expectNonNull(expectObject(await parseBody4(output.body, context)), "body");
  const doc = take(data, {
    accessToken: expectString,
    expiresIn: expectInt32,
    idToken: expectString,
    refreshToken: expectString,
    tokenType: expectString
  });
  Object.assign(contents, doc);
  return contents;
}, "de_CreateTokenCommand");
var de_CreateTokenCommandError = /* @__PURE__ */ __name(async (output, context) => {
  const parsedOutput = {
    ...output,
    body: await parseErrorBody4(output.body, context)
  };
  const errorCode = loadRestJsonErrorCode3(output, parsedOutput.body);
  switch (errorCode) {
    case "AccessDeniedException":
    case "com.amazonaws.ssooidc#AccessDeniedException":
      throw await de_AccessDeniedExceptionRes(parsedOutput, context);
    case "AuthorizationPendingException":
    case "com.amazonaws.ssooidc#AuthorizationPendingException":
      throw await de_AuthorizationPendingExceptionRes(parsedOutput, context);
    case "ExpiredTokenException":
    case "com.amazonaws.ssooidc#ExpiredTokenException":
      throw await de_ExpiredTokenExceptionRes2(parsedOutput, context);
    case "InternalServerException":
    case "com.amazonaws.ssooidc#InternalServerException":
      throw await de_InternalServerExceptionRes(parsedOutput, context);
    case "InvalidClientException":
    case "com.amazonaws.ssooidc#InvalidClientException":
      throw await de_InvalidClientExceptionRes(parsedOutput, context);
    case "InvalidGrantException":
    case "com.amazonaws.ssooidc#InvalidGrantException":
      throw await de_InvalidGrantExceptionRes(parsedOutput, context);
    case "InvalidRequestException":
    case "com.amazonaws.ssooidc#InvalidRequestException":
      throw await de_InvalidRequestExceptionRes2(parsedOutput, context);
    case "InvalidScopeException":
    case "com.amazonaws.ssooidc#InvalidScopeException":
      throw await de_InvalidScopeExceptionRes(parsedOutput, context);
    case "SlowDownException":
    case "com.amazonaws.ssooidc#SlowDownException":
      throw await de_SlowDownExceptionRes(parsedOutput, context);
    case "UnauthorizedClientException":
    case "com.amazonaws.ssooidc#UnauthorizedClientException":
      throw await de_UnauthorizedClientExceptionRes(parsedOutput, context);
    case "UnsupportedGrantTypeException":
    case "com.amazonaws.ssooidc#UnsupportedGrantTypeException":
      throw await de_UnsupportedGrantTypeExceptionRes(parsedOutput, context);
    default:
      const parsedBody = parsedOutput.body;
      return throwDefaultError5({
        output,
        parsedBody,
        errorCode
      });
  }
}, "de_CreateTokenCommandError");
var throwDefaultError5 = withBaseException(SSOOIDCServiceException);
var de_AccessDeniedExceptionRes = /* @__PURE__ */ __name(async (parsedOutput, context) => {
  const contents = map({});
  const data = parsedOutput.body;
  const doc = take(data, {
    error: expectString,
    error_description: expectString
  });
  Object.assign(contents, doc);
  const exception = new AccessDeniedException({
    $metadata: deserializeMetadata5(parsedOutput),
    ...contents
  });
  return decorateServiceException(exception, parsedOutput.body);
}, "de_AccessDeniedExceptionRes");
var de_AuthorizationPendingExceptionRes = /* @__PURE__ */ __name(async (parsedOutput, context) => {
  const contents = map({});
  const data = parsedOutput.body;
  const doc = take(data, {
    error: expectString,
    error_description: expectString
  });
  Object.assign(contents, doc);
  const exception = new AuthorizationPendingException({
    $metadata: deserializeMetadata5(parsedOutput),
    ...contents
  });
  return decorateServiceException(exception, parsedOutput.body);
}, "de_AuthorizationPendingExceptionRes");
var de_ExpiredTokenExceptionRes2 = /* @__PURE__ */ __name(async (parsedOutput, context) => {
  const contents = map({});
  const data = parsedOutput.body;
  const doc = take(data, {
    error: expectString,
    error_description: expectString
  });
  Object.assign(contents, doc);
  const exception = new ExpiredTokenException2({
    $metadata: deserializeMetadata5(parsedOutput),
    ...contents
  });
  return decorateServiceException(exception, parsedOutput.body);
}, "de_ExpiredTokenExceptionRes");
var de_InternalServerExceptionRes = /* @__PURE__ */ __name(async (parsedOutput, context) => {
  const contents = map({});
  const data = parsedOutput.body;
  const doc = take(data, {
    error: expectString,
    error_description: expectString
  });
  Object.assign(contents, doc);
  const exception = new InternalServerException({
    $metadata: deserializeMetadata5(parsedOutput),
    ...contents
  });
  return decorateServiceException(exception, parsedOutput.body);
}, "de_InternalServerExceptionRes");
var de_InvalidClientExceptionRes = /* @__PURE__ */ __name(async (parsedOutput, context) => {
  const contents = map({});
  const data = parsedOutput.body;
  const doc = take(data, {
    error: expectString,
    error_description: expectString
  });
  Object.assign(contents, doc);
  const exception = new InvalidClientException({
    $metadata: deserializeMetadata5(parsedOutput),
    ...contents
  });
  return decorateServiceException(exception, parsedOutput.body);
}, "de_InvalidClientExceptionRes");
var de_InvalidGrantExceptionRes = /* @__PURE__ */ __name(async (parsedOutput, context) => {
  const contents = map({});
  const data = parsedOutput.body;
  const doc = take(data, {
    error: expectString,
    error_description: expectString
  });
  Object.assign(contents, doc);
  const exception = new InvalidGrantException({
    $metadata: deserializeMetadata5(parsedOutput),
    ...contents
  });
  return decorateServiceException(exception, parsedOutput.body);
}, "de_InvalidGrantExceptionRes");
var de_InvalidRequestExceptionRes2 = /* @__PURE__ */ __name(async (parsedOutput, context) => {
  const contents = map({});
  const data = parsedOutput.body;
  const doc = take(data, {
    error: expectString,
    error_description: expectString
  });
  Object.assign(contents, doc);
  const exception = new InvalidRequestException2({
    $metadata: deserializeMetadata5(parsedOutput),
    ...contents
  });
  return decorateServiceException(exception, parsedOutput.body);
}, "de_InvalidRequestExceptionRes");
var de_InvalidScopeExceptionRes = /* @__PURE__ */ __name(async (parsedOutput, context) => {
  const contents = map({});
  const data = parsedOutput.body;
  const doc = take(data, {
    error: expectString,
    error_description: expectString
  });
  Object.assign(contents, doc);
  const exception = new InvalidScopeException({
    $metadata: deserializeMetadata5(parsedOutput),
    ...contents
  });
  return decorateServiceException(exception, parsedOutput.body);
}, "de_InvalidScopeExceptionRes");
var de_SlowDownExceptionRes = /* @__PURE__ */ __name(async (parsedOutput, context) => {
  const contents = map({});
  const data = parsedOutput.body;
  const doc = take(data, {
    error: expectString,
    error_description: expectString
  });
  Object.assign(contents, doc);
  const exception = new SlowDownException({
    $metadata: deserializeMetadata5(parsedOutput),
    ...contents
  });
  return decorateServiceException(exception, parsedOutput.body);
}, "de_SlowDownExceptionRes");
var de_UnauthorizedClientExceptionRes = /* @__PURE__ */ __name(async (parsedOutput, context) => {
  const contents = map({});
  const data = parsedOutput.body;
  const doc = take(data, {
    error: expectString,
    error_description: expectString
  });
  Object.assign(contents, doc);
  const exception = new UnauthorizedClientException({
    $metadata: deserializeMetadata5(parsedOutput),
    ...contents
  });
  return decorateServiceException(exception, parsedOutput.body);
}, "de_UnauthorizedClientExceptionRes");
var de_UnsupportedGrantTypeExceptionRes = /* @__PURE__ */ __name(async (parsedOutput, context) => {
  const contents = map({});
  const data = parsedOutput.body;
  const doc = take(data, {
    error: expectString,
    error_description: expectString
  });
  Object.assign(contents, doc);
  const exception = new UnsupportedGrantTypeException({
    $metadata: deserializeMetadata5(parsedOutput),
    ...contents
  });
  return decorateServiceException(exception, parsedOutput.body);
}, "de_UnsupportedGrantTypeExceptionRes");
var deserializeMetadata5 = /* @__PURE__ */ __name((output) => ({
  httpStatusCode: output.statusCode,
  requestId: output.headers["x-amzn-requestid"] ?? output.headers["x-amzn-request-id"] ?? output.headers["x-amz-request-id"],
  extendedRequestId: output.headers["x-amz-id-2"],
  cfId: output.headers["x-amz-cf-id"]
}), "deserializeMetadata");
var collectBody4 = /* @__PURE__ */ __name((streamBody = new Uint8Array(), context) => {
  if (streamBody instanceof Uint8Array) {
    return Promise.resolve(streamBody);
  }
  return context.streamCollector(streamBody) || Promise.resolve(new Uint8Array());
}, "collectBody");
var collectBodyString4 = /* @__PURE__ */ __name((streamBody, context) => collectBody4(streamBody, context).then((body) => context.utf8Encoder(body)), "collectBodyString");
var parseBody4 = /* @__PURE__ */ __name((streamBody, context) => collectBodyString4(streamBody, context).then((encoded) => {
  if (encoded.length) {
    return JSON.parse(encoded);
  }
  return {};
}), "parseBody");
var parseErrorBody4 = /* @__PURE__ */ __name(async (errorBody, context) => {
  const value = await parseBody4(errorBody, context);
  value.message = value.message ?? value.Message;
  return value;
}, "parseErrorBody");
var loadRestJsonErrorCode3 = /* @__PURE__ */ __name((output, data) => {
  const findKey = /* @__PURE__ */ __name((object, key) => Object.keys(object).find((k6) => k6.toLowerCase() === key.toLowerCase()), "findKey");
  const sanitizeErrorCode = /* @__PURE__ */ __name((rawValue) => {
    let cleanValue = rawValue;
    if (typeof cleanValue === "number") {
      cleanValue = cleanValue.toString();
    }
    if (cleanValue.indexOf(",") >= 0) {
      cleanValue = cleanValue.split(",")[0];
    }
    if (cleanValue.indexOf(":") >= 0) {
      cleanValue = cleanValue.split(":")[0];
    }
    if (cleanValue.indexOf("#") >= 0) {
      cleanValue = cleanValue.split("#")[1];
    }
    return cleanValue;
  }, "sanitizeErrorCode");
  const headerKey = findKey(output.headers, "x-amzn-errortype");
  if (headerKey !== void 0) {
    return sanitizeErrorCode(output.headers[headerKey]);
  }
  if (data.code !== void 0) {
    return sanitizeErrorCode(data.code);
  }
  if (data["__type"] !== void 0) {
    return sanitizeErrorCode(data["__type"]);
  }
}, "loadRestJsonErrorCode");

// node_modules/@aws-sdk/client-sso-oidc/dist-es/commands/CreateTokenCommand.js
var CreateTokenCommand = class extends Command {
  static getEndpointParameterInstructions() {
    return {
      UseFIPS: { type: "builtInParams", name: "useFipsEndpoint" },
      Endpoint: { type: "builtInParams", name: "endpoint" },
      Region: { type: "builtInParams", name: "region" },
      UseDualStack: { type: "builtInParams", name: "useDualstackEndpoint" }
    };
  }
  constructor(input) {
    super();
    this.input = input;
  }
  resolveMiddleware(clientStack, configuration, options) {
    this.middlewareStack.use(getSerdePlugin(configuration, this.serialize, this.deserialize));
    this.middlewareStack.use(getEndpointPlugin(configuration, CreateTokenCommand.getEndpointParameterInstructions()));
    const stack = clientStack.concat(this.middlewareStack);
    const { logger: logger2 } = configuration;
    const clientName = "SSOOIDCClient";
    const commandName = "CreateTokenCommand";
    const handlerExecutionContext = {
      logger: logger2,
      clientName,
      commandName,
      inputFilterSensitiveLog: (_) => _,
      outputFilterSensitiveLog: (_) => _
    };
    const { requestHandler } = configuration;
    return stack.resolve((request2) => requestHandler.handle(request2.request, options || {}), handlerExecutionContext);
  }
  serialize(input, context) {
    return se_CreateTokenCommand(input, context);
  }
  deserialize(output, context) {
    return de_CreateTokenCommand(output, context);
  }
};
__name(CreateTokenCommand, "CreateTokenCommand");

// node_modules/@aws-sdk/client-sso-oidc/dist-es/endpoint/EndpointParameters.js
var resolveClientEndpointParameters4 = /* @__PURE__ */ __name((options) => {
  return {
    ...options,
    useDualstackEndpoint: options.useDualstackEndpoint ?? false,
    useFipsEndpoint: options.useFipsEndpoint ?? false,
    defaultSigningName: "awsssooidc"
  };
}, "resolveClientEndpointParameters");

// node_modules/@aws-sdk/client-sso-oidc/package.json
var package_default4 = {
  name: "@aws-sdk/client-sso-oidc",
  description: "AWS SDK for JavaScript Sso Oidc Client for Node.js, Browser and React Native",
  version: "3.329.0",
  scripts: {
    build: "concurrently 'yarn:build:cjs' 'yarn:build:es' 'yarn:build:types'",
    "build:cjs": "tsc -p tsconfig.cjs.json",
    "build:docs": "typedoc",
    "build:es": "tsc -p tsconfig.es.json",
    "build:include:deps": "lerna run --scope $npm_package_name --include-dependencies build",
    "build:types": "tsc -p tsconfig.types.json",
    "build:types:downlevel": "downlevel-dts dist-types dist-types/ts3.4",
    clean: "rimraf ./dist-* && rimraf *.tsbuildinfo",
    "extract:docs": "api-extractor run --local",
    "generate:client": "node ../../scripts/generate-clients/single-service --solo sso-oidc"
  },
  main: "./dist-cjs/index.js",
  types: "./dist-types/index.d.ts",
  module: "./dist-es/index.js",
  sideEffects: false,
  dependencies: {
    "@aws-crypto/sha256-browser": "3.0.0",
    "@aws-crypto/sha256-js": "3.0.0",
    "@aws-sdk/config-resolver": "3.329.0",
    "@aws-sdk/fetch-http-handler": "3.329.0",
    "@aws-sdk/hash-node": "3.329.0",
    "@aws-sdk/invalid-dependency": "3.329.0",
    "@aws-sdk/middleware-content-length": "3.329.0",
    "@aws-sdk/middleware-endpoint": "3.329.0",
    "@aws-sdk/middleware-host-header": "3.329.0",
    "@aws-sdk/middleware-logger": "3.329.0",
    "@aws-sdk/middleware-recursion-detection": "3.329.0",
    "@aws-sdk/middleware-retry": "3.329.0",
    "@aws-sdk/middleware-serde": "3.329.0",
    "@aws-sdk/middleware-stack": "3.329.0",
    "@aws-sdk/middleware-user-agent": "3.329.0",
    "@aws-sdk/node-config-provider": "3.329.0",
    "@aws-sdk/node-http-handler": "3.329.0",
    "@aws-sdk/protocol-http": "3.329.0",
    "@aws-sdk/smithy-client": "3.329.0",
    "@aws-sdk/types": "3.329.0",
    "@aws-sdk/url-parser": "3.329.0",
    "@aws-sdk/util-base64": "3.310.0",
    "@aws-sdk/util-body-length-browser": "3.310.0",
    "@aws-sdk/util-body-length-node": "3.310.0",
    "@aws-sdk/util-defaults-mode-browser": "3.329.0",
    "@aws-sdk/util-defaults-mode-node": "3.329.0",
    "@aws-sdk/util-endpoints": "3.329.0",
    "@aws-sdk/util-retry": "3.329.0",
    "@aws-sdk/util-user-agent-browser": "3.329.0",
    "@aws-sdk/util-user-agent-node": "3.329.0",
    "@aws-sdk/util-utf8": "3.310.0",
    tslib: "^2.5.0"
  },
  devDependencies: {
    "@aws-sdk/service-client-documentation-generator": "3.310.0",
    "@tsconfig/node14": "1.0.3",
    "@types/node": "^14.14.31",
    concurrently: "7.0.0",
    "downlevel-dts": "0.10.1",
    rimraf: "3.0.2",
    typedoc: "0.23.23",
    typescript: "~4.9.5"
  },
  engines: {
    node: ">=14.0.0"
  },
  typesVersions: {
    "<4.0": {
      "dist-types/*": [
        "dist-types/ts3.4/*"
      ]
    }
  },
  files: [
    "dist-*/**"
  ],
  author: {
    name: "AWS SDK for JavaScript Team",
    url: "https://aws.amazon.com/javascript/"
  },
  license: "Apache-2.0",
  browser: {
    "./dist-es/runtimeConfig": "./dist-es/runtimeConfig.browser"
  },
  "react-native": {
    "./dist-es/runtimeConfig": "./dist-es/runtimeConfig.native"
  },
  homepage: "https://github.com/aws/aws-sdk-js-v3/tree/main/clients/client-sso-oidc",
  repository: {
    type: "git",
    url: "https://github.com/aws/aws-sdk-js-v3.git",
    directory: "clients/client-sso-oidc"
  }
};

// node_modules/@aws-sdk/client-sso-oidc/dist-es/endpoint/ruleset.js
var p2 = "required";
var q2 = "fn";
var r2 = "argv";
var s2 = "ref";
var a2 = "PartitionResult";
var b2 = "tree";
var c2 = "error";
var d2 = "endpoint";
var e2 = { [p2]: false, "type": "String" };
var f2 = { [p2]: true, "default": false, "type": "Boolean" };
var g2 = { [s2]: "Endpoint" };
var h2 = { [q2]: "booleanEquals", [r2]: [{ [s2]: "UseFIPS" }, true] };
var i2 = { [q2]: "booleanEquals", [r2]: [{ [s2]: "UseDualStack" }, true] };
var j2 = {};
var k2 = { [q2]: "booleanEquals", [r2]: [true, { [q2]: "getAttr", [r2]: [{ [s2]: a2 }, "supportsFIPS"] }] };
var l2 = { [q2]: "booleanEquals", [r2]: [true, { [q2]: "getAttr", [r2]: [{ [s2]: a2 }, "supportsDualStack"] }] };
var m2 = [g2];
var n2 = [h2];
var o2 = [i2];
var _data2 = { version: "1.0", parameters: { Region: e2, UseDualStack: f2, UseFIPS: f2, Endpoint: e2 }, rules: [{ conditions: [{ [q2]: "aws.partition", [r2]: [{ [s2]: "Region" }], assign: a2 }], type: b2, rules: [{ conditions: [{ [q2]: "isSet", [r2]: m2 }, { [q2]: "parseURL", [r2]: m2, assign: "url" }], type: b2, rules: [{ conditions: n2, error: "Invalid Configuration: FIPS and custom endpoint are not supported", type: c2 }, { type: b2, rules: [{ conditions: o2, error: "Invalid Configuration: Dualstack and custom endpoint are not supported", type: c2 }, { endpoint: { url: g2, properties: j2, headers: j2 }, type: d2 }] }] }, { conditions: [h2, i2], type: b2, rules: [{ conditions: [k2, l2], type: b2, rules: [{ endpoint: { url: "https://oidc-fips.{Region}.{PartitionResult#dualStackDnsSuffix}", properties: j2, headers: j2 }, type: d2 }] }, { error: "FIPS and DualStack are enabled, but this partition does not support one or both", type: c2 }] }, { conditions: n2, type: b2, rules: [{ conditions: [k2], type: b2, rules: [{ type: b2, rules: [{ endpoint: { url: "https://oidc-fips.{Region}.{PartitionResult#dnsSuffix}", properties: j2, headers: j2 }, type: d2 }] }] }, { error: "FIPS is enabled but this partition does not support FIPS", type: c2 }] }, { conditions: o2, type: b2, rules: [{ conditions: [l2], type: b2, rules: [{ endpoint: { url: "https://oidc.{Region}.{PartitionResult#dualStackDnsSuffix}", properties: j2, headers: j2 }, type: d2 }] }, { error: "DualStack is enabled but this partition does not support DualStack", type: c2 }] }, { endpoint: { url: "https://oidc.{Region}.{PartitionResult#dnsSuffix}", properties: j2, headers: j2 }, type: d2 }] }] };
var ruleSet2 = _data2;

// node_modules/@aws-sdk/client-sso-oidc/dist-es/endpoint/endpointResolver.js
var defaultEndpointResolver2 = /* @__PURE__ */ __name((endpointParams, context = {}) => {
  return resolveEndpoint(ruleSet2, {
    endpointParams,
    logger: context.logger
  });
}, "defaultEndpointResolver");

// node_modules/@aws-sdk/client-sso-oidc/dist-es/runtimeConfig.shared.js
var getRuntimeConfig3 = /* @__PURE__ */ __name((config) => ({
  apiVersion: "2019-06-10",
  base64Decoder: config?.base64Decoder ?? fromBase64,
  base64Encoder: config?.base64Encoder ?? toBase64,
  disableHostPrefix: config?.disableHostPrefix ?? false,
  endpointProvider: config?.endpointProvider ?? defaultEndpointResolver2,
  logger: config?.logger ?? new NoOpLogger(),
  serviceId: config?.serviceId ?? "SSO OIDC",
  urlParser: config?.urlParser ?? parseUrl,
  utf8Decoder: config?.utf8Decoder ?? fromUtf8,
  utf8Encoder: config?.utf8Encoder ?? toUtf8
}), "getRuntimeConfig");

// node_modules/@aws-sdk/client-sso-oidc/dist-es/runtimeConfig.js
var getRuntimeConfig4 = /* @__PURE__ */ __name((config) => {
  emitWarningIfUnsupportedVersion(process.version);
  const defaultsMode = resolveDefaultsModeConfig(config);
  const defaultConfigProvider = /* @__PURE__ */ __name(() => defaultsMode().then(loadConfigsForDefaultMode), "defaultConfigProvider");
  const clientSharedValues = getRuntimeConfig3(config);
  return {
    ...clientSharedValues,
    ...config,
    runtime: "node",
    defaultsMode,
    bodyLengthChecker: config?.bodyLengthChecker ?? calculateBodyLength,
    defaultUserAgentProvider: config?.defaultUserAgentProvider ?? defaultUserAgent({ serviceId: clientSharedValues.serviceId, clientVersion: package_default4.version }),
    maxAttempts: config?.maxAttempts ?? loadConfig(NODE_MAX_ATTEMPT_CONFIG_OPTIONS),
    region: config?.region ?? loadConfig(NODE_REGION_CONFIG_OPTIONS, NODE_REGION_CONFIG_FILE_OPTIONS),
    requestHandler: config?.requestHandler ?? new NodeHttpHandler(defaultConfigProvider),
    retryMode: config?.retryMode ?? loadConfig({
      ...NODE_RETRY_MODE_CONFIG_OPTIONS,
      default: async () => (await defaultConfigProvider()).retryMode || DEFAULT_RETRY_MODE
    }),
    sha256: config?.sha256 ?? Hash.bind(null, "sha256"),
    streamCollector: config?.streamCollector ?? streamCollector,
    useDualstackEndpoint: config?.useDualstackEndpoint ?? loadConfig(NODE_USE_DUALSTACK_ENDPOINT_CONFIG_OPTIONS),
    useFipsEndpoint: config?.useFipsEndpoint ?? loadConfig(NODE_USE_FIPS_ENDPOINT_CONFIG_OPTIONS)
  };
}, "getRuntimeConfig");

// node_modules/@aws-sdk/client-sso-oidc/dist-es/SSOOIDCClient.js
var SSOOIDCClient = class extends Client {
  constructor(configuration) {
    const _config_0 = getRuntimeConfig4(configuration);
    const _config_1 = resolveClientEndpointParameters4(_config_0);
    const _config_2 = resolveRegionConfig(_config_1);
    const _config_3 = resolveEndpointConfig(_config_2);
    const _config_4 = resolveRetryConfig(_config_3);
    const _config_5 = resolveHostHeaderConfig(_config_4);
    const _config_6 = resolveUserAgentConfig(_config_5);
    super(_config_6);
    this.config = _config_6;
    this.middlewareStack.use(getRetryPlugin(this.config));
    this.middlewareStack.use(getContentLengthPlugin(this.config));
    this.middlewareStack.use(getHostHeaderPlugin(this.config));
    this.middlewareStack.use(getLoggerPlugin(this.config));
    this.middlewareStack.use(getRecursionDetectionPlugin(this.config));
    this.middlewareStack.use(getUserAgentPlugin(this.config));
  }
  destroy() {
    super.destroy();
  }
};
__name(SSOOIDCClient, "SSOOIDCClient");

// node_modules/@aws-sdk/token-providers/dist-es/getSsoOidcClient.js
var ssoOidcClientsHash = {};
var getSsoOidcClient = /* @__PURE__ */ __name((ssoRegion) => {
  if (ssoOidcClientsHash[ssoRegion]) {
    return ssoOidcClientsHash[ssoRegion];
  }
  const ssoOidcClient = new SSOOIDCClient({ region: ssoRegion });
  ssoOidcClientsHash[ssoRegion] = ssoOidcClient;
  return ssoOidcClient;
}, "getSsoOidcClient");

// node_modules/@aws-sdk/token-providers/dist-es/getNewSsoOidcToken.js
var getNewSsoOidcToken = /* @__PURE__ */ __name((ssoToken, ssoRegion) => {
  const ssoOidcClient = getSsoOidcClient(ssoRegion);
  return ssoOidcClient.send(new CreateTokenCommand({
    clientId: ssoToken.clientId,
    clientSecret: ssoToken.clientSecret,
    refreshToken: ssoToken.refreshToken,
    grantType: "refresh_token"
  }));
}, "getNewSsoOidcToken");

// node_modules/@aws-sdk/token-providers/dist-es/validateTokenExpiry.js
var validateTokenExpiry = /* @__PURE__ */ __name((token) => {
  if (token.expiration && token.expiration.getTime() < Date.now()) {
    throw new TokenProviderError(`Token is expired. ${REFRESH_MESSAGE}`, false);
  }
}, "validateTokenExpiry");

// node_modules/@aws-sdk/token-providers/dist-es/validateTokenKey.js
var validateTokenKey = /* @__PURE__ */ __name((key, value, forRefresh = false) => {
  if (typeof value === "undefined") {
    throw new TokenProviderError(`Value not present for '${key}' in SSO Token${forRefresh ? ". Cannot refresh" : ""}. ${REFRESH_MESSAGE}`, false);
  }
}, "validateTokenKey");

// node_modules/@aws-sdk/token-providers/dist-es/writeSSOTokenToFile.js
import { promises as fsPromises3 } from "fs";
var { writeFile } = fsPromises3;
var writeSSOTokenToFile = /* @__PURE__ */ __name((id, ssoToken) => {
  const tokenFilepath = getSSOTokenFilepath(id);
  const tokenString = JSON.stringify(ssoToken, null, 2);
  return writeFile(tokenFilepath, tokenString);
}, "writeSSOTokenToFile");

// node_modules/@aws-sdk/token-providers/dist-es/fromSso.js
var lastRefreshAttemptTime = new Date(0);
var fromSso = /* @__PURE__ */ __name((init = {}) => async () => {
  const profiles = await parseKnownFiles(init);
  const profileName = getProfileName(init);
  const profile = profiles[profileName];
  if (!profile) {
    throw new TokenProviderError(`Profile '${profileName}' could not be found in shared credentials file.`, false);
  } else if (!profile["sso_session"]) {
    throw new TokenProviderError(`Profile '${profileName}' is missing required property 'sso_session'.`);
  }
  const ssoSessionName = profile["sso_session"];
  const ssoSessions = await loadSsoSessionData(init);
  const ssoSession = ssoSessions[ssoSessionName];
  if (!ssoSession) {
    throw new TokenProviderError(`Sso session '${ssoSessionName}' could not be found in shared credentials file.`, false);
  }
  for (const ssoSessionRequiredKey of ["sso_start_url", "sso_region"]) {
    if (!ssoSession[ssoSessionRequiredKey]) {
      throw new TokenProviderError(`Sso session '${ssoSessionName}' is missing required property '${ssoSessionRequiredKey}'.`, false);
    }
  }
  const ssoStartUrl = ssoSession["sso_start_url"];
  const ssoRegion = ssoSession["sso_region"];
  let ssoToken;
  try {
    ssoToken = await getSSOTokenFromFile(ssoSessionName);
  } catch (e6) {
    throw new TokenProviderError(`The SSO session token associated with profile=${profileName} was not found or is invalid. ${REFRESH_MESSAGE}`, false);
  }
  validateTokenKey("accessToken", ssoToken.accessToken);
  validateTokenKey("expiresAt", ssoToken.expiresAt);
  const { accessToken, expiresAt } = ssoToken;
  const existingToken = { token: accessToken, expiration: new Date(expiresAt) };
  if (existingToken.expiration.getTime() - Date.now() > EXPIRE_WINDOW_MS) {
    return existingToken;
  }
  if (Date.now() - lastRefreshAttemptTime.getTime() < 30 * 1e3) {
    validateTokenExpiry(existingToken);
    return existingToken;
  }
  validateTokenKey("clientId", ssoToken.clientId, true);
  validateTokenKey("clientSecret", ssoToken.clientSecret, true);
  validateTokenKey("refreshToken", ssoToken.refreshToken, true);
  try {
    lastRefreshAttemptTime.setTime(Date.now());
    const newSsoOidcToken = await getNewSsoOidcToken(ssoToken, ssoRegion);
    validateTokenKey("accessToken", newSsoOidcToken.accessToken);
    validateTokenKey("expiresIn", newSsoOidcToken.expiresIn);
    const newTokenExpiration = new Date(Date.now() + newSsoOidcToken.expiresIn * 1e3);
    try {
      await writeSSOTokenToFile(ssoSessionName, {
        ...ssoToken,
        accessToken: newSsoOidcToken.accessToken,
        expiresAt: newTokenExpiration.toISOString(),
        refreshToken: newSsoOidcToken.refreshToken
      });
    } catch (error) {
    }
    return {
      token: newSsoOidcToken.accessToken,
      expiration: newTokenExpiration
    };
  } catch (error) {
    validateTokenExpiry(existingToken);
    return existingToken;
  }
}, "fromSso");

// node_modules/@aws-sdk/credential-provider-sso/dist-es/resolveSSOCredentials.js
var EXPIRE_WINDOW_MS2 = 15 * 60 * 1e3;
var SHOULD_FAIL_CREDENTIAL_CHAIN = false;
var resolveSSOCredentials = /* @__PURE__ */ __name(async ({ ssoStartUrl, ssoSession, ssoAccountId, ssoRegion, ssoRoleName, ssoClient, profile }) => {
  let token;
  const refreshMessage = `To refresh this SSO session run aws sso login with the corresponding profile.`;
  if (ssoSession) {
    try {
      const _token = await fromSso({ profile })();
      token = {
        accessToken: _token.token,
        expiresAt: new Date(_token.expiration).toISOString()
      };
    } catch (e6) {
      throw new CredentialsProviderError(e6.message, SHOULD_FAIL_CREDENTIAL_CHAIN);
    }
  } else {
    try {
      token = await getSSOTokenFromFile(ssoStartUrl);
    } catch (e6) {
      throw new CredentialsProviderError(`The SSO session associated with this profile is invalid. ${refreshMessage}`, SHOULD_FAIL_CREDENTIAL_CHAIN);
    }
  }
  if (new Date(token.expiresAt).getTime() - Date.now() <= EXPIRE_WINDOW_MS2) {
    throw new CredentialsProviderError(`The SSO session associated with this profile has expired. ${refreshMessage}`, SHOULD_FAIL_CREDENTIAL_CHAIN);
  }
  const { accessToken } = token;
  const sso = ssoClient || new SSOClient({ region: ssoRegion });
  let ssoResp;
  try {
    ssoResp = await sso.send(new GetRoleCredentialsCommand({
      accountId: ssoAccountId,
      roleName: ssoRoleName,
      accessToken
    }));
  } catch (e6) {
    throw CredentialsProviderError.from(e6, SHOULD_FAIL_CREDENTIAL_CHAIN);
  }
  const { roleCredentials: { accessKeyId, secretAccessKey, sessionToken, expiration } = {} } = ssoResp;
  if (!accessKeyId || !secretAccessKey || !sessionToken || !expiration) {
    throw new CredentialsProviderError("SSO returns an invalid temporary credential.", SHOULD_FAIL_CREDENTIAL_CHAIN);
  }
  return { accessKeyId, secretAccessKey, sessionToken, expiration: new Date(expiration) };
}, "resolveSSOCredentials");

// node_modules/@aws-sdk/credential-provider-sso/dist-es/validateSsoProfile.js
var validateSsoProfile = /* @__PURE__ */ __name((profile) => {
  const { sso_start_url, sso_account_id, sso_region, sso_role_name } = profile;
  if (!sso_start_url || !sso_account_id || !sso_region || !sso_role_name) {
    throw new CredentialsProviderError(`Profile is configured with invalid SSO credentials. Required parameters "sso_account_id", "sso_region", "sso_role_name", "sso_start_url". Got ${Object.keys(profile).join(", ")}
Reference: https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-sso.html`, false);
  }
  return profile;
}, "validateSsoProfile");

// node_modules/@aws-sdk/credential-provider-sso/dist-es/fromSSO.js
var fromSSO = /* @__PURE__ */ __name((init = {}) => async () => {
  const { ssoStartUrl, ssoAccountId, ssoRegion, ssoRoleName, ssoClient, ssoSession } = init;
  const profileName = getProfileName(init);
  if (!ssoStartUrl && !ssoAccountId && !ssoRegion && !ssoRoleName && !ssoSession) {
    const profiles = await parseKnownFiles(init);
    const profile = profiles[profileName];
    if (!profile) {
      throw new CredentialsProviderError(`Profile ${profileName} was not found.`);
    }
    if (!isSsoProfile(profile)) {
      throw new CredentialsProviderError(`Profile ${profileName} is not configured with SSO credentials.`);
    }
    if (profile?.sso_session) {
      const ssoSessions = await loadSsoSessionData(init);
      const session = ssoSessions[profile.sso_session];
      const conflictMsg = ` configurations in profile ${profileName} and sso-session ${profile.sso_session}`;
      if (ssoRegion && ssoRegion !== session.sso_region) {
        throw new CredentialsProviderError(`Conflicting SSO region` + conflictMsg, false);
      }
      if (ssoStartUrl && ssoStartUrl !== session.sso_start_url) {
        throw new CredentialsProviderError(`Conflicting SSO start_url` + conflictMsg, false);
      }
      profile.sso_region = session.sso_region;
      profile.sso_start_url = session.sso_start_url;
    }
    const { sso_start_url, sso_account_id, sso_region, sso_role_name, sso_session } = validateSsoProfile(profile);
    return resolveSSOCredentials({
      ssoStartUrl: sso_start_url,
      ssoSession: sso_session,
      ssoAccountId: sso_account_id,
      ssoRegion: sso_region,
      ssoRoleName: sso_role_name,
      ssoClient,
      profile: profileName
    });
  } else if (!ssoStartUrl || !ssoAccountId || !ssoRegion || !ssoRoleName) {
    throw new CredentialsProviderError('Incomplete configuration. The fromSSO() argument hash must include "ssoStartUrl", "ssoAccountId", "ssoRegion", "ssoRoleName"');
  } else {
    return resolveSSOCredentials({
      ssoStartUrl,
      ssoSession,
      ssoAccountId,
      ssoRegion,
      ssoRoleName,
      ssoClient,
      profile: profileName
    });
  }
}, "fromSSO");

// node_modules/@aws-sdk/credential-provider-ini/dist-es/resolveSsoCredentials.js
var resolveSsoCredentials = /* @__PURE__ */ __name((data) => {
  const { sso_start_url, sso_account_id, sso_session, sso_region, sso_role_name } = validateSsoProfile(data);
  return fromSSO({
    ssoStartUrl: sso_start_url,
    ssoAccountId: sso_account_id,
    ssoSession: sso_session,
    ssoRegion: sso_region,
    ssoRoleName: sso_role_name
  })();
}, "resolveSsoCredentials");

// node_modules/@aws-sdk/credential-provider-ini/dist-es/resolveStaticCredentials.js
var isStaticCredsProfile = /* @__PURE__ */ __name((arg) => Boolean(arg) && typeof arg === "object" && typeof arg.aws_access_key_id === "string" && typeof arg.aws_secret_access_key === "string" && ["undefined", "string"].indexOf(typeof arg.aws_session_token) > -1, "isStaticCredsProfile");
var resolveStaticCredentials = /* @__PURE__ */ __name((profile) => Promise.resolve({
  accessKeyId: profile.aws_access_key_id,
  secretAccessKey: profile.aws_secret_access_key,
  sessionToken: profile.aws_session_token
}), "resolveStaticCredentials");

// node_modules/@aws-sdk/credential-provider-web-identity/dist-es/fromTokenFile.js
import { readFileSync } from "fs";

// node_modules/@aws-sdk/credential-provider-web-identity/dist-es/fromWebToken.js
var fromWebToken = /* @__PURE__ */ __name((init) => () => {
  const { roleArn, roleSessionName, webIdentityToken, providerId, policyArns, policy, durationSeconds, roleAssumerWithWebIdentity } = init;
  if (!roleAssumerWithWebIdentity) {
    throw new CredentialsProviderError(`Role Arn '${roleArn}' needs to be assumed with web identity, but no role assumption callback was provided.`, false);
  }
  return roleAssumerWithWebIdentity({
    RoleArn: roleArn,
    RoleSessionName: roleSessionName ?? `aws-sdk-js-session-${Date.now()}`,
    WebIdentityToken: webIdentityToken,
    ProviderId: providerId,
    PolicyArns: policyArns,
    Policy: policy,
    DurationSeconds: durationSeconds
  });
}, "fromWebToken");

// node_modules/@aws-sdk/credential-provider-web-identity/dist-es/fromTokenFile.js
var ENV_TOKEN_FILE = "AWS_WEB_IDENTITY_TOKEN_FILE";
var ENV_ROLE_ARN = "AWS_ROLE_ARN";
var ENV_ROLE_SESSION_NAME = "AWS_ROLE_SESSION_NAME";
var fromTokenFile = /* @__PURE__ */ __name((init = {}) => async () => {
  return resolveTokenFile(init);
}, "fromTokenFile");
var resolveTokenFile = /* @__PURE__ */ __name((init) => {
  const webIdentityTokenFile = init?.webIdentityTokenFile ?? process.env[ENV_TOKEN_FILE];
  const roleArn = init?.roleArn ?? process.env[ENV_ROLE_ARN];
  const roleSessionName = init?.roleSessionName ?? process.env[ENV_ROLE_SESSION_NAME];
  if (!webIdentityTokenFile || !roleArn) {
    throw new CredentialsProviderError("Web identity configuration not specified");
  }
  return fromWebToken({
    ...init,
    webIdentityToken: readFileSync(webIdentityTokenFile, { encoding: "ascii" }),
    roleArn,
    roleSessionName
  })();
}, "resolveTokenFile");

// node_modules/@aws-sdk/credential-provider-ini/dist-es/resolveWebIdentityCredentials.js
var isWebIdentityProfile = /* @__PURE__ */ __name((arg) => Boolean(arg) && typeof arg === "object" && typeof arg.web_identity_token_file === "string" && typeof arg.role_arn === "string" && ["undefined", "string"].indexOf(typeof arg.role_session_name) > -1, "isWebIdentityProfile");
var resolveWebIdentityCredentials = /* @__PURE__ */ __name(async (profile, options) => fromTokenFile({
  webIdentityTokenFile: profile.web_identity_token_file,
  roleArn: profile.role_arn,
  roleSessionName: profile.role_session_name,
  roleAssumerWithWebIdentity: options.roleAssumerWithWebIdentity
})(), "resolveWebIdentityCredentials");

// node_modules/@aws-sdk/credential-provider-ini/dist-es/resolveProfileData.js
var resolveProfileData = /* @__PURE__ */ __name(async (profileName, profiles, options, visitedProfiles = {}) => {
  const data = profiles[profileName];
  if (Object.keys(visitedProfiles).length > 0 && isStaticCredsProfile(data)) {
    return resolveStaticCredentials(data);
  }
  if (isAssumeRoleProfile(data)) {
    return resolveAssumeRoleCredentials(profileName, profiles, options, visitedProfiles);
  }
  if (isStaticCredsProfile(data)) {
    return resolveStaticCredentials(data);
  }
  if (isWebIdentityProfile(data)) {
    return resolveWebIdentityCredentials(data, options);
  }
  if (isProcessProfile(data)) {
    return resolveProcessCredentials2(options, profileName);
  }
  if (isSsoProfile(data)) {
    return resolveSsoCredentials(data);
  }
  throw new CredentialsProviderError(`Profile ${profileName} could not be found or parsed in shared credentials file.`);
}, "resolveProfileData");

// node_modules/@aws-sdk/credential-provider-ini/dist-es/fromIni.js
var fromIni = /* @__PURE__ */ __name((init = {}) => async () => {
  const profiles = await parseKnownFiles(init);
  return resolveProfileData(getProfileName(init), profiles, init);
}, "fromIni");

// node_modules/@aws-sdk/credential-provider-node/dist-es/remoteProvider.js
var ENV_IMDS_DISABLED2 = "AWS_EC2_METADATA_DISABLED";
var remoteProvider = /* @__PURE__ */ __name((init) => {
  if (process.env[ENV_CMDS_RELATIVE_URI] || process.env[ENV_CMDS_FULL_URI]) {
    return fromContainerMetadata(init);
  }
  if (process.env[ENV_IMDS_DISABLED2]) {
    return async () => {
      throw new CredentialsProviderError("EC2 Instance Metadata Service access disabled");
    };
  }
  return fromInstanceMetadata(init);
}, "remoteProvider");

// node_modules/@aws-sdk/credential-provider-node/dist-es/defaultProvider.js
var defaultProvider = /* @__PURE__ */ __name((init = {}) => memoize(chain(...init.profile || process.env[ENV_PROFILE] ? [] : [fromEnv()], fromSSO(init), fromIni(init), fromProcess(init), fromTokenFile(init), remoteProvider(init), async () => {
  throw new CredentialsProviderError("Could not load credentials from any providers", false);
}), (credentials) => credentials.expiration !== void 0 && credentials.expiration.getTime() - Date.now() < 3e5, (credentials) => credentials.expiration !== void 0), "defaultProvider");

// node_modules/@aws-sdk/client-sts/dist-es/endpoint/ruleset.js
var F = "required";
var G = "type";
var H = "fn";
var I = "argv";
var J = "ref";
var a3 = false;
var b3 = true;
var c3 = "booleanEquals";
var d3 = "tree";
var e3 = "stringEquals";
var f3 = "sigv4";
var g3 = "sts";
var h3 = "us-east-1";
var i3 = "endpoint";
var j3 = "https://sts.{Region}.{PartitionResult#dnsSuffix}";
var k3 = "error";
var l3 = "getAttr";
var m3 = { [F]: false, [G]: "String" };
var n3 = { [F]: true, "default": false, [G]: "Boolean" };
var o3 = { [J]: "Endpoint" };
var p3 = { [H]: "isSet", [I]: [{ [J]: "Region" }] };
var q3 = { [J]: "Region" };
var r3 = { [H]: "aws.partition", [I]: [q3], "assign": "PartitionResult" };
var s3 = { [J]: "UseFIPS" };
var t = { [J]: "UseDualStack" };
var u = { "url": "https://sts.amazonaws.com", "properties": { "authSchemes": [{ "name": f3, "signingName": g3, "signingRegion": h3 }] }, "headers": {} };
var v = {};
var w = { "conditions": [{ [H]: e3, [I]: [q3, "aws-global"] }], [i3]: u, [G]: i3 };
var x = { [H]: c3, [I]: [s3, true] };
var y = { [H]: c3, [I]: [t, true] };
var z = { [H]: c3, [I]: [true, { [H]: l3, [I]: [{ [J]: "PartitionResult" }, "supportsFIPS"] }] };
var A = { [J]: "PartitionResult" };
var B = { [H]: c3, [I]: [true, { [H]: l3, [I]: [A, "supportsDualStack"] }] };
var C = [{ [H]: "isSet", [I]: [o3] }];
var D = [x];
var E = [y];
var _data3 = { version: "1.0", parameters: { Region: m3, UseDualStack: n3, UseFIPS: n3, Endpoint: m3, UseGlobalEndpoint: n3 }, rules: [{ conditions: [{ [H]: c3, [I]: [{ [J]: "UseGlobalEndpoint" }, b3] }, { [H]: "not", [I]: C }, p3, r3, { [H]: c3, [I]: [s3, a3] }, { [H]: c3, [I]: [t, a3] }], [G]: d3, rules: [{ conditions: [{ [H]: e3, [I]: [q3, "ap-northeast-1"] }], endpoint: u, [G]: i3 }, { conditions: [{ [H]: e3, [I]: [q3, "ap-south-1"] }], endpoint: u, [G]: i3 }, { conditions: [{ [H]: e3, [I]: [q3, "ap-southeast-1"] }], endpoint: u, [G]: i3 }, { conditions: [{ [H]: e3, [I]: [q3, "ap-southeast-2"] }], endpoint: u, [G]: i3 }, w, { conditions: [{ [H]: e3, [I]: [q3, "ca-central-1"] }], endpoint: u, [G]: i3 }, { conditions: [{ [H]: e3, [I]: [q3, "eu-central-1"] }], endpoint: u, [G]: i3 }, { conditions: [{ [H]: e3, [I]: [q3, "eu-north-1"] }], endpoint: u, [G]: i3 }, { conditions: [{ [H]: e3, [I]: [q3, "eu-west-1"] }], endpoint: u, [G]: i3 }, { conditions: [{ [H]: e3, [I]: [q3, "eu-west-2"] }], endpoint: u, [G]: i3 }, { conditions: [{ [H]: e3, [I]: [q3, "eu-west-3"] }], endpoint: u, [G]: i3 }, { conditions: [{ [H]: e3, [I]: [q3, "sa-east-1"] }], endpoint: u, [G]: i3 }, { conditions: [{ [H]: e3, [I]: [q3, h3] }], endpoint: u, [G]: i3 }, { conditions: [{ [H]: e3, [I]: [q3, "us-east-2"] }], endpoint: u, [G]: i3 }, { conditions: [{ [H]: e3, [I]: [q3, "us-west-1"] }], endpoint: u, [G]: i3 }, { conditions: [{ [H]: e3, [I]: [q3, "us-west-2"] }], endpoint: u, [G]: i3 }, { endpoint: { url: j3, properties: { authSchemes: [{ name: f3, signingName: g3, signingRegion: "{Region}" }] }, headers: v }, [G]: i3 }] }, { conditions: C, [G]: d3, rules: [{ conditions: D, error: "Invalid Configuration: FIPS and custom endpoint are not supported", [G]: k3 }, { [G]: d3, rules: [{ conditions: E, error: "Invalid Configuration: Dualstack and custom endpoint are not supported", [G]: k3 }, { endpoint: { url: o3, properties: v, headers: v }, [G]: i3 }] }] }, { [G]: d3, rules: [{ conditions: [p3], [G]: d3, rules: [{ conditions: [r3], [G]: d3, rules: [{ conditions: [x, y], [G]: d3, rules: [{ conditions: [z, B], [G]: d3, rules: [{ [G]: d3, rules: [{ endpoint: { url: "https://sts-fips.{Region}.{PartitionResult#dualStackDnsSuffix}", properties: v, headers: v }, [G]: i3 }] }] }, { error: "FIPS and DualStack are enabled, but this partition does not support one or both", [G]: k3 }] }, { conditions: D, [G]: d3, rules: [{ conditions: [z], [G]: d3, rules: [{ [G]: d3, rules: [{ conditions: [{ [H]: e3, [I]: ["aws-us-gov", { [H]: l3, [I]: [A, "name"] }] }], endpoint: { url: "https://sts.{Region}.amazonaws.com", properties: v, headers: v }, [G]: i3 }, { endpoint: { url: "https://sts-fips.{Region}.{PartitionResult#dnsSuffix}", properties: v, headers: v }, [G]: i3 }] }] }, { error: "FIPS is enabled but this partition does not support FIPS", [G]: k3 }] }, { conditions: E, [G]: d3, rules: [{ conditions: [B], [G]: d3, rules: [{ [G]: d3, rules: [{ endpoint: { url: "https://sts.{Region}.{PartitionResult#dualStackDnsSuffix}", properties: v, headers: v }, [G]: i3 }] }] }, { error: "DualStack is enabled but this partition does not support DualStack", [G]: k3 }] }, { [G]: d3, rules: [w, { endpoint: { url: j3, properties: v, headers: v }, [G]: i3 }] }] }] }, { error: "Invalid Configuration: Missing Region", [G]: k3 }] }] };
var ruleSet3 = _data3;

// node_modules/@aws-sdk/client-sts/dist-es/endpoint/endpointResolver.js
var defaultEndpointResolver3 = /* @__PURE__ */ __name((endpointParams, context = {}) => {
  return resolveEndpoint(ruleSet3, {
    endpointParams,
    logger: context.logger
  });
}, "defaultEndpointResolver");

// node_modules/@aws-sdk/client-sts/dist-es/runtimeConfig.shared.js
var getRuntimeConfig5 = /* @__PURE__ */ __name((config) => ({
  apiVersion: "2011-06-15",
  base64Decoder: config?.base64Decoder ?? fromBase64,
  base64Encoder: config?.base64Encoder ?? toBase64,
  disableHostPrefix: config?.disableHostPrefix ?? false,
  endpointProvider: config?.endpointProvider ?? defaultEndpointResolver3,
  logger: config?.logger ?? new NoOpLogger(),
  serviceId: config?.serviceId ?? "STS",
  urlParser: config?.urlParser ?? parseUrl,
  utf8Decoder: config?.utf8Decoder ?? fromUtf8,
  utf8Encoder: config?.utf8Encoder ?? toUtf8
}), "getRuntimeConfig");

// node_modules/@aws-sdk/client-sts/dist-es/runtimeConfig.js
var getRuntimeConfig6 = /* @__PURE__ */ __name((config) => {
  emitWarningIfUnsupportedVersion(process.version);
  const defaultsMode = resolveDefaultsModeConfig(config);
  const defaultConfigProvider = /* @__PURE__ */ __name(() => defaultsMode().then(loadConfigsForDefaultMode), "defaultConfigProvider");
  const clientSharedValues = getRuntimeConfig5(config);
  return {
    ...clientSharedValues,
    ...config,
    runtime: "node",
    defaultsMode,
    bodyLengthChecker: config?.bodyLengthChecker ?? calculateBodyLength,
    credentialDefaultProvider: config?.credentialDefaultProvider ?? decorateDefaultCredentialProvider(defaultProvider),
    defaultUserAgentProvider: config?.defaultUserAgentProvider ?? defaultUserAgent({ serviceId: clientSharedValues.serviceId, clientVersion: package_default2.version }),
    maxAttempts: config?.maxAttempts ?? loadConfig(NODE_MAX_ATTEMPT_CONFIG_OPTIONS),
    region: config?.region ?? loadConfig(NODE_REGION_CONFIG_OPTIONS, NODE_REGION_CONFIG_FILE_OPTIONS),
    requestHandler: config?.requestHandler ?? new NodeHttpHandler(defaultConfigProvider),
    retryMode: config?.retryMode ?? loadConfig({
      ...NODE_RETRY_MODE_CONFIG_OPTIONS,
      default: async () => (await defaultConfigProvider()).retryMode || DEFAULT_RETRY_MODE
    }),
    sha256: config?.sha256 ?? Hash.bind(null, "sha256"),
    streamCollector: config?.streamCollector ?? streamCollector,
    useDualstackEndpoint: config?.useDualstackEndpoint ?? loadConfig(NODE_USE_DUALSTACK_ENDPOINT_CONFIG_OPTIONS),
    useFipsEndpoint: config?.useFipsEndpoint ?? loadConfig(NODE_USE_FIPS_ENDPOINT_CONFIG_OPTIONS)
  };
}, "getRuntimeConfig");

// node_modules/@aws-sdk/client-sts/dist-es/STSClient.js
var STSClient = class extends Client {
  constructor(configuration) {
    const _config_0 = getRuntimeConfig6(configuration);
    const _config_1 = resolveClientEndpointParameters2(_config_0);
    const _config_2 = resolveRegionConfig(_config_1);
    const _config_3 = resolveEndpointConfig(_config_2);
    const _config_4 = resolveRetryConfig(_config_3);
    const _config_5 = resolveHostHeaderConfig(_config_4);
    const _config_6 = resolveStsAuthConfig(_config_5, { stsClientCtor: STSClient });
    const _config_7 = resolveUserAgentConfig(_config_6);
    super(_config_7);
    this.config = _config_7;
    this.middlewareStack.use(getRetryPlugin(this.config));
    this.middlewareStack.use(getContentLengthPlugin(this.config));
    this.middlewareStack.use(getHostHeaderPlugin(this.config));
    this.middlewareStack.use(getLoggerPlugin(this.config));
    this.middlewareStack.use(getRecursionDetectionPlugin(this.config));
    this.middlewareStack.use(getUserAgentPlugin(this.config));
  }
  destroy() {
    super.destroy();
  }
};
__name(STSClient, "STSClient");

// node_modules/@aws-sdk/client-sts/dist-es/defaultRoleAssumers.js
var getCustomizableStsClientCtor = /* @__PURE__ */ __name((baseCtor, customizations) => {
  if (!customizations)
    return baseCtor;
  else
    return /* @__PURE__ */ __name(class CustomizableSTSClient extends baseCtor {
      constructor(config) {
        super(config);
        for (const customization of customizations) {
          this.middlewareStack.use(customization);
        }
      }
    }, "CustomizableSTSClient");
}, "getCustomizableStsClientCtor");
var getDefaultRoleAssumer2 = /* @__PURE__ */ __name((stsOptions = {}, stsPlugins) => getDefaultRoleAssumer(stsOptions, getCustomizableStsClientCtor(STSClient, stsPlugins)), "getDefaultRoleAssumer");
var getDefaultRoleAssumerWithWebIdentity2 = /* @__PURE__ */ __name((stsOptions = {}, stsPlugins) => getDefaultRoleAssumerWithWebIdentity(stsOptions, getCustomizableStsClientCtor(STSClient, stsPlugins)), "getDefaultRoleAssumerWithWebIdentity");
var decorateDefaultCredentialProvider2 = /* @__PURE__ */ __name((provider) => (input) => provider({
  roleAssumer: getDefaultRoleAssumer2(input),
  roleAssumerWithWebIdentity: getDefaultRoleAssumerWithWebIdentity2(input),
  ...input
}), "decorateDefaultCredentialProvider");

// node_modules/@aws-sdk/client-ssm/dist-es/endpoint/ruleset.js
var s4 = "required";
var t2 = "fn";
var u2 = "argv";
var v2 = "ref";
var a4 = "isSet";
var b4 = "tree";
var c4 = "error";
var d4 = "endpoint";
var e4 = "PartitionResult";
var f4 = "getAttr";
var g4 = { [s4]: false, "type": "String" };
var h4 = { [s4]: true, "default": false, "type": "Boolean" };
var i4 = { [v2]: "Endpoint" };
var j4 = { [t2]: "booleanEquals", [u2]: [{ [v2]: "UseFIPS" }, true] };
var k4 = { [t2]: "booleanEquals", [u2]: [{ [v2]: "UseDualStack" }, true] };
var l4 = {};
var m4 = { [t2]: "booleanEquals", [u2]: [true, { [t2]: f4, [u2]: [{ [v2]: e4 }, "supportsFIPS"] }] };
var n4 = { [v2]: e4 };
var o4 = { [t2]: "booleanEquals", [u2]: [true, { [t2]: f4, [u2]: [n4, "supportsDualStack"] }] };
var p4 = [j4];
var q4 = [k4];
var r4 = [{ [v2]: "Region" }];
var _data4 = { version: "1.0", parameters: { Region: g4, UseDualStack: h4, UseFIPS: h4, Endpoint: g4 }, rules: [{ conditions: [{ [t2]: a4, [u2]: [i4] }], type: b4, rules: [{ conditions: p4, error: "Invalid Configuration: FIPS and custom endpoint are not supported", type: c4 }, { type: b4, rules: [{ conditions: q4, error: "Invalid Configuration: Dualstack and custom endpoint are not supported", type: c4 }, { endpoint: { url: i4, properties: l4, headers: l4 }, type: d4 }] }] }, { type: b4, rules: [{ conditions: [{ [t2]: a4, [u2]: r4 }], type: b4, rules: [{ conditions: [{ [t2]: "aws.partition", [u2]: r4, assign: e4 }], type: b4, rules: [{ conditions: [j4, k4], type: b4, rules: [{ conditions: [m4, o4], type: b4, rules: [{ type: b4, rules: [{ endpoint: { url: "https://ssm-fips.{Region}.{PartitionResult#dualStackDnsSuffix}", properties: l4, headers: l4 }, type: d4 }] }] }, { error: "FIPS and DualStack are enabled, but this partition does not support one or both", type: c4 }] }, { conditions: p4, type: b4, rules: [{ conditions: [m4], type: b4, rules: [{ type: b4, rules: [{ conditions: [{ [t2]: "stringEquals", [u2]: ["aws-us-gov", { [t2]: f4, [u2]: [n4, "name"] }] }], endpoint: { url: "https://ssm.{Region}.amazonaws.com", properties: l4, headers: l4 }, type: d4 }, { endpoint: { url: "https://ssm-fips.{Region}.{PartitionResult#dnsSuffix}", properties: l4, headers: l4 }, type: d4 }] }] }, { error: "FIPS is enabled but this partition does not support FIPS", type: c4 }] }, { conditions: q4, type: b4, rules: [{ conditions: [o4], type: b4, rules: [{ type: b4, rules: [{ endpoint: { url: "https://ssm.{Region}.{PartitionResult#dualStackDnsSuffix}", properties: l4, headers: l4 }, type: d4 }] }] }, { error: "DualStack is enabled but this partition does not support DualStack", type: c4 }] }, { type: b4, rules: [{ endpoint: { url: "https://ssm.{Region}.{PartitionResult#dnsSuffix}", properties: l4, headers: l4 }, type: d4 }] }] }] }, { error: "Invalid Configuration: Missing Region", type: c4 }] }] };
var ruleSet4 = _data4;

// node_modules/@aws-sdk/client-ssm/dist-es/endpoint/endpointResolver.js
var defaultEndpointResolver4 = /* @__PURE__ */ __name((endpointParams, context = {}) => {
  return resolveEndpoint(ruleSet4, {
    endpointParams,
    logger: context.logger
  });
}, "defaultEndpointResolver");

// node_modules/@aws-sdk/client-ssm/dist-es/runtimeConfig.shared.js
var getRuntimeConfig7 = /* @__PURE__ */ __name((config) => ({
  apiVersion: "2014-11-06",
  base64Decoder: config?.base64Decoder ?? fromBase64,
  base64Encoder: config?.base64Encoder ?? toBase64,
  disableHostPrefix: config?.disableHostPrefix ?? false,
  endpointProvider: config?.endpointProvider ?? defaultEndpointResolver4,
  logger: config?.logger ?? new NoOpLogger(),
  serviceId: config?.serviceId ?? "SSM",
  urlParser: config?.urlParser ?? parseUrl,
  utf8Decoder: config?.utf8Decoder ?? fromUtf8,
  utf8Encoder: config?.utf8Encoder ?? toUtf8
}), "getRuntimeConfig");

// node_modules/@aws-sdk/client-ssm/dist-es/runtimeConfig.js
var getRuntimeConfig8 = /* @__PURE__ */ __name((config) => {
  emitWarningIfUnsupportedVersion(process.version);
  const defaultsMode = resolveDefaultsModeConfig(config);
  const defaultConfigProvider = /* @__PURE__ */ __name(() => defaultsMode().then(loadConfigsForDefaultMode), "defaultConfigProvider");
  const clientSharedValues = getRuntimeConfig7(config);
  return {
    ...clientSharedValues,
    ...config,
    runtime: "node",
    defaultsMode,
    bodyLengthChecker: config?.bodyLengthChecker ?? calculateBodyLength,
    credentialDefaultProvider: config?.credentialDefaultProvider ?? decorateDefaultCredentialProvider2(defaultProvider),
    defaultUserAgentProvider: config?.defaultUserAgentProvider ?? defaultUserAgent({ serviceId: clientSharedValues.serviceId, clientVersion: package_default.version }),
    maxAttempts: config?.maxAttempts ?? loadConfig(NODE_MAX_ATTEMPT_CONFIG_OPTIONS),
    region: config?.region ?? loadConfig(NODE_REGION_CONFIG_OPTIONS, NODE_REGION_CONFIG_FILE_OPTIONS),
    requestHandler: config?.requestHandler ?? new NodeHttpHandler(defaultConfigProvider),
    retryMode: config?.retryMode ?? loadConfig({
      ...NODE_RETRY_MODE_CONFIG_OPTIONS,
      default: async () => (await defaultConfigProvider()).retryMode || DEFAULT_RETRY_MODE
    }),
    sha256: config?.sha256 ?? Hash.bind(null, "sha256"),
    streamCollector: config?.streamCollector ?? streamCollector,
    useDualstackEndpoint: config?.useDualstackEndpoint ?? loadConfig(NODE_USE_DUALSTACK_ENDPOINT_CONFIG_OPTIONS),
    useFipsEndpoint: config?.useFipsEndpoint ?? loadConfig(NODE_USE_FIPS_ENDPOINT_CONFIG_OPTIONS)
  };
}, "getRuntimeConfig");

// node_modules/@aws-sdk/client-ssm/dist-es/SSMClient.js
var SSMClient = class extends Client {
  constructor(configuration) {
    const _config_0 = getRuntimeConfig8(configuration);
    const _config_1 = resolveClientEndpointParameters(_config_0);
    const _config_2 = resolveRegionConfig(_config_1);
    const _config_3 = resolveEndpointConfig(_config_2);
    const _config_4 = resolveRetryConfig(_config_3);
    const _config_5 = resolveHostHeaderConfig(_config_4);
    const _config_6 = resolveAwsAuthConfig(_config_5);
    const _config_7 = resolveUserAgentConfig(_config_6);
    super(_config_7);
    this.config = _config_7;
    this.middlewareStack.use(getRetryPlugin(this.config));
    this.middlewareStack.use(getContentLengthPlugin(this.config));
    this.middlewareStack.use(getHostHeaderPlugin(this.config));
    this.middlewareStack.use(getLoggerPlugin(this.config));
    this.middlewareStack.use(getRecursionDetectionPlugin(this.config));
    this.middlewareStack.use(getAwsAuthPlugin(this.config));
    this.middlewareStack.use(getUserAgentPlugin(this.config));
  }
  destroy() {
    super.destroy();
  }
};
__name(SSMClient, "SSMClient");

// node_modules/sst/node/util/index.js
var ssm = new SSMClient({ region: process.env.SST_REGION });
var allVariables = {};
var _placeholder = await parseEnvironment();
function createProxy(constructName) {
  const result = new Proxy({}, {
    get(target, prop) {
      if (typeof prop === "string") {
        for (const builtInEnv of ["SST_APP", "SST_STAGE"]) {
          if (!process.env[builtInEnv]) {
            throw new Error(`Cannot find the ${builtInEnv} environment variable. This is usually the case when you are using an older version of SST. Please update SST to the latest version to use the SST Config feature.`);
          }
        }
        const normProp = normalizeId(prop);
        if (!(normProp in target)) {
          throw new Error(`Cannot use ${constructName}.${String(prop)}. Please make sure it is bound to this function.`);
        }
        return Reflect.get(target, normProp);
      }
      return Reflect.get(target, prop);
    }
  });
  Object.assign(result, getVariables2(constructName));
  return result;
}
__name(createProxy, "createProxy");
function getVariables2(constructName) {
  return allVariables[constructName] || {};
}
__name(getVariables2, "getVariables2");
async function parseEnvironment() {
  const variablesFromSsm = [];
  const variablesFromSecret = [];
  Object.keys(process.env).filter((name) => name.startsWith("SST_")).forEach((name) => {
    const variable = parseEnvName(name);
    if (!variable.constructName || !variable.constructId || !variable.propName) {
      return;
    }
    const value = process.env[name];
    if (value === "__FETCH_FROM_SSM__") {
      variablesFromSsm.push(variable);
    } else if (value.startsWith("__FETCH_FROM_SECRET__:")) {
      variablesFromSecret.push([variable, value.split(":")[1]]);
    } else {
      storeVariable(variable, value);
    }
  });
  await fetchValuesFromSSM(variablesFromSsm);
  variablesFromSecret.forEach(([variable, secretName]) => {
    const value = allVariables["Secret"]?.[secretName]?.value;
    if (value) {
      storeVariable(variable, value);
    }
  });
  return allVariables;
}
__name(parseEnvironment, "parseEnvironment");
async function fetchValuesFromSSM(variablesFromSsm) {
  const ssmPaths = variablesFromSsm.map((variable) => buildSsmPath(variable));
  if (ssmPaths.length === 0)
    return;
  const results = await loadSecrets(ssmPaths);
  results.validParams.forEach((item) => {
    const variable = parseSsmPath(item.Name);
    storeVariable(variable, item.Value);
  });
  const ssmFallbackPaths = results.invalidParams.map((name) => parseSsmPath(name)).filter((variable) => variable.constructName === "Secret").map((variable) => buildSsmFallbackPath(variable));
  if (ssmFallbackPaths.length === 0)
    return;
  const fallbackResults = await loadSecrets(ssmFallbackPaths);
  fallbackResults.validParams.forEach((item) => {
    const variable = parseSsmFallbackPath(item.Name);
    storeVariable(variable, item.Value);
  });
  const missingSecrets = fallbackResults.invalidParams.map((name) => parseSsmFallbackPath(name)).filter((variable) => variable.constructName === "Secret").map((variable) => variable.constructId);
  if (missingSecrets.length > 0) {
    throw new Error(`The following secrets were not found: ${missingSecrets.join(", ")}`);
  }
}
__name(fetchValuesFromSSM, "fetchValuesFromSSM");
async function loadSecrets(paths) {
  const chunks = [];
  for (let i6 = 0; i6 < paths.length; i6 += 10) {
    chunks.push(paths.slice(i6, i6 + 10));
  }
  const validParams = [];
  const invalidParams = [];
  await Promise.all(chunks.map(async (chunk) => {
    const command = new GetParametersCommand({
      Names: chunk,
      WithDecryption: true
    });
    const result = await ssm.send(command);
    validParams.push(...result.Parameters || []);
    invalidParams.push(...result.InvalidParameters || []);
  }));
  return { validParams, invalidParams };
}
__name(loadSecrets, "loadSecrets");
function parseEnvName(env2) {
  const [_SST, constructName, propName, ...idParts] = env2.split("_");
  return {
    constructName,
    constructId: idParts.join("_"),
    propName
  };
}
__name(parseEnvName, "parseEnvName");
function parseSsmPath(path) {
  const prefix2 = ssmPrefix();
  const parts = path.substring(prefix2.length).split("/");
  return {
    constructName: parts[0],
    constructId: parts[1],
    propName: parts[2]
  };
}
__name(parseSsmPath, "parseSsmPath");
function parseSsmFallbackPath(path) {
  const parts = path.split("/");
  return {
    constructName: parts[4],
    constructId: parts[5],
    propName: parts[6]
  };
}
__name(parseSsmFallbackPath, "parseSsmFallbackPath");
function buildSsmPath(data) {
  return `${ssmPrefix()}${data.constructName}/${data.constructId}/${data.propName}`;
}
__name(buildSsmPath, "buildSsmPath");
function buildSsmFallbackPath(data) {
  return `/sst/${process.env.SST_APP}/.fallback/${data.constructName}/${data.constructId}/${data.propName}`;
}
__name(buildSsmFallbackPath, "buildSsmFallbackPath");
function normalizeId(name) {
  return name.replace(/-/g, "_");
}
__name(normalizeId, "normalizeId");
function ssmPrefix() {
  return process.env.SST_SSM_PREFIX || "";
}
__name(ssmPrefix, "ssmPrefix");
function storeVariable(variable, value) {
  const { constructId: id, constructName: c6, propName: prop } = variable;
  allVariables[c6] = allVariables[c6] || {};
  allVariables[c6][id] = allVariables[c6][id] || {};
  allVariables[c6][id][prop] = value;
}
__name(storeVariable, "storeVariable");

// node_modules/sst/node/table/index.js
var Table = /* @__PURE__ */ createProxy("Table");

// node_modules/sst/context/context.js
var Context = {
  create,
  reset,
  memo
};
var state = {
  requestID: "",
  contexts: /* @__PURE__ */ new Map(),
  tracking: []
};
function create(cb, name) {
  const id = typeof cb === "string" ? cb : name || Symbol(cb?.toString());
  return {
    use() {
      let result = state.contexts.get(id);
      if (!result) {
        if (!cb || typeof cb === "string")
          throw new Error(`"${String(id)}" context was not provided.`);
        state.tracking.push(id);
        const value = cb();
        state.tracking.pop();
        result = {
          value,
          dependants: /* @__PURE__ */ new Set()
        };
        state.contexts.set(id, result);
      }
      const last = state.tracking[state.tracking.length - 1];
      if (last)
        result.dependants.add(last);
      return result.value;
    },
    provide(value) {
      const requestID = global[Symbol.for("aws.lambda.runtime.requestId")];
      if (state.requestID !== requestID) {
        state.requestID = requestID;
        reset();
      }
      resetDependencies(id);
      state.contexts.set(id, {
        value,
        dependants: /* @__PURE__ */ new Set()
      });
    }
  };
}
__name(create, "create");
function reset() {
  state.contexts.clear();
}
__name(reset, "reset");
function resetDependencies(id) {
  const info = state.contexts.get(id);
  if (!info)
    return;
  for (const dependantID of info.dependants) {
    resetDependencies(dependantID);
    state.contexts.delete(dependantID);
  }
}
__name(resetDependencies, "resetDependencies");
function memo(cb, name) {
  const ctx = create(cb, name);
  return ctx.use;
}
__name(memo, "memo");

// node_modules/sst/context/handler.js
var RequestContext = Context.create("RequestContext");
function useEvent(type) {
  const ctx = RequestContext.use();
  if (ctx.type !== type)
    throw new Error(`Expected ${type} event`);
  return ctx.event;
}
__name(useEvent, "useEvent");
function Handler(type, cb) {
  return /* @__PURE__ */ __name(function handler2(event, context) {
    RequestContext.provide({ type, event, context });
    return cb(event, context);
  }, "handler");
}
__name(Handler, "Handler");

// node_modules/sst/node/api/index.js
function ApiHandler(cb) {
  return Handler("api", async (evt, ctx) => {
    const result = await cb(evt, ctx);
    const serialized = useResponse().serialize(result || {});
    return serialized;
  });
}
__name(ApiHandler, "ApiHandler");
var useCookies = /* @__PURE__ */ Context.memo(() => {
  const evt = useEvent("api");
  const cookies = evt.cookies || [];
  return Object.fromEntries(cookies.map((c6) => c6.split("=")).map(([k6, v5]) => [k6, decodeURIComponent(v5)]));
});
function useCookie(name) {
  const cookies = useCookies();
  return cookies[name];
}
__name(useCookie, "useCookie");
var useResponse = /* @__PURE__ */ Context.memo(() => {
  const response = {
    headers: {},
    cookies: []
  };
  const result = {
    cookies(values, options) {
      for (const [key, value] of Object.entries(values)) {
        result.cookie({
          key,
          value,
          ...options
        });
      }
      return result;
    },
    cookie(input) {
      const value = encodeURIComponent(input.value);
      const parts = [input.key + "=" + value];
      if (input.domain)
        parts.push("Domain=" + input.domain);
      if (input.path)
        parts.push("Path=" + input.path);
      if (input.expires)
        parts.push("Expires=" + input.expires.toUTCString());
      if (input.maxAge)
        parts.push("Max-Age=" + input.maxAge);
      if (input.httpOnly)
        parts.push("HttpOnly");
      if (input.secure)
        parts.push("Secure");
      if (input.sameSite)
        parts.push("SameSite=" + input.sameSite);
      response.cookies.push(parts.join("; "));
      return result;
    },
    status(code) {
      response.statusCode = code;
      return result;
    },
    header(key, value) {
      response.headers[key] = value;
      return result;
    },
    serialize(input) {
      return {
        ...response,
        ...input,
        cookies: [...input.cookies || [], ...response.cookies],
        headers: {
          ...response.headers,
          ...input.headers
        }
      };
    }
  };
  return result;
});
function useHeaders() {
  const evt = useEvent("api");
  return evt.headers || {};
}
__name(useHeaders, "useHeaders");
function useHeader(key) {
  const headers = useHeaders();
  return headers[key];
}
__name(useHeader, "useHeader");

// node_modules/sst/node/auth/auth.js
var className = "Auth";
var authData = getVariables2(className);
var authValues = Object.values(authData);
var prefix;
var publicKey;
var privateKey;
if (authValues.length !== 0) {
  prefix = authValues[0].prefix;
  publicKey = authValues[0].publicKey;
  privateKey = authValues[0].privateKey;
}
function getPublicKey() {
  if (!publicKey) {
    throw new Error(`Cannot use ${className}.publicKey. Please make sure it is bound to this function.`);
  }
  return publicKey;
}
__name(getPublicKey, "getPublicKey");

// node_modules/sst/node/auth/session.js
var import_fast_jwt = __toESM(require_src(), 1);
var SessionMemo = /* @__PURE__ */ Context.memo(() => {
  let token = "";
  const header = useHeader("authorization");
  if (header)
    token = header.substring(7);
  const cookie = useCookie("auth-token");
  if (cookie)
    token = cookie;
  if (token) {
    const jwt = (0, import_fast_jwt.createVerifier)({
      algorithms: ["RS512"],
      key: getPublicKey()
    })(token);
    return jwt;
  }
  return {
    type: "public",
    properties: {}
  };
});
function useSession() {
  const ctx = SessionMemo();
  return ctx;
}
__name(useSession, "useSession");

// node_modules/@aws-sdk/util-dynamodb/dist-es/convertToAttr.js
var convertToAttr = /* @__PURE__ */ __name((data, options) => {
  if (data === void 0) {
    throw new Error(`Pass options.removeUndefinedValues=true to remove undefined values from map/array/set.`);
  } else if (data === null && typeof data === "object") {
    return convertToNullAttr();
  } else if (Array.isArray(data)) {
    return convertToListAttr(data, options);
  } else if (data?.constructor?.name === "Set") {
    return convertToSetAttr(data, options);
  } else if (data?.constructor?.name === "Map") {
    return convertToMapAttrFromIterable(data, options);
  } else if (data?.constructor?.name === "Object" || !data.constructor && typeof data === "object") {
    return convertToMapAttrFromEnumerableProps(data, options);
  } else if (isBinary(data)) {
    if (data.length === 0 && options?.convertEmptyValues) {
      return convertToNullAttr();
    }
    return convertToBinaryAttr(data);
  } else if (typeof data === "boolean" || data?.constructor?.name === "Boolean") {
    return { BOOL: data.valueOf() };
  } else if (typeof data === "number" || data?.constructor?.name === "Number") {
    return convertToNumberAttr(data);
  } else if (typeof data === "bigint") {
    return convertToBigIntAttr(data);
  } else if (typeof data === "string" || data?.constructor?.name === "String") {
    if (data.length === 0 && options?.convertEmptyValues) {
      return convertToNullAttr();
    }
    return convertToStringAttr(data);
  } else if (options?.convertClassInstanceToMap && typeof data === "object") {
    return convertToMapAttrFromEnumerableProps(data, options);
  }
  throw new Error(`Unsupported type passed: ${data}. Pass options.convertClassInstanceToMap=true to marshall typeof object as map attribute.`);
}, "convertToAttr");
var convertToListAttr = /* @__PURE__ */ __name((data, options) => ({
  L: data.filter((item) => !options?.removeUndefinedValues || options?.removeUndefinedValues && item !== void 0).map((item) => convertToAttr(item, options))
}), "convertToListAttr");
var convertToSetAttr = /* @__PURE__ */ __name((set, options) => {
  const setToOperate = options?.removeUndefinedValues ? new Set([...set].filter((value) => value !== void 0)) : set;
  if (!options?.removeUndefinedValues && setToOperate.has(void 0)) {
    throw new Error(`Pass options.removeUndefinedValues=true to remove undefined values from map/array/set.`);
  }
  if (setToOperate.size === 0) {
    if (options?.convertEmptyValues) {
      return convertToNullAttr();
    }
    throw new Error(`Pass a non-empty set, or options.convertEmptyValues=true.`);
  }
  const item = setToOperate.values().next().value;
  if (typeof item === "number") {
    return {
      NS: Array.from(setToOperate).map(convertToNumberAttr).map((item2) => item2.N)
    };
  } else if (typeof item === "bigint") {
    return {
      NS: Array.from(setToOperate).map(convertToBigIntAttr).map((item2) => item2.N)
    };
  } else if (typeof item === "string") {
    return {
      SS: Array.from(setToOperate).map(convertToStringAttr).map((item2) => item2.S)
    };
  } else if (isBinary(item)) {
    return {
      BS: Array.from(setToOperate).map(convertToBinaryAttr).map((item2) => item2.B)
    };
  } else {
    throw new Error(`Only Number Set (NS), Binary Set (BS) or String Set (SS) are allowed.`);
  }
}, "convertToSetAttr");
var convertToMapAttrFromIterable = /* @__PURE__ */ __name((data, options) => ({
  M: ((data2) => {
    const map2 = {};
    for (const [key, value] of data2) {
      if (typeof value !== "function" && (value !== void 0 || !options?.removeUndefinedValues)) {
        map2[key] = convertToAttr(value, options);
      }
    }
    return map2;
  })(data)
}), "convertToMapAttrFromIterable");
var convertToMapAttrFromEnumerableProps = /* @__PURE__ */ __name((data, options) => ({
  M: ((data2) => {
    const map2 = {};
    for (const key in data2) {
      const value = data2[key];
      if (typeof value !== "function" && (value !== void 0 || !options?.removeUndefinedValues)) {
        map2[key] = convertToAttr(value, options);
      }
    }
    return map2;
  })(data)
}), "convertToMapAttrFromEnumerableProps");
var convertToNullAttr = /* @__PURE__ */ __name(() => ({ NULL: true }), "convertToNullAttr");
var convertToBinaryAttr = /* @__PURE__ */ __name((data) => ({ B: data }), "convertToBinaryAttr");
var convertToStringAttr = /* @__PURE__ */ __name((data) => ({ S: data.toString() }), "convertToStringAttr");
var convertToBigIntAttr = /* @__PURE__ */ __name((data) => ({ N: data.toString() }), "convertToBigIntAttr");
var validateBigIntAndThrow = /* @__PURE__ */ __name((errorPrefix) => {
  throw new Error(`${errorPrefix} ${typeof BigInt === "function" ? "Use BigInt." : "Pass string value instead."} `);
}, "validateBigIntAndThrow");
var convertToNumberAttr = /* @__PURE__ */ __name((num) => {
  if ([Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY].map((val) => val.toString()).includes(num.toString())) {
    throw new Error(`Special numeric value ${num.toString()} is not allowed`);
  } else if (num > Number.MAX_SAFE_INTEGER) {
    validateBigIntAndThrow(`Number ${num.toString()} is greater than Number.MAX_SAFE_INTEGER.`);
  } else if (num < Number.MIN_SAFE_INTEGER) {
    validateBigIntAndThrow(`Number ${num.toString()} is lesser than Number.MIN_SAFE_INTEGER.`);
  }
  return { N: num.toString() };
}, "convertToNumberAttr");
var isBinary = /* @__PURE__ */ __name((data) => {
  const binaryTypes = [
    "ArrayBuffer",
    "Blob",
    "Buffer",
    "DataView",
    "File",
    "Int8Array",
    "Uint8Array",
    "Uint8ClampedArray",
    "Int16Array",
    "Uint16Array",
    "Int32Array",
    "Uint32Array",
    "Float32Array",
    "Float64Array",
    "BigInt64Array",
    "BigUint64Array"
  ];
  if (data?.constructor) {
    return binaryTypes.includes(data.constructor.name);
  }
  return false;
}, "isBinary");

// node_modules/@aws-sdk/util-dynamodb/dist-es/convertToNative.js
var convertToNative = /* @__PURE__ */ __name((data, options) => {
  for (const [key, value] of Object.entries(data)) {
    if (value !== void 0) {
      switch (key) {
        case "NULL":
          return null;
        case "BOOL":
          return Boolean(value);
        case "N":
          return convertNumber(value, options);
        case "B":
          return convertBinary(value);
        case "S":
          return convertString(value);
        case "L":
          return convertList(value, options);
        case "M":
          return convertMap(value, options);
        case "NS":
          return new Set(value.map((item) => convertNumber(item, options)));
        case "BS":
          return new Set(value.map(convertBinary));
        case "SS":
          return new Set(value.map(convertString));
        default:
          throw new Error(`Unsupported type passed: ${key}`);
      }
    }
  }
  throw new Error(`No value defined: ${JSON.stringify(data)}`);
}, "convertToNative");
var convertNumber = /* @__PURE__ */ __name((numString, options) => {
  if (options?.wrapNumbers) {
    return { value: numString };
  }
  const num = Number(numString);
  const infinityValues = [Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY];
  if ((num > Number.MAX_SAFE_INTEGER || num < Number.MIN_SAFE_INTEGER) && !infinityValues.includes(num)) {
    if (typeof BigInt === "function") {
      try {
        return BigInt(numString);
      } catch (error) {
        throw new Error(`${numString} can't be converted to BigInt. Set options.wrapNumbers to get string value.`);
      }
    } else {
      throw new Error(`${numString} is outside SAFE_INTEGER bounds. Set options.wrapNumbers to get string value.`);
    }
  }
  return num;
}, "convertNumber");
var convertString = /* @__PURE__ */ __name((stringValue) => stringValue, "convertString");
var convertBinary = /* @__PURE__ */ __name((binaryValue) => binaryValue, "convertBinary");
var convertList = /* @__PURE__ */ __name((list, options) => list.map((item) => convertToNative(item, options)), "convertList");
var convertMap = /* @__PURE__ */ __name((map2, options) => Object.entries(map2).reduce((acc, [key, value]) => (acc[key] = convertToNative(value, options), acc), {}), "convertMap");

// node_modules/@aws-sdk/util-dynamodb/dist-es/marshall.js
function marshall(data, options) {
  const attributeValue = convertToAttr(data, options);
  const [key, value] = Object.entries(attributeValue)[0];
  switch (key) {
    case "M":
    case "L":
      return value;
    case "SS":
    case "NS":
    case "BS":
    case "S":
    case "N":
    case "B":
    case "NULL":
    case "BOOL":
    case "$unknown":
    default:
      return attributeValue;
  }
}
__name(marshall, "marshall");

// node_modules/@aws-sdk/util-dynamodb/dist-es/unmarshall.js
var unmarshall = /* @__PURE__ */ __name((data, options) => convertToNative({ M: data }, options), "unmarshall");

// node_modules/@aws-sdk/client-dynamodb/dist-es/models/DynamoDBServiceException.js
var DynamoDBServiceException = class extends ServiceException {
  constructor(options) {
    super(options);
    Object.setPrototypeOf(this, DynamoDBServiceException.prototype);
  }
};
__name(DynamoDBServiceException, "DynamoDBServiceException");

// node_modules/@aws-sdk/client-dynamodb/dist-es/models/models_0.js
var InternalServerError2 = class extends DynamoDBServiceException {
  constructor(opts) {
    super({
      name: "InternalServerError",
      $fault: "server",
      ...opts
    });
    this.name = "InternalServerError";
    this.$fault = "server";
    Object.setPrototypeOf(this, InternalServerError2.prototype);
  }
};
__name(InternalServerError2, "InternalServerError");
var RequestLimitExceeded = class extends DynamoDBServiceException {
  constructor(opts) {
    super({
      name: "RequestLimitExceeded",
      $fault: "client",
      ...opts
    });
    this.name = "RequestLimitExceeded";
    this.$fault = "client";
    Object.setPrototypeOf(this, RequestLimitExceeded.prototype);
  }
};
__name(RequestLimitExceeded, "RequestLimitExceeded");
var InvalidEndpointException = class extends DynamoDBServiceException {
  constructor(opts) {
    super({
      name: "InvalidEndpointException",
      $fault: "client",
      ...opts
    });
    this.name = "InvalidEndpointException";
    this.$fault = "client";
    Object.setPrototypeOf(this, InvalidEndpointException.prototype);
    this.Message = opts.Message;
  }
};
__name(InvalidEndpointException, "InvalidEndpointException");
var ProvisionedThroughputExceededException = class extends DynamoDBServiceException {
  constructor(opts) {
    super({
      name: "ProvisionedThroughputExceededException",
      $fault: "client",
      ...opts
    });
    this.name = "ProvisionedThroughputExceededException";
    this.$fault = "client";
    Object.setPrototypeOf(this, ProvisionedThroughputExceededException.prototype);
  }
};
__name(ProvisionedThroughputExceededException, "ProvisionedThroughputExceededException");
var ResourceNotFoundException2 = class extends DynamoDBServiceException {
  constructor(opts) {
    super({
      name: "ResourceNotFoundException",
      $fault: "client",
      ...opts
    });
    this.name = "ResourceNotFoundException";
    this.$fault = "client";
    Object.setPrototypeOf(this, ResourceNotFoundException2.prototype);
  }
};
__name(ResourceNotFoundException2, "ResourceNotFoundException");
var AttributeValue;
(function(AttributeValue2) {
  AttributeValue2.visit = (value, visitor) => {
    if (value.S !== void 0)
      return visitor.S(value.S);
    if (value.N !== void 0)
      return visitor.N(value.N);
    if (value.B !== void 0)
      return visitor.B(value.B);
    if (value.SS !== void 0)
      return visitor.SS(value.SS);
    if (value.NS !== void 0)
      return visitor.NS(value.NS);
    if (value.BS !== void 0)
      return visitor.BS(value.BS);
    if (value.M !== void 0)
      return visitor.M(value.M);
    if (value.L !== void 0)
      return visitor.L(value.L);
    if (value.NULL !== void 0)
      return visitor.NULL(value.NULL);
    if (value.BOOL !== void 0)
      return visitor.BOOL(value.BOOL);
    return visitor._(value.$unknown[0], value.$unknown[1]);
  };
})(AttributeValue || (AttributeValue = {}));

// node_modules/@aws-sdk/client-dynamodb/dist-es/protocols/Aws_json1_0.js
var se_DescribeEndpointsCommand = /* @__PURE__ */ __name(async (input, context) => {
  const headers = sharedHeaders2("DescribeEndpoints");
  let body;
  body = JSON.stringify(_json(input));
  return buildHttpRpcRequest3(context, headers, "/", void 0, body);
}, "se_DescribeEndpointsCommand");
var se_GetItemCommand = /* @__PURE__ */ __name(async (input, context) => {
  const headers = sharedHeaders2("GetItem");
  let body;
  body = JSON.stringify(se_GetItemInput(input, context));
  return buildHttpRpcRequest3(context, headers, "/", void 0, body);
}, "se_GetItemCommand");
var de_DescribeEndpointsCommand = /* @__PURE__ */ __name(async (output, context) => {
  if (output.statusCode >= 300) {
    return de_DescribeEndpointsCommandError(output, context);
  }
  const data = await parseBody5(output.body, context);
  let contents = {};
  contents = _json(data);
  const response = {
    $metadata: deserializeMetadata6(output),
    ...contents
  };
  return response;
}, "de_DescribeEndpointsCommand");
var de_DescribeEndpointsCommandError = /* @__PURE__ */ __name(async (output, context) => {
  const parsedOutput = {
    ...output,
    body: await parseErrorBody5(output.body, context)
  };
  const errorCode = loadRestJsonErrorCode4(output, parsedOutput.body);
  const parsedBody = parsedOutput.body;
  return throwDefaultError6({
    output,
    parsedBody,
    errorCode
  });
}, "de_DescribeEndpointsCommandError");
var de_GetItemCommand = /* @__PURE__ */ __name(async (output, context) => {
  if (output.statusCode >= 300) {
    return de_GetItemCommandError(output, context);
  }
  const data = await parseBody5(output.body, context);
  let contents = {};
  contents = de_GetItemOutput(data, context);
  const response = {
    $metadata: deserializeMetadata6(output),
    ...contents
  };
  return response;
}, "de_GetItemCommand");
var de_GetItemCommandError = /* @__PURE__ */ __name(async (output, context) => {
  const parsedOutput = {
    ...output,
    body: await parseErrorBody5(output.body, context)
  };
  const errorCode = loadRestJsonErrorCode4(output, parsedOutput.body);
  switch (errorCode) {
    case "InternalServerError":
    case "com.amazonaws.dynamodb#InternalServerError":
      throw await de_InternalServerErrorRes2(parsedOutput, context);
    case "InvalidEndpointException":
    case "com.amazonaws.dynamodb#InvalidEndpointException":
      throw await de_InvalidEndpointExceptionRes(parsedOutput, context);
    case "ProvisionedThroughputExceededException":
    case "com.amazonaws.dynamodb#ProvisionedThroughputExceededException":
      throw await de_ProvisionedThroughputExceededExceptionRes(parsedOutput, context);
    case "RequestLimitExceeded":
    case "com.amazonaws.dynamodb#RequestLimitExceeded":
      throw await de_RequestLimitExceededRes(parsedOutput, context);
    case "ResourceNotFoundException":
    case "com.amazonaws.dynamodb#ResourceNotFoundException":
      throw await de_ResourceNotFoundExceptionRes2(parsedOutput, context);
    default:
      const parsedBody = parsedOutput.body;
      return throwDefaultError6({
        output,
        parsedBody,
        errorCode
      });
  }
}, "de_GetItemCommandError");
var de_InternalServerErrorRes2 = /* @__PURE__ */ __name(async (parsedOutput, context) => {
  const body = parsedOutput.body;
  const deserialized = _json(body);
  const exception = new InternalServerError2({
    $metadata: deserializeMetadata6(parsedOutput),
    ...deserialized
  });
  return decorateServiceException(exception, body);
}, "de_InternalServerErrorRes");
var de_InvalidEndpointExceptionRes = /* @__PURE__ */ __name(async (parsedOutput, context) => {
  const body = parsedOutput.body;
  const deserialized = _json(body);
  const exception = new InvalidEndpointException({
    $metadata: deserializeMetadata6(parsedOutput),
    ...deserialized
  });
  return decorateServiceException(exception, body);
}, "de_InvalidEndpointExceptionRes");
var de_ProvisionedThroughputExceededExceptionRes = /* @__PURE__ */ __name(async (parsedOutput, context) => {
  const body = parsedOutput.body;
  const deserialized = _json(body);
  const exception = new ProvisionedThroughputExceededException({
    $metadata: deserializeMetadata6(parsedOutput),
    ...deserialized
  });
  return decorateServiceException(exception, body);
}, "de_ProvisionedThroughputExceededExceptionRes");
var de_RequestLimitExceededRes = /* @__PURE__ */ __name(async (parsedOutput, context) => {
  const body = parsedOutput.body;
  const deserialized = _json(body);
  const exception = new RequestLimitExceeded({
    $metadata: deserializeMetadata6(parsedOutput),
    ...deserialized
  });
  return decorateServiceException(exception, body);
}, "de_RequestLimitExceededRes");
var de_ResourceNotFoundExceptionRes2 = /* @__PURE__ */ __name(async (parsedOutput, context) => {
  const body = parsedOutput.body;
  const deserialized = _json(body);
  const exception = new ResourceNotFoundException2({
    $metadata: deserializeMetadata6(parsedOutput),
    ...deserialized
  });
  return decorateServiceException(exception, body);
}, "de_ResourceNotFoundExceptionRes");
var se_AttributeValue = /* @__PURE__ */ __name((input, context) => {
  return AttributeValue.visit(input, {
    B: (value) => ({ B: context.base64Encoder(value) }),
    BOOL: (value) => ({ BOOL: value }),
    BS: (value) => ({ BS: se_BinarySetAttributeValue(value, context) }),
    L: (value) => ({ L: se_ListAttributeValue(value, context) }),
    M: (value) => ({ M: se_MapAttributeValue(value, context) }),
    N: (value) => ({ N: value }),
    NS: (value) => ({ NS: _json(value) }),
    NULL: (value) => ({ NULL: value }),
    S: (value) => ({ S: value }),
    SS: (value) => ({ SS: _json(value) }),
    _: (name, value) => ({ name: value })
  });
}, "se_AttributeValue");
var se_BinarySetAttributeValue = /* @__PURE__ */ __name((input, context) => {
  return input.filter((e6) => e6 != null).map((entry) => {
    return context.base64Encoder(entry);
  });
}, "se_BinarySetAttributeValue");
var se_GetItemInput = /* @__PURE__ */ __name((input, context) => {
  return take(input, {
    AttributesToGet: _json,
    ConsistentRead: [],
    ExpressionAttributeNames: _json,
    Key: (_) => se_Key(_, context),
    ProjectionExpression: [],
    ReturnConsumedCapacity: [],
    TableName: []
  });
}, "se_GetItemInput");
var se_Key = /* @__PURE__ */ __name((input, context) => {
  return Object.entries(input).reduce((acc, [key, value]) => {
    if (value === null) {
      return acc;
    }
    acc[key] = se_AttributeValue(value, context);
    return acc;
  }, {});
}, "se_Key");
var se_ListAttributeValue = /* @__PURE__ */ __name((input, context) => {
  return input.filter((e6) => e6 != null).map((entry) => {
    return se_AttributeValue(entry, context);
  });
}, "se_ListAttributeValue");
var se_MapAttributeValue = /* @__PURE__ */ __name((input, context) => {
  return Object.entries(input).reduce((acc, [key, value]) => {
    if (value === null) {
      return acc;
    }
    acc[key] = se_AttributeValue(value, context);
    return acc;
  }, {});
}, "se_MapAttributeValue");
var de_AttributeMap = /* @__PURE__ */ __name((output, context) => {
  return Object.entries(output).reduce((acc, [key, value]) => {
    if (value === null) {
      return acc;
    }
    acc[key] = de_AttributeValue(expectUnion(value), context);
    return acc;
  }, {});
}, "de_AttributeMap");
var de_AttributeValue = /* @__PURE__ */ __name((output, context) => {
  if (output.B != null) {
    return {
      B: context.base64Decoder(output.B)
    };
  }
  if (expectBoolean(output.BOOL) !== void 0) {
    return { BOOL: expectBoolean(output.BOOL) };
  }
  if (output.BS != null) {
    return {
      BS: de_BinarySetAttributeValue(output.BS, context)
    };
  }
  if (output.L != null) {
    return {
      L: de_ListAttributeValue(output.L, context)
    };
  }
  if (output.M != null) {
    return {
      M: de_MapAttributeValue(output.M, context)
    };
  }
  if (expectString(output.N) !== void 0) {
    return { N: expectString(output.N) };
  }
  if (output.NS != null) {
    return {
      NS: _json(output.NS)
    };
  }
  if (expectBoolean(output.NULL) !== void 0) {
    return { NULL: expectBoolean(output.NULL) };
  }
  if (expectString(output.S) !== void 0) {
    return { S: expectString(output.S) };
  }
  if (output.SS != null) {
    return {
      SS: _json(output.SS)
    };
  }
  return { $unknown: Object.entries(output)[0] };
}, "de_AttributeValue");
var de_BinarySetAttributeValue = /* @__PURE__ */ __name((output, context) => {
  const retVal = (output || []).filter((e6) => e6 != null).map((entry) => {
    return context.base64Decoder(entry);
  });
  return retVal;
}, "de_BinarySetAttributeValue");
var de_Capacity = /* @__PURE__ */ __name((output, context) => {
  return take(output, {
    CapacityUnits: limitedParseDouble,
    ReadCapacityUnits: limitedParseDouble,
    WriteCapacityUnits: limitedParseDouble
  });
}, "de_Capacity");
var de_ConsumedCapacity = /* @__PURE__ */ __name((output, context) => {
  return take(output, {
    CapacityUnits: limitedParseDouble,
    GlobalSecondaryIndexes: (_) => de_SecondaryIndexesCapacityMap(_, context),
    LocalSecondaryIndexes: (_) => de_SecondaryIndexesCapacityMap(_, context),
    ReadCapacityUnits: limitedParseDouble,
    Table: (_) => de_Capacity(_, context),
    TableName: expectString,
    WriteCapacityUnits: limitedParseDouble
  });
}, "de_ConsumedCapacity");
var de_GetItemOutput = /* @__PURE__ */ __name((output, context) => {
  return take(output, {
    ConsumedCapacity: (_) => de_ConsumedCapacity(_, context),
    Item: (_) => de_AttributeMap(_, context)
  });
}, "de_GetItemOutput");
var de_ListAttributeValue = /* @__PURE__ */ __name((output, context) => {
  const retVal = (output || []).filter((e6) => e6 != null).map((entry) => {
    return de_AttributeValue(expectUnion(entry), context);
  });
  return retVal;
}, "de_ListAttributeValue");
var de_MapAttributeValue = /* @__PURE__ */ __name((output, context) => {
  return Object.entries(output).reduce((acc, [key, value]) => {
    if (value === null) {
      return acc;
    }
    acc[key] = de_AttributeValue(expectUnion(value), context);
    return acc;
  }, {});
}, "de_MapAttributeValue");
var de_SecondaryIndexesCapacityMap = /* @__PURE__ */ __name((output, context) => {
  return Object.entries(output).reduce((acc, [key, value]) => {
    if (value === null) {
      return acc;
    }
    acc[key] = de_Capacity(value, context);
    return acc;
  }, {});
}, "de_SecondaryIndexesCapacityMap");
var deserializeMetadata6 = /* @__PURE__ */ __name((output) => ({
  httpStatusCode: output.statusCode,
  requestId: output.headers["x-amzn-requestid"] ?? output.headers["x-amzn-request-id"] ?? output.headers["x-amz-request-id"],
  extendedRequestId: output.headers["x-amz-id-2"],
  cfId: output.headers["x-amz-cf-id"]
}), "deserializeMetadata");
var collectBody5 = /* @__PURE__ */ __name((streamBody = new Uint8Array(), context) => {
  if (streamBody instanceof Uint8Array) {
    return Promise.resolve(streamBody);
  }
  return context.streamCollector(streamBody) || Promise.resolve(new Uint8Array());
}, "collectBody");
var collectBodyString5 = /* @__PURE__ */ __name((streamBody, context) => collectBody5(streamBody, context).then((body) => context.utf8Encoder(body)), "collectBodyString");
var throwDefaultError6 = withBaseException(DynamoDBServiceException);
var buildHttpRpcRequest3 = /* @__PURE__ */ __name(async (context, headers, path, resolvedHostname, body) => {
  const { hostname, protocol = "https", port, path: basePath } = await context.endpoint();
  const contents = {
    protocol,
    hostname,
    port,
    method: "POST",
    path: basePath.endsWith("/") ? basePath.slice(0, -1) + path : basePath + path,
    headers
  };
  if (resolvedHostname !== void 0) {
    contents.hostname = resolvedHostname;
  }
  if (body !== void 0) {
    contents.body = body;
  }
  return new HttpRequest(contents);
}, "buildHttpRpcRequest");
function sharedHeaders2(operation) {
  return {
    "content-type": "application/x-amz-json-1.0",
    "x-amz-target": `DynamoDB_20120810.${operation}`
  };
}
__name(sharedHeaders2, "sharedHeaders");
var parseBody5 = /* @__PURE__ */ __name((streamBody, context) => collectBodyString5(streamBody, context).then((encoded) => {
  if (encoded.length) {
    return JSON.parse(encoded);
  }
  return {};
}), "parseBody");
var parseErrorBody5 = /* @__PURE__ */ __name(async (errorBody, context) => {
  const value = await parseBody5(errorBody, context);
  value.message = value.message ?? value.Message;
  return value;
}, "parseErrorBody");
var loadRestJsonErrorCode4 = /* @__PURE__ */ __name((output, data) => {
  const findKey = /* @__PURE__ */ __name((object, key) => Object.keys(object).find((k6) => k6.toLowerCase() === key.toLowerCase()), "findKey");
  const sanitizeErrorCode = /* @__PURE__ */ __name((rawValue) => {
    let cleanValue = rawValue;
    if (typeof cleanValue === "number") {
      cleanValue = cleanValue.toString();
    }
    if (cleanValue.indexOf(",") >= 0) {
      cleanValue = cleanValue.split(",")[0];
    }
    if (cleanValue.indexOf(":") >= 0) {
      cleanValue = cleanValue.split(":")[0];
    }
    if (cleanValue.indexOf("#") >= 0) {
      cleanValue = cleanValue.split("#")[1];
    }
    return cleanValue;
  }, "sanitizeErrorCode");
  const headerKey = findKey(output.headers, "x-amzn-errortype");
  if (headerKey !== void 0) {
    return sanitizeErrorCode(output.headers[headerKey]);
  }
  if (data.code !== void 0) {
    return sanitizeErrorCode(data.code);
  }
  if (data["__type"] !== void 0) {
    return sanitizeErrorCode(data["__type"]);
  }
}, "loadRestJsonErrorCode");

// node_modules/@aws-sdk/client-dynamodb/dist-es/commands/DescribeEndpointsCommand.js
var DescribeEndpointsCommand = class extends Command {
  static getEndpointParameterInstructions() {
    return {
      UseFIPS: { type: "builtInParams", name: "useFipsEndpoint" },
      Endpoint: { type: "builtInParams", name: "endpoint" },
      Region: { type: "builtInParams", name: "region" },
      UseDualStack: { type: "builtInParams", name: "useDualstackEndpoint" }
    };
  }
  constructor(input) {
    super();
    this.input = input;
  }
  resolveMiddleware(clientStack, configuration, options) {
    this.middlewareStack.use(getSerdePlugin(configuration, this.serialize, this.deserialize));
    this.middlewareStack.use(getEndpointPlugin(configuration, DescribeEndpointsCommand.getEndpointParameterInstructions()));
    const stack = clientStack.concat(this.middlewareStack);
    const { logger: logger2 } = configuration;
    const clientName = "DynamoDBClient";
    const commandName = "DescribeEndpointsCommand";
    const handlerExecutionContext = {
      logger: logger2,
      clientName,
      commandName,
      inputFilterSensitiveLog: (_) => _,
      outputFilterSensitiveLog: (_) => _
    };
    const { requestHandler } = configuration;
    return stack.resolve((request2) => requestHandler.handle(request2.request, options || {}), handlerExecutionContext);
  }
  serialize(input, context) {
    return se_DescribeEndpointsCommand(input, context);
  }
  deserialize(output, context) {
    return de_DescribeEndpointsCommand(output, context);
  }
};
__name(DescribeEndpointsCommand, "DescribeEndpointsCommand");

// node_modules/@aws-sdk/client-dynamodb/dist-es/commands/GetItemCommand.js
var GetItemCommand = class extends Command {
  static getEndpointParameterInstructions() {
    return {
      UseFIPS: { type: "builtInParams", name: "useFipsEndpoint" },
      Endpoint: { type: "builtInParams", name: "endpoint" },
      Region: { type: "builtInParams", name: "region" },
      UseDualStack: { type: "builtInParams", name: "useDualstackEndpoint" }
    };
  }
  constructor(input) {
    super();
    this.input = input;
  }
  resolveMiddleware(clientStack, configuration, options) {
    this.middlewareStack.use(getSerdePlugin(configuration, this.serialize, this.deserialize));
    this.middlewareStack.use(getEndpointPlugin(configuration, GetItemCommand.getEndpointParameterInstructions()));
    const stack = clientStack.concat(this.middlewareStack);
    const { logger: logger2 } = configuration;
    const clientName = "DynamoDBClient";
    const commandName = "GetItemCommand";
    const handlerExecutionContext = {
      logger: logger2,
      clientName,
      commandName,
      inputFilterSensitiveLog: (_) => _,
      outputFilterSensitiveLog: (_) => _
    };
    const { requestHandler } = configuration;
    return stack.resolve((request2) => requestHandler.handle(request2.request, options || {}), handlerExecutionContext);
  }
  serialize(input, context) {
    return se_GetItemCommand(input, context);
  }
  deserialize(output, context) {
    return de_GetItemCommand(output, context);
  }
};
__name(GetItemCommand, "GetItemCommand");

// node_modules/@aws-sdk/middleware-endpoint-discovery/dist-es/configurations.js
var ENV_ENDPOINT_DISCOVERY = ["AWS_ENABLE_ENDPOINT_DISCOVERY", "AWS_ENDPOINT_DISCOVERY_ENABLED"];
var CONFIG_ENDPOINT_DISCOVERY = "endpoint_discovery_enabled";
var isFalsy = /* @__PURE__ */ __name((value) => ["false", "0"].indexOf(value) >= 0, "isFalsy");
var NODE_ENDPOINT_DISCOVERY_CONFIG_OPTIONS = {
  environmentVariableSelector: (env2) => {
    for (let i6 = 0; i6 < ENV_ENDPOINT_DISCOVERY.length; i6++) {
      const envKey = ENV_ENDPOINT_DISCOVERY[i6];
      if (envKey in env2) {
        const value = env2[envKey];
        if (value === "") {
          throw Error(`Environment variable ${envKey} can't be empty of undefined, got "${value}"`);
        }
        return !isFalsy(value);
      }
    }
  },
  configFileSelector: (profile) => {
    if (CONFIG_ENDPOINT_DISCOVERY in profile) {
      const value = profile[CONFIG_ENDPOINT_DISCOVERY];
      if (value === void 0) {
        throw Error(`Shared config entry ${CONFIG_ENDPOINT_DISCOVERY} can't be undefined, got "${value}"`);
      }
      return !isFalsy(value);
    }
  },
  default: void 0
};

// node_modules/@aws-sdk/endpoint-cache/dist-es/EndpointCache.js
var import_lru_cache = __toESM(require_lru_cache2());
var EndpointCache = class {
  constructor(capacity) {
    this.cache = new import_lru_cache.default(capacity);
  }
  getEndpoint(key) {
    const endpointsWithExpiry = this.get(key);
    if (!endpointsWithExpiry || endpointsWithExpiry.length === 0) {
      return void 0;
    }
    const endpoints = endpointsWithExpiry.map((endpoint) => endpoint.Address);
    return endpoints[Math.floor(Math.random() * endpoints.length)];
  }
  get(key) {
    if (!this.has(key)) {
      return;
    }
    const value = this.cache.get(key);
    if (!value) {
      return;
    }
    const now = Date.now();
    const endpointsWithExpiry = value.filter((endpoint) => now < endpoint.Expires);
    if (endpointsWithExpiry.length === 0) {
      this.delete(key);
      return void 0;
    }
    return endpointsWithExpiry;
  }
  set(key, endpoints) {
    const now = Date.now();
    this.cache.set(key, endpoints.map(({ Address, CachePeriodInMinutes }) => ({
      Address,
      Expires: now + CachePeriodInMinutes * 60 * 1e3
    })));
  }
  delete(key) {
    this.cache.set(key, []);
  }
  has(key) {
    if (!this.cache.has(key)) {
      return false;
    }
    const endpoints = this.cache.peek(key);
    if (!endpoints) {
      return false;
    }
    return endpoints.length > 0;
  }
  clear() {
    this.cache.clear();
  }
};
__name(EndpointCache, "EndpointCache");

// node_modules/@aws-sdk/middleware-endpoint-discovery/dist-es/resolveEndpointDiscoveryConfig.js
var resolveEndpointDiscoveryConfig = /* @__PURE__ */ __name((input, { endpointDiscoveryCommandCtor }) => ({
  ...input,
  endpointDiscoveryCommandCtor,
  endpointCache: new EndpointCache(input.endpointCacheSize ?? 1e3),
  endpointDiscoveryEnabled: input.endpointDiscoveryEnabled !== void 0 ? () => Promise.resolve(input.endpointDiscoveryEnabled) : input.endpointDiscoveryEnabledProvider,
  isClientEndpointDiscoveryEnabled: input.endpointDiscoveryEnabled !== void 0
}), "resolveEndpointDiscoveryConfig");

// node_modules/@aws-sdk/client-dynamodb/dist-es/endpoint/EndpointParameters.js
var resolveClientEndpointParameters5 = /* @__PURE__ */ __name((options) => {
  return {
    ...options,
    useDualstackEndpoint: options.useDualstackEndpoint ?? false,
    useFipsEndpoint: options.useFipsEndpoint ?? false,
    defaultSigningName: "dynamodb"
  };
}, "resolveClientEndpointParameters");

// node_modules/@aws-sdk/client-dynamodb/package.json
var package_default5 = {
  name: "@aws-sdk/client-dynamodb",
  description: "AWS SDK for JavaScript Dynamodb Client for Node.js, Browser and React Native",
  version: "3.329.0",
  scripts: {
    build: "concurrently 'yarn:build:cjs' 'yarn:build:es' 'yarn:build:types'",
    "build:cjs": "tsc -p tsconfig.cjs.json",
    "build:docs": "typedoc",
    "build:es": "tsc -p tsconfig.es.json",
    "build:include:deps": "lerna run --scope $npm_package_name --include-dependencies build",
    "build:types": "tsc -p tsconfig.types.json",
    "build:types:downlevel": "downlevel-dts dist-types dist-types/ts3.4",
    clean: "rimraf ./dist-* && rimraf *.tsbuildinfo",
    "extract:docs": "api-extractor run --local",
    "generate:client": "node ../../scripts/generate-clients/single-service --solo dynamodb"
  },
  main: "./dist-cjs/index.js",
  types: "./dist-types/index.d.ts",
  module: "./dist-es/index.js",
  sideEffects: false,
  dependencies: {
    "@aws-crypto/sha256-browser": "3.0.0",
    "@aws-crypto/sha256-js": "3.0.0",
    "@aws-sdk/client-sts": "3.329.0",
    "@aws-sdk/config-resolver": "3.329.0",
    "@aws-sdk/credential-provider-node": "3.329.0",
    "@aws-sdk/fetch-http-handler": "3.329.0",
    "@aws-sdk/hash-node": "3.329.0",
    "@aws-sdk/invalid-dependency": "3.329.0",
    "@aws-sdk/middleware-content-length": "3.329.0",
    "@aws-sdk/middleware-endpoint": "3.329.0",
    "@aws-sdk/middleware-endpoint-discovery": "3.329.0",
    "@aws-sdk/middleware-host-header": "3.329.0",
    "@aws-sdk/middleware-logger": "3.329.0",
    "@aws-sdk/middleware-recursion-detection": "3.329.0",
    "@aws-sdk/middleware-retry": "3.329.0",
    "@aws-sdk/middleware-serde": "3.329.0",
    "@aws-sdk/middleware-signing": "3.329.0",
    "@aws-sdk/middleware-stack": "3.329.0",
    "@aws-sdk/middleware-user-agent": "3.329.0",
    "@aws-sdk/node-config-provider": "3.329.0",
    "@aws-sdk/node-http-handler": "3.329.0",
    "@aws-sdk/protocol-http": "3.329.0",
    "@aws-sdk/smithy-client": "3.329.0",
    "@aws-sdk/types": "3.329.0",
    "@aws-sdk/url-parser": "3.329.0",
    "@aws-sdk/util-base64": "3.310.0",
    "@aws-sdk/util-body-length-browser": "3.310.0",
    "@aws-sdk/util-body-length-node": "3.310.0",
    "@aws-sdk/util-defaults-mode-browser": "3.329.0",
    "@aws-sdk/util-defaults-mode-node": "3.329.0",
    "@aws-sdk/util-endpoints": "3.329.0",
    "@aws-sdk/util-retry": "3.329.0",
    "@aws-sdk/util-user-agent-browser": "3.329.0",
    "@aws-sdk/util-user-agent-node": "3.329.0",
    "@aws-sdk/util-utf8": "3.310.0",
    "@aws-sdk/util-waiter": "3.329.0",
    tslib: "^2.5.0",
    uuid: "^8.3.2"
  },
  devDependencies: {
    "@aws-sdk/service-client-documentation-generator": "3.310.0",
    "@tsconfig/node14": "1.0.3",
    "@types/node": "^14.14.31",
    "@types/uuid": "^8.3.0",
    concurrently: "7.0.0",
    "downlevel-dts": "0.10.1",
    rimraf: "3.0.2",
    typedoc: "0.23.23",
    typescript: "~4.9.5"
  },
  engines: {
    node: ">=14.0.0"
  },
  typesVersions: {
    "<4.0": {
      "dist-types/*": [
        "dist-types/ts3.4/*"
      ]
    }
  },
  files: [
    "dist-*/**"
  ],
  author: {
    name: "AWS SDK for JavaScript Team",
    url: "https://aws.amazon.com/javascript/"
  },
  license: "Apache-2.0",
  browser: {
    "./dist-es/runtimeConfig": "./dist-es/runtimeConfig.browser"
  },
  "react-native": {
    "./dist-es/runtimeConfig": "./dist-es/runtimeConfig.native"
  },
  homepage: "https://github.com/aws/aws-sdk-js-v3/tree/main/clients/client-dynamodb",
  repository: {
    type: "git",
    url: "https://github.com/aws/aws-sdk-js-v3.git",
    directory: "clients/client-dynamodb"
  }
};

// node_modules/@aws-sdk/client-dynamodb/dist-es/endpoint/ruleset.js
var u3 = "required";
var v3 = "fn";
var w2 = "argv";
var x2 = "ref";
var a5 = "isSet";
var b5 = "tree";
var c5 = "error";
var d5 = "endpoint";
var e5 = "PartitionResult";
var f5 = "getAttr";
var g5 = "stringEquals";
var h5 = { [u3]: false, "type": "String" };
var i5 = { [u3]: true, "default": false, "type": "Boolean" };
var j5 = { [x2]: "Endpoint" };
var k5 = { [v3]: "booleanEquals", [w2]: [{ [x2]: "UseFIPS" }, true] };
var l5 = { [v3]: "booleanEquals", [w2]: [{ [x2]: "UseDualStack" }, true] };
var m5 = {};
var n5 = { [x2]: "Region" };
var o5 = { [v3]: "booleanEquals", [w2]: [true, { [v3]: f5, [w2]: [{ [x2]: e5 }, "supportsFIPS"] }] };
var p5 = { [x2]: e5 };
var q5 = { [v3]: "booleanEquals", [w2]: [true, { [v3]: f5, [w2]: [p5, "supportsDualStack"] }] };
var r5 = [k5];
var s5 = [l5];
var t3 = [n5];
var _data5 = { version: "1.0", parameters: { Region: h5, UseDualStack: i5, UseFIPS: i5, Endpoint: h5 }, rules: [{ conditions: [{ [v3]: a5, [w2]: [j5] }], type: b5, rules: [{ conditions: r5, error: "Invalid Configuration: FIPS and custom endpoint are not supported", type: c5 }, { type: b5, rules: [{ conditions: s5, error: "Invalid Configuration: Dualstack and custom endpoint are not supported", type: c5 }, { endpoint: { url: j5, properties: m5, headers: m5 }, type: d5 }] }] }, { type: b5, rules: [{ conditions: [{ [v3]: a5, [w2]: t3 }], type: b5, rules: [{ conditions: [{ [v3]: "aws.partition", [w2]: t3, assign: e5 }], type: b5, rules: [{ conditions: [k5, l5], type: b5, rules: [{ conditions: [o5, q5], type: b5, rules: [{ type: b5, rules: [{ endpoint: { url: "https://dynamodb-fips.{Region}.{PartitionResult#dualStackDnsSuffix}", properties: m5, headers: m5 }, type: d5 }] }] }, { error: "FIPS and DualStack are enabled, but this partition does not support one or both", type: c5 }] }, { conditions: r5, type: b5, rules: [{ conditions: [o5], type: b5, rules: [{ type: b5, rules: [{ conditions: [{ [v3]: g5, [w2]: ["aws-us-gov", { [v3]: f5, [w2]: [p5, "name"] }] }], endpoint: { url: "https://dynamodb.{Region}.amazonaws.com", properties: m5, headers: m5 }, type: d5 }, { endpoint: { url: "https://dynamodb-fips.{Region}.{PartitionResult#dnsSuffix}", properties: m5, headers: m5 }, type: d5 }] }] }, { error: "FIPS is enabled but this partition does not support FIPS", type: c5 }] }, { conditions: s5, type: b5, rules: [{ conditions: [q5], type: b5, rules: [{ type: b5, rules: [{ endpoint: { url: "https://dynamodb.{Region}.{PartitionResult#dualStackDnsSuffix}", properties: m5, headers: m5 }, type: d5 }] }] }, { error: "DualStack is enabled but this partition does not support DualStack", type: c5 }] }, { type: b5, rules: [{ conditions: [{ [v3]: g5, [w2]: [n5, "local"] }], endpoint: { url: "http://localhost:8000", properties: { authSchemes: [{ name: "sigv4", signingName: "dynamodb", signingRegion: "us-east-1" }] }, headers: m5 }, type: d5 }, { endpoint: { url: "https://dynamodb.{Region}.{PartitionResult#dnsSuffix}", properties: m5, headers: m5 }, type: d5 }] }] }] }, { error: "Invalid Configuration: Missing Region", type: c5 }] }] };
var ruleSet5 = _data5;

// node_modules/@aws-sdk/client-dynamodb/dist-es/endpoint/endpointResolver.js
var defaultEndpointResolver5 = /* @__PURE__ */ __name((endpointParams, context = {}) => {
  return resolveEndpoint(ruleSet5, {
    endpointParams,
    logger: context.logger
  });
}, "defaultEndpointResolver");

// node_modules/@aws-sdk/client-dynamodb/dist-es/runtimeConfig.shared.js
var getRuntimeConfig9 = /* @__PURE__ */ __name((config) => ({
  apiVersion: "2012-08-10",
  base64Decoder: config?.base64Decoder ?? fromBase64,
  base64Encoder: config?.base64Encoder ?? toBase64,
  disableHostPrefix: config?.disableHostPrefix ?? false,
  endpointProvider: config?.endpointProvider ?? defaultEndpointResolver5,
  logger: config?.logger ?? new NoOpLogger(),
  serviceId: config?.serviceId ?? "DynamoDB",
  urlParser: config?.urlParser ?? parseUrl,
  utf8Decoder: config?.utf8Decoder ?? fromUtf8,
  utf8Encoder: config?.utf8Encoder ?? toUtf8
}), "getRuntimeConfig");

// node_modules/@aws-sdk/client-dynamodb/dist-es/runtimeConfig.js
var getRuntimeConfig10 = /* @__PURE__ */ __name((config) => {
  emitWarningIfUnsupportedVersion(process.version);
  const defaultsMode = resolveDefaultsModeConfig(config);
  const defaultConfigProvider = /* @__PURE__ */ __name(() => defaultsMode().then(loadConfigsForDefaultMode), "defaultConfigProvider");
  const clientSharedValues = getRuntimeConfig9(config);
  return {
    ...clientSharedValues,
    ...config,
    runtime: "node",
    defaultsMode,
    bodyLengthChecker: config?.bodyLengthChecker ?? calculateBodyLength,
    credentialDefaultProvider: config?.credentialDefaultProvider ?? decorateDefaultCredentialProvider2(defaultProvider),
    defaultUserAgentProvider: config?.defaultUserAgentProvider ?? defaultUserAgent({ serviceId: clientSharedValues.serviceId, clientVersion: package_default5.version }),
    endpointDiscoveryEnabledProvider: config?.endpointDiscoveryEnabledProvider ?? loadConfig(NODE_ENDPOINT_DISCOVERY_CONFIG_OPTIONS),
    maxAttempts: config?.maxAttempts ?? loadConfig(NODE_MAX_ATTEMPT_CONFIG_OPTIONS),
    region: config?.region ?? loadConfig(NODE_REGION_CONFIG_OPTIONS, NODE_REGION_CONFIG_FILE_OPTIONS),
    requestHandler: config?.requestHandler ?? new NodeHttpHandler(defaultConfigProvider),
    retryMode: config?.retryMode ?? loadConfig({
      ...NODE_RETRY_MODE_CONFIG_OPTIONS,
      default: async () => (await defaultConfigProvider()).retryMode || DEFAULT_RETRY_MODE
    }),
    sha256: config?.sha256 ?? Hash.bind(null, "sha256"),
    streamCollector: config?.streamCollector ?? streamCollector,
    useDualstackEndpoint: config?.useDualstackEndpoint ?? loadConfig(NODE_USE_DUALSTACK_ENDPOINT_CONFIG_OPTIONS),
    useFipsEndpoint: config?.useFipsEndpoint ?? loadConfig(NODE_USE_FIPS_ENDPOINT_CONFIG_OPTIONS)
  };
}, "getRuntimeConfig");

// node_modules/@aws-sdk/client-dynamodb/dist-es/DynamoDBClient.js
var DynamoDBClient = class extends Client {
  constructor(configuration) {
    const _config_0 = getRuntimeConfig10(configuration);
    const _config_1 = resolveClientEndpointParameters5(_config_0);
    const _config_2 = resolveRegionConfig(_config_1);
    const _config_3 = resolveEndpointConfig(_config_2);
    const _config_4 = resolveRetryConfig(_config_3);
    const _config_5 = resolveHostHeaderConfig(_config_4);
    const _config_6 = resolveAwsAuthConfig(_config_5);
    const _config_7 = resolveUserAgentConfig(_config_6);
    const _config_8 = resolveEndpointDiscoveryConfig(_config_7, {
      endpointDiscoveryCommandCtor: DescribeEndpointsCommand
    });
    super(_config_8);
    this.config = _config_8;
    this.middlewareStack.use(getRetryPlugin(this.config));
    this.middlewareStack.use(getContentLengthPlugin(this.config));
    this.middlewareStack.use(getHostHeaderPlugin(this.config));
    this.middlewareStack.use(getLoggerPlugin(this.config));
    this.middlewareStack.use(getRecursionDetectionPlugin(this.config));
    this.middlewareStack.use(getAwsAuthPlugin(this.config));
    this.middlewareStack.use(getUserAgentPlugin(this.config));
  }
  destroy() {
    super.destroy();
  }
};
__name(DynamoDBClient, "DynamoDBClient");

// functions/session.ts
var handler = ApiHandler(async () => {
  const session = useSession();
  if (session.type !== "user") {
    throw new Error("Not authenticated");
  }
  const ddb = new DynamoDBClient({});
  const data = await ddb.send(
    new GetItemCommand({
      TableName: Table.users.tableName,
      Key: marshall({
        userId: session.properties.userID
      })
    })
  );
  return {
    statusCode: 200,
    body: JSON.stringify(unmarshall(data.Item))
  };
});
export {
  handler
};
/*! Bundled license information:

safe-buffer/index.js:
  (*! safe-buffer. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> *)
*/
//# sourceMappingURL=session.mjs.map
