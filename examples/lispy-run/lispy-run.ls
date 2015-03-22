;; test with and without the "./"
;;(var k (require "square.ls"))
;;(var k (require "./square.ls"))

;; or test .ls files requiring .js files:
;;(var k (require "square.js"))
;;(var k (require "./square.js"))

;; or test omitting .ls extensions:
(var k (require "square"))
;;(var k (require "./square"))

(console.log (k 10))
