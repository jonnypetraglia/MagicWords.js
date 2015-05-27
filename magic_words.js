/** Magic Words
* A minimalistic library for handling keyboard shortcuts in JS
*/

var MagicWords = (function() {
  var MW = {
    spoken: [],
    data: [],
    longest: 0,
    elementsSet: {},
    init: function(initData) {
      for(var i in initData) {
        MW.add(initData[i]);
      }
    },
    add: function(element, d) {
      if(!d) {
        d = element;
        element = document;
      }
      if (typeof d.words == 'string' || d.words instanceof String) {
        var x = [];
        for(var j in d.words)
          x[j] = d.words.charCodeAt(j);
        d.words = x;
      }
      MW.data.push(d);
      MW.longest = Math.max(MW.longest, d.words.length);
      var i = MW.longest;
      while(i-->0)
        MW.spoken.push(-1);
      if(!MW.elementsSet[element]) {
        MW._addEvent(element, "keydown", MW.doDown);
        MW._addEvent(element, "keypress", MW.doPress);
        MW.elementsSet[element] = true;
      }
      return MW.data.length-1; // Index of data item
    },
    doPress: function(e) {
      if(e.charCode>0)
        MW.speakChar(e.charCode);
    },
    doDown: function (e) {
      if(e.keyCode == 9 || // Tab
          (e.keyCode >=37 && e.keyCode <= 40)  // Arrow keys
        )
          MW.doTheDo(e.keyCode);
    },
    speakChar: function(n) {
      MW.spoken.push(n);
  
      while(MW.spoken.length>MW.longest)
        MW.spoken.shift();
      
      var wordWasSpoken = MW.spoken.join(',');
      for(var i in MW.data) {
        var wordToTest = MW.data[i].words.join(',');
        var loc = wordWasSpoken.indexOf(wordToTest);
        var locWant = wordWasSpoken.length-wordToTest.length;
        if(loc>-1 && loc == locWant)
        {
          MW.data[i].magic();
        }
      }
    },
    //http://stackoverflow.com/a/16089662
    _addEvent: function(ele, ev, cb){
      var modern = (ele.addEventListener), event = function(obj, evt, fn){
          if(modern) {
              obj.addEventListener(evt, fn, false);
          } else {
              obj.attachEvent("on" + evt, fn);
          }
      }, code = function(e){
          e = e || window.event;
          return(e.keyCode || e.which);
      }, init = function(){
          event(ele, ev, function(e){
              var key = code(e);
              return cb(e); // or cb(key) ???
          });
      };
      if(modern) {
          ele.addEventListener("DOMContentLoaded", init, false);
      } else {
          ele.attachEvent("onreadystatechange", function(){
              if(ele.readyState === "complete") {
                  init();
              }
          });
      }
    }
  }
  return MW;
})();