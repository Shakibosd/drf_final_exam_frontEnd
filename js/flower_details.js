// Flower details API fetch
document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const flowerId = urlParams.get("id");

  fetch(`https://flower-seal-backend.vercel.app/api/v1/flower/flower_detail/${flowerId}/`)
    .then((response) => response.json())
    .then((data) => {
      displayFlowerDetails(data);
    })
    .catch((error) => console.error("Error fetching flower details:", error));
});

//flower order function
function order_flower(flower) {
  const userId = localStorage.getItem("user_id");
  const token = localStorage.getItem("authToken");
  const button = document.getElementById("order_submit");

  button.addEventListener("click", () => {
    const input = document.getElementById("quantity");
    const product_quantity = parseInt(input.value);

    if (product_quantity <= flower.stock) {
      fetch("https://flower-seal-backend.vercel.app/api/v1/order/create_order/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `token ${token}`,
        },
        body: JSON.stringify({
          user_id: parseInt(userId),
          product_id: parseInt(flower.id),
          quantity: parseInt(product_quantity),
        }),
      })
        .then((response) => response.json())
        .then((response) => {
          console.log("Order placed successfully : ", response);
          alert("Order Placed Successfully And Check Your Email");
          window.location.href = "./order_history.html";
        })
        .catch((error) => {
          console.log("Order error", error);
          alert("Error placing order");
        });
    } else {
      console.log("Insufficient stock");
      alert("Insufficient stock");
    }
  });
}

// Flower details
async function displayFlowerDetails(flower) {
  const detailsContainer = document.getElementById("flower-details");
  detailsContainer.innerHTML = `
    <div class="card container bg-white text-dark index_flower_card" style="border-radius: 20px;">
      <br>
      <img src="${flower.image}" class="img-fluid mx-auto d-block" alt="${flower.title}"
        style="width:800px; height:500px; border-radius: 10px;">
      <h1 class="pt-5">${flower.title}</h1>
      <p>Price : ${flower.price} ৳</p>
      <p>Category : <span class="gradient-btn">${flower.category}</span></p>
      <p>Stock : ${flower.stock}</p>
      <p>Description : ${flower.description}</p>
      <br>
      <div class="row g-3 d-flex justify-content-center align-items-center">
        <div class="col-12 col-md-6 col-lg-3">
          <a href="./authenticated_user.html" class="gradient-btn-1 btn w-100" style="text-decoration: none;">Back To Auth Home</a>
        </div>
        <div class="col-12 col-md-6 col-lg-3">
          <button type="button" class="gradient-btn btn w-100" style="text-decoration: none;" data-bs-toggle="modal"
            data-bs-target="#orderModal">
            Order Now
          </button>
        </div>
        <div class="col-12 col-md-6 col-lg-3">
        <a class="gradient-btn-1 btn w-100" id="payment-button">Payment</a>
        </div>
        <div class="col-12 col-md-6 col-lg-3">
          <button class="gradient-btn btn w-100" style="text-decoration: none;" type="button" data-bs-toggle="collapse"
            data-bs-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample">
            Comment
          </button>
        </div>
      </div>
      <div class="d-flex gap-4 justify-content-center">
        <!-- Button trigger modal -->
        <div class="collapse" id="collapseExample">
          <div class="card-body">
            <section>
              <div class="comment-section container card bg-white index_flower_card" id="index_flower_card"
                style="border-radius: 10px;">
                <div id="commentForm" class="row g-3" style="padding-top: 30px;">
                  <div class="col-md-12">
                    <label for="text" class="form-label"><b>Messages</b></label>
                    <textarea class="form-control" id="text" name="text" required></textarea>
                  </div>
                  <div class="col-12">
                    <button type="submit" class="gradient-btn-1 w-50" id="submit_buttons">
                      Comment
                    </button>
                  </div>
                </div>
                <br />
              </div>
            </section>
          </div>
        </div>
      </div>
      </br>
      <details>Sslcommerz পেমেন্ট ইন্টিগ্রেশন সত্যিকার অর্থে কোনো পেমেন্ট হবে না।</details>
      <!-- Modal -->
      <div class="modal fade" id="orderModal" tabindex="-1" aria-labelledby="orderModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content p-3">
            <div>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <div class="mb-3">
                <label for="quantity" class="form-label"><b>Quantity</b></label>
                <input id="quantity" type="number" class="form-control" placeholder="Please A Quantity" required />
              </div>
              <button type="submit" class="gradient-btn-1 w-50" id="order_submit">Order</button>
            </div>
          </div>
        </div>
      </div>
      <br>
      `;
  const paymentButton = document.getElementById("payment-button");
  paymentButton.addEventListener("click", async (event) => {
    event.preventDefault();
    try {
      const orderExists = await CheckOrder(flower.id);
      if (orderExists) {
        window.location.href = `https://flower-seal-backend.vercel.app/api/v1/payment/payment_detail/${flower.id}/`;
      } else {
        alert("You must order this flower before proceeding to payment.");
      }
    } catch (error) {
      console.error("Error checking order:", error);
      alert("An error occurred. Please try again.");
    }
  });

  order_flower(flower);
  post_comment(flower.id);
  get_comments(flower.id);
}

