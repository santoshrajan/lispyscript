
// Note that the browser repl uses jquery.terminal
// But we do not bundle jquery in browser-bundle.js due to it's size.
// If you would like to use the browser repl you must link in the relevant
// jquery files and call lispyscript.enableBrowserRepl() in document ready

if(typeof window !== 'undefined') {

  var ls = require("lispyscript")

  function initBrowserRepl(replElementId, width, height, openCheck) {

    jQuery.fn[replElementId] = function(eval, options) {
        if (jQuery('body').data(replElementId)) {
            return jQuery('body').data(replElementId).terminal;
        }
        this.addClass(replElementId);
        options = options || {};
        eval = eval || function(command, term) {
            term.echo("[[;red;black]no eval found for browser repl]");
        };
        var settings = {
            prompt: 'lispy> ',
            name: 'lsrepl',
            width: width,
            height: height,
            enabled: false,
            greetings: 'LispyScript REPL v0.3.6',
            keypress: function(e) { return !(openCheck(e)); }
        };
        if (options) {
            jQuery.extend(settings, options);
        }
        this.append('<div class="td"></div>');
        var self = this;
        self.terminal = this.find('.td').terminal(eval, settings);
        var focus = false;
        jQuery(document.documentElement).keypress(function(e) {
            if (openCheck(e)) {
                if(width === "100%") {
                  // sliding up:

                  // at least for now - only one at a time:
                  // (yes this a bit of a hack)
                  var otherRepl = jQuery('#lsreplright:visible')
                  if(otherRepl) {
                      otherRepl.animate({width: 'toggle'}, 'fast');
                  }

                  self.slideToggle('fast');

                } 
                else {
                  // sliding left:

                  // at least for now - only one at a time:
                  // (yes this a bit of a hack)
                  var otherRepl = jQuery('#lsreplbottom:visible')
                  if(otherRepl) {
                      otherRepl.slideToggle('fast');
                  }

                  self.animate({width: 'toggle'}, 'fast');
                }
                self.terminal.focus(focus = !focus);
                self.terminal.attr({
                    scrollTop: self.terminal.attr("scrollHeight")
                });
            }
        });
        jQuery('body').data(replElementId, this);
        this.hide();
        return self;
    };
  }

  //--------------------------------------------------------------------------

  function handleBrowserRepl(replElementId) {

    // Are we building up a multiline command?
    var currentCmd = '';

    function compileCmd(command) {
       currentCmd += (command + '\n');
       return ls._compile(currentCmd);
    }

    function incompleteCmd(command, terminal) {
        terminal.set_prompt('  ...> ');
    }

    function completeCmd(terminal, msg) {
        currentCmd = '';
        if(msg) {
          terminal.echo(msg);
        }
        terminal.set_prompt('lispy> ');
    }

    jQuery("#" + replElementId)[replElementId](function(command, terminal) {
       (function() {
         // skip empty commands
         if(/\S/.test(command)) {
           try {
             // "code" command = see generated javascript
             var codeCmd = command.match(/\s*code\s*(.*)/);
             if(codeCmd && codeCmd.length) {
               var jscode = compileCmd(codeCmd[1]);
               completeCmd(terminal, '[[;blue;black]' + jscode + ']');
             }
             else {
               var jscode = compileCmd(command);
               jscode = jscode.replace(/require\s*\(/g, 'lsrequire(');
               var res = eval.call(window, jscode);
               completeCmd(terminal, '[[;yellow;black]' + res + ']');
             }
           } catch (e) {
             if(e.message.match(/.*End of File.*unterminated.*/)) {
                incompleteCmd(command, terminal);
             }
             else {
                // I tried e.stack below but it wasn't helpful since
                // the stacktrace is just the lispyscript internals
                // not the trace inside the eval'ed code
                completeCmd(terminal, '[[;red;black]' + e +']');
             }
           }
         }
       })();
    });
  }

  function addReplElementToPage(replElementId, cssOptions) {
    jQuery("body").append('<div id=\"' + replElementId + '\" />');
    var replCss = { display: "none", position: "absolute" };
    if (cssOptions) {
        jQuery.extend(replCss, cssOptions);
    }

    $("#" + replElementId).css(replCss);
  }

  var enableBrowserRepl = function() {

    jQuery.extend_if_has = function(desc, source, array) {
       for (var i=array.length;i--;) {
         if (typeof source[array[i]] != 'undefined') {
            desc[array[i]] = source[array[i]];
         }
       }
       return desc;
    };

    // bottom repl - 
    addReplElementToPage('lsreplbottom', { bottom: 0, left: 0, width: "100%", "z-index": 1100 });
    initBrowserRepl('lsreplbottom', "100%", 280, function(e) { return ((e.which == 24 || e.key === 'x') && e.ctrlKey); });
    handleBrowserRepl('lsreplbottom');

    // right repl - 
    addReplElementToPage('lsreplright', { top: 0, right: 0, height: "100%", "z-index": 1100 });
    initBrowserRepl('lsreplright', 280, "100%", function(e) { return ((e.which == 22 || e.key === 'v') && e.ctrlKey); });
    handleBrowserRepl('lsreplright');

    console.log('Lispsycript repl available: ctrl-x for bottom, ctrl-v for right');
  };


  // currently lispyscript is the only public module that's nicely requireable
  // without a "./" prefix - so just make the browser repl available off it:
  ls.enableBrowserRepl = enableBrowserRepl;

}

