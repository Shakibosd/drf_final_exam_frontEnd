//chart
async function fetchOrderStats() {
    const response = await fetch(
        "https://flower-seal-backend.vercel.app/admins/order-stats/"
    );
    const data = await response.json();
    return data;
}

async function fetchOrderStats() {
    return {
        total_orders: 100,
        total_revenue: 2000,
        total_products: 50,
        profit: 1500,
    };
}

async function createChart() {
    const data = await fetchOrderStats();
    const ctx = document.getElementById("orderChart").getContext("2d");

    new Chart(ctx, {
        type: "bar",
        data: {
            labels: ["Total Orders", "Total Revenue", "Total Products", "Profit"],
            datasets: [
                {
                    label: "Order Statistics",
                    data: [
                        data.total_orders,
                        data.total_revenue,
                        data.total_products,
                        data.profit,
                    ],
                    backgroundColor: [
                        "rgba(75, 192, 192, 0.2)",
                        "rgba(255, 159, 64, 0.2)",
                        "rgba(153, 102, 255, 0.2)",
                        "rgba(54, 162, 235, 0.2)",
                    ],
                    borderColor: [
                        "rgba(75, 192, 192, 1)",
                        "rgba(255, 159, 64, 1)",
                        "rgba(153, 102, 255, 1)",
                        "rgba(54, 162, 235, 1)",
                    ],
                    borderWidth: 1,
                },
            ],
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    labels: {
                        color: "grey",
                    },
                },
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: "grey",
                    },
                    grid: {
                        color: "rgba(255, 255, 255, 0.1)",
                    },
                },
                x: {
                    ticks: {
                        color: "grey",
                    },
                    grid: {
                        color: "rgba(255, 255, 255, 0.1)",
                    },
                },
            },
        },
    });
}

createChart();

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
            const orderDetailsContainer = document.getElementById("order-details");
            orderDetailsContainer.innerHTML = "";

            let totalProducts = 0;

            data.forEach((order) => {
                const quantity = order.quantity;
                totalProducts += quantity;

                const orderDetail = document.createElement("div");
                orderDetail.classList.add("col-md-12", "mb-3");
                orderDetail.innerHTML = `
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">${order.flower}</h5>
                            <p class="card-text">
                                <strong>User:</strong> ${order.user}<br>
                                <strong>Quantity:</strong> ${order.quantity}<br>
                                <strong>Status:</strong> ${order.status}<br>
                                <strong>Order Date:</strong> ${order.order_date}
                            </p>
                        </div>
                    </div>
                `;
                orderDetailsContainer.appendChild(orderDetail);
            });
        })
        .catch((error) => console.error("Error fetching order history:", error));
});

// order info
document.addEventListener("DOMContentLoaded", function () {
    fetch("https://flower-seal-backend.vercel.app/orders/order_summary/")
        .then((response) => response.json())
        .then((data) => {
            document.getElementById("total-products").textContent =
                data.total_products_sold;
            document.getElementById(
                "total-revenue"
            ).textContent = `${data.total_revenue}`;
            document.getElementById(
                "total-profit"
            ).textContent = `${data.total_profit}`;
        })
        .catch((error) => console.error("Error fetching order summary:", error));
});
