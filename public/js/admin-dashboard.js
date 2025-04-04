// admin-dashboard.js
document.addEventListener("DOMContentLoaded", () => {
    const cards = document.querySelectorAll(".dashboard-card");
    
    cards.forEach(card => {
        card.addEventListener("click", () => {
            const target = card.getAttribute("data-target");
            if (target) {
                window.location.href = target;
            }
        });
    });
});

