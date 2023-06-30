import { initializeApp } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-app.js";
import {
  getDatabase,
  set,
  ref,
  get,
} from "https://www.gstatic.com/firebasejs/9.18.0/firebase-database.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/9.18.0/firebase-auth.js";
import {
  getStorage,
  uploadBytes,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/9.18.0/firebase-storage.js";
import { ref as sRef } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyB2OKGhqRYKTeNRGv6kyf3mU2ofmc0sFE4",
  authDomain: "style-maven.firebaseapp.com",
  databaseURL: "https://style-maven-default-rtdb.firebaseio.com",
  projectId: "style-maven",
  storageBucket: "style-maven.appspot.com",
  messagingSenderId: "389697690690",
  appId: "1:389697690690:web:64a7052084dfe9f3efa1db",
  measurementId: "G-VZFSLN8VCW",
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);
const storage = getStorage(app);
const productSubmit = document.getElementById("createProd");

document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".container");
  const closeShopping = document.querySelector(".closeShopping");
  const openShopping = document.querySelector(".shopping");
  const quantity = document.querySelector(".quantity");
  const body = document.querySelector("body");
  const listCard = document.querySelector(".listCard");
  const total = document.querySelector(".total");
  const signOut = document.querySelector(".signout");

  var myIndex = 0;

  openShopping.addEventListener("click", () => {
    body.classList.add("active");
  });

  closeShopping.addEventListener("click", () => {
    body.classList.remove("active");
  });

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

  const API_URL = "https://fakestoreapi.com/products";

  // Get the query parameter from the URL
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const id = urlParams.get("id");

  // Fetch data for a specific product based on its ID
  const getProduct = async (id) => {
    try {
      const url = `${API_URL}/${id}`;
      const res = await fetch(url);
      const data = await res.json();
      createProducts(data);
    } catch (error) {
      console.error("Error fetching product data:", error);
    }
  };

  const createProducts = (product) => {
    const newDiv = document.createElement("div");
    newDiv.classList.add("clickedProduct");
    newDiv.innerHTML = `
      <h1 class="d-flex justify-content-center mb-5 title-header">${
        product.category
      }</h1>
      <div class="d-flex gap-5 mt-4">
     <div class="col-6 d-flex justify-content-center">
       <img class="description-img" src="${product.image}" alt="${
      product.title
    }" <span>
           <span class="rate-desc">${product.rating?.rate}/5</span>
           <span class="star star-desc">★</span>
         </span>
     </div>
     <div class="col-6">
       <h1 class="description-h1">${product.title}</h1>
       <div class="description mt-4">${product.description}</div>
       <div class="desc-price mt-4">
         <span class="price-value">${product.price.toLocaleString()}$</span>
       </div>
       <div class="d-flex justify-content-center">
         <button class="addToCartBtn button-desc mt-4">Add to Cart</button>
       </div>
     </div>
   </div>
      `;

    container.appendChild(newDiv);

    const addToCartBtn = newDiv.querySelector(".addToCartBtn");
    addToCartBtn.addEventListener("click", () => {
      addToCart(product);
    });
  };

  getProduct(id);
});

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

const product_container = document.getElementById("product_container");
get(ref(database, "/products/cars/"))
  .then((snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val();
      console.log(data);

      const urlParams = new URLSearchParams(window.location.search);
      const carName = urlParams.get("name");
      const carId = urlParams.get("id");
      const dataArray = Object.values(data); // Convert data object to an array
      const car = dataArray.find(
        (car) => car.id == carId && car.model == carName
      );
      console.log(car);

      const productEl = document.createElement("container");
      productEl.innerHTML = `
        <div class="mt-5 product_info">
            <div class="name-desc text-center mb-4 mt-2"><b>model:</b> ${
              car.company
            } ${car.model}
            </div>
            <div class="row">
                  <div class="col-6">
                    <img class="description-image" src="${
                      car.image || car.img
                    }">
                  </div> 

              <div class="col-6 row align-items-center">
                <div class="col-1">
                </div>   
                <div class="col-5 mb-css">
                  <div class="mt-1"><b>price:</b> ${car.price} 
                  </div>
                  <div class="mt-1"><b>color:</b> ${car.color}</div>
                  <div class=" mt-1"><b>year:</b> ${car.year}</div>
                </div>   
              </div>  
            </div>
        </div>
      `;
      product_container.appendChild(productEl);

      function showCars(car) {
        const randomCars = car
          .sort(() => Math.random() - Math.random())
          .slice(0, 3);
        return randomCars;
      }

      // Usage
      const randomCarList = showCars(dataArray);

      const rowDiv = document.createElement("div");
      rowDiv.classList.add("row", "justify-content-center");
      randomCarList.forEach((car) => {
        const colDiv = document.createElement("div");
        colDiv.classList.add("col-4");

        const newDiv = document.createElement("div");
        newDiv.classList.add("mt-3", "items-desc");

        newDiv.innerHTML = `
    <img class="random-image" id="description" src="${car.image || car.img}">
    <div class="product_info text-center mb-5">
      <div class="product_name mt-2"><b>model:</b> ${car.company} ${
          car.model
        }</div>
      <div class="mt-1"><b>year:</b> ${car.year}</div>
      <div class="mt-1"><b>color:</b> ${car.color}</div>
      <div class="mt-1"><b>price:</b> ${car.price}</div>
    </div>
  `;

        colDiv.appendChild(newDiv);
        rowDiv.appendChild(colDiv);

        newDiv.addEventListener("click", () => {
          const carModel = car.model;
          const carId = car.id;
          window.location.href = `description.html?name=${carModel}&id=${carId}`;
        });
      });

      product_container.appendChild(rowDiv);
    } else {
      console.log("No data available");
    }
  })
  .catch((error) => {
    console.error(error);
    alert(error);
  });

function createListCard() {
  for (const key in listCards) {
    const product = listCards[key];
    if (product != null) {
      let newDiv = document.createElement("div");
      newDiv.classList.add("mt-5");
      newDiv.innerHTML = `
    <div class="desc-card">
         <div><img class="desc-imgCard" src="${product.image}"/></div>
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

// Add the changeQuantity function
window.changeQuantity = function (key, quantity) {
  if (quantity > 0) {
    listCards[key].quantity = quantity;
    saveDataToLocalStorage();
    reloadCard();
  } else {
    delete listCards[key];
    saveDataToLocalStorage();
    reloadCard();
  }
};

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

function addToCart(product) {
  if (listCards[product.id]) {
    listCards[product.id].quantity++;
  } else {
    listCards[product.id] = {
      id: product.id,
      image: product.image,
      title: product.title,
      price: product.price,
      quantity: 1,
    };
  }

  saveDataToLocalStorage();
  reloadCard();
}

loadDataFromLocalStorage();
createListCard();
calculateTotalPrice();

signOut.addEventListener("click", () => {
  localStorage.removeItem("accessToken");
  window.location.href = "register.html";
  alert("Logout successful. Thank you for using our services!");
});
