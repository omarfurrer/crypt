/*
 * requestAnimationFrame pollyfill
 */
if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = (window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame || window.oRequestAnimationFrame || function (callback) {
        return window.setTimeout(callback, 1000 / 60);
    });
}

//$(document).ready(function () {



//});

/*!
 * Mantis.js / jQuery / Zepto.js plugin for Constellation
 * @version 1.2.2
 * @author Acauã Montiel <contato@acauamontiel.com.br>
 * @license http://acaua.mit-license.org/
 */
(function ($, window) {
    /**
     * Makes a nice constellation on canvas
     * @constructor Constellation
     */
    function Constellation(canvas, options) {
        var $canvas = $(canvas),
                context = canvas.getContext('2d'),
                defaults = {
                    star: {
//                        color: 'rgba(0, 0, 0, .5)',
                        color: 'rgba(256, 256, 256, .5)',
//                        width: 4
                        width: 7
                    },
                    line: {
//                        color: 'rgba(0, 0, 0, .5)',
                        color: 'rgba(256, 256, 256, .5)',
                        width: 1
                    },
                    position: {
                        x: 0, // This value will be overwritten at startup
                        y: 0 // This value will be overwritten at startup
                    },
                    width: window.innerWidth,
                    height: window.innerHeight - 7,
                    velocity: 0.1,
//                    length: 150,
//                    length: 20,
                    distance: 120,
//                    radius: 250,
//                    radius: 5,
                    radius: 7,
                    hoverExpansion: 20,
                    hoverExpansionA: 0.4,
                    clickFlag: false,
                    stars: []
                },
                config = $.extend(true, {}, defaults, options);

        function Star(bookmark) {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;

            this.vx = (config.velocity - (Math.random() * 0.5));
            this.vy = (config.velocity - (Math.random() * 0.5));

//            this.radius = Math.random() * config.star.width;
            this.radius = config.star.width;
            this.data = bookmark;
//            this.hoverRadius = config.radius;
            this.hoverRadius = this.radius;
        }

        Star.prototype = {
            create: function () {
                context.beginPath();
                context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
                context.fill();
            },
            onHover: function () {
                this.vx = 0;
                this.vy = 0;
//                this.popup();
                context.font = "30px Arial";
                context.fillText(this.data.title, this.x - 15, this.y - 15);
            },
            onExit: function () {
                if (this.vx == 0 && this.vy == 0) {
                    this.vx = (config.velocity - (Math.random() * 0.5));
                    this.vy = (config.velocity - (Math.random() * 0.5));
                }
//                this.popdown();
            },
            popup: function () {
                if (this.radius < config.star.width + config.hoverExpansion) {
                    this.radius += config.hoverExpansionA;
                    this.hoverRadius = this.radius;
                }
            },
            popdown: function () {
                if (this.radius > config.star.width) {
                    this.radius -= config.hoverExpansionA;
                    this.hoverRadius = config.radius;
                }
            },
            animate: function () {
                var i;
                for (i = 0; i < config.length; i++) {

                    var star = config.stars[i];

                    if (star.y - this.radius < 0 || star.y + this.radius > canvas.height) {
                        star.vx = star.vx;
                        star.vy = -star.vy;
                    } else if (star.x - this.radius < 0 || star.x + this.radius > canvas.width) {
                        star.vx = -star.vx;
                        star.vy = star.vy;
                    }

                    star.x += star.vx;
                    star.y += star.vy;
                }
            },
            line: function () {
                var length = config.length,
                        iStar,
                        jStar,
                        i,
                        j;

                for (i = 0; i < length; i++) {
                    for (j = 0; j < length; j++) {
                        iStar = config.stars[i];
                        jStar = config.stars[j];

                        if (
                                (iStar.x - config.position.x) < iStar.radius &&
                                (iStar.y - config.position.y) < iStar.radius &&
                                (iStar.x - config.position.x) > -iStar.radius &&
                                (iStar.y - config.position.y) > -iStar.radius
                                ) {
                            iStar.onHover();
                            if (config.clickFlag) {
                                var url = "http://google.com";
                                $("<a>").attr("href", iStar.data.url).attr("target", "_blank")[0].click();
                                config.clickFlag = false;
                            }
                            console.log(iStar.data.title);
                            if (
                                    (iStar.x - jStar.x) < config.distance &&
                                    (iStar.y - jStar.y) < config.distance &&
                                    (iStar.x - jStar.x) > -config.distance &&
                                    (iStar.y - jStar.y) > -config.distance
                                    ) {
                                context.beginPath();
                                context.moveTo(iStar.x, iStar.y);
                                context.lineTo(jStar.x, jStar.y);
                                context.stroke();
                                context.closePath();
                            }
                        } else {
                            iStar.onExit();
                        }
                    }
                }
                config.clickFlag = false;

            },
//            scan: function () {
//                var length = config.length,
//                        iStar,
//                        jStar,
//                        i,
//                        j;
//
//                for (i = 0; i < length; i++) {
//                    for (j = 0; j < length; j++) {
//                        iStar = config.stars[i];
//                        jStar = config.stars[j];
//
//                        if (
//                                (iStar.x - jStar.x) < config.distance &&
//                                (iStar.y - jStar.y) < config.distance &&
//                                (iStar.x - jStar.x) > -config.distance &&
//                                (iStar.y - jStar.y) > -config.distance
//                                ) {
//                            if (
//                                    (iStar.x - config.position.x) < iStar.radius &&
//                                    (iStar.y - config.position.y) < iStar.radius &&
//                                    (iStar.x - config.position.x) > -iStar.radius &&
//                                    (iStar.y - config.position.y) > -iStar.radius
//                                    ) {
//                                context.beginPath();
//                                context.moveTo(iStar.x, iStar.y);
//                                context.lineTo(jStar.x, jStar.y);
//                                context.stroke();
//                                context.closePath();
//                                iStar.onHover();
//                                if (config.clickFlag) {
//                                    var url = "http://google.com";
//                                    $("<a>").attr("href", iStar.data.url).attr("target", "_blank")[0].click();
//                                }
//                                console.log(iStar.data.title);
//                            } else {
//                                iStar.onExit();
//                            }
//                        }
//                    }
//                }
//                config.clickFlag = false;
//            }
        };

        this.createStars = function () {
            var length = config.bookmarks.length,
                    star,
                    i;

            context.clearRect(0, 0, canvas.width, canvas.height);

            for (i = 0; i < length; i++) {
                config.stars.push(new Star(config.bookmarks[i]));
                star = config.stars[i];

                star.create();
            }

            star.line();
            star.animate();
        };

        this.setCanvas = function () {
            canvas.width = config.width;
            canvas.height = config.height;
        };

        this.setContext = function () {
            context.fillStyle = config.star.color;
            context.strokeStyle = config.line.color;
            context.lineWidth = config.line.width;
        };

        this.setInitialPosition = function () {
            if (!options || !options.hasOwnProperty('position')) {
                config.position = {
                    x: canvas.width * 0.5,
                    y: canvas.height * 0.5
                };
            }
        };

        this.loop = function (callback) {
            callback();

            window.requestAnimationFrame(function () {
                this.loop(callback);
            }.bind(this));
        };

        this.bind = function () {
            $(window).on('mousemove', function (e) {
                config.position.x = e.pageX - $canvas.offset().left;
                config.position.y = e.pageY - $canvas.offset().top;
//                console.log(log);
            });
            $(window).on('mousedown', function (e) {
                config.clickFlag = true;
            });
        };

        this.init = function () {
            this.setCanvas();
            this.setContext();
            this.setInitialPosition();
            this.loop(this.createStars);
            this.bind();
        };
    }

    $.fn.constellation = function (options) {
        return this.each(function () {
            var c = new Constellation(this, options);
            c.init();
        });
    };


})($, window);