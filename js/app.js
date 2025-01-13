//unauthentiacted landing page flower list show
const loadFlowers = () => {
  fetch("https://flower-seal-backend.vercel.app/flowers/flowers/")
    .then((response) => response.json())
    .then((data) => displayFlowers(data))
    .catch((error) => console.log(error));
};

const displayFlowers = (flowers) => {
  flowers.forEach((flower) => {
    const parent = document.getElementById("flower-container");
    const card = document.createElement("div");
    card.classList.add("col-sm-12", "col-md-6", "col-lg-4", "mb-4");

    card.innerHTML = `
      <div class="card bg-white text-dark pt-3 index_flower_card" style="border-radius: 15px;">
        <img src="${flower.image}" class="img-fluid mx-auto d-block" alt="${flower.title}" style="width:80%; height:210px; border-radius:10px;">
        <div class="card-body" style="height:230px;">
          <h6 class="card-title">Title : ${flower.title}</h6>
          <br>
          <p>Price : ${flower.price} ৳</p>
          <small>Category : </small>
          <small class="gradient-btn-2 w-50">${flower.category}</small>
          <br><br>
          <p class="card-text">Description : ${flower.description.slice(0, 20)}...</p>
        </div>
      </div>
    `;
    parent.appendChild(card);
  });
};

//function call
loadFlowers();