// Comment check order
const CheckOrder = async (flowerId) => {
  if (!flowerId) {
    console.error("Flower ID is missing.");
    return false;
  }

  const token = localStorage.getItem("authToken");
  if (!token) {
    alert("You need to log in to check order status.");
    return false;
  }

  try {
    console.log("Checking order for flowerId:", flowerId); 
    const response = await fetch(
      `https://flower-seal-backend.vercel.app/api/v1/flower/comment_check_order/?flowerId=${flowerId}`, 
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `token ${token}`,
        },
      }
    );

    console.log("API Response:", response); 

    if (response.ok) {
      const data = await response.json();
      console.log("Order exists:", data.order_exists); 
      return data.order_exists;
    } else {
      console.error("Failed to check order:", response.statusText);
      return false;
    }
  } catch (error) {
    console.error("Error checking order:", error);
    return false;
  }
};

// Comment part
const post_comment = (flowerId) => {
  const comment_button = document.getElementById("submit_buttons");
  const token = localStorage.getItem("authToken");
  comment_button.addEventListener("click", async (event) => {
    event.preventDefault();
    const hasOrdered = await CheckOrder(flowerId);
    if (!hasOrdered) {
      alert("You need to purchase the flower before commenting.");
      return;
    }

    const usertext = document.getElementById("text").value;
    fetch("https://flower-seal-backend.vercel.app/api/v1/flower/comment_all/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `token ${token}`,
      },
      body: JSON.stringify({
        flowerId: flowerId,
        comment: usertext,
      }),
    })
      .then((data) => {
        alert("Comment Successfully!");
        console.log(data);
      })
      .catch((error) => {
        console.error(error);
        alert("Failed to post comment.");
      });
  });
};

//comment get
const get_comments = (postId) => {
  fetch(`https://flower-seal-backend.vercel.app/api/v1/flower/comment_show/${postId}/`)
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      displayComment(data);
    });
};

// Comment display
const displayComment = (comments) => {
  const commentCount = document.getElementById("comments-count");
  const commentdiv = document.getElementById("comments-list");

  commentCount.innerHTML = `${comments.length}`;

  let commentsHtml = comments
    .map((comment) => {
      console.log("Logged-in user ID:", localStorage.getItem("user_id"));
      const currentUserId = parseInt(localStorage.getItem("user_id"));

      const isOwner = currentUserId === comment.user.id;

      console.log("Comment User ID:", comment.user.id);
      console.log("currentUserId:", currentUserId);
      console.log("Comment User:", comment.user);
      console.log("Is Owner?", isOwner);

      return `
      <div class="col-md-4 col-lg-6 mb-4">
        <div class="card bg-white text-dark p-3 index_flower_card" style="border-radius: 10px;">
          <h5>
              <a style="text-decoration: none;">${comment.user.username}</a>
          </h5> 
          <p>${comment.body}</p>
          <small>${comment.created_on}</small>
          <br>
          <div class="d-flex gap-3">
            ${isOwner
          ? `
              <div>
                <a class="gradient-btn edit-comment" data-id="${comment.id}"
                  data-body="${comment.body}" style="text-decoration: none;">Edit</a>
              </div>
              <div>
                <a class="gradient-btn-1 delete-comment" data-id="${comment.id}" style="text-decoration: none;"><img src="./images/basic-ui.png" style="width: 30px; height: 20px;"></a>
              </div>
            `
          : ""
        }
          </div>
        </div>
      </div>
    `;
    })
    .join("");

  commentdiv.innerHTML = `<div class="row">${commentsHtml}</div>`;

  attachEditCommentHandlers();
  attachDeleteCommentHandlers();
};

// Edit comment
const attachEditCommentHandlers = () => {
  const editButtonsContainer = document.getElementById("comments-section");

  editButtonsContainer.addEventListener("click", (event) => {
    if (event.target.classList.contains("edit-comment")) {
      const button = event.target;

      const commentId = button.getAttribute("data-id");
      const commentBody = button.getAttribute("data-body");
      const textInput = document.getElementById("edit-comment-body");
      textInput.value = commentBody;

      const commentForm = document.getElementById("comment-edit-form");
      commentForm.setAttribute("data-editing-id", commentId);

      const editFormSection = document.getElementById("edit-comment-form");
      editFormSection.style.display = "block";
    }
  });

  const form = document.getElementById("comment-edit-form");
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const commentId = form.getAttribute("data-editing-id");
    const updatedBody = document.getElementById("edit-comment-body").value;
    const token = localStorage.getItem("authToken");

    console.log("Token:", token);

    try {
      const response = await fetch(
        `https://flower-seal-backend.vercel.app/api/v1/flower/comment_edit/${commentId}/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `token ${token}`,
          },
          body: JSON.stringify({
            body: updatedBody,
          }),
        }
      );

      const data = await response.json();
      console.log("API Response:", data);

      if (response.ok) {
        const commentCard = document
          .querySelector(`[data-id="${commentId}"]`)
          .closest(".comment-card");
        commentCard.querySelector(".comment-body").textContent = updatedBody;

        const editFormSection = document.getElementById("edit-comment-form");
        editFormSection.style.display = "none";
      }
    } catch (error) {
      console.error("Error updating the comment:", error);
      alert("Comment updated successfully!");
    }
  });
};

// Delete comment
const attachDeleteCommentHandlers = () => {
  const deleteButtons = document.querySelectorAll(".delete-comment");
  const token = localStorage.getItem("authToken");
  deleteButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const commentId = button.getAttribute("data-id");

      if (confirm("Are you sure you want to delete this comment?")) {
        fetch(
          `https://flower-seal-backend.vercel.app/api/v1/flower/comment_delete/${commentId}/`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `token ${token}`,
            },
          }
        )
          .then((response) => {
            if (response.ok) {
              alert("Comment deleted successfully!");
            } else {
              alert("Failed to delete comment.");
            }
          })
          .catch((error) => {
            console.error("Error deleting comment:", error);
          });
      }
    });
  });
};
