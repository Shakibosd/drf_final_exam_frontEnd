fetch("navbar.html")
  .then((res) => res.text())
  .then((data) => {
    document.getElementById("navbar").innerHTML = data;

    const navElement = document.getElementById("nav-element");
    const token = localStorage.getItem("authToken");

    if (token) {
      fetch("https://flower-seals.onrender.com/admins/is_admin/", {
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
              <a href="./admin_deshboard.html" class="btn btn-warning">Admin Dashboard</a>
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
