// Current index
let currentIndex = 0;

// List image
let allImg = [
  document.getElementById("first-img"),
  document.getElementById("second-img"),
  document.getElementById("third-img"),
  document.getElementById("forth-img"),
];

// Get canvas
const canvas = document.getElementById("board");
// Return 2d context
const ctx = canvas.getContext("2d");

// Get element matriks
const place = document.getElementById("answer");

function init() {
  drawImg(allImg[currentIndex]);
}

// Get image matrix
function getMatrix() {
  let matData = [];
  let count = 0;

  let imageData = ctx.getImageData(0, 0, allImg[currentIndex].naturalWidth, allImg[currentIndex].naturalHeight).data;

  for (let i = 0; i < imageData.length; i++) {
    if (count < 4) {
      matData.push(imageData[i]);
      count++;
    } else {
      console.log("{" + matData.toString() + "}");
      
      matData = [];
      count = 0;
    }
  }
}

function addLog(logs) {
  var rect = document.createElement("p");
  var text = document.createTextNode(logs);

  rect.appendChild(text);
  place.appendChild(rect);
  place.lastChild.scrollIntoView();
}

// Clear canvas
function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Change to next image
function nextImg() {
  clearCanvas();
  currentIndex++;
  if (currentIndex > 3) {
    currentIndex = 0;
  }
  drawImg(allImg[currentIndex]);
}

// Change to previous image
function prevImg() {
  clearCanvas();
  currentIndex--;
  if (currentIndex < 0) {
    currentIndex = 3;
  }
  drawImg(allImg[currentIndex]);
}

// Draw image
function drawImg(image) {
  ctx.drawImage(image, 0, 0);
}

// Get image dx
function getX(image) {
  return (canvas.width - image.naturalWidth) / 2;
}

// Get image dy
function getY(image) {
  return (canvas.height - image.naturalHeight) / 2;
}
