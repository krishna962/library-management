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


/* for humburger menu */

// explore.js
const hamburger = document.createElement('div');
hamburger.classList.add('hamburger');
hamburger.innerHTML = '<span></span><span></span><span></span>';

const navbar = document.querySelector('.navbar');
navbar.appendChild(hamburger);

const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});


// for reveal sections on scroll

// Scroll Animation
// function reveal() {
//     var reveals = document.querySelectorAll('.reveal');

//     for (var i = 0; i < reveals.length; i++) {
//         var windowHeight = window.innerHeight;
//         var elementTop = reveals[i].getBoundingClientRect().top;
//         var elementVisible = 150;

//         if (elementTop < windowHeight - elementVisible) {
//             reveals[i].classList.add('active');
//         } else {
//             reveals[i].classList.remove('active');
//         }
//     }
// }

// window.addEventListener('scroll', reveal);

// // Initial reveal
// reveal();


// // Toggle Navbar for Mobile
// const hamburger = document.querySelector('.hamburger');
// const navLinks = document.querySelector('.nav-links');

// hamburger.addEventListener('click', () => {
//     navLinks.classList.toggle('show');
// });
