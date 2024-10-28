//add new flower data
document
  .getElementById("create-post-form")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const imageInput = document.getElementById("imageInput").files[0];

    if (!imageInput) {
      alert("Please select an image file.");
      return;
    }

    const fmData = new FormData();
    fmData.append("image", imageInput);

    fetch(
      "https://api.imgbb.com/1/upload?key=2bc3cad9a1fb82d25c2c1bb0ab49b035",
      {
        method: "POST",
        body: fmData,
      }
    )
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

          fetch("https://flower-seal-backend.vercel.app/admins/post_list/", {
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
