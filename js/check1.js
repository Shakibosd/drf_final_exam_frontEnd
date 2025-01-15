// eta hocce jodi user authenticated hoy ar se jodi signup page er url taype kore tahole take update_profile page e redairect kora hobe se jeno signup er page access korte pare na
const checks1 = () => {
  const authToken = localStorage.getItem("authToken");
  const username = localStorage.getItem("username");
  if (authToken) {
    window.location.href = `./profile.html?YourUserName=${username}`;
  }
};

window.onload = checks1;