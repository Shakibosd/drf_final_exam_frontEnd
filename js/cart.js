const addToCart = (flower_id) => {
  const token = localStorage.getItem("authToken");
  if (!token) {
    alert("User not authenticated!");
    return;
  }

  console.log("token : ", token);
  console.log("flower_id : ", flower_id);

  fetch("http://127.0.0.1:8000/flowers/cart/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `token ${token}`,
    },
    body: JSON.stringify({ flower: flower_id, quantity: 1 }),
  })
    .then(async (res) => {
      if (!res.ok) {
        const data = await res.json();
        console.log(data);
        throw new Error(data.detail || "Failed To Add To Cart");
      }
      return res.json();
    })
    .then((data) => {
      console.log("Cart updated:", data);
      alert("Flower added to cart successfully!");
    })
    .catch((err) => {
      console.log("Error adding to cart", err.message);
      alert(err.message || "Failed To Add To Cart");
    });
};

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

  fetch("http://127.0.0.1:8000/flowers/cart/", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `token ${token}`,
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
        cartContainer.innerHTML =
          "<tr><td colspan='8' class='text-center text-danger'>Your Cart Is Empty!</td></tr>";
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
          <td>${index + 1}</td>
          <td><img src="${
            item.flower_image
          }" class="img-thumbnail img-fluid" style="width: 100px; height: 70px;" alt="${item.flower}"></td>
          <td>${item.flower}</td>
          <td>$${price.toFixed(2)}</td>
          <td>${item.flower_description.slice(0, 7)} <a class="text-primary">see more</a></td>
          <td>${item.flower_stock}</td>
          <td>${item.flower_category}</td>
          <td><button class="gradient-btn-1" onclick="removeFromCart(${
            item.id
          })"><img src="./images/basic-ui.png" style="width: 40px; height: 25px;"></button></td>
        `;
        cartContainer.appendChild(row);
      });

      totalQuantityElement.textContent = `Total Product Or Quantity : ${totalQuantity}`;
      totalPriceElement.textContent = `Total Price Of Product : $${totalPrice.toFixed(
        2
      )}`;
    })
    .catch((err) => {
      console.log("Error Fetching Cart Items", err.message);
      alert(err.message || "Failed To Fetch Cart Items");
    });
};

document.addEventListener("DOMContentLoaded", () => {
  fetchCartItems();
});

const removeFromCart = (cart_id) => {
  const isConfirmad = confirm(
    "Are you sure you want to remove this product from the cart?"
  );
  if (!isConfirmad) {
    return;
  }
  const token = localStorage.getItem("authToken");

  fetch(`http://127.0.0.1:8000/flowers/cart/remove/${cart_id}/`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `token ${token}`,
    },
  })
    .then(async (res) => {
      if (!res.ok) {
        const data = await res.json();
        console.log(data);
        throw new Error(data.detail || "failed to remeove cart item");
      }
      return res.json();
    })
    .then((data) => {
      console.log(data);
      alert("Item Removed From Cart Successfully!");
      fetchCartItems();
    })
    .catch((err) => {
      console.log(err);
      alert("Failed To Removed Cart Item");
    });
};
