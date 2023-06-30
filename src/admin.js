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

productSubmit.addEventListener("click", (e) => {
  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const rating = document.getElementById("rating").value;
  const category = document.getElementById("category").value;
  const price = document.getElementById("price").value;
  const fileInput = document.getElementById("fileInput");
  const file = fileInput.files[0];
  console.log(file);

  let timestamp = new Date().getTime();
  const fileName = timestamp + file?.name;
  console.log("test", fileName);

  if (file === undefined) {
    const uid = Math.floor(Math.random() * 100000000000000000);

    set(ref(database, "products/" + uid), {
      title: title,
      description: description,
      rating: rating,
      category: category,
      image: null,
      id: uid,
      price: price,
    })
      .then(() => {
        alert("Product Added");
      })
      .catch((error) => {
        console.error(error);
        alert(error);
      });
  } else {
    const uid = Math.floor(Math.random() * 100000000000000000);
    const storageRef = sRef(storage, "images/" + fileName);

    uploadBytes(storageRef, file)
      .then((snapshot) => {
        console.log(snapshot);
        console.log("Uploaded a blob or file!");
      })
      .then(() => {
        getDownloadURL(storageRef)
          .then((url) => {
            console.log(url);
            document.getElementById("image").innerHTML = `
            <img class="product_image mt-3" src="${url}" alt="" />
          `;
            set(ref(database, "products/" + uid), {
              title: title,
              description: description,
              rating: rating,
              category: category,
              image: url ? url : "",
              id: uid,
              price: price,
            });
          })
          .then(() => {
            alert("Product Added");
          })
          .catch((error) => {
            console.error(error);
            alert(error);
          });
      });
  }
});
if (localStorage.getItem("accessToken")) {
} else {
  window.location.href = "register.html";
  alert(
    "To access the full functionality of our website, please register and create an account. We're excited to have you on board!"
  );
}
