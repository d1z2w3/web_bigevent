!function(){"use strict";var e=tinymce.util.Tools.resolve("tinymce.PluginManager"),t=tinymce.util.Tools.resolve("tinymce.dom.DOMUtils"),n=tinymce.util.Tools.resolve("tinymce.EditorManager"),i=tinymce.util.Tools.resolve("tinymce.Env"),o=tinymce.util.Tools.resolve("tinymce.util.Delay"),l=tinymce.util.Tools.resolve("tinymce.util.Tools"),u=tinymce.util.Tools.resolve("tinymce.util.VK"),r={getTabFocus:function(e){return e.getParam("tab_focus",e.getParam("tabfocus_elements",":prev,:next"))}},c=t.DOM,s=function(e){e.keyCode!==u.TAB||e.ctrlKey||e.altKey||e.metaKey||e.preventDefault()},a=function(e){function t(t){var s,a,y,f;if(!(t.keyCode!==u.TAB||t.ctrlKey||t.altKey||t.metaKey||t.isDefaultPrevented())&&(1===(y=l.explode(r.getTabFocus(e))).length&&(y[1]=y[0],y[0]=":prev"),a=t.shiftKey?":prev"===y[0]?m(-1):c.get(y[0]):":next"===y[1]?m(1):c.get(y[1]))){var d=n.get(a.id||a.name);a.id&&d?d.focus():o.setTimeout(function(){i.webkit||window.focus(),a.focus()},10),t.preventDefault()}function m(i){function o(e){return/INPUT|TEXTAREA|BUTTON/.test(e.tagName)&&n.get(t.id)&&-1!==e.tabIndex&&function i(e){return"BODY"===e.nodeName||"hidden"!==e.type&&"none"!==e.style.display&&"hidden"!==e.style.visibility&&i(e.parentNode)}(e)}if(a=c.select(":input:enabled,*[tabindex]:not(iframe)"),l.each(a,function(t,n){if(t.id===e.id)return s=n,!1}),i>0){for(f=s+1;f<a.length;f++)if(o(a[f]))return a[f]}else for(f=s-1;f>=0;f--)if(o(a[f]))return a[f];return null}}e.on("init",function(){e.inline&&c.setAttrib(e.getBody(),"tabIndex",null),e.on("keyup",s),i.gecko?e.on("keypress keydown",t):e.on("keydown",t)})};e.add("tabfocus",function(e){a(e)})}();