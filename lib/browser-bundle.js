;(function(e,t,n){function i(n,s){if(!t[n]){if(!e[n]){var o=typeof require=="function"&&require;if(!s&&o)return o(n,!0);if(r)return r(n,!0);throw new Error("Cannot find module '"+n+"'")}var u=t[n]={exports:{}};e[n][0].call(u.exports,function(t){var r=e[n][1][t];return i(r?r:t)},u,u.exports)}return t[n].exports}var r=typeof require=="function"&&require;for(var s=0;s<n.length;s++)i(n[s]);return i})({1:[function(require,module,exports){
// nothing to see here... no file methods for the browser

},{}],2:[function(require,module,exports){
// tinix.js
//
// Copyright 2013 - Santosh Rajan - santoshrajan.com
//


if (!Element.prototype.on) Element.prototype.on = Element.prototype.addEventListener

var tinix = function(id) {
    return document.querySelector(id)
}

tinix.version = "0.0.9"

tinix.all = function(id) {
    return document.querySelectorAll(id)
}

tinix.forEach = function(s, f) {
    Array.prototype.forEach.call(this.all(s), f)
}

tinix.map = function(s, f) {
    return Array.prototype.map.call(this.all(s), f)
}

tinix.style = function(s, n, v) {
    this.forEach(s, function(elem) {
       elem.style[n] = v
    })
}

tinix.display = function(s, v) {
    this.style(s, "display", v)
}

tinix.ready = function(f) {
    if (document.readyState == "loading") {
        document.onreadystatechange = function() {
            if (document.readyState == "interactive") f()
        }
    } else {
        f()
    }
}

tinix.getR = function(c) {
    var r = new XMLHttpRequest()
    r.onload = function() {
        if (r.status == 200) {
            if (r.getResponseHeader("Content-Type") == "application/json") {
                c(null, JSON.parse(r.responseText))
            } else {
                c(null, r.responseText)
            }
        } else {
            c(r)
        }
    }
    return r
}

// get(url, callback [,overrideMimeType])
tinix.get = function(u, c, o) {
    var r = this.getR(c)
    r.open("GET", u)
    if (o) {
      r.overrideMimeType(o)
    }
    r.send()
}

// post(url, body, contenttype, callback)
tinix.post = function(u, b, t, c) {
    var r = this.getR(c)
    r.open("POST", u)
    r.setRequestHeader("Content-Type", t)
    r.send(b)
}

// postJSON(url, body, callback)
tinix.postJSON = function(u, b, c) {
    this.post(u, JSON.stringify(b), "application/json", c)
}

/*\
|*|
|*|  :: cookies.js ::
|*|
|*|  A complete cookies reader/writer framework with full unicode support.
|*|
|*|  https://developer.mozilla.org/en-US/docs/DOM/document.cookie
|*|
|*|  This framework is released under the GNU Public License, version 3 or later.
|*|  http://www.gnu.org/licenses/gpl-3.0-standalone.html
|*|
|*|  Syntaxes:
|*|
|*|  * docCookies.setItem(name, value[, end[, path[, domain[, secure]]]])
|*|  * docCookies.getItem(name)
|*|  * docCookies.removeItem(name[, path])
|*|  * docCookies.hasItem(name)
|*|  * docCookies.keys()
|*|
\*/
 
tinix.cookies = {
  getItem: function (sKey) {
    return unescape(document.cookie.replace(new RegExp("(?:(?:^|.*;\\s*)" + escape(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*((?:[^;](?!;))*[^;]?).*)|.*"), "$1")) || null;
  },
  setItem: function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
    if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) { return false; }
    var sExpires = "";
    if (vEnd) {
      switch (vEnd.constructor) {
        case Number:
          sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + vEnd;
          break;
        case String:
          sExpires = "; expires=" + vEnd;
          break;
        case Date:
          sExpires = "; expires=" + vEnd.toGMTString();
          break;
      }
    }
    document.cookie = escape(sKey) + "=" + escape(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
    return true;
  },
  removeItem: function (sKey, sPath) {
    if (!sKey || !this.hasItem(sKey)) { return false; }
    document.cookie = escape(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (sPath ? "; path=" + sPath : "");
    return true;
  },
  hasItem: function (sKey) {
    return (new RegExp("(?:^|;\\s*)" + escape(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
  }
};

module.exports = tinix


},{}],3:[function(require,module,exports){
var $  = require("tinix"),
    ls = require("lispyscript"),
    fs = require("fs"),
    cache = {}

var macros = ";; List of built in macros for LispyScript. This file is included by\n;; default by the LispyScript compiler.\n\n\n;;;;;;;;;;;;;;;;;;;; Conditionals ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\n\n(macro undefined? (obj)\n  (= (typeof ~obj) \"undefined\"))\n\n(macro null? (obj)\n  (= ~obj null))\n\n(macro true? (obj)\n  (= true ~obj))\n\n(macro false? (obj)\n  (= false ~obj))\n\n(macro boolean? (obj)\n  (= (typeof ~obj) \"boolean\"))\n\n(macro zero? (obj)\n  (= 0 ~obj))\n\n(macro number? (obj)\n  (= (Object.prototype.toString.call ~obj) \"[object Number]\"))\n\n(macro string? (obj)\n  (= (Object.prototype.toString.call ~obj) \"[object String]\"))\n\n(macro array? (obj)\n  (= (Object.prototype.toString.call ~obj) \"[object Array]\"))\n\n(macro object? (obj)\n  (= (Object.prototype.toString.call ~obj) \"[object Object]\"))\n\n(macro function? (obj)\n  (= (Object.prototype.toString.call ~obj) \"[object Function]\"))\n\n\n;;;;;;;;;;;;;;;;;;;;;;; Expressions ;;;;;;;;;;;;;;;;;;;;\n\n(macro do (rest...)\n  ((function () ~rest...)))\n\n(macro when (cond rest...)\n  (if ~cond (do ~rest...)))\n\n(macro unless (cond rest...)\n  (when (! ~cond) (do ~rest...)))\n\n(macro cond (rest...)\n  (if (#args-shift rest...) (#args-shift rest...) (#args-if rest... (cond ~rest...))))\n\n(macro arrayInit (len obj)\n  ((function (l o)\n    (var ret [])\n    (javascript \"for(var i=0;i<l;i++) ret.push(o);\")\n    ret) ~len ~obj))\n\n(macro arrayInit2d (i j obj)\n  ((function (i j o)\n    (var ret [])\n    (javascript \"for(var n=0;n<i;n++){var inn=[];for(var m=0;m<j;m++) inn.push(o); ret.push(inn);}\")\n    ret) ~i ~j ~obj))\n\n;; method chaining macro\n(macro -> (func form rest...)\n  (#args-if rest... \n    (-> (((#args-shift form) ~func) ~@form) ~rest...)\n    (((#args-shift form) ~func) ~@form)))\n\n;;;;;;;;;;;;;;;;;;;;;; Iteration and Looping ;;;;;;;;;;;;;;;;;;;;\n\n(macro each (arr rest...)\n  ((.forEach ~arr) ~rest...))\n\n(macro reduce (arr rest...)\n  ((.reduce ~arr) ~rest...))\n \n(macro eachKey (obj fn rest...)\n  ((function (o f s)\n    (var _k (Object.keys o))\n    (each _k\n      (function (elem)\n        (f.call s (get elem o) elem o)))) ~obj ~fn ~rest...))\n\n(macro each2d (arr fn)\n  (each ~arr\n    (function (___elem ___i ___oa)\n      (each ___elem\n        (function (___val ___j ___ia)\n          (~fn ___val ___j ___i ___ia ___oa))))))\n\n(macro map (arr rest...)\n  ((.map ~arr) ~rest...))\n\n(macro filter (rest...)\n  (Array.prototype.filter.call ~rest...))\n\n(macro some (rest...)\n  (Array.prototype.some.call ~rest...))\n\n(macro every (rest...)\n  (Array.prototype.every.call ~rest...))\n\n(macro loop (args vals rest...)\n  ((function ()\n    (var recur null\n         ___result !undefined\n         ___nextArgs null\n         ___f (function ~args ~rest...))\n    (set recur\n      (function ()\n        (set ___nextArgs arguments)\n        (if (= ___result undefined)\n          undefined\n          (do\n            (set ___result undefined)\n            (javascript \"while(___result===undefined) ___result=___f.apply(this,___nextArgs);\")\n            ___result))))\n    (recur ~@vals))))\n\n(macro for (rest...)\n  (doMonad arrayMonad ~rest...))\n\n\n;;;;;;;;;;;;;;;;;;;; Templates ;;;;;;;;;;;;;;;;;;;;;;;;;;;;\n\n(macro template (name args rest...)\n  (var ~name\n    (function ~args\n      (str ~rest...))))\n\n(macro template-repeat (arg rest...)\n  (reduce ~arg\n    (function (___memo elem index)\n      (+ ___memo (str ~rest...))) \"\"))\n\n(macro template-repeat-key (obj rest...)\n  (do\n    (var ___ret \"\")\n    (eachKey ~obj\n      (function (value key)\n        (set ___ret (+ ___ret (str ~rest...)))))\n    ___ret))\n\n\n;;;;;;;;;;;;;;;;;;;; Callback Sequence ;;;;;;;;;;;;;;;;;;;;;\n\n(macro sequence (name args init rest...)\n  (var ~name\n    (function ~args\n      ((function ()\n        ~@init\n        (var next null)\n        (var ___curr 0)\n        (var ___actions (new Array ~rest...))\n        (set next\n          (function ()\n            (var ne (get ___curr++ ___actions))\n            (if ne\n              ne\n              (throw \"Call to (next) beyond sequence.\"))))\n        ((next)))))))\n\n\n;;;;;;;;;;;;;;;;;;; Unit Testing ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\n\n(macro assert (cond message)\n  (if (true? ~cond)\n    (+ \"Passed - \" ~message)\n    (+ \"Failed - \" ~message)))\n\n(macro testGroup (name rest...)\n  (var ~name \n    (function ()\n      (array ~rest...))))\n\n(macro testRunner (groupname desc)\n  ((function (groupname desc)\n    (var start (new Date)\n         tests (groupname)\n         passed 0\n         failed 0)\n    (each tests\n      (function (elem)\n        (if (elem.match /^Passed/)\n          ++passed\n          ++failed)))\n    (str \n      (str \"\\n\" desc \"\\n\" start \"\\n\\n\")\n      (template-repeat tests elem \"\\n\")\n      \"\\nTotal tests \" tests.length \n      \"\\nPassed \" passed \n      \"\\nFailed \" failed \n      \"\\nDuration \" (- (new Date) start) \"ms\\n\")) ~groupname ~desc))\n\n\n;;;;;;;;;;;;;;;; Monads ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\n\n(macro identityMonad ()\n  (object\n    mBind (function (mv mf) (mf mv))\n    mResult (function (v) v)))\n\n(macro maybeMonad ()\n  (object\n    mBind (function (mv mf) (if (null? mv) null (mf mv)))\n    mResult (function (v) v)\n    mZero null))\n\n(macro arrayMonad ()\n  (object\n    mBind (function (mv mf)\n              (reduce\n                (map mv mf)\n                (function (accum val) (accum.concat val))\n                []))\n    mResult (function (v) [v])\n    mZero []\n    mPlus (function ()\n              (reduce\n                (Array.prototype.slice.call arguments)\n                (function (accum val) (accum.concat val))\n                []))))\n\n(macro stateMonad ()\n  (object\n    mBind (function (mv f)\n              (function (s)\n                (var l (mv s)\n                     v (get 0 l)\n                     ss (get 1 l))\n                ((f v) ss)))\n    mResult (function (v) (function (s) [v, s]))))\n\n(macro continuationMonad ()\n  (object\n    mBind (function (mv mf)\n              (function (c)\n                (mv\n                  (function (v)\n                    ((mf v) c)))))\n    mResult (function (v)\n                (function (c)\n                  (c v)))))\n\n(macro m-bind (bindings expr)\n  (mBind (#args-second bindings)\n    (function ((#args-shift bindings))\n      (#args-if bindings (m-bind ~bindings ~expr) ((function () ~expr))))))\n\n(macro withMonad (monad rest...)\n  ((function (___monad)\n    (var mBind ___monad.mBind\n         mResult ___monad.mResult\n         mZero ___monad.mZero\n         mPlus ___monad.mPlus)\n    ~rest...) (~monad)))\n\n(macro doMonad (monad bindings expr)\n  (withMonad ~monad\n    (var ____mResult\n      (function (___arg)\n        (if (&& (undefined? ___arg) (! (undefined? mZero)))\n          mZero\n          (mResult ___arg))))\n    (m-bind ~bindings (____mResult ~expr))))\n\n(macro monad (name obj)\n  (var ~name\n    (function ()\n      ~obj)))\n\n\n\n"
ls._compile(macros, "macros.ls")

function createHandler(script) {
    return function(done) {
        if (!script.src) {
            done()
        } else {
            $.get(
                script.src,
                function(err, ls) {
                    if (err) {
                        console.log("Error loading file " + script.src)
                    } else {
                        script.ls = ls
                    }
                    done()
                },
                "text/plain"
            )
        }
    }
}

function runModule(js) {
    var module = {exports: {}},
        func = new Function("module, exports, require", js),
        require = function(name) {
            if (cache[name]) {
                return cache[name]
            } else {
                if (window.require) {
                    return window.require(name)
                } else {
                    throw new Error("Cannot find module " + name)
                }
            }
        }

    func(module, module.exports, require)
    return module.exports
}

function doParallel(handlers, callback) {
    var counter = handlers.length
        done = function() {
            --counter
            if (counter === 0) {
                callback()
            }
        }

    handlers.forEach(function(f) {
        f(done)
    })
}


$.ready(function() {
    var scripts = $.map("script[type='text/lispyscript']", function(script) {
        return {id: script.id, src: script.src, ls: script.src ? null : script.innerHTML}
    })
    var handlers = scripts.map(function(script) {
        return createHandler(script)
    })
    doParallel(handlers, function() {
        scripts.forEach(function(script) {
            script.js = ls._compile(script.ls, script.src)
            cache[script.id] = runModule(script.js)
        })
    })
})

},{"fs":1,"tinix":2,"lispyscript":4}],4:[function(require,module,exports){
(function(__dirname){/*
 *
LispyScript - Javascript using tree syntax!
This is the compiler written in javascipt
 *
*/

var version = "0.3.6",
    banner = "// Generated by LispyScript v" + version + "\n",
    isWhitespace = /\s/,
    isFunction = /^function\b/,
    validName = /^[a-zA-Z_$][0-9a-zA-Z_$]*$/,
    noReturn = /^var\b|^set\b|^throw\b/,
    isHomoiconicExpr = /^#args-if\b|^#args-shift\b|^#args-second\b/,
    noSemiColon = false,
    indentSize = 4,
    indent = -indentSize,
    keywords = {},
    macros = {},
    errors = [],
    fs

if (typeof window === "undefined") {
  fs = require('fs')
}

if (!String.prototype.repeat) {
    String.prototype.repeat = function(num) {
        return new Array(num + 1).join(this)
    }
}

var parse = function(code, filename) {
    code = "(" + code + ")"
    var length = code.length,
        pos = 1,
        lineno = 1

    var parser = function() {

        var tree = [],
            token = "",
            isString = false,
            isSingleString = false,
            isJSArray = 0,
            isJSObject = 0,
            isListComplete = false,
            isComment = false,
            isRegex = false,
            isEscape = false,
            handleToken = function() {
                if (token) {
                    tree.push(token)
                    token = ""
                }
            }

        tree._line = lineno
        tree._filename = filename

        while (pos < length) {

            var c = code.charAt(pos)
            pos++

            if (c == "\n") {
                lineno++
                if (isComment) {
                    isComment = false
                }
            }

            if (isComment) {
                continue
            }

            if (isEscape) {
                isEscape = false
                token += c
                continue
            }

        // strings
            if (c == '"') {
                isString = !isString
                token += c
                continue
            }
            if (isString) {
                if (c === "\n") {
                    token += "\\n"
                } else {
                    if (c === "\\") {
                        isEscape = true
                    }
                    token += c
                }
                continue
            }
            if (c == "'") {
                isSingleString = !isSingleString
                token += c
                continue
            }
            if (isSingleString) {
                token += c
                continue
            }

        // data types
            if (c == '[') {
                isJSArray++
                token += c
                continue
            }
            if (c == ']') {
                if (isJSArray === 0) {
                    handleError(4, tree._line, tree._filename)
                }
                isJSArray--
                token += c
                continue
            }
            if (isJSArray) {
                token += c
                continue
            }
            if (c == '{') {
                isJSObject++
                token += c
                continue
            }
            if (c == '}') {
                if (isJSObject === 0) {
                    handleError(6, tree._line, tree._filename)
                }
                isJSObject--
                token += c
                continue
            }
            if (isJSObject) {
                token += c
                continue
            }

            if (c == ";") {
                isComment = true
                continue
            }

        // regex
        // regex in function position with first char " " is a prob. Use \s instead.
            if (c === "/" && !(tree.length === 0 && token.length === 0 && isWhitespace.test(code.charAt(pos)))) {
                isRegex = !isRegex
                token += c
                continue
            }
            if (isRegex) {
                if (c === "\\") {
                    isEscape = true
                }
                token += c
                continue
            }

            if (c == "(") {
                tree.push(parser())
                continue
            }
            if (c == ")") {
                isListComplete = true
                handleToken()
                break
            }

            if (isWhitespace.test(c)) {
                handleToken()
                continue
            }

            token += c
        }
        if (isString) handleError(3, tree._line, tree._filename)
        if (isRegex) handleError(14, tree._line, tree._filename)
        if (isSingleString) handleError(3, tree._line, tree._filename)
        if (isJSArray > 0) handleError(5, tree._line, tree._filename)
        if (isJSObject > 0) handleError(7, tree._line, tree._filename)
        if (!isListComplete) handleError(8, tree._line, tree._filename)
        return tree
    }
    var ret = parser()
    if (pos < length) {
        handleError(10)
    }
    return ret
}

var handleExpressions = function(exprs) {
    indent += indentSize
    var ret = "",
        l = exprs.length,
        indentstr = " ".repeat(indent)
    exprs.forEach(function(expr, i, exprs) {
        var exprName,
            tmp = "",
            r = ""
        if (Array.isArray(expr)) {
            exprName = expr[0]
            if (exprName === "include")
                ret += handleExpression(expr)
            else
                tmp = handleExpression(expr)
        } else {
            tmp = expr
        }
        if (i === l - 1 && indent) {
            if (!noReturn.test(exprName)) r = "return "
        }
        if (tmp.length > 0) {
            var endline = noSemiColon ? "\n" : ";\n"
            noSemiColon = false
            ret += indentstr + r + tmp + endline
        }
    })
    indent -= indentSize
    return ret
}

var handleExpression = function(expr) {
    if (!expr) {
        return ""
    }
    var command = expr[0]
    if (macros[command]) {
        expr = macroExpand(expr)
        if (Array.isArray(expr)) {
            return handleExpression(expr)
        } else {
            return expr
        }
    }
    if (typeof command === "string") {
        if (keywords[command]) {
            return keywords[command](expr)
        }
        if (command.charAt(0) === ".") {
            return "(" + (Array.isArray(expr[1]) ? handleExpression(expr[1]) : expr[1]) + ")" + command
        }
    }
    handleSubExpressions(expr)
    var fName = expr[0]
    if (!fName) {
        handleError(1, expr._line)
    }
    if (isFunction.test(fName)) {
        fName = "(" + fName + ")"
    }
    return fName + "(" + expr.slice(1).join(",") + ")"
}

var handleSubExpressions = function(expr) {
    expr.forEach(function(value, i, t) {
        if (Array.isArray(value)) t[i] = handleExpression(value)
    })
}

var macroExpand = function(tree) {
    var command = tree[0],
        template = macros[command]["template"],
        code = macros[command]["code"],
        replacements = {}
    for (var i = 0; i < template.length; i++) {
        if (template[i] == "rest...") {
            replacements["~rest..."] = tree.slice(i + 1)
        } else {
            if (tree.length === i + 1) {
                // we are here if any macro arg is not set
                handleError(12, tree._line, tree._filename, command)
            }
            replacements["~" + template[i]] = tree[i + 1]
        }
    }
    var replaceCode = function(source) {
        var ret = []
        ret._line = tree._line
        ret._filename = tree._filename

        // Handle homoiconic expressions in macro
        var expr_name = source[0]
        if (isHomoiconicExpr.test(expr_name)) {
            var replarray = replacements["~" + source[1]]
            if (expr_name === "#args-shift") {
                if (!Array.isArray(replarray)) {
                    handleError(13, tree._line, tree._filename, command)
                }
                var argshift = replarray.shift()
                if (typeof argshift === "undefined") {
                    handleError(12, tree._line, tree._filename, command)
                }
                return argshift
            }
            if (expr_name === "#args-second") {
                if (!Array.isArray(replarray)) {
                    handleError(13, tree._line, tree._filename, command)
                }
                var argsecond = replarray.splice(1, 1)[0]
                if (typeof argsecond === "undefined") {
                    handleError(12, tree._line, tree._filename, command)
                }
                return argsecond
            }
            if (expr_name === "#args-if") {
                if (!Array.isArray(replarray)) {
                    handleError(13, tree._line, tree._filename, command)
                }
                if (replarray.length) {
                    return replaceCode(source[2])
                } else if (source[3]) {
                    return replaceCode(source[3])
                } else {
                    return
                }
            }
        }
        for (var i = 0; i < source.length; i++) {
            if (typeof source[i] == "object") {
                var replcode = replaceCode(source[i])
                if (typeof replcode !== "undefined") {
                    ret.push(replcode)
                }
            } else {
                var token = source[i],
                    tokenbak = token,
                    isATSign = false
                if (token.indexOf("@") >= 0) {
                    isATSign = true
                    tokenbak = token.replace("@", "") 
                }
                if (replacements[tokenbak]) {
                    var repl = replacements[tokenbak]
                    if (isATSign || tokenbak == "~rest...") {
                        for (var j = 0; j < repl.length; j++)
                            ret.push(repl[j])
                    } else {
                        ret.push(repl)
                    }
                } else {
                    ret.push(token)
                }
            }
        }
        return ret
    }
    return replaceCode(code)
}

var handleOperator = function(arr) {
    if (arr.length != 3)  handleError(0, arr._line)
    handleSubExpressions(arr)
    if (arr[0] == "=") arr[0] = "==="
    if (arr[0] == "!=") arr[0] = "!=="
    return "(" + arr[1] + " " + arr[0] + " " + arr[2] + ")"
}

keywords["var"] = function(arr) {
    if (arr.length < 3) handleError(0, arr._line, arr._filename)
    if (arr.length > 3) {
        indent += indentSize
    }
    handleSubExpressions(arr)
    var ret = "var "
    for (var i = 1; i < arr.length; i = i + 2) {
        if (i > 1) {
            ret += ",\n" + " ".repeat(indent)
        }
        if (!validName.test(arr[i])) handleError(9, arr._line, arr._filename)
        ret += arr[i] + ' = ' + arr[i + 1]
    }
    if (arr.length > 3) {
        indent -= indentSize
    }
    return ret
}

keywords["new"] = function(arr) {
    if (arr.length < 2) handleError(0, arr._line, arr._filename)
    return "new " + handleExpression(arr.slice(1))
}

keywords["throw"] = function(arr) {
    if (arr.length != 2)  handleError(0, arr._line, arr._filename)
    return "(function(){throw " + (Array.isArray(arr[1]) ? handleExpression(arr[1]) : arr[1]) + ";})()"
}

keywords["set"] = function(arr) {
    if (arr.length < 3 || arr.length > 4) handleError(0, arr._line, arr._filename)
    if (arr.length == 4) {
        arr[1] = (Array.isArray(arr[2]) ? handleExpression(arr[2]) : arr[2]) + "[" + arr[1] + "]"
        arr[2] = arr[3]
    }
    return arr[1] + " = " + (Array.isArray(arr[2]) ? handleExpression(arr[2]) : arr[2])
}

keywords["function"] = function(arr) {
    if (arr.length < 2) handleError(0, arr._line, arr._filename)
    if (!Array.isArray(arr[1])) handleError(0, arr._line)
    return "function(" + arr[1].join(",") + ") {\n" +
           handleExpressions(arr.slice(2)) + " ".repeat(indent) + "}"
}

keywords["try"] = function(arr) {
    if (arr.length < 3) handleError(0, arr._line, arr._filename)
    var c = arr.pop(),
        ind = " ".repeat(indent)
    return "(function() {\n" + ind + 
           "try {\n" + handleExpressions(arr.slice(1)) + "\n" +
           ind + "} catch (e) {\n" +
           ind + "return (" + (Array.isArray(c) ? handleExpression(c) : c) + ")(e);\n" +
           ind + "}\n" + ind + "})()"
}

keywords["if"] = function(arr) {
    if (arr.length < 3 || arr.length > 4)  handleError(0, arr._line, arr._filename)
    indent += indentSize
    handleSubExpressions(arr)
    var ret = "(" + arr[1] + " ?\n" +
        " ".repeat(indent) + arr[2] + " :\n" +
        " ".repeat(indent) + (arr[3] || "undefined") +")"
    indent -= indentSize
    return ret
}

keywords["get"] = function(arr) {
    if (arr.length != 3) handleError(0, arr._line, arr._filename)
    handleSubExpressions(arr)
    return arr[2] + "[" + arr[1] + "]"
}

keywords["str"] = function(arr) {
    if (arr.length < 2) handleError(0, arr._line, arr._filename)
    handleSubExpressions(arr)
    return "[" + arr.slice(1).join(",") + "].join('')"
}

keywords["array"] = function(arr) {
    if (arr.length == 1) {
        return "[]"
    }
    indent += indentSize
    handleSubExpressions(arr)
    var ret = "[\n" + " ".repeat(indent)
    for (var i = 1; i < arr.length; ++i) {
        if (i > 1) {
            ret += ",\n" + " ".repeat(indent)
        }
        ret += arr[i]
    }
    indent -= indentSize
    return ret + "\n" + " ".repeat(indent) + "]"
}

keywords["object"] = function(arr) {
    if (arr.length == 1) {
        return "{}"
    }
    indent += indentSize
    handleSubExpressions(arr)
    var ret = "{\n" + " ".repeat(indent)
    for (var i = 1; i < arr.length; i = i + 2) {
        if (i > 1) {
            ret += ",\n" + " ".repeat(indent)
        }
        ret += arr[i] + ': ' + arr[i + 1]
    }
    indent -= indentSize
    return ret + "\n" + " ".repeat(indent) + "}"
}

var includeFile = (function () {
    var included = []
    return function(filename) {
        if (included.indexOf(filename) !== -1) return ""
        included.push(filename)
        var code = fs.readFileSync(filename)
        var tree = parse(code, filename)
        return handleExpressions(tree)
    }
})()

keywords["include"] = function(arr) {
    if (arr.length != 2)  handleError(0, arr._line, arr._filename)
    indent -= indentSize
    var filename = arr[1]
    if (typeof filename === "string")
        filename = filename.replace(/["']/g, "")
    try {
        filename = fs.realpathSync(filename)
    } catch (err) {
        try {
            filename = fs.realpathSync(__dirname + "/../includes/" + filename)
        } catch (err) {
            handleError(11, arr._line, arr._filename)
        }
    }
    var ret = includeFile(filename)
    indent += indentSize
    return ret
}

keywords["javascript"] = function(arr) {
    if (arr.length != 2)  handleError(0, arr._line, arr._filename)
    noSemiColon = true
    return arr[1].replace(/"/g, '')
}

keywords["macro"] = function(arr) {
    if (arr.length != 4)  handleError(0, arr._line, arr._filename)
    macros[arr[1]] = {template: arr[2], code: arr[3]}
    return ""
}



keywords["+"] = handleOperator

keywords["-"] = handleOperator

keywords["*"] = handleOperator

keywords["/"] = handleOperator

keywords["%"] = handleOperator

keywords["="] = handleOperator

keywords["!="] = handleOperator

keywords[">"] = handleOperator

keywords[">="] = handleOperator

keywords["<"] = handleOperator

keywords["<="] = handleOperator

keywords["||"] = handleOperator

keywords["&&"] = handleOperator

keywords["!"] = function(arr) {
    if (arr.length != 2)  handleError(0, arr._line, arr._filename)
    handleSubExpressions(arr)
    return "(!" + arr[1] + ")"
}

var handleError = function(no, line, filename, extra) {
    throw new Error(errors[no] + 
           ((extra) ? " - " + extra : "") + 
           ((line) ? "\nLine no " + line : "") + 
           ((filename) ? "\nFile " + filename : ""))
}

errors[0] = "Syntax Error"
errors[1] = "Empty statement"
errors[2] = "Invalid characters in function name"
errors[3] = "End of File encountered, unterminated string"
errors[4] = "Closing square bracket, without an opening square bracket"
errors[5] = "End of File encountered, unterminated array"
errors[6] = "Closing curly brace, without an opening curly brace"
errors[7] = "End of File encountered, unterminated javascript object '}'"
errors[8] = "End of File encountered, unterminated parenthesis"
errors[9] = "Invalid character in var name"
errors[10] = "Extra chars at end of file. Maybe an extra ')'."
errors[11] = "Cannot Open include File"
errors[12] = "Invalid no of arguments to "
errors[13] = "Invalid Argument type to "
errors[14] = "End of File encountered, unterminated regular expression"

var compile = function(code, filename) {
  var tree = parse(code, filename)
  return banner + handleExpressions(tree)
}

exports.version = version

exports._compile = compile


})("/../../../node_modules/lispyscript/lib")
},{"fs":1}]},{},[3])
;