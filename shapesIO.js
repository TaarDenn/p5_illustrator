/**
 * @module IO
 * @returns IO.line, IO.circle, IO.rect2p, IO.polyline, IO.spline
 */
const IO = () => {
  return {};
};

/**
 *
 */
IO.line = (() => {
  function draw() {
    if (this.points.length == 0) return;
    let sp = this.points[0];
    let ep = getCursur();
    line(sp.x, sp.y, ep.x, ep.y);
  }

  function addPoints(_p) {
    this.points.push(_p);
    addToflattenDrawing(_p);
  }

  function getPoints() {
    return this.points;
  }

  function show(l) {
    line(l[0].x, l[0].y, l[1].x, l[1].y);
  }

  return { draw, addPoints, getPoints, show };
})();

/**
 *
 */
IO.circle = (() => {
  function draw() {
    if (this.points.length == 0) return;
    let cp = this.points[0];
    let ep = getCursur();
    let r = dist(cp.x, cp.y, ep.x, ep.y);
    circle(cp.x, cp.y, r * 2);
    push();
    stroke(0, 0, 70, 30);
    line(cp.x, cp.y, ep.x, ep.y);
    pop();
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
  function show(c) {
    circle(c.x, c.y, c.d);
  }
  return { draw, addPoints, getPoints, show };
})();

/**
 *
 */
IO.rect2p = (() => {
  function draw() {
    if (this.points.length == 0) return;
    let sp = this.points[0];
    let ep = getCursur();
    rect(sp.x, sp.y, ep.x - sp.x, ep.y - sp.y);
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

  function show(rect2p) {
    rect(rect2p.x, rect2p.y, rect2p.w, rect2p.h);
  }
  return { draw, addPoints, getPoints, show };
})();

/**
 *
 */
IO.pline = (() => {
  function draw() {
    if (this.points.length == 0) return;
    for (let i = 0; i < this.points.length - 1; i++) {
      // line() is about 2x faster than beginShape()
      line(
        this.points[i].x,
        this.points[i].y,
        this.points[i + 1].x,
        this.points[i + 1].y
      );
    }

    let ep = getCursur();
    line(
      this.points[commands.pline.points.length - 1].x,
      this.points[commands.pline.points.length - 1].y,
      ep.x,
      ep.y
    );
  }

  function addPoints(_p) {
    this.points.push(_p);
    addToflattenDrawing(_p);
  }

  function getPoints() {
    return this.points;
  }

  function show(pline) {
    for (let i = 0; i < pline.length - 1; i++) {
      line(pline[i].x, pline[i].y, pline[i + 1].x, pline[i + 1].y);
    }
  }
  return { draw, addPoints, getPoints, show };
})();

/**
 *
 */
IO.spline = (() => {
  function draw() {
    if (this.points.length == 0) return;
    beginShape();
    curveVertex(this.points[0].x, this.points[0].y);
    for (let i = 0; i < this.points.length; i++) {
      curveVertex(this.points[i].x, this.points[i].y);
    }
    let ep = getCursur();
    curveVertex(ep.x, ep.y);
    curveVertex(ep.x, ep.y);
    endShape();

    push();
    stroke(0, 100, 100);
    this.points.forEach((p) => {
      circle(p.x, p.y, 8);
    });
    pop();
  }

  function addPoints(_p) {
    this.points.push(_p);
    if (this.points.length == 1) {
      addToflattenDrawing(_p);
    }
  }

  function getPoints() {
    addToflattenDrawing(this.points[this.points.length - 1]);
    return this.points;
  }

  function show(spline) {
    beginShape();
    curveVertex(spline[0].x, spline[0].y);
    for (let i = 0; i < spline.length; i++) {
      curveVertex(spline[i].x, spline[i].y);
    }
    curveVertex(spline[spline.length - 1].x, spline[spline.length - 1].y);
    endShape();
  }

  return { draw, addPoints, getPoints, show };
})();

/**
 *
 */
IO.bezier2p = (() => {
  function draw() {
    if (this.points.length == 0) return;

    beginShape();
    vertex(this.points[0].x, this.points[0].y);
    if (this.points.length > 1) {
      for (let i = 1; i < this.points.length; i = i + 2) {
        quadraticVertex(
          this.points[i].x,
          this.points[i].y,
          this.points[i + 1]?.x || mouseX,
          this.points[i + 1]?.y || mouseY
        );
      }
    }
    let ep = getCursur();
    vertex(ep.x, ep.y);
    endShape();
  }

  function addPoints(_p) {
    this.points.push(_p);
    if (this.points.length == 1) {
      addToflattenDrawing(_p);
    }
  }

  function getPoints() {
    if (this.points.length % 2 == 0) {
      this.points.pop();
    }
    addToflattenDrawing(this.points[this.points.length - 1]);
    return this.points;
  }

  function show(bezier2p) {
    beginShape();
    vertex(bezier2p[0].x, bezier2p[0].y);
    for (let i = 1; i < bezier2p.length; i = i + 2) {
      quadraticVertex(
        bezier2p[i].x,
        bezier2p[i].y,
        bezier2p[i + 1].x,
        bezier2p[i + 1].y
      );
    }
    endShape();
  }

  return { draw, addPoints, getPoints, show };
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
