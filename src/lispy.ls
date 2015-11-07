(require "./require")
(var fs (require "fs")
     path (require "path")
     ls (require "./ls")
     repl (require "./repl")
     watch (require "watch")
     isValidFlag /-h\b|-r\b|-v\b|-b\b|-s\b/
     error
       (function (err)
         (console.error err.message)
         (process.exit 1)))

(var opt (->
  (require 'node-getopt')
  (.create [['h', 'help', 'display this help'],
    ['v', 'version', 'show version'],
    ['r', 'run', 'run .ls files directly'],
    ['w', 'watch', 'watch and compile changed files beneath current directory'],
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

  compile
    (cond 
      (true? opt.options['version']) (do (console.log (+ "Version " ls.version)) null)
      (true? opt.options['browser-bundle'])
          (do
            (var bundle
              (require.resolve "lispyscript/lib/browser-bundle.js"))
              ((.pipe (fs.createReadStream bundle))
              (fs.createWriteStream "browser-bundle.js"))
                      null)
      (true? opt.options['run']) 
          ;; run specified .ls file (directly with no explicit .js file)
          (do
            (var infile
              (if opt.argv[0]
                ;; we require .ls extension (our require extension depends on it!)
                (if (&& (= (opt.argv[0].indexOf '.ls') -1) (= (opt.argv[0].indexOf '.js') -1))
                  (error (new Error "Error: Input file must have extension '.ls' or '.js'"))
                  opt.argv[0])
                (error (new Error "Error: No Input file given"))))
            ;; by running the file via require we ensure that any other
            ;; requires within infile work (and process paths correctly)
            (require infile)
            null)
      (true? opt.options['watch'])
          (do
            (var cwd (process.cwd))
            (console.log 'Watching' cwd 'for .ls file changes...')
            (watch.watchTree cwd 
              (object 
                filter (function (f stat) (|| (stat.isDirectory) (!= (f.indexOf '.ls') -1)))
                ignoreDotFiles true
                ignoreDirectoryPattern /node_modules/ ) 
              (function (f curr prev) 
                (cond
                  (&& curr (!= curr.nlink 0))
                    (->
                      (require "child_process")
                      (.spawn "lispy" [f.substring(cwd.length+1)] {stdio: "inherit"}))
                  (&& (object? f) (null? prev) (null? curr))
                    (eachKey f 
                      (function (stat initialf) 
                        (unless (= initialf cwd)
                          (->
                            (require "child_process")
                            (.spawn "lispy" [initialf.substring(cwd.length+1)] {stdio: "inherit"}))))))))
                          
              null)
      true true) ;; no other options - go ahead and compile
  
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
      outfile))

  ;; compile infile to outfile.
  (try
    (console.log 'LispyScript v1.0.0:  compiling' infile 'to' outfile)
    (fs.writeFileSync outfile
      (ls._compile (fs.readFileSync infile "utf8")
        infile (true? opt.options['map']) opt.options['include-dir'])
    "utf8")
    (function (err)
      (error err)
      null)))                     ;; end of maybe Monad bindings
