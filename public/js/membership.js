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


// Add JavaScript to Trigger on Scroll
  document.addEventListener("DOMContentLoaded", () => {
    const faders = document.querySelectorAll(".fade-in");

    const appearOnScroll = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.style.opacity = "1";
        entry.target.classList.add("animate");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.1 });

    faders.forEach(el => {
      appearOnScroll.observe(el);
    });
  });


  