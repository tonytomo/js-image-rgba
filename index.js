const imageFile = document.getElementById("image-file");

const message = document.getElementById("message");

const submitButton = document.getElementById("submit-button");

const resetButton = document.getElementById("reset-button");

const label = document.getElementById("label");

const imageCanvas = document.getElementById("image-canvas");

const ctx = imageCanvas.getContext("2d");

// Add function to get absolute number

// If user select an image to imageFile element, create a new Image object
imageFile.addEventListener("change", function () {
    const file = this.files[0];
    const reader = new FileReader();

    if (file.type.split("/")[0] !== "image") {
        message.innerHTML = "File is not an image!";
        return;
    } else {
        message.innerHTML = "Image file loading...";
        label.innerHTML = "";
    }

    reader.onload = function (e) {
        const img = new Image();
        img.onload = function () {
            imageCanvas.width = 400;
            imageCanvas.height = 400;
            if (
                img.width > imageCanvas.width ||
                img.height > imageCanvas.height
            ) {
                const scale = Math.min(
                    imageCanvas.width / img.width,
                    imageCanvas.height / img.height
                );
                imageCanvas.width = img.width * scale;
                imageCanvas.height = img.height * scale;
                imageFile.style.width =
                    (img.width * scale - 20).toString() + "px";
                imageFile.style.height =
                    (img.height * scale - 20).toString() + "px";
            } else {
                imageCanvas.width = img.width;
                imageCanvas.height = img.height;
                imageFile.style.width = (img.width - 20).toString() + "px";
                imageFile.style.height = (img.height - 20).toString() + "px";
            }
            ctx.drawImage(img, 0, 0, imageCanvas.width, imageCanvas.height);
            message.innerHTML = "Image file loaded!";
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
});

// If submitButton is clicked, get image data from canvas and download it as a text file
submitButton.addEventListener("click", function () {
    submitButton.innerHTML = `<i class="gg-spinner-alt"></i>`;

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
        submitButton.innerHTML = `<i class="gg-software-download"></i>`;
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
        submitButton.innerHTML = `<i class="gg-software-download"></i>`;
        message.innerHTML = "Image data downloaded!";
    }, 1000);
});

// If resetButton is clicked, clear the canvas and clear the input file
resetButton.addEventListener("click", function () {
    ctx.clearRect(0, 0, imageCanvas.width, imageCanvas.height);
    imageCanvas.width = 300;
    imageCanvas.height = 300;
    imageFile.style.height = "280px";
    imageFile.style.width = "280px";
    imageFile.value = "";
    message.innerHTML = "Image file cleared!";
    label.innerHTML = `<i class="gg-software-upload"></i>`;
});
