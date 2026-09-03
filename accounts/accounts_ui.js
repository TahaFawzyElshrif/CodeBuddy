

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-analytics.js";
import { getAuth,  onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";
import {BACKEND_HOST,SETHFToken} from "../scripts/utils.js";
import {loginWithGoogle} from "./accounts_view.js";
import { updateAuthUI } from "../scripts/general_scripts_VIEW.js";

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

async function loginWithHuggingFace() {
  //window.location.href = BACKEND_HOST + "/auth/huggingface";
  await Swal.fire({
    title: "لاسف هذه الخاصية غير متاحة حاليا",
    confirmButtonText: "ok",
    confirmButtonColor: "#4285F4",
  });
}

async function showAccountOptions() {
  const result = await Swal.fire({
    title: "اختار طريقة تسجيل الدخول",
    showDenyButton: true,
    confirmButtonText: "Google",
    denyButtonText: "Hugging Face",
    confirmButtonColor: "#4285F4",
    denyButtonColor: "#2A2A2A"
  });

  if (result.isConfirmed) {
    await Account();
    SETHFToken();
  } else if (result.isDenied) {
    await loginWithHuggingFace();
  }
}

const accountBtn = document.getElementById("account_btn");
if (accountBtn) {
  accountBtn.addEventListener("click", () => {
    try {
      if (current_user["UID"] !== "") {
          //Account();
              showAccountOptions();

        
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
    console.log("Email:",window.current_email);
    console.log("Name:",window.displayName);
    updateAuthUI();
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
        //Account();
            showAccountOptions();

       // SETHFToken();
      }
    });
  }
});

