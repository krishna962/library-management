function returnBook(bookId) {
    alert("Book " + bookId + " returned successfully!");
}
function orderTea() {
    alert("Tea ordered successfully!");
}
function payFee() {
    alert("Fee paid successfully!");
}
function logout() {
    alert("Logging out...");
    window.location.href = "index.html";
}


// for hero section 
const images = ['/images/bg1.jpg', '/images/bg2.jpg', '/images/bg3.jpg'];
let current = 0;
setInterval(() => {
    current = (current + 1) % images.length;
    document.querySelector('.hero-section').style.backgroundImage = `url('${images[current]}')`;
}, 5000);