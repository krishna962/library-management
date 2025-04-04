document.addEventListener("DOMContentLoaded", () => {
    // Smooth Scrolling for Internal Links Only
    document.querySelectorAll(".nav-links a").forEach(anchor => {
        const href = anchor.getAttribute("href");
        if (href.startsWith("#")) {
            anchor.addEventListener("click", function (event) {
                event.preventDefault();
                const section = document.querySelector(href);
                if (section) {
                    section.scrollIntoView({ behavior: "smooth" });
                }
            });
        }
    });

    // Reveal Sections on Scroll
    const sections = document.querySelectorAll(".section");
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
            }
        });
    }, { threshold: 0.2 });

    sections.forEach(section => observer.observe(section));
});
