;; A template def for template test
(template testTemplate (one two three)
  "1" one "2" two "3" three)

;; Def testgroup name - lispyscript
;; tests lispyscript expressions

(testGroup lispyscript

(assert (true? true) "(true? true)")
(assert (false? false) "(false? false)")
(assert (false? (true? {})) "(false? (true? {}))")
(assert (undefined? undefined) "(undefined? undefined)")
(assert (false? (undefined? null)) "(false? (undefined? null))")
(assert (null? null) "(null? null)")
(assert (false? (null? undefined)) "(false? (null? undefined))")
(assert (zero? 0) "(zero? 0)")
(assert (false? (zero? '')) "(false? (zero? ''))")
(assert (boolean? true) "(boolean? true)")
(assert (false? (boolean? 0)) "(false? (boolean? 0))")
(assert (number? 1) "(number? 1)")
(assert (false? (number? '')) "(false? (number? ''))")
(assert (string? '') "(string? '')")
(assert (array? []) "(array? []])")
(assert (false? (array? {})) "(false? (array? {}))")
(assert (object? {}) "(object? {})")
(assert (false? (object? [])) "(object? [])")
(assert (false? (object? null)) "(false? (object? null))")
(assert
  (= 10
    (when true
      (var ret 10)
      ret)) "when test")
(assert
  (= 10
    (unless false
      (var ret 10)
      ret)) "unless test")
(assert
  (= -10 
    (do
      (var i -1)
      (cond
        (< i 0) -10
        (zero? i) 0
        (> i 0) 10))) "condition test less than")
(assert
  (= 10 
    (do
      (var i 1)
      (cond
        (< i 0) -10
        (zero? i) 0
        (> i 0) 10))) "condition test greater than")
(assert
  (= 0 
    (do
      (var i 0)
      (cond
        (< i 0) -10
        (zero? i) 0
        (> i 0) 10))) "condition test equal to")
(assert
  (= 10 
    (do
      (var i Infinity)
      (cond
        (< i 0) -10
        (zero? i) 0
        true 10))) "condition test default")
(assert
  (= 10
    (loop (i) (1)
      (if (= i 10)
        i
        (recur ++i)))) "loop recur test")
(assert
  (= 10
    (do
      (var ret 0)
      (each (array 1 2 3 4)
        (function (val)
          (set ret (+ ret val))))
      ret)) "each test")
(assert
  (= 10
    (do
      (var ret 0)
      (eachKey {a: 1, b: 2, c: 3, d: 4}
        (function (val)
          (set ret (+ ret val))))
      ret)) "eachKey test")
(assert 
  (= 10
    (reduce [1, 2, 3, 4]
      (function (accum val)
        (+ accum val)) 0)) "reduce test with init")
(assert 
  (= 10
    (reduce [1, 2, 3, 4]
      (function (accum val)
        (+ accum val)))) "reduce test without init")
(assert 
  (= 20
    (reduce (map [1, 2, 3, 4] (function (val) (* val 2)))
      (function (accum val)
        (+ accum val)) 0)) "map test")
(assert (= "112233" (testTemplate 1 2 3)) "template test")
(assert (= "112233" (template-repeat-key {"1":1,"2":2,"3":3} key value)) "template repeat key test")
(assert
  (= 10 
    (try (var i 10) i (function (err)))) "try catch test - try block")
(assert
  (= 10 
    (try (throw 10) (function (err) err))) "try catch test - catch block")
(assert
  (= 3
    (doMonad identityMonad (a 1 b (* a 2)) (+ a b))) "Identity Monad Test")
(assert
  (= 3
    (doMonad maybeMonad (a 1 b (* a 2)) (+ a b))) "maybe Monad Test")
(assert
  (= null
    (doMonad maybeMonad (a null b (* a 2)) (+ a b))) "maybe Monad null Test")
(assert
  (= 54
    (reduce
      (doMonad arrayMonad (a [1,2,3] b [3,4,5]) (+ a b))
      (function (accum val) (+ accum val))
      0)) "arrayMonad test")
(assert
  (= 32
    (reduce
      (doMonad arrayMonad (a [1,2,3] b [3,4,5]) (when (<= (+ a b) 6) (+ a b)))
      (function (accum val) (+ accum val))
      0)) "arrayMonad when test")
(assert
  (= 6
    (reduce
      (doMonad arrayMonad (a [1,2,0,null,3]) (when a a))
      (function (accum val) (+ accum val))
      0)) "arrayMonad when null values test")

)

;; Function for running on browser. This function is for
;; the test.html file in the same folder.
(var browserTest
  (function ()
    (var el (document.getElementById "testresult"))
    (if el.outerHTML
      (set el.outerHTML (str "<pre>" (testRunner lispyscript "LispyScript Testing") "</pre>"))
      (set el.innerHTML (testRunner lispyscript "LispyScript Testing")))))

;; If not running on browser
;; call test runner with test group lispysript
;; otherwise call browserTest
(if (undefined? window)
  (console.log (testRunner lispyscript "LispyScript Testing"))
  (set window.onload browserTest))


