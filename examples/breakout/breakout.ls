;; The breakout game written in LispyScript
;; Open the html file in the same folder to try it.
;; Requires canvas support in browser
;; Based on javascript version here http://www.jsdares.com/
;;

(include "browser.ls")

(var canvas null)
(var context null)
(var bricksNumX 7)
(var bricksNumY 5)
(var brickWidth null)
(var brickHeight 20)
(var brickMargin 4)
(var paddleWidth 80)
(var paddleHeight 12)
(var paddleX 0)
(var ballX 0)
(var ballY 0)
(var ballVx 0)
(var ballVy 0)

(var bricks (arrayInit2d 5 7 null))

(var init
  (function ()
    (set paddleX (/ canvas.width 2))
    (set ballX 40)
    (set ballY 150)
    (set ballVx 7)
    (set ballVy 12)
    (each2d bricks
      (function (val i j arr)
        (set i arr true)))))

(var clear
  (function ()
    (context.clearRect 0 0 canvas.width canvas.height)))

(var circle
  (function (x y)
    (context.beginPath)
    (context.arc x y 10 0 (* 2 Math.PI))
    (context.fill)))

(var drawPaddle
  (function ()
    (var x (- paddleX (/ paddleWidth 2)))
    (var y (- canvas.height paddleHeight))
    (context.fillRect x y paddleWidth paddleHeight)))

(var drawBricks
  (function ()
    (each2d bricks
      (function (val x y arr)
        (if val
          (do
            (var xpos (+ (* x brickWidth) (/ brickMargin 2)))
            (var ypos (+ (* y brickHeight) (/ brickMargin 2)))
            (var width (- brickWidth brickMargin))
            (var height (- brickHeight brickMargin))
            (context.fillRect xpos ypos width height)))))))

(var hitHorizontal
  (function ()
    (if (|| (< ballX 0) (> ballX canvas.width))
      (set ballVx -ballVx))))

(var hitVertical
  (function ()
    (cond
      (< ballY 0) (do (set ballVy -ballVy) true)
      (< ballY (* brickHeight bricksNumY))
        (do
          (var bx (Math.floor (/ ballX brickWidth)))
          (var by (Math.floor (/ ballY brickHeight)))
          (if (&& (>= bx 0) (< bx bricksNumX))
            (if (get bx (get by bricks))
              (do
                (set bx (get by bricks) false)
                (set ballVy -ballVy))))
          true)
      (>= ballY (- canvas.height paddleHeight))
        (do
          (var paddleLeft (- paddleX (/ paddleWidth 2)))
          (var paddleRight (+ paddleX (/ paddleWidth 2)))
          (if (&& (>= ballX paddleLeft) (<= ballX paddleRight))
            (do (set ballVy -ballVy) true)
            (do (init) false)))
      true true)))

(var tick
  (function ()
    (clear)
    (drawPaddle)
    (set ballX (+ ballX ballVx))
    (set ballY (+ ballY ballVy))  
    (hitHorizontal)
    (if (hitVertical)
      (do
        (circle ballX ballY)
        (drawBricks))
      (clear))))

(set window.onload (function (event)
  (set canvas ($ "breakout"))
  (set context (canvas.getContext "2d"))
  (set brickWidth (/ canvas.width bricksNumX))
  ($listener canvas "mousemove" (set paddleX (|| event.offsetX (- event.pageX canvas.offsetLeft))))
  (init)
  (window.setInterval tick 30)))
