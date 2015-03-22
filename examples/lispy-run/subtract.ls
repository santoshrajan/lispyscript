
(set module.exports (function (x y)
  (- x y)))

(console.log 'in subtract');

;; test that includes work as they should
(include "html.ls")

(template page (title)
  (html {lang:"en"}
    (head
      (title title)
    (body
      (h1 "HTML Templates")))))

(console.log
  (page
    "My Home Page"))
