// based on one of my first programming experiences in 2011 with flash and as3 but now in JS and browser copyright Craig Dempsey

// big JQ refs
let status = $('.status');
let dotPainting = $('.display');
let userInterface = $('.user-interface');

//// data and function utilities

// could be replaced with a dotStyle generator
let dotStyles = [
  {
    idx: 0,
    name: "yellow-blotch",
    imgSrc: "./public/images/yellow-blotch.png"
  },
  {
    idx: 1,
    name: "cyan-blotch",
    imgSrc: "./public/images/cyan-blotch.png"
  },
  {
    idx: 2,
    name: "magenta-blotch",
    imgSrc: "./public/images/magenta-blotch.png"
  }
];

// utils
let randomPos = function () {
  return Math.floor(Math.random()*100);
};

let squareNum = function (num) {
  return Math.pow(num, 2);
};

// external vars

let allDots = [];
let numD = 300; // make it an even number
let moveAmount = 0.2;
let numMoves = 40;

// class 'modules'

class DotHandle {

}

class Dot {
  // NN
  // NNN

  constructor( id, xPos, yPos, style ) {
    this.idx = id;
    this.xPos = xPos;
    this.yPos = yPos;
    this.tx = 0;
    this.ty = 0;
    let newDot = $(`<div id= ${this.idx} class= "${style}" >`).hover(this.onMouseIn, this.onMouseOut);
    this.JQ = newDot;
    dotPainting.append(this.JQ);
  }

  // onMouseIn () {
  //   // console.log(this.id); // returns dom object, not a Dot
  //   // console.log("mousein");
  //   allDots[this.id].NN.JQ.removeClass('green');
  //   allDots[this.id].NN.JQ.addClass('red');
  //   allDots[this.id].NNN.JQ.removeClass('green');
  //   allDots[this.id].NNN.JQ.addClass('red');
  // }

  // onMouseOut () {
  //   // console.log("mouseout");
  //   allDots[this.id].NN.JQ.removeClass('red');
  //   allDots[this.id].NN.JQ.addClass('green');
  //   allDots[this.id].NNN.JQ.removeClass('red');
  //   allDots[this.id].NNN.JQ.addClass('green');
  // }

  // find Neighbors
  findNs () {
    // take allDots array and fill in this.NN and this.NNN 
    // 20164 is based on square root of 2 times 100
    let NNDistanceSqrd = 20164;
    let NNNDistanceSqrd = 20164;

    // find NN
    allDots.forEach((dot, i) => {
      let iN = dot;
      let iNxDistance = Math.abs(this.xPos - iN.xPos);
      let iNyDistance = Math.abs(this.yPos - iN.yPos);
      let iNDistanceSqrd = squareNum(iNxDistance) + squareNum(iNyDistance);
      // if it's not me
      if (iN.idx !== this.idx) {
        // and NNN has not been set, set both
        if (typeof(this.NNN) == 'undefined') {
          // console.log('should happen once per dot', typeof(this.NNN));
          this.NNN = this;
          // NNNDistanceSqrd = 0;
          this.NN = iN;
          NNDistanceSqrd = iNDistanceSqrd;

        }
        if (iNDistanceSqrd <= NNDistanceSqrd) {
          // console.log('passed NN qualification')
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
          // console.log('passed NNN qualification')
          this.NNN = iN;
          NNNDistanceSqrd = iNDistanceSqrd;
        }
      }
    });

  } // end findNs

