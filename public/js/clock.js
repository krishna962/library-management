// Function to Update Digital Clock
function updateDigitalClock() {
    const clockElement = document.getElementById("digital-clock");
    const now = new Date();

    let hours = now.getHours();
    let minutes = now.getMinutes();
    let seconds = now.getSeconds();
    let amPm = hours >= 12 ? "PM" : "AM";

    // Convert to 12-hour format
    hours = hours % 12 || 12;

    // Format with leading zero
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    // Display Time
    clockElement.innerHTML = `${hours}:${minutes}:${seconds} ${amPm}`;
}

// Update Clock Every Second
setInterval(updateDigitalClock, 1000);
updateDigitalClock(); // Initial Call
