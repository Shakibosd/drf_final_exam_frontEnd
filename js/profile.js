// Flower filter
document.addEventListener("DOMContentLoaded", () => {
  const filterList = document.getElementById("filter-list");
  const flowerContainer = document.getElementById("flower-container");

  fetchFlowers("all");

  filterList.addEventListener("click", (e) => {
    if (e.target.tagName === "LI") {
      const filter = e.target.getAttribute("data-filter");
      fetchFlowers(filter);
    }
  });

  function fetchFlowers(filter) {
    fetch("https://flower-seal-backend.vercel.app/flowers/flowers/")
      .then((res) => res.json())
      .then((data) => {
        let filteredFlowers = data;
        if (filter !== "all") {
          filteredFlowers = data.filter((flower) => flower.category === filter);
        }
        displayFlowers(filteredFlowers);
      })
      .catch((error) => console.error("Error fetching flowers:", error));
  }

  //flower display
  function displayFlowers(flowers) {
    const flowerContainer = document.getElementById("flower-container");
    flowerContainer.innerHTML = "";

    flowers.forEach((flower) => {
      const flowerCard = document.createElement("div");
      flowerCard.classList.add("col-sm-12", "col-md-6", "col-lg-4", "mb-4");

      flowerCard.innerHTML = `
        <div class="card bg-white text-dark pt-3 index_flower_card" style="border-radius:15px;">
          <img src="${flower.image}" class="img-fluid mx-auto d-block" alt="${
        flower.title
      }" style="width:80%; height:210px; border-radius:10px;">
          <div class="card-body">
            <h6 class="card-title">Title: ${flower.title}</h6>
            <p>Price: ${flower.price} ৳</p>
            Category: <small class="btn btn-secondary btn-sm">${
              flower.category
            }</small>
            <p>Stock: ${flower.stock}</p>
            <p class="card-text">Description: ${flower.description.slice(
              0,
              20
            )}...</p>
            <a class="btn btn-primary btn-sm w-50" href="./flower_details.html?id=${
              flower.id
            }">Details</a>
          </div>
        </div>
      `;

      flowerContainer.appendChild(flowerCard);
    });

    const flowerCountElement = document.getElementById("flower-count");
    flowerCountElement.innerText = `Total Flowers: ${flowers.length} !`;
    flowerCountElement.style.color = "unset";
  }
});

// flower tips
document.addEventListener("DOMContentLoaded", function () {
  const careTipsContainer = document.getElementById("care-tips");

  const apiURL = "https://flower-seal-backend.vercel.app/flowers/care-tips/";

  fetch(apiURL)
    .then((response) => response.json())
    .then((data) => {
      data.forEach((tip) => {
        const tipCard = document.createElement("div");
        tipCard.classList.add("care-tip-card");

        tipCard.innerHTML = `
                  <h2>Plant Name : ${tip.plant_name}</h2>
                  <p><strong>Symptoms : </strong> ${tip.symptoms}</p>
                  <p><strong>Revival Steps : </strong> ${
                    tip.revival_steps
                  }</p>
                  <p><strong>Recommended Fertilizer : </strong> ${tip.recommended_fertilizer}</p>
                  <p><strong>Watering Caution : </strong> ${tip.watering_caution}</p>
                  <p><strong>Sunlight Adjustment : </strong> ${tip.sunlight_adjustment}</p>
                  <p><strong>Sunlightn Needs : </strong> ${tip.sunlight_needs}</p>
                  <p><strong>Recommended Water Frequency : </strong> ${tip.recommended_water_frequency}</p>
                  <p><strong>Created At : </strong> ${tip.created_at}</p>
                  <p><strong>Updated At : </strong> ${tip.updated_at}</p>
                  <p class="special-notes"><strong>Special Notes : </strong> ${
                    tip.special_notes || "No special notes"
                  }</p>
              `;

        careTipsContainer.appendChild(tipCard);
      });
    })
    .catch((error) => {
      console.error("Error fetching care tips:", error);
    });
});
