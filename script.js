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
    // NearestNeigbor
    this.NN = {};
    // NextNearestNeighbor
    this.NNN = {};
  }

  // find Neighbors
  findNs () {
    // take allDots array and fill in this.NN and this.NNN
    // console.log ('findNs called');
    let prevNxDistance = 100;
    let prevNyDistance = 100;
    let prevDistanceSquared = squareNum(prevNxDistance) + squareNum(prevNxDistance);
    let NNDistanceSquared = 0;

    allDots.forEach((dot) => {
      let iN = dot;
      let iNxDistance = Math.abs(this.xPos - iN.xPos);
      let iNyDistance = Math.abs(this.yPos - iN.yPos);
      // if it's not me
      if (iNxDistance !== 0 && iNyDistance !== 0) {
        // and NN has not ben set, set it
        if (typeof(this.NN) !== 'Dot') {
          this.NN = iN;
        }
        // also always set NNN to this N
        this.NNN = iN;
        // now if both its x and y distances are less than prev, store this N dist^2 and continue
        if (iNxDistance < prevNxDistance || iNyDistance < prevNyDistance) {
          // console.log('passed second qualification');
          let iNDistanceSquared = squareNum(iNxDistance) + squareNum(iNyDistance);

          // if it's distance is less than prev and greater than nearest, set it as NNN
          if (iNDistanceSquared < prevDistanceSquared && iNDistanceSquared > NNDistanceSquared) {
            this.NNN = iN;
            // if it's closer than prev dot, set NNN to NN, NN to dot, and reset qualifiers
            if (iNDistanceSquared < prevDistanceSquared) {
              this.NNN = this.NN;
              this.NN = iN;
              prevNxDistance = iNxDistance;
              prevNyDistance = iNyDistance;
              prevDistanceSquared = iNDistanceSquared;
            }
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
    allDots.forEach((dot) => {
      dot.findNs();
    });
  }

} // end DotMaker class

function paint () {
  let painter = new DotMaker();
  painter.makeAllDots();
  // execution that puts NN and NNN in each of the dots
  console.log(allDots);
}

paint();

function testIfAnyDotsHaveThemselvesAsNs () {
  allDots.forEach((dot) => {
    if (dot.NN === dot || dot.NNN === dot) {
      console.log('self as neighbor');
    }
  });
}

testIfAnyDotsHaveThemselvesAsNs();
