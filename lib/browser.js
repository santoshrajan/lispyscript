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
                "test/plain"
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
                return window.require(name)
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
