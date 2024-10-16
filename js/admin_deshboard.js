//all post show frontend flower data
function fetchPosts() {
  fetch("https://flower-seal.onrender.com/flowers/flowers/")
    .then((response) => response.json())
    .then((data) => {
      let postList = document.getElementById("post-list");
      postList.innerHTML = "";
      data.forEach((post) => {
        console.log(post.id);
        let postCard = `
          <div class="post-card card w-100 mx-auto index_flower_card" style="border-radius: 20px;" id="post-${post.id}">
            <br/>
            <img class="w-50 d-block mx-auto" style="height: 300px; border-radius:10px;" src="${post.image}" alt="${post.title}">
            <br/>
            <div class="m-3">
              <h4>Title : ${post.title}</h4>
              <p>Description : ${post.description}</p>
              <p>Price : ${post.price} ৳</p>
              <small>Category : <button class="btn btn-secondary"> ${post.category}</button></small>
              <p>Stock : ${post.stock}</p>
              <div class="d-flex gap-3">
                <div>
                  <button class="btn btn-success" onclick="editPost(${post.id})">Edit</button>
                </div>
                <div>
                  <button class="btn btn-danger" onclick="deletePost(${post.id})">Delete</button>
                </div>
              </div>
            </div>
          </div>
          <br/>
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
  fetch(`https://flower-seal.onrender.com/flowers/flowers/${postId}/`)
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
document.getElementById("edit-post-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const token = localStorage.getItem("authToken");
  const postId = document.getElementById("edit-post-id").value;
  const formData = new FormData();
  formData.append("title", document.getElementById("edit-title").value);
  formData.append("description", document.getElementById("edit-description").value);
  formData.append("price", document.getElementById("edit-price").value);
  formData.append("category", document.getElementById("edit-category").value);
  formData.append("stock", document.getElementById("edit-stock").value);

  const imageFile = document.getElementById("edit-image").files[0];
  if (imageFile) {
    formData.append("image", imageFile);
  }

  fetch(`https://flower-seal.onrender.com/flowers/flowers/${postId}/`, {
    method: "PUT",
    headers: {
      Authorization: `token ${token}`,
    },
    body: formData,
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
      document.getElementById("edit-post-form").style.display = "none";
      fetchPosts();
    })
    .catch((error) => console.error("Error updating post:", error));
});

//delete flower data
function deletePost(postId) {
  const token = localStorage.getItem("authToken");
  if (confirm("Are you sure you want to delete this post?")) {
    fetch(`https://flower-seal.onrender.com/admins/post_detail/${postId}/`, {
      method: "DELETE",
      headers: {
        Authorization: `token ${token}`,
      },
    })
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

//user list show data
function fetchUsers() {
  const token = localStorage.getItem("authToken");
  fetch("https://flower-seal.onrender.com/admins/user_list/", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `token ${token}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      let userList = document.getElementById("user-list");
      userList.innerHTML = "";
      data.forEach((user) => {
        let userCard = `
          <div class="user-card card mx-auto w-100 pt-5 index_flower_card" style="border-radius:20px;" id="user-${user.id}">
            <div class="m-4">
              <h3>Username : ${user.username}</h3>
              <p>First Name: ${user.first_name}</p>
              <p>Last Name: ${user.last_name}</p>
              <p>Email: ${user.email}</p>
            </div>
          </div>
          <br/>
        `;
        userList.innerHTML += userCard;
      });
    })
    .catch((error) => console.error("Error fetching users:", error));
}

//add new flower data
document.getElementById("create-post-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const imageInput = document.getElementById("imageInput").files[0];

  if (!imageInput) {
    alert("Please select an image file.");
    return;
  }

  const fmData = new FormData();
  fmData.append("image", imageInput);

  fetch("https://api.imgbb.com/1/upload?key=2bc3cad9a1fb82d25c2c1bb0ab49b035", {
    method: "POST",
    body: fmData,
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Image uploaded:", data);

      if (data.success) {
        const imageUrl = data.data.url;

        const postData = {
          title: document.getElementById("title").value,
          description: document.getElementById("description").value,
          price: document.getElementById("price").value,
          category: document.getElementById("category").value,
          stock: parseInt(document.getElementById("stock").value),
          image: imageUrl,
        };

        const token = localStorage.getItem("authToken");

        fetch("https://flower-seal.onrender.com/admins/post_list/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
          body: JSON.stringify(postData),
        })
          .then((postResponse) => postResponse.json())
          .then((postData) => {
            console.log("Post created successfully:", postData);
            alert("Post created successfully!");
            location.reload();
          })
          .catch((error) => console.error("Error creating post:", error));
      } else {
        console.error("Error uploading image:", data);
        alert("Image upload failed!");
      }
    })
    .catch((error) => console.error("Error uploading image:", error));
});

//function call
fetchUsers();
fetchPosts();
