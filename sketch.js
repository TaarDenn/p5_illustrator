// Author: taardenn
// Twitter: @taardenn
// Instagram: @taardenn
// Reddit: u/taardenn

let supArr = [];
let snap = false;
let snapDist = 50;
let activePoint;


function setup() {
  createCanvas(400, 400);
  colorMode(HSB, 360, 100, 100, 100)
  strokeWeight(2);
}

function draw() {
  background(32, 5, 95);
  activePoint = snap ? nearestPoint(snapDist) : createVector(mouseX, mouseY)
  drawLines()
}

function drawLines() {
  if (supArr.length != 0) {

    supArr.forEach((arr) => {
      for (let i = 0; i < arr.length - 1; i++) {
        line(arr[i].x, arr[i].y, arr[i + 1].x, arr[i + 1].y)
      }
    });

    let arr = supArr[supArr.length - 1]
    if (arr.length != 0) {
      line(arr[arr.length - 1].x,
        arr[arr.length - 1].y,
        activePoint.x,
        activePoint.y
      );
    }
  }
}

function nearestPoint(_maxDist) {
  let refDist = _maxDist;
  let np;
  supArr.forEach((arr, i) => {
    let dists = arr.map(p => dist(p.x, p.y, mouseX, mouseY));
    let minDist = Math.min(...dists);
    if (minDist < refDist) {
      np = snappedPoint = supArr[i][dists.indexOf(minDist)];
      push()
      stroke([0,100,100])
      strokeWeight(8)
      point(np.x, np.y)
      pop()
    }
  });
  if (!np) {
    np = snappedPoint = createVector(mouseX, mouseY);
  }
  return np;
}

function mouseReleased() {
  let p = snap ? snappedPoint : createVector(mouseX, mouseY)
  // First time click
  if (supArr.length == 0) {
    let arr = [];
    supArr.push(arr);
  }
  supArr[supArr.length - 1].push(p);
}

function keyReleased() {
  if (supArr.length == 0) {
    return;
  }

  // RETURN or ENTER to end shape
  if (keyCode === RETURN || keyCode === ENTER ) {
    let arr = [];
    supArr.push(arr);
    return false;
  }

  if (keyCode == 83) {
    snap = false;
  }
  if (keyCode == 85) {
    if (supArr[supArr.length - 1].length == 0) {
      supArr.pop()
    }
    supArr[supArr.length - 1].pop()
  }
  
  // E to export shapes
  if (keyCode === 69) {
    let str = '['
    supArr.forEach((arr) => {
      str = str + '['
      arr.forEach((p) => {
        str = str + '[' + p.x + ', ' + p.y + '],'
      })
      str = str.slice(0, -1) + '],'
    })
    str = str.slice(0, -3) + ']';
    let output = splitTokens(str, ']],')
    saveStrings(output, 'str.txt');
  }
}

// S to activate Snap mode
function keyPressed() {
  if (supArr.length != 0) {
    if (keyCode == 83) {
      snap = true;
    }
  }
}
