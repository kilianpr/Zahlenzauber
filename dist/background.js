/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/css-loader/dist/cjs.js!./src/subpages/substyles.css":
/*!**************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./src/subpages/substyles.css ***!
  \**************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ \"./node_modules/css-loader/dist/runtime/api.js\");\n/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/getUrl.js */ \"./node_modules/css-loader/dist/runtime/getUrl.js\");\n/* harmony import */ var _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_1__);\n// Imports\n\n\nvar ___CSS_LOADER_URL_IMPORT_0___ = new URL(/* asset import */ __webpack_require__(/*! ../../../../../res/fonts/Lora.ttf */ \"./res/fonts/Lora.ttf\"), __webpack_require__.b);\nvar ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(function(i){return i[1]});\nvar ___CSS_LOADER_URL_REPLACEMENT_0___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_1___default()(___CSS_LOADER_URL_IMPORT_0___);\n// Module\n___CSS_LOADER_EXPORT___.push([module.id, \":root{\\n    --fs-small : 1.5rem;\\n    --fs-medium: 2.5rem;\\n    --fs-large : 3.5rem;\\n    --top-left-nav: 15rem;\\n}\\n\\n@font-face {\\n    font-family: lora;\\n    src: url(\" + ___CSS_LOADER_URL_REPLACEMENT_0___ + \");\\n}\\n\\n\\n@media (max-width: 1000px) {\\n    :root{\\n        --fs-small : 1.25rem;\\n        --fs-medium: 1.8rem;\\n        --fs-large: 2.5rem;\\n        --top-left-nav: 10rem;\\n    }\\n}\\n\\n@media (max-width: 700px), (max-height: 500px){\\n    :root{\\n        --fs-small : 1rem;\\n        --fs-medium: 1.5rem;\\n        --fs-large: 2rem;\\n        --top-left-nav: 7rem;\\n    }\\n}\\n\\n@keyframes fadein {\\n    from {\\n      opacity: 0;\\n    }\\n  \\n    to {\\n      opacity: 1;\\n    }\\n  }\\n\\n  @keyframes fadeout {\\n    from {\\n      opacity: 1;\\n    }\\n  \\n    to {\\n      opacity: 0;\\n    }\\n  }\\n\\n.fadeIn{\\n    animation-name: fadein;\\n    animation-duration: 2s;\\n    animation-iteration-count: 1;\\n    animation-fill-mode: forwards;\\n}\\n\\n.fadeOut{\\n    animation-name: fadeout;\\n    animation-duration: 2s;\\n    animation-iteration-count: 1;\\n    animation-fill-mode: forwards;\\n}\\n\\nbody{\\n    font-family: lora;\\n    margin: auto;\\n    top: 0;\\n    left: 0;\\n    height: 100vh;\\n    width: 100vw;\\n    justify-content: center;\\n    align-items: center;\\n    flex-direction: column;\\n}\\n\\ncanvas{\\n    position: absolute;\\n    top: 0;\\n    left: 0;\\n    z-index: -1;\\n}\\n\\n.button{\\n    cursor: pointer;\\n    width: calc(2 * var(--fs-medium));\\n}\\n\\n\\n.button:hover{\\n    filter: invert();\\n}\\n\\n#back-btn{\\n    position: absolute;\\n    top: 0;\\n    left: 0;\\n    z-index: 3;\\n}\\n\\n#back-btn img{\\n    width: 100%;\\n}\\n\\n\\n#wrapper{\\n    width: 80%;\\n    height: 80%;\\n    box-shadow: 30px 30px 20px black;\\n    position: fixed;\\n    background-color: rgba(255, 255, 255, 0.8);\\n}\\n\\n\\n#header{\\n    display:flex;\\n    align-items: center;\\n    background: linear-gradient(#3c81da, #122a79);\\n    color: white;\\n    position: fixed;\\n    width:inherit;\\n}\\n\\n#side-navbar{\\n    position: fixed;\\n    top: var(--top-left-nav);\\n    margin-left: calc (-1*var(--fs-large));\\n    background-color: #3c81da;\\n    font-size: var(--fs-small);\\n    box-shadow: 10px 10px 5px;\\n    width: 20%;\\n}\\n\\n.header-item{\\n    flex: 1;\\n    display: flex;\\n    justify-content: center;\\n}\\n\\n.header-item span{\\n    white-space:nowrap;\\n}\\n\\n.header-item:first-child > span { margin-right: auto; }\\n\\n.header-item:last-child  > span { margin-left: auto;  }\\n\\n#left-nav, #right-nav{\\n    font-size: var(--fs-medium);\\n    padding: calc(0.2* var(--fs-medium));\\n}\\n\\n#left-nav span, #right-nav span{\\n    cursor: pointer;\\n}\\n\\n#cur-nav{\\n    font-size: var(--fs-large);\\n    padding: calc(0.2* var(--fs-medium));\\n}\\n\\n\\n.nav-item{\\n    padding: calc(0.5 * var(--fs-medium));\\n}\\n\\na{\\n    color: inherit;\\n    text-decoration: none;\\n}\\n\\n#content{\\n    position: absolute;\\n    margin-top: calc(var(--fs-large) + var(--fs-medium));\\n    text-align: center;\\n    overflow-y: auto;\\n    right: 2%;\\n    width: 68%;\\n    height: calc(100% - var(--fs-large) - var(--fs-medium))\\n}\\n\\n#about-section{\\n    padding: 0 var(--fs-small) var(--fs-small) var(--fs-small);\\n    margin-top: calc(var(--fs-large) + var(--fs-medium));\\n    text-align: left;\\n    overflow-y: auto;\\n    font-size: var(--fs-small);\\n    height: calc(100% - var(--fs-large) - 3 * var(--fs-medium));\\n}\\n\\n.video{\\n    position: relative;\\n    max-width: 800px; /* wie breit soll das Video maximal sein */\\n    margin: auto;\\n}\\n.video:before{\\n    content: \\\"\\\";\\n    display: block;\\n    padding-top: 56%; /* 16:9 Format */\\n    }\\n.video iframe {\\n    width: 100%;\\n    height: 100%;\\n    position: absolute;\\n    top: 0;;\\n    left: 0;\\n    right: 0;\\n    bottom: 0;\\n    display: none;\\n}\\n\\n#video-placeholder{\\n    display: flex;\\n    align-items: center;\\n    justify-content: center;\\n    width: 100%;\\n    height: 100%;\\n    position: absolute;\\n    top: 0;;\\n    left: 0;\\n    right: 0;\\n    bottom: 0;\\n    background-color: #3c81da;\\n}\\n\\n.play-btn{\\n    cursor: pointer;\\n    height: 30%;\\n}\\n\\n#accept-btn:hover{\\n    background-color: green;\\n    cursor: pointer;\\n}\\n\\n#accept-btn{\\n    background-color: darkgreen;\\n}\\n\\n#decline-btn:hover{\\n    background-color: red;\\n    cursor: pointer;\\n}\\n\\n#decline-btn{\\n    background-color: darkred;\\n}\\n\\n.title{\\n    font-weight: bold;\\n    font-size: var(--fs-medium);\\n    margin-bottom: calc(0.5 * var(--fs-medium));\\n}\\n\\n.caption{\\n    margin-top: calc(0.5 * var(--fs-medium));\\n    font-size: var(--fs-small);\\n    margin-bottom: calc(1 * var(--fs-medium));\\n}\\n\\n.exercise-wrapper{\\n    font-size: var(--fs-small);\\n    margin-bottom: calc(2*var(--fs-small));\\n}\\n\\n.title{\\n    text-align: center;\\n}\\n\\n.exercise{\\n    text-align: justify;\\n}\\n\\n\", \"\"]);\n// Exports\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);\n\n\n//# sourceURL=webpack://zahlenzauber/./src/subpages/substyles.css?./node_modules/css-loader/dist/cjs.js");

