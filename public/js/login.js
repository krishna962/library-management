function togglePassword(id) {
    const passwordField = document.getElementById(id);
    if (passwordField.type === "password") {
        passwordField.type = "text";
    } else {
        passwordField.type = "password";
    }
}

// document.getElementById("loginForm").addEventListener("submit", function(event) {
//     event.preventDefault();
//     const emailOrPhone = event.target.emailOrPhone.value;
//     const password = event.target.password.value;
    
//     // Example validation logic
//     if (emailOrPhone === "admin@example.com" && password === "Admin@123") {
//         alert("Welcome Admin!");
//         window.location.href = "/admin-dashboard";
//     } else if (emailOrPhone === "student@example.com" && password === "Student@123") {
//         alert("Welcome Student!");
//         window.location.href = "/student-dashboard";
//     } else {
//         alert("Invalid credentials! Please try again.");
//     }
// });



 // cross button
 function redirectToHome() {
    window.location.href = "/";
}
