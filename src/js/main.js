(function(win, doc, ns){
  
  var $win = $(win);
  var util = new ns.Util();
  util.bindOnResize();
  
  $(function(){
    
    if (ns.ua.isSP) {
      // sp
      $(".onlypc").remove();
    }
    else {
      // pc
      $(".onlysp").remove();
    }
    
  });
  
  // for development
  win.dev = {
  };
  
})(this, document, App);
