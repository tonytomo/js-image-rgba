const imageFile = document.getElementById("image-file");

const message = document.getElementById("message");

const submitButton = document.getElementById("submit-button");

const resetButton = document.getElementById("reset-button");

const imageCanvas = document.getElementById("image-canvas");

const ctx = imageCanvas.getContext("2d");

// If user select an image to imageFile element, create a new Image object
imageFile.addEventListener("change", function () {
    const file = this.files[0];
    const reader = new FileReader();

    if (file.type.split("/")[0] !== "image") {
        message.innerHTML = "File is not an image!";
        return;
    } else {
        message.innerHTML = "Image file loading...";
    }

    reader.onload = function (e) {
        const img = new Image();
        img.onload = function () {
            ctx.drawImage(img, 0, 0, imageCanvas.width, imageCanvas.height);
            message.innerHTML = "Image file loaded!";
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
});

// If submitButton is clicked, get image data from canvas and download it as a text file
submitButton.addEventListener("click", function () {
    const pixelBuffer = new Uint32Array(
        ctx.getImageData(
            0,
            0,
            imageCanvas.width,
            imageCanvas.height
        ).data.buffer
    );

    if (!pixelBuffer.some((color) => color !== 0)) {
        message.innerHTML = "No image data found!";
        return;
    }

    message.innerHTML = "Downloading image data...";

    const data = ctx.getImageData(
        0,
        0,
        imageCanvas.width,
        imageCanvas.height
    ).data;
    let text = "";
    for (let i = 0; i < data.length; i += 4) {
        text += `${data[i]},${data[i + 1]},${data[i + 2]},${data[i + 3]}\n`;
    }
    text += "RGBZER";
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "rgbzer.txt";
    setTimeout(() => {
        a.click();
        URL.revokeObjectURL(url);
        message.innerHTML = "Image data downloaded!";
    }, 1000);
});

// If resetButton is clicked, clear the canvas and clear the input file
resetButton.addEventListener("click", function () {
    ctx.clearRect(0, 0, imageCanvas.width, imageCanvas.height);
    imageFile.value = "";
    message.innerHTML = "Image file cleared!";
});
