let gridSize = 25;
let rectangles = [];
let tileSets = [];
let patternIndex = 0;
let startX, startY, isDragging = false;

function preload() {
  const baseURL = "https://raw.githubusercontent.com/anamfikri/interaction2/refs/heads/main/sketch3_assets/";
  for (let i = 1; i <= 3; i++) {
    tileSets.push({
      fill1: loadImage(`${baseURL}tile${i}_fill1.png`),
      fill2: loadImage(`${baseURL}tile${i}_fill2.png`),
      border: loadImage(`${baseURL}tile${i}_border.png`),
      corner: loadImage(`${baseURL}tile${i}_corner.png`)
    });
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  noSmooth();
}

function draw() {
  clear();
  rectangles.forEach(drawTiledRect);
  if (isDragging) drawLivePreview();
}

function mousePressed() {
  startX = mouseX;
  startY = mouseY;
  isDragging = true;
}

function mouseReleased() {
  if (!isDragging) return;
  isDragging = false;

  let x1 = snap(startX), y1 = snap(startY);
  let x2 = snap(mouseX), y2 = snap(mouseY);
  let x = min(x1, x2), y = min(y1, y2);
  let w = abs(x2 - x1) + gridSize;
  let h = abs(y2 - y1) + gridSize;

  if (w <= gridSize || h <= gridSize) return;

  rectangles.push({ x, y, w, h, tileSet: tileSets[patternIndex] });
  patternIndex = (patternIndex + 1) % tileSets.length;
}

function snap(val) {
  return floor(val / gridSize) * gridSize;
}

function drawLivePreview() {
  let x1 = snap(startX), y1 = snap(startY);
  let x2 = snap(mouseX), y2 = snap(mouseY);
  let x = min(x1, x2), y = min(y1, y2);
  let w = abs(x2 - x1) + gridSize;
  let h = abs(y2 - y1) + gridSize;
  if (w > gridSize && h > gridSize) {
    push();
    drawTiledRect({ x, y, w, h, tileSet: tileSets[patternIndex] });
    pop();
  }
}

function drawTiledRect({ x, y, w, h, tileSet }) {
  let cols = w / gridSize;
  let rows = h / gridSize;

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let px = x + i * gridSize;
      let py = y + j * gridSize;

      const isL = i === 0, isR = i === cols - 1;
      const isT = j === 0, isB = j === rows - 1;
      const isCorner = (isL || isR) && (isT || isB);

      if (isCorner) {
        drawRotated(tileSet.corner, px, py, cornerAngle(isL, isT));
      } else if (isL || isR || isT || isB) {
        drawRotated(tileSet.border, px, py, borderAngle(isL, isT, isR, isB));
      } else {
        const useFill1 = (i + j) % 2 === 0;
        const angle = j % 2 === 0 ? 0 : PI;
        const img = useFill1 ? tileSet.fill1 : tileSet.fill2;
        drawRotated(img, px, py, angle);
      }
    }
  }
}

function cornerAngle(isL, isT) {
  if (isL && isT) return 0;
  if (!isL && isT) return HALF_PI;
  if (!isL && !isT) return PI;
  return -HALF_PI;
}

function borderAngle(isL, isT, isR, isB) {
  if (isL) return 0;
  if (isT) return HALF_PI;
  if (isR) return PI;
  return -HALF_PI;
}

function drawRotated(img, x, y, angle) {
  push();
  translate(x + gridSize / 2, y + gridSize / 2);
  rotate(angle);
  imageMode(CENTER);
  image(img, 0, 0, gridSize, gridSize);
  imageMode(CORNER);
  pop();
}
