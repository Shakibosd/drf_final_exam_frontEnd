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
const handleRegister = (event) => {
  event.preventDefault();
  const form = document.getElementById("register-form");
  const formData = new FormData(form);

  const registerData = {
    username: formData.get("username"),
    first_name: formData.get("first_name"),
    last_name: formData.get("last_name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirm_password: formData.get("confirm_password"),
  };

  console.log("Registration data", registerData);

  fetch("https://flower-seal-backend.vercel.app/users/register/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(registerData),
  })
    .then((res) => {
      alert(
        "Registration Successful. Please check your email for a confirmation."
      );
      window.location.href = "./login.html";
    })
    .catch((error) => console.log("Registration Error", error));
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

  fetch("https://flower-seal-backend.vercel.app/users/login/", {
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
      console.log("Auth token received:", data.token);
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("user_id", data.user_id);
      alert("Login Successful!");
      window.location.href = "./update_profile.html";
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

    fetch("https://flower-seal-backend.vercel.app/users/logout/", {
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
          window.location.href = "./login.html";
        } else {
          console.log("Logout failed");
        }
      })
      .catch((err) => console.log("Logout Error", err));
  }
};
