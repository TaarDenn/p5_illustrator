const commands = () => {
  return {};
};

commands.line = {
  name: "line",
  draw: drawLine,
  layer: layers.lines,
  stages: 2,
  continuable: true,
  points: [],
  addPoints(_p) {
    this.points.push(_p);
    if (this.points.length == 2) {
      this.points.forEach((p) => {
        if (
          !drawingPoints.find((dp) => {
            p.x == dp.x && p.y == dp.y;
          })
        ) {
          drawingPoints.push(p);
        }
      });
    }
  },

  getPoints: function () {
    return this.points;
  },
  shift: null,
  ortho: true,
};

commands.polyline = {
  name: "polyline",
  draw: drawPolyline,
  layer: layers.polylines,
  stages: 0,
  continuable: false,
  points: [],
  addPoints(_p) {
    if (
      !drawingPoints.find((dp) => {
        _p.x == dp.x && _p.y == dp.y;
      })
    ) {
      drawingPoints.push(_p);
    }
    this.points.push(_p);
  },
  getPoints: function () {
    return this.points;
  },
  shift: null,
  ortho: true,
};

commands.rect2p = {
  name: "rect2p",
  draw: drawRect,
  layer: layers.rects2p,
  stages: 2,
  continuable: false,
  points: [],
  addPoints(_p) {
    this.points.push(_p);

    if (this.points.length == 2) {
      let allPoints = [
        this.points[0],
        { x: this.points[0].x, y: this.points[1].y },
        { x: this.points[1].x, y: this.points[0].y },
        _p,
      ];
      allPoints.forEach((p) => {
        if (
          !drawingPoints.find((dp) => {
            p.x == dp.x && p.y == dp.y;
          })
        ) {
          drawingPoints.push(p);
        }
      });
    }
  },
  getPoints() {
    return {
      x: this.points[0].x,
      y: this.points[0].y,
      w: this.points[1].x - this.points[0].x,
      h: this.points[1].y - this.points[0].y,
    };
  },
  shift: null,
};

commands.circle = {
  name: "circle",
  draw: drawCircle,
  layer: layers.circles,
  stages: 2,
  continuable: false,
  points: [],
  addPoints(_p) {
    if (this.points.length == 0) {
      if (
        !drawingPoints.find((dp) => {
          _p.x == dp.x && _p.y == dp.y;
        })
      ) {
        drawingPoints.push(_p);
      }
    }
    this.points.push(_p);
  },
  getPoints() {
    return {
      x: this.points[0].x,
      y: this.points[0].y,
      d:
        2 *
        dist(
          this.points[0].x,
          this.points[0].y,
          this.points[1].x,
          this.points[1].y
        ),
    };
  },
};

function drawCircle() {
  if (commands.circle.points.length > 0) {
    let p = getCursur();
    let r = dist(
      commands.circle.points[0].x,
      commands.circle.points[0].y,
      p.x,
      p.y
    );
    circle(commands.circle.points[0].x, commands.circle.points[0].y, r * 2);
    line(commands.circle.points[0].x, commands.circle.points[0].y, p.x, p.y);
  }
}

function drawRect() {
  if (commands.rect2p.points.length == 1) {
    let sp = commands.rect2p.points[0];
    let p = getCursur(mouseX, mouseY);
    rect(sp.x, sp.y, p.x - sp.x, p.y - sp.y);
  }
}

function drawLine() {
  if (commands.line.points.length == 1) {
    let p = getCursur();
    line(commands.line.points[0].x, commands.line.points[0].y, p.x, p.y);
  }
}

function drawPolyline() {
  if (commands.polyline.points.length > 0) {
    for (let i = 0; i < commands.polyline.points.length - 1; i++)
      // line() is about 2x faster than beginShape()
      line(
        commands.polyline.points[i].x,
        commands.polyline.points[i].y,
        commands.polyline.points[i + 1].x,
        commands.polyline.points[i + 1].y
      );
    let p = getCursur();
    line(
      commands.polyline.points[commands.polyline.points.length - 1].x,
      commands.polyline.points[commands.polyline.points.length - 1].y,
      p.x,
      p.y
    );
  }
}
