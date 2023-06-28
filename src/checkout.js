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
      newDiv.classList.add("mt-5");
      newDiv.innerHTML = `
        <div class="flex">
          <div>
            <div class="product_img"><img class="" src="${
              product.image
            }" /></div>
          </div>
          <div class="info-prod">
            <div class="prod-title">${product.title}</div>
            <div class="quantity mt-3 d-flex">
               <button onclick="decrementQuantity(${key})">-</button>
               <div class="count ">${product.quantity}</div>
               <button onclick="incrementQuantity(${key})">+</button>
            </div>
             <div class="mt-3 font-price">${product.price.toLocaleString()}$</div>
          </div>
        </div>
      `;
      listCard.appendChild(newDiv);
    }
  }
}

function calculateTotalPrice() {
  totalPrice = Object.values(listCards).reduce(
    (total, product) => total + product.price * product.quantity,
    0
  );
  total.innerText = totalPrice.toLocaleString() + "$";
}

function saveDataToLocalStorage() {
  localStorage.setItem("listCards", JSON.stringify(listCards));
  calculateTotalPrice();
}

window.incrementQuantity = function (key) {
  listCards[key].quantity++;
  saveDataToLocalStorage();
  reloadCard();
};

window.decrementQuantity = function (key) {
  if (listCards[key].quantity > 1) {
    listCards[key].quantity--;
    saveDataToLocalStorage();
    reloadCard();
  } else {
    delete listCards[key];
    saveDataToLocalStorage();
    reloadCard();
  }
};

function reloadCard() {
  listCard.innerHTML = "";
  createListCard();
}

loadDataFromLocalStorage();
createListCard();
calculateTotalPrice();
