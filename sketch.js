// Author: taardenn
// Twitter: @taardenn
// Instagram: @taardenn
// Reddit: u/taardenn

p5.disableFriendlyErrors = true;

// I/O
let activeCommand = null;
let acStageManger = [];
let drawingPoints = [];
let inp;
let img;

// Drawing Setting
let snapDist = 25;
let snapMode = false;
let gridSize = 20;
let gridMode = false;
let imagePriview = false;
let orthoX = null;
let orthoY = null;

function setup() {
  createCanvas(400, 400);
  colorMode(HSB, 360, 100, 100, 100);
  strokeWeight(1);
  noFill();

  inp = createFileInput(handleFile);
  inp.position(0, 0);
}

function draw() {
  if (img && imagePriview) image(img, 0, 0, width, height);

  background(32, 5, 95, 50);

  if (gridMode) {
    getCursur();
    showGrid();
  }

  // if (snapMode) getCursur();

  runCommand();
  showDrawing();
}

function handleFile(file) {
  if (file.type === "image") {
    img = createImg(file.data, "");
    img.hide();
  } else {
    img = null;
  }
}

function showDrawing() {
  layers.circles.forEach((c) => circle(c.x, c.y, c.d));
  layers.rects2p.forEach((r) => rect(r.x, r.y, r.w, r.h));
  layers.lines.forEach((l) => line(l[0].x, l[0].y, l[1].x, l[1].y));
  layers.polylines.forEach((p) => {
    for (let i = 0; i < p.length - 1; i++) {
      line(p[i].x, p[i].y, p[i + 1].x, p[i + 1].y);
    }
  });
}

function mouseReleased() {
  if (activeCommand) {
    for (let i = 0; i < acStageManger.length; i++) {
      if (acStageManger[i] == false) {
        acStageManger[i] = true;
        activeCommand.addPoints(getCursur());
        if (i === acStageManger.length - 1) {
          activeCommand.layer.push(activeCommand.getPoints());
          acStageManger = [];
          if (activeCommand.continuable) {
            activeCommand.points = [
              activeCommand.layer[activeCommand.layer.length - 1][1],
            ];
            initCommand(activeCommand.name);
          } else {
            activeCommand.points = [];
            activeCommand = null;
          }
        }
        return;
      }
    }
    activeCommand.addPoints(getCursur());
  }
}

function initCommand(_command) {
  activeCommand = commands[_command];
  acStageManger = (() => {
    let stages = [];
    let stagesTodo = activeCommand.stages - activeCommand.points.length;
    for (let i = 0; i < stagesTodo; i++) {
      stages.push(false);
    }
    return stages;
  })();
}

function keyPressed() {
  if (keyCode === 88 && activePoint.hasOwnProperty("ortho") && !orthoX)
    orthoX = mouseY;
  if (keyCode === 90 && activePoint.hasOwnProperty("ortho") && !orthoY)
    orthoY = mouseX;
}

function keyReleased() {
  if (
    keyCode != 83 &&
    keyCode != 73 &&
    keyCode != 68 &&
    keyCode != 71 &&
    keyCode != 88 &&
    keyCode != 90
  ) {
    deactiveCommands();
  }

  // C for Line
  if (keyCode == 67) initCommand("circle");

  // L for Line
  if (keyCode == 76) initCommand("line");

  // P for Polyline
  if (keyCode == 80) initCommand("polyline");

  // R for 2Point Rectangle
  if (keyCode == 82) initCommand("rect2p");

  // OrhoMode
  if (keyCode === 88) orthoX = null;
  if (keyCode === 90) orthoY = null;

  // G for activate/deactivate GridMode
  if (keyCode == 71) {
    gridMode = !gridMode;
    if (gridMode) snapMode = false;
  }

  // S for activate/deactivate SnapMode
  if (keyCode == 83) {
    snapMode = !snapMode;
    if (snapMode) gridMode = false;
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
  if (keyCode == 73) imagePriview = !imagePriview;

  // Press "D" to close the current shape.
  if (keyCode == 68) {
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

function runCommand() {
  if (activeCommand) activeCommand.draw();
}

function deactiveCommands() {
  if (activeCommand) {
    if (activeCommand.stages === 0) {
      activeCommand.layer.push(activeCommand.points);
    }
    activeCommand.points = [];
    acStageManger = [];
    activeCommand = null;
  }
}

function getCursur() {
  if (activeCommand) {
    if (gridMode) return gridPoint();
    if (snapMode) return nearestPoint();
    return { x: mouseX, y: mouseY };
  }
}

function gridPoint() {
  let x = Math.floor(mouseX / gridSize + 0.5) * gridSize;
  let y = Math.floor(mouseY / gridSize + 0.5) * gridSize;
  showSnappedPoint({ x, y });
  return { x, y };
}

function nearestPoint() {
  const nps = drawingPoints.filter(
    (p) => dist(p.x, p.y, mouseX, mouseY) < snapDist
  );

  if (nps.length == 0) return { x: mouseX, y: mouseY };

  const np = nps.reduce((a, b) =>
    dist(a.x, a.y, mouseX, mouseY) < dist(b.x, b.y, mouseX, mouseY) ? a : b
  );

  // preventing from snapping on the last point
  if (
    activeCommand.points.length != 0 &&
    np.x == activeCommand.points[activeCommand.points.length - 1].x &&
    np.y == activeCommand.points[activeCommand.points.length - 1].y
  )
    return { x: mouseX, y: mouseY };

  showSnappedPoint(np);
  return np;
}

// AID
function showSnappedPoint(sp) {
  push();
  stroke([0, 100, 100]);
  strokeWeight(1);
  circle(sp.x, sp.y, 8);
  pop();
}

function showGrid() {
  push();
  stroke(0, 0, 30);
  for (let i = 0; i < width; i = i + gridSize) {
    for (let j = 0; j < height; j = j + gridSize) {
      point(i, j);
    }
  }
  pop();
}
