// based on one of my first heavy programming experiences in 2011 with flash and as3 but now in es6 and browser copyright Craig Dempsey

// does git like me?

let status = $('.status');
// status.text("has jquery");

let randomPos = function () {
  return Math.floor(Math.random()*101);  // 100 percent width or height of whatever
};

let squareNum = function (num) {
  return Math.pow(num, 2);
};

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
    // this.NN = {};
    //NextNearestNeighbor
    // this.NNN = {};
  }

  // find Neighbors
  findNs () {
    // take allDots array and fill in this.NN and this.NNN
    // console.log ('findNs called');
    let prevNxDistance = 100;
    let prevNyDistance = 100;
    let prevDistanceSquared = squareNum(prevNxDistance) + squareNum(prevNxDistance);

    allDots.forEach((dot) => {
      let iNxDistance = Math.abs(this.xPos - dot.xPos);
      let iNyDistance = Math.abs(this.yPos - dot.yPos);
      // if it's not me
      if (iNxDistance !== 0 && iNyDistance !== 0) {
        // and it's distance is less than prev
        if (iNxDistance < prevNxDistance || iNyDistance < prevNyDistance) {
          // console.log('passed second qualification');
          let iNDistanceSquared = squareNum(iNxDistance) + squareNum(iNyDistance);
          // and it's closer than prev dot
          // NaN
          // console.log(iNDistanceSquared, prevDistanceSquared);
          if (iNDistanceSquared < prevDistanceSquared) {
            console.log('passed qualifications');
            this.NNN = this.NN;
            this.NN = dot;
            prevNxDistance = iNxDistance;
            prevNyDistance = iNyDistance;
            prevDistanceSquared = iNDistanceSquared;
          }
        }
      }

    });

  } // end findNs

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

////  now we have a bunch of pairs of dots, the following index in the allDots array is the twin of the current index.  we want to find Ns for each Dot in allDots array

console.log(allDots);

// execution that should put NN and NNN in each of the dots
allDots.forEach((dot) => {
  dot.findNs();
});



