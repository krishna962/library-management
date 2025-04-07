// Membership.js
// Initialize the membership form
  // Animate cards on scroll
  document.addEventListener("DOMContentLoaded", () => {
    const cards = document.querySelectorAll(".fade-in");

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
        }
      });
    }, {
      threshold: 0.2
    });

    cards.forEach(card => observer.observe(card));
  });
