// based on one of my first programming experiences in 2011 with flash and as3 but now in es6 and browser copyright Craig Dempsey

let status = $('.status');
let dotContainer = $('.dot-container');
// status.text("has jquery");

let randomPos = function () {
  return Math.floor(Math.random()*100);
};

let squareNum = function (num) {
  return Math.pow(num, 2);
};

let allDots = [];
let numD = 2000; // make it an even number
let moveAmount = 0.2;
let numMoves = 20;

class Dot {

  constructor( id, xPos, yPos ) {
    this.idx = id;
    this.xPos = xPos;
    this.yPos = yPos;
    // NearestNeigbor
    // NextNearestNeighbor
    this.tx = 0;
    this.ty = 0;
    let newDot = $(`<div id= ${id} class= "dot green" >`).hover(this.onMouseIn, this.onMouseOut);
    this.JQ = newDot;
    dotContainer.append(this.JQ);
  }

  onMouseIn () {
    console.log(this.id); // returns dom object, not a Dot
    // console.log("mousein");
    allDots[this.id].NN.JQ.removeClass('green');
    allDots[this.id].NN.JQ.addClass('red');
    allDots[this.id].NNN.JQ.removeClass('green');
    allDots[this.id].NNN.JQ.addClass('red');
  }

  onMouseOut () {
    // console.log("mouseout");
    allDots[this.id].NN.JQ.removeClass('red');
    allDots[this.id].NN.JQ.addClass('green');
    allDots[this.id].NNN.JQ.removeClass('red');
    allDots[this.id].NNN.JQ.addClass('green');
  }

  // find Neighbors
  findNs () {
    // take allDots array and fill in this.NN and this.NNN
    let NNDistanceSqrd = 20164;
    let NNNDistanceSqrd = 20164;

    // find NN
    allDots.forEach((dot) => {
      let iN = dot;
      let iNxDistance = Math.abs(this.xPos - iN.xPos);
      let iNyDistance = Math.abs(this.yPos - iN.yPos);
      let iNDistanceSqrd = squareNum(iNxDistance) + squareNum(iNyDistance);
      // if it's not me
      if (iNDistanceSqrd !== 0) {
        // and NNN has not been set, set both
        if (typeof(this.NNN) == 'undefined') {
          console.log('should happen once per dot', typeof(this.NNN));
          this.NNN = this;
          this.NN = iN;
          NNDistanceSqrd = iNDistanceSqrd;

        } else
        if (iNDistanceSqrd < NNDistanceSqrd) {
          console.log('passed NN qualification')
          this.NN = iN;
          NNDistanceSqrd = iNDistanceSqrd;
        }
      }
    });
    // find NNN
    allDots.forEach((dot) => {
      let iN = dot;
      let iNxDistance = Math.abs(this.xPos - iN.xPos);
      let iNyDistance = Math.abs(this.yPos - iN.yPos);
      let iNDistanceSqrd = squareNum(iNxDistance) + squareNum(iNyDistance);
      // if it's not me
      if (iNDistanceSqrd !== 0) {
        if (NNNDistanceSqrd > iNDistanceSqrd && iNDistanceSqrd > NNDistanceSqrd) {
          console.log('passed NNN qualification')
          this.NNN = iN;
          NNNDistanceSqrd = iNDistanceSqrd;
        }
      }
    });

  } // end findNs

  setTarget () {
    let dot = this;
    // this shrinks the spread, predictably
    // function targetMidPoint () {
    //   // console.log("dot.NN.xpos", dot.NN.xPos);
    //   dot.tx = (dot.NNN.xPos + dot.NN.xPos) * 0.5 ;
    //   dot.ty = (dot.NNN.yPos + dot.NN.yPos) * 0.5 ;
    // }
    // targetMidPoint();

    function targetAverageOfVectors () {

      // midpoint
      let p1 = {};
      // target
      let p2 = {};
      // from NN to dot
      let v1 = {};
      // from NNN to dot
      let v2 = {};
      // from p1 to p2
      let v3 = {};

      let avgMag = 0;

      // function findAverageDistance () {
      //   let d1 = Math.sqrt(squareNum(dot.xPos-dot.NN.xpos) + squareNum(dot.yPos-dot.NN.ypos));
      //   let d2 = Math.sqrt(squareNum(dot.xPos-dot.NNN.xpos) + squareNum(dot.yPos-dot.NNN.ypos));
      //   let d3 = (d1 + d2) * 0.5;
      //   return d3;
      // }

      function findMidPoint () {
        let mx = (dot.NNN.xPos + dot.NN.xPos) * 0.5 ;
        let my = (dot.NNN.yPos + dot.NN.yPos) * 0.5 ;
        return { x:mx, y:my };
      }

      p1 = findMidPoint();
      // console.log(p1);

      function findTarget () {
        v1.x = (dot.xPos - dot.NN.xPos) * 0.5;
        v1.y = (dot.yPos - dot.NN.yPos) * 0.5;
        v2.x = (dot.xPos - dot.NNN.xPos) * 0.5;
        v2.y = (dot.yPos - dot.NNN.yPos) * 0.5;
        v3.x = (v2.x + v1.x) * 0.5;
        v3.y = (v2.y + v1.y) * 0.5;
        p2.x = p1.x - v3.x;
        p2.y = p1.y - v3.y;
      }

      findTarget();
      dot.tx = p2.x;
      dot.ty = p2.y;
    }

    targetAverageOfVectors();
    // return p2;
    // console.log(p2);
  }

  moveTowardTarget () {
    // app has a moveAmount constant that slowly moves you toward target
    console.log('move called');
    this.xPos = this.xPos + (this.tx - this.xPos) * moveAmount;
    this.yPos = this.yPos + (this.ty - this.yPos) * moveAmount;

    //// maybe change these so they return a percentage
    // this.xPos = this.xPos + (this.xPos - this.tx) * moveAmount;
    // this.yPos = this.yPos + (this.yPos - this.ty) * moveAmount;

    this.JQ.css({"left": `${this.xPos}%`});
    this.JQ.css({"top": `${this.yPos}%`});

  }

} // end Dot class

class DotMaker {

  placeTwinDots (i) {
    let id = i;
    let id2 = i+1;
    let x = randomPos();
    let reflectedx = 100 - x;
    let y = randomPos();
    let dot = new Dot(id,x,y);
    let dotTwin = new Dot(id2,reflectedx,y);
    allDots.push(dot);
    allDots.push(dotTwin);
  }

  makeAllDots (evenNum) {
    let iterator = 0;
    while (iterator < evenNum) {
      this.placeTwinDots(iterator);
      iterator+=2;
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
      dot.JQ.css({"left": `${dot.xPos}%`});
      dot.JQ.css({"top": `${dot.yPos}%`});
    });
    console.log(allDots);
    this.move();
  }

  move () {
    let i = numMoves;
    let timer = setInterval(moveDots, 500);
    function moveDots () {
      if (i > 0) {
        console.log("moveDots called");
        allDots.forEach((dot) => {
          dot.setTarget();
          dot.moveTowardTarget();
          dot.JQ.css({"left": `${dot.xPos}%`});
          dot.JQ.css({"top": `${dot.yPos}%`});
        });
        i--;
      }
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
