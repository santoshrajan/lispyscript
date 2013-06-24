(var
  fs (require "fs")
  ls (require "./ls")
  filename (require.resolve "../src/macros.ls")
  code (fs.readFileSync filename "utf8"))

(ls._compile code filename)