//user password change
document.getElementById("changePasswordForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const oldPassword = document.getElementById("oldPassword").value;
    const newPassword = document.getElementById("newPassword").value;
    const authToken = localStorage.getItem("authToken");
    console.log(authToken);

    try {
      const response = await fetch(
        "https://flower-seal-backend.vercel.app/profiles/pass_cng/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${authToken}`,
          },
          body: JSON.stringify({
            old_password: oldPassword,
            new_password: newPassword,
          }),
        }
      );

      const messageElement = document.getElementById("message");

      if (response.ok) {
        alert("Password changed successfully!");
        window.location.href = "./update_profile.html";
        messageElement.classList.add("text-success");
        messageElement.classList.remove("text-danger");
      } else {
        const result = await response.json();
        messageElement.textContent = result.old_password
          ? result.old_password[0]
          : "Error changing password!";
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
