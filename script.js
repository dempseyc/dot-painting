// based on one of my first heavy programming experiences in 2011 with flash and as3 but now in es6 and browser copyright Craig Dempsey

// does git like me?

let status = $('.status');
// status.text("has jquery");

let randomPos = function () {
  return Math.floor(Math.random()*101);  // 100 percent width or height of whatever
}

let allDots = [];
let numDots = 10; // make it an even number
let moveAmount = 0.3;
let numMoves = 20;

class Dot {
  constructor( id, xPos, yPos ) {
    this.idx = id;
    this.xPos = xPos;
    this.yPos = yPos;
    //NearestNeigbor
    this.NN = {};
    //NextNearestNeighbor
    this.NNN = {};
    this.NNxDistance = 0;
    this.NNyDistance = 0;
    this.NNNxDistance = 0;
    this.NNNyDistance = 0;
    this.NNDistance = 0;
    this.NNNDistance = 0;
  }

  // find Neighbors
  findNs (allDots) {
    // take allDots array and fill in this.NN and this.NNN
    // this is an algo that needs optimization
    // Dots have NNxDistance and NNyDistance, etc, to exclude from iteration the Dots that are for sure to far to qualify

  }

  moveTowardTarget () {
    // get the position of NN and NNN and triangulate to move to that position
    // this is where most of the trig lives
    // app has a moveAmount constant that slowly moves you toward target and recalculates target after every Dot has moved toward their target

  }

} // end Dot class

class DotMaker {

  placeTwinDots (i) {
    let id = i;
    let id2 = i*2;
    let x = randomPos();
    let reflectedx = 100 - x;
    let y = randomPos();
    let dot = new Dot(id,x,y);
    let dotTwin = new Dot(id2,reflectedx,y);
    allDots.push(dot);
    allDots.push(dotTwin);
  }

  makeAllDots () {
    let iterator = numDots / 2;  // why you make it even
    while (iterator > 0) {
      this.placeTwinDots(iterator);
      iterator--;
    }
  }

} // end DotMaker class


let painter = new DotMaker();
painter.makeAllDots();

console.log(allDots);



