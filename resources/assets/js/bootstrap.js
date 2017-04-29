
//window._ = require('lodash');

/**
 * We'll load jQuery and the Bootstrap jQuery plugin which provides support
 * for JavaScript based Bootstrap features such as modals and tabs. This
 * code may be modified to fit the specific needs of your application.
 */

//window.$ = window.jQuery = require('jquery');
//require('bootstrap-sass');

/**
 * Vue is a modern JavaScript library for building interactive web interfaces
 * using reactive data binding and reusable components. Vue's API is clean
 * and simple, leaving you to focus on building your next great project.
 */

//window.Vue = require('vue');
//require('vue-resource');

/**
 * We'll register a HTTP interceptor to attach the "CSRF" header to each of
 * the outgoing requests issued by this application. The CSRF middleware
 * included with Laravel will automatically verify the header's value.
 */

//Vue.http.interceptors.push((request, next) => {
//    request.headers['X-CSRF-TOKEN'] = Laravel.csrfToken;
//
//    next();
//});

/**
 * Echo exposes an expressive API for subscribing to channels and listening
 * for events that are broadcast by Laravel. Echo and event broadcasting
 * allows your team to easily build robust real-time web applications.
 */

import Echo from "laravel-echo";
import Pusher from "pusher-js";



var token = localStorage.getItem('satellizer_token');
console.log(token);
window.Echo = new Echo({
    broadcaster: 'pusher',
    key: 'd1e5009554a0bcd357a4',
    cluster: 'eu',
    encrypted: true,
//    host: window.location.hostname,
//    auth:
//            {
//                headers:
//                        {
//                            'Authorization': 'Bearer ' + token
//                        }
//            }
});

window.Echo.channel('bookmarks')
        .listen('.App.Events.Bookmarks.Stored', (e) => {
            console.log('hi');
            console.log(e);
        });
