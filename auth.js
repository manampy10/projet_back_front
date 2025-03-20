//Ce fichier vérifie la connexion et /déconnexion
import { isTokenValid, removeToken } from "./tokenUtils.js";

//Cette fonction est exécutée dès que la page se charge.
export function checkAuth() {
  const authToken = localStorage.getItem("authToken");
  const loginButton = document.querySelector("nav ul li a[href='login.html']");

  //Si le token est absent ou expiré
  if (!authToken || !isTokenValid(authToken)) {
    removeToken();
    return;
  }

  // Remplace le bouton "Login" par "Logout"
  if (loginButton) {
    const logoutButton = document.createElement("a");
    logoutButton.href = "#";
    logoutButton.id = "logout";
    logoutButton.textContent = "Logout";
    loginButton.replaceWith(logoutButton);

    //Gérer la déconnexion, rafraichit la page après le chargement.
    logoutButton.addEventListener("click", () => {
      removeToken();
      window.location.reload();
    });
  }

  verifyAuth(authToken);
}
async function verifyAuth(authToken) {
  try {
    const response = await fetch("http://localhost:5678/api/works", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (!response.ok) throw new Error(`Accès refusé (${response.status})`);
    console.log("Accès autorisé !");
  } catch (error) {
    console.error("Erreur d'accès à la route protégée :", error.message);
    removeToken();
  }
}
