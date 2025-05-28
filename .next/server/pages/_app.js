/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/_app";
exports.ids = ["pages/_app"];
exports.modules = {

/***/ "./components/ClickSplashEffect.tsx":
/*!******************************************!*\
  !*** ./components/ClickSplashEffect.tsx ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ ClickSplashEffect)\n/* harmony export */ });\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n// components/ClickSplashEffect.tsx\n\nconst IMAGES = [\n    \"/foods/carrot.png\",\n    \"/foods/carrot.png\",\n    \"/foods/carrot.png\",\n    \"/foods/carrot.png\"\n];\nfunction ClickSplashEffect() {\n    (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(()=>{\n        const handleClick = (e)=>{\n            const count = Math.floor(Math.random() * 4) + 4;\n            for(let i = 0; i < count; i++){\n                const img = document.createElement(\"img\");\n                img.src = IMAGES[Math.floor(Math.random() * IMAGES.length)];\n                img.className = \"fixed pointer-events-none z-50 splash-item\";\n                // موقعیت شروع\n                img.style.left = `${e.clientX}px`;\n                img.style.top = `${e.clientY}px`;\n                // جهت و شدت پرتاب رندوم\n                const angle = Math.random() * 2 * Math.PI;\n                const distance = Math.random() * 80 + 50; // بین 50 تا 130 پیکسل\n                const x = Math.cos(angle) * distance;\n                const y = Math.sin(angle) * distance;\n                img.style.setProperty(\"--x\", `${x}px`);\n                img.style.setProperty(\"--y\", `${y}px`);\n                img.style.setProperty(\"--scale\", `${0.8 + Math.random() * 0.6}`);\n                document.body.appendChild(img);\n                setTimeout(()=>img.remove(), 800);\n            }\n            const audio = new Audio(\"/sfx/pop.mp3\");\n            audio.volume = 0.5;\n            audio.play().catch(()=>{});\n        };\n        document.addEventListener(\"click\", handleClick);\n        return ()=>document.removeEventListener(\"click\", handleClick);\n    }, []);\n    return null;\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9jb21wb25lbnRzL0NsaWNrU3BsYXNoRWZmZWN0LnRzeCIsIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxtQ0FBbUM7QUFDRDtBQUVsQyxNQUFNQyxTQUFTO0lBQ2Y7SUFDRztJQUNBO0lBQ0E7Q0FDRjtBQUVjLFNBQVNDO0lBQ3RCRixnREFBU0EsQ0FBQztRQUNSLE1BQU1HLGNBQWMsQ0FBQ0M7WUFDbkIsTUFBTUMsUUFBUUMsS0FBS0MsS0FBSyxDQUFDRCxLQUFLRSxNQUFNLEtBQUssS0FBSztZQUU5QyxJQUFLLElBQUlDLElBQUksR0FBR0EsSUFBSUosT0FBT0ksSUFBSztnQkFDOUIsTUFBTUMsTUFBTUMsU0FBU0MsYUFBYSxDQUFDO2dCQUNuQ0YsSUFBSUcsR0FBRyxHQUFHWixNQUFNLENBQUNLLEtBQUtDLEtBQUssQ0FBQ0QsS0FBS0UsTUFBTSxLQUFLUCxPQUFPYSxNQUFNLEVBQUU7Z0JBQzNESixJQUFJSyxTQUFTLEdBQUc7Z0JBRWhCLGNBQWM7Z0JBQ2RMLElBQUlNLEtBQUssQ0FBQ0MsSUFBSSxHQUFHLENBQUMsRUFBRWIsRUFBRWMsT0FBTyxDQUFDLEVBQUUsQ0FBQztnQkFDakNSLElBQUlNLEtBQUssQ0FBQ0csR0FBRyxHQUFHLENBQUMsRUFBRWYsRUFBRWdCLE9BQU8sQ0FBQyxFQUFFLENBQUM7Z0JBRWhDLHdCQUF3QjtnQkFDeEIsTUFBTUMsUUFBUWYsS0FBS0UsTUFBTSxLQUFLLElBQUlGLEtBQUtnQixFQUFFO2dCQUN6QyxNQUFNQyxXQUFXakIsS0FBS0UsTUFBTSxLQUFLLEtBQUssSUFBSSxzQkFBc0I7Z0JBQ2hFLE1BQU1nQixJQUFJbEIsS0FBS21CLEdBQUcsQ0FBQ0osU0FBU0U7Z0JBQzVCLE1BQU1HLElBQUlwQixLQUFLcUIsR0FBRyxDQUFDTixTQUFTRTtnQkFFNUJiLElBQUlNLEtBQUssQ0FBQ1ksV0FBVyxDQUFDLE9BQU8sQ0FBQyxFQUFFSixFQUFFLEVBQUUsQ0FBQztnQkFDckNkLElBQUlNLEtBQUssQ0FBQ1ksV0FBVyxDQUFDLE9BQU8sQ0FBQyxFQUFFRixFQUFFLEVBQUUsQ0FBQztnQkFDckNoQixJQUFJTSxLQUFLLENBQUNZLFdBQVcsQ0FBQyxXQUFXLENBQUMsRUFBRSxNQUFNdEIsS0FBS0UsTUFBTSxLQUFLLElBQUksQ0FBQztnQkFFL0RHLFNBQVNrQixJQUFJLENBQUNDLFdBQVcsQ0FBQ3BCO2dCQUMxQnFCLFdBQVcsSUFBTXJCLElBQUlzQixNQUFNLElBQUk7WUFDakM7WUFFQSxNQUFNQyxRQUFRLElBQUlDLE1BQU07WUFDeEJELE1BQU1FLE1BQU0sR0FBRztZQUNmRixNQUFNRyxJQUFJLEdBQUdDLEtBQUssQ0FBQyxLQUFPO1FBQzVCO1FBRUExQixTQUFTMkIsZ0JBQWdCLENBQUMsU0FBU25DO1FBQ25DLE9BQU8sSUFBTVEsU0FBUzRCLG1CQUFtQixDQUFDLFNBQVNwQztJQUNyRCxHQUFHLEVBQUU7SUFFTCxPQUFPO0FBQ1QiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9mZWVkLXRoZS1jaGFpbmJ1bm55Ly4vY29tcG9uZW50cy9DbGlja1NwbGFzaEVmZmVjdC50c3g/MmRiOCJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBjb21wb25lbnRzL0NsaWNrU3BsYXNoRWZmZWN0LnRzeFxyXG5pbXBvcnQgeyB1c2VFZmZlY3QgfSBmcm9tIFwicmVhY3RcIjtcclxuXHJcbmNvbnN0IElNQUdFUyA9IFtcclxuXCIvZm9vZHMvY2Fycm90LnBuZ1wiLFxyXG4gICBcIi9mb29kcy9jYXJyb3QucG5nXCIsXHJcbiAgIFwiL2Zvb2RzL2NhcnJvdC5wbmdcIixcclxuICAgXCIvZm9vZHMvY2Fycm90LnBuZ1wiLFxyXG5dO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQ2xpY2tTcGxhc2hFZmZlY3QoKSB7XHJcbiAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgIGNvbnN0IGhhbmRsZUNsaWNrID0gKGU6IE1vdXNlRXZlbnQpID0+IHtcclxuICAgICAgY29uc3QgY291bnQgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiA0KSArIDQ7XHJcblxyXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvdW50OyBpKyspIHtcclxuICAgICAgICBjb25zdCBpbWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW1nXCIpO1xyXG4gICAgICAgIGltZy5zcmMgPSBJTUFHRVNbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogSU1BR0VTLmxlbmd0aCldO1xyXG4gICAgICAgIGltZy5jbGFzc05hbWUgPSBcImZpeGVkIHBvaW50ZXItZXZlbnRzLW5vbmUgei01MCBzcGxhc2gtaXRlbVwiO1xyXG5cclxuICAgICAgICAvLyDZhdmI2YLYuduM2Kog2LTYsdmI2LlcclxuICAgICAgICBpbWcuc3R5bGUubGVmdCA9IGAke2UuY2xpZW50WH1weGA7XHJcbiAgICAgICAgaW1nLnN0eWxlLnRvcCA9IGAke2UuY2xpZW50WX1weGA7XHJcblxyXG4gICAgICAgIC8vINis2YfYqiDZiCDYtNiv2Kog2b7Ysdiq2KfYqCDYsdmG2K/ZiNmFXHJcbiAgICAgICAgY29uc3QgYW5nbGUgPSBNYXRoLnJhbmRvbSgpICogMiAqIE1hdGguUEk7XHJcbiAgICAgICAgY29uc3QgZGlzdGFuY2UgPSBNYXRoLnJhbmRvbSgpICogODAgKyA1MDsgLy8g2KjbjNmGIDUwINiq2KcgMTMwINm+24zaqdiz2YRcclxuICAgICAgICBjb25zdCB4ID0gTWF0aC5jb3MoYW5nbGUpICogZGlzdGFuY2U7XHJcbiAgICAgICAgY29uc3QgeSA9IE1hdGguc2luKGFuZ2xlKSAqIGRpc3RhbmNlO1xyXG5cclxuICAgICAgICBpbWcuc3R5bGUuc2V0UHJvcGVydHkoXCItLXhcIiwgYCR7eH1weGApO1xyXG4gICAgICAgIGltZy5zdHlsZS5zZXRQcm9wZXJ0eShcIi0teVwiLCBgJHt5fXB4YCk7XHJcbiAgICAgICAgaW1nLnN0eWxlLnNldFByb3BlcnR5KFwiLS1zY2FsZVwiLCBgJHswLjggKyBNYXRoLnJhbmRvbSgpICogMC42fWApO1xyXG5cclxuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGltZyk7XHJcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiBpbWcucmVtb3ZlKCksIDgwMCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGNvbnN0IGF1ZGlvID0gbmV3IEF1ZGlvKFwiL3NmeC9wb3AubXAzXCIpO1xyXG4gICAgICBhdWRpby52b2x1bWUgPSAwLjU7XHJcbiAgICAgIGF1ZGlvLnBsYXkoKS5jYXRjaCgoKSA9PiB7fSk7XHJcbiAgICB9O1xyXG5cclxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBoYW5kbGVDbGljayk7XHJcbiAgICByZXR1cm4gKCkgPT4gZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGhhbmRsZUNsaWNrKTtcclxuICB9LCBbXSk7XHJcblxyXG4gIHJldHVybiBudWxsO1xyXG59XHJcbiJdLCJuYW1lcyI6WyJ1c2VFZmZlY3QiLCJJTUFHRVMiLCJDbGlja1NwbGFzaEVmZmVjdCIsImhhbmRsZUNsaWNrIiwiZSIsImNvdW50IiwiTWF0aCIsImZsb29yIiwicmFuZG9tIiwiaSIsImltZyIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsInNyYyIsImxlbmd0aCIsImNsYXNzTmFtZSIsInN0eWxlIiwibGVmdCIsImNsaWVudFgiLCJ0b3AiLCJjbGllbnRZIiwiYW5nbGUiLCJQSSIsImRpc3RhbmNlIiwieCIsImNvcyIsInkiLCJzaW4iLCJzZXRQcm9wZXJ0eSIsImJvZHkiLCJhcHBlbmRDaGlsZCIsInNldFRpbWVvdXQiLCJyZW1vdmUiLCJhdWRpbyIsIkF1ZGlvIiwidm9sdW1lIiwicGxheSIsImNhdGNoIiwiYWRkRXZlbnRMaXN0ZW5lciIsInJlbW92ZUV2ZW50TGlzdGVuZXIiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./components/ClickSplashEffect.tsx\n");

