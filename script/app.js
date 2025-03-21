document.getElementById("addSlideBtn").addEventListener("click", function () {
    window.location.href = "slide.html";
});

function checkForBrowserRestart() {
    const sessionKey = "browserSession";
    const existingSession = sessionStorage.getItem(sessionKey);

    if (!existingSession) {
        console.log("Browser restarted, clearing localStorage...");
        localStorage.removeItem("savedSlides");
        sessionStorage.setItem(sessionKey, "active"); 
    }
}

function displaySavedSlides() {
    const savedSlidesContainer = document.getElementById("savedSlidesContainer");
    savedSlidesContainer.innerHTML = "";

    const savedSlides = JSON.parse(sessionStorage.getItem("savedSlides")) || [];

    savedSlides.forEach((slide, index) => {
        const slideDiv = document.createElement("div");
        slideDiv.classList.add("saved-slide");

        const link = document.createElement("a");
        link.href = `slide.html?id=${index}`;

        const img = document.createElement("img");
        img.src = slide.image;
        img.classList.add("saved-image");

        const textOverlay = document.createElement("p");
        textOverlay.textContent = slide.text;
        textOverlay.style.fontSize = slide.fontSize + "px";
        textOverlay.classList.add("saved-text");

        link.appendChild(img);
        link.appendChild(textOverlay);
        slideDiv.appendChild(link);
        savedSlidesContainer.appendChild(slideDiv);
    });
}

function saveSlidesToLocalStorage() {
    localStorage.setItem("savedSlides", sessionStorage.getItem("savedSlides"));
}

window.onload = function () {
    checkForBrowserRestart(); 

    if (localStorage.getItem("savedSlides")) {
        sessionStorage.setItem("savedSlides", localStorage.getItem("savedSlides"));
    }

    displaySavedSlides();

    document.getElementById("saveSlide").addEventListener("click", async () => {
        const savedSlides = JSON.parse(sessionStorage.getItem("savedSlides")) || [];
        if (savedSlides.length === 0) {
            alert("No slides found!");
            return;
        }

        const { jsPDF } = window.jspdf;
        let pdf = new jsPDF({
            orientation: "landscape",
            unit: "pt",
            format: [1440, 810] 
        });

        for (let index = 0; index < savedSlides.length; index++) {
            const slide = savedSlides[index];

            try {
                const img = await loadImage(slide); 

                const pageWidth = pdf.internal.pageSize.getWidth();
                const pageHeight = pdf.internal.pageSize.getHeight();

                console.log("Page Width:", pageWidth);  
                console.log("Page Height:", pageHeight); 

                let imgWidth = pageWidth
                let imgHeight = pageHeight

                const x = 0
                const y = 0 

                if (index > 0) {
                    pdf.addPage();
                }

                pdf.addImage(img, "JPEG", x, y, imgWidth, imgHeight);

                const fontSize = slide.fontSize ? slide.fontSize : 40;
                pdf.setFont("helvetica", "bold");
                pdf.setFontSize(fontSize);
                pdf.setTextColor(255, 255, 255);

                const textWidth = pdf.getTextWidth(slide.text);
                const textX = pageWidth / 2 - textWidth / 2;
                const textY = y + imgHeight / 2;

                pdf.text(slide.text, textX, textY);

            } catch (error) {
                console.error("Error processing slide:", error);
            }
        }

        pdf.save("slides.pdf");
    });

    async function loadImage(slide) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = "Anonymous";
            img.src = slide.image;

            img.onload = function () {
                resolve(img);
            };

            img.onerror = function () {
                console.error("Error loading image:", img.src);
                reject(new Error("Failed to load image"));
            };
        });
    }

};

