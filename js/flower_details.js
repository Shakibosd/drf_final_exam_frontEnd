// Flower details API fetch
document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const flowerId = urlParams.get("id");

  fetch(`https://flower-seal-backend.vercel.app/flowers/flowers/${flowerId}/`)
    .then((response) => response.json())
    .then((data) => {
      displayFlowerDetails(data);
    })
    .catch((error) => console.error("Error fetching flower details:", error));
});

//flower order function
function order_flower(flower) {
  const userId = localStorage.getItem("user_id");
  const button = document.getElementById("order_submit");

  button.addEventListener("click", () => {
    const input = document.getElementById("quantity");
    const product_quantity = parseInt(input.value);

    if (product_quantity <= flower.stock) {
      fetch("https://flower-seal-backend.vercel.app/orders/create_order/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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
          window.location.href = "./update_profile.html";
        })
        .catch((error) => {
          console.log("Order error", error);
          alert("Error placing order");
          // window.location.href = "./update_profile.html";
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
            <img src="${flower.image}" class="img-fluid mx-auto d-block" alt="${flower.title}" style="width:800px; height:500px; border-radius: 10px;">
            <h1 class="pt-5">${flower.title}</h1>
            <p>Price : ${flower.price} ৳</p>
            <p>Category : <span class="btn btn-secondary">${flower.category}</span></p>
            <p>Stock : ${flower.stock}</p>
            <p>Description : ${flower.description}</p>   
            <br>
            <div class="row g-2">
                <div class="col-12">
                    <a href="./profile.html" class="btn btn-success text-white w-100">Back To Profile</a>
                </div>
                <div class="col-12">
                    <button type="button" class="btn btn-secondary w-100" data-bs-toggle="modal" data-bs-target="#orderModal">
                      Order Now
                    </button>
                </div>  
                <div class="col-12">
                    <a class="btn btn-primary w-100" id="payment-button" target="_blank">
                      Payment
                    </a>
                </div>
                <div class="col-12">
                    <button class="btn btn-warning w-100" type="button" data-bs-toggle="collapse" data-bs-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample">
                      Comment
                    </button>
                </div>
            </div>
            <div class="d-flex gap-3">
                <div>
                    
                </div>
                <div>
                    <!-- Button trigger modal -->
                    <div class="d-flex gap-3">
                        <div>
                   
                        </div>
                        <div>
                            <p>
                            
                             </p>
                            <div class="collapse" id="collapseExample">
                                <div class="card-body">
                                    <section>
                                        <div class="comment-section container card bg-white index_flower_card" id="index_flower_card" style="border-radius: 10px;">
                                            <div id="commentForm" class="row g-3" style="padding-top: 30px;">
                                                <div class="col-md-12">
                                                    <label for="name" class="form-label"><b>Name</b></label>
                                                    <input type="text" class="form-control" id="name" name="name" required />
                                                </div>
                                                <div class="col-md-12">
                                                    <label for="text" class="form-label"><b>Messages</b></label>
                                                    <textarea class="form-control" id="text" name="text" required></textarea>
                                                </div>
                                                <div class="col-12">
                                                    <button type="submit" class="btn btn-outline-info" id="submit_buttons">
                                                        Submit
                                                    </button>
                                                </div>
                                            </div>
                                            <br />
                                        </div>
                                    </section>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- Modal -->
                    <div class="modal fade" id="orderModal" tabindex="-1" aria-labelledby="orderModalLabel" aria-hidden="true">
                        <div class="modal-dialog">
                            <div class="modal-content p-3">
                                <div>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" style="padding-left:55rem;"></button>
                                </div>
                                <div class="modal-body">
                                    <div class="mb-3">
                                        <label for="quantity" class="form-label"><b>Quantity</b></label>
                                        <input id="quantity" type="number" class="form-control" placeholder="Please A Quantity" required />
                                    </div>
                                    <button type="submit" class="btn btn-primary" id="order_submit">Submit</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <br>
        </div>
    `;
  const orderExists = await CheckOrder(flower.id);
  const paymentButton = document.getElementById("payment-button");

  paymentButton.addEventListener("click", async () => {
    if (orderExists) {
      window.location.href =
        "https://flower-seal-backend.vercel.app/payment/payment/";
    } else {
      alert("You must order this flower before proceeding to payment.");
    }
  });
  order_flower(flower);
  post_comment(flower.id);
  get_comments(flower.id);
}

// Comment check order
const CheckOrder = async (flowerId) => {
  const token = localStorage.getItem("authToken");
  try {
    const response = await fetch(
      `https://flower-seal-backend.vercel.app/flowers/check_order/?flowerId=${flowerId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `token ${token}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error("Failed to check order status");
    }
    const data = await response.json();
    return data.order_exists;
  } catch (error) {
    console.error("Error checking order:", error);
    return false;
  }
};

// Comment part
const post_comment = (flowerId) => {
  const comment_button = document.getElementById("submit_buttons");
  comment_button.addEventListener("click", async (event) => {
    event.preventDefault();
    const hasOrdered = await CheckOrder(flowerId);
    if (!hasOrdered) {
      alert("You need to purchase the flower before commenting.");
      location.reload();
      return;
    }

    const username = document.getElementById("name").value;
    const usertext = document.getElementById("text").value;

    fetch("https://flower-seal-backend.vercel.app/flowers/comments_api/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        flowerId: flowerId,
        names: username,
        comment: usertext,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        alert("Comment Successfully!");
        location.reload();
      })
      .catch((error) => {
        console.error(error);
        alert("Failed to post comment.");
      });
  });
};

//comment get
const get_comments = (flowerId) => {
  fetch(
    `https://flower-seal-backend.vercel.app/flowers/get_comment/${flowerId}/`
  )
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      displayComment(data);
    });
};

