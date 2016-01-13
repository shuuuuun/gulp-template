(function(win, doc){
  var ns = win.App = win.App || {};
  
  var util = new ns.Util();
  
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
