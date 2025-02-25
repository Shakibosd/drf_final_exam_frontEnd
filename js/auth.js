//password icon
const togglePassword = (fieldId, iconElement) => {
  let passwordField = document.getElementById(fieldId);
  let icon = iconElement.querySelector("i");

  if (passwordField.type === "password") {
    passwordField.type = "text";
    icon.classList.remove("bxs-low-vision");
    icon.classList.add("bxs-show");
  } else {
    passwordField.type = "password";
    icon.classList.remove("bxs-show");
    icon.classList.add("bxs-low-vision");
  }
};

// Register part
const handleRegister = async (event) => {
  event.preventDefault();
  const form = document.getElementById("register-form");
  const formData = new FormData(form);

  const fileInput = document.getElementById("profile_img");
  const imageFile = fileInput.files[0];

  const imageUploadFormData = new FormData();
  imageUploadFormData.append("image", imageFile);

  try {
    const imgbbResponse = await fetch(
      "https://api.imgbb.com/1/upload?key=2bc3cad9a1fb82d25c2c1bb0ab49b035",
      {
        method: "POST",
        body: imageUploadFormData,
      }
    );

    const imgbbResult = await imgbbResponse.json();

    if (imgbbResult.success) {
      const imgbbUrl = imgbbResult.data.url;

      const registerData = {
        username: formData.get("username"),
        first_name: formData.get("first_name"),
        last_name: formData.get("last_name"),
        email: formData.get("email"),
        password: formData.get("password"),
        confirm_password: formData.get("confirm_password"),
        profile_img: imgbbUrl,
      };

      console.log("Registration data", registerData);

      const response = await fetch("https://flower-seal-backend.vercel.app/api/v1/user/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registerData),
      });

      if (response.ok) {
        alert(
          "Registration Successful. Please check your email for OTP verification."
        );
        window.location.href = "./otp_verify.html";
      } else {
        const errorData = await response.json();
        console.error("Register Failed:", errorData);
        alert("Register Failed: " + errorData.message);
      }
    } else {
      console.error("Image Upload Failed:", imgbbResult.error);
      alert("Image Upload Failed, Please Try Again.");
    }
  } catch (error) {
    console.error("Registration Error:", error);
    alert("An Error Occurred During Registration, Please Try Again.");
  }
};

// Resend OTP
const handleResendOTP = async (event) => {
  event.preventDefault();
  const email = document.getElementById('email_resend').value;

  try {
    const response = await fetch('https://flower-seal-backend.vercel.app/api/v1/user/resend_otp/', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await response.json();

    if (response.ok) {
      alert('OTP has been resent to your email.');
    } else {
      console.error("OTP Resend Failed:", data);
      alert("OTP Resend Failed: " + (data.message || "Unknown error"));
    }
  } catch (error) {
    console.error("Error Resending OTP:", error);
    alert("An Error Occurred While Resending OTP, Please Try Again.");
  }
};

// Verify OTP
const handleVerifyOTP = async (event) => {
  event.preventDefault();

  const email = document.getElementById('email').value;
  const otp = document.getElementById('otp').value;

  try {
    const response = await fetch('https://flower-seal-backend.vercel.app/api/v1/user/verify_otp/', {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp }),
    });
    const data = await response.json();

    if (response.ok) {
      alert("Account Activated Successfully!");
      window.location.href = "./login.html";
    } else {
      console.error("OTP Verification Failed:", data);
      alert("OTP Verification Failed: " + (data.Error || data.message || "Unknown error"));
    }
  } catch (error) {
    console.error("Error Verifying OTP:", error);
    alert("An Error Occurred While Verifying OTP, Please Try Again.");
  }
};

// Login part
const handleLogin = (event) => {
  event.preventDefault();
  const form = document.getElementById("login-form");
  const formData = new FormData(form);

  const loginData = {
    username: formData.get("username"),
    password: formData.get("password"),
  };
  fetch("https://flower-seal-backend.vercel.app/api/v1/user/login/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(loginData),
  })
    .then(async (res) => {
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Login failed");
      }
      return res.json();
    })
    .then((data) => {
      console.log("Auth Token Received : ", data.token);
      console.log("Auth Id Received : ", data.user_id);
      console.log("Auth Username Reveived : ", loginData.username);

      localStorage.setItem("authToken", data.token);
      localStorage.setItem("user_id", data.user_id);
      localStorage.setItem("username", loginData.username);

      alert("Login Successful!");
      window.location.href = `./profile.html?YourUserName=${loginData.username}`;
    })
    .catch((err) => {
      console.log("Login error", err.message);
      alert("Login failed: " + err.message);
    });
};

// Logout part
const handleLogout = () => {
  if (confirm("Are you sure you want to logout?")) {
    const token = localStorage.getItem("authToken");
    const user_id = localStorage.getItem("user_id");

    fetch("https://flower-seal-backend.vercel.app/api/v1/user/logout/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `token ${token}`,
        Authorization: `user_id ${user_id}`,
      },
    })
      .then((res) => {
        if (res.ok) {
          localStorage.removeItem("authToken");
          localStorage.removeItem("user_id");
          localStorage.removeItem("username");
          window.location.href = "./login.html";
        } else {
          console.log("Logout failed");
        }
      })
      .catch((err) => console.log("Logout Error", err));
  }
};