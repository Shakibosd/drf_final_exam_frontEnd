//user er data
document.addEventListener("DOMContentLoaded", () => {
  const userId = localStorage.getItem("user_id");
  const token = localStorage.getItem("authToken");

  fetch(`http://127.0.0.1:8000/users/user/${userId}/`, {
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
      } else {
        document.getElementById("profile-img").src = data.profile_img;
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

      fetch("https://api.imgbb.com/1/upload?key=2bc3cad9a1fb82d25c2c1bb0ab49b035", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          const imageUrl = data.data.url;
          document.getElementById("profile-img").src = imageUrl;
          localStorage.setItem("new_profile_img", imageUrl); 
        })
        .catch((error) => console.error("Error uploading image:", error));
    }
  });
});

//order history
document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("authToken");

  if (!token) {
    console.error("No auth token found.");
    return;
  }

  fetch("http://127.0.0.1:8000/orders/my_orders/", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `token ${token}`,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log("Fetched data:", data);
      const orderHistoryTable = document.getElementById("order-history");
      orderHistoryTable.innerHTML = "";
      data.forEach((order) => {
        const row = document.createElement("tr");
        let statusClass = "";
        if (order.status === "Completed") {
          statusClass = "green-color";
        } else if (order.status === "Pending") {
          statusClass = "red-color";
        }
        row.innerHTML = `
          <th>${order.user}</th>  
          <td>${order.flower}</td>
          <td>${order.quantity}</td>
          <td class="${statusClass}"><b>${order.status}</b></td>
          <td>${order.order_date}</td>
        `;
        orderHistoryTable.appendChild(row);
      });
    })
    .catch((error) => console.error("Error fetching order history:", error));
});
