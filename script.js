const canvas = document.getElementById("drawingCanvas");
const ctx = canvas.getContext("2d");

let isDrawing = false;
let startX = 0;
let startY = 0;

let lines = [];
let redoStack = [];

// Ambil elemen kontrol
const colorPicker = document.getElementById("lineColor");
const lineWidthSlider = document.getElementById("lineWidth");

// Fungsi menggambar grid
function drawGrid() {
  ctx.strokeStyle = "#ccc";
  for (let x = 0; x < canvas.width; x += 20) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  for (let y = 0; y < canvas.height; y += 20) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
}

// Fungsi menggambar garis menggunakan algoritma DDA
function drawLineDDA(x1, y1, x2, y2, color, width) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const steps = Math.max(Math.abs(dx), Math.abs(dy));
  const xIncrement = dx / steps;
  const yIncrement = dy / steps;

  let x = x1;
  let y = y1;

  ctx.fillStyle = color;
  for (let i = 0; i <= steps; i++) {
    ctx.fillRect(Math.round(x), Math.round(y), width, width);
    x += xIncrement;
    y += yIncrement;
  }
}

// Fungsi menggambar ulang semua garis
function redrawCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawGrid();
  lines.forEach(line => {
    drawLineDDA(line.startX, line.startY, line.endX, line.endY, line.color, line.width);
  });
}

// Event untuk menggambar garis
canvas.addEventListener("mousedown", (e) => {
  isDrawing = true;
  startX = e.offsetX;
  startY = e.offsetY;
});

canvas.addEventListener("mouseup", (e) => {
  if (isDrawing) {
    const endX = e.offsetX;
    const endY = e.offsetY;
    const color = colorPicker.value;
    const width = lineWidthSlider.value;

    drawLineDDA(startX, startY, endX, endY, color, width);
    lines.push({ startX, startY, endX, endY, color, width });
    redoStack = [];
    isDrawing = false;
  }
});

// Tombol untuk membersihkan kanvas
document.getElementById("clearCanvas").addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  lines = [];
  redoStack = [];
  drawGrid();
});

// Tombol untuk mengunduh gambar
document.getElementById("downloadCanvas").addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = "hasil-gambar.png";
  link.href = canvas.toDataURL();
  link.click();
});

// Undo dan redo dengan kombinasi keyboard
document.addEventListener("keydown", (e) => {
  if (e.ctrlKey && e.key === "z") { // Undo
    if (lines.length > 0) {
      redoStack.push(lines.pop());
      redrawCanvas();
    }
  } else if (e.ctrlKey && e.key === "y") { // Redo
    if (redoStack.length > 0) {
      lines.push(redoStack.pop());
      redrawCanvas();
    }
  }
});

// Gambar grid awal
drawGrid();
