/**
 * @module commands
 * @returns line, circle, rect2p, pline, spline, bazier
 */
const commands = () => {
  return {};
};

/**
 * Draw continues line.
 */
commands.line = {
  name: "line",
  stages: 2,
  continuable: true,
  points: [],
  draw: IO.line.draw,
  addPoints: IO.line.addPoints,
  getShape: IO.line.getShape,
  modifiers: {
    ortho: true,
  },
};

/**
 * Draw continues joined line.
 */
commands.pline = {
  name: "pline",
  stages: 0,
  continuable: false,
  points: [],
  draw: IO.pline.draw,
  addPoints: IO.pline.addPoints,
  getShape: IO.pline.getShape,
  modifiers: {
    ortho: true,
  },
};

/**
 * Draw a rectangle by choosing 2 opposite corners.
 */
commands.rect2p = {
  name: "rect2p",
  stages: 2,
  continuable: false,
  points: [],
  draw: IO.rect2p.draw,
  addPoints: IO.rect2p.addPoints,
  getShape: IO.rect2p.getShape,
  modifiers: {},
};

/**
 * Draw a circle by choosing center point and radius.
 */
commands.circle = {
  name: "circle",
  stages: 2,
  continuable: false,
  points: [],
  draw: IO.circle.draw,
  addPoints: IO.circle.addPoints,
  getShape: IO.circle.getShape,
  modifiers: { ortho: true },
};

/**
 * Draw a spline through points
 */
commands.spline = {
  name: "spline",
  stages: 0,
  continuable: false,
  points: [],
  draw: IO.spline.draw,
  addPoints: IO.spline.addPoints,
  getShape: IO.spline.getShape,
  modifiers: {},
};

/**
 * Draw continues quadratic bezier curve
 */
commands.bezier2p = {
  name: "bezier2p",
  stages: 3,
  continuable: true,
  points: [],
  draw: IO.bezier2p.draw,
  addPoints: IO.bezier2p.addPoints,
  getShape: IO.bezier2p.getShape,
  modifiers: {},
};

commands.reset = function () {
  this.line.points = [];
  this.pline.points = [];
  this.spline.points = [];
  this.bezier2p.points = [];
  this.circle.points = [];
  this.rect2p.points = [];
};
