;; List of built in macros for LispyScript. This file is included by
;; default by the LispyScript compiler.

(macro object? (obj)
  (= (typeof ~obj) "object"))

(macro array? (obj)
  (= (toString.call ~obj) "[object Array]"))

(macro string? (obj)
  (= (toString.call ~obj) "[object String]"))

(macro number? (obj)
  (= (toString.call ~obj) "[object Number]"))

(macro boolean? (obj)
  (= (typeof ~obj) "boolean"))

(macro function? (obj)
  (= (toString.call ~obj) "[object Function]"))

(macro undefined? (obj)
  (= (typeof ~obj) "undefined"))

(macro null? (obj)
  (= ~obj null))

(macro do (rest...)
  ((function () ~rest...)))

(macro when (cond rest...)
  (if ~cond (do ~rest...)))

(macro unless (cond rest...)
  (when (! ~cond) (do ~rest...)))

(macro each (rest...)
  (Array.prototype.forEach.call ~rest...))
  
(macro eachKey (obj callback rest...)
  ((function (obj callback context)
    (each (Object.keys obj)
      (function (elem)
        (callback.call context (get elem obj) elem obj))))
   ~obj ~callback ~rest...))

(macro map (rest...)
  (Array.prototype.map.call ~rest...))

(macro filter (rest...)
  (Array.prototype.filter.call ~rest...))

(macro some (rest...)
  (Array.prototype.some.call ~rest...))

(macro every (rest...)
  (Array.prototype.every.call ~rest...))

(macro reduce (rest...)
  (Array.prototype.reduce.call ~rest...))

(macro template (name args rest...)
  (var ~name
    (function ~args
      (str ~rest...))))

(macro template-repeat (arg rest...)
  (reduce ~arg
    (function (memo elem index)
      (+ memo (str ~rest...))) ""))

(macro template-repeat-key (obj rest...)
  (do
    (var ret "")
    (eachKey ~obj
      (function (value key)
        (set ret (+ ret (str ~rest...)))))
    ret))

    