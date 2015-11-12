(function(win, doc, ns){
  
  var $win = $(win);
  
  function Util(){
    
    this.getWinSize();
  }
  
  Util.prototype.bindOnResize = function(){
    var that = this;
    
    $win.on("resize", that.throttle(function(){
      that.getWinSize();
    },500));
  };
  
  Util.prototype.getWinSize = function(){
      ns.winW = Math.max( $win.width(), (win.innerWidth || 0) );
      ns.winH = Math.max( $win.height(), (win.innerHeight || 0) );
      // ns.docW = $(doc).width();
      // ns.docH = $(doc).height();
      // ns.wraW = $(".wrapper").width();
      // ns.wraH = $(".wrapper").height();
  };
  
  Util.prototype.throttle = function(fn, interval){
    var isWaiting = false;
    var exec = function(event) {
        if (isWaiting) return;
        isWaiting = true;
        setTimeout(function() {
            isWaiting = false;
            fn(event);
        }, interval);
    };
    return exec;
  };
  
  Util.prototype.debounce = function(fn, interval){
    var timer;
    var exec = function(event) {
      clearTimeout(timer);
      timer = setTimeout(function() {
        fn(event);
      }, interval);
    };
    return exec;
  };
  
  Util.prototype.async = function(fnList){
    // fnList ... 第一引数にcallbackを取る関数の配列
    (function exec(index){
      if (!fnList[index]) return;
      fnList[index](function(){
        exec(index + 1);
      });
    })(0);
  };
  
  ns.Util = Util;
  
})(this, document, App);
