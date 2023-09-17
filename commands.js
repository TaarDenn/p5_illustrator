/**
 * @module commands
 * @returns line, circle, rect2p, polyline
 */
const commands = () => {
  return {};
};

/**
 * 
 */
commands.line = {
  name: "line",
  layer: layers.lines,
  stages: 2,
  continuable: true,
  points: [],
  modifiers: {
    ortho: true,
  },
  draw: lineIO.draw,
  addPoints: lineIO.addPoints,
  getPoints: lineIO.getPoints,
};

/**
 * 
 */
commands.polyline = {
  name: "polyline",
  layer: layers.polylines,
  stages: 0,
  continuable: false,
  points: [],
  modifiers: {
    ortho: true,
    q: true,
  },
  draw: polylineIO.draw,
  addPoints: polylineIO.addPoints,
  getPoints: polylineIO.getPoints,
};

/**
 * 
 */
commands.rect2p = {
  name: "rect2p",
  layer: layers.rects2p,
  stages: 2,
  continuable: false,
  points: [],
  modifiers: {
    shift: null,
  },
  draw: rectIO.draw,
  addPoints: rectIO.addPoints,
  getPoints: rectIO.getPoints,
};

/**
 * 
 */
commands.circle = {
  name: "circle",
  layer: layers.circles,
  stages: 2,
  continuable: false,
  points: [],
  modifiers: {
    shift: null,
  },
  draw: circleIO.draw,
  addPoints: circleIO.addPoints,
  getPoints: circleIO.getPoints,
};
