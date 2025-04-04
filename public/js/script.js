document.addEventListener("DOMContentLoaded", function () {
    const elements = document.querySelectorAll(".fade-in, .slide-left, .zoom-in");

    function checkScroll() {
        elements.forEach((el) => {
            const position = el.getBoundingClientRect().top;
            if (position < window.innerHeight - 100) {
                el.classList.add("show");
            }
        });
    }

    window.addEventListener("scroll", checkScroll);
    checkScroll(); // Run once on load in case elements are already in view
});

document.addEventListener("DOMContentLoaded", function () {
    function animateCounters() {
        let counters = document.querySelectorAll(".count");
        counters.forEach(counter => {
            let target = +counter.getAttribute("data-count");
            let count = 0;
            let speed = target / 100; // Speed of counting animation
            let updateCounter = setInterval(() => {
                count += speed;
                if (count >= target) {
                    counter.innerText = target;
                    clearInterval(updateCounter);
                } else {
                    counter.innerText = Math.ceil(count);
                }
            }, 20);
        });
    }

    function checkScroll() {
        let statsSection = document.querySelector("#library-stats");
        let position = statsSection.getBoundingClientRect().top;
        let screenHeight = window.innerHeight;
        if (position < screenHeight - 100) {
            animateCounters();
            window.removeEventListener("scroll", checkScroll);
        }
    }

    window.addEventListener("scroll", checkScroll);
});

// <!-- JavaScript for Smooth Animations -->
    document.addEventListener("DOMContentLoaded", function () {
        let fadeElements = document.querySelectorAll(".fade-in");
        function fadeInOnScroll() {
            fadeElements.forEach(el => {
                let position = el.getBoundingClientRect().top;
                let screenHeight = window.innerHeight;
                if (position < screenHeight - 100) {
                    el.classList.add("visible");
                }
            });
        }
        window.addEventListener("scroll", fadeInOnScroll);
        fadeInOnScroll(); // Initial check
    });

    