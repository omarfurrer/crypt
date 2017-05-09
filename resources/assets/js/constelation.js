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
//                context = canvas.getContext('2d', {alpha: false}),
                defaults = {
                    star: {
                        color: 'rgba(29, 66, 98,1)',
                        width: 7
                    },
                    line: {
                        color: 'rgba(256, 256, 256, .8)',
                        width: 0.3
                    },
                    // default mouse position
                    position: {
                        x: 0, // This value will be overwritten at startup
                        y: 0 // This value will be overwritten at startup
                    },
                    // canvas width
                    width: window.innerWidth,
                    // canvas height
                    height: window.innerHeight - 7,
                    // default star velocity
                    velocity: 0.1,
                    // minimum distance between 2 stars to draw a line between them
                    distance: 500,
                    // default star radius
                    radius: 7,
                    // maximum radius of which the star can expand to when hovering on it
                    hoverExpansion: 30,
                    // hover step that gets added or subtracted from the star until it reaches hover exapansion
                    hoverExpansionA: 0.4,
                    // detects if a mouse click has been made in a certain location in order to open the bookmark
                    clickFlag: false,
                    // no idea yet
                    ratio:
                            (window.devicePixelRatio || 1) /
                            (context.webkitBackingStorePixelRatio ||
                                    context.mozBackingStorePixelRatio ||
                                    context.msBackingStorePixelRatio ||
                                    context.oBackingStorePixelRatio ||
                                    context.backingStorePixelRatio || 1)

                    ,
                    // array of stars
                    stars: []
                },
                //config variable which holds default settings and additional options passed to the constellation object
                config = $.extend(true, {}, defaults, options);

        // Star object
        function Star(bookmark) {
            //initital x position
            this.x = Math.floor(Math.random() * (config.width - 1)) + 1;
            //initital y position
            this.y = Math.floor(Math.random() * (config.height - 1)) + 1;
            //initial x velocity
            this.vx = (config.velocity - (Math.random() * 0.5));
            //initial y velocity
            this.vy = (config.velocity - (Math.random() * 0.5));
            //bookmark data fetched from server
            this.data = bookmark;
            //initital radius, proportional with how many visit_counts a bookmark has
            this.radius = config.star.width * ((bookmark.visit_count == 0 ? 0.4 : bookmark.visit_count / config.star.width) / 0.7);
            //copy of the initial star radius to perserve it
            this.originalRadius = this.radius;
            //distance at which the mouse hovers on the bookmark to start on hover effects
            this.hoverRadius = this.radius;
        }

        // add functions to the star object
        Star.prototype = {
            // draw the star itself in a x,y position and with its radius
            create: function () {
//                var img = new Image();
//                var url = this.data.image != null ? this.data.image : 'assets/images/bookmark-image-placeholder.png';
//                img.src = url;
//                var pattern = context.createPattern(img, 'no-repeat');
                context.beginPath();
                context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
                // color the star
                context.fillStyle = config.star.color;
//                context.fillStyle = pattern;
                // Execute coloring
                context.fill();
//                context.stroke();
            },
            // Handle when mouse hovers over star
            onHover: function () {
                // make the star stop by setting the velocity to zero
                this.vx = 0;
                this.vy = 0;
                // Animate the star getting bigger
                this.popup();
//                context.font = "30px Arial";
//                context.fillText(this.data.title, this.x - 15, this.y - 15);
                // font color to write the text with
                context.fillStyle = "white";
                // Grab the title of the bookmark
                var text = this.data.title;
//                var font = "bold " + this.radius + "px serif";
                // Set the font to the following
                var font = "bold 30px Lato";
                // Set the font style
                context.font = font;
                // Move it down by half the text height and left by half the text width
                var width = context.measureText(text).width;
                var height = context.measureText("w").width; // this is a GUESS of height
                context.fillText(text, this.x - (width / 2), this.y + (height / 2));
//                context.fillStyle = 'rgba(29, 66, 98,1)';
            },
            // Handle when mouse leaves the star
            onExit: function () {
                if (this.vx == 0 && this.vy == 0) {
                    this.vx = (config.velocity - (Math.random() * 0.5));
                    this.vy = (config.velocity - (Math.random() * 0.5));
                }

                // Animate making the star smaller
                this.popdown();
            },
            // Handle making the star bigger with animation
            popup: function () {
                if (this.radius < this.originalRadius + config.hoverExpansion) {
                    this.radius += config.hoverExpansionA;
                    this.hoverRadius = this.radius;
                }
            },
            // Handle making the star smaller with animation
            popdown: function () {
                if (this.radius > this.originalRadius) {
                    this.radius -= config.hoverExpansionA;
                    this.hoverRadius = this.originalRadius;
                }

            },
            // Animate movement of stars
            // Handle Collisions with other stars
            // handle Collisions with canvas edges
            animate: function () {
                var i;
                for (i = 0; i < config.length; i++) {

                    var star = config.stars[i];

                    // Check if star has collided with horizontal walls
                    if (star.y - star.radius <= 0 || star.y + star.radius >= config.height) {
                        // Inverse velocity of Y component
                        star.vy = -star.vy;
                        // Check if star has collided with vertical walls
                    } else if (star.x - star.radius <= 0 || star.x + star.radius >= config.width) {
                        // Inverse velocity of X component
                        star.vx = -star.vx;
                    }

                    // Move star according to its velocity
                    star.x += star.vx;
                    star.y += star.vy;

                    var j;
                    // Loop through stars array again to handle collision with other stars
                    for (j = 0; j < config.length; j++) {
                        var jStar = config.stars[j];
                        // Make sure its not the same star
                        if (star.x != jStar.x && star.y != jStar.y) {
                            // Check collision of Y axis
                            if (star.y + star.radius >= jStar.y - jStar.radius && star.y - star.radius <= jStar.y + jStar.radius) {
                                // Check collision of X axis
                                if (star.x + star.radius >= jStar.x - jStar.radius && star.x - star.radius <= jStar.x + jStar.radius) {
                                    // If collisison occurs then exchange velocity of the 2 stars to give the impression of bouncing
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
            // Handle drawing a line between stars
            // Draw if same domain && if distance between them is less than distance in config
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

                        // Check if mouse position is inside a star
                        if (
                                (iStar.x - config.position.x) < iStar.radius &&
                                (iStar.y - config.position.y) < iStar.radius &&
                                (iStar.x - config.position.x) > -iStar.radius &&
                                (iStar.y - config.position.y) > -iStar.radius
                                ) {
                            // Start hover effect
                            iStar.onHover();
                            // Check if mouse has been clicked at this position
                            if (config.clickFlag) {
                                // Open bookmark (Problem with adblockers)
                                var url = "http://google.com";
                                $("<a>").attr("href", iStar.data.url).attr("target", "_blank")[0].click();
                                config.clickFlag = false;
                            }
                            // Check If distance between the 2 stars is less than the minimum distance requried in the config
                            if (
                                    (iStar.x - jStar.x) < config.distance &&
                                    (iStar.y - jStar.y) < config.distance &&
                                    (iStar.x - jStar.x) > -config.distance &&
                                    (iStar.y - jStar.y) > -config.distance &&
                                    // Check if same domain
                                    iStar.data.domain_url == jStar.data.domain_url
                                    ) {
                                context.beginPath();
                                context.moveTo(iStar.x, iStar.y);
                                context.lineTo(jStar.x, jStar.y);
                                context.stroke();
                                context.closePath();
                            }
                        } else {
                            // If mouse is not inside star than just do on exit animation to restore it to its original size
                            iStar.onExit();
                        }
                    }
                }
                config.clickFlag = false;
            }
        };

        this.createStars = function () {
            var length = config.bookmarks.length, star, i;

            context.clearRect(0, 0, config.width, config.height);

            for (i = 0; i < length; i++) {
                config.stars.push(new Star(config.bookmarks[i]));
                star = config.stars[i];
                star.create();
            }

            star.line();
            star.animate();
        };

        this.setCanvas = function () {
            console.log('ratio : ', config.ratio);
            console.log('Inner Width : ', window.innerWidth);
            console.log('Inner Height : ', window.innerHeight);
//            canvas.width = config.width;
//            canvas.height = config.height;
            canvas.width = config.width * config.ratio;
            console.log('Canvas Width : ', canvas.width);
            canvas.height = config.height * config.ratio;
            console.log('Canvas Height : ', canvas.height);
            canvas.style.width = config.width + 'px';//actual width of canvas
            console.log('Canvas Style Width : ', canvas.style.width);
            canvas.style.height = config.height + 'px';//actual height of canvas
            console.log('Canvas Style Height : ', canvas.style.height);
            context.setTransform(config.ratio, 0, 0, config.ratio, 0, 0);
        };

        this.setContext = function () {
            context.fillStyle = config.star.color;
            context.strokeStyle = config.line.color;
            context.lineWidth = config.line.width;
        };

        this.setInitialPosition = function () {
            if (!options || !options.hasOwnProperty('position')) {
                config.position = {
                    x: config.width * 0.5,
                    y: config.height * 0.5
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