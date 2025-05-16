let gridSize = 20;
let startX, startY;
let isDragging = false;
let rectangles = [];
let patterns = [];
let patternIndex = 0;

function preload() {
  patterns[0] = loadImage("https://raw.githubusercontent.com/anamfikri/interaction2/refs/heads/main/sketch3_assets/Pattern1.png");
  patterns[1] = loadImage("https://raw.githubusercontent.com/anamfikri/interaction2/refs/heads/main/sketch3_assets/Pattern2.png");
  patterns[2] = loadImage("https://raw.githubusercontent.com/anamfikri/interaction2/refs/heads/main/sketch3_assets/Pattern3.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  let clearBtn = createButton("clear");
  clearBtn.position(10, 54);
  clearBtn.mousePressed(() => {
    rectangles = [];
  });
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  clear();

  //rectangles
  for (let rect of rectangles) {
    drawPattern(rect.x, rect.y, rect.w, rect.h, rect.pattern);
  }

  //live preview
  if (isDragging) {
    let snappedX = snapToGrid(mouseX);
    let snappedY = snapToGrid(mouseY);
    let x1 = snapToGrid(startX);
    let y1 = snapToGrid(startY);
    let x = min(x1, snappedX);
    let y = min(y1, snappedY);
    let w = abs(snappedX - x1) + gridSize;
    let h = abs(snappedY - y1) + gridSize;

    if (w > gridSize && h > gridSize) {
      push(); 
      drawPattern(x, y, w, h, patterns[patternIndex]);
      pop();
    }
  }
}

function mousePressed() {
  startX = mouseX;
  startY = mouseY;
  isDragging = true;
}

function mouseReleased() {
  if (!isDragging) return;
  isDragging = false;

  let x1 = snapToGrid(startX);
  let y1 = snapToGrid(startY);
  let x2 = snapToGrid(mouseX);
  let y2 = snapToGrid(mouseY);
  let x = min(x1, x2);
  let y = min(y1, y2);
  let w = abs(x2 - x1) + gridSize;
  let h = abs(y2 - y1) + gridSize;

  if (w <= gridSize || h <= gridSize) return;

  rectangles.push({
    x, y, w, h,
    pattern: patterns[patternIndex]
  });

  patternIndex = (patternIndex + 1) % patterns.length;
}

function snapToGrid(val) {
  return floor(val / gridSize) * gridSize;
}

function drawPattern(x, y, w, h, img) {
  for (let i = x; i < x + w; i += gridSize) {
    for (let j = y; j < y + h; j += gridSize) {
      image(img, i, j, gridSize, gridSize);
    }
  }
}
