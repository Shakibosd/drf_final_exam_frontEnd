//cart post
const addToCart = (flower_id) => {
  const token = localStorage.getItem("authToken");

  if (!token) {
    alert("User not authenticated!");
    return;
  }

  fetch("https://flower-seal-backend.vercel.app/flowers/cart/", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `token ${token}`,
    },
  })
    .then(async (res) => {
      if (!res.ok) {
        const errorData = await res.text();
        throw new Error(errorData || "Failed to fetch cart items");
      }
      return res.json();
    })
    .then((data) => {
      const productExists = data.some((item) => item.flower.id === flower_id);
      if (productExists) {
        alert("This product is already in your cart!");
        return;
      }

      return fetch("https://flower-seal-backend.vercel.app/flowers/cart/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({ flower: flower_id, quantity: 1 }),
      });
    })
    .then(async (res) => {
      if (!res.ok) {
        const errorData = await res.text(); 
        throw new Error(errorData || "Failed to add to cart");
      }
      return res.json();
    })
    .then((data) => {
      console.log("Cart updated:", data);
      alert("Product added successfully to your cart!");
    })
    .catch((err) => {
      console.error("Error:", err.message);
      alert(err.message || "Something went wrong!");
    });
};

//cart er data get
const fetchCartItems = () => {
  const cartContainer = document.getElementById("cart-items");
  if (!cartContainer) {
    console.log("Cart container not found!");
    return;
  }

  const token = localStorage.getItem("authToken");

  if (!token) {
    alert("User not authenticated!");
    return;
  }

  fetch("https://flower-seal-backend.vercel.app/flowers/cart/", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  })
    .then(async (res) => {
      if (!res.ok) {
        const data = await res.json();
        console.log("Error Response:", data);
        throw new Error(data.error || "Failed To Fetch Cart Items");
      }
      return res.json();
    })
    .then((data) => {
      console.log("Fetched cart items:", data);
      const totalQuantityElement = document.getElementById("total-quantity");
      const totalPriceElement = document.getElementById("total-price");

      if (data.length === 0) {
        cartContainer.innerHTML = `
        <tr><td colspan="8" class="text-center text-danger"><b>Your Cart Is Empty!</b></td></tr>
        `;
        totalQuantityElement.textContent = "Total Product Or Quantity : 0";
        totalPriceElement.textContent = "Total Price Of Product : $0";
        return;
      }

      let totalQuantity = 0;
      let totalPrice = 0;

      cartContainer.innerHTML = "";
      data.forEach((item, index) => {
        const price = parseFloat(item.flower_price) || 0;
        const quantity = parseInt(item.quantity) || 0;
        const totalItemPrice = price * quantity;

        totalQuantity += quantity;
        totalPrice += totalItemPrice;

        const row = document.createElement("tr");

        row.innerHTML = `
          <td><b>${index + 1}</b></td>
          <td><img src="${
            item.flower_image
          }" class="img-thumbnail img-fluid" style="width: 100px; height: 70px;" alt="${
          item.flower
        }"></td>
          <td><b>${item.flower}</b></td>
          <td><b>$${price.toFixed(2)}</b></td>
          <td>
            <b>
              <span class="flower-description-short">${item.flower_description.slice(
                0,
                7
              )}</span>
              <span class="flower-description-full" style="display: none;">${
                item.flower_description
              }</span>
              <a class="text-primary toggle-description">see more</a>
            </b>
          </td>
          <td><b>${item.flower_stock}</b></td>
          <td><b>${item.flower_category}</b></td>
          <td>
            <button class="gradient-btn-1" onclick="removeFromCart(${item.id})">
              <img src="./images/basic-ui.png" style="width: 40px; height: 25px;">
            </button>
          </td>
        `;
        cartContainer.appendChild(row);
      });
      totalQuantityElement.textContent = `Total Product Or Quantity: ${totalQuantity}`;
      totalPriceElement.textContent = `Total Price Of Product: $${totalPrice.toFixed(
        2
      )}`;

      // Add event listeners for "see more" and "see less"
      cartContainer
        .querySelectorAll(".toggle-description")
        .forEach((toggle) => {
          toggle.addEventListener("click", (event) => {
            event.preventDefault();
            const row = event.target.closest("td");
            const shortDescription = row.querySelector(
              ".flower-description-short"
            );
            const fullDescription = row.querySelector(
              ".flower-description-full"
            );

            if (fullDescription.style.display === "none") {
              fullDescription.style.display = "inline";
              shortDescription.style.display = "none";
              event.target.textContent = "see less";
            } else {
              fullDescription.style.display = "none";
              shortDescription.style.display = "inline";
              event.target.textContent = "see more";
            }
          });
        });
    })
    .catch((err) => {
      console.log("Error Fetching Cart Items", err.message);
      alert(err.message || "Failed To Fetch Cart Items");
    });
};

document.addEventListener("DOMContentLoaded", () => {
  fetchCartItems();
});

//cart removed
const removeFromCart = (cart_id) => {
  const isConfirmed = confirm(
    "Are you sure you want to remove this product from the cart?"
  );
  if (!isConfirmed) {
    return;
  }
  const token = localStorage.getItem("authToken");

  fetch(`https://flower-seal-backend.vercel.app/flowers/cart/${cart_id}/`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  })
    .then(async (res) => {
      if (!res.ok) {
        const data = await res.json();
        console.log(data);
        throw new Error(data.detail || "Failed to remove cart item");
      }
      return res.json();
    })
    .then((data) => {
      console.log(data);
      alert("Item removed from cart successfully!");
      fetchCartItems();
    })
    .catch((err) => {
      console.log(err);
      alert("Failed to remove cart item");
    });
};
