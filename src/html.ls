
(var expandTag 
  (function (name attr)
    (var args (Array.prototype.slice.call arguments))
    (var ret "")
    (if (string? name)
      (do
        (set ret (+ "<" name))
        (args.shift)
        (if (object? attr)
          (do
            (set ret (+ ret (template-repeat-key attr " " key "=" "\"" value "\"")))
            (args.shift)))
        (if (|| (> args.length 0) (= name "script"))
          (set ret (str ret ">" (args.join "") "</" name ">"))
          (set ret (+ ret "/>")))
        ret)
      "")))
      
(macro doctype (rest...)
  (str "<!DOCTYPE " ~rest... ">\n"))
      
(macro !-- (rest...)
  (str "<!-- " ~rest... " -->"))

(macro a (rest...)
  (expandTag "a" ~rest...))

(macro abbr (rest...)
  (expandTag "abbr" ~rest...))

(macro address (rest...)
  (expandTag "address" ~rest...))

(macro area (rest...)
  (expandTag "area" ~rest...))

(macro article (rest...)
  (expandTag "article" ~rest...))

(macro aside (rest...)
  (expandTag "aside" ~rest...))

(macro audio (rest...)
  (expandTag "audio" ~rest...))

(macro b (rest...)
  (expandTag "b" ~rest...))

(macro base (rest...)
  (expandTag "base" ~rest...))

(macro bdi (rest...)
  (expandTag "bdi" ~rest...))

(macro bdo (rest...)
  (expandTag "bdo" ~rest...))

(macro blockquote (rest...)
  (expandTag "blockquote" ~rest...))

(macro body (rest...)
  (expandTag "body" ~rest...))

(macro br (rest...)
  (expandTag "br" ~rest...))

(macro button (rest...)
  (expandTag "button" ~rest...))

(macro canvas (rest...)
  (expandTag "canvas" ~rest...))

(macro caption (rest...)
  (expandTag "caption" ~rest...))

(macro cite (rest...)
  (expandTag "cite" ~rest...))

(macro code (rest...)
  (expandTag "code" ~rest...))

(macro col (rest...)
  (expandTag "col" ~rest...))

(macro colgroup (rest...)
  (expandTag "colgroup" ~rest...))

(macro command (rest...)
  (expandTag "command" ~rest...))

;; (macro data (rest...)
;;  (expandTag "data" ~rest...))

(macro datalist (rest...)
  (expandTag "datalist" ~rest...))

(macro dd (rest...)
  (expandTag "dd" ~rest...))

(macro del (rest...)
  (expandTag "del" ~rest...))

(macro details (rest...)
  (expandTag "details" ~rest...))

(macro dfn (rest...)
  (expandTag "dfn" ~rest...))

(macro div (rest...)
  (expandTag "div" ~rest...))

(macro dl (rest...)
  (expandTag "dl" ~rest...))

(macro dt (rest...)
  (expandTag "dt" ~rest...))

(macro em (rest...)
  (expandTag "em" ~rest...))

(macro embed (rest...)
  (expandTag "embed" ~rest...))

;;(macro eventsource (rest...)
;;  (expandTag "eventsource" ~rest...))

(macro fieldset (rest...)
  (expandTag "filedset" ~rest...))

(macro figcaption (rest...)
  (expandTag "figcaption" ~rest...))

(macro figure (rest...)
  (expandTag "figure" ~rest...))

(macro footer (rest...)
  (expandTag "footer" ~rest...))

(macro form (rest...)
  (expandTag "form" ~rest...))

(macro h1 (rest...)
  (expandTag "h1" ~rest...))

(macro h2 (rest...)
  (expandTag "h2" ~rest...))

(macro h3 (rest...)
  (expandTag "h3" ~rest...))

(macro h4 (rest...)
  (expandTag "h4" ~rest...))

(macro h5 (rest...)
  (expandTag "h5" ~rest...))

(macro h6 (rest...)
  (expandTag "h6" ~rest...))

(macro head (rest...)
  (expandTag "head" ~rest...))

(macro header (rest...)
  (expandTag "header" ~rest...))

(macro hgroup (rest...)
  (expandTag "hgroup" ~rest...))

(macro hr (rest...)
  (expandTag "hr" ~rest...))
  
