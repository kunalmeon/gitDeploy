import { login } from "./login";
import "@babel/polyfill";
// stipe a cont..) 
import {bookTour} from './stripe'
//select button
const bookBtn=document.getElementById('book-tour')
//call bookng function with the tour id
if(bookBtn){
    bookBtn.addEventListener('click',e=>{
        const tourid=e.target.dataset.tourId;
        bookTour(tourid)
    })
//once we pass the id in bookTour, now we have session coming from API so let us go to the stripe.js file
}

const form = document.querySelector(".form");
if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    login(email, password);
  });
}

import { logout } from "./login";
const logoutBtn = document.querySelector(".logOut");
if (logoutBtn) {
  logoutBtn.addEventListener("click", logout);
}

import { updateSettings } from "./updateSettings";

const userAccoutUpdateForm = document.querySelector(".form-user-data");
if (userAccoutUpdateForm) {
  userAccoutUpdateForm.addEventListener("submit", (e) => {
    const multiPartFormData = new FormData();
    e.preventDefault();
    multiPartFormData.append("name", document.getElementById("name").value);
    multiPartFormData.append("email", document.getElementById("email").value);
    multiPartFormData.append(
      "photo",
      document.getElementById("photo").files[0]
    );

    updateSettings(multiPartFormData, "data");
  });
}

const passwordForm = document.querySelector(".passwordUpdateForm");
if (passwordForm) {
  passwordForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    document.querySelector(".password-button ").value = "Updating...";

    const currentPassword = document.getElementById("password-current").value;
    const newPassword = document.getElementById("password").value;
    const confirmNewPassword = document.getElementById("password-confirm")
      .value;

    await updateSettings(
      { currentPassword, newPassword, confirmNewPassword },
      "password"
    );

    document.querySelector(".password-button ").value = "Save Password";

    document.getElementById("password-current").value = " ";
    document.getElementById("password").value = " ";
    document.getElementById("password-confirm").value = " ";
  });
}
