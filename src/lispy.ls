(require "./require")
(var fs (require "fs")
     ls (require "./ls")
     repl (require "./repl")
     isValidFlag /-h\b|-r\b|-v\b|-b\b|-s\b/
     error
       (function (err)
         (console.error err.message)
         (process.exit 1)))

(var opt (->
  (require 'node-getopt')
  (.create [['h', 'help', 'display this help'],
    ['v', 'version', 'show version'],
    ['r', 'run', 'compile and run'],
    ['b', 'browser-bundle', 'create browser-bundle.js in the same directory'],
    ['m', 'map', 'generate source map files'],
    ['i', 'include-dir=ARG+', 'add directory to include search path']])
  (.setHelp (+ "lispy [OPTION] [<infile>] [<outfile>]\n\n"
               "<outfile> will default to <infile> with '.js' extension\n\n"
              "Also compile stdin to stdout\n"
              "eg. $ echo '(console.log \"hello\")' | lispy\n\n"
              "[[OPTIONS]]\n\n"))
  (.bindHelp)
  (.parseSystem)
))

;; We use maybe monad to carry out each step, so that we can
;; halt the operation anytime in between if needed.

(doMonad maybeMonad

  ;; Start maybe Monad bindings

  ;; when no args do stdin -> stdout compile or run repl and return null to
  ;; halt operations.
  (noargs
    (when (&&
              (= opt.argv.length 0)
              (= (.length (Object.keys opt.options)) 0))
      (var input process.stdin)
      (var output process.stdout)
      (input.resume)
      (input.setEncoding "utf8")
      (var source "")
      ;; Accumulate text form input until it ends.
      (input.on "data"
        (function (chunck)
          (set source (+ source (chunck.toString)))))
      ;; Once input ends try to compile & write to output.
      (input.on "end"
        (function ()
          (try
            (output.write (ls._compile source process.cwd))
            error)))
      (input.on "error" error)
      (output.on "error" error)
      (setTimeout
        (function ()
          (if (= input.bytesRead 0)
            (do
              (input.removeAllListeners "data")
              (repl.runrepl)))) 20)
      null)

  run
    (cond 
      (true? opt.options['version']) (do (console.log (+ "Version " ls.version)) null)
      (true? opt.options['browser-bundle'])
          (do
            (var bundle
              (require.resolve "lispyscript/lib/browser-bundle.js"))
              ((.pipe (fs.createReadStream bundle))
              (fs.createWriteStream "browser-bundle.js"))
                      null)
      (true? opt.options['run']) true)
  

  ;; if infile undefined
  infile
    (if opt.argv[0]
      opt.argv[0]
      (error (new Error "Error: No Input file given")))

  ;; set outfile args.shift. ! outfile set outfile to infile(.js) 
  outfile 
    (do
      (var outfile opt.argv[1])
      (unless outfile
        (set outfile (infile.replace /\.ls$/ ".js"))
        (if (= outfile infile)
          (error (new Error "Error: Input file must have extension '.ls'"))))
      outfile)

  ;; compile infile to outfile. if not run return null.
  js
    (try
      (fs.writeFileSync outfile
        (ls._compile (fs.readFileSync infile "utf8")
          infile (true? opt.options['map']) opt.options['include-dir'])
      "utf8")
      (if run run null)
      (function (err)
        (error err)
        null)))                     ;; end of maybe Monad bindings

  ;; we are here if -r true, so run it!
  (->
    (require "child_process")
    (.spawn "node" [outfile] {stdio: "inherit"})))
