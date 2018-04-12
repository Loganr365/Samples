<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8" />
    <title>Web Audio Visualizer</title>
    <link href="https://fonts.googleapis.com/css?family=Arvo" rel="stylesheet">
    <style>
        body {
            background: #eee;
            font-family: tahoma, verdana, sans\ serif
        }

        canvas {
            margin-left: 10px;
            margin-top: 10px;
            box-shadow: 4px 4px 8px rgba(0, 0, 0, .5);
            background: #000
        }

        #controls {
            margin-left: 10px;
            margin-top: 10px
        }

        h1 {
            font-family: 'Arvo', serif
        }

        body {
            font-family: "trebuchet ms", tahoma, verdana;
            border: 1px solid gray;
            background-color: #665858;
            color: #fff
        }
    </style>
    <script>
        (function() {
            "use strict";
            var NUM_SAMPLES = 256;
            var SOUND_1 = 'media/The Picard Song.mp3';
            var SOUND_2 = 'media/New Adventure Theme.mp3';
            var SOUND_3 = 'media/Peanuts Theme.mp3';
            var audioElement;
            var analyserNode;
            var canvas, ctx;
            var DEFAULT_RADIUS = 200;
            var maxRadius;
            var tintRed = false;
            var invert = false;
            var noise = false;
            var lines = false;
            var frameCount = 0;
            var baseColor = 100;
            var backgroundImage;
            var delayAmount = 0.0;
            var delayNode;
            var feedBackVolume = 0.0;
            var feedBackNode;
            var filterNode;
            var filterFrequency = 0;
            var shapeToDraw = "square";
            var squareRotation = 45;
            var frameCount = 0;
            var ctrlX = 0;
            var ctrlY = 0;
            var ctrlXa = 0;
            var ctrlYa = 0
            var speed = 1;
            var toAddX = true;
            var toAddY = true;
            var bufferLength;

            function init() {
                canvas = document.querySelector('canvas');
                ctx = canvas.getContext("2d");
                maxRadius = DEFAULT_RADIUS;
                ctrlXa = canvas.width / 4;
                ctrlYa = canvas.height / 4;
                ctrlX = canvas.width / 2;
                ctrlY = canvas.height / 2;
                audioElement = document.querySelector('audio');
                analyserNode = createWebAudioContextWithAnalyserNode(audioElement);
                setupUI();
                playStream(audioElement, SOUND_1);
                document.querySelector("#shapeSelect").onchange = function(e) {
                    shapeToDraw = e.target.value;
                }
                document.querySelector("#radiusSlider").onchange = function(e) {
                    maxRadius = e.target.value;
                };
                document.querySelector("#delaySlider").onchange = function(e) {
                    delayAmount = e.target.value;
                    delayNode.delayTime.value = parseFloat(delayAmount);
                }
                document.querySelector("#feedBackSlider").onchange = function(e) {
                    feedBackVolume = e.target.value;
                    feedBackNode.gain.value = parseFloat(feedBackVolume);
                }
                document.querySelector("#filterFrequencySilider").onchange = function(e) {
                    filterFrequency = e.target.value;
                    filterNode.frequency.value = parseInt(filterFrequency);
                }
                backgroundImage = document.getElementById("background");
                document.getElementById('tintRedCheck').onchange = function(e) {
                    if (e.target.checked) {
                        tintRed = true;
                    } else {
                        tintRed = false;
                    }
                }
                document.getElementById('invertCheck').onchange = function(e) {
                    if (e.target.checked) {
                        invert = true;
                    } else {
                        invert = false;
                    }
                }
                document.getElementById('noiseCheck').onchange = function(e) {
                    if (e.target.checked) {
                        noise = true;
                    } else {
                        noise = false;
                    }
                }
                document.getElementById('lineCheck').onchange = function(e) {
                    if (e.target.checked) {
                        lines = true;
                    } else {
                        lines = false;
                    }
                }
                update();
            }

            function createWebAudioContextWithAnalyserNode(audioElement) {
                var audioCtx, analyserNode, sourceNode;
                audioCtx = new(window.AudioContext || window.webkitAudioContext);
                analyserNode = audioCtx.createAnalyser();
                delayNode = audioCtx.createDelay();
                delayNode.delayTime.value = delayAmount;
                feedBackNode = audioCtx.createGain();
                feedBackNode.gain.value = feedBackVolume;
                filterNode = audioCtx.createBiquadFilter();
                filterNode.frequency.value = filterFrequency;
                analyserNode.fftSize = NUM_SAMPLES;
                bufferLength = analyserNode.frequencyBinCount;
                sourceNode = audioCtx.createMediaElementSource(audioElement);
                sourceNode.connect(delayNode);
                sourceNode.connect(feedBackNode);
                sourceNode.connect(filterNode);
                delayNode.connect(analyserNode);
                feedBackNode.connect(analyserNode);
                filterNode.connect(analyserNode);
                analyserNode.connect(audioCtx.destination);
                return analyserNode;
            }

            function setupUI() {
                document.querySelector("#trackSelect").onchange = function(e) {
                    playStream(audioElement, e.target.value);
                };
                document.querySelector("#fsButton").onclick = function() {
                    requestFullscreen(canvas);
                };
            }

            function playStream(audioElement, path) {
                audioElement.src = path;
                audioElement.play();
                audioElement.volume = 0.2;
                document.querySelector('#status').innerHTML = "Now playing: " + path;
            }

            function update() {
                requestAnimationFrame(update);
                var data = new Uint8Array(NUM_SAMPLES / 2);
                var freqencyData = new Uint8Array(bufferLength);
                analyserNode.getByteFrequencyData(data);
                analyserNode.getByteTimeDomainData(freqencyData);
                ctx.clearRect(0, 0, 800, 600);
                drawBackground();
                var barWidth = 4;
                var barSpacing = 1;
                var barHeight = 100;
                var topSpacing = 50;
                for (var i = 0; i < data.length; i++) {
                    if (frameCount % 60 == 0) {
                        drawWaveform(freqencyData);
                    };
                    ctx.fillStyle = 'rgba(255,255,255,0.25)';
                    ctx.strokeStyle = makeColor(255, 255, 255, .5);
                    ctx.save();
                    for (var j = 0; j < 5; j++) {
                        ctx.beginPath();
                        ctx.moveTo(i * (barWidth + barSpacing), 400);
                        ctx.lineTo(i * (barWidth + barSpacing), (topSpacing + 256 - data[i] - 20) / j * 5);
                        ctx.stroke();
                        ctx.closePath();
                    }
                    ctx.fillRect(i * (barWidth + barSpacing), topSpacing + 256 - data[i], barWidth, barHeight);
                    ctx.fillRect(640 - i * (barWidth + barSpacing), topSpacing + 256 - data[i] - 20, barWidth, barHeight);
                    drawSquares(data, i);
                    if (frameCount % 60 == 0) {
                        drawCurves(data, i);
                    };
                    if (frameCount % 2 == 0) {
                        drawCircles(data, i)
                    };
                    ctx.restore();
                    frameCount++;
                    if (frameCount > 20000) {
                        frameCount = 1;
                        baseColor = baseColor + 50;
                    };
                }
                manipulatePixels();
                frameCount++;
                if (frameCount % 2 == 0) {
                    squareRotation = squareRotation + 5;
                    if (squareRotation > 360) {
                        squareRotation = 0;
                    }
                }
            }

            function drawBackground() {
                var grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
                grad.addColorStop(0, 'rgb(100,100,255)');
                grad.addColorStop(1, 'white');
                ctx.fillStyle = grad;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }

            function drawWaveform(data) {
                ctx.save();
                ctx.lineWidth = "3";
                ctx.strokeStyle = 'rgb(255,255,0)';
                ctx.beginPath();
                var sliceWidth = canvas.width * 1.0 / bufferLength;
                var x = 0;
                for (var i = 0; i < bufferLength; i++) {
                    var v = data[i] / 128.0;
                    var y = v * canvas.height / 2;
                    if (i == 0) {
                        ctx.moveTo(x, y);
                    } else {
                        ctx.lineTo(x, y);
                    }
                    x += sliceWidth;
                }
                ctx.lineTo(canvas.width, canvas.height / 2);
                ctx.stroke();
                ctx.restore();
            }

            function drawCircles(data, i) {
                if (shapeToDraw == "circle") {
                    var percent = data[i] / 255;
                    var circleRadius = percent * maxRadius;
                    ctx.beginPath();
                    ctx.fillStyle = makeColor(255, 255, 0, .10 - percent / 10.0);
                    ctx.arc(canvas.width / 2, canvas.height / 2, circleRadius * 1.5, 0, 2 * Math.PI, false);
                    ctx.fill();
                    ctx.closePath();
                    if (frameCount < 10000 && frameCount > 0) {
                        ctx.beginPath();
                        ctx.fillStyle = makeColor(baseColor, baseColor, 0, .34 - percent / 3.0);
                        ctx.arc(canvas.width / 2, canvas.height / 2, circleRadius, 0, 2 * Math.PI, false);
                        ctx.fill();
                        ctx.closePath();
                    }
                    if (frameCount < 20000 && frameCount > 7500) {
                        ctx.save();
                        ctx.beginPath();
                        ctx.fillStyle = makeColor(0, baseColor, baseColor, .25 - percent / 5.0);
                        ctx.arc(canvas.width / 2, canvas.height / 2, circleRadius * .50, 0, 2 * Math.PI, false);
                        ctx.fill();
                        ctx.closePath();
                    }
                }
            }

            function drawSquares(data, i) {
                if (shapeToDraw == "square") {
                    var percent = data[i] / 255;
                    var squareSize = percent * maxRadius * 2;
                    ctx.save();
                    ctx.beginPath();
                    ctx.translate(canvas.width / 2, canvas.height / 2);
                    ctx.rotate(squareRotation * Math.PI / 180);
                    ctx.fillStyle = makeColor(255, 255, 0, .10 - percent / 10.0);
                    ctx.rect(0 - squareSize / 2, 0 - squareSize / 2, squareSize, squareSize);
                    ctx.fill();
                    ctx.closePath();
                    ctx.restore();
                    if (frameCount < 10000 && frameCount > 0) {
                        ctx.save();
                        ctx.beginPath();
                        ctx.translate(canvas.width / 2, canvas.height / 2);
                        ctx.rotate((squareRotation + 15) * Math.PI / 180);
                        ctx.fillStyle = makeColor(baseColor, 0, 0, .34 - percent / 3.0);
                        ctx.rect(0 - squareSize / 4, 0 - squareSize / 4, squareSize / 2, squareSize / 2);
                        ctx.fill();
                        ctx.closePath();
                        ctx.restore();
                    }
                    if (frameCount < 20000 && frameCount > 7500) {
                        ctx.save();
                        ctx.translate(canvas.width / 2, canvas.height / 2);
                        ctx.rotate((squareRotation + 30) * Math.PI / 180);
                        ctx.beginPath();
                        ctx.fillStyle = makeColor(0, baseColor, baseColor, .5 - percent / 5.0);
                        ctx.rect(0 - squareSize / 4, 0 - squareSize / 4, squareSize / 2, squareSize / 2);
                        ctx.fill();
                        ctx.closePath();
                        ctx.restore();
                    }
                }
            }

            function manipulatePixels() {
                var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                var data = imageData.data;
                var length = data.length;
                var width = imageData.width;
                tintRed = false;
                for (var i = 0; i < length; i += 4) {
                    if (tintRed) {
                        data[i] = data[i] + 100;
                    }
                    if (invert) {
                        data[i] = 255 - data[i];
                        data[i + 1] = 255 - data[i + 1];
                        data[i + 2] = 255 - data[+2];
                    }
                    if (noise && Math.random() < .10) {
                        data[i] = data[i + 1] = data[i + 2] = 128;
                    }
                    if (lines) {
                        var row = Math.floor(i / 4 / width);
                        if (row % 50 == 0) {
                            data[i + (width * 4)] = data[i + (width * 4) + 1] = data[i + (width * 4) + 2] = 255;
                        }
                    }
                }
                ctx.putImageData(imageData, 0, 0);
            };

            function makeColor(red, green, blue, alpha) {
                var color = 'rgba(' + red + ',' + green + ',' + blue + ', ' + alpha + ')';
                return color;
            }

            function requestFullscreen(element) {
                if (element.requestFullscreen) {
                    element.requestFullscreen();
                } else if (element.mozRequestFullscreen) {
                    element.mozRequestFullscreen();
                } else if (element.mozRequestFullScreen) {
                    element.mozRequestFullScreen();
                } else if (element.webkitRequestFullscreen) {
                    element.webkitRequestFullscreen();
                }
            };

            function drawCurves(data, i) {
                if (shapeToDraw == "curves") {
                    ctx.save();
                    if (frameCount % 30 == 0) {
                        updateCurves(data, i);
                    }
                    ctx.lineWidth = "6";
                    ctx.moveTo(0, canvas.height);
                    ctx.quadraticCurveTo(ctrlX, ctrlY, maxRadius * 3.25, canvas.height);
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.moveTo(0, canvas.height);
                    ctx.bezierCurveTo(ctrlX, ctrlY, ctrlXa, ctrlYa, maxRadius * 3.25, canvas.height);
                    ctx.stroke();
                    ctx.restore();
                }
            }

            function updateCurves(data, i) {
                var percent = data[i] / 255;
                var swayScale = 32;
                if (toAddX == true) {
                    ctrlX = ctrlX + speed * percent * swayScale;
                } else {
                    ctrlX = ctrlX - speed * percent * swayScale;
                }
                if (toAddY == true) {
                    ctrlY = ctrlY + speed * percent * swayScale;
                } else {
                    ctrlY = ctrlY - speed * percent * swayScale;
                }
                if (ctrlX >= canvas.width) {
                    toAddX = false;
                }
                if (ctrlX <= 0) {
                    toAddX = true;
                }
                if (ctrlY >= canvas.height) {
                    toAddY = false;
                }
                if (ctrlY <= 0) {
                    toAddY = true;
                }
            }
            window.addEventListener("load", init);
        }());
    </script>
