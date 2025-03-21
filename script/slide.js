window.onload = function () {
    const urlParams = new URLSearchParams(window.location.search);
    const slideId = urlParams.get("id");
    let savedSlides = JSON.parse(localStorage.getItem("savedSlides")) || [];

    if (slideId !== null && savedSlides[slideId]) {
        document.getElementById("textInput").value = savedSlides[slideId].text;
        document.getElementById("fontSizeInput").value = savedSlides[slideId].fontSize;
        document.getElementById("textInput").style.fontSize = savedSlides[slideId].fontSize + "px";
        document.getElementById("slideImage").src = savedSlides[slideId].image;
    }
};

document.getElementById("updateTextBtn").addEventListener("click", function () {
    let text = document.getElementById("textInput").value.trim();
    let fontSize = document.getElementById("fontSizeInput").value.trim();
    let textInput = document.getElementById("textInput");

    if (text !== "") {
        textInput.value = text;
    }
    if (fontSize !== "" && !isNaN(fontSize) && fontSize > 0) {
        textInput.style.fontSize = fontSize + "px";
    }
});


document.getElementById("saveSlideBtn").addEventListener("click", function () {
    const text = document.getElementById("textInput").value;
    const fontSize = document.getElementById("textInput").style.fontSize.replace("px", "");
    const imageSrc = document.getElementById("slideImage").src;

let savedSlides = JSON.parse(localStorage.getItem("savedSlides")) || [];

    const urlParams = new URLSearchParams(window.location.search);
    const slideId = urlParams.get("id");

    if (slideId !== null && savedSlides[slideId]) {
        savedSlides[slideId] = { text, fontSize, image: imageSrc };
    } else {
        savedSlides.push({ text, fontSize, image: imageSrc });
    }

    localStorage.setItem("savedSlides", JSON.stringify(savedSlides));

    window.location.href = "index.html";
}); 