;; List of built in macros for LispyScript. This file is included by
;; default by the LispyScript compiler.

;; ! arrays will also report true for this

(macro undefined? (obj)
  (= (typeof ~obj) "undefined"))

(macro null? (obj)
  (= ~obj null))

(macro zero? (obj)
  (= 0 ~obj))

(macro boolean? (obj)
  (= (typeof ~obj) "boolean"))

(macro number? (obj)
  (= (Object.prototype.toString.call ~obj) "[object Number]"))

(macro string? (obj)
  (= (Object.prototype.toString.call ~obj) "[object String]"))

(macro array? (obj)
  (= (Object.prototype.toString.call ~obj) "[object Array]"))

(macro object? (obj)
  ((function (obj)
    (= obj (Object obj))) ~obj))

(macro function? (obj)
  (= (Object.prototype.toString.call ~obj) "[object Function]"))

(macro arguments? (obj)
  ((function (obj)
    (if (= (Object.prototype.toString.call obj) "[object Arguments]")
      true
      (! (! (&& obj obj.callee))))) ~obj))

(macro do (rest...)
  ((function () ~rest...)))

(macro when (cond rest...)
  (if ~cond (do ~rest...)))

(macro unless (cond rest...)
  (when (! ~cond) (do ~rest...)))

(macro each (rest...)
  ((function (o f s)
    (javascript "if(o.forEach){o.forEach(f,s)}else{for(var i=0,l=o.length;i<l;++i)f.call(s||o,o[i],i,o)}")
    undefined) ~rest...))
 
(macro eachKey (rest...)
  ((function (o f s)
    (javascript "var k;if(Object.keys){k=Object.keys(o)}else{k=[];for(var i in o)k.push(i)}")
    (each k
      (function (elem)
        (f.call s (get elem o) elem o)))) ~rest...))

(macro reduce (rest...)
  ((function (arr f init)
    (if (< arguments.length 3)
      (set init (arr.shift)))
    (each arr
      (function (val i list)
        (set init (f init val i list))))
    init) ~rest...))

(macro map (rest...)
  ((function (arr f scope)
    (var result [])
    (each arr
      (function (val i list)
        (result.push (f.call scope val i list))))
    result) ~rest...))

(macro filter (rest...)
  (Array.prototype.filter.call ~rest...))

(macro some (rest...)
  (Array.prototype.some.call ~rest...))

(macro every (rest...)
  (Array.prototype.every.call ~rest...))

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

;; Tail call optimised loop recur construct
;; Takes a set of args, initial values, and body
;; eg. (loop (arg1 arg2 arg3) (init1 init2 init3)
;;       ....
;;       (recur val1 val2 val3))
;; The body MUST evaluate to a NON undefined value to break from the loop.
;; null, 0 and other falsy values are ok to break from the loop.
(macro loop (args vals rest...)
  ((function ()
    (var recur null)
    (var _result !undefined)
    (var _nextArgs null)
    (var _f (function ~args ~rest...))
    (set recur
      (function ()
        (set _nextArgs arguments)
        (if (= _result undefined)
          undefined
          (do
            (set _result undefined)
            (javascript "while(_result===undefined) _result=_f.apply(this,_nextArgs)")
            _result))))
    (recur ~@vals))))

(macro sequence (name args init rest...)
  (var ~name
    (function ~args
      ((function ()
        (var _curr 0)
        (var next
          (function ()
            (var ne (get _curr++ actions))
            (if ne
              ne
              (throw "Call to (next) beyond sequence."))))
        (var actions (new Array ~rest...))
        ~@init
        ((next)))))))

(macro assert (cond message)
  (if (= true ~cond)
    (str "Passed - " ~message "\n")
    (str "Failed - " ~message "\n")))

