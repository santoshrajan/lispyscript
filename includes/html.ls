      
(macro !-- (rest...)
  (str "<!-- " ~rest... " -->"))

(macro a (rest...)
  (_LS.expandTag "a" ~rest...))

(macro abbr (rest...)
  (_LS.expandTag "abbr" ~rest...))

(macro address (rest...)
  (_LS.expandTag "address" ~rest...))

(macro area (rest...)
  (_LS.expandTag "area" ~rest...))

(macro article (rest...)
  (_LS.expandTag "article" ~rest...))

(macro aside (rest...)
  (_LS.expandTag "aside" ~rest...))

(macro audio (rest...)
  (_LS.expandTag "audio" ~rest...))

(macro b (rest...)
  (_LS.expandTag "b" ~rest...))

(macro base (rest...)
  (_LS.expandTag "base" ~rest...))

(macro bdi (rest...)
  (_LS.expandTag "bdi" ~rest...))

(macro bdo (rest...)
  (_LS.expandTag "bdo" ~rest...))

(macro blockquote (rest...)
  (_LS.expandTag "blockquote" ~rest...))

(macro body (rest...)
  (_LS.expandTag "body" ~rest...))

(macro br (rest...)
  (_LS.expandTag "br" ~rest...))

(macro button (rest...)
  (_LS.expandTag "button" ~rest...))

(macro canvas (rest...)
  (_LS.expandTag "canvas" ~rest...))

(macro caption (rest...)
  (_LS.expandTag "caption" ~rest...))

(macro cite (rest...)
  (_LS.expandTag "cite" ~rest...))

(macro code (rest...)
  (_LS.expandTag "code" ~rest...))

(macro col (rest...)
  (_LS.expandTag "col" ~rest...))

(macro colgroup (rest...)
  (_LS.expandTag "colgroup" ~rest...))

(macro command (rest...)
  (_LS.expandTag "command" ~rest...))

;; (macro data (rest...)
;;  (_LS.expandTag "data" ~rest...))

(macro datalist (rest...)
  (_LS.expandTag "datalist" ~rest...))

(macro dd (rest...)
  (_LS.expandTag "dd" ~rest...))

(macro del (rest...)
  (_LS.expandTag "del" ~rest...))

(macro details (rest...)
  (_LS.expandTag "details" ~rest...))

(macro dfn (rest...)
  (_LS.expandTag "dfn" ~rest...))

(macro div (rest...)
  (_LS.expandTag "div" ~rest...))

(macro dl (rest...)
  (_LS.expandTag "dl" ~rest...))

(macro dt (rest...)
  (_LS.expandTag "dt" ~rest...))

(macro em (rest...)
  (_LS.expandTag "em" ~rest...))

(macro embed (rest...)
  (_LS.expandTag "embed" ~rest...))

;;(macro eventsource (rest...)
;;  (_LS.expandTag "eventsource" ~rest...))

(macro fieldset (rest...)
  (_LS.expandTag "filedset" ~rest...))

(macro figcaption (rest...)
  (_LS.expandTag "figcaption" ~rest...))

(macro figure (rest...)
  (_LS.expandTag "figure" ~rest...))

(macro footer (rest...)
  (_LS.expandTag "footer" ~rest...))

(macro form (rest...)
  (_LS.expandTag "form" ~rest...))

(macro h1 (rest...)
  (_LS.expandTag "h1" ~rest...))

(macro h2 (rest...)
  (_LS.expandTag "h2" ~rest...))

(macro h3 (rest...)
  (_LS.expandTag "h3" ~rest...))

(macro h4 (rest...)
  (_LS.expandTag "h4" ~rest...))

(macro h5 (rest...)
  (_LS.expandTag "h5" ~rest...))

(macro h6 (rest...)
  (_LS.expandTag "h6" ~rest...))

(macro head (rest...)
  (_LS.expandTag "head" ~rest...))

(macro header (rest...)
  (_LS.expandTag "header" ~rest...))

(macro hgroup (rest...)
  (_LS.expandTag "hgroup" ~rest...))

(macro hr (rest...)
  (_LS.expandTag "hr" ~rest...))
  
(macro html (rest...)
  (+ "<!DOCTYPE html>\n" (_LS.expandTag "html" ~rest...)))

(macro i (rest...)
  (_LS.expandTag "i" ~rest...))

(macro iframe (rest...)
  (_LS.expandTag "iframe" ~rest...))

(macro img (rest...)
  (_LS.expandTag "img" ~rest...))

(macro input (rest...)
  (_LS.expandTag "input" ~rest...))

