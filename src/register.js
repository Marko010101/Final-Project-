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

const email = document.getElementById("email");
const password = document.getElementById("password");
const form = document.getElementById("form");
const signOut = document.querySelector(".signout");
// registation
form.addEventListener("submit", (e) => {
  e.preventDefault();
  console.log(email.value, password.value);
  createUserWithEmailAndPassword(auth, email.value, password.value)
    .then((userCredential) => {
      // Registration
      const user = userCredential.user;
      localStorage.setItem("accessToken", user.accessToken);
      console.log(user);
      alert("You have registered successfully!");
    })

    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
    });
});
if (localStorage.getItem("accessToken")) {
  window.location.href = "index.html";
}
const signEmail = document.getElementById("signemail");
const signPassword = document.getElementById("signpassword");
const signIn = document.getElementById("signIn");

signIn.addEventListener("submit", (e) => {
  e.preventDefault();
  signInWithEmailAndPassword(auth, signEmail.value, signPassword.value)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      console.log(user.accessToken);
      localStorage.setItem("accessToken", user.accessToken);

      if (user) {
        window.location.href = "admin.html";
      } else {
        alert("Email or Password is incorrect");
      }
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert("An error occurred during sign-in. Please try again.");
    });
});

if (localStorage.getItem("accessToken")) {
  window.location.href = "admin.html";
}

signOut.addEventListener("click", () => {
  localStorage.removeItem("accessToken");
  window.location.href = "register.html";
  alert("Logout successful. Thank you for using our services!");
});
