const loginButton = document.getElementById("login-button");
const loginUsername = document.getElementById("username");
const loginPassword = document.getElementById("password");
const openModalButton = document.getElementById("openModalButton");
const loginModal = document.getElementById('login');
const showLoginButton = document.getElementById("showLoginButton");
const cancel = document.getElementById("NULL");

const isLogged = sessionStorage.getItem("Logged") === "true";

if (isLogged) {
  openModalButton.style.display = "block";
} else {
  openModalButton.style.display = "none";
}

showLoginButton.onclick = () => {
    loginModal.style.display = "block";
  };

cancel.onclick = () => {
  loginModal.style.display = "none";
}

// Funzione per il login
const login = async (username, password) => {
  try {
    const confResponse = await fetch("../conf.json");
    if (!confResponse.ok) throw new Error("Errore nel caricamento di conf.json");
    const confData = await confResponse.json();

    const response = await fetch("https://ws.cipiaceinfo.it/credential/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        key: confData.cacheToken,
      },
      body: JSON.stringify({ username, password }),
    });
    if (!response.ok) throw new Error("Errore nel login");

    const result = await response.json();

    if (result.result === true) {
      alert("Login effettuato con successo!");
      sessionStorage.setItem("Logged", "true");
      openModalButton.style.display = "block";
      loginModal.style.display = "none";
    } else {
      alert("Credenziali errate.");
      loginModal.style.display = "none";
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