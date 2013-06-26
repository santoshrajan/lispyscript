;; A very simple REPL written in LispyScript

(require "./require")
(var readline (require "readline")
     ls (require "../lib/ls")
     prefix "lispy> ")

(set exports.runrepl
  (function ()
    (var rl (readline.createInterface process.stdin process.stdout))
    (rl.on 'line'
      (function (line)
        (try
          (var l (ls._compile line))
          (console.log (this.eval l))
          (function (err)
            (console.log err)))
        (rl.setPrompt prefix prefix.length)
        (rl.prompt)))
    (rl.on 'close'
      (function ()
        (console.log "Bye!")
        (process.exit 0)))
    (console.log (str prefix 'LispyScript REPL v' ls.version))
    (rl.setPrompt prefix prefix.length)
    (rl.prompt)))

