import $ from 'jquery';
// var Util = require('./Util');
import Util from './Util';

var util = new Util();

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
