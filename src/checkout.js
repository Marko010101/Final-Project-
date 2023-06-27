const listCard = document.querySelector(".listCard");
const total = document.querySelector(".total");

let listCards = {};
let totalPrice = 0;

function loadDataFromLocalStorage() {
  const data = localStorage.getItem("listCards");
  if (data) {
    listCards = JSON.parse(data);
  }
}

function createListCard() {
  for (const key in listCards) {
    const product = listCards[key];
    if (product != null) {
      let newDiv = document.createElement("div");
      newDiv.innerHTML = `
        <div class="product_img"><img src="${product.image}" /></div>
        <div class="text-white p-2">${product.title}</div>
        <div class="text-white">${product.price.toLocaleString()}$</div>
        <div class="text-white">${product.quantity}</div>
      `;
      listCard.appendChild(newDiv);
    }
  }
}

function calculateTotalPrice() {
  totalPrice = Object.values(listCards).reduce(
    (total, product) => total + product.price,
    0
  );
  total.innerText = totalPrice.toLocaleString() + "$";
}

loadDataFromLocalStorage();
createListCard();
calculateTotalPrice();
