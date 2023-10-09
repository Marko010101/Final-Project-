const openShopping = document.querySelector(".shopping");
const closeShopping = document.querySelector(".closeShopping");
const list = document.querySelector(".list");
const listCard = document.querySelector(".listCard");
const body = document.querySelector("body");
const total = document.querySelector(".total");
const quantity = document.querySelector(".quantity");
const showMore = document.querySelector(".showMore");
const signOut = document.querySelector(".signout");
const darkMode = document.querySelector(".dark-icon");
const header = document.getElementById("container-header");
const collectionElement = document.getElementById("collection");
const cartButtons = document.querySelectorAll(".addToCardBtn");
var myIndex = 0;
carousel();

function carousel() {
  var i;
  var x = document.getElementsByClassName("mySlides");
  for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";
  }
  myIndex++;
  if (myIndex > x.length) {
    myIndex = 1;
  }
  x[myIndex - 1].style.display = "block";
  setTimeout(carousel, 2000); // Change image every 2 seconds
}

let isDarkMode = false; // Initial state is not in dark mode

darkMode.addEventListener("click", () => {
  isDarkMode = !isDarkMode; // Toggle the dark mode state
  body.classList.toggle("dark", isDarkMode); // Apply or remove the "dark" class to body
  const collectionLinks = collectionElement.querySelectorAll("a");

  collectionLinks.forEach((link) => {
    link.classList.toggle("dark-link", isDarkMode); // Toggle the "dark-link" class on links
  });

  document.querySelector(".title-header").style.backgroundImage = isDarkMode
    ? "linear-gradient(to bottom, #F0FFFF, #DC143C)" // Apply gradient in dark mode
    : "none"; // Remove gradient when not in dark mode

  const addToCardButtons = document.querySelectorAll(".addToCardBtn");
  addToCardButtons.forEach((button) => {
    button.style.backgroundColor = isDarkMode ? "#4B0082" : "black"; // Toggle button color
  });
});

openShopping.addEventListener("click", () => {
  body.classList.add("active");
});

closeShopping.addEventListener("click", () => {
  body.classList.remove("active");
});

const Loading = (state) => {
  if (state == true) {
    const loader = document.getElementById("loader");
    loader.classList.remove("d-none");
  } else {
    const loader = document.getElementById("loader");
    loader.classList.add("d-none"); // Hide the loader
  }
  console.log(state);
};

const API_URL = "https://fakestoreapi.com/products";

export const getData = async () => {
  Loading(true);
  const res = await fetch(API_URL);
  const data = await res.json();
  console.log(data);
  createProducts(data);
};

let listCards = {};
let totalPrice = 0;
let count = 0;

export const createProducts = (products) => {
  const filteredProducts = products.filter((product) =>
    [1, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].includes(product.id)
  );

  filteredProducts.forEach((product, key) => {
    function initApp() {
      let newDiv = document.createElement("div");
      newDiv.classList.add("item");
      newDiv.innerHTML = `
        <img src="${product.image}" alt="${product.title}" />
        <div class="title">${product.title}</div>
        <div class="price">
           <span class="price-value">${product.price.toLocaleString()}$</span>
           <span class="rating"><span class="rate">${
             product.rating?.rate
           }/5</span><span class="star">★</span></span>
        </div>

        <button class="addToCardBtn">Add to Cart</button>
      `;
      list.appendChild(newDiv);
      Loading(false);

      const image = newDiv.querySelector("img");
      image.addEventListener("click", () => {
        const title = encodeURIComponent(product.title);
        const id = encodeURIComponent(product.id);
        window.location.href = `description.html?title=${title}&id=${id}`;
      });

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
    totalPrice += product.price * product.quantity;
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
  total.innerText = totalPrice.toLocaleString() + "$";
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
    const product = listCards[key];
    product.quantity = newQuantity;

    const priceDifference = (newQuantity - product.quantity) * product.price;
    product.price += priceDifference;
  }

  reloadCard();
};

getData();

signOut.addEventListener("click", () => {
  localStorage.removeItem("accessToken");
  window.location.href = "register.html";
  alert("Logout successful. Thank you for using our services!");
});
