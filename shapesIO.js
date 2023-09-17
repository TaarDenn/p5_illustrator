/**
 * 
 */
const lineIO = (() => {
  function draw() {
    if (this.points.length == 1) {
      let sp = this.points[0];
      let p = getCursur();
      line(sp.x, sp.y, p.x, p.y);
    }
  }

  function addPoints(_p) {
    this.points.push(_p);
    addToflattenDrawing(_p);
  }

  function getPoints() {
    return this.points;
  }

  return { draw, addPoints, getPoints };
})();

/**
 *
 */
const circleIO = (() => {
  function draw() {
    if (this.points.length > 0) {
      let cp = this.points[0];
      let p = getCursur();
      let r = dist(cp.x, cp.y, p.x, p.y);
      circle(cp.x, cp.y, r * 2);
      line(cp.x, cp.y, p.x, p.y);
    }
  }

  function addPoints(_p) {
    this.points.push(_p);
    if (this.points.length == 1) {
      addToflattenDrawing(_p);
    }
  }

  function getPoints() {
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
  }
  return { draw, addPoints, getPoints };
})();

/**
 *
 */
const rectIO = (() => {
  function draw() {
    if (this.points.length == 1) {
      let sp = this.points[0];
      let p = getCursur(mouseX, mouseY);
      rect(sp.x, sp.y, p.x - sp.x, p.y - sp.y);
    }
  }

  function addPoints(_p) {
    this.points.push(_p);

    if (this.points.length == 2) {
      let allPoints = [
        this.points[0],
        this.points[1],
        { x: this.points[0].x, y: this.points[1].y },
        { x: this.points[1].x, y: this.points[0].y },
      ];

      allPoints.forEach((p) => {
        addToflattenDrawing(p);
      });
    }
  }

  function getPoints() {
    return {
      x: this.points[0].x,
      y: this.points[0].y,
      w: this.points[1].x - this.points[0].x,
      h: this.points[1].y - this.points[0].y,
    };
  }

  return { draw, addPoints, getPoints };
})();

/**
 *
 */
const polylineIO = (() => {
  function draw() {
    if (this.points.length > 0) {
      for (let i = 0; i < this.points.length - 1; i++) {
        // line() is about 2x faster than beginShape()
        line(
          this.points[i].x,
          this.points[i].y,
          this.points[i + 1].x,
          this.points[i + 1].y
        );
      }

      let p = getCursur();
      line(
        this.points[commands.polyline.points.length - 1].x,
        this.points[commands.polyline.points.length - 1].y,
        p.x,
        p.y
      );
    }
  }

  function addPoints(_p) {
    this.points.push(_p);
    addToflattenDrawing(_p);
  }

  function getPoints() {
    return this.points;
  }

  return { draw, addPoints, getPoints };
})();

/**
 * Add a snappale point to the flattened array of 
 * exiditng drawing points.
 * @param {{x: number,y: number}} point
 */
function addToflattenDrawing(point) {
  if (
    !drawingPoints.find((dp) => {
        point.x == dp.x && point.y == dp.y;
    })
  ) {
    drawingPoints.push(point);
  }
}
