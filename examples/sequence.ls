;; http://lispyscript.com
;; LispyScript sequenced callback example
;; No need for nested callbacks. Just write your callbacks in a sequence and pass "(next)" as 
;; your callback, which will set the next function in the sequence as your callback.
;;
;; This example is a simple node server that will serve static plain text file to the browser.
;; 

(var fs (require "fs"))
(var http (require "http"))

(sequence requestHandler (request response)

  ( (var filename null)
    (if (= request.url "/")
      (set filename "index.html")
      (set filename (request.url.substr 1)))
    (response.setHeader "Content-Type" "text/html"))

  (function ()
    (fs.exists filename (next)))

  (function (exists)
    (if exists
      (fs.readFile filename "utf8" (next))
      (response.end "File Not Found")))

  (function (err data)
    (if err
      (response.end "Internal Server Error")
      (response.end data))))

(var server (http.createServer requestHandler))
(server.listen 3000 "127.0.0.1")
(console.log "Server running at http://127.0.0.1:3000/")


;; A sequence expression creates a function. The arguments are
;; 1. The name for the function
;; 2. The parameters definition for the function
;; 3. A block of expressions to initialize the function.
;; 4. The rest are a sequence of functions to be called in order.
;; The sequence functions are defined in the scope of the sequence.
;; All parameters and initialised variables are visible to all the sequence functions.
;; Also visible to all the sequence functions is a function called next.
;; next returns the next function in the sequence.

;; In the example above we create a sequence function called requestHandler and
;; set it as the request callback for the node server.
;; In the initialization block we create a var called filename and set it to the
;; requested file. We also set the response content type.
;; There are three sequence functions and the first one ia called automatically when the
;; request handler function is called. It in turn calls fs.exists with the filename and
;; and sets the callback to "(next)". Which in this case is the second function in
;; the sequence.
;; The second function is the callback for the first, and it in turn calls fs.readFile
;; and passes the thirst function (next) as the callback. Since the third function
;; (callback for the second) does not call (next) the sequence ends there.