// Comment display
const displayComment = (comments) => {
  console.log(comments);
  const commentCount = document.getElementById("comments-count");
  const commentdiv = document.getElementById("comments-list");

  commentCount.innerHTML = `${comments.length}`;

  let commentsHtml = comments
    .map(
      (comment) => `
    <div class="col-md-4 col-lg-6 mb-4">
      <div class="card bg-white text-dark p-3 index_flower_card" style="border-radius: 10px;">
        <h5>${comment.name}</h5> 
        <p>${comment.body}</p>
        <small>${comment.created_on}</small>
        <br>
        <div class="d-flex gap-3">
          <div>
            <a class="btn btn-success edit-comment" data-id="${comment.id}" data-name="${comment.name}" data-body="${comment.body}">Edit</a>
          </div>
          <div>
            <a class="btn btn-danger delete-comment" data-id="${comment.id}">Delete</a>
          </div>    
        </div>   
      </div>
    </div>
  `
    )
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
      const commentName = button.getAttribute("data-name");
      const commentBody = button.getAttribute("data-body");

      const nameInput = document.getElementById("edit-comment-name");
      const textInput = document.getElementById("edit-comment-body");

      nameInput.value = commentName;
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
    const updatedName = document.getElementById("edit-comment-name").value;
    const updatedBody = document.getElementById("edit-comment-body").value;
    const token = localStorage.getItem("authToken");
  
    console.log("Token:", token);
  
    try {
      const response = await fetch(
        `https://flower-seal-backend.vercel.app/flowers/comments/edit/${commentId}/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `token ${token}`,
          },
          body: JSON.stringify({
            name: updatedName,
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
        commentCard.querySelector(".comment-name").textContent = updatedName;
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
  deleteButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const commentId = button.getAttribute("data-id");

      if (confirm("Are you sure you want to delete this comment?")) {
        fetch(
          `https://flower-seal-backend.vercel.app/flowers/comments_api/${commentId}/`,
          {
            method: "DELETE",
          }
        )
          .then((response) => {
            if (response.ok) {
              alert("Comment deleted successfully!");
              location.reload();
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
