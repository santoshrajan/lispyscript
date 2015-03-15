var $  = require("tinix")
var ls = require("lispyscript")
var fs = require("fs")
var br = require("./browser-repl")

var cache = {}

var macros = fs.readFileSync("./src/macros.ls")
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

// we have our own require which caches modules
// conveyed in the body of text/lispyscript tags

var lsrequire = function(name) {
    if (cache[name]) {
        return cache[name]
    } else {
        if (require) {
            return require(name)
        } else if (window.require) {
            return window.require(name)

        } else {
            throw new Error("Cannot find module " + name)
        }
    }
}

// we expose our require so people can do requires
// in the browser repl:
// note:  it's a bad idea to wrap the standard window.require
//        I tried - an infinite require loop was the result!
if (typeof window !== 'undefined') {
  window.lsrequire = lsrequire;
}

function runModule(js) {
    var module = {exports: {}},
        func = new Function("module, exports, require", js)

    func(module, module.exports, lsrequire)
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
            // <script> tags with an id attribute act as commonJS modules:
            // (modules do not pollute the global scope - using code and 
            // the browser repl must use "require" to get at their exports)
            if (script.id) {
              cache[script.id] = runModule(script.js)
            }
            else {
              // otherwise they run as plain javascript
              // (top level vars are visible to other code and the browser repl) 
              script.js = script.js.replace(/require\s*\(/g, 'lsrequire(');
              eval.call(window, script.js)
            }
        })
    })
})
