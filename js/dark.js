//website dark mode er code
document.addEventListener("DOMContentLoaded", function () {
  const darkModeToggle = document.getElementById("dark-mode-toggle");
  const body = document.body;

  const isDarkMode = localStorage.getItem("darkMode") === "true";
  setDarkMode(isDarkMode);
  darkModeToggle.checked = isDarkMode;

  darkModeToggle.addEventListener("change", () => {
    const isDarkMode = darkModeToggle.checked;
    setDarkMode(isDarkMode);
    localStorage.setItem("darkMode", isDarkMode);
  });

  function setDarkMode(isDarkMode) {
    if (isDarkMode) {
      body.classList.add("dark-mode");
    } else {
      body.classList.remove("dark-mode");
    }
  }
});
