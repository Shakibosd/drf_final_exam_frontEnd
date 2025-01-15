//user list show data
function fetchUsers() {
  const token = localStorage.getItem("authToken");
  fetch("https://flower-seal-backend.vercel.app/users/user/", {
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
            <div class="user-card card mx-auto w-100 pt-2 index_flower_card" style="border-radius:20px;" id="user-${user.id}">
              <div class="m-3">
                <img style="width: 450px; height: 400px; border-radius: 50%;" class="img-fluid mx-auto d-flex justify-content-center align-items-center" src="${user.profile_img}" alt="">
                <br/>
                <h2>UserId : ${user.id}</h2>
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

//function call
fetchUsers();