</head>

<body>
    <h1 align="center">Static Audio Visualizer</h1>
    <h3 align="center">Logan Rogers</h3>
    <div align="center">
        <canvas id="canvas" width="640" height="400"></canvas>
    </div>
    <div id="controls" align="center">
        <p align="center" id="status">???</p>
        <audio controls loop></audio>
        <label>Track:
      <select id="trackSelect">
        <option value="media/The Picard Song.mp3">The Picard Song</option>
        <option value="media/New Adventure Theme.mp3">New Adventure Theme</option>
        <option value="media/Peanuts Theme.mp3">Peanuts Theme</option>
      </select>
    </label>
        <button id="fsButton">Go Full Screen</button>
        <br>
        <p>
            <label>Shape:
        <select id="shapeSelect">
          <option value="square">Square</option>
          <option value="circle">Circle</option>
          <option value="curves">Look at those curves</option>
        </select>
      </label>
            <label for="radiusSlider">Size</label>
            <input id="radiusSlider" type="range" min="20" max="200" step="1" value="200" />
        </p>
        <p>
            <label for="tintRedCheck">Tint Red</label>
            <input type="checkbox" id="tintRedCheck">
        </p>
        <p>
            <label for="invertCheck">Invert</label>
            <input type="checkbox" id="invertCheck">
        </p>
        <p>
            <label for="noiseCheck">Noise</label>
            <input type="checkbox" id="noiseCheck">
        </p>
        <p>
            <label for="lineCheck">Lines</label>
            <input type="checkbox" id="lineCheck">
        </p>
        <p>
            <label>Delay/Reverb:
        <input id="delaySlider" type="range" min="0.0" max="1.0" value="0.0" step="0.1">
      </label>
        </p>
        <p>
            <label>Feedback/Gain:
        <input id="feedBackSlider" type="range" min="0.0" max="1.0" value="0.0" step="0.1">
      </label>
        </p>
        <p>
            <label>Cutoff Frequency:
        <input id="filterFrequencySilider" type="range" min="1" max="1000" value="0.0" step="10">
      </label>
        </p>

        <p>
            <script data-pagespeed-no-defer>
                //<![CDATA[
                (function() {
                    for (var g = "function" == typeof Object.defineProperties ? Object.defineProperty : function(b, c, a) {
                            if (a.get || a.set) throw new TypeError("ES3 does not support getters and setters.");
                            b != Array.prototype && b != Object.prototype && (b[c] = a.value)
                        }, h = "undefined" != typeof window && window === this ? this : "undefined" != typeof global && null != global ? global : this, k = ["String", "prototype", "repeat"], l = 0; l < k.length - 1; l++) {
                        var m = k[l];
                        m in h || (h[m] = {});
                        h = h[m]
                    }
                    var n = k[k.length - 1],
                        p = h[n],
                        q = p ? p : function(b) {
                            var c;
                            if (null == this) throw new TypeError("The 'this' value for String.prototype.repeat must not be null or undefined");
                            c = this + "";
                            if (0 > b || 1342177279 < b) throw new RangeError("Invalid count value");
                            b |= 0;
                            for (var a = ""; b;)
                                if (b & 1 && (a += c), b >>>= 1) c += c;
                            return a
                        };
                    q != p && null != q && g(h, n, {
                        configurable: !0,
                        writable: !0,
                        value: q
                    });
                    var t = this;

                    function u(b, c) {
                        var a = b.split("."),
                            d = t;
                        a[0] in d || !d.execScript || d.execScript("var " + a[0]);
                        for (var e; a.length && (e = a.shift());) a.length || void 0 === c ? d[e] ? d = d[e] : d = d[e] = {} : d[e] = c
                    };

                    function v(b) {
                        var c = b.length;
                        if (0 < c) {
                            for (var a = Array(c), d = 0; d < c; d++) a[d] = b[d];
                            return a
                        }
                        return []
                    };

                    function w(b) {
                        var c = window;
                        if (c.addEventListener) c.addEventListener("load", b, !1);
                        else if (c.attachEvent) c.attachEvent("onload", b);
                        else {
                            var a = c.onload;
                            c.onload = function() {
                                b.call(this);
                                a && a.call(this)
                            }
                        }
                    };
                    var x;

                    function y(b, c, a, d, e) {
                        this.h = b;
                        this.j = c;
                        this.l = a;
                        this.f = e;
                        this.g = {
                            height: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight,
                            width: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
                        };
                        this.i = d;
                        this.b = {};
                        this.a = [];
                        this.c = {}
                    }

                    function z(b, c) {
                        var a, d, e = c.getAttribute("data-pagespeed-url-hash");
                        if (a = e && !(e in b.c))
                            if (0 >= c.offsetWidth && 0 >= c.offsetHeight) a = !1;
                            else {
                                d = c.getBoundingClientRect();
                                var f = document.body;
                                a = d.top + ("pageYOffset" in window ? window.pageYOffset : (document.documentElement || f.parentNode || f).scrollTop);
                                d = d.left + ("pageXOffset" in window ? window.pageXOffset : (document.documentElement || f.parentNode || f).scrollLeft);
                                f = a.toString() + "," + d;
                                b.b.hasOwnProperty(f) ? a = !1 : (b.b[f] = !0, a = a <= b.g.height && d <= b.g.width)
                            }
                        a && (b.a.push(e), b.c[e] = !0)
                    }
                    y.prototype.checkImageForCriticality = function(b) {
                        b.getBoundingClientRect && z(this, b)
                    };
                    u("pagespeed.CriticalImages.checkImageForCriticality", function(b) {
                        x.checkImageForCriticality(b)
                    });
                    u("pagespeed.CriticalImages.checkCriticalImages", function() {
                        A(x)
                    });

                    function A(b) {
                        b.b = {};
                        for (var c = ["IMG", "INPUT"], a = [], d = 0; d < c.length; ++d) a = a.concat(v(document.getElementsByTagName(c[d])));
                        if (a.length && a[0].getBoundingClientRect) {
                            for (d = 0; c = a[d]; ++d) z(b, c);
                            a = "oh=" + b.l;
                            b.f && (a += "&n=" + b.f);
                            if (c = !!b.a.length)
                                for (a += "&ci=" + encodeURIComponent(b.a[0]), d = 1; d < b.a.length; ++d) {
                                    var e = "," + encodeURIComponent(b.a[d]);
                                    131072 >= a.length + e.length && (a += e)
                                }
                            b.i && (e = "&rd=" + encodeURIComponent(JSON.stringify(B())), 131072 >= a.length + e.length && (a += e), c = !0);
                            C = a;
                            if (c) {
                                d = b.h;
                                b = b.j;
                                var f;
                                if (window.XMLHttpRequest) f = new XMLHttpRequest;
                                else if (window.ActiveXObject) try {
                                    f = new ActiveXObject("Msxml2.XMLHTTP")
                                } catch (r) {
                                    try {
                                        f = new ActiveXObject("Microsoft.XMLHTTP")
                                    } catch (D) {}
                                }
                                f && (f.open("POST", d + (-1 == d.indexOf("?") ? "?" : "&") + "url=" + encodeURIComponent(b)), f.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"), f.send(a))
                            }
                        }
                    }

                    function B() {
                        var b = {},
                            c;
                        c = document.getElementsByTagName("IMG");
                        if (!c.length) return {};
                        var a = c[0];
                        if (!("naturalWidth" in a && "naturalHeight" in a)) return {};
                        for (var d = 0; a = c[d]; ++d) {
                            var e = a.getAttribute("data-pagespeed-url-hash");
                            e && (!(e in b) && 0 < a.width && 0 < a.height && 0 < a.naturalWidth && 0 < a.naturalHeight || e in b && a.width >= b[e].o && a.height >= b[e].m) && (b[e] = {
                                rw: a.width,
                                rh: a.height,
                                ow: a.naturalWidth,
                                oh: a.naturalHeight
                            })
                        }
                        return b
                    }
                    var C = "";
                    u("pagespeed.CriticalImages.getBeaconData", function() {
                        return C
                    });
                    u("pagespeed.CriticalImages.Run", function(b, c, a, d, e, f) {
                        var r = new y(b, c, a, e, f);
                        x = r;
                        d && w(function() {
                            window.setTimeout(function() {
                                A(r)
                            }, 0)
                        })
                    });
                })();
                pagespeed.CriticalImages.Run('/mod_pagespeed_beacon', 'https://people.rit.edu/ltr6702/330/AudioVisFinal/Logan_Rogers_AudioVis.html', '-VTdVB-BQD', true, false, 'Fef6rKL34Wo');
                //]]>
            </script>
            <img id="background" src="media/background.jpg" alt="background used in canvas" style="display:none;" data-pagespeed-url-hash="288125174" onload="pagespeed.CriticalImages.checkImageForCriticality(this);" />
        </p>
    </div>
</body>

</html>
