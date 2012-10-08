;; The lispy command script

(require "./node")
(var fs (require "fs"))
(var path (require "path"))
(var ls (require "../lib/ls"))
(var repl (require "./repl"))

;; node js error msg for sync io only reports libuv errno, so we make
;; it a little more palatable.
(var fileErrorMsg "File Error - %s
This usually happens when an input file is not found
or when an output file cannot be written (permission denied).")

(var exit
  (function (error)
    (if error
      (do
        (if error.path  ;; file err will have error.path
          (console.error
            fileErrorMsg
            error.path)
          (console.error error))
        (process.exit 1))
      (process.exit 0))))

(var compileFiles
  (function (input output)
    (compile
      (fs.createReadStream input)
      (fs.createWriteStream output)
      (path.resolve input))))

(var compile
  (function (input output uri)
    (var source "")
    ;; Accumulate text form input until it ends.
    (input.on "data"
      (function (chunck)
        (set source (+ source (chunck.toString)))))
    ;; Once input ends try to compile & write to output.
    (input.on "end"
      (function ()
          (try
            (output.write (ls._compile source uri))
            exit)))
    (input.on "error" exit)
    (output.on "error" exit)))

(set exports.run
  (function ()
    (if (= process.argv.length 2)
      (do
        (process.stdin.resume)
        (process.stdin.setEncoding "utf8")
        (compile process.stdin process.stdout (process.cwd))
        (setTimeout
          (function ()
            (if (= process.stdin.bytesRead 0)
              (do
                (process.stdin.removeAllListeners "data")
                (repl.runrepl)))) 20))

      (if (= process.argv.length 3)
        (do
          (var i (get 2 process.argv))
          (var o (i.replace /\.ls$/ ".js"))
          (if (= i o)
            (console.log "Input file must have extension '.ls'")
            (compileFiles i o)))
        (compileFiles (get 2 process.argv) (get 3 process.argv))))))
