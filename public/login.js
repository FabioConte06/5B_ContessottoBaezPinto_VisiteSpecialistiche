
const loginButton = document.getElementById("login-button");
const privateSection = document.getElementById("admin-page");
const loginUsername = document.getElementById("username");
const loginPassword = document.getElementById("password");
const adminContent = document.getElementById("admin-content");
const loginForm = document.getElementById("login-form"); 

const adminAccessButton = document.getElementById("admin-access-button");
const publicPage = document.getElementById("public-page");


const isLogged = sessionStorage.getItem("Logged") === "true";

if (privateSection) {
  if (isLogged) {
    privateSection.style.display = "block";
    if (publicPage) {
      publicPage.style.display = "none";
    }
    if (loginForm) {
      loginForm.style.display = "none"; 
    }
    if (adminContent) {
      adminContent.style.display = "block";
    }
  } else {
    privateSection.style.display = "none";
    if (loginForm) {
      loginForm.style.display = "block";
    }
  }
}

// Funzione per il login
const login = async (username, password) => {
  try {
    const confResponse = await fetch("conf.json");
    if (!confResponse.ok) throw new Error("Errore nel caricamento di conf.json");
    const confData = await confResponse.json();

    const response = await fetch("https://ws.cipiaceinfo.it/credential/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        key: confData.token,
      },
      body: JSON.stringify({ username, password }),
    });
    if (!response.ok) throw new Error("Errore nel login");

    const result = await response.json();

    if (result.result === true) {
      alert("Login effettuato con successo!");
      sessionStorage.setItem("Logged", "true");
      if (privateSection) {
        privateSection.style.display = "block";
      }
      if (publicPage) {
        publicPage.style.display = "none";
      }
      if (adminContent) {
        adminContent.style.display = "block";
      }
      if (loginForm) {
        loginForm.style.display = "none"; 
      }
    } else {
      alert("Credenziali errate.");
    }
  } catch (error) {
    console.error("Errore login:", error);
    alert("Login fallito. Controlla le credenziali.");
  }
};


if (loginButton) {
  loginButton.onclick = () => {
    const username = loginUsername.value;
    const password = loginPassword.value;

    if (username !== "" && password !== "") {
      login(username, password);
    } else {
      alert("Compila tutti i campi.");
    }
  };
}



if (adminAccessButton && publicPage && privateSection) {
  adminAccessButton.onclick = () => {
    publicPage.style.display = "none";
    privateSection.style.display = "block";
  };
}