;; A Twitter like web app
;; Requires express js.

;; The express server
(var express (require "express"))
(var app (express))
(app.listen 3000)

;; Templates we will be using
;; Base template common to all pages.
;; Note that strings in lispyscript are multiline.

(template base (title header body)
"<!DOCTYPE html>
<html>
<head>
  <title>" title "</title>
</head>
<body>
  <h1>" header "</h1>"
  body
"</body>
</html>")

;; index page template. (the body part)

(template index ()
"<h2>Enter Tweet</h2>
<form action='/send' method='POST'>
  <input type='text' length='140' name='tweet'/>
  <input type='submit' value='Tweet'/>
</form>
<h2>All Tweets</h2>"
(template-repeat tweets "<div>" elem "</div>"))


(var tweets [])

(app.get "/"
  (function (req res)
    (res.send (base "Our Own Twitter" "Our Own Twitter" (index)))))
    
(app.post "/send" (express.bodyParser)
  (function (req res)
    (if (&& req.body req.body.tweet)
      (do
        (tweets.push req.body.tweet)
        (res.redirect "/"))
      (res.send {status: "nok", message: "No tweet Received"}))))

(app.get "/tweets"
  (function (req res)
    (res.send tweets)))