(macro html (rest...)
  (+ "<!DOCTYPE html>\n" (expandTag "html" ~rest...)))

(macro i (rest...)
  (expandTag "i" ~rest...))

(macro iframe (rest...)
  (expandTag "iframe" ~rest...))

(macro img (rest...)
  (expandTag "img" ~rest...))

(macro input (rest...)
  (expandTag "input" ~rest...))

(macro ins (rest...)
  (expandTag "ins" ~rest...))

(macro kbd (rest...)
  (expandTag "kbd" ~rest...))

(macro keygen (rest...)
  (expandTag "keygen" ~rest...))

(macro label (rest...)
  (expandTag "label" ~rest...))

(macro legend (rest...)
  (expandTag "legend" ~rest...))

(macro li (rest...)
  (expandTag "li" ~rest...))

(macro link (rest...)
  (expandTag "link" ~rest...))

(macro map (rest...)
  (expandTag "map" ~rest...))

(macro mark (rest...)
  (expandTag "mark" ~rest...))

(macro menu (rest...)
  (expandTag "menu" ~rest...))

(macro meta (rest...)
  (expandTag "meta" ~rest...))

(macro meter (rest...)
  (expandTag "meter" ~rest...))

(macro nav (rest...)
  (expandTag "nav" ~rest...))

(macro noscript (rest...)
  (expandTag "noscript" ~rest...))

(macro object (rest...)
  (expandTag "object" ~rest...))

(macro ol (rest...)
  (expandTag "ol" ~rest...))

(macro optgroup (rest...)
  (expandTag "optgroup" ~rest...))

(macro option (rest...)
  (expandTag "option" ~rest...))

(macro output (rest...)
  (expandTag "output" ~rest...))

(macro p (rest...)
  (expandTag "p" ~rest...))

(macro param (rest...)
  (expandTag "param" ~rest...))

(macro pre (rest...)
  (expandTag "pre" ~rest...))

(macro progress (rest...)
  (expandTag "progress" ~rest...))

(macro q (rest...)
  (expandTag "q" ~rest...))

(macro rt (rest...)
  (expandTag "rt" ~rest...))

(macro rp (rest...)
  (expandTag "rp" ~rest...))

(macro ruby (rest...)
  (expandTag "ruby" ~rest...))

(macro s (rest...)
  (expandTag "s" ~rest...))

(macro samp (rest...)
  (expandTag "samp" ~rest...))

(macro script (rest...)
  (expandTag "script" ~rest...))

(macro section (rest...)
  (expandTag "section" ~rest...))

(macro select (rest...)
  (expandTag "select" ~rest...))

(macro small (rest...)
  (expandTag "small" ~rest...))

(macro source (rest...)
  (expandTag "source" ~rest...))

(macro span (rest...)
  (expandTag "span" ~rest...))

(macro strong (rest...)
  (expandTag "strong" ~rest...))

(macro style (rest...)
  (expandTag "style" ~rest...))

(macro sub (rest...)
  (expandTag "sub" ~rest...))

(macro summary (rest...)
  (expandTag "summary" ~rest...))

(macro sup (rest...)
  (expandTag "sup" ~rest...))

(macro table (rest...)
  (expandTag "table" ~rest...))

(macro tbody (rest...)
  (expandTag "tbody" ~rest...))

(macro td (rest...)
  (expandTag "td" ~rest...))

(macro textarea (rest...)
  (expandTag "textarea" ~rest...))

(macro tfoot (rest...)
  (expandTag "tfoot" ~rest...))

(macro th (rest...)
  (expandTag "th" ~rest...))

(macro thead (rest...)
  (expandTag "thead" ~rest...))

(macro time (rest...)
  (expandTag "time" ~rest...))

(macro title (rest...)
  (expandTag "title" ~rest...))

(macro tr (rest...)
  (expandTag "tr" ~rest...))

(macro track (rest...)
  (expandTag "track" ~rest...))

(macro u (rest...)
  (expandTag "u" ~rest...))

(macro ul (rest...)
  (expandTag "ul" ~rest...))

;; 'var' will trash javascript var so use _var instead
(macro _var (rest...)
  (expandTag "var" ~rest...))

(macro video (rest...)
  (expandTag "video" ~rest...))

(macro wbr (rest...)
  (expandTag "wbr" ~rest...))