  setTarget () {
    let dot = this;

    // target between NN and NNN /////////////////////////////////////////
    function targetMidPoint () {
      dot.tmx = (dot.NNN.xPos + dot.NN.xPos) * 0.5 ;
      dot.tmy = (dot.NNN.yPos + dot.NN.yPos) * 0.5 ;
    }

    // target center of triangle /////////////////////////////////////////
    function targetCenterOfTriangle () {

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

      function findMidPoint () {
        let mx = (dot.NNN.xPos + dot.NN.xPos) * 0.5 ;
        let my = (dot.NNN.yPos + dot.NN.yPos) * 0.5 ;
        return { x:mx, y:my };
      }

      p1 = findMidPoint();
      // console.log(p1);

      function findTarget () {
        v1.x = (dot.xPos - dot.NN.xPos);
        v1.y = (dot.yPos - dot.NN.yPos);
        v2.x = (dot.xPos - dot.NNN.xPos);
        v2.y = (dot.yPos - dot.NNN.yPos);
        v3.x = (v2.x + v1.x) * 0.25;
        v3.y = (v2.y + v1.y) * 0.25;
        p2.x = p1.x - v3.x;
        p2.y = p1.y - v3.y;
      }

      findTarget();
      dot.tcx = p2.x;
      dot.tcy = p2.y;

    }


    // target average magnitude and average angle /////////////////
    function targetAverageVectorAverageMagnitude () {

      // midpoint
      let p1 = {};
      // target
      let p2 = {};
      // from NN to dot
      let v1 = {};
      // from NNN to dot
      let v2 = {};
      // from midpoint to dot
      let v3 = {};
      // mag of NN->NNN applied to v3
      let v4 = {};

      let avgMag = 0;

      function findMidPoint () {
        let mx = (dot.NNN.xPos + dot.NN.xPos) * 0.5 ;
        let my = (dot.NNN.yPos + dot.NN.yPos) * 0.5 ;
        return { x:mx, y:my };
      }

      p1 = findMidPoint();
      // console.log(p1);

      function findTarget () {
        v1.x = dot.xPos - dot.NN.xPos;
        v1.y = dot.yPos - dot.NN.yPos;
        v1.mag = Math.sqrt(squareNum(v1.x)+squareNum(v1.y));
        v2.x = dot.xPos - dot.NNN.xPos;
        v2.y = dot.yPos - dot.NNN.yPos;
        v2.mag = Math.sqrt(squareNum(v2.x)+squareNum(v2.y));
        v3.x = (v2.x + v1.x) * 0.5;
        v3.y = (v2.y + v1.y) * 0.5;
        v3.mag = Math.abs((v1.mag + v2.mag) * 0.5);
        v3.xn = v3.x / v3.mag;
        v3.yn = v3.y / v3.mag;

        v4.mag = Math.sqrt(squareNum(dot.NNN.xPos-dot.NN.xPos)+squareNum(dot.NNN.yPos-dot.NN.yPos));
        v4.x = v3.xn * v4.mag / 2;
        v4.y = v3.yn * v4.mag / 2;
        p2.x = p1.x + v4.x;
        p2.y = p1.y + v4.y;
      }

      findTarget();
      dot.tax = p2.x;
      dot.tay = p2.y;

    }

    // target nearest point to orthogonal of NN->NNN
    function targetNearestPointOrthogonal () {

      // midpoint
      let p1 = {};
      // target
      let p2 = {};
      // closest point on v1 to dot
      let p3 = {};
      // from NN to NNN
      let v1 = {};
      // from NN to p3
      let v1a = {};
      // from NN to dot
      let v2 = {};
      // from p3 to dot
      let v3 = {};

      // v1 normalized
      let v1n = {};

      // v2 normalized
      let v2n = {};

      function findMidPoint () {
        let mx = (dot.NNN.xPos + dot.NN.xPos) * 0.5 ;
        let my = (dot.NNN.yPos + dot.NN.yPos) * 0.5 ;
        return { x:mx, y:my };
      }

      p1 = findMidPoint();
      // console.log(p1);

      function findTarget () {
        // NN to NNN
        v1.x = dot.NNN.xPos - dot.NN.xPos;
        v1.y = dot.NNN.yPos - dot.NN.yPos;
        v1.mag = Math.sqrt(squareNum(v1.x)+squareNum(v1.y));
        v1n.x = v1.x / v1.mag;
        v1n.y = v1.y / v1.mag;
        // NN to dot
        // here we can determine which quadrant is NN in compared to dot
        // the process for getting p3 will be determined by the quadrant unfortunately
        v2.x = dot.xPos - dot.NN.xPos;
        v2.y = dot.yPos - dot.NN.yPos;
        v2.mag = Math.sqrt(squareNum(v2.x)+squareNum(v2.y));
        v2n.x = v2.x / v2.mag;
        v2n.y = v2.y / v2.mag;
        // dot product normalized vectors
        // let dp = Math.abs(v1n.x * v2n.x + v1n.y * v2n.y);
        let dp = v1n.x * v2n.x + v1n.y * v2n.y;

        let theta = Math.acos(dp);

        // having angle theta and hypoteneuse v2, we can get length of adjacent
        let cosTheta = Math.cos(theta);
        let adjacent = cosTheta * v2.mag;

        // this will give us p3, closest point to dot on v1
        v1a.mag = adjacent;
        v1a.x = v1n.x * v1a.mag;
        v1a.y = v1n.y * v1a.mag;
        p3.x = dot.NN.xPos + v1a.x;
        p3.y = dot.NN.yPos + v1a.y;

        v3.x = dot.xPos - p3.x;
        v3.y = dot.yPos - p3.y;

        p2.x = p1.x + v3.x;
        p2.y = p1.y + v3.y;


      }

      findTarget();
      dot.tox = p2.x;
      dot.toy = p2.y;

    }

    ///// end of target strategies

    function targetSomewhere () {

      // removes disconnected dots
      // exclusionary unless i do the half magnitude..  should make some 30 60 90s i think
      // dot.tx = dot.tax;
      // dot.ty = dot.tay;

      // tmx tmy is similar...
      // dot.tx = dot.tcx;
      // dot.ty = dot.tcy;

      // hard to believe he's different than tcx, maybe less gradients and curves, more angles
      // dot.tx = dot.tmx;
      // dot.ty = dot.tmy;

      // this should be the original algo
      // dot.tx = dot.tox;
      // dot.ty = dot.toy;

      // dot.tx = (dot.tax*8 + dot.tmx*0 + dot.tcx*2) * 0.1; // 10 / 10
      // dot.ty = (dot.tay*9 + dot.tmy*0 + dot.tcy+2) * 0.1; // 13 / 10

      dot.tx = (dot.tox*18 + dot.tcx*1 + dot.tax*1) * 0.05; // 10 / 10
      dot.ty = (dot.toy*18 + dot.tcy+1 + dot.tay*1) * 0.05; // 10 / 10

    }

    targetMidPoint();
    targetCenterOfTriangle();
    targetAverageVectorAverageMagnitude();
    targetNearestPointOrthogonal();
    targetSomewhere();

  }

