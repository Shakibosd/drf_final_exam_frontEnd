document.getElementById("changePasswordForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const new_password = document.getElementById("new_password").value;
    const confirm_password = document.getElementById("confirm_password").value;
    const token = localStorage.getItem("authToken");

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/pass_change/change_password/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `token ${token}`,
          },
          body: JSON.stringify({
            new_password: new_password,
            confirm_password: confirm_password,
          }),
        }
      );

      const messageElement = document.getElementById("message");

      if (response.ok) {
        alert("Password changed successfully!");
        window.location.href = "./update_profile.html";
        messageElement.classList.add("text-success");
        messageElement.classList.remove("text-danger");
        messageElement.textContent = "Password changed successfully!";
      } else {
        const result = await response.json();
        messageElement.textContent =
          result.detail || "Error changing password!";
        messageElement.classList.add("text-danger");
        messageElement.classList.remove("text-success");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      const messageElement = document.getElementById("message");
      messageElement.textContent = "Error changing password!";
      messageElement.classList.add("text-danger");
      messageElement.classList.remove("text-success");
    }
  });
