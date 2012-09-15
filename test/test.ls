

;; A template def for template test
(template testTemplate (one two three)
  "1" one "2" two "3" three)

;; Def testgroup name - lispyscript
;; tests lispyscript expressions

(testGroup lispyscript

(assert (true? true) "(true? true)")
(assert (false? false) "(false? false)")
(assert (false? (true? {})) "(false? (true? {}))")
(assert (! false) "(! false)")
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
(assert (object? []) "(object? [])")
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
  (= 10
    (loop (i) (1)
      (if (= i 10)
        i
        (recur ++i)))) "loop recur test")
(assert
  (= 10
    (do
      (var ret 0)
      (each [1, 2, 3, 4]
        (function (val i obj)
          (set ret (+ ret val))))
      ret)) "each test")
(assert
  (= 10
    (do
      (var ret 0)
      (eachKey {a:1,b:2,c:3,d:4}
        (function (val key obj)
          (set ret (+ ret val))))
      ret)) "eachKey test")
(assert 
  (= 10
    (reduce [1,2,3,4]
      (function (accum val i list)
        (+ accum val)) 0)) "reduce test")
(assert 
  (= 20
    (reduce (map [1,2,3,4] (function (val i list) (* val 2)))
      (function (accum val i list)
        (+ accum val)) 0)) "map test")
(assert (= "112233" (testTemplate 1 2 3)) "template test")

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