(macro ins (rest...)
  (_LS.expandTag "ins" ~rest...))

(macro kbd (rest...)
  (_LS.expandTag "kbd" ~rest...))

(macro keygen (rest...)
  (_LS.expandTag "keygen" ~rest...))

(macro label (rest...)
  (_LS.expandTag "label" ~rest...))

(macro legend (rest...)
  (_LS.expandTag "legend" ~rest...))

(macro li (rest...)
  (_LS.expandTag "li" ~rest...))

(macro link (rest...)
  (_LS.expandTag "link" ~rest...))

(macro map (rest...)
  (_LS.expandTag "map" ~rest...))

(macro mark (rest...)
  (_LS.expandTag "mark" ~rest...))

(macro menu (rest...)
  (_LS.expandTag "menu" ~rest...))

(macro meta (rest...)
  (_LS.expandTag "meta" ~rest...))

(macro meter (rest...)
  (_LS.expandTag "meter" ~rest...))

(macro nav (rest...)
  (_LS.expandTag "nav" ~rest...))

(macro noscript (rest...)
  (_LS.expandTag "noscript" ~rest...))

;; Trashes lispyscript 'object' statement
;; (macro object (rest...)
;;  (_LS.expandTag "object" ~rest...))

(macro ol (rest...)
  (_LS.expandTag "ol" ~rest...))

(macro optgroup (rest...)
  (_LS.expandTag "optgroup" ~rest...))

(macro option (rest...)
  (_LS.expandTag "option" ~rest...))

(macro output (rest...)
  (_LS.expandTag "output" ~rest...))

(macro p (rest...)
  (_LS.expandTag "p" ~rest...))

(macro param (rest...)
  (_LS.expandTag "param" ~rest...))

(macro pre (rest...)
  (_LS.expandTag "pre" ~rest...))

(macro progress (rest...)
  (_LS.expandTag "progress" ~rest...))

(macro q (rest...)
  (_LS.expandTag "q" ~rest...))

(macro rt (rest...)
  (_LS.expandTag "rt" ~rest...))

(macro rp (rest...)
  (_LS.expandTag "rp" ~rest...))

(macro ruby (rest...)
  (_LS.expandTag "ruby" ~rest...))

(macro s (rest...)
  (_LS.expandTag "s" ~rest...))

(macro samp (rest...)
  (_LS.expandTag "samp" ~rest...))

(macro script (rest...)
  (_LS.expandTag "script" ~rest...))

(macro section (rest...)
  (_LS.expandTag "section" ~rest...))

(macro select (rest...)
  (_LS.expandTag "select" ~rest...))

(macro small (rest...)
  (_LS.expandTag "small" ~rest...))

(macro source (rest...)
  (_LS.expandTag "source" ~rest...))

(macro span (rest...)
  (_LS.expandTag "span" ~rest...))

(macro strong (rest...)
  (_LS.expandTag "strong" ~rest...))

(macro style (rest...)
  (_LS.expandTag "style" ~rest...))

(macro sub (rest...)
  (_LS.expandTag "sub" ~rest...))

(macro summary (rest...)
  (_LS.expandTag "summary" ~rest...))

(macro sup (rest...)
  (_LS.expandTag "sup" ~rest...))

(macro table (rest...)
  (_LS.expandTag "table" ~rest...))

(macro tbody (rest...)
  (_LS.expandTag "tbody" ~rest...))

(macro td (rest...)
  (_LS.expandTag "td" ~rest...))

(macro textarea (rest...)
  (_LS.expandTag "textarea" ~rest...))

(macro tfoot (rest...)
  (_LS.expandTag "tfoot" ~rest...))

(macro th (rest...)
  (_LS.expandTag "th" ~rest...))

(macro thead (rest...)
  (_LS.expandTag "thead" ~rest...))

(macro time (rest...)
  (_LS.expandTag "time" ~rest...))

(macro title (rest...)
  (_LS.expandTag "title" ~rest...))

(macro tr (rest...)
  (_LS.expandTag "tr" ~rest...))

(macro track (rest...)
  (_LS.expandTag "track" ~rest...))

(macro u (rest...)
  (_LS.expandTag "u" ~rest...))

(macro ul (rest...)
  (_LS.expandTag "ul" ~rest...))

;; 'var' will trash javascript var so use _var instead
(macro _var (rest...)
  (_LS.expandTag "var" ~rest...))

(macro video (rest...)
  (_LS.expandTag "video" ~rest...))

(macro wbr (rest...)
  (_LS.expandTag "wbr" ~rest...))

(var _LS (|| _LS {}))

(set _LS.expandTag 
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
