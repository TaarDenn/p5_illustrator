function sketch(p) {
  let showInstruction = true;
  // Storing drawing data
  const layers = {
    line: [],
    pline: [],
    rect2p: [],
    circle: [],
    spline: [],
    bezier2p: [],
  };

  // I/O
  let activeCommand = null;
  let acStageManger = [];

  // History controller for redo/undo
  const undoHistory = [];
  const redoHistory = [];
  let activeRedoHistory = [];

  // Drawing Setting & aids
  const setting = {
    gridSize: 20,
    snapDist: 25,
  };

  const aids = {
    imagePreview: false,
    gridMode: false,
    snapMode: true,
    orthoX: null,
    orthoY: null,
  };

  let QS;
  let mag;
  let img;

  let background = [32, 12, 95];

  p.setup = function () {
    const cnv = p.createCanvas(
      innerWidth - 600 < 500 ? 500 : innerWidth - 600,
      innerHeight - 200 < 500 ? 500 : innerHeight - 200
    );

    cnv.mouseClicked(onClick);
    p.colorMode(p.HSB, 360, 100, 100, 100);
    p.strokeWeight(1);
    p.noFill();

    commands.reset();

    QS = QuickSettings.create(
      innerWidth - 290,
      100,
      "Paint5 GUI",
      document.getElementById("canvas")
    );

    createGUI(
      QS,
      initCommand,
      undo,
      redo,
      handleFile,
      saveJpg,
      exportJson,
      setting,
      aids
    );
  };

  p.draw = function () {
    p.background(background);

    if (showInstruction) drawInstruction(p);

    if (img && aids.imagePreview) {
      p.image(img, 0, 0, mag * img.width, mag * img.height);
      // for some reason, p.tint isn't work, so...
      p.background(...background, 50);
    }

    if (aids.gridMode || aids.snapMode) getCursor();
    if (aids.gridMode) showGrid();
    p.textSize(20);

    runCommand();
    showDrawing();
  };

  function onClick() {
    if (showInstruction) showInstruction = false;

    for (let i = 0; i < acStageManger.length; i++) {
      if (acStageManger[i] == false) {
        acStageManger[i] = true;
        activeCommand.addPoints(getCursor());
        activeRedoHistory = [];
        // If command ended
        if (i === acStageManger.length - 1) {
          layers[activeCommand.name].push(activeCommand.getShape());
          addToHistory();
          acStageManger = [];

          if (activeCommand.continuable) {
            initCommand(activeCommand.name);
            acStageManger[0] = true;
            activeCommand.points = [
              layers[activeCommand.name][layers[activeCommand.name].length - 1][
                activeCommand.stages - 1
              ],
            ];
          } else {
            p.cursor("auto");
            activeCommand.points = [];
            activeCommand = null;
          }
        }

        return;
      }
    }
    activeCommand?.addPoints(getCursor());
    activeRedoHistory = [];
  }

  p.keyPressed = function () {
    if (
      p.keyCode === 88 &&
      activeCommand?.modifiers.hasOwnProperty("ortho") &&
      !aids.orthoX
    ) {
      aids.orthoX = activeCommand.points[activeCommand.points.length - 1].y;
    }

    if (
      p.keyCode === 90 &&
      activeCommand?.modifiers.hasOwnProperty("ortho") &&
      !aids.orthoY
    ) {
      aids.orthoY = activeCommand.points[activeCommand.points.length - 1].x;
    }
  };

  p.keyReleased = function () {
    if (
      p.key !== "g" &&
      p.key !== "G" &&
      p.key !== "h" &&
      p.key !== "H" &&
      p.key !== "x" &&
      p.key !== "X" &&
      p.key !== "z" &&
      p.key !== "Z" &&
      p.key !== "m" &&
      p.key !== "M" &&
      p.key !== "u" &&
      p.key !== "U" &&
      p.key !== "y" &&
      p.key !== "Y"
    ) {
      deactiveCommands();
    }

    // commands
    if (p.key === "b" || p.key === "B") initCommand("bezier2p");
    if (p.key === "c" || p.key === "C") initCommand("circle");
    if (p.key === "l" || p.key === "L") initCommand("line");
    if (p.key === "p" || p.key === "P") initCommand("pline");
    if (p.key === "s" || p.key === "S") initCommand("spline");
    if (p.key === "r" || p.key === "R") initCommand("rect2p");

    // ortho activators
    if (p.key === "x" || p.key === "X") aids.orthoX = null;
    if (p.key === "z" || p.key === "Z") aids.orthoY = null;

    // G for activate/deactivate GridMode
    if (p.key === "g" || p.key === "G") toggleGridMode();

    // M for activate/deactivate SnapMode (magnet mode)
    if (p.key === "m" || p.key === "M") toggleSnapMode();

    // U for undo.
    if (p.key === "u" || p.key === "U") undo();

    // Y for redo
    if (p.key === "y" || p.key === "Y") redo();

    // H to Show/Hide overlayed img.
    if (p.key === "h" || p.key === "H") toggleImage();

    // E to export shapes.
    if (p.key === "e" || p.key === "E") exportJson();
  };

  function undo() {
    if (activeCommand) {
      if (activeCommand.points.length > 1) {
        if (activeCommand.stages !== 0) {
          acStageManger[activeCommand.points.length - 1] = false;
        }
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
          layers[commands[lastCommand].name][
            layers[commands[lastCommand].name].length - 1
          ],
      });

      layers[commands[lastCommand].name].pop();
      undoHistory.pop();
    }
  }

  function redo() {
    if (activeCommand && activeRedoHistory.length > 0) {
      activeCommand.points.push(
        activeRedoHistory[activeRedoHistory.length - 1]
      );
      activeRedoHistory.pop();
    }

    if (!activeCommand && redoHistory.length > 0) {
      const lastCommand = redoHistory[redoHistory.length - 1];
      layers[lastCommand.name].push(lastCommand.shape);
      undoHistory.push(lastCommand.name);
      redoHistory.pop();
    }
  }

  function runCommand() {
    activeCommand?.draw(p, getCursor());
  }

  function initCommand(_command) {
    if (activeCommand) deactiveCommands();
    p.cursor("crosshair");
    activeCommand = commands[_command];
    acStageManger = (() => {
      let stages = [];

      // no longer need following line, meybe removing in future
      let stagesTodo = activeCommand.stages - activeCommand.points.length;

      for (let i = 0; i < stagesTodo; i++) {
        stages.push(false);
      }

      return stages;
    })();
  }

  function deactiveCommands() {
    p.cursor("auto");

    if (!activeCommand) return;

    if (activeCommand.stages === 0 && activeCommand.points.length > 0) {
      layers[activeCommand.name].push(activeCommand.getShape());
      addToHistory();
    }

    activeCommand.points = [];
    acStageManger = [];
    activeCommand = null;
  }

  function toggleGridMode() {
    aids.gridMode = !aids.gridMode;
    QS.setValue("Show Grid (Key: G)", aids.gridMode);

    if (aids.gridMode) {
      aids.snapMode = false;
      QS.setValue("Use Magnet (Key: M)", false);
    }
  }

  // Snap mode: the other name of magnet mode
  function toggleSnapMode() {
    aids.snapMode = !aids.snapMode;
    QS.setValue("Use Magnet (Key: M)", aids.snapMode);

    if (aids.snapMode) {
      aids.gridMode = false;
      QS.setValue("Show Grid (Key: G)", false);
    }
  }

  function toggleImage() {
    // Because P5 does not support async,
    // just wait enough to load image for getting img.w and img.h
    const _ = setTimeout(() => {
      if (img) {
        mag =
          img.width / p.width > img.height / p.height
            ? p.width / img.width
            : p.height / img.height;
        aids.imagePreview = !aids.imagePreview;
        QS.setValue("Show bg (Key: H)", aids.imagePreview);
      }
    }, 100);
  }

  function exportJson() {
    const fileName = getFileName();
    const name = "drawing-" + fileName + ".json";

    p.saveJSON(layers, name);
  }

  function saveJpg() {
    const fileName = getFileName();
    const name = "drawing-" + fileName + ".jpg";

    p.saveCanvas(name);
  }

  function addToHistory() {
    if (undoHistory.length == 25) undoHistory.shift();
    undoHistory.push(activeCommand.name);
  }

  function getCursor() {
    if (!activeCommand) return;

    let point;
    if (aids.gridMode) point = gridPoint();
    if (aids.snapMode) point = nearestPoint();

    return {
      x: aids.orthoY || point?.x || p.mouseX,
      y: aids.orthoX || point?.y || p.mouseY,
    };
  }

  function gridPoint() {
    let x = Math.floor(p.mouseX / setting.gridSize + 0.5) * setting.gridSize;
    let y = Math.floor(p.mouseY / setting.gridSize + 0.5) * setting.gridSize;
    showHelpers({ x, y });

    return { x, y };
  }

  function getDrawingPoints() {
    let flattenPoints = [];
    const keys = Object.keys(layers);
    for (let key of keys) {
      layers[key].forEach((obj) => {
        const points = IO[key].getFlattenPoints(obj);
        flattenPoints = [...flattenPoints, ...points];
      });
    }
    return [...flattenPoints, ...activeCommand?.points];
  }

  function nearestPoint() {
    const nps = getDrawingPoints().filter(
      (point) => p.dist(point.x, point.y, p.mouseX, p.mouseY) < setting.snapDist
    );

    if (nps.length == 0) return { x: p.mouseX, y: p.mouseY };

    const np = nps.reduce((a, b) =>
      fastDist(a.x, a.y, p.mouseX, p.mouseY) <
      fastDist(b.x, b.y, p.mouseX, p.mouseY)
        ? a
        : b
    );

    // Preventing from snapping on the last point
    if (
      activeCommand.points.length != 0 &&
      np.x == activeCommand.points[activeCommand.points.length - 1].x &&
      np.y == activeCommand.points[activeCommand.points.length - 1].y
    ) {
      return { x: p.mouseX, y: p.mouseY };
    }

    showHelpers(np);
    return np;
  }

  function handleFile(file) {
    if (file.type === "image/jpeg" || file.type === "image/png") {
      const urlCreator = window.URL || window.webkitURL;
      const url = urlCreator.createObjectURL(file);
      img = p.createImg(url, "");
      img.hide();
      aids.imagePreview = false;
      toggleImage();
    } else {
      img = null;
    }
  }

  function showDrawing() {
    const keys = Object.keys(layers);
    for (let key of keys) {
      layers[key].forEach((obj) => IO[key].show(p, obj));
    }
  }

  // AID
  function showHelpers(sp) {
    p.push();
    p.stroke(0, 100, 100);
    p.strokeWeight(1);
    p.circle(sp.x, sp.y, 8);

    if (aids.orthoX) {
      p.line(sp.x, sp.y, sp.x, aids.orthoX);
    }

    if (aids.orthoY) {
      p.line(sp.x, sp.y, aids.orthoY, sp.y);
    }

    p.pop();
  }

  function showGrid() {
    p.push();
    p.stroke(0, 0, 30);

    for (let i = 0; i < p.width; i = i + setting.gridSize) {
      for (let j = 0; j < p.height; j = j + setting.gridSize) {
        p.point(i, j);
      }
    }

    p.pop();
  }

  function drawInstruction(p) {
    p.push();
    p.fill(0, 0, 0);
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(12);
    p.textLeading(26);
    p.text(
      "Select a tool from right toolbar (or using keyboard shortcut)" +
        "\n" +
        "and click to draw." +
        "\n" +
        "Press 'Enter/Retrun' to exit current drawing tool." +
        "\n" +
        "Press 'CMD/CTRL + R' to clear the canvas." +
        "\n" +
        "Press 'cmnd/ctrl + R' to clear the canvas." +
        "\n" +
        "to change canvas size: resize browser and reload.",
      p.width * 0.5,
      p.height * 0.5
    );
    p.pop();
  }
}

new p5(sketch);
