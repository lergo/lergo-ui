var DISQUS = function (a) {
    "use strict";
    var b = a.DISQUS || {};
    return b.define = function (c, d) {
        "function" == typeof c && (d = c, c = "");
        for (var e = c.split("."), f = e.shift(), g = b, h = (d || function () {
            return{}
        }).call({overwrites: function (a) {
            return a.__overwrites__ = !0, a
        }}, a); f;)g = g[f] ? g[f] : g[f] = {}, f = e.shift();
        for (var i in h)h.hasOwnProperty(i) && (!h.__overwrites__ && null !== g[i] && g.hasOwnProperty(i) ? b.logError && b.logError("Unsafe attempt to redefine existing module: " + i) : g[i] = h[i]);
        return g
    }, b.use = function (a) {
        return b.define(a)
    }, b.define("next"), b
}(window);
DISQUS.define(function (a, b) {
    "use strict";
    var c = a.DISQUS, d = a.document, e = d.head || d.getElementsByTagName("head")[0] || d.body, f = 0;
    c.getUid = function (a) {
        var b = ++f + "";
        return a ? a + b : b
    }, c.isOwn = function (a, b) {
        return Object.prototype.hasOwnProperty.call(a, b)
    }, c.isString = function (a) {
        return"[object String]" === Object.prototype.toString.call(a)
    }, c.each = function (a, b) {
        var d = a.length, e = Array.prototype.forEach;
        if (isNaN(d))for (var f in a)c.isOwn(a, f) && b(a[f], f, a); else if (e)e.call(a, b); else for (var g = 0; d > g; g++)b(a[g], g, a)
    }, c.extend = function (a) {
        return c.each(Array.prototype.slice.call(arguments, 1), function (b) {
            for (var c in b)a[c] = b[c]
        }), a
    }, c.serializeArgs = function (a) {
        var d = [];
        return c.each(a, function (a, c) {
            a !== b && d.push(c + (null !== a ? "=" + encodeURIComponent(a) : ""))
        }), d.join("&")
    }, c.serialize = function (a, b, d) {
        if (b && (a += a.indexOf("?") > -1 ? "&" === a.charAt(a.length - 1) ? "" : "&" : "?", a += c.serializeArgs(b)), d) {
            var e = {};
            return e[(new Date).getTime()] = null, c.serialize(a, e)
        }
        var f = a.length;
        return"&" === a.charAt(f - 1) ? a.slice(0, f - 1) : a
    };
    var g, h, i = 2e4;
    "addEventListener"in a ? (g = function (a, b, c) {
        a.addEventListener(b, c, !1)
    }, h = function (a, b, c) {
        a.removeEventListener(b, c, !1)
    }) : (g = function (a, b, c) {
        a.attachEvent("on" + b, c)
    }, h = function (a, b, c) {
        a.detachEvent("on" + b, c)
    }), c.require = function (b, f, j, k, l) {
        function m(b) {
            b = b || a.event, b.target || (b.target = b.srcElement), ("load" === b.type || /^(complete|loaded)$/.test(b.target.readyState)) && (k && k(), p && clearTimeout(p), h(b.target, o, m))
        }

        var n = d.createElement("script"), o = n.addEventListener ? "load" : "readystatechange", p = null;
        return n.src = c.serialize(b, f, j), n.async = !0, n.charset = "UTF-8", (k || l) && g(n, o, m), l && (p = setTimeout(function () {
            l()
        }, i)), e.appendChild(n), c
    }
}), DISQUS.define(function (a) {
    "use strict";
    var b = function (a, b) {
        for (var c = 0, d = a.length; d > c; c++)if (a[c] === b)return!0;
        return!1
    }, c = {}, d = function (d) {
        var e = a.require && require.defined && require.defined("remote/config") && require("remote/config");
        if (!e || !e.switches)return null;
        if (DISQUS.isOwn(c, d))return c[d];
        var f = c[d] = b(e.switches, d);
        return f
    }, e = function () {
        a.console && d("next_logging") !== !1 && (a.console.log.apply ? a.console.log.apply(a.console, arguments) : a.console.log(Array.prototype.slice.call(arguments, 0).join(" ")))
    };
    return{log: e, logError: e}
}), DISQUS.define("next.host.urls", function () {
    "use strict";
    var a = "default", b = "994722ff", c = {lounge: "http://disqus.com/embed/comments/", profile: "http://disqus.com/embed/profile/", onboard: "http://disqus.com/embed/onboard/"}, d = function (a, b) {
        return/^http/.test(b) || (b = "http:"), a.replace(/^(\w+:)?\/\//, b + "//")
    }, e = function (e, f, g) {
        var h = c[e];
        if (!h)throw new Error("Unknown app: " + e);
        var i = d(h, document.location.protocol), j = DISQUS.extend({base: a, disqus_version: b}, f || {}), k = g ? "#" + encodeURIComponent(JSON.stringify(g)) : "";
        return DISQUS.serialize(i, j) + k
    };
    return{BASE: a, VERSION: b, apps: c, get: e, ensureHttpBasedProtocol: d}
}), DISQUS.define("Events", function () {
    "use strict";
    var a = function (a) {
        var b, c = !1;
        return function () {
            return c ? b : (c = !0, b = a.apply(this, arguments), a = null, b)
        }
    }, b = DISQUS.isOwn, c = Object.keys || function (a) {
        if (a !== Object(a))throw new TypeError("Invalid object");
        var c = [];
        for (var d in a)b(a, d) && (c[c.length] = d);
        return c
    }, d = [].slice, e = {on: function (a, b, c) {
        if (!g(this, "on", a, [b, c]) || !b)return this;
        this._events = this._events || {};
        var d = this._events[a] || (this._events[a] = []);
        return d.push({callback: b, context: c, ctx: c || this}), this
    }, once: function (b, c, d) {
        if (!g(this, "once", b, [c, d]) || !c)return this;
        var e = this, f = a(function () {
            e.off(b, f), c.apply(this, arguments)
        });
        return f._callback = c, this.on(b, f, d)
    }, off: function (a, b, d) {
        var e, f, h, i, j, k, l, m;
        if (!this._events || !g(this, "off", a, [b, d]))return this;
        if (!a && !b && !d)return this._events = {}, this;
        for (i = a ? [a] : c(this._events), j = 0, k = i.length; k > j; j++)if (a = i[j], h = this._events[a]) {
            if (this._events[a] = e = [], b || d)for (l = 0, m = h.length; m > l; l++)f = h[l], (b && b !== f.callback && b !== f.callback._callback || d && d !== f.context) && e.push(f);
            e.length || delete this._events[a]
        }
        return this
    }, trigger: function (a) {
        if (!this._events)return this;
        var b = d.call(arguments, 1);
        if (!g(this, "trigger", a, b))return this;
        var c = this._events[a], e = this._events.all;
        return c && h(c, b), e && h(e, arguments), this
    }, stopListening: function (a, b, c) {
        var d = this._listeners;
        if (!d)return this;
        var e = !b && !c;
        "object" == typeof b && (c = this), a && ((d = {})[a._listenerId] = a);
        for (var f in d)d[f].off(b, c, this), e && delete this._listeners[f];
        return this
    }}, f = /\s+/, g = function (a, b, c, d) {
        if (!c)return!0;
        if ("object" == typeof c) {
            for (var e in c)a[b].apply(a, [e, c[e]].concat(d));
            return!1
        }
        if (f.test(c)) {
            for (var g = c.split(f), h = 0, i = g.length; i > h; h++)a[b].apply(a, [g[h]].concat(d));
            return!1
        }
        return!0
    }, h = function (a, b) {
        var c, d = -1, e = a.length, f = b[0], g = b[1], h = b[2];
        switch (b.length) {
            case 0:
                for (; ++d < e;)(c = a[d]).callback.call(c.ctx);
                return;
            case 1:
                for (; ++d < e;)(c = a[d]).callback.call(c.ctx, f);
                return;
            case 2:
                for (; ++d < e;)(c = a[d]).callback.call(c.ctx, f, g);
                return;
            case 3:
                for (; ++d < e;)(c = a[d]).callback.call(c.ctx, f, g, h);
                return;
            default:
                for (; ++d < e;)(c = a[d]).callback.apply(c.ctx, b)
        }
    }, i = {listenTo: "on", listenToOnce: "once"};
    return DISQUS.each(i, function (a, b) {
        e[b] = function (b, c, d) {
            var e = this._listeners || (this._listeners = {}), f = b._listenerId || (b._listenerId = DISQUS.getUid("l"));
            return e[f] = b, "object" == typeof c && (d = this), b[a](c, d, this), this
        }
    }), e.bind = e.on, e.unbind = e.off, e
}), DISQUS.define(function (a) {
    "use strict";
    function b(a) {
        return i.getElementById(a) || i.body || i.documentElement
    }

    function c(a, b) {
        b = b || i.documentElement;
        for (var c = a, d = 0, e = 0; c && c !== b;)d += c.offsetLeft, e += c.offsetTop, c = c.offsetParent;
        return{top: e, left: d, height: a.offsetHeight, width: a.offsetWidth}
    }

    function d(a) {
        return m.href = a, m.host
    }

    function e(a, b, c) {
        if (a.addEventListener)a.addEventListener(b, c, !1); else {
            if (!a.attachEvent)throw new Error("No event support.");
            a.attachEvent("on" + b, c)
        }
    }

    function f(a, b, c) {
        if (a.removeEventListener)a.removeEventListener(b, c, !1); else {
            if (!a.detachEvent)throw new Error("No event support.");
            a.detachEvent("on" + b, c)
        }
    }

    function g(a, b, c) {
        a.postMessage(b, c)
    }

    function h(a, b, c) {
        c || (c = 0);
        var d, e, f, g, h = 0, i = function () {
            h = new Date, f = null, g = a.apply(d, e)
        };
        return function () {
            var j = new Date, k = b - (j - h);
            return d = this, e = arguments, 0 >= k ? (clearTimeout(f), f = null, h = j, g = a.apply(d, e)) : f || (f = setTimeout(i, k + c)), g
        }
    }

    var i = a.document, j = {}, k = DISQUS.use("JSON"), l = DISQUS.isOwn, m = i.createElement("a");
    e(a, "message", function (a) {
        var b, c = d(a.origin);
        for (var e in j)if (l(j, e) && c === j[e].host) {
            b = !0;
            break
        }
        var f;
        try {
            f = k.parse(a.data)
        } catch (g) {
            b = !1
        }
        if (b = b && j[f.sender]) {
            a.origin !== j[e].origin && (j[e].origin = a.origin);
            var h = j[f.sender];
            switch (f.scope) {
                case"host":
                    h.trigger(f.name, f.data)
            }
        }
    }, !1), e(a, "hashchange", function () {
        DISQUS.trigger("window.hashchange", {hash: a.location.hash})
    }, !1), e(a, "resize", h(function () {
        DISQUS.trigger("window.resize")
    }, 250, 50), !1);
    var n = function () {
        DISQUS.trigger("window.scroll")
    };
    e(a, "scroll", h(n, 250, 50)), e(i, "click", function () {
        DISQUS.trigger("window.click")
    });
    var o = function (a) {
        a = a || {}, this.state = o.INIT, this.uid = a.uid || DISQUS.getUid(), this.origin = a.origin, this.host = d(this.origin), this.target = a.target, this.window = null, j[this.uid] = this, this.on("ready", function () {
            this.state = o.READY
        }, this), this.on("die", function () {
            this.state = o.KILLED
        }, this)
    };
    DISQUS.extend(o, {INIT: 0, READY: 1, KILLED: 2}), DISQUS.extend(o.prototype, DISQUS.Events), o.prototype.sendMessage = function (a, b) {
        var c = k.stringify({scope: "client", name: a, data: b}), d = function (a, b, c) {
            return function () {
                DISQUS.postMessage(c.window, a, b)
            }
        }(c, this.origin, this);
        this.isReady() ? d() : this.on("ready", d)
    }, o.prototype.hide = function () {
    }, o.prototype.show = function () {
    }, o.prototype.url = function () {
        return this.target + "#" + this.uid
    }, o.prototype.destroy = function () {
        this.state = o.KILLED, this.off()
    }, o.prototype.isReady = function () {
        return this.state === o.READY
    }, o.prototype.isKilled = function () {
        return this.state === o.KILLED
    };
    var p = function (a) {
        o.call(this, a), this.windowName = a.windowName
    };
    DISQUS.extend(p.prototype, o.prototype), p.prototype.load = function () {
        this.window = a.open("", this.windowName || "_blank"), this.window.location = this.url()
    }, p.prototype.isKilled = function () {
        return o.prototype.isKilled() || this.window.closed
    };
    var q = function (a) {
        o.call(this, a), this.styles = a.styles || {}, this.tabIndex = a.tabIndex || 0, this.title = a.title || "Disqus", this.container = a.container, this.elem = null
    };
    DISQUS.extend(q.prototype, o.prototype), q.prototype.load = function () {
        var a = this.elem = i.createElement("iframe");
        a.setAttribute("id", "dsq-" + this.uid), a.setAttribute("data-disqus-uid", this.uid), a.setAttribute("allowTransparency", "true"), a.setAttribute("frameBorder", "0"), this.role && a.setAttribute("role", this.role), a.setAttribute("tabindex", this.tabIndex), a.setAttribute("title", this.title), this.setInlineStyle(this.styles)
    }, q.prototype.getOffset = function (a) {
        return c(this.elem, a)
    }, q.prototype.setInlineStyle = function (a, b) {
        var c = {};
        DISQUS.isString(a) ? c[a] = b : c = a;
        var d = this.elem.style;
        return"setProperty"in d ? void DISQUS.each(c, function (a, b) {
            d.setProperty(b, "" + a, "important")
        }) : this._setInlineStyleCompat(c)
    }, q.prototype._setInlineStyleCompat = function (a) {
        this._stylesCache = this._stylesCache || {}, DISQUS.extend(this._stylesCache, a);
        var b = [];
        DISQUS.each(this._stylesCache, function (a, c) {
            b.push(c + ":" + a + " !important")
        }), this.elem.style.cssText = b.join(";")
    }, q.prototype.removeInlineStyle = function (a) {
        var b = this.elem.style;
        return"removeProperty"in b ? void b.removeProperty(a) : this._removeInlineStyleCompat(a)
    }, q.prototype._removeInlineStyleCompat = function (a) {
        this._stylesCache && (delete this._stylesCache[a], this._setInlineStyleCompat({}))
    }, q.prototype.hide = function () {
        this.setInlineStyle("display", "none")
    }, q.prototype.show = function () {
        this.removeInlineStyle("display")
    }, q.prototype.destroy = function () {
        return this.elem && this.elem.parentNode && (this.elem.parentNode.removeChild(this.elem), this.elem = null), o.prototype.destroy.call(this)
    };
    var r = function (a) {
        var b = this;
        b.window = null, q.call(b, a), b.styles = DISQUS.extend({width: "100%", border: "none", overflow: "hidden", height: "0"}, a.styles || {})
    };
    DISQUS.extend(r.prototype, q.prototype), r.prototype.load = function (a) {
        var c = this;
        q.prototype.load.call(c);
        var d = c.elem;
        d.setAttribute("width", "100%"), d.setAttribute("src", this.url()), e(d, "load", function () {
            c.window = d.contentWindow, a && a()
        });
        var f = DISQUS.isString(this.container) ? b(this.container) : this.container;
        f.appendChild(d)
    }, r.prototype.destroy = function () {
        return this.window = null, q.prototype.destroy.call(this)
    };
    var s = function (a) {
        q.call(this, a), this.contents = a.contents || "", this.styles = DISQUS.extend({width: "100%", border: "none", overflow: "hidden"}, a.styles || {})
    };
    DISQUS.extend(s.prototype, q.prototype), s.prototype.load = function () {
        q.prototype.load.call(this);
        var a = this.elem;
        a.setAttribute("scrolling", "no");
        var c = DISQUS.isString(this.container) ? b(this.container) : this.container;
        c.appendChild(a), this.window = a.contentWindow;
        try {
            this.window.document.open()
        } catch (d) {
            a.src = 'javascript:var d=document.open();d.domain="' + i.domain + '";void(0);'
        }
        return this.document = this.window.document, this.document.write(this.contents), this.document.close(), this.updateHeight(), this
    }, s.prototype.updateHeight = function () {
        var a, b = this.document.body;
        b && (a = b.offsetHeight + "px", this.setInlineStyle({height: a, "min-height": a, "max-height": a}))
    }, s.prototype.show = function () {
        this.setInlineStyle("display", "block")
    }, s.prototype.click = function (a) {
        var b = this, c = b.document.body;
        e(c, "click", function (c) {
            a.call(b, c)
        })
    }, s.prototype.setBodyClass = function (a) {
        this.document.body.className = a
    };
    var t = DISQUS.extend({}, DISQUS.Events);
    return{on: t.on, off: t.off, trigger: t.trigger, throttle: h, addEvent: e, removeEvent: f, getOffset: c, getHost: d, postMessage: g, WindowBase: o, Popup: p, Iframe: q, Channel: r, Sandbox: s}
}), DISQUS.define("JSON", function (a) {
    "use strict";
    var b, c = new DISQUS.Sandbox({container: "disqus_thread", styles: {display: "none"}});
    try {
        b = c.load().window.JSON
    } catch (d) {
    }
    return b || (b = a.JSON), {stringify: b.stringify, parse: b.parse}
}), DISQUS.define("next.host.utils", function (a, b) {
    "use strict";
    function c(a) {
        a = a.toLowerCase(), a = a.replace(/\s/, "");
        var b = {aliceblue: "#F0F8FF", antiquewhite: "#FAEBD7", aqua: "#00FFFF", aquamarine: "#7FFFD4", azure: "#F0FFFF", beige: "#F5F5DC", bisque: "#FFE4C4", black: "#000000", blanchedalmond: "#FFEBCD", blue: "#0000FF", blueviolet: "#8A2BE2", brown: "#A52A2A", burlywood: "#DEB887", cadetblue: "#5F9EA0", chartreuse: "#7FFF00", chocolate: "#D2691E", coral: "#FF7F50", cornflowerblue: "#6495ED", cornsilk: "#FFF8DC", crimson: "#DC143C", cyan: "#00FFFF", darkblue: "#00008B", darkcyan: "#008B8B", darkgoldenrod: "#B8860B", darkgray: "#A9A9A9", darkgreen: "#006400", darkgrey: "#A9A9A9", darkkhaki: "#BDB76B", darkmagenta: "#8B008B", darkolivegreen: "#556B2F", darkorange: "#FF8C00", darkorchid: "#9932CC", darkred: "#8B0000", darksalmon: "#E9967A", darkseagreen: "#8FBC8F", darkslateblue: "#483D8B", darkslategray: "#2F4F4F", darkslategrey: "#2F4F4F", darkturquoise: "#00CED1", darkviolet: "#9400D3", deeppink: "#FF1493", deepskyblue: "#00BFFF", dimgray: "#696969", dimgrey: "#696969", dodgerblue: "#1E90FF", firebrick: "#B22222", floralwhite: "#FFFAF0", forestgreen: "#228B22", fuchsia: "#FF00FF", gainsboro: "#DCDCDC", ghostwhite: "#F8F8FF", gold: "#FFD700", goldenrod: "#DAA520", gray: "#808080", green: "#008000", greenyellow: "#ADFF2F", grey: "#808080", honeydew: "#F0FFF0", hotpink: "#FF69B4", indianred: "#CD5C5C", indigo: "#4B0082", ivory: "#FFFFF0", khaki: "#F0E68C", lavender: "#E6E6FA", lavenderblush: "#FFF0F5", lawngreen: "#7CFC00", lemonchiffon: "#FFFACD", lightblue: "#ADD8E6", lightcoral: "#F08080", lightcyan: "#E0FFFF", lightgoldenrodyellow: "#FAFAD2", lightgray: "#D3D3D3", lightgreen: "#90EE90", lightgrey: "#D3D3D3", lightpink: "#FFB6C1", lightsalmon: "#FFA07A", lightseagreen: "#20B2AA", lightskyblue: "#87CEFA", lightslategray: "#778899", lightslategrey: "#778899", lightsteelblue: "#B0C4DE", lightyellow: "#FFFFE0", lime: "#00FF00", limegreen: "#32CD32", linen: "#FAF0E6", magenta: "#FF00FF", maroon: "#800000", mediumaquamarine: "#66CDAA", mediumblue: "#0000CD", mediumorchid: "#BA55D3", mediumpurple: "#9370DB", mediumseagreen: "#3CB371", mediumslateblue: "#7B68EE", mediumspringgreen: "#00FA9A", mediumturquoise: "#48D1CC", mediumvioletred: "#C71585", midnightblue: "#191970", mintcream: "#F5FFFA", mistyrose: "#FFE4E1", moccasin: "#FFE4B5", navajowhite: "#FFDEAD", navy: "#000080", oldlace: "#FDF5E6", olive: "#808000", olivedrab: "#6B8E23", orange: "#FFA500", orangered: "#FF4500", orchid: "#DA70D6", palegoldenrod: "#EEE8AA", palegreen: "#98FB98", paleturquoise: "#AFEEEE", palevioletred: "#DB7093", papayawhip: "#FFEFD5", peachpuff: "#FFDAB9", peru: "#CD853F", pink: "#FFC0CB", plum: "#DDA0DD", powderblue: "#B0E0E6", purple: "#800080", red: "#FF0000", rosybrown: "#BC8F8F", royalblue: "#4169E1", saddlebrown: "#8B4513", salmon: "#FA8072", sandybrown: "#F4A460", seagreen: "#2E8B57", seashell: "#FFF5EE", sienna: "#A0522D", silver: "#C0C0C0", skyblue: "#87CEEB", slateblue: "#6A5ACD", slategray: "#708090", slategrey: "#708090", snow: "#FFFAFA", springgreen: "#00FF7F", steelblue: "#4682B4", tan: "#D2B48C", teal: "#008080", thistle: "#D8BFD8", tomato: "#FF6347", turquoise: "#40E0D0", violet: "#EE82EE", wheat: "#F5DEB3", white: "#FFFFFF", whitesmoke: "#F5F5F5", yellow: "#FFFF00", yellowgreen: "#9ACD32"};
        return b[a] || ""
    }

    function d(a) {
        if (!a || "embed.js" !== a.substring(a.length - 8))return null;
        for (var b, c = [/(https?:)?\/\/(www\.)?disqus\.com\/forums\/([\w_\-]+)/i, /(https?:)?\/\/(www\.)?([\w_\-]+)\.disqus\.com/i, /(https?:)?\/\/(www\.)?dev\.disqus\.org\/forums\/([\w_\-]+)/i, /(https?:)?\/\/(www\.)?([\w_\-]+)\.dev\.disqus\.org/i], d = c.length, e = 0; d > e; e++)if (b = a.match(c[e]), b && b.length && 4 === b.length)return b[3];
        return null
    }

    function e(a, b) {
        var c, e, f, g = a.getElementsByTagName("script"), h = g.length;
        b = b || d;
        for (var i = h - 1; i >= 0; i--)if (c = g[i], e = c.getAttribute ? c.getAttribute("src") : c.src, f = b(e), null !== f)return f.toLowerCase();
        return null
    }

    function f(a, b) {
        for (var c = 0, d = new Array(a.length), e = 0; e <= a.length; e++) {
            d[e] = new Array(b.length);
            for (var f = 0; f <= b.length; f++)d[e][f] = 0
        }
        for (var g = 0; g < a.length; g++)for (var h = 0; h < b.length; h++)a[g] === b[h] && (d[g + 1][h + 1] = d[g][h] + 1, d[g + 1][h + 1] > c && (c = d[g + 1][h + 1]));
        return c
    }

    function g() {
        for (var a = w.getElementsByTagName("h1"), c = w.title, d = c.length, e = c, g = .6, h = 0; h < a.length; h++)!function (a) {
            var h, i = a.textContent || a.innerText;
            null !== i && i !== b && (h = f(c, i) / d, h > g && (g = h, e = i))
        }(a[h]);
        return e
    }

    function h(b, c, d) {
        var e;
        return d = d || c, b === w ? "" : (a.getComputedStyle ? e = w.defaultView.getComputedStyle(b, null).getPropertyValue(c) : b.currentStyle && (e = b.currentStyle[c] ? b.currentStyle[c] : b.currentStyle[d]), "transparent" === e || "" === e || "rgba(0, 0, 0, 0)" === e ? h(b.parentNode, c, d) : e || null)
    }

    function i(a) {
        a = j(a), "#" === a.charAt(0) && (a = a.substr(1));
        var b = parseInt(a.substr(0, 2), 16), c = parseInt(a.substr(2, 2), 16), d = parseInt(a.substr(4, 2), 16), e = (299 * b + 587 * c + 114 * d) / 1e3;
        return e
    }

    function j(a) {
        return a = a.replace(/^#?([a-f0-9])([a-f0-9])([a-f0-9])$/i, "#$1$1$2$2$3$3"), /^#?[a-f0-9]{6}$/.test(a) ? a : k(a) || c(a)
    }

    function k(a) {
        function b(a) {
            return a = Number(a).toString(16), 1 === a.length ? "0" + a : a
        }

        var c = /rgb\((\d+),\s*(\d+),\s*(\d+)\)/.exec(a);
        if (!c || 4 !== c.length)return"";
        var d = b(c[1]), e = b(c[2]), f = b(c[3]);
        return"#" + d + e + f
    }

    function l(a, b, c, d) {
        DISQUS.isString(b) && (b = w.createElement(b));
        var e = null;
        return b.style.visibility = "hidden", a.appendChild(b), e = h(b, c, d), a.removeChild(b), e
    }

    function m(a) {
        var b = w.createElement("a");
        return b.href = +new Date, l(a, b, "color")
    }

    function n(a) {
        return a.toLowerCase().replace(/^\s+|\s+$/g, "").replace(/['"]/g, "")
    }

    function o(a) {
        for (var b, c = l(a, "span", "font-family", "fontFamily"), d = c.split(","), e = {courier: 1, times: 1, "times new roman": 1, georgia: 1, palatino: 1, serif: 1}, f = 0; f < d.length; f++)if (b = n(d[f]), e.hasOwnProperty(b))return!0;
        return!1
    }

    function p(a) {
        return a.postMessage ? a.JSON ? 0 : "Microsoft Internet Explorer" === a.navigator.appName ? 2 : 1 : 1
    }

    function q() {
        var b = a.location.hash, c = b && b.match(/(comment|reply|edit)\-([0-9]+)/);
        return c && c[2]
    }

    function r(a) {
        var b = a.navigator.userAgent;
        return-1 !== b.indexOf("Mobi") && -1 === b.indexOf("iPad")
    }

    function s(a) {
        (new Image).src = DISQUS.serialize(v + "/stat.gif", {event: a})
    }

    function t(b, c, d) {
        return a.getComputedStyle ? w.defaultView.getComputedStyle(b, null).getPropertyValue(c) : b.currentStyle ? b.currentStyle[c] ? b.currentStyle[c] : b.currentStyle[d] : void 0
    }

    function u() {
        for (var a = w.getElementsByTagName("meta"), b = 0; b < a.length; b++)if ("viewport" === a[b].getAttribute("name"))return!0;
        return!1
    }

    var v = "//referrer.disqus.com/juggler", w = a.document, x = function () {
        var a, b, c = function () {
            return!1
        };
        if ("undefined" != typeof w.hidden)a = "hidden", b = "visibilitychange"; else if ("undefined" != typeof w.mozHidden)a = "mozHidden", b = "mozvisibilitychange"; else if ("undefined" != typeof w.msHidden)a = "msHidden", b = "msvisibilitychange"; else {
            if ("undefined" == typeof w.webkitHidden)return{isHidden: c, listen: c, stopListening: c};
            a = "webkitHidden", b = "webkitvisibilitychange"
        }
        return{isHidden: function () {
            return w[a]
        }, listen: function (a) {
            return DISQUS.addEvent(w, b, a)
        }, stopListening: function (a) {
            return DISQUS.removeEvent(w, b, a)
        }}
    }();
    return{MAX_Z_INDEX: 2147483647, getShortnameFromUrl: d, getForum: e, guessThreadTitle: g, getContrastYIQ: i, ensureHexColor: j, getElementStyle: l, getAnchorColor: m, normalizeFontValue: n, isSerif: o, getBrowserSupport: p, getPermalink: q, isPhone: r, logStat: s, getComputedStyle: t, isMobileLayout: u, pageVisibility: x}
}), DISQUS.define("next.host.app", function (a) {
    "use strict";
    var b = DISQUS.isOwn, c = DISQUS.extend, d = DISQUS.use("next.host"), e = d.urls, f = document.documentElement, g = document.location.protocol, h = {getRegistry: function () {
        var a = this._registry;
        return a ? a : this._registry = {}
    }, register: function (a) {
        var b = this.getRegistry();
        b[a.uid] = a
    }, unregister: function (a) {
        var b = this.getRegistry();
        delete b[a.uid]
    }, listByKey: function () {
        return this.getRegistry()
    }, list: function () {
        var a = this.getRegistry(), c = [];
        for (var d in a)b(a, d) && c.push(a[d]);
        return c
    }, get: function (a) {
        var c = this.getRegistry();
        return b(c, a) ? c[a] : null
    }}, i = function (a) {
        var b = this.constructor;
        this.uid = DISQUS.getUid(), b.register && b.register(this), this.settings = a || {};
        var c = [], d = this;
        do c.unshift(d), d = d.constructor.__super__; while (d);
        for (var e = 0, f = c.length; f > e; e++)d = c[e], d.events && this.on(d.events, this), d.onceEvents && this.once(d.onceEvents, this)
    };
    c(i.prototype, DISQUS.Events), i.prototype.destroy = function () {
        var a = this.constructor;
        this.off(), this.stopListening(), a.unregister && a.unregister(this)
    }, i.extend = function (a, d) {
        var e, f = this;
        e = a && b(a, "constructor") ? a.constructor : function () {
            return f.apply(this, arguments)
        }, c(e, f, d);
        var g = function () {
            this.constructor = e
        };
        return g.prototype = f.prototype, e.prototype = new g, a && c(e.prototype, a), e.__super__ = f.prototype, e
    };
    var j = i.extend({name: null, frame: null, origin: e.ensureHttpBasedProtocol("http://disqus.com", g), state: null, getUrl: function () {
        return e.get(this.name)
    }, getFrame: function () {
        var a, b = this.settings, c = {target: this.getUrl(), origin: this.origin, uid: this.uid};
        return b.windowName ? c.windowName = b.windowName : c.container = this.settings.container || document.body, this.getFrameSettings && (c = this.getFrameSettings(c)), new (a = c.windowName ? DISQUS.Popup : DISQUS.Channel)(c)
    }, setState: function (a) {
        var b = this.constructor;
        return a in b.states ? void(this.state = b.states[a]) : !1
    }, init: function () {
        var a, b = this;
        b.setState("INIT"), b.trigger("beforeInit"), b.frame = a = this.getFrame(), b.listenTo(a, "all", function (c, d) {
            b.trigger("frame:" + c, d, a)
        }), b.trigger("change:frame", a), b.frame.load(function () {
            b.setState("LOADED"), b.trigger("frameLoaded", a)
        }), b.trigger("afterInit")
    }, destroy: function () {
        var a = this.frame;
        a && (this.stopListening(a), a.destroy()), this.setState("KILLED"), this.frame = null, i.prototype.destroy.call(this)
    }, events: {"frame:ready": function () {
        this.setState("READY")
    }}}, {states: {INIT: 0, LOADED: 1, READY: 2, RUNNING: 3, KILLED: 4}});
    c(j, h);
    var k = j.extend({getUrl: function () {
        var b = this.settings, c = {f: b.forum, t_i: b.identifier, t_u: b.url || a.location.href, t_s: b.slug, t_e: b.title, t_d: b.documentTitle, t_t: b.title || b.documentTitle, t_c: b.category, s_o: b.sortOrder, l: b.language};
        return b.unsupported && (c.n_s = b.unsupported), e.get(this.name, c)
    }, getFrameInitParams: function (b, c) {
        var d = this.settings, e = {permalink: d.permalink, anchorColor: d.anchorColor, referrer: a.location.href, hostReferrer: document.referrer, colorScheme: d.colorScheme, typeface: d.typeface, remoteAuthS3: d.remoteAuthS3, apiKey: d.apiKey, sso: d.sso, parentWindowHash: a.location.hash, forceAutoStyles: d.forceAutoStyles, layout: d.layout, timestamp: this.timestamp};
        return c && c.elem && a.navigator.userAgent.match(/(iPad|iPhone|iPod)/) && (e.width = c.elem.offsetWidth), e.initialPosition = this.getViewportAndScrollStatus(), e
    }, listenToScrollEvent: function (a) {
        var b = this, c = b.getScrollContainer();
        if (c === f)return b.listenTo(DISQUS, "window.scroll", a), function () {
            b.stopListening(DISQUS, "window.scroll", a)
        };
        var d = DISQUS.throttle(function () {
            a.call(b)
        }, 250, 50);
        return DISQUS.addEvent(c, "scroll", d), function () {
            DISQUS.removeEvent(c, "scroll", d)
        }
    }, getScrollContainer: function () {
        if (this.scrollContainer)return this.scrollContainer;
        if (!this.settings.enableScrollContainer)return f;
        var a = this.settings.container;
        do {
            var b = d.utils.getComputedStyle(a, "overflow-y", "overflowY");
            if ("scroll" === b || "auto" === b)break;
            a = a.parentNode
        } while (a && a !== f);
        return this.scrollContainer = a
    }, getViewportCoords: function () {
        return this.getScrollContainer() === f ? this.getWindowCoords() : this.getScrollContainerCoords()
    }, getWindowCoords: function () {
        if ("number" == typeof a.pageYOffset)this.getWindowScroll = function () {
            return a.pageYOffset
        }, this.getWindowHeight = function () {
            return a.innerHeight
        }; else {
            var b = a.document;
            b = b.documentElement.clientHeight || b.documentElement.clientWidth ? b.documentElement : b.body, this.getWindowScroll = function () {
                return b.scrollTop
            }, this.getWindowHeight = function () {
                return b.clientHeight
            }
        }
        return this.getWindowCoords = function () {
            return{top: this.getWindowScroll(), height: this.getWindowHeight()}
        }, this.getWindowCoords()
    }, getScrollContainerCoords: function () {
        var a = this.getScrollContainer();
        return{top: a.scrollTop, height: a.clientHeight}
    }, getDocumentHeight: function () {
        var a = document.body, b = document.documentElement;
        return Math.max(a.scrollHeight, a.offsetHeight, b.clientHeight, b.scrollHeight, b.offsetHeight)
    }, getViewportAndScrollStatus: function () {
        var a = this.frame;
        if (!a || !a.getOffset)return null;
        var b = this.getViewportCoords();
        return{frameOffset: a.getOffset(this.getScrollContainer()), pageOffset: b.top, height: b.height}
    }, communicateViewportAndScrollStatus: function () {
        var a = this.getViewportAndScrollStatus();
        if (a) {
            var b = a.frameOffset, c = b.top, d = c + b.height, e = a.pageOffset, f = a.height, g = e + f, h = !1, i = !1;
            g + f >= c && (h = d >= e, i = h && g >= c);
            var j = this.frame;
            j.sendMessage("window.scroll.always", a), h && j.sendMessage("window.scroll", a), i !== this.wasInViewport && (j.sendMessage(i ? "window.inViewport" : "window.scrollOffViewport"), this.wasInViewport = i)
        }
    }, getBestNextFrameHeight: function (a) {
        var b = this.getViewportAndScrollStatus();
        if (!b || this.settings.enableScrollContainer || !this.getScrollContainer())return a;
        var c = b.frameOffset;
        if (a >= c.height)return a;
        var d = this.getDocumentHeight(), e = d - (c.height + c.top), f = b.pageOffset + b.height - (c.top + e);
        return f > a ? f + 1 : a
    }, events: {beforeInit: function () {
        this.settings.unsupported || (this.settings.windowName || (this.listenToScrollEvent(this.communicateViewportAndScrollStatus), this.listenTo(DISQUS, "window.resize", this.communicateViewportAndScrollStatus)), this.timestamp = +new Date)
    }, afterInit: function () {
        this.trigger("loading.start")
    }, frameLoaded: function (a) {
        var b = a.elem;
        this.settings.unsupported ? (a.setInlineStyle("height", "500px"), b.setAttribute("scrolling", "yes"), b.setAttribute("horizontalscrolling", "no"), b.setAttribute("verticalscrolling", "yes"), a.show()) : this.settings.windowName || (b.setAttribute("scrolling", "no"), b.setAttribute("horizontalscrolling", "no"), b.setAttribute("verticalscrolling", "no"))
    }, "frame:ready": function (a, b) {
        var c = this.getFrameInitParams(a, b);
        b.sendMessage("init", c), this.trigger("loading.init")
    }, "frame:resize": function (a, b) {
        var c = a.height;
        b.elem && this.rendered && (c = this.getBestNextFrameHeight(c), b.setInlineStyle("height", c + "px"), b.sendMessage("embed.resized")), this.communicateViewportAndScrollStatus()
    }, "frame:mainViewRendered": function (a, b) {
        this.rendered = !0, b.trigger("resize", a), b.sendMessage("embed.rendered"), this.trigger("loading.done")
    }, "frame:fail": function (a, b) {
        b.elem && b.setInlineStyle("height", "75px"), this.trigger("fail", a)
    }, "frame:scrollTo": function (b, c) {
        if (c.elem && c.getOffset) {
            var d = this.getScrollContainer(), e = c.getOffset(d), f = "window" === b.relative ? b.top : e.top + b.top, g = this.getViewportCoords();
            !b.force && f > g.top && f < g.top + g.height || (d === document.documentElement ? a.scrollTo(0, f) : d.scrollTop = f)
        }
    }}}), l = function (a, b, c) {
        DISQUS.each(b, function (b) {
            c[b] = function () {
                return a[b].apply(a, arguments)
            }
        })
    };
    return{expose: l, BaseApp: i, WindowedApp: j, ThreadBoundApp: k, PublicInterfaceMixin: h}
}), DISQUS.define("next.host.profile", function (a) {
    "use strict";
    var b = DISQUS.next.host, c = b.utils, d = b.app.WindowedApp, e = d.extend({name: "profile", events: {beforeInit: function () {
        var a = this.settings;
        a.fullscreen = a.fullscreen !== !1
    }, afterInit: function () {
        this.trigger("loading.start")
    }, "frame:ready": function (b, c) {
        var d = this.settings;
        c.sendMessage("init", {referrer: a.location.href, fullscreen: d.fullscreen, forumId: d.forumId, threadId: d.threadId, forumPk: d.forumPk}), this.trigger("loading.init")
    }, "frame:close": function (b, c) {
        c.hide(), a.focus()
    }, "frame:onboard.show": function (a) {
        this.showOnboard(a)
    }, "frame:renderProfile": function (a) {
        this.trigger("renderProfile", a)
    }, "frame:openReady": function () {
        var a = this.frame;
        a.show(), a.sendMessage("open")
    }}, getUrl: function () {
        var a = this.settings;
        return b.urls.get(this.name, {f: a.forum, l: a.language})
    }, showOnboard: function (a) {
        var c = this.settings;
        this.frame.hide();
        var d = b.onboard.Onboard({windowName: a.windowName, language: c.language, forum: c.forum, forumId: c.forumId, threadId: c.threadId, forumPk: c.forumPk, activeSection: "complete-profile"});
        this.stopListening(d), this.listenTo(d, "onboard.profileUpdated", function () {
            this.trigger("onboard.profileUpdated")
        }), this.listenToOnce(d, "onboard.complete", function () {
            this.trigger("onboard.complete")
        }), d.show({activeSection: a.activeSection})
    }, getFrameSettings: function (a) {
        var b = this.settings.fullscreen;
        return a.role = "dialog", a.styles = b ? {height: "100%", position: "fixed", top: 0, left: 0, "z-index": c.MAX_Z_INDEX} : {height: "100%", padding: 0}, a
    }, show: function (a) {
        DISQUS.isString(a) ? a = {user: {username: a}} : DISQUS.isString(a.user) && (a.user = {username: a.user});
        var b = this.frame;
        return b.isReady() ? void b.sendMessage("showProfile", a) : void this.once("frame:ready", function () {
            this.show(a)
        }, this)
    }});
    return DISQUS.extend(e.prototype, b.app.OnboardAppHelperMixin), {Profile: function (a) {
        return new e(a)
    }, _ProfileApp: e}
}), DISQUS.define("next.host.onboard", function (a) {
    "use strict";
    var b = DISQUS.next.host, c = b.utils, d = b.app.WindowedApp, e = d.extend({name: "onboard", events: {beforeInit: function () {
        var a = this.settings;
        a.fullscreen = a.fullscreen !== !1
    }, "frame:ready": function (b, c) {
        var d = this.settings;
        c.sendMessage("init", {referrer: a.location.href, fullscreen: d.fullscreen, forumPk: d.forumPk, forumId: d.forumId, threadId: d.threadId}), this.trigger("loading.init")
    }, "frame:close": function (b, c) {
        c.hide(), a.focus()
    }, "frame:profileUpdated": function () {
        this.trigger("onboard.profileUpdated")
    }, "frame:onboard.complete": function () {
        this.trigger("onboard.complete")
    }, "frame:openReady": function () {
        var a = this.frame;
        a.show(), a.sendMessage("open")
    }}, getUrl: function () {
        var a = this.settings;
        return b.urls.get(this.name, {f: a.forum, l: a.language})
    }, getFrameSettings: function (a) {
        var b = this.settings.fullscreen;
        return a.role = "dialog", a.styles = b ? {height: "100%", position: "fixed", top: 0, left: 0, "z-index": c.MAX_Z_INDEX} : {height: "100%", padding: 0}, a
    }, destroy: function () {
        e.instance = null, d.prototype.destroy.call(this)
    }, show: function (a) {
        var b = this.frame;
        return b.isReady() ? (b.sendMessage("showOnboard", a), void b.show()) : void this.once("frame:ready", function () {
            this.show(a)
        }, this)
    }}, {getInstance: function (a) {
        var b = e.instance;
        return b && (b.frame.windowName || b.frame.isKilled()) && (b.destroy(), b = null), b || (b = e.instance = new e(a), b.init()), b
    }});
    return{Onboard: e.getInstance, _OnboardApp: e}
}), DISQUS.define("next.host.backplane", function () {
    "use strict";
    var a;
    try {
        localStorage.setItem("disqus.localStorageTest", "disqus"), localStorage.removeItem("disqus.localStorageTest"), a = !0
    } catch (b) {
        a = !1
    }
    var c = function (b) {
        this.frame = b, this.credentials = "unset";
        var c = this;
        "function" == typeof Backplane && "string" == typeof Backplane.version && "function" == typeof Backplane.subscribe && a && Backplane(function () {
            c.initialize()
        })
    }, d = "disqus.backplane.channel", e = "disqus.backplane.messageUrl";
    return DISQUS.extend(c.prototype, {frameEvents: {invalidate: "clearCredentials"}, initialize: function () {
        var a = this;
        DISQUS.each(this.frameEvents, function (b, c) {
            a.frame.on("backplane." + c, "function" == typeof b ? b : a[b], a)
        }), this.credentialsFromLocalStorage() && this.frame.sendMessage("login", {backplane: this.credentials}), this.subscribe()
    }, subscribe: function () {
        var a = this;
        Backplane.subscribe(function (b) {
            var c = a.handlers[b.type];
            c && c.call(a, b)
        })
    }, handlers: {"identity/login": function (a) {
        var b = a.messageURL, c = a.channel;
        ("unset" === this.credentials || null === this.credentials || this.credentials.channel !== c || this.credentials.messageUrl !== b) && (this.setCredentials(c, b), this.frame.sendMessage("login", {backplane: this.getCredentials()}))
    }}, credentialsFromLocalStorage: function () {
        var a = localStorage.getItem(d), b = localStorage.getItem(e);
        return this.setCredentials(a, b, !0), this.credentials
    }, setCredentials: function (a, b, c) {
        return a && b ? (c || (localStorage.setItem(d, a), localStorage.setItem(e, b)), void(this.credentials = {channel: a, messageUrl: b})) : void this.clearCredentials()
    }, getCredentials: function () {
        return"unset" !== this.credentials ? this.credentials : this.credentialsFromLocalStorage()
    }, clearCredentials: function (a) {
        a = a || {}, this.credentials = null, localStorage.removeItem(d), localStorage.removeItem(e), a.redirectUrl && (window.location = a.redirectUrl)
    }}), {BackplaneIntegration: c}
}), DISQUS.define("next.host.lounge", function (a) {
    "use strict";
    var b = a.document, c = ".disqus-loader{animation:disqus-embed-spinner .7s infinite linear;-webkit-animation:disqus-embed-spinner .7s infinite linear}@keyframes disqus-embed-spinner{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}@-webkit-keyframes disqus-embed-spinner{0%{-webkit-transform:rotate(0deg)}100%{-webkit-transform:rotate(360deg)}}", d = "//a.disquscdn.com/next/assets/img/loader-bg.02dfd9d2b2565ee29ab17bc5d83f97d5.png", e = DISQUS.next.host, f = e.utils, g = e.app.ThreadBoundApp, h = g.extend({name: "lounge", indicators: null, wasInViewport: !1, triggeredSlowEvent: !1, events: {beforeInit: function () {
        var a = this.settings;
        a.unsupported || (this.indicators = {}, this.isContainerVisible() ? this.addLoadingAnim() : this.addLoadingAnimOnContainerVisible(), this.bindPublisherCallbacks(), this.forwardGlobalEvents())
    }, "frame:reload": function () {
        a.location.reload()
    }, "frame:reset": function () {
        DISQUS.reset({reload: !0})
    }, "frame:session.identify": function (a) {
        this.trigger("session.identify", a)
    }, "frame:posts.paginate": function () {
        this.trigger("posts.paginate")
    }, "frame:posts.create": function (a) {
        this.trigger("posts.create", {id: a.id, text: a.raw_message})
    }, "frame:posts.beforeCreate": function (a) {
        this.onBeforePostCreate(a)
    }, "frame:profile.show": function (a) {
        this.showProfile(a)
    }, "frame:onboard.show": function (a) {
        this.showOnboard(a)
    }, "frame:bubble:init": function (b, c) {
        if (c.getOffset) {
            var d = "270px", e = {width: d, "min-width": d, "max-width": d, position: "fixed", "z-index": f.MAX_Z_INDEX - 1, bottom: "0", right: "-" + d, "-webkit-transition": "right 0.7s", transition: "right 0.7s"}, g = new DISQUS.Sandbox({uid: "notification-bubble", container: this.settings.container, contents: b.contents, styles: e, role: "notification"});
            try {
                g.load()
            } catch (h) {
                return
            }
            g.hide(), g.setBodyClass(b.colorTheme);
            var i = function (b) {
                var c;
                return b || (b = a.event), b.target ? c = b.target : b.srcElement && (c = b.srcElement), 3 === c.nodeType && (c = c.parentNode), c
            };
            g.click(function (a) {
                var b = i(a), d = b.getAttribute("data-action") || "click";
                c.sendMessage("bubble:" + d, this.uid.split("-")[1])
            }), this.on({"frame:bubble:show": function (b) {
                g.document.getElementById("message").innerHTML = b.message, g.show(), g.updateHeight(), a.setTimeout(function () {
                    g.setInlineStyle({right: "50px"})
                }, 100)
            }, "frame:bubble:hide": function () {
                g && (g.setInlineStyle(e), a.setTimeout(function () {
                    g.hide()
                }, 1e3))
            }})
        }
    }, "frame:indicator:init": function (a, b) {
        if (b.getOffset) {
            for (var c, d, e = ["north", "south"], g = this.indicators, h = b.getOffset().width + "px", i = {width: h, "min-width": h, "max-width": h, position: "fixed", "z-index": f.MAX_Z_INDEX - 1}, j = {north: {top: "0"}, south: {bottom: "0"}}, k = 0; k < e.length; k++) {
                d = e[k], c = new DISQUS.Sandbox({uid: "indicator-" + d, container: this.settings.container, contents: a[d].contents, styles: DISQUS.extend(j[d], i), role: "alert", type: d});
                try {
                    c.load()
                } catch (l) {
                    continue
                }
                c.hide(), c.click(function () {
                    b.sendMessage("indicator:click", this.uid.split("-")[1])
                }), g[d] = c
            }
            this.on({"frame:indicator:show": function (a) {
                var b = g[a.type];
                b && (b.document.getElementById("message").innerHTML = a.content, b.show())
            }, "frame:indicator:hide": function (a) {
                var b = a && a.type, c = b && g[b];
                if (c)c.hide(); else if (!b)for (var d = 0; d < e.length; d++)b = e[d], c = g[b], c && c.hide()
            }})
        }
    }, "fail loading.done": function () {
        this.removeLoadingAnim()
    }, fail: function (a) {
        f.logStat("failed_embed.server." + a.code)
    }, "loading.done": function () {
        this.setState("RUNNING"), this.triggeredSlowEvent && f.logStat("rendered_embed.slow")
    }}, onceEvents: {"frame:viglink:init": function (b, c) {
        var d = function () {
            for (var b in a)if (0 === b.indexOf("skimlinks") || 0 === b.indexOf("skimwords"))return!0;
            return!1
        };
        if (!(a.vglnk_self || a.vglnk || d())) {
            var e = b.apiUrl, f = b.key, g = String(b.id);
            null != b.clientUrl && null != e && null != f && null != b.id && (this.listenForAffiliationRequests(e, f, g), DISQUS.define("vglnk", function () {
                return{api_url: e, key: f, sub_id: g, onlibready: function () {
                    c.sendMessage("viglink:change:timeout", {timeout: DISQUS.vglnk.opt("click_timeout")})
                }}
            }), a.vglnk_self = "DISQUS.vglnk", DISQUS.require(b.clientUrl))
        }
    }, "frame:loadBackplane": function (a, b) {
        this.backplane = new DISQUS.next.host.backplane.BackplaneIntegration(b)
    }}, getFrameInitParams: function (a, b) {
        var c = g.prototype.getFrameInitParams.call(this, a, b);
        return c.discovery = this.settings.discovery, c
    }, onBeforePostCreate: function (a) {
        var b = {text: a.raw_message};
        try {
            var c = this.settings.callbacks.beforeComment;
            if (c)for (var d = 0; d < c.length; d++)b = c[d](b)
        } catch (e) {
            DISQUS.log("Error processing Disqus callback: ", e.toString())
        } finally {
            this.frame.sendMessage("posts.beforeCreate.response", b && b.text)
        }
    }, showOnboard: function (a) {
        var b = this.settings, c = e.onboard.Onboard({windowName: a.windowName, language: b.language, forum: b.forum, forumId: a.forumId, threadId: a.threadId, forumPk: a.forumPk});
        this.stopListening(c), this.listenToOnce(c, "onboard.complete", function () {
            this.frame.sendMessage("onboard.complete")
        }), this.listenTo(c, "onboard.profileUpdated", function () {
            this.frame.sendMessage("onboard.profileUpdated")
        }), c.show({activeSection: a.activeSection})
    }, showProfile: function (a) {
        var b = this.settings, c = this.profile;
        c && (c.frame.windowName || c.frame.isKilled()) && (c.destroy(), c = null), c || (c = this.profile = e.profile.Profile({windowName: a.windowName, language: b.language, forum: b.forum, forumId: a.forumId, threadId: a.threadId, forumPk: a.forumPk}), c.init(), this.listenToOnce(c, "onboard.complete", function () {
            this.frame.sendMessage("onboard.complete")
        }), this.listenTo(c, "onboard.profileUpdated", function () {
            this.frame.sendMessage("onboard.profileUpdated")
        })), c.show({user: {id: a.userId}, defaultSection: a.defaultSection})
    }, listenForAffiliationRequests: function (a, b, c) {
        var d = this.frame;
        this.on("frame:viglink:getaffiliatelink", function (e) {
            function f(a) {
                return function (b) {
                    var c = {linkId: a};
                    b && (c.url = b), d.sendMessage("viglink:getaffiliatelink:response", c)
                }
            }

            var g = DISQUS.vglnk.$;
            return g ? void g.request(a + "/click", {format: "jsonp", out: e.url, key: b, loc: d.target, subId: c}, {fn: f(e.linkId), timeout: DISQUS.vglnk.opt("click_timeout")}) : void d.sendMessage("viglink:getaffiliatelink:response")
        })
    }, forwardGlobalEvents: function () {
        var a = this;
        a.settings.windowName || (a.listenTo(DISQUS, "window.resize", function () {
            a.frame.sendMessage("window.resize")
        }), a.listenTo(DISQUS, "window.click", function () {
            a.frame.sendMessage("window.click")
        })), a.listenTo(DISQUS, "window.hashchange", function (b) {
            a.frame.sendMessage("window.hashchange", b.hash)
        })
    }, bindPublisherCallbacks: function () {
        var a = this, b = a.settings, c = h.LEGACY_EVENTS_MAPPING, d = b.callbacks;
        d && DISQUS.each(d, function (b, d) {
            c[d] && DISQUS.each(b, function (b) {
                a.on(c[d], b)
            })
        })
    }, isContainerVisible: function () {
        var a = this.getViewportCoords(), b = DISQUS.getOffset(this.settings.container, this.getScrollContainer()), c = b.top + b.height - a.top;
        return c > 0 && c <= a.height
    }, showSlowLoadingMessage: function () {
        var a, b = this;
        if (b.loadingElem) {
            if (f.pageVisibility.isHidden())return a = function () {
                f.pageVisibility.stopListening(a), b.setSlowLoadingMessageTimer(2e3)
            }, void f.pageVisibility.listen(a);
            b.triggeredSlowEvent = !0, f.logStat(b.state === b.constructor.states.READY ? "slow_embed.got_ready" : b.state === b.constructor.states.LOADED ? "slow_embed.loaded" : "slow_embed.no_ready"), b.loadingElem.firstChild.insertAdjacentHTML("afterend", '<p align="center">Disqus seems to be taking longer than usual. <a href="#" onclick="DISQUS.reset({reload: true}); return false;">Reload</a>?</p>')
        }
    }, clearSlowLoadingMessageTimer: function () {
        this.timeout && (clearTimeout(this.timeout), this.timeout = null)
    }, setSlowLoadingMessageTimer: function (a) {
        var b = this;
        b.clearSlowLoadingMessageTimer(), b.timeout = setTimeout(function () {
            b.showSlowLoadingMessage()
        }, a)
    }, addLoadingAnimOnContainerVisible: function () {
        var a, b = this;
        a = b.listenToScrollEvent(function () {
            var c = b.isContainerVisible();
            (c || b.state >= b.constructor.states.RUNNING) && a(), c && b.addLoadingAnim()
        })
    }, addLoadingAnim: function () {
        var a, e, g, h = this, i = h.settings.container;
        if (h.loadingElem)return h.loadingElem;
        if (!(h.state >= h.constructor.states.RUNNING)) {
            var j = b, k = j.createElement("style");
            k.type = "text/css", k.styleSheet ? k.styleSheet.cssText = c : k.appendChild(j.createTextNode(c)), a = j.createElement("div"), e = j.createElement("div"), g = j.createElement("div"), e.appendChild(k), e.appendChild(g), a.appendChild(e), a.dir = "ltr", a.style.overflow = "hidden";
            var l = e.style;
            l.height = "51px", l.width = "54px", l.margin = "0 auto", l.overflow = "hidden";
            var m = g.style;
            return m.height = m.width = "29px", m.margin = "11px 14px", g.className = "disqus-loader", m.backgroundImage = l.backgroundImage = "url(" + d + ")", m.backgroundRepeat = l.backgroundRepeat = "no-repeat", m.backgroundPosition = "-54px 0", "dark" === h.settings.colorScheme && (l.backgroundPosition = "0 -51px", m.backgroundPosition = "-54px -51px"), m.transformOrigin = "50% 50% 0px", i.appendChild(a), h.loadingElem = a, f.logStat("lounge.loading.view"), h.setSlowLoadingMessageTimer(15e3), h.loadingElem
        }
    }, removeLoadingAnim: function () {
        var a = this.loadingElem, b = this.settings.container;
        this.clearSlowLoadingMessageTimer(), a && a.parentNode === b && (b.removeChild(a), this.loadingElem = null)
    }, destroy: function () {
        var a = this.indicators;
        this.removeLoadingAnim(), this.profile && this.profile.destroy(), a && a.north && (a.north.destroy(), a.north = null), a && a.south && (a.south.destroy(), a.south = null), g.prototype.destroy.call(this)
    }}, {LEGACY_EVENTS_MAPPING: {onReady: "loading.done", onNewComment: "posts.create", onPaginate: "posts.paginate", onIdentify: "session.identify"}}), i = function (a) {
        return new h(a)
    };
    return e.app.expose(h, ["list", "listByKey", "get"], i), {Lounge: i}
}), DISQUS.define("next.host.config", function (a, b) {
    "use strict";
    var c = DISQUS.use("next.host.utils"), d = function (a, c) {
        this.win = a, this.configurator = c, this.config = {page: {url: b, title: b, slug: b, category_id: b, identifier: b, language: b, api_key: b, remote_auth_s3: b, author_s3: b}, experiment: {enable_scroll_container: b, force_auto_styles: b, sort_order: b}, discovery: {disable_all: b, disable_promoted: b, sponsored_comment_id: b}, strings: b, sso: {}, callbacks: {preData: [], preInit: [], onInit: [], afterRender: [], onReady: [], onNewComment: [], preReset: [], onPaginate: [], onIdentify: [], beforeComment: []}}
    };
    d.DISQUS_GLOBALS = ["shortname", "identifier", "url", "title", "category_id", "slug"];
    var e = d.prototype;
    return e.getContainer = function () {
        var a = this.win;
        return a.document.getElementById(a.disqus_container_id || "disqus_thread")
    }, e.runConfigurator = function () {
        var a = this.configurator || this.win.disqus_config;
        if ("function" == typeof a)try {
            a.call(this.config)
        } catch (b) {
        }
    }, e.getValuesFromGlobals = function () {
        var a, b = this.win, e = this.config, f = e.page;
        DISQUS.each(d.DISQUS_GLOBALS, function (a) {
            var c = b["disqus_" + a];
            debugger;
            "undefined" != typeof c && (f[a] = c)
        }), this.runConfigurator(), e.forum || (a = f.shortname, e.forum = a ? a.toLowerCase() : c.getForum(b.document))
    }, e.toJSON = function () {
        var a = this.win, b = this.config, d = b.page, e = this.getContainer();
        return this.getValuesFromGlobals(), {container: e, forum: b.forum, sortOrder: b.experiment.sort_order || "default", permalink: c.getPermalink(), language: b.language, typeface: c.isSerif(e) ? "serif" : "sans-serif", anchorColor: c.getAnchorColor(e), colorScheme: 128 < c.getContrastYIQ(c.getElementStyle(e, "span", "color")) ? "dark" : "light", url: d.url || a.location.href.replace(/#.*$/, ""), title: d.title, documentTitle: c.guessThreadTitle(), slug: d.slug, category: d.category_id, identifier: d.identifier, discovery: b.discovery, apiKey: d.api_key, remoteAuthS3: d.remote_auth_s3, sso: b.sso, unsupported: c.getBrowserSupport(a), callbacks: b.callbacks, enableScrollContainer: b.experiment.enable_scroll_container, forceAutoStyles: b.experiment.force_auto_styles, layout: c.isMobileLayout() ? "mobile" : "desktop"}
    }, {HostConfig: d}
}), DISQUS.define("next.host.loader", function (a) {
    "use strict";
    var b, c = DISQUS.use("next.host.loader"), d = DISQUS.use("next.host"), e = new d.config.HostConfig(a), f = !1, g = function () {
        var b = a.document;
        if (b.getElementsByClassName) {
            if ("complete" !== b.readyState)return DISQUS.addEvent(a, "load", g);
            var c = b.getElementsByClassName("dsq-brlink"), d = c && c.length && c[0];
            d && d.parentNode.removeChild(d)
        }
    }, h = function (a) {
        if (b)return i({reload: !0}), DISQUS.log("Use DISQUS.reset instead of reloading embed.js please."), void DISQUS.log("See http://help.disqus.com/customer/portal/articles/472107-using-disqus-on-ajax-sites");
        e.configurator = a;
        var g = e.toJSON();
        return f || (g.container.innerHTML = "", f = !0), b = d.lounge.Lounge(g), b.init(), c.removeDisqusLink(), b
    }, i = function (a) {
        a = a || {}, b && (b.triggeredSlowEvent && b.state !== b.constructor.states.RUNNING && d.utils.logStat("reset_embed.slow"), b.destroy(), b = null), a.reload && c.loadEmbed(a.config)
    };
    return{configAdapter: e, removeDisqusLink: g, loadEmbed: h, reset: i}
}), function () {
    "use strict";
    DISQUS.reset = DISQUS.next.host.loader.reset, DISQUS.request = {get: function (a, b, c) {
        DISQUS.require(a, b, c)
    }}
}(), DISQUS.next.host.loader.loadEmbed();