/***/ }),

/***/ "./pages/_app.tsx":
/*!************************!*\
  !*** ./pages/_app.tsx ***!
  \************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ MyApp)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../styles/globals.css */ \"./styles/globals.css\");\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_styles_globals_css__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var wagmi__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! wagmi */ \"wagmi\");\n/* harmony import */ var _tanstack_react_query__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @tanstack/react-query */ \"@tanstack/react-query\");\n/* harmony import */ var _components_ClickSplashEffect__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../components/ClickSplashEffect */ \"./components/ClickSplashEffect.tsx\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([wagmi__WEBPACK_IMPORTED_MODULE_2__, _tanstack_react_query__WEBPACK_IMPORTED_MODULE_3__]);\n([wagmi__WEBPACK_IMPORTED_MODULE_2__, _tanstack_react_query__WEBPACK_IMPORTED_MODULE_3__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);\n// pages/_app.tsx\n\n\n\n\n\n\nconst megaETH = {\n    id: 6342,\n    name: \"MegaETH Testnet\",\n    nativeCurrency: {\n        name: \"MEGA\",\n        symbol: \"MEGA\",\n        decimals: 18\n    },\n    rpcUrls: {\n        default: {\n            http: [\n                \"https://rpc.megaeth.xyz\"\n            ]\n        }\n    },\n    blockExplorers: {\n        default: {\n            name: \"MegaETH Explorer\",\n            url: \"https://explorer.megaeth.xyz\"\n        }\n    },\n    testnet: true\n};\nconst config = (0,wagmi__WEBPACK_IMPORTED_MODULE_2__.createConfig)({\n    chains: [\n        megaETH\n    ],\n    transports: {\n        [megaETH.id]: (0,wagmi__WEBPACK_IMPORTED_MODULE_2__.http)(\"https://rpc.megaeth.xyz\")\n    },\n    ssr: true\n});\nconst queryClient = new _tanstack_react_query__WEBPACK_IMPORTED_MODULE_3__.QueryClient();\nfunction MyApp({ Component, pageProps }) {\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(wagmi__WEBPACK_IMPORTED_MODULE_2__.WagmiConfig, {\n        config: config,\n        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_tanstack_react_query__WEBPACK_IMPORTED_MODULE_3__.QueryClientProvider, {\n            client: queryClient,\n            children: [\n                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_components_ClickSplashEffect__WEBPACK_IMPORTED_MODULE_4__[\"default\"], {}, void 0, false, {\n                    fileName: \"C:\\\\Users\\\\Comtel\\\\feed-the-chainbunny\\\\pages\\\\_app.tsx\",\n                    lineNumber: 43,\n                    columnNumber: 9\n                }, this),\n                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Component, {\n                    ...pageProps\n                }, void 0, false, {\n                    fileName: \"C:\\\\Users\\\\Comtel\\\\feed-the-chainbunny\\\\pages\\\\_app.tsx\",\n                    lineNumber: 44,\n                    columnNumber: 9\n                }, this)\n            ]\n        }, void 0, true, {\n            fileName: \"C:\\\\Users\\\\Comtel\\\\feed-the-chainbunny\\\\pages\\\\_app.tsx\",\n            lineNumber: 42,\n            columnNumber: 7\n        }, this)\n    }, void 0, false, {\n        fileName: \"C:\\\\Users\\\\Comtel\\\\feed-the-chainbunny\\\\pages\\\\_app.tsx\",\n        lineNumber: 41,\n        columnNumber: 5\n    }, this);\n}\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9wYWdlcy9fYXBwLnRzeCIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFBLGlCQUFpQjs7QUFDYztBQUVtQjtBQUNyQjtBQUU0QztBQUNUO0FBRWhFLE1BQU1NLFVBQWlCO0lBQ3JCQyxJQUFJO0lBQ0pDLE1BQU07SUFDTkMsZ0JBQWdCO1FBQ2RELE1BQU07UUFDTkUsUUFBUTtRQUNSQyxVQUFVO0lBQ1o7SUFDQUMsU0FBUztRQUNQQyxTQUFTO1lBQ1BYLE1BQU07Z0JBQUM7YUFBMEI7UUFDbkM7SUFDRjtJQUNBWSxnQkFBZ0I7UUFDZEQsU0FBUztZQUFFTCxNQUFNO1lBQW9CTyxLQUFLO1FBQStCO0lBQzNFO0lBQ0FDLFNBQVM7QUFDWDtBQUVBLE1BQU1DLFNBQVNoQixtREFBWUEsQ0FBQztJQUMxQmlCLFFBQVE7UUFBQ1o7S0FBUTtJQUNqQmEsWUFBWTtRQUNWLENBQUNiLFFBQVFDLEVBQUUsQ0FBQyxFQUFFTCwyQ0FBSUEsQ0FBQztJQUNyQjtJQUNBa0IsS0FBSztBQUNQO0FBRUEsTUFBTUMsY0FBYyxJQUFJbEIsOERBQVdBO0FBRXBCLFNBQVNtQixNQUFNLEVBQUVDLFNBQVMsRUFBRUMsU0FBUyxFQUFZO0lBQzlELHFCQUNFLDhEQUFDeEIsOENBQVdBO1FBQUNpQixRQUFRQTtrQkFDbkIsNEVBQUNiLHNFQUFtQkE7WUFBQ3FCLFFBQVFKOzs4QkFDM0IsOERBQUNoQixxRUFBaUJBOzs7Ozs4QkFDbEIsOERBQUNrQjtvQkFBVyxHQUFHQyxTQUFTOzs7Ozs7Ozs7Ozs7Ozs7OztBQUloQyIsInNvdXJjZXMiOlsid2VicGFjazovL2ZlZWQtdGhlLWNoYWluYnVubnkvLi9wYWdlcy9fYXBwLnRzeD8yZmJlIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIHBhZ2VzL19hcHAudHN4XHJcbmltcG9ydCAnLi4vc3R5bGVzL2dsb2JhbHMuY3NzJztcclxuaW1wb3J0IHR5cGUgeyBBcHBQcm9wcyB9IGZyb20gJ25leHQvYXBwJztcclxuaW1wb3J0IHsgV2FnbWlDb25maWcsIGNyZWF0ZUNvbmZpZyB9IGZyb20gJ3dhZ21pJztcclxuaW1wb3J0IHsgaHR0cCB9IGZyb20gJ3dhZ21pJztcclxuaW1wb3J0IHsgQ2hhaW4gfSBmcm9tICd3YWdtaS9jaGFpbnMnO1xyXG5pbXBvcnQgeyBRdWVyeUNsaWVudCwgUXVlcnlDbGllbnRQcm92aWRlciB9IGZyb20gJ0B0YW5zdGFjay9yZWFjdC1xdWVyeSc7XHJcbmltcG9ydCBDbGlja1NwbGFzaEVmZmVjdCBmcm9tICcuLi9jb21wb25lbnRzL0NsaWNrU3BsYXNoRWZmZWN0JztcclxuXHJcbmNvbnN0IG1lZ2FFVEg6IENoYWluID0ge1xyXG4gIGlkOiA2MzQyLFxyXG4gIG5hbWU6ICdNZWdhRVRIIFRlc3RuZXQnLFxyXG4gIG5hdGl2ZUN1cnJlbmN5OiB7XHJcbiAgICBuYW1lOiAnTUVHQScsXHJcbiAgICBzeW1ib2w6ICdNRUdBJyxcclxuICAgIGRlY2ltYWxzOiAxOCxcclxuICB9LFxyXG4gIHJwY1VybHM6IHtcclxuICAgIGRlZmF1bHQ6IHtcclxuICAgICAgaHR0cDogWydodHRwczovL3JwYy5tZWdhZXRoLnh5eiddLFxyXG4gICAgfSxcclxuICB9LFxyXG4gIGJsb2NrRXhwbG9yZXJzOiB7XHJcbiAgICBkZWZhdWx0OiB7IG5hbWU6ICdNZWdhRVRIIEV4cGxvcmVyJywgdXJsOiAnaHR0cHM6Ly9leHBsb3Jlci5tZWdhZXRoLnh5eicgfSxcclxuICB9LFxyXG4gIHRlc3RuZXQ6IHRydWUsXHJcbn07XHJcblxyXG5jb25zdCBjb25maWcgPSBjcmVhdGVDb25maWcoe1xyXG4gIGNoYWluczogW21lZ2FFVEhdLFxyXG4gIHRyYW5zcG9ydHM6IHtcclxuICAgIFttZWdhRVRILmlkXTogaHR0cCgnaHR0cHM6Ly9ycGMubWVnYWV0aC54eXonKSxcclxuICB9LFxyXG4gIHNzcjogdHJ1ZSxcclxufSk7XHJcblxyXG5jb25zdCBxdWVyeUNsaWVudCA9IG5ldyBRdWVyeUNsaWVudCgpO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gTXlBcHAoeyBDb21wb25lbnQsIHBhZ2VQcm9wcyB9OiBBcHBQcm9wcykge1xyXG4gIHJldHVybiAoXHJcbiAgICA8V2FnbWlDb25maWcgY29uZmlnPXtjb25maWd9PlxyXG4gICAgICA8UXVlcnlDbGllbnRQcm92aWRlciBjbGllbnQ9e3F1ZXJ5Q2xpZW50fT5cclxuICAgICAgICA8Q2xpY2tTcGxhc2hFZmZlY3QgLz5cclxuICAgICAgICA8Q29tcG9uZW50IHsuLi5wYWdlUHJvcHN9IC8+XHJcbiAgICAgIDwvUXVlcnlDbGllbnRQcm92aWRlcj5cclxuICAgIDwvV2FnbWlDb25maWc+XHJcbiAgKTtcclxufVxyXG4iXSwibmFtZXMiOlsiV2FnbWlDb25maWciLCJjcmVhdGVDb25maWciLCJodHRwIiwiUXVlcnlDbGllbnQiLCJRdWVyeUNsaWVudFByb3ZpZGVyIiwiQ2xpY2tTcGxhc2hFZmZlY3QiLCJtZWdhRVRIIiwiaWQiLCJuYW1lIiwibmF0aXZlQ3VycmVuY3kiLCJzeW1ib2wiLCJkZWNpbWFscyIsInJwY1VybHMiLCJkZWZhdWx0IiwiYmxvY2tFeHBsb3JlcnMiLCJ1cmwiLCJ0ZXN0bmV0IiwiY29uZmlnIiwiY2hhaW5zIiwidHJhbnNwb3J0cyIsInNzciIsInF1ZXJ5Q2xpZW50IiwiTXlBcHAiLCJDb21wb25lbnQiLCJwYWdlUHJvcHMiLCJjbGllbnQiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./pages/_app.tsx\n");

/***/ }),

/***/ "./styles/globals.css":
/*!****************************!*\
  !*** ./styles/globals.css ***!
  \****************************/
/***/ (() => {



/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("react");

/***/ }),

/***/ "react/jsx-dev-runtime":
/*!****************************************!*\
  !*** external "react/jsx-dev-runtime" ***!
  \****************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react/jsx-dev-runtime");

/***/ }),

/***/ "@tanstack/react-query":
/*!****************************************!*\
  !*** external "@tanstack/react-query" ***!
  \****************************************/
/***/ ((module) => {

"use strict";
module.exports = import("@tanstack/react-query");;

/***/ }),

/***/ "wagmi":
/*!************************!*\
  !*** external "wagmi" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = import("wagmi");;

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("./pages/_app.tsx"));
module.exports = __webpack_exports__;

})();