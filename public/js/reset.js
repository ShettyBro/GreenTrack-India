
//otp veriifcation function
document.getElementById('otpForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    e.target.preventDefault(); const otp = document.getElementById('otpInput').value.trim();
    const button = e.target.querySelector('button');
    console.log("OTP Verification Triggered"); // Check if this prints in the console
    const storedEmail = localStorage.getItem("userEmail");

    // Disable button and show loading text
    button.disabled = true;
    button.innerText = 'Verifying OTP...';

    

    try {
        const response = await fetch("https://filmyadda.sudeepbro.me/.netlify/functions/otpver?action=verifyOTP", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ storedEmail, otp })
        }); 

        const data = await response.json();
        console.log(data);

        if (response.ok) {
            localStorage.setItem("resetToken", data.token); // Store JWT token
            showModal("✅ OTP verified successfully! Redirecting...");

            setTimeout(() => {
                window.location.href = "reset.html"; // Redirect to reset password page
            }, 2000);
        } else {
            showModal(`❌ ${data.message}`);
        }
    } catch (error) {
        console.error("OTP verification error:", error);
            showModal("❌ Something went wrong. Please try again.");
    } finally {
        // Re-enable button
        button.disabled = false;
        button.innerText = 'Send Link';
    }
});




//reset password function
document.getElementById("resetForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const resetButton = document.getElementById("resetbutton");
    resetButton.disabled = true;
    resetButton.innerText = "Resetting Password...";

    const token = localStorage.getItem("resetToken"); // Get JWT token
    const email = document.getElementById("Email").value;
    const newPassword = document.getElementById("NewPassword").value;
    const confirmPassword = document.getElementById("ConfirmPassword").value;

    if (!email || !newPassword || !confirmPassword) {
        showModal("All fields are required.");
        return;
    }

    if (newPassword !== confirmPassword) {
        showModal("Passwords do not match.");
        return;
    }

    try {
        const response = await fetch("https://filmyadda.sudeepbro.me/.netlify/functions/otpver?action=resetPassword", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token, email, newPassword })
        });

        const data = await response.json();
        if (response.ok) {
            showModal("✅ Password reset successful! Redirecting to login...");
            setTimeout(() => window.location.href = "login.html", 3000);
        } else {
            showModal(`❌ ${data.message}`);
        }
    } catch (error) {
        console.error("Reset Password Error:", error);
        showModal("Something went wrong. Please try again.");
    } finally {
        resetButton.disabled = false;
        resetButton.innerText = "SUBMIT";
    }
});
