
;; tried with and without the "./"
(var sub (require "subtract.ls"))
;;(var sub (require "./subtract.ls"))

;; also tried .ls files requiring .js files:
;;(var sub (require "subtract.js"))
;;(var sub (require "./subtract.js"))

(set module.exports (function (x)
  (sub (* x x) 13)))

(console.log 'in square')
