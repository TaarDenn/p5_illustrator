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

  if (snapMode) getCursur();

  runCommand();
  showDrawing();
}

function mouseReleased() {
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
  activeCommand?.addPoints(getCursur());
}

function runCommand() {
  activeCommand?.draw();
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

function deactiveCommands() {
  if (!activeCommand) return;
  if (activeCommand.stages === 0 && activeCommand.points.length > 0) {
    activeCommand.layer.push(activeCommand.getPoints());
  }
  activeCommand.points = [];
  acStageManger = [];
  activeCommand = null;
}

function getCursur() {
  if (!activeCommand) return;
  let p;
  if (gridMode) p = gridPoint();
  if (snapMode) p = nearestPoint();
  return { x: orthoY || p?.x || mouseX, y: orthoX || p?.y || mouseY };
}

function gridPoint() {
  let x = Math.floor(mouseX / gridSize + 0.5) * gridSize;
  let y = Math.floor(mouseY / gridSize + 0.5) * gridSize;
  showHelpers({ x, y });
  return { x, y };
}

function nearestPoint() {
  const nps = drawingPoints.filter(
    (p) => dist(p.x, p.y, mouseX, mouseY) < snapDist
  );

  if (nps.length == 0) return { x: mouseX, y: mouseY };

  const np = nps.reduce((a, b) =>
    fastDist(a.x, a.y, mouseX, mouseY) < fastDist(b.x, b.y, mouseX, mouseY)
      ? a
      : b
  );
  // Preventing from snapping on the last point
  if (
    activeCommand.points.length != 0 &&
    np.x == activeCommand.points[activeCommand.points.length - 1].x &&
    np.y == activeCommand.points[activeCommand.points.length - 1].y
  )
    return { x: mouseX, y: mouseY };

  showHelpers(np);
  return np;
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
  layers.circles.forEach((c) => IO.circle.show(c));
  layers.rects2p.forEach((r) => IO.rect2p.show(r));
  layers.lines.forEach((l) => IO.line.show(l));
  layers.polylines.forEach((p) => {
    IO.polyline.show(p);
  });
  layers.splines.forEach((s) => IO.spline.show(s));
  layers.beziers2p.forEach((b) => IO.bezier2p.show(b));
}

// AID
function showHelpers(sp) {
  push();
  stroke(0, 100, 100);
  strokeWeight(1);
  circle(sp.x, sp.y, 8);

  if (orthoX) {
    stroke(0, 0, 70, 30);
    line(sp.x, sp.y, sp.x, orthoX);
  }

  if (orthoY) {
    stroke(0, 0, 70, 30);
    line(sp.x, sp.y, orthoY, sp.y);
  }

  pop();
}

// Faster in comparison
function fastDist(x1, y1, x2, y2) {
  let dx = x2 - x1;
  let dy = y2 - y1;
  return dx * dx + dy * dy;
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
