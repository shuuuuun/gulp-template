var Util = require("Util");

var util = new ns.Util();

class Main {
  constructor(a, b) {
    this.a = a;
    this.b = b;
  }
  exec() {
    console.log(this.a, this.b);
  }
}

var main = new Main(1, 2);
main.exec();
