import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-analytics.js";
import {
  getDatabase,
  ref,
  child,
  get,
  set,
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  setPersistence,
  browserSessionPersistence,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const firebaseConfig = {
	apiKey: "AIzaSyAWQ9yYaROeCBIhUIkwPFWFqMrMAmK0mog",
  	authDomain: "foodzy-870c4.firebaseapp.com",
  	databaseURL: "https://foodzy-870c4-default-rtdb.firebaseio.com",
  	projectId: "foodzy-870c4",
  	storageBucket: "foodzy-870c4.appspot.com",
  	messagingSenderId: "606043979290",
  	appId: "1:606043979290:web:ff51e11ab4c7024c77dba3",
  	measurementId: "G-CDTB5C8RVZ"
};

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const usernameInput = document.getElementById("username");
const SignUpButton = document.getElementById("SignUpButton");
const signUpCard = document.getElementById("signUpCard");
const nameHeader = document.getElementById("nameHeader");
const invalidEmail = document.getElementById("invalidEmail");
const switchSignup = document.getElementById("switchSignup");
const switchLogin = document.getElementById("switchLogin");
const switchButtons = document.getElementById("switchBtn");
const abcd = document.getElementById("abcd");
const loginButton = document.getElementById("LoginBtn");
const LoginContainer = document.getElementById("loginContainer");
const profileContainer = document.getElementById("profile");
const userNameSlot = document.getElementById("userNameSlot");
const emailSlot = document.getElementById("EmailSlot");
const loading = document.getElementById("loading");
const logOutBtn = document.getElementById("logOutButton");
const logOutBtnContainer = document.getElementById("LogOutBtnContainer");
const note = document.getElementById("note");

const addFavorite = document.getElementById("addFavorite");

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth();
const db = getDatabase();

// Set persistence
setPersistence(auth, browserSessionPersistence)
  .then(() => {})
  .catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    console.error(error);
  });

switchLogin.addEventListener("click", () => {
  usernameInput.style.display = "none";
  switchButtons.style.marginTop = "-77px";
  signUpCard.style.marginTop = "-22px";
  switchLogin.style.background = "#fdc461";
  switchSignup.style.background = "transparent";
  SignUpButton.style.display = "none";
  loginButton.style.display = "inline";
  abcd.innerText = "Login";
});

switchSignup.addEventListener("click", () => {
  usernameInput.style.display = "";
  switchButtons.style.marginTop = "-41px";
  signUpCard.style.marginTop = "-44px";
  switchLogin.style.background = "transparent";
  switchSignup.style.background = "#fdc461";
  SignUpButton.style.display = "inline";
  loginButton.style.display = "none";
  abcd.innerText = "SignUp";
});

onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/firebase.User
    const uid = user.uid;
    afterLoggedIn(user);
    // ...
  } else {
    // User is signed out
    // ...
  }
});

function afterLoggedIn(user) {
  profileContainer.style.display = "none";
  LoginContainer.style.display = "inline";
  loading.style.display = "none";
  localStorage.setItem("loggedIn", "true");
  loading.style.display = "flex";
  if (localStorage.getItem("loggedIn") == "true") {
    if (user) {
      // User is logged in
      localStorage.setItem("loggedIn", "true");
      LoginContainer.style.display = "none";
      profileContainer.style.display = "block";

      const dbRef = ref(db, `users/${user.uid}`);
      get(dbRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            userNameSlot.innerText = snapshot.val().username;
            emailSlot.innerText = snapshot.val().email;
            loading.style.display = "none";
            logOutBtnContainer.style.display = "flex";
          } else {
            console.log("No data available");
          }
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      // User is not logged in
      localStorage.setItem("loggedIn", "false");
      profileContainer.style.display = "none";
      LoginContainer.style.display = "inline";
      loading.style.display = "none";
      logOutBtnContainer.style.display = "none";
    }
  }
}

afterLoggedIn();

SignUpButton.addEventListener("click", (e) => {
  const email = emailInput.value;
  const password = passwordInput.value;
  const username = usernameInput.value;

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed up
      const user = userCredential.user;
      alert("Signed Up!");
      localStorage.setItem("loggedIn", "true");
      afterLoggedIn();

      // Set user data to Realtime Database
      set(ref(db, "users/" + user.uid), {
        username: username,
        email: email,
        password: password,
        subscribers: 2,
      });

      const dbRef = ref(getDatabase());
      get(child(dbRef, `users/${user.uid}`))
        .then((snapshot) => {
          if (snapshot.exists()) {
            userNameSlot.value = snapshot.val().username;
            afterLoggedIn();
            note.style.display = "block";
          } else {
            console.log("No data available");
          }
        })
        .catch((error) => {
          console.error(error);
          note.style.display = "none";
        });

      userNameSlot.innerText = username;
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;

      localStorage.setItem("loggedIn", "false");

      if (errorCode == "auth/invalid-email") {
        alert("Invalid Email!");
      }

      if (errorCode == "auth/email-already-in-use") {
        alert("Email is already in use, Login!");
      }

      if (errorCode == "auth/weak-password") {
        alert("Password must be 8 characters long");
      } else {
        alert(errorMessage);
      }
    });
});

loginButton.addEventListener("click", () => {
  const LoginEmail = emailInput.value;
  const LoginPass = passwordInput.value;
  signInWithEmailAndPassword(auth, LoginEmail, LoginPass)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      alert("Success!");
      localStorage.setItem("loggedIn", "true");
      afterLoggedIn();
      const dbRef = ref(getDatabase());
      get(child(dbRef, `users/${user.uid}`))
        .then((snapshot) => {
          if (snapshot.exists()) {
            userNameSlot.value = snapshot.val().username;
            afterLoggedIn();
            note.style.display = "flex";
          } else {
            console.log("No data available");
          }
        })
        .catch((error) => {
          console.error(error);
        });
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert(errorMessage);
      localStorage.setItem("loggedIn", "false");
      note.style.display = "none";
    });
});

logOutBtn.addEventListener("click", () => {
  signOut(auth)
    .then(() => {
      // Sign-out successful.
      profileContainer.style.display = "none";
      LoginContainer.style.display = "inline";
      loading.style.display = "none";
      logOutBtnContainer.style.display = "none";
    })
    .catch((error) => {
      // An error happened.
      alert(error.code);
    });
});
