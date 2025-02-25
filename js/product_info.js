//order history
document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("authToken");

  if (!token) {
    console.error("No auth token found.");
    return;
  }

  fetch("https://flower-seal-backend.vercel.app/api/v1/order/all_order/", {
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
      const orderDetailsContainer = document.getElementById("order-details");
      orderDetailsContainer.innerHTML = "";

      let totalProducts = 0;

      data.forEach((order) => {
        const quantity = order.quantity;
        totalProducts += quantity;

        const orderDetail = document.createElement("div");
        orderDetail.classList.add("col-md-12", "mb-3");

        let statusClass = "";
        if (order.status === "Completed") {
          statusClass = "green-color";
        } else if (order.status === "Pending") {
          statusClass = "red-color";
        }

        orderDetail.innerHTML = `
                    <div class="index_flower_card">
                        <div class="card-body">
                            <h5 class="card-title">${order.flower}</h5>
                            <p class="card-text">
                                <strong>User : </strong> ${order.user}<br>
                                <strong>Quantity : </strong> ${order.quantity}<br>
                                <strong>Status : </strong> <b class="${statusClass}">${order.status}</b><br>
                                <strong>Order Date : </strong> ${order.order_date}
                            </p>
                        </div>
                    </div>
                `;
        orderDetailsContainer.appendChild(orderDetail);
      });
    })
    .catch((error) => console.error("Error fetching order history:", error));
});

