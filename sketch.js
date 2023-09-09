// Author: taardenn
// Twitter: @taardenn
// Instagram: @taardenn
// Reddit: u/taardenn

let drawing = [];
let snapDist = 25;
let activePoint;

let snap = false;
let imagePriview = true;
// TODO
// let orthoX = false;
// let orthoY = false;

let input;
let img;

function setup() {
  createCanvas(400, 400);
  colorMode(HSB, 360, 100, 100, 100);
  strokeWeight(2);
  noFill();

  // Init
  input = createFileInput(handleFile);
  input.position(0, 0);
  drawing.push([]);
}

function draw() {
  if (img && imagePriview) {
    image(img, 0, 0, width, height);
  }

  background(32, 5, 95, 50);

  activePoint = snap ? nearestPoint(snapDist) : new P(mouseX, mouseY);
  drawLines();
}

function handleFile(file) {
  if (file.type === "image") {
    img = createImg(file.data, "");
    img.hide();
  } else {
    img = null;
  }
  // Fixing the out of boundry clicking
  drawing.pop();
  drawing.push([]);
}

function drawLines() {
  if (drawing.length != 0) {
    drawing.forEach((shape) => {
      for (let i = 0; i < shape.length - 1; i++) {
        line(shape[i].x, shape[i].y, shape[i + 1].x, shape[i + 1].y);
      }
    });

    let shape = drawing[drawing.length - 1];
    if (shape.length != 0) {
      line(
        shape[shape.length - 1].x,
        shape[shape.length - 1].y,
        activePoint.x,
        activePoint.y
      );
    }
  }
}

function nearestPoint(_maxDist) {
  const nps = drawing
    .flat()
    .filter((p) => dist(p.x, p.y, mouseX, mouseY) < _maxDist);
  if (nps.length == 0) return new P(mouseX, mouseY);

  const np = nps.reduce((a, b) =>
    dist(a.x, a.y, mouseX, mouseY) < dist(b.x, b.y, mouseX, mouseY) ? a : b
  );

  // preventing from snapping on the last point
  if (
    drawing[drawing.length - 1].length != 0 &&
    np.x ==
      drawing[drawing.length - 1][drawing[drawing.length - 1].length - 1].x &&
    np.y ==
      drawing[drawing.length - 1][drawing[drawing.length - 1].length - 1].y
  )
    return new P(mouseX, mouseY);

  // Styling snapped point
  push();
  stroke([0, 100, 100]);
  strokeWeight(1);
  circle(np.x, np.y, 8);
  pop();

  return np;
}

function mouseReleased() {
  drawing[drawing.length - 1].push(activePoint);
}

function keyReleased() {
  // Press RETURN or ENTER to end shape
  if (keyCode === RETURN || keyCode === ENTER) {
    let arr = [];
    drawing.push(arr);
    return;
  }

  // Deactivete snap mode by releasing "S"
  if (keyCode == 83) {
    snap = false;
  }

  // Press "U" to undo.
  if (keyCode == 85) {
    if (drawing.length == 1 && drawing[0].length == 0) return;
    if (drawing[drawing.length - 1].length == 0) {
      drawing.pop();
    }
    drawing[drawing.length - 1].pop();
  }

  // Show/Hide overlayed img.
  if (keyCode == 73) {
    imagePriview = !imagePriview;
  }

  // Press "C" to close the current shape.
  if (keyCode == 67) {
    drawing[drawing.length - 1].push(drawing[drawing.length - 1][0]);
    drawing.push([]);
  }

  // Press "E" to export shapes.
  if (keyCode === 69) {
    if (drawing[drawing.length - 1].length == 0) {
      drawing.pop();
    }

    let str = { shape: drawing };
    const name = "drawing-" + new Date();
    const writer = createWriter(`${name}.json`);
    writer.print(JSON.stringify(str));
    writer.close();
    writer.clear();
  }
}

function keyPressed() {  
  // Hold "S" to activate Snap mode.
  if (keyCode == 83) snap = true;

  //TODO
  // Press "X" to activate Orthographic-x.
  // if (keyCode == 88) {
  // }

  // Press "Z" to activate Orthographic-y.
  // if (keyCode == 90) {
  // }
}

// Using simple (x,y) obj insetad of createVector for better performance.
class P {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}
