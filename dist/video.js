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

/***/ "./src/subpages/video.js":
/*!*******************************!*\
  !*** ./src/subpages/video.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _res_icons_play_circle_svg__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../../res/icons/play-circle.svg */ \"./res/icons/play-circle.svg\");\n\nlet curLink, curIframeID;\nconst link1 = 'https://www.youtube-nocookie.com/embed/EYbvhWEG6kE';\nconst link2 = 'https://www.youtube-nocookie.com/embed/EYbvhWEG6kE';\n\nconst addAskForCookiePermission = function(link, btnID, iframeID){\n    let button = document.getElementById(btnID);\n    button.addEventListener('click', ()=>{\n        showPopUp(link, iframeID);\n    })\n}\n\nconst createPopUp = function(){\n    let box = document.createElement('div');\n    box.setAttribute('id', 'pop-up');\n    box.style.cssText = `\n    display: none; \n    position: absolute;\n    border: 10px solid;\n    border-radius: 10px;\n    font-size: var(--fs-small);\n    width: 50%;\n    background-color: white;\n    text-align: center;\n    padding: var(--fs-small); \n    `\n    let text = document.createElement('div');\n    text.innerHTML = \"Mit Klick auf 'Akzeptieren' erklärst du dich damit einverstanden, dass das YouTube-Video auf die Website geladen wird. Dadurch werden Cookies von Google gesetzt.\"\n\n    let buttonWrapper = document.createElement('div');\n    buttonWrapper.style.cssText = `\n    display: grid;\n    grid-template-columns: 45% 45%;\n    column-gap: 10%;\n    padding: var(--fs-small);\n    `\n\n    const btnStyle = `\n    border: 2px solid;\n    border-radius: 20px;\n    padding: calc(0.2 * var(--fs-small));\n    `\n\n    let acceptBtn = document.createElement('div');\n    acceptBtn.innerHTML = \"Akzeptieren\";\n    acceptBtn.style.cssText = btnStyle;\n    acceptBtn.setAttribute('id', 'accept-btn');\n    acceptBtn.addEventListener('click', loadIframe);\n\n    let declineBtn = document.createElement('div');\n    declineBtn.innerHTML = \"Ablehnen\";\n    declineBtn.style.cssText = btnStyle;\n    declineBtn.setAttribute('id', 'decline-btn');\n    declineBtn.addEventListener('click', hidePopUp);\n    \n    \n    buttonWrapper.appendChild(acceptBtn);\n    buttonWrapper.appendChild(declineBtn);\n    box.appendChild(text);\n    box.appendChild(buttonWrapper);\n    document.body.appendChild(box);\n}\n\nconst showPopUp = function(link, iframeID){\n    if (!document.getElementById('pop-up')){\n        createPopUp();\n    }\n    document.getElementById('pop-up').style.display = 'block';\n    curLink = link;\n    curIframeID = iframeID;\n}\n\nconst hidePopUp = function (){\n    document.getElementById('pop-up').style.display = 'none';\n}\n\n\nconst loadIframe = function(){\n    hidePopUp();\n    let iframe = document.getElementById(curIframeID);\n    iframe.src = curLink;\n    iframe.style.display = 'block';\n}\n\nwindow.addEventListener('DOMContentLoaded', () => {\n    let playBtns = document.getElementsByClassName('play-btn');\n    for (var i = 0; i < playBtns.length; i++) {\n        playBtns[i].src = _res_icons_play_circle_svg__WEBPACK_IMPORTED_MODULE_0__;\n    }\n    createPopUp();\n    addAskForCookiePermission(link1, 'play-btn1', 'video1-frame');\n    addAskForCookiePermission(link2, 'play-btn2', 'video2-frame');\n});\n\n\n\n//# sourceURL=webpack://zahlenzauber/./src/subpages/video.js?");

/***/ }),

/***/ "./res/icons/play-circle.svg":
/*!***********************************!*\
  !*** ./res/icons/play-circle.svg ***!
  \***********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("module.exports = __webpack_require__.p + \"img/play-circle.svg\";\n\n//# sourceURL=webpack://zahlenzauber/./res/icons/play-circle.svg?");

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
/******/ 			// no module.id needed
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
/************************************************************************/
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
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/subpages/video.js");
/******/ 	
/******/ })()
;