function keyPressed() {
  if (
    keyCode === 88 &&
    activeCommand?.modifiers.hasOwnProperty("ortho") &&
    !orthoX
  )
    orthoX = activeCommand.points[activeCommand.points.length - 1].y;
  if (
    keyCode === 90 &&
    activeCommand?.modifiers.hasOwnProperty("ortho") &&
    !orthoY
  )
    orthoY = activeCommand.points[activeCommand.points.length - 1].x;
}

function keyReleased() {
  if (
    key !== "g" &&
    key !== "G" &&
    key !== "h" &&
    key !== "H" &&
    key !== "x" &&
    key !== "X" &&
    key !== "z" &&
    key !== "Z" &&
    key !== "m" &&
    key !== "M"
  ) {
    deactiveCommands();
  }

  if (key === "b" || key === "B") initCommand("bezier2p");
  if (key === "c" || key === "C") initCommand("circle");
  if (key === "l" || key === "L") initCommand("line");
  if (key === "p" || key === "P") initCommand("polyline");
  if (key === "s" || key === "S") initCommand("spline");
  if (key === "r" || key === "R") initCommand("rect2p");

  if (key === "x" || key === "X") orthoX = null;
  if (key === "z" || key === "Z") orthoY = null;

  // G for activate/deactivate GridMode
  if (key === "g" || key === "G") {
    gridMode = !gridMode;
    if (gridMode) snapMode = false;
  }

  // Mac CMD or Windows Ctrl for activate/deactivate SnapMode
  if (key === "m" || key === "M") {
    snapMode = !snapMode;
    if (snapMode) gridMode = false;
  }

  // U for undo.
  if (key === "u" || key === "U") {
    if (drawing.length == 1 && drawing[0].length == 0) return;
    if (drawing[drawing.length - 1].length == 0) {
      drawing.pop();
    }
    drawing[drawing.length - 1].pop();
  }

  // H to Show/Hide overlayed img.
  if (key === "h" || key === "H") imagePriview = !imagePriview;

  // Q to close the current shape.
  if (key === "q" || key === "Q") {
    // drawing[drawing.length - 1].push(drawing[drawing.length - 1][0]);
    // drawing.push([]);
  }

  // Press "E" to export shapes.
  if (key === "e" || key === "E") {
    let json = {
      lines: layers.lines,
      rect2ps: layers.rect2ps,
      circles: layers.circles,
      polylines: layers.polylines,
      splines: layers.splines,
    };
    const name = "drawing-" + new Date() + ".json";
    saveJSON(json, name);
  }
}
