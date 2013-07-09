var $  = require("tinix"),
    ls = require("lispyscript"),
    fs = require("fs"),
    cache = {}

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
