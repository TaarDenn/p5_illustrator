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
    key !== "M" &&
    key !== "u" &&
    key !== "U" &&
    key !== "y" &&
    key !== "Y"
  ) {
    deactiveCommands();
  }

  if (key === "b" || key === "B") initCommand("bezier2p");
  if (key === "c" || key === "C") initCommand("circle");
  if (key === "l" || key === "L") initCommand("line");
  if (key === "p" || key === "P") initCommand("pline");
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
    if (activeCommand) {
      if (activeCommand.points.length > 1) {
        console.log(activeCommand.points);
        activeRedoHistory.push(
          activeCommand.points[activeCommand.points.length - 1]
        );
        activeCommand.points.pop();
      } else {
        activeRedoHistory = [];
        deactiveCommands();
        return;
      }
    }
    if (!activeCommand && undoHistory.length > 0) {
      const lastCommand = undoHistory[undoHistory.length - 1];
      redoHistory.push({
        name: lastCommand,
        shape:
          commands[lastCommand].layer[commands[lastCommand].layer.length - 1],
      });
      commands[lastCommand].layer.pop();
      undoHistory.pop();
    }
  }

  // Y for redo
  if (key === "y" || key === "Y") {
    if (activeCommand && activeRedoHistory.length > 0) {
      activeCommand.points.push(
        activeRedoHistory[activeRedoHistory.length - 1]
      );
      activeRedoHistory.pop();
    }

    if (!activeCommand && redoHistory.length > 0) {
      const lastCommand = redoHistory[redoHistory.length - 1];
      commands[lastCommand.name].layer.push(lastCommand.shape);
      undoHistory.push(lastCommand.name);
      redoHistory.pop();
    }
  }

  // H to Show/Hide overlayed img.
  if (key === "h" || key === "H") imagePriview = !imagePriview;

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
