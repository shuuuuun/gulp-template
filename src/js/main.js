(function(win, doc){
  var ns = win.App = win.App || {};
  
  var $win = $(win);
  var util = new ns.Util();
  // util.bindOnResize();
  
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
  
})(this, document);



class Hoge {
  constructor(a, b) {
    this.a = a;
    this.b = b;
  }
  exec() {
    console.log(this.a, this.b);
  }
}

var hoge = new Hoge(1, 2);
hoge.exec();

var fuga = () => {
  console.log("this is submodule kasnuu");
};

module.exports = fuga;
