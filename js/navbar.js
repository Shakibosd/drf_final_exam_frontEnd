fetch("navbar.html")
  .then((res) => res.text())
  .then((data) => {
    document.getElementById("navbar").innerHTML = data;

    const navElement = document.getElementById("nav-element");
    const token = localStorage.getItem("authToken");

    if (token) {
      fetch("https://flower-seal-backend.vercel.app/admins/is_admin/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `token ${token}`,
        },
      })
        .then((response) => response.json())
        .then((result) => {
          if (result.is_admin) {
            navElement.innerHTML += `
              <a href="./profile.html" class="btn btn-success">Home</a>
              <a class="btn btn-primary" href="./update_profile.html">Profile</a>
              <a href="./pass_change.html" class="btn btn-info">Password Change</a>
            <div class="dropdown">
                <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                    Admin
                </button>
                <ul class="dropdown-menu">
                    <li><a class="dropdown-item" href="./admin_deshboard.html">Deshboard</a></li>
                    <li><a class="dropdown-item" href="./product_info.html">Product Info</a></li>
                    <li><a class="dropdown-item" href="./flower.html">Flower</a></li>
                    <li><a class="dropdown-item" href="./user.html">User</a></li>
                </ul>
            </div>
              <a class="btn btn-danger" onclick="handleLogout()">Logout</a>
            `;
          } else {
            navElement.innerHTML += `
              <a href="./profile.html" class="btn btn-success">Home</a>
              <a class="btn btn-primary" href="./update_profile.html">Profile</a>
              <a href="./pass_change.html" class="btn btn-info">Password Change</a>
              <a class="btn btn-danger" onclick="handleLogout()">Logout</a>
            `;
          }
        });
    } else {
      navElement.innerHTML += `
        <a href="./index.html" class="btn btn-info">Home</a>
        <a href="./register.html" class="btn btn-success">SignUp</a>
        <a href="./contact_me.html" class="btn btn-primary">Contact Me</a>
        <a href="./login.html" class="btn btn-warning">Login</a>
      `;
    }
  });





  