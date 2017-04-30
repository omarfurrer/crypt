/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmory imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmory exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		Object.defineProperty(exports, name, {
/******/ 			configurable: false,
/******/ 			enumerable: true,
/******/ 			get: getter
/******/ 		});
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

eval("\r\n//window._ = require('lodash');\r\n\r\n/**\r\n * We'll load jQuery and the Bootstrap jQuery plugin which provides support\r\n * for JavaScript based Bootstrap features such as modals and tabs. This\r\n * code may be modified to fit the specific needs of your application.\r\n */\r\n\r\n//window.$ = window.jQuery = require('jquery');\r\n//require('bootstrap-sass');\r\n\r\n/**\r\n * Vue is a modern JavaScript library for building interactive web interfaces\r\n * using reactive data binding and reusable components. Vue's API is clean\r\n * and simple, leaving you to focus on building your next great project.\r\n */\r\n\r\n//window.Vue = require('vue');\r\n//require('vue-resource');\r\n\r\n/**\r\n * We'll register a HTTP interceptor to attach the \"CSRF\" header to each of\r\n * the outgoing requests issued by this application. The CSRF middleware\r\n * included with Laravel will automatically verify the header's value.\r\n */\r\n\r\n//Vue.http.interceptors.push((request, next) => {\r\n//    request.headers['X-CSRF-TOKEN'] = Laravel.csrfToken;\r\n//\r\n//    next();\r\n//});\r\n\r\n/**\r\n * Echo exposes an expressive API for subscribing to channels and listening\r\n * for events that are broadcast by Laravel. Echo and event broadcasting\r\n * allows your team to easily build robust real-time web applications.\r\n */\r\n\r\n//import Echo from \"laravel-echo\";\r\n//import Pusher from \"pusher-js\";\r\n\r\n\r\n//var token = localStorage.getItem('satellizer_token');\r\n//console.log(token);\r\n//window.Echo = new Echo();\r\n//window.Echo = new Echo({\r\n//    broadcaster: 'pusher',\r\n//    key: 'd1e5009554a0bcd357a4',\r\n//    cluster: 'eu',\r\n//    encrypted: true,\r\n////    host: window.location.hostname,\r\n//    auth:\r\n//            {\r\n//                headers:\r\n//                        {\r\n//                            'Authorization': 'Bearer ' + token\r\n//                        }\r\n//            }\r\n//});\r\n\r\n//var user = JSON.parse(localStorage.getItem('user'));\r\n//window.Echo.private('users.' + user.id + '.bookmarks')\r\n//        .listen('.App.Events.Bookmarks.Stored', (e) => {\r\n//            console.log('hi');\r\n//            console.log(e);\r\n//        });\r\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMC5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy9yZXNvdXJjZXMvYXNzZXRzL2pzL2Jvb3RzdHJhcC5qcz81ZTYzIl0sInNvdXJjZXNDb250ZW50IjpbIlxyXG4vL3dpbmRvdy5fID0gcmVxdWlyZSgnbG9kYXNoJyk7XHJcblxyXG4vKipcclxuICogV2UnbGwgbG9hZCBqUXVlcnkgYW5kIHRoZSBCb290c3RyYXAgalF1ZXJ5IHBsdWdpbiB3aGljaCBwcm92aWRlcyBzdXBwb3J0XHJcbiAqIGZvciBKYXZhU2NyaXB0IGJhc2VkIEJvb3RzdHJhcCBmZWF0dXJlcyBzdWNoIGFzIG1vZGFscyBhbmQgdGFicy4gVGhpc1xyXG4gKiBjb2RlIG1heSBiZSBtb2RpZmllZCB0byBmaXQgdGhlIHNwZWNpZmljIG5lZWRzIG9mIHlvdXIgYXBwbGljYXRpb24uXHJcbiAqL1xyXG5cclxuLy93aW5kb3cuJCA9IHdpbmRvdy5qUXVlcnkgPSByZXF1aXJlKCdqcXVlcnknKTtcclxuLy9yZXF1aXJlKCdib290c3RyYXAtc2FzcycpO1xyXG5cclxuLyoqXHJcbiAqIFZ1ZSBpcyBhIG1vZGVybiBKYXZhU2NyaXB0IGxpYnJhcnkgZm9yIGJ1aWxkaW5nIGludGVyYWN0aXZlIHdlYiBpbnRlcmZhY2VzXHJcbiAqIHVzaW5nIHJlYWN0aXZlIGRhdGEgYmluZGluZyBhbmQgcmV1c2FibGUgY29tcG9uZW50cy4gVnVlJ3MgQVBJIGlzIGNsZWFuXHJcbiAqIGFuZCBzaW1wbGUsIGxlYXZpbmcgeW91IHRvIGZvY3VzIG9uIGJ1aWxkaW5nIHlvdXIgbmV4dCBncmVhdCBwcm9qZWN0LlxyXG4gKi9cclxuXHJcbi8vd2luZG93LlZ1ZSA9IHJlcXVpcmUoJ3Z1ZScpO1xyXG4vL3JlcXVpcmUoJ3Z1ZS1yZXNvdXJjZScpO1xyXG5cclxuLyoqXHJcbiAqIFdlJ2xsIHJlZ2lzdGVyIGEgSFRUUCBpbnRlcmNlcHRvciB0byBhdHRhY2ggdGhlIFwiQ1NSRlwiIGhlYWRlciB0byBlYWNoIG9mXHJcbiAqIHRoZSBvdXRnb2luZyByZXF1ZXN0cyBpc3N1ZWQgYnkgdGhpcyBhcHBsaWNhdGlvbi4gVGhlIENTUkYgbWlkZGxld2FyZVxyXG4gKiBpbmNsdWRlZCB3aXRoIExhcmF2ZWwgd2lsbCBhdXRvbWF0aWNhbGx5IHZlcmlmeSB0aGUgaGVhZGVyJ3MgdmFsdWUuXHJcbiAqL1xyXG5cclxuLy9WdWUuaHR0cC5pbnRlcmNlcHRvcnMucHVzaCgocmVxdWVzdCwgbmV4dCkgPT4ge1xyXG4vLyAgICByZXF1ZXN0LmhlYWRlcnNbJ1gtQ1NSRi1UT0tFTiddID0gTGFyYXZlbC5jc3JmVG9rZW47XHJcbi8vXHJcbi8vICAgIG5leHQoKTtcclxuLy99KTtcclxuXHJcbi8qKlxyXG4gKiBFY2hvIGV4cG9zZXMgYW4gZXhwcmVzc2l2ZSBBUEkgZm9yIHN1YnNjcmliaW5nIHRvIGNoYW5uZWxzIGFuZCBsaXN0ZW5pbmdcclxuICogZm9yIGV2ZW50cyB0aGF0IGFyZSBicm9hZGNhc3QgYnkgTGFyYXZlbC4gRWNobyBhbmQgZXZlbnQgYnJvYWRjYXN0aW5nXHJcbiAqIGFsbG93cyB5b3VyIHRlYW0gdG8gZWFzaWx5IGJ1aWxkIHJvYnVzdCByZWFsLXRpbWUgd2ViIGFwcGxpY2F0aW9ucy5cclxuICovXHJcblxyXG4vL2ltcG9ydCBFY2hvIGZyb20gXCJsYXJhdmVsLWVjaG9cIjtcclxuLy9pbXBvcnQgUHVzaGVyIGZyb20gXCJwdXNoZXItanNcIjtcclxuXHJcblxyXG4vL3ZhciB0b2tlbiA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdzYXRlbGxpemVyX3Rva2VuJyk7XHJcbi8vY29uc29sZS5sb2codG9rZW4pO1xyXG4vL3dpbmRvdy5FY2hvID0gbmV3IEVjaG8oKTtcclxuLy93aW5kb3cuRWNobyA9IG5ldyBFY2hvKHtcclxuLy8gICAgYnJvYWRjYXN0ZXI6ICdwdXNoZXInLFxyXG4vLyAgICBrZXk6ICdkMWU1MDA5NTU0YTBiY2QzNTdhNCcsXHJcbi8vICAgIGNsdXN0ZXI6ICdldScsXHJcbi8vICAgIGVuY3J5cHRlZDogdHJ1ZSxcclxuLy8vLyAgICBob3N0OiB3aW5kb3cubG9jYXRpb24uaG9zdG5hbWUsXHJcbi8vICAgIGF1dGg6XHJcbi8vICAgICAgICAgICAge1xyXG4vLyAgICAgICAgICAgICAgICBoZWFkZXJzOlxyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ0F1dGhvcml6YXRpb24nOiAnQmVhcmVyICcgKyB0b2tlblxyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuLy8gICAgICAgICAgICB9XHJcbi8vfSk7XHJcblxyXG4vL3ZhciB1c2VyID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgndXNlcicpKTtcclxuLy93aW5kb3cuRWNoby5wcml2YXRlKCd1c2Vycy4nICsgdXNlci5pZCArICcuYm9va21hcmtzJylcclxuLy8gICAgICAgIC5saXN0ZW4oJy5BcHAuRXZlbnRzLkJvb2ttYXJrcy5TdG9yZWQnLCAoZSkgPT4ge1xyXG4vLyAgICAgICAgICAgIGNvbnNvbGUubG9nKCdoaScpO1xyXG4vLyAgICAgICAgICAgIGNvbnNvbGUubG9nKGUpO1xyXG4vLyAgICAgICAgfSk7XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyByZXNvdXJjZXMvYXNzZXRzL2pzL2Jvb3RzdHJhcC5qcyJdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Iiwic291cmNlUm9vdCI6IiJ9");

