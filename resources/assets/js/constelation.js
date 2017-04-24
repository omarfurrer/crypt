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
//                        color: 'rgba(256, 256, 256,1)',
                        color: 'rgba(29, 66, 98,1)',
//                        width: 4
                        width: 7
                    },
                    line: {
//                        color: 'rgba(0, 0, 0, .5)',
                        color: 'rgba(256, 256, 256, .8)',
                        width: 0.3
                    },
                    position: {
                        x: 0, // This value will be overwritten at startup
                        y: 0 // This value will be overwritten at startup
                    },
                    width: window.innerWidth,
                    height: window.innerHeight - 7,
//                    height: window.innerHeight,
                    velocity: 0.1,
//                    length: 150,
//                    length: 20,
//                    distance: 120,
                    distance: 500,
//                    radius: 250,
//                    radius: 5,
                    radius: 7,
                    hoverExpansion: 30,
                    hoverExpansionA: 0.4,
                    clickFlag: false,
                    ratio:
                            (window.devicePixelRatio || 1) /
                            (context.webkitBackingStorePixelRatio ||
                                    context.mozBackingStorePixelRatio ||
                                    context.msBackingStorePixelRatio ||
                                    context.oBackingStorePixelRatio ||
                                    context.backingStorePixelRatio || 1)

                    ,
                    stars: []
                },
                config = $.extend(true, {}, defaults, options);

        function Star(bookmark) {
//            this.x = Math.random() * canvas.width;
//            this.y = Math.random() * canvas.height;

            this.x = Math.floor(Math.random() * (canvas.width - 1)) + 1;
            this.y = Math.floor(Math.random() * (canvas.height - 1)) + 1;

            this.vx = (config.velocity - (Math.random() * 0.5));
            this.vy = (config.velocity - (Math.random() * 0.5));

//            this.radius = Math.random() * config.star.width;
            this.data = bookmark;
            this.radius = config.star.width * ((bookmark.visit_count == 0 ? 0.4 : bookmark.visit_count / config.star.width) / 0.7);
            this.originalRadius = this.radius;
//            this.hoverRadius = config.radius;
            this.hoverRadius = this.radius;
        }

        Star.prototype = {
            create: function () {
//                var img = new Image();
//                var url = this.data.image != null ? this.data.image : 'assets/images/bookmark-image-placeholder.png';
//                img.src = url;
//                var pattern = context.createPattern(img, 'no-repeat');
                context.beginPath();
                context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
                context.fillStyle = config.star.color;
//                context.fillStyle = pattern;
                context.fill();
//                context.stroke();
            },
            onHover: function () {
                this.vx = 0;
                this.vy = 0;
                this.popup();
//                context.font = "30px Arial";
//                context.fillText(this.data.title, this.x - 15, this.y - 15);

                context.fillStyle = "white"; // font color to write the text with
                var text = this.data.title;
//                var font = "bold " + this.radius + "px serif";
                var font = "bold 30px Lato";
                context.font = font;
// Move it down by half the text height and left by half the text width
                var width = context.measureText(text).width;
                var height = context.measureText("w").width; // this is a GUESS of height
                context.fillText(text, this.x - (width / 2), this.y + (height / 2));
//                context.fillStyle = 'rgba(29, 66, 98,1)';
            },
            onExit: function () {
                if (this.vx == 0 && this.vy == 0) {
                    this.vx = (config.velocity - (Math.random() * 0.5));
                    this.vy = (config.velocity - (Math.random() * 0.5));
                }
                this.popdown();
//                context.fillStyle = config.star.color;

            },
            popup: function () {
                if (this.radius < this.originalRadius + config.hoverExpansion) {
                    this.radius += config.hoverExpansionA;
                    this.hoverRadius = this.radius;
                }
            },
            popdown: function () {
                if (this.radius > this.originalRadius) {
                    this.radius -= config.hoverExpansionA;
                    this.hoverRadius = this.originalRadius;
                }

            },
            animate: function () {
                var i;
                for (i = 0; i < config.length; i++) {

                    var star = config.stars[i];

                    if (star.y - star.radius <= 0 || star.y + star.radius >= canvas.height) {
                        star.vx = star.vx;
                        star.vy = -star.vy;
                    } else if (star.x - star.radius <= 0 || star.x + star.radius >= canvas.width) {
                        star.vx = -star.vx;
                        star.vy = star.vy;
                    }

                    star.x += star.vx;
                    star.y += star.vy;
                    var j;
                    for (j = 0; j < config.length; j++) {
                        var jStar = config.stars[j];
                        if (star.x != jStar.x && star.y != jStar.y) {
                            if (star.y + star.radius >= jStar.y - jStar.radius && star.y - star.radius <= jStar.y + jStar.radius) {
                                if (star.x + star.radius >= jStar.x - jStar.radius && star.x - star.radius <= jStar.x + jStar.radius) {
                                    var tempjvx = jStar.vx;
                                    var tempjvy = jStar.vy;
                                    jStar.vx = star.vx;
                                    jStar.vy = star.vy;
                                    star.vx = tempjvx;
                                    star.vy = tempjvy;
                                }
                            }
                        }
                    }
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
//                            console.log(iStar.data.title);
                            if (
                                    (iStar.x - jStar.x) < config.distance &&
                                    (iStar.y - jStar.y) < config.distance &&
                                    (iStar.x - jStar.x) > -config.distance &&
                                    (iStar.y - jStar.y) > -config.distance &&
                                    iStar.data.domain_url == jStar.data.domain_url
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
            console.log(config.ratio);
            canvas.width = config.width;
            canvas.height = config.height;
//            canvas.width = config.width * config.ratio;
//            canvas.height = config.height * config.ratio;
//            canvas.style.width = config.width + 'px';//actual width of canvas
//            canvas.style.height = config.height + 'px';//actual height of canvas
//            context.setTransform(config.ratio, 0, 0, config.ratio, 0, 0);
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