;; LispyScript example using nodejs, expressjs and twitter bootstrap
;; LispyScript templates are written in LispyScript!
;; Html5 templates support all html5 tags

;; The express server

(var express (require "express"))
(var app (express))
(app.listen 3000)
(app.use (express.static (+ __dirname "/public")))

;; Include html5 template support

(include "html.ls") 

;; Base Page template common to all pages
;; To which we pass arguments title, navBarLinks, bodyContent
;; when we call the template

(template basePage (pageTitle navBarLinks bodyContent)
  (html {lang:"en"}
    (head
      (title pageTitle)
      (link {href:'bootstrap/css/bootstrap.css', rel:'stylesheet'})
      (style {type:'text/css'}
        "body {
           padding-top: 60px;
        }")
      (link {href:'bootstrap/css/bootstrap-responsive.css', rel:'stylesheet'})
      (!-- 'Le HTML5 shim, for IE6-8 support of HTML5 elements')
      "<!--[if lt IE 9]>
         <script src='http://html5shim.googlecode.com/svn/trunk/html5.js'></script>
       <![endif]-->")
    (body
      (div {class:"navbar navbar-fixed-top"}
        (div {class:"navbar-inner"}
          (div {class:"container"}
            (a {class:"btn btn-navbar",
                "data-toggle":"collapse",
                "data-target":".nav-collapse"}
              "<span class='icon-bar'></span>"
              "<span class='icon-bar'></span>"
              "<span class='icon-bar'></span>")
            (a {class:"brand", href:"#"} "LispyScript!")
            (div {class:"nav-collapse"}
              navBarLinks))))           ;;navBarLinks added here
      bodyContent                       ;;bodyContent added here
      (script {src:"//ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js",type:"text/javascript"})
      (script {type:"text/javascript",src:"bootstrap/js/bootstrap.js"}))))

;; the navBarLinks template

(template navBarLinks ()
  (ul {class:'nav'}
    (li {class:'active'} (a {href:'#'} "Home"))
    (li (a {href:'/tryit'} "Try It"))
    (li (a {href:'/docs'} "Docs"))))
    
;; the bodyContent template

(template bodyContent ()
  (div {class:'container'}
    (div {class:'page-header'}
      (h1 "LispyScript")
      (p "A javascript With Lispy Syntax And Macros!"))
    (div {class:'row'}
      (div {class:'span6'}
        (h2 "Overview")
        (p "An inherent problem with Javascript is that it has no macro support, like other Lisp like languages. That's because macros manipulate the syntax tree while compiling. And this is next to impossible in a language like Javascript."))
      (div {class:'span6'}
        (h2 "Installing")
        (h4 "Install Using npm")
        (pre "$ npm install -g lispyscript")))))

;; Send It!

(app.get "/"
  (function (req res)
    (res.send (basePage "LispyScript" (navBarLinks) (bodyContent)))))
