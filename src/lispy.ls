(require "./require")
(var fs (require "fs")
     ls (require "./ls")
     repl (require "./repl")
     isValidFlag /-h\b|-r\b|-v\b|-b\b/
     error
       (function (err)
         (console.error err.message)
         (process.exit 1)))

(var help_str "
Usage: lispy [-h] [-r] [-v] [-b] [<infile>] [<outfile>]

       Also compile stdin to stdout
       eg. $ echo '(console.log \"hello\")' | lispy

       <no arguments>    Run REPL
       -h                Show this help
       -r                Compile and run
       -v                Show Version
       -b                Create browser-bundle.js in same folder.
       <infile>          Input file to compile
       <outfile>         Output JS file. If not given
                         <outfile> will be <infile> with .js extension\n")

;; We use maybe monad to carry out each step, so that we can
;; halt the operation anytime in between if needed.

(doMonad maybeMonad

  ;; Start maybe Monad bindings
  ;; First step get args without the first two (node and lispy).
  (args (process.argv.slice 2)

  ;; get the first arg
  arg1 (args.shift)

  ;; when no args do stdin -> stdout compile or run repl and return null to
  ;; halt operations.
  noargs
    (when (undefined? arg1)
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

  ;; If arg1 = flag verify valid flag and halt if not otherwise
  ;; set arg1 to next arg in args
  flag
    (when (= "-" (get 0 arg1))
      (var flag arg1)
      (set arg1 (args.shift))
      (if (isValidFlag.test flag)
        flag
        (error (new Error (+ "Error: Invalid flag " flag)))))

  run
    (cond 
      (= "-h" flag) (do (console.log help_str) null)
      (= "-v" flag) (do (console.log (+ "Version " ls.version)) null)
      (= "-b" flag) (do
                      (var bundle
                        (require.resolve "lispyscript/lib/browser-bundle.js"))
                      ((.pipe (fs.createReadStream bundle))
                        (fs.createWriteStream "browser-bundle.js"))
                      null)
      (= "-r" flag) true)
  

  ;; if infile undefined
  infile
    (if arg1
      arg1 
      (error (new Error "Error: No Input file given")))

  ;; set outfile args.shift. ! outfile set outfile to infile(.js) 
  outfile 
    (do
      (var outfile (args.shift))
      (unless outfile
        (set outfile (infile.replace /\.ls$/ ".js"))
        (if (= outfile infile)
          (error (new Error "Error: Input file must have extension '.ls'"))))
      outfile)

  ;; compile infile to outfile. if not run return null.
  js
    (try
      (fs.writeFileSync outfile
        (ls._compile 
          (fs.readFileSync infile "utf8")
        infile)
      "utf8")
      (if run run null)
      (function (err)
        (error err)
        null)))                     ;; end of maybe Monad bindings

  ;; we are here if -r true, so run it!
  (->
    (require "child_process")
    (.spawn "node" [outfile] {stdio: "inherit"})))
