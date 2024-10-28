//user er data
document.addEventListener("DOMContentLoaded", () => {
  const user_id = localStorage.getItem("user_id");
  const apiUrl = `https://flower-seal-backend.vercel.app/profiles/user/${user_id}/`;
  const token = localStorage.getItem("token");

  fetch(apiUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      document.getElementById("username").value = data.username;
      document.getElementById("first_name").value = data.first_name;
      document.getElementById("last_name").value = data.last_name;
      document.getElementById("email").value = data.email;
    })
    .catch((error) => console.error("Error fetching profile data:", error));

  const profileForm = document.getElementById("profile-form");


  profileForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = {
      username: document.getElementById("username").value,
      first_name: document.getElementById("first_name").value,
      last_name: document.getElementById("last_name").value,
      email: document.getElementById("email").value,
    };

    fetch(apiUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        alert("Profile updated successfully");
      })
      .catch((error) => console.error("Error updating profile:", error));
  });
});

//order history
document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("authToken");

  if (!token) {
    console.error("No auth token found.");
    return;
  }

  fetch("https://flower-seal-backend.vercel.app/orders/my_orders/", {
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
        row.innerHTML = `
          <th>${order.user}</th>  
          <td>${order.flower}</td>
          <td>${order.quantity}</td>
          <td>${order.status}</td>
          <td>${order.order_date}</td>
        `;
        orderHistoryTable.appendChild(row);
      });
    })
    .catch((error) => console.error("Error fetching order history:", error));
});