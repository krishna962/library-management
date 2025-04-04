
        function togglePassword() {
            var passwordField = document.getElementById("password");
            if (passwordField.type === "password") {
                passwordField.type = "text";
            } else {
                passwordField.type = "password";
            }
        }

        // for password confirmation

        function validatePassword() {
            const password = document.getElementById("password").value;
            const instructions = document.getElementById("password-instructions");
        
            const upper = document.getElementById("upper");
            const special = document.getElementById("special");
            const number = document.getElementById("number");
            const length = document.getElementById("length");
        
            const hasUpperCase = /[A-Z]/.test(password);
            const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
            const hasNumber = /[0-9]/.test(password);
            const isLengthValid = password.length <= 7;
        
            // Show instructions only when user starts typing
            instructions.style.display = password.length > 0 ? "block" : "none";
        
            updateValidation(upper, hasUpperCase);
            updateValidation(special, hasSpecialChar);
            updateValidation(number, hasNumber);
            updateValidation(length, isLengthValid);
        }
        
        function updateValidation(element, conditionMet) {
            element.classList.toggle("valid", conditionMet);
            element.classList.toggle("invalid", !conditionMet);
        }
        
        function checkPasswordMatch() {
            const password = document.getElementById("password").value;
            const confirmPassword = document.getElementById("confirm-password").value;
            const matchMessage = document.getElementById("password-match");
        
            if (confirmPassword.length > 0) {
                if (password === confirmPassword) {
                    matchMessage.textContent = "✅ Passwords match!";
                    matchMessage.classList.add("valid");
                    matchMessage.classList.remove("invalid");
                } else {
                    matchMessage.textContent = "❌ Passwords do not match!";
                    matchMessage.classList.add("invalid");
                    matchMessage.classList.remove("valid");
                }
            } else {
                matchMessage.textContent = "";
            }
        }
        
        
        // Show/hide password toggle
        function togglePassword() {
            const password = document.getElementById("password");
            password.type = password.type === "password" ? "text" : "password";
        }
        

        
        // validate phone number

        function validatePhone() {
            const phoneInput = document.getElementById("phone");
            const phoneMessage = document.getElementById("phone-message");
            const indianPhonePattern = /^[6-9]\d{9}$/;
        
            // Remove non-numeric characters
            phoneInput.value = phoneInput.value.replace(/\D/g, '');
        
            if (indianPhonePattern.test(phoneInput.value)) {
                phoneMessage.textContent = "✅ Valid Indian Mobile Number";
                phoneMessage.classList.add("valid");
                phoneMessage.classList.remove("invalid");
            } else {
                phoneMessage.textContent = "❌ Enter a valid 10-digit Indian mobile number (Starts with 6-9)";
                phoneMessage.classList.add("invalid");
                phoneMessage.classList.remove("valid");
            }
        }
        
        
        // cross button

        function redirectToHome() {
            window.location.href = "/";
        }



// Check if registration was successful
window.onload = function () {
    const urlParams = new URLSearchParams(window.location.search);

    if (urlParams.has("success")) {
        alert("🎉 Registration Successful! Redirecting to Login...");
        window.location.href = "/login";  // Redirect to login page
    }

    if (urlParams.has("error")) {
        const errorType = urlParams.get("error");
        if (errorType === "exists") {
            alert("❌ Email or Phone Number Already Registered!");
        } else if (errorType === "server") {
            alert("❌ Server error, please try again later.");
        }
    }
};




function hideError() {
    document.getElementById("error-message").style.display = "none";
}
        