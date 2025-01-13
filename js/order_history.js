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
