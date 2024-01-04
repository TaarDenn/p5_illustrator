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
  function draw(p, ep) {
    if (this.points.length == 0) return;
    let sp = this.points[0];
    p.line(sp.x, sp.y, ep.x, ep.y);
  }

  function addPoints(_p) {
    this.points.push(_p);
  }

  function getShape() {
    return this.points;
  }

  function getFlattenPoints(l) {
    return l;
  }

  function show(p, l) {
    p.line(l[0].x, l[0].y, l[1].x, l[1].y);
  }

  return { draw, addPoints, getShape, getFlattenPoints, show };
})();

/**
 *
 */
IO.circle = (() => {
  function draw(p, ep) {
    if (this.points.length == 0) return;
    let cp = this.points[0];
    let r = dist(cp.x, cp.y, ep.x, ep.y);
    p.circle(cp.x, cp.y, r * 2);
    p.push();
    p.stroke(0, 100, 100);
    p.line(cp.x, cp.y, ep.x, ep.y);
    p.pop();
  }

  function addPoints(_p) {
    this.points.push(_p);
  }

  function getShape() {
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

  function getFlattenPoints(c) {
    return [{ x: c.x, y: c.y }];
  }

  function show(p, c) {
    p.circle(c.x, c.y, c.d);
  }

  return { draw, addPoints, getShape, getFlattenPoints, show };
})();

/**
 *
 */
IO.rect2p = (() => {
  function draw(p, ep) {
    if (this.points.length == 0) return;
    let sp = this.points[0];
    p.rect(sp.x, sp.y, ep.x - sp.x, ep.y - sp.y);
  }

  function addPoints(_p) {
    this.points.push(_p);
  }

  function getShape() {
    return {
      x: this.points[0].x,
      y: this.points[0].y,
      w: this.points[1].x - this.points[0].x,
      h: this.points[1].y - this.points[0].y,
    };
  }

  function getFlattenPoints(r) {
    return [
      { x: r.x, y: r.y },
      { x: r.x + r.w, y: r.y },
      { x: r.x + r.w, y: r.y + r.h },
      { x: r.x, y: r.y + r.h },
    ];
  }

  function show(p, r) {
    p.rect(r.x, r.y, r.w, r.h);
  }

  return { draw, addPoints, getShape, getFlattenPoints, show };
})();

/**
 *
 */
IO.pline = (() => {
  function draw(p, ep) {
    if (this.points.length == 0) return;
    for (let i = 0; i < this.points.length - 1; i++) {
      // line() is about 2x faster than beginShape()
      p.line(
        this.points[i].x,
        this.points[i].y,
        this.points[i + 1].x,
        this.points[i + 1].y
      );
    }

    p.line(
      this.points[this.points.length - 1].x,
      this.points[this.points.length - 1].y,
      ep.x,
      ep.y
    );
  }

  function addPoints(_p) {
    this.points.push(_p);
  }

  function getShape() {
    return this.points;
  }

  function getFlattenPoints(pl) {
    return pl;
  }

  function show(p, pl) {
    for (let i = 0; i < pl.length - 1; i++) {
      p.line(pl[i].x, pl[i].y, pl[i + 1].x, pl[i + 1].y);
    }
  }

  return { draw, addPoints, getShape, getFlattenPoints, show };
})();

/**
 *
 */
IO.spline = (() => {
  function draw(p, ep) {
    if (this.points.length == 0) return;
    p.beginShape();
    p.curveVertex(this.points[0].x, this.points[0].y);
    for (let i = 0; i < this.points.length; i++) {
      p.curveVertex(this.points[i].x, this.points[i].y);
    }
    p.curveVertex(ep.x, ep.y);
    p.curveVertex(ep.x, ep.y);
    p.endShape();

    p.push();
    p.stroke(0, 100, 100);
    this.points.forEach((_p) => {
      p.circle(_p.x, _p.y, 8);
    });
    p.pop();
  }

  function addPoints(_p) {
    this.points.push(_p);
  }

  function getShape() {
    return this.points;
  }

  function getFlattenPoints(spl) {
    return spl;
  }

  function show(p, spl) {
    p.beginShape();
    p.curveVertex(spl[0].x, spl[0].y);
    for (let i = 0; i < spl.length; i++) {
      p.curveVertex(spl[i].x, spl[i].y);
    }
    p.curveVertex(spl[spl.length - 1].x, spl[spl.length - 1].y);
    p.endShape();
  }

  return { draw, addPoints, getShape, getFlattenPoints, show };
})();

/**
 *
 */
IO.bezier2p = (() => {
  function draw(p, ep) {
    if (this.points.length == 0) return;

    p.beginShape();
    p.vertex(this.points[0].x, this.points[0].y);

    if (this.points.length > 1) {
      for (let i = 1; i < this.points.length; i = i + 2) {
        p.quadraticVertex(
          this.points[i].x,
          this.points[i].y,
          this.points[i + 1]?.x || ep.x,
          this.points[i + 1]?.y || ep.y
        );
      }
    }

    p.vertex(ep.x, ep.y);
    p.endShape();
  }

  function addPoints(_p) {
    this.points.push(_p);
  }

  function getShape() {
    if (this.points.length % 2 == 0) this.points.pop();
    return this.points;
  }

  function getFlattenPoints(b) {
    return [b[0], b[2]];
  }

  function show(p, b) {
    p.beginShape();
    p.vertex(b[0].x, b[0].y);
    for (let i = 1; i < b.length; i = i + 2) {
      p.quadraticVertex(b[i].x, b[i].y, b[i + 1].x, b[i + 1].y);
    }
    p.endShape();
  }

  return { draw, addPoints, getShape, getFlattenPoints, show };
})();