/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/api.js":
/*!*****************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/api.js ***!
  \*****************************************************/
/***/ ((module) => {

eval("\n\n/*\n  MIT License http://www.opensource.org/licenses/mit-license.php\n  Author Tobias Koppers @sokra\n*/\n// css base code, injected by the css-loader\n// eslint-disable-next-line func-names\nmodule.exports = function (cssWithMappingToString) {\n  var list = []; // return the list of modules as css string\n\n  list.toString = function toString() {\n    return this.map(function (item) {\n      var content = cssWithMappingToString(item);\n\n      if (item[2]) {\n        return \"@media \".concat(item[2], \" {\").concat(content, \"}\");\n      }\n\n      return content;\n    }).join(\"\");\n  }; // import a list of modules into the list\n  // eslint-disable-next-line func-names\n\n\n  list.i = function (modules, mediaQuery, dedupe) {\n    if (typeof modules === \"string\") {\n      // eslint-disable-next-line no-param-reassign\n      modules = [[null, modules, \"\"]];\n    }\n\n    var alreadyImportedModules = {};\n\n    if (dedupe) {\n      for (var i = 0; i < this.length; i++) {\n        // eslint-disable-next-line prefer-destructuring\n        var id = this[i][0];\n\n        if (id != null) {\n          alreadyImportedModules[id] = true;\n        }\n      }\n    }\n\n    for (var _i = 0; _i < modules.length; _i++) {\n      var item = [].concat(modules[_i]);\n\n      if (dedupe && alreadyImportedModules[item[0]]) {\n        // eslint-disable-next-line no-continue\n        continue;\n      }\n\n      if (mediaQuery) {\n        if (!item[2]) {\n          item[2] = mediaQuery;\n        } else {\n          item[2] = \"\".concat(mediaQuery, \" and \").concat(item[2]);\n        }\n      }\n\n      list.push(item);\n    }\n  };\n\n  return list;\n};\n\n//# sourceURL=webpack://zahlenzauber/./node_modules/css-loader/dist/runtime/api.js?");

/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/getUrl.js":
/*!********************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/getUrl.js ***!
  \********************************************************/
/***/ ((module) => {

eval("\n\nmodule.exports = function (url, options) {\n  if (!options) {\n    // eslint-disable-next-line no-param-reassign\n    options = {};\n  }\n\n  if (!url) {\n    return url;\n  } // eslint-disable-next-line no-underscore-dangle, no-param-reassign\n\n\n  url = String(url.__esModule ? url.default : url); // If url is already wrapped in quotes, remove them\n\n  if (/^['\"].*['\"]$/.test(url)) {\n    // eslint-disable-next-line no-param-reassign\n    url = url.slice(1, -1);\n  }\n\n  if (options.hash) {\n    // eslint-disable-next-line no-param-reassign\n    url += options.hash;\n  } // Should url be wrapped?\n  // See https://drafts.csswg.org/css-values-3/#urls\n\n\n  if (/[\"'() \\t\\n]|(%20)/.test(url) || options.needQuotes) {\n    return \"\\\"\".concat(url.replace(/\"/g, '\\\\\"').replace(/\\n/g, \"\\\\n\"), \"\\\"\");\n  }\n\n  return url;\n};\n\n//# sourceURL=webpack://zahlenzauber/./node_modules/css-loader/dist/runtime/getUrl.js?");

/***/ }),

/***/ "./src/subpages/substyles.css":
/*!************************************!*\
  !*** ./src/subpages/substyles.css ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ \"./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js\");\n/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/styleDomAPI.js */ \"./node_modules/style-loader/dist/runtime/styleDomAPI.js\");\n/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/insertBySelector.js */ \"./node_modules/style-loader/dist/runtime/insertBySelector.js\");\n/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ \"./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js\");\n/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/insertStyleElement.js */ \"./node_modules/style-loader/dist/runtime/insertStyleElement.js\");\n/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);\n/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/styleTagTransform.js */ \"./node_modules/style-loader/dist/runtime/styleTagTransform.js\");\n/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);\n/* harmony import */ var _node_modules_css_loader_dist_cjs_js_substyles_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../node_modules/css-loader/dist/cjs.js!./substyles.css */ \"./node_modules/css-loader/dist/cjs.js!./src/subpages/substyles.css\");\n\n      \n      \n      \n      \n      \n      \n      \n      \n      \n\nvar options = {};\n\noptions.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());\noptions.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());\n\n      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, \"head\");\n    \noptions.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());\noptions.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());\n\nvar update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_substyles_css__WEBPACK_IMPORTED_MODULE_6__[\"default\"], options);\n\n\n\n\n       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_substyles_css__WEBPACK_IMPORTED_MODULE_6__[\"default\"] && _node_modules_css_loader_dist_cjs_js_substyles_css__WEBPACK_IMPORTED_MODULE_6__[\"default\"].locals ? _node_modules_css_loader_dist_cjs_js_substyles_css__WEBPACK_IMPORTED_MODULE_6__[\"default\"].locals : undefined);\n\n\n//# sourceURL=webpack://zahlenzauber/./src/subpages/substyles.css?");

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js":
/*!****************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js ***!
  \****************************************************************************/
/***/ ((module) => {

eval("\n\nvar stylesInDom = [];\n\nfunction getIndexByIdentifier(identifier) {\n  var result = -1;\n\n  for (var i = 0; i < stylesInDom.length; i++) {\n    if (stylesInDom[i].identifier === identifier) {\n      result = i;\n      break;\n    }\n  }\n\n  return result;\n}\n\nfunction modulesToDom(list, options) {\n  var idCountMap = {};\n  var identifiers = [];\n\n  for (var i = 0; i < list.length; i++) {\n    var item = list[i];\n    var id = options.base ? item[0] + options.base : item[0];\n    var count = idCountMap[id] || 0;\n    var identifier = \"\".concat(id, \" \").concat(count);\n    idCountMap[id] = count + 1;\n    var index = getIndexByIdentifier(identifier);\n    var obj = {\n      css: item[1],\n      media: item[2],\n      sourceMap: item[3]\n    };\n\n    if (index !== -1) {\n      stylesInDom[index].references++;\n      stylesInDom[index].updater(obj);\n    } else {\n      stylesInDom.push({\n        identifier: identifier,\n        updater: addStyle(obj, options),\n        references: 1\n      });\n    }\n\n    identifiers.push(identifier);\n  }\n\n  return identifiers;\n}\n\nfunction addStyle(obj, options) {\n  var api = options.domAPI(options);\n  api.update(obj);\n  return function updateStyle(newObj) {\n    if (newObj) {\n      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap) {\n        return;\n      }\n\n      api.update(obj = newObj);\n    } else {\n      api.remove();\n    }\n  };\n}\n\nmodule.exports = function (list, options) {\n  options = options || {};\n  list = list || [];\n  var lastIdentifiers = modulesToDom(list, options);\n  return function update(newList) {\n    newList = newList || [];\n\n    for (var i = 0; i < lastIdentifiers.length; i++) {\n      var identifier = lastIdentifiers[i];\n      var index = getIndexByIdentifier(identifier);\n      stylesInDom[index].references--;\n    }\n\n    var newLastIdentifiers = modulesToDom(newList, options);\n\n    for (var _i = 0; _i < lastIdentifiers.length; _i++) {\n      var _identifier = lastIdentifiers[_i];\n\n      var _index = getIndexByIdentifier(_identifier);\n\n      if (stylesInDom[_index].references === 0) {\n        stylesInDom[_index].updater();\n\n        stylesInDom.splice(_index, 1);\n      }\n    }\n\n    lastIdentifiers = newLastIdentifiers;\n  };\n};\n\n//# sourceURL=webpack://zahlenzauber/./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js?");

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertBySelector.js":
/*!********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertBySelector.js ***!
  \********************************************************************/
/***/ ((module) => {

eval("\n\nvar memo = {};\n/* istanbul ignore next  */\n\nfunction getTarget(target) {\n  if (typeof memo[target] === \"undefined\") {\n    var styleTarget = document.querySelector(target); // Special case to return head of iframe instead of iframe itself\n\n    if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {\n      try {\n        // This will throw an exception if access to iframe is blocked\n        // due to cross-origin restrictions\n        styleTarget = styleTarget.contentDocument.head;\n      } catch (e) {\n        // istanbul ignore next\n        styleTarget = null;\n      }\n    }\n\n    memo[target] = styleTarget;\n  }\n\n  return memo[target];\n}\n/* istanbul ignore next  */\n\n\nfunction insertBySelector(insert, style) {\n  var target = getTarget(insert);\n\n  if (!target) {\n    throw new Error(\"Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.\");\n  }\n\n  target.appendChild(style);\n}\n\nmodule.exports = insertBySelector;\n\n//# sourceURL=webpack://zahlenzauber/./node_modules/style-loader/dist/runtime/insertBySelector.js?");

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertStyleElement.js":
/*!**********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertStyleElement.js ***!
  \**********************************************************************/
/***/ ((module) => {

eval("\n\n/* istanbul ignore next  */\nfunction insertStyleElement(options) {\n  var style = document.createElement(\"style\");\n  options.setAttributes(style, options.attributes);\n  options.insert(style);\n  return style;\n}\n\nmodule.exports = insertStyleElement;\n\n//# sourceURL=webpack://zahlenzauber/./node_modules/style-loader/dist/runtime/insertStyleElement.js?");

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js ***!
  \**********************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("\n\n/* istanbul ignore next  */\nfunction setAttributesWithoutAttributes(style) {\n  var nonce =  true ? __webpack_require__.nc : 0;\n\n  if (nonce) {\n    style.setAttribute(\"nonce\", nonce);\n  }\n}\n\nmodule.exports = setAttributesWithoutAttributes;\n\n//# sourceURL=webpack://zahlenzauber/./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js?");

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleDomAPI.js":
/*!***************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleDomAPI.js ***!
  \***************************************************************/
/***/ ((module) => {

eval("\n\n/* istanbul ignore next  */\nfunction apply(style, options, obj) {\n  var css = obj.css;\n  var media = obj.media;\n  var sourceMap = obj.sourceMap;\n\n  if (media) {\n    style.setAttribute(\"media\", media);\n  } else {\n    style.removeAttribute(\"media\");\n  }\n\n  if (sourceMap && typeof btoa !== \"undefined\") {\n    css += \"\\n/*# sourceMappingURL=data:application/json;base64,\".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), \" */\");\n  } // For old IE\n\n  /* istanbul ignore if  */\n\n\n  options.styleTagTransform(css, style);\n}\n\nfunction removeStyleElement(style) {\n  // istanbul ignore if\n  if (style.parentNode === null) {\n    return false;\n  }\n\n  style.parentNode.removeChild(style);\n}\n/* istanbul ignore next  */\n\n\nfunction domAPI(options) {\n  var style = options.insertStyleElement(options);\n  return {\n    update: function update(obj) {\n      apply(style, options, obj);\n    },\n    remove: function remove() {\n      removeStyleElement(style);\n    }\n  };\n}\n\nmodule.exports = domAPI;\n\n//# sourceURL=webpack://zahlenzauber/./node_modules/style-loader/dist/runtime/styleDomAPI.js?");

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleTagTransform.js":
/*!*********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleTagTransform.js ***!
  \*********************************************************************/
/***/ ((module) => {

eval("\n\n/* istanbul ignore next  */\nfunction styleTagTransform(css, style) {\n  if (style.styleSheet) {\n    style.styleSheet.cssText = css;\n  } else {\n    while (style.firstChild) {\n      style.removeChild(style.firstChild);\n    }\n\n    style.appendChild(document.createTextNode(css));\n  }\n}\n\nmodule.exports = styleTagTransform;\n\n//# sourceURL=webpack://zahlenzauber/./node_modules/style-loader/dist/runtime/styleTagTransform.js?");

/***/ }),

/***/ "./node_modules/three/build/three.module.js":
/*!**************************************************!*\
  !*** ./node_modules/three/build/three.module.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


/***/ }),

/***/ "./src/subpages/background.js":
/*!************************************!*\
  !*** ./src/subpages/background.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _src_subpages_substyles_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../../src/subpages/substyles.css */ \"./src/subpages/substyles.css\");\n/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! three */ \"./node_modules/three/build/three.module.js\");\n/* harmony import */ var _res_particles_water24_png__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../../res/particles/water24.png */ \"./res/particles/water24.png\");\n/* harmony import */ var _res_fonts_Lora_ttf__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../res/fonts/Lora.ttf */ \"./res/fonts/Lora.ttf\");\n/* harmony import */ var _res_icons_confirm_png__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../../res/icons/confirm.png */ \"./res/icons/confirm.png\");\n\n\n\n\n\n\n\nconst _VSPortalPerformant = `\nuniform float randomMultiplier;\nuniform float time;\nvarying vec2 vUv;\nvarying vec3 vPosition;\n  void main() {\n    vUv = uv;\n    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n  }\n`;\n\nconst _FSPortal = `\nuniform float time;\nuniform sampler2D myTexture;\nvarying vec2 vUv;\nvarying vec3 vPosition;\n  void main() {\n    vec2 displacedUV = vec2(vUv.x + 0.1 * sin(vUv.y*100. + time), vUv.y);\n    gl_FragColor = texture2D(myTexture, displacedUV);\n    gl_FragColor.a = 0.8;\n  }\n`;\n\n\nclass AnimatedBackground{\n    constructor(){\n        this._InitScene();\n        this._InitBackBtn();\n    }\n\n    _InitScene(){\n        const parent = this;\n        this._clock = new three__WEBPACK_IMPORTED_MODULE_4__.Clock();\n        this._threejs = new three__WEBPACK_IMPORTED_MODULE_4__.WebGLRenderer({\n            antialias: true,\n        });\n        this._threejs.outputEncoding = three__WEBPACK_IMPORTED_MODULE_4__.sRGBEncoding; //for more accurate colors\n        this._threejs.setPixelRatio(window.devicePixelRatio);\n        this._threejs.setSize(window.innerWidth, window.innerHeight);\n        \n        document.body.appendChild(this._threejs.domElement);\n        this._threejs.domElement.style.opacity = 0;\n\n        \n        this._camera = new three__WEBPACK_IMPORTED_MODULE_4__.OrthographicCamera( -1, 1, 1, -1, 0, 1 );\n        this._scene = new three__WEBPACK_IMPORTED_MODULE_4__.Scene();\n\n        window.addEventListener( 'resize', function(e) {\n            parent._threejs.setSize( window.innerWidth, window.innerHeight, 2 );\n          });\n\n        const uniforms = {\n            myTexture: {\n                value: new three__WEBPACK_IMPORTED_MODULE_4__.TextureLoader().load(_res_particles_water24_png__WEBPACK_IMPORTED_MODULE_1__),\n            },\n            time: {\n              value: 0\n            },\n          };\n  \n      this._material = new three__WEBPACK_IMPORTED_MODULE_4__.ShaderMaterial({\n        uniforms: uniforms,\n        side: three__WEBPACK_IMPORTED_MODULE_4__.DoubleSide,\n        fragmentShader: _FSPortal,\n        vertexShader: _VSPortalPerformant,\n        shadowSide: three__WEBPACK_IMPORTED_MODULE_4__.DoubleSide,\n      });\n\n        \n      \n        const quad = new three__WEBPACK_IMPORTED_MODULE_4__.Mesh( new three__WEBPACK_IMPORTED_MODULE_4__.PlaneBufferGeometry( 2, 2, 1, 1 ), this._material );\n        this._scene.add( quad );\n        this._RAF();\n    }\n\n    _onLoad(){\n      console.log('lol')\n      document.body.style.display = 'flex';\n      this._threejs.domElement.classList.add('fadeIn');\n      this._askQuestion();\n    }\n\n    _askQuestion(){\n      let question = document.createElement('div');\n      question.innerHTML = 'Bereit?';\n      question.style.cssText = `\n        font-size: var(--fs-medium);\n        padding: calc(var(--fs-medium) * 0.5);\n        background-color: white;\n        border: 5px solid;\n        border-radius: 10px;\n        opacity: 0;\n      `\n      let confirmBtn = document.createElement('img');\n      confirmBtn.src = _res_icons_confirm_png__WEBPACK_IMPORTED_MODULE_3__;\n      confirmBtn.style.cssText = `\n        opacity:0;\n        position: fixed;\n        display: block;\n        bottom: 2%;\n        margin: auto;\n      `\n      confirmBtn.classList.add('button');\n      confirmBtn.addEventListener('click', () => {\n        this._requestFullscreen();\n        let wrapper = document.getElementById('wrapper');\n        let backBtn = document.getElementById('back-btn');\n        wrapper.style.display = 'block';\n        backBtn.style.display = 'block';\n        wrapper.classList.add('fadeIn');\n        backBtn.classList.add('fadeIn');\n        question.style.display = 'none';\n        confirmBtn.style.display = 'none';\n      });\n      document.body.appendChild(question);\n      document.body.appendChild(confirmBtn);\n      question.classList.add('fadeIn');\n      setTimeout(() => {\n        confirmBtn.classList.add('fadeIn');\n      }, 1000);\n\n    }\n\n    _Step(timeElapsed) {\n        if (!this._material.uniforms.time.value){\n          this._material.uniforms.time.value = 0.0;\n        }\n        this._material.uniforms.time.value += timeElapsed*10;\n      }\n\n    _RAF(){\n        requestAnimationFrame(() => {this._RAF()});\n        this._threejs.render( this._scene, this._camera);\n        this._Step(this._clock.getDelta());\n\n    }\n\n    _InitBackBtn(){\n        let backBtn = document.getElementById('back-btn');\n        backBtn.addEventListener('click', () => {\n            window.location.href = './';\n        })\n    }\n\n    _requestFullscreen(){\n        if (this._isUserOnMobile()){\n            var elem = document.documentElement;\n            if (elem.requestFullscreen) {\n                elem.requestFullscreen();\n            } else if (elem.webkitRequestFullscreen) { /* Safari */\n                elem.webkitRequestFullscreen();\n            } else if (elem.msRequestFullscreen) { /* IE11 */\n                elem.msRequestFullscreen();\n            }\n            screen.orientation.lock(\"landscape\")\n        }\n    }\n\n    _isUserOnMobile(){\n        var UA = navigator.userAgent;\n        return(\n            /\\b(BlackBerry|webOS|iPhone|IEMobile)\\b/i.test(UA) ||\n            /\\b(Android|Windows Phone|iPad|iPod)\\b/i.test(UA)\n        );\n    }\n}\n\nwindow.transitionToPage = function(href){\n  document.body.classList.add('fadeOut');\n  setTimeout(() => {\n    window.location.href = href;\n  }, 2000);\n}\n\nwindow.addEventListener('DOMContentLoaded', () => {\n    const animtedBg = new AnimatedBackground();\n    animtedBg._onLoad();\n    console.log('loaded')\n});\n\n\n//# sourceURL=webpack://zahlenzauber/./src/subpages/background.js?");

/***/ }),

/***/ "./res/fonts/Lora.ttf":
/*!****************************!*\
  !*** ./res/fonts/Lora.ttf ***!
  \****************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("module.exports = __webpack_require__.p + \"05e77ab0811155f66e9b.ttf\";\n\n//# sourceURL=webpack://zahlenzauber/./res/fonts/Lora.ttf?");

/***/ }),

/***/ "./res/icons/confirm.png":
/*!*******************************!*\
  !*** ./res/icons/confirm.png ***!
  \*******************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("module.exports = __webpack_require__.p + \"img/confirm.png\";\n\n//# sourceURL=webpack://zahlenzauber/./res/icons/confirm.png?");

/***/ }),

/***/ "./res/particles/water24.png":
/*!***********************************!*\
  !*** ./res/particles/water24.png ***!
  \***********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("module.exports = __webpack_require__.p + \"img/water24.png\";\n\n//# sourceURL=webpack://zahlenzauber/./res/particles/water24.png?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript)
/******/ 				scriptUrl = document.currentScript.src
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) scriptUrl = scripts[scripts.length - 1].src
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl;
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		__webpack_require__.b = document.baseURI || self.location.href;
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"background": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		// no on chunks loaded
/******/ 		
/******/ 		// no jsonp function
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/subpages/background.js");
/******/ 	
/******/ })()
;