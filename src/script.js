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

export const createProducts = (products) => {
  products.forEach((product) => {
    const productEl = document.createElement("div");
    productEl.classList.add("product");
    // console.log(product.title);
    // Add code here to display each product element on the page
  });
};
getData();
