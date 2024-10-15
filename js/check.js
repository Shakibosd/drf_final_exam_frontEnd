// eta hocce jodi user unauthenticated hoy ar se jodi profile page er url taype kore tahole take login page e redairect kora hobe se jeno login kore authenticated hoy ase
const checks = () => {
  const authToken = localStorage.getItem("authToken");
  if (!authToken) {
    window.location.href = "./login.html";
  }
};
window.onload = checks;