/***/ },
/* 1 */,
/* 2 */,
/* 3 */
/***/ function(module, exports, __webpack_require__) {

eval("\r\n/**\r\n * First we will load all of this project's JavaScript dependencies which\r\n * include Vue and Vue Resource. This gives a great starting point for\r\n * building robust, powerful web applications using Vue and Laravel.\r\n */\r\n\r\n__webpack_require__(0);\r\n\r\n/**\r\n * Next, we will create a fresh Vue application instance and attach it to\r\n * the body of the page. From here, you may begin adding components to\r\n * the application, or feel free to tweak this setup for your needs.\r\n */\r\n\r\n//Vue.component('example', require('./components/Example.vue'));\r\n\r\n//const app = new Vue({\r\n//    el: 'body'\r\n//});\r\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMy5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy9yZXNvdXJjZXMvYXNzZXRzL2pzL2FwcC5qcz84YjY3Il0sInNvdXJjZXNDb250ZW50IjpbIlxyXG4vKipcclxuICogRmlyc3Qgd2Ugd2lsbCBsb2FkIGFsbCBvZiB0aGlzIHByb2plY3QncyBKYXZhU2NyaXB0IGRlcGVuZGVuY2llcyB3aGljaFxyXG4gKiBpbmNsdWRlIFZ1ZSBhbmQgVnVlIFJlc291cmNlLiBUaGlzIGdpdmVzIGEgZ3JlYXQgc3RhcnRpbmcgcG9pbnQgZm9yXHJcbiAqIGJ1aWxkaW5nIHJvYnVzdCwgcG93ZXJmdWwgd2ViIGFwcGxpY2F0aW9ucyB1c2luZyBWdWUgYW5kIExhcmF2ZWwuXHJcbiAqL1xyXG5cclxucmVxdWlyZSgnLi9ib290c3RyYXAnKTtcclxuXHJcbi8qKlxyXG4gKiBOZXh0LCB3ZSB3aWxsIGNyZWF0ZSBhIGZyZXNoIFZ1ZSBhcHBsaWNhdGlvbiBpbnN0YW5jZSBhbmQgYXR0YWNoIGl0IHRvXHJcbiAqIHRoZSBib2R5IG9mIHRoZSBwYWdlLiBGcm9tIGhlcmUsIHlvdSBtYXkgYmVnaW4gYWRkaW5nIGNvbXBvbmVudHMgdG9cclxuICogdGhlIGFwcGxpY2F0aW9uLCBvciBmZWVsIGZyZWUgdG8gdHdlYWsgdGhpcyBzZXR1cCBmb3IgeW91ciBuZWVkcy5cclxuICovXHJcblxyXG4vL1Z1ZS5jb21wb25lbnQoJ2V4YW1wbGUnLCByZXF1aXJlKCcuL2NvbXBvbmVudHMvRXhhbXBsZS52dWUnKSk7XHJcblxyXG4vL2NvbnN0IGFwcCA9IG5ldyBWdWUoe1xyXG4vLyAgICBlbDogJ2JvZHknXHJcbi8vfSk7XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyByZXNvdXJjZXMvYXNzZXRzL2pzL2FwcC5qcyJdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7QUFPQTtBQUNBOzs7Ozs7Ozs7Ozs7Iiwic291cmNlUm9vdCI6IiJ9");

/***/ }
/******/ ]);