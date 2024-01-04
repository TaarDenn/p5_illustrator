function dist(x1, y1, x2, y2) {
  let dx = x2 - x1;
  let dy = y2 - y1;
  let pd = dx * dx + dy * dy;
  return Math.sqrt(pd);
}

// Faster in comparison
function fastDist(x1, y1, x2, y2) {
  let dx = x2 - x1;
  let dy = y2 - y1;
  return dx * dx + dy * dy;
}

function getFileName() {
  const date = new Date();

  const fileName = `${date.getFullYear()}-${date.getMonth() < 10 ? "0" : ""}${
    date.getMonth() + 1
  }-${
    date.getDate() < 10 ? "0" : ""
  }${date.getDate()}-${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}`;

  return fileName;
}
