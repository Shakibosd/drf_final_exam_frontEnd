//footer all page
fetch("footer.html")
  .then((res) => res.text())
  .then((data) => {
    document.getElementById("footer").innerHTML = data;
    //footer current years
    const currentYear = new Date().getFullYear();
    console.log(currentYear);
    const footerText = document.getElementById("footer-text-year");
    footerText.innerHTML = `&copy; ${currentYear} Develop With By <b><a href="https://nazmus-shakib.netlify.app/" target="_blank">Nazmus Shakib</a></b>`;
  });
