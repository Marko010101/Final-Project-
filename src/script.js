const openShopping = document.querySelector(".shopping");
const closeShopping = document.querySelector(".closeShopping");
const list = document.querySelector(".list");
const listCard = document.querySelector(".listCard");
const body = document.querySelector("body");
const total = document.querySelector(".total");
const quantity = document.querySelector(".quantity");
const main = document.querySelector(".main");

openShopping.addEventListener("click", () => {
  body.classList.add("active");
});

closeShopping.addEventListener("click", () => {
  body.classList.remove("active");
});

const API_URL = "https://fakestoreapi.com/products";

export const getData = async () => {
  const res = await fetch(API_URL);
  const data = await res.json();
  console.log(data);
  createProducts(data);
};

let listCards = {};
let totalPrice = 0;
let count = 0;

export const createProducts = (products) => {
  products.forEach((product, key) => {
    const productEl = document.createElement("div");
    productEl.classList.add("product");

    function initApp() {
      let newDiv = document.createElement("div");
      newDiv.classList.add("item");
      newDiv.innerHTML = `
        <img src="${product.image}" alt="${product.title}" />
        <div class="title">${product.title}</div>
        <div class="price">
           <span class="price-value">${product.price.toLocaleString()}$</span>
           <span class="rating">${product.rating?.rate}/5★</span>
        </div>

        <button class="addToCardBtn">Add to Card</button>
      `;
      list.appendChild(newDiv);

      const addToCardBtn = newDiv.querySelector(".addToCardBtn");
      addToCardBtn.addEventListener("click", () => {
        addToCard(key);
      });
    }

    initApp();

    function addToCard(key) {
      if (listCards[key] == null) {
        listCards[key] = { ...product, quantity: 1 };
      } else {
        listCards[key].quantity++;
      }
      saveDataToLocalStorage();
      reloadCard();
    }
  });

  loadDataFromLocalStorage();
  reloadCard();
};

function reloadCard() {
  listCard.innerHTML = "";
  totalPrice = 0;
  count = 0;
  for (const key in listCards) {
    const product = listCards[key];
    totalPrice += product.price;
    count += product.quantity;

    if (product != null) {
      let newDiv = document.createElement("li");
      newDiv.innerHTML = `
        <div><img src="${product.image}"/></div>
        <div class="text-white p-2">${product.title}</div>
        <div class="text-white">${product.price.toLocaleString()}$</div>
        <div>
          <button onclick="changeQuantity(${key}, ${
        product.quantity - 1
      })">-</button>
          <div class="count text-white">${product.quantity}</div>
          <button onclick="changeQuantity(${key}, ${
        product.quantity + 1
      })">+</button>
        </div>
      `;
      listCard.appendChild(newDiv);
    }
  }
  total.innerText = totalPrice.toLocaleString();
  quantity.innerText = count;
  saveDataToLocalStorage();
}

function saveDataToLocalStorage() {
  localStorage.setItem("listCards", JSON.stringify(listCards));
}

function loadDataFromLocalStorage() {
  const data = localStorage.getItem("listCards");
  if (data) {
    listCards = JSON.parse(data);
  }
}

window.changeQuantity = function (key, newQuantity) {
  if (newQuantity <= 0) {
    delete listCards[key];
  } else {
    listCards[key].quantity = newQuantity;
    listCards[key].price = newQuantity * listCards[key].price;
  }

  reloadCard();
};

getData();