  moveTowardTarget () {
    // app has a moveAmount constant that slowly moves you toward target
    // console.log('move called');
    this.xPos = this.xPos + (this.tx - this.xPos) * moveAmount;
    this.yPos = this.yPos + (this.ty - this.yPos) * moveAmount;

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
    let style = "dot magenta-blotch";
    let dot = new Dot(id,x,y,style);
    let dotTwin = new Dot(id2,reflectedx,y,style);
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
    // console.log(allDots);
    this.move();
  }

  move () {
    let i = numMoves;
    let timer = setInterval(moveDots, 100);
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

class ImageDropDown {
  constructor (optionsArr,width,elHeight) {
    this.options = optionsArr;
    this.width = width;
    this.height = elHeight;
    this.expanded = false;
    this.selected = this.options[0];
    this.JQ = [];
    this.DD = $(`<div class= "DD" width= "${this.width}px" height= "${this.height}px" ></div>`);
    this.buildDropDown();
    this.collapse();
    return this;
  }

  buildDropDown() {
    this.options.forEach((option, i) => {
      let divI = $(`<div class= "DD-option" "DD-option-idx-${i}" ><img src= ${option.imgSrc} ></img></div>`);
      let data = {dd: this, i:i};
      divI.on("click", data, this.handleClick);
      this.DD.append(divI);
      this.JQ.push(divI);
    });
  }

  handleClick (event) {
    console.log(event.data.dd);
    if (event.data.dd.expanded == true) {
      event.data.dd.handleSelection(event.data.i);
    } else {
      event.data.dd.expanded = true;
      event.data.dd.expand();
    }
  }

  handleSelection (option) {
    console.log(option, "option");
    this.selected = this.options[option];
    this.collapse();
    console.log("selection made", this);
  }

  expand () {
    // change overflow from hidden
    this.JQ.forEach((o) => {
      o.css({"display": "block"});
    });

  }

  collapse () {
    // change overflow to hidden
    let selection = this.JQ[this.selected.idx];
    this.JQ.forEach((o) => {
      o.css({"display": "none"});
    });
    selection.css({"display": "block"});
    this.expanded = false;
  }

}

class LayerPanel {

  constructor (layerNumber) {
    this.idx = layerNumber;
    this.JQ = {};
    this.buildLayerPanel();
    this.buildLayerButton();
    this.selected = false;
    return this.JQ;
  }

  buildLayerPanel () {
    let UIContainer = $('.user-interface');
    let layerPanel = $(`<div class= "top-panel layer-panel layer-panel-${this.idx}" ></div>`);
    layerPanel.css({"display": "none"});

    let dotStylePanel = this.buildDotStylePanel();
    let algoPanel = this.buildAlgoPanel();

    layerPanel.append(dotStylePanel);
    layerPanel.append(algoPanel);

    UIContainer.append(layerPanel);
    let JQ = $(`.layer-panel-${this.idx}`);
    this.JQ.panel = JQ;
  }

  buildLayerButton () {
    let layerButtonContainer = $('.layer-button-container');
    let layerButton = $(`<div class= "layer-button layer-button-${this.idx}" >${this.idx}</div>`);
    layerButtonContainer.append(layerButton);
    let JQ = $(`.layer-button-${this.idx}`);
    this.JQ.button = JQ;
  }

  buildDotStylePanel () {
    let DSP = $('<div class= "panel dot-style-panel" ></div>');
    let dotBox = new ImageDropDown(dotStyles,120,120);
    DSP.append(dotBox.DD);
    return DSP;
  }

  buildAlgoPanel () {
    let AP = $(`<div class= "panel algo-panel" ></div>`);
    return AP;
  }

} // end LayerPanel class

class UIPanel {

  constructor (layersConfig) {
    this.selection = 0;
    this.numLayers = layersConfig.numLayers;
    this.layerPanelsJQ = [];
    this.buildLayers();
    this.attachClickToButtons();
    this.setLayerSelection(this.selection);
  }

  buildLayers () {
    for (let i=0; i<this.numLayers; i++) {
      let layer = new LayerPanel(i);
      this.layerPanelsJQ.push({panel: layer.panel, button: layer.button});
    }
    console.log(this.layerPanelsJQ); // panel and button
  }

  attachClickToButtons () {
    this.layerPanelsJQ.forEach((JQ, i) => {
      let data = {num: i, obj: this};
      JQ.button.on("click", data, function() {
        data.obj.setLayerSelection(data.num);
      });
    });
  }

  setLayerSelection (idx) {
    this.selection = idx;
    this.layerPanelsJQ.forEach((layerJQ, i) => {
      if (i === this.selection) {
        layerJQ.panel.css({"display": "block"});
        layerJQ.button.addClass('selected');
        layerJQ.button.removeClass('not-selected');
      } else {
        layerJQ.panel.css({"display": "none"});
        layerJQ.button.addClass('not-selected');
        layerJQ.button.removeClass('selected');
      }
    });
  }

  addLayerPanel () {
    console.log("add layer and select new layer");
  }

}

let config = {
  numLayers: 3
}

let UI = new UIPanel(config);

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
