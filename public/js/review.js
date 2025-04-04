// Array to store reviews
let reviews = [];
let currentIndex = 0;

// Load reviews when the page loads
document.addEventListener("DOMContentLoaded", fetchReviews);

document.getElementById("reviewForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    let name = document.getElementById("name").value;
    let reviewText = document.getElementById("reviewText").value;

    try {
        let response = await fetch("http://localhost:3000/api/reviews", { 
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, review: reviewText }) 
        });

        let result = await response.json();

        if (response.ok) {
            alert("✅ Review submitted successfully!");
            document.getElementById("reviewForm").reset();
            fetchReviews(); // Reload reviews
        } else {
            alert("❌ Error: " + (result.message || "Failed to submit review."));
        }
    } catch (error) {
        alert("❌ Failed to submit review. Check the console for details.");
        console.error("Error submitting review:", error);
    }
});

// Fetch and display reviews
async function fetchReviews() {
    try {
        let response = await fetch("http://localhost:3000/api/reviews"); // Correct backend route
        let data = await response.json();

        let reviewContainer = document.getElementById("reviewsList");
        reviewContainer.innerHTML = ""; // Clear previous reviews

        reviews = data; // Store reviews in global array

        reviews.forEach((review) => {
            let reviewElement = document.createElement("div");
            reviewElement.classList.add("review-card");
            reviewElement.style.display = "none"; // Initially hidden
            reviewElement.innerHTML = `
                <h4>${review.name}</h4>
                <p>${review.review}</p>
            `;
            reviewContainer.appendChild(reviewElement);
        });

        startReviewSlider(); // Start sliding reviews

    } catch (error) {
        console.error("❌ Error fetching reviews:", error);
    }
}

// Function to slide reviews one by one
function startReviewSlider() {
    let reviewCards = document.querySelectorAll(".review-card");
    if (reviewCards.length === 0) return;

    let index = 0;
    function slideReviews() {
        reviewCards.forEach((card, i) => {
            card.style.display = i === index ? "block" : "none";
        });

        index = (index + 1) % reviewCards.length;
        setTimeout(slideReviews, 3000);
    }
    
    slideReviews(); // Start the sliding effect
}

// Load reviews when page loads
fetchReviews();
