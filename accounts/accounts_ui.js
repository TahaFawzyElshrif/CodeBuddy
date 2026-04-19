

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-analytics.js";
import { getAuth,  onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";
import {BACKEND_HOST} from "../scripts/utils.js";
import {loginWithGoogle} from "./accounts_view.js";

/*
Initialize Firebase 
*/
const firebaseConfigAPI =
  await fetch(BACKEND_HOST + "/config/firebase", {
    method: "GET",
  });
const firebaseConfig = await firebaseConfigAPI.json();

const app = initializeApp(firebaseConfig);
getAnalytics(app);
const auth = getAuth(app);
var current_user;

/* 
Sign in / up Methods
*/
async function Account() {
  const login_creds = await loginWithGoogle(auth);
  return login_creds;
}

const accountBtn = document.getElementById("account_btn");
if (accountBtn) {
  accountBtn.addEventListener("click", () => {
    try {
      if (current_user["UID"] !== "") {
          Account();
        
      }
      
    } catch (error) {
      if (
        error.code === "auth/popup-blocked" ||
        error.code === "auth/cancelled-popup-request"
      ) {
        console.warn("Popup issue ignored:", error.code);
        return;
      }
    }
  });
}



/*
Token and loging in state checking
*/

 
onAuthStateChanged(auth,async (user) => {
  if (user) { 
    current_user = user;
    console.log("User is logged in");
    window.current_jwt = await user.getIdToken() ;
    window.current_uid = await user.uid ;
    //window.current_uid = "u1"; // temp for testing
    window.current_email = await user.email ;
    //window.current_email = "cds.TahaFawzy66557@alexu.edu.eg"; // temp for testing
    window.displayName = await user.displayName ;
    console.log("UID:", window.current_uid);
    console.log("Email:",window.current_email);
    console.log("Name:",window.displayName);
    

    document.getElementById("src_account").src = "images/profile.png";
    document.getElementById("submit_button").disabled = false;

  } else {
    current_user = { "UID": "" };
    document.getElementById("src_account").src = "images/user.png";
    document.getElementById("submit_button").disabled = true;

    Swal.fire({
      icon: 'warning',
      title: 'Session expired',
      text: " عذرا للمقاطعة ! ياريت تسجل دخول عشان تشتغل كل الخدمات ",
      showConfirmButton: true,
      timer: 3000,
      confirmButtonText: 'تمام',

    }).then((result) => {
      if (result.isConfirmed) {
        Account();
       // SETHFToken();
      }
    });
  }
});

