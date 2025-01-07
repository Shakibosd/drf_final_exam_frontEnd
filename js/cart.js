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
        console.log(data);
        throw new Error("Failed To Fetch Cart Items");
      }
      return res.json();
    })
    .then((data) => {
      console.log("Fetched cart items:", data);

      if (data.length === 0) {
        cartContainer.innerHTML =
          "<h4 class='text-danger'>Your Cart Is Empty!</h4>";
        return;
      }

      cartContainer.innerHTML = "";
      data.forEach((item) => {
        const cartItem = document.createElement("div");
        cartItem.classList.add("col-md-4");

        cartItem.innerHTML = `
            <div class="card shadow">
              <img src="${item.flower_image}" class="card-img-top" alt="${item.flower}">
              <div class="card-body">
                <h6 class="card-title">Title ${item.flower}</h6>
                <p class="card-text">Price : $${item.flower_price}</p>
                <p class="card-text">Description : ${item.flower_description}</p>
                <p class="card-text">Stock : ${item.flower_stock}</p>
                <p class="card-text"><small class="text-muted">Category : ${item.flower_category}</small></p>
                <p class="card-text"><small class="text-muted">Added Time : ${item.added_at}</small></p>
              </div>
            </div>
          `;
        cartContainer.appendChild(cartItem);
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
