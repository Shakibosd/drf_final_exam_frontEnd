//all post show frontend flower data
function fetchPosts() {
  fetch("http://127.0.0.1:8000/api/v1/flower/flower_all/")
    .then((response) => response.json())
    .then((data) => {
      let postList = document.getElementById("post-list");
      postList.innerHTML = "";
      data.forEach((post) => {
        console.log(post.id);
        let postCard = `
            <div class="post-card card index_flower_card" style="border-radius: 20px;">
              <br/>
              <img class="w-50 d-block mx-auto" style="height: 300px; border-radius:10px;" src="${post.image}" alt="${post.title}">
              <br/>
              <div class="m-3">
                 <h1>Id : ${post.id}</h1>
                <h4>Title : ${post.title}</h4>
                <p>Description : ${post.description}</p>
                <p>Price : ${post.price} ৳</p>
                <small>Category : <button class="gradient-btn"> ${post.category}</button></small>
                <p>Stock : ${post.stock}</p>
                <div class="d-flex gap-3">
                  <div>
                    <button class="gradient-btn" style="text-decoration: none;" onclick="editPost(${post.id})">Edit</button>
                  </div>
                  <div>
                    <button class="gradient-btn-1" style="text-decoration: none;" onclick="deletePost(${post.id})">Delete</button>
                  </div>
                </div>
              </div>
            </div>
            <br/>
          `;
        postList.innerHTML += postCard;
      });
    })
    .catch((error) => console.error("Error fetching posts:", error));
}

//edit flower data
function editPost(postId) {
  console.log("Inside edit post", postId);
  fetch(`http://127.0.0.1:8000/api/v1/flower/flower_detail/${postId}/`)
    .then((response) => response.json())
    .then((post) => {
      document.getElementById("edit-post-id").value = post.id;
      document.getElementById("edit-title").value = post.title;
      document.getElementById("edit-description").value = post.description;
      document.getElementById("edit-price").value = post.price;
      document.getElementById("edit-category").value = post.category;
      document.getElementById("edit-stock").value = post.stock;
      document.getElementById("edit-image").value = post.image.files[0];
      console.log(post.title);
    })
    .catch((error) => console.error("Error fetching post for edit:", error));
}

//edit form flower data
document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("edit-post-form").addEventListener("submit", function (e) {
    e.preventDefault();

    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("You are not authenticated. Please log in.");
      return;
    }

    const postId = document.getElementById("edit-post-id").value;
    const title = document.getElementById("edit-title").value;
    const description = document.getElementById("edit-description").value;
    const price = document.getElementById("edit-price").value;
    const category = document.getElementById("edit-category").value;
    const stock = document.getElementById("edit-stock").value;
    const imageFile = document.getElementById("edit-image").files[0];

    if (imageFile) {
      const imgbbFormData = new FormData();
      imgbbFormData.append("image", imageFile);

      fetch("https://api.imgbb.com/1/upload?key=2bc3cad9a1fb82d25c2c1bb0ab49b035", {
        method: "POST",
        body: imgbbFormData,
      })
        .then((response) => response.json())
        .then((imgbbData) => {
          if (imgbbData.success) {
            const imageUrl = imgbbData.data.url;

            const flowerData = {
              title: title,
              description: description,
              price: price,
              category: category,
              stock: stock,
              image: imageUrl,
            };

            fetch(`http://127.0.0.1:8000/api/v1/flower/flower_detail/${postId}/`, {
              method: "PUT",
              headers: {
                Authorization: `token ${token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify(flowerData),
            })
              .then((response) => {
                if (!response.ok) {
                  throw new Error("Failed to update post");
                }
                return response.json();
              })
              .then((data) => {
                console.log("Post updated:", data);
                alert("Post updated successfully!");
                window.location.reload(); 
              })
              .catch((error) => console.error("Error updating post:", error));
          } else {
            throw new Error("Failed to upload image to ImgBB");
          }
        })
        .catch((error) => console.error("Error uploading image:", error));
    } else {
      const flowerData = {
        title: title,
        description: description,
        price: price,
        category: category,
        stock: stock,
      };

      fetch(`http://127.0.0.1:8000/api/v1/flower/flower_detail/${postId}/`, {
        method: "PUT",
        headers: {
          Authorization: `token ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(flowerData),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to update post");
          }
          return response.json();
        })
        .then((data) => {
          console.log("Post updated:", data);
          alert("Post updated successfully!");
          window.location.reload(); 
        })
        .catch((error) => console.error("Error updating post:", error));
    }
  });
});

//delete flower data
function deletePost(postId) {
  const token = localStorage.getItem("authToken");
  if (confirm("Are you sure you want to delete this post?")) {
    fetch(
      `http://127.0.0.1:8000/api/v1/flower/flower_detail/${postId}/`,
      {
        method: "DELETE",
        headers: {
          Authorization: `token ${token}`,
        },
      }
    )
      .then((response) => {
        if (response.ok) {
          alert("Post deleted successfully!");
          document.getElementById(`post-${postId}`).remove();
        } else {
          alert("Failed to delete the post.");
        }
      })
      .catch((error) => console.error("Error deleting post:", error));
  }
}

//function call
fetchPosts();
