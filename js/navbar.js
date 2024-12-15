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
            <h5><a href="./profile.html" class="nav_border" style="text-decoration: none; color: black;"><b>Home</b></a></h5>
            <h5><a class="nav_border" style="text-decoration: none; color: black;" href="./update_profile.html"><b>Profile</b></a></h5>
            <h5>
              <a class="nav_border" href="./pass_change.html" style="text-decoration: none; color: black;"><b>Password Change</b></a>
            </h5>
            <h5>
              <div class="dropdown">
                <a style="text-decoration: none; color: black;" class="dropdown-toggle nav_border" type="button" data-bs-toggle="dropdown"
                  aria-expanded="false">
                  <b>Admin</b>
                </a>
                <ul class="dropdown-menu">
                    <li><a class="dropdown-item" href="./admin_deshboard.html"><b>Deshboard</b></a></li>
                    <li><a class="dropdown-item" href="./product_info.html"><b>Product Info</b></a></li>
                    <li><a class="dropdown-item" href="./flower.html"><b>Flower</b></a></li>
                    <li><a class="dropdown-item" href="./user.html"><b>User</b></a></li>
                </ul>
              </div>
            </h5>
            <h5>
              <a style="text-decoration: none; color: black;" onclick="handleLogout()"><b>Logout</b></a>
            </h5>
            `;
          } else {
            navElement.innerHTML += `
            <h5><a href="./profile.html" class="nav_border" style="text-decoration: none; color: black; "><b>Home</b></a></h5>
            <h5><a class="nav_border" style="text-decoration: none; color: black;" href="./update_profile.html"><b>Profile</b></a></h5>
            <h5><a class="nav_border" href="./pass_change.html" style="text-decoration: none; color: black;"><b>Password Change</b></a></h5>
            <h5><a style="text-decoration: none; color: black;" onclick="handleLogout()"><b>Logout</b></a></h5>
            `;
          }
        });
    } else {
      navElement.innerHTML += `
        <h5><a class="nav_border" href="./index.html" style="text-decoration: none; color: black;"><b>Home</b></a></h5>
        <h5><a class="nav_border" href="./register.html" style="text-decoration: none; color: black;"><b>Signup</b></a></h5>
        <h5><a class="nav_border" href="./contact_me.html" style="text-decoration: none; color: black;"><b>Contact</b></a></h5>
        <h5><a class="nav_border" href="./login.html" style="text-decoration: none; color: black;"><b>Login</b></a></h5>
        `;
    }
  });