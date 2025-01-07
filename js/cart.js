const addToCart = (flower_id) => {
  const token = localStorage.getItem("authToken");
  fetch("http://127.0.0.1:8000/flowers/cart/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `token ${token}`,
    },
    body: JSON.stringify({ flowerId: flower_id }),
  })
    .then(async (res) => {
      if (!res.ok) {
        const data = await res.json();
        console.log(data);
        throw new Error("Failed To Add To Cart");
      }
      return res.json();
    })
    .then((data) => {
      console.log("Cart updated:", data);
      alert("Flower added to cart successfully!");
    })
    .catch((err) => {
      console.log("Error adding to cart", err);
      alert("Failed To Add To Cart");
    });
};

const fetchCartItems = () => {
  const token = localStorage.getItem("authToken");

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
      console.log(data);
      const cartContainer = document.getElementById("cart-items");

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
      console.log("Error Fetching Cart Items", err);
      alert("Failed To Fetch Cart Items");
    });
};

// Call the function
fetchCartItems();
addToCart();
