const imageFile = document.getElementById("image-file");
const message = document.getElementById("message");
const submitButton = document.getElementById("submit-button");
const resetButton = document.getElementById("reset-button");
const label = document.getElementById("label");
const canvas = document.getElementById("image-canvas");
const ctx = canvas.getContext("2d");

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
        const image = new Image();
        image.onload = function () {
            canvas.width = 400;
            canvas.height = 400;
            if (image.width > canvas.width || image.height > canvas.height) {
                const scale = Math.min(
                    canvas.width / image.width,
                    canvas.height / image.height
                );
                canvas.width = image.width * scale;
                canvas.height = image.height * scale;
                imageFile.style.width =
                    (image.width * scale - 20).toString() + "px";
                imageFile.style.height =
                    (image.height * scale - 20).toString() + "px";
            } else {
                canvas.width = image.width;
                canvas.height = image.height;
                imageFile.style.width = (image.width - 20).toString() + "px";
                imageFile.style.height = (image.height - 20).toString() + "px";
            }
            ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
            message.innerHTML = "Image file loaded!";
        };
        image.src = e.target.result;
    };
    reader.readAsDataURL(file);
});

// If submitButton is clicked, get image data from canvas and download it as a text file
submitButton.addEventListener("click", function () {
    submitButton.innerHTML = `<i class="gg-spinner-alt"></i>`;

    const pixelBuffer = new Uint32Array(
        ctx.getImageData(0, 0, canvas.width, canvas.height).data.buffer
    );

    if (!pixelBuffer.some((color) => color !== 0)) {
        message.innerHTML = "No image data found!";
        submitButton.innerHTML = `<i class="gg-software-download"></i>`;
        return;
    }

    message.innerHTML = "Downloading image data...";

    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let text = "[";
    for (let i = 0; i < data.length; i += 4) {
        text += `[${data[i]},${data[i + 1]},${data[i + 2]},${data[i + 3]}]`;
        if (i < data.length - 4) {
            text += ",";
        }
    }
    text += "]";
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
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvas.width = 300;
    canvas.height = 300;
    imageFile.style.height = "280px";
    imageFile.style.width = "280px";
    imageFile.value = "";
    message.innerHTML = "Image file cleared!";
    label.innerHTML = `<i class="gg-software-upload"></i>`;
});
