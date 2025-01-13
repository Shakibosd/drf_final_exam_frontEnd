//user er data
document.addEventListener("DOMContentLoaded", () => {
  const userId = localStorage.getItem("user_id");
  const token = localStorage.getItem("authToken");

  fetch(`https://flower-seal-backend.vercel.app/users/user/${userId}/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      const newProfileImg = localStorage.getItem("new_profile_img");
      if (newProfileImg) {
        document.getElementById("profile-img").src = newProfileImg;
      } else if (data.profile_img) {
        document.getElementById("profile-img").src = data.profile_img;
      } else {
        document.getElementById("profile-img").src =
          "default-profile-image-url";
      }

      document.getElementById("username").value = data.username;
      document.getElementById("first_name").value = data.first_name;
      document.getElementById("last_name").value = data.last_name;
      document.getElementById("email").value = data.email;
    })
    .catch((error) => console.error("Error fetching profile data:", error));

  const fileInput = document.getElementById("fileInput");
  fileInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("image", file);

      fetch(
        "https://api.imgbb.com/1/upload?key=2bc3cad9a1fb82d25c2c1bb0ab49b035",
        {
          method: "POST",
          body: formData,
        }
      )
        .then((response) => response.json())
        .then((data) => {
          const imageUrl = data.data.url;
          document.getElementById("profile-img").src = imageUrl;
          localStorage.setItem("new_profile_img", imageUrl);
        })
        .catch((error) => console.error("Error uploading image:", error));
    }
  });

  const profileForm = document.getElementById("profile-form");
  profileForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const updatedProfileData = {
      username: document.getElementById("username").value,
      first_name: document.getElementById("first_name").value,
      last_name: document.getElementById("last_name").value,
      email: document.getElementById("email").value,
      profile_img: document.getElementById("profile-img").src,
    };

    fetch(`https://flower-seal-backend.vercel.app/users/user/${userId}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedProfileData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        alert("Profile updated successfully!");
      })
      .catch((error) => console.error("Error updating profile:", error));
  });
});

