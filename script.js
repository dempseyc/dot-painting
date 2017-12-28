// based on one of my first programming experiences in 2011 with flash and as3 but now in es6 and browser copyright Craig Dempsey

let status = $('.status');
let dotContainer = $('.dot-container');
// status.text("has jquery");

let randomPos = function () {
  return Math.floor(Math.random()*1001);
};

let squareNum = function (num) {
  return Math.pow(num, 2);
};

let allDots = [];
let numD = 1000; // make it an even number
let moveAmount = 0.3;
let numMoves = 6;

class Dot {

  constructor( id, xPos, yPos ) {
    this.idx = id;
    this.xPos = xPos;
    this.yPos = yPos;
    // NearestNeigbor
    this.NN = {};
    // NextNearestNeighbor
    this.NNN = {};
    this.tx = 0;
    this.ty = 0;
  }

  // find Neighbors
  findNs () {
    // take allDots array and fill in this.NN and this.NNN
    // console.log ('findNs called');
    let prevNxDistance = 100;
    let prevNyDistance = 100;
    let prevDistanceSqrd = squareNum(prevNxDistance) + squareNum(prevNxDistance);
    let NNDistanceSqrd = 0;

    allDots.forEach((dot) => {
      let iN = dot;
      let iNxDistance = Math.abs(this.xPos - iN.xPos);
      let iNyDistance = Math.abs(this.yPos - iN.yPos);
      // if it's not me
      if (iNxDistance !== 0 && iNyDistance !== 0) {
        // and NNN has not ben set, set both
        if (typeof(this.NNN) !== 'Dot') {
          this.NNN = iN;
        }
        // now if either of its x and y distances are less than prev, store this N dist^2 and continue
        if (iNxDistance < prevNxDistance || iNyDistance < prevNyDistance) {
          // console.log('passed second qualification');
          let iNDistanceSqrd = squareNum(iNxDistance) + squareNum(iNyDistance);

          // if it's distance is less than prev and greater than nearest, set it as NNN
          if (iNDistanceSqrd < prevDistanceSqrd && iNDistanceSqrd > NNDistanceSqrd) {
            this.NNN = iN;
            // if it's closer than NN, set NNN to NN, NN to dot, and reset qualifiers
            if (iNDistanceSqrd < prevDistanceSqrd) {
              this.NNN = this.NN;
              this.NN = iN;
              prevNxDistance = iNxDistance;
              prevNyDistance = iNyDistance;
              prevDistanceSqrd = iNDistanceSqrd;
            }
          }
        }
      }
    });

  } // end findNs

  setTarget () {
    let dot = this;
    function targetMidPoint () {
      dot.tx = (dot.NN.xPos + dot.NNN.xPos) / 2 ;
      dot.ty = (dot.NN.yPos + dot.NNN.yPos) / 2 ;
    }
    // targetMidPoint();
    function targetAverageDist () {
      // do some trig
    }
  }

  moveTowardTarget () {
    // app has a moveAmount constant that slowly moves you toward target
    console.log('move called');
    this.xPos = this.xPos + (this.tx - this.xPos) * moveAmount;
    this.yPos = this.yPos + (this.ty - this.yPos) * moveAmount;
    this.JQ.css({"left": `${this.xPos}%`});
    this.JQ.css({"top": `${this.yPos}%`});

  }

} // end Dot class

class DotMaker {

  placeTwinDots (i) {
    let id = i;
    let id2 = i*2;
    let x = randomPos();
    let reflectedx = 1000 - x;
    let y = randomPos();
    let dot = new Dot(id,x,y);
    let dotTwin = new Dot(id2,reflectedx,y);
    allDots.push(dot);
    allDots.push(dotTwin);
  }

  makeAllDots (evenNum) {
    let iterator = evenNum / 2;
    while (iterator > 0) {
      this.placeTwinDots(iterator);
      iterator--;
    }
    allDots.forEach((dot) => {
      dot.findNs();
    });
  }

} // end DotMaker class

class Painter {
  constructor (numDots) {
    this.numDots = numDots;
    this.draw();
  }
  draw () {
    let dotMaker = new DotMaker();
    // execution that puts NN and NNN in each of the dots
    dotMaker.makeAllDots(this.numDots);
    this.paint();
  }
  paint () {
    allDots.forEach((dot) => {
      let newDot = $('<div class= "dot" >');
      dot.JQ = newDot;
      dot.JQ.css({"left": `${dot.xPos}%`});
      dot.JQ.css({"top": `${dot.yPos}%`});
      dotContainer.append(dot.JQ);
    });
    this.move();
  }
  move () {
    for (let i = numMoves; i >=0; i--) {
      allDots.forEach((dot) => {
        dot.setTarget();
        dot.moveTowardTarget();
        dot.JQ.css({"left": `${dot.xPos}%`});
        dot.JQ.css({"top": `${dot.yPos}%`});
      });
    }
  }
} // end class Painter

let paintDots = new Painter(numD);



/////////////////////////////////////////////////////////////////////////////////////
// function testIfAnyDotsHaveThemselvesAsNs () {
//   allDots.forEach((dot) => {
//     if (dot.NN === dot || dot.NNN === dot) {
//       console.log('self as neighbor');
//     }
//   });
// }

// testIfAnyDotsHaveThemselvesAsNs();
/////////////////////////////////////////////////////////////////////////////////////
