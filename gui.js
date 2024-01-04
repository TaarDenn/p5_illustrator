function createGUI(
    QS,
    initCommand,
    undo,
    redo,
    handleFile,
    saveJpg,
    exportJson,
    setting,
    aids
  ) {
    QS.addButton("Line (Key: L)", () => initCommand("line"))
      .addButton("Polyline (Key: P)", () => initCommand("pline"))
      .addButton("Circle (Key: C)", () => initCommand("circle"))
      .addButton("Rectangle (Key: P)", () => initCommand("rect2p"))
      .addButton("Spline (Key: S)", () => initCommand("spline"))
      .addButton("Bezier (Key: B)", () => initCommand("bezier2p"))
      .addHTML("OrthoX", 'Hold "X" to draw horizontally')
      .hideTitle("OrthoX")
      .addHTML("OrthoY", 'Hold "Z" to draw vertically')
      .hideTitle("OrthoY")
      .addButton("Undo", undo)
      .addButton("Redo", redo)
      .addBoolean("Show Grid (Key: G)", aids.gridMode, (g) => {
        aids.gridMode = g;
        if (g) {
          aids.snapMode = false;
          QS.setValue("Use Magnet (Key: M)", false);
        }
      })
      .addRange(
        "Grid size",
        5,
        50,
        setting.gridSize,
        1,
        (r) => (setting.gridSize = r)
      )
      .addBoolean("Use Magnet (Key: M)", aids.snapMode, (s) => {
        aids.snapMode = s;
        if (s) {
          aids.gridMode = false;
          QS.setValue("Show Grid (Key: G)", false);
        }
      })
      .addRange(
        "Magnet distance",
        5,
        50,
        setting.snapDist,
        1,
        (r) => (setting.snapDist = r)
      )
      .addHTML(
        "magnet",
        "with use magnet, you are able to click on availbale points. (Circle centers, Rectangle corners, line end-points etc.)"
      )
      .hideTitle("magnet")
      .addButton("save JPG", saveJpg)
      .addButton("export as JSON", exportJson)
      .addFileChooser("use bg overlay", "choose", "image/jpeg, image/png", (f) =>
        handleFile(f)
      )
      .addBoolean("Show bg (Key: H)", aids.imagePreview, (i) => {
        aids.imagePreview = i;
      });
  }
  