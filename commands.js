/**
 * @module commands
 * @returns line, circle, rect2p, polyline, spline, bazier
 */
const commands = () => {
  return {};
};

/**
 * Draw continues line.
 */
commands.line = {
  name: "line",
  layer: layers.lines,
  stages: 2,
  continuable: true,
  points: [],
  draw: IO.line.draw,
  addPoints: IO.line.addPoints,
  getPoints: IO.line.getPoints,
  modifiers: {
    ortho: true,
  },
};

/**
 * Draw continues joined line.
 */
commands.polyline = {
  name: "polyline",
  layer: layers.polylines,
  stages: 0,
  continuable: false,
  points: [],
  draw: IO.polyline.draw,
  addPoints: IO.polyline.addPoints,
  getPoints: IO.polyline.getPoints,
  modifiers: {
    ortho: true,
  },
};

/**
 * Draw a rectangle by choosing 2 opposite corners.
 */
commands.rect2p = {
  name: "rect2p",
  layer: layers.rects2p,
  stages: 2,
  continuable: false,
  points: [],
  draw: IO.rect2p.draw,
  addPoints: IO.rect2p.addPoints,
  getPoints: IO.rect2p.getPoints,
  modifiers: {},
};

/**
 * Draw a circle by choosing center point and radius.
 */
commands.circle = {
  name: "circle",
  layer: layers.circles,
  stages: 2,
  continuable: false,
  points: [],
  draw: IO.circle.draw,
  addPoints: IO.circle.addPoints,
  getPoints: IO.circle.getPoints,
  modifiers: {},
};

/**
 * Draw a spline through points
 */
commands.spline = {
  name: "spline",
  layer: layers.splines,
  stages: 0,
  continuable: false,
  points: [],
  draw: IO.spline.draw,
  addPoints: IO.spline.addPoints,
  getPoints: IO.spline.getPoints,
  modifiers: {},
};

/**
 * Draw a spline through points
 */
commands.bezier2p = {
  name: "bezier2p",
  layer: layers.beziers2p,
  stages: 0,
  continuable: false,
  points: [],
  draw: IO.bezier2p.draw,
  addPoints: IO.bezier2p.addPoints,
  getPoints: IO.bezier2p.getPoints,
  modifiers: {},
};
