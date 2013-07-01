;(function(e,t,n){function i(n,s){if(!t[n]){if(!e[n]){var o=typeof require=="function"&&require;if(!s&&o)return o(n,!0);if(r)return r(n,!0);throw new Error("Cannot find module '"+n+"'")}var u=t[n]={exports:{}};e[n][0].call(u.exports,function(t){var r=e[n][1][t];return i(r?r:t)},u,u.exports)}return t[n].exports}var r=typeof require=="function"&&require;for(var s=0;s<n.length;s++)i(n[s]);return i})({1:[function(require,module,exports){
// tinix.js
//
// Copyright 2013 - Santosh Rajan - santoshrajan.com
//


Element.prototype.on = Element.prototype.addEventListener

var tinix = function(id) {
    return document.querySelector(id)
}

tinix.version = "0.0.3"

tinix.all = function(id) {
    return document.querySelectorAll(id)
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

tinix.getR = function(s, f) {
    var r = new XMLHttpRequest()
    r.onload = function() {
        if (r.status == 200) {
            if (r.getResponseHeader("Content-Type") == "application/json") {
                s(JSON.parse(r.responseText))
            } else {
                s(r.responseText)
            }
        } else {
            f(r)
        }
    }
    return r
}

// get(url, success, failure [,overrideMimeType])
tinix.get = function(u, s, f, o) {
    var r = this.getR(s, f)
    r.open("GET", u)
    if (o) {
      r.overrideMimeType(o)
    }
    r.send()
}

// post(url, body, contenttype, success, failure)
tinix.post = function(u, b, c, s, f) {
    var r = this.getR(s, f)
    r.open("POST", u)
    r.setRequestHeader("Content-Type", c)
    r.send(b)
}

// postJSON(url, body, success, failure)
tinix.postJSON = function(u, b, s, f) {
    this.post(u, JSON.stringify(b), "application/json", s, f)
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


},{}],2:[function(require,module,exports){
/*
    dopromise
    Promise Library for JavaScript
    Copyright (c) 2013 Santosh Rajan
    License - MIT - https://github.com/santoshrajan/dopromise/blob/master/LICENSE
*/

(function(exports){

    var serial = function() {
        var args = arguments, scope = {}
        function iterator(i) {
            var func = args[i]
            if (args.length === i + 1) {
                func.call(scope)
            } else {
                func.call(scope, function() {
                    iterator(i + 1)
                })
            }
        }
        iterator(0);
    }

    var parallel = function() {
        var args = Array.prototype.slice.call(arguments),
            last = args.pop()
            counter = args.length
            scope = {}
            done = function() {
                --counter
                if (counter === 0) {
                    last.call(scope)
                }
            }

        args.forEach(function(f) {
            f.call(scope, done)
        })
    }

    var loop = function(f) {
        var scope = {}
        function iterator() {
            f.call(scope, iterator)
        }
        iterator()
    }

    exports.version = "0.0.4"
    exports.doPromise = serial  // for backward compatability
    exports.serial = serial
    exports.parallel = parallel
    exports.loop = loop

})(typeof exports === 'undefined'? this.dopromise={}: exports);

},{}],3:[function(require,module,exports){
var $  = require("tinix"),
    ls = require("lispyscript"),
    promise = require("dopromise"),
    cache = {}

function createHandler(script) {
    return function(done) {
        if (!script.src) {
            done()
        } else {
            $.get(
                script.src,
                function(ls) {
                    script.ls = ls
                    done()
                },
                function(request) {
                    throw new Error("Failed to load file " + script.src)
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

$.ready(function() {
    var scripts = Array.prototype.map.call($.all("script[type='text/lispyscript']"), function(script) {
        return {id: script.id, src: script.src, ls: script.src ? null : script.innerHTML}
    })
    var handlers = scripts.map(function(script) {
        return createHandler(script)
    })
    handlers.push(function() {
        scripts.forEach(function(script) {
            script.js = ls._compile(script.ls, script.src)
            cache[script.id] = runModule(script.js)
        })
    })
    promise.parallel.apply(null, handlers)
})

},{"tinix":1,"dopromise":2,"lispyscript":4}],4:[function(require,module,exports){
(function(__dirname){/*
 *
LispyScript - Javascript using tree syntax!
This is the compiler written in javascipt
 *
*/

var version = "0.3.5",
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
},{"fs":5}],5:[function(require,module,exports){
// nothing to see here... no file methods for the browser

},{}]},{},[3])
;