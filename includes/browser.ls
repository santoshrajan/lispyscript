;; Shortcuts for usage in browser
;; Usage:
;; ($ "mydiv") same as (document.getElementById "mydiv")
;; ($listener domObject eventType (expression)...)
;; Event Object is available to the exoressions as "event"

(macro $ (id)
  (document.getElementById ~id))

(macro $listener (domObj eventName rest...)
  ((.addEventListener ~domObj) ~eventName
    (function (event)
    ~rest...)))

