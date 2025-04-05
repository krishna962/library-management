document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.add-book-form');

    form.addEventListener('submit', (e) => {
        const title = document.getElementById('title').value.trim();
        const author = document.getElementById('author').value.trim();
        const imageUrl = document.getElementById('imageUrl').value.trim();

        if (!title || !author || !imageUrl) {
            e.preventDefault();
            alert('Please fill in all fields.');
        }
    });
});

// Optional enhancement: Smooth scroll to form after submission
document.addEventListener("DOMContentLoaded", () => {
    const url = new URL(window.location);
    if (url.searchParams.get("scroll") === "form") {
        document.querySelector(".add-book-form").scrollIntoView({ behavior: "smooth" });
    }
});

// for remove success msg in 10 sec
document.addEventListener("DOMContentLoaded", () => {
    const flashSuccess = document.getElementById("flashSuccess");
    if (flashSuccess) {
        setTimeout(() => {
            flashSuccess.style.opacity = "0";
            setTimeout(() => {
                flashSuccess.remove();
            }, 100);
        }, 1000); // 10 seconds
    }
});
