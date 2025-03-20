document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  const errorMessage = document.getElementById("error-message");

  loginForm.addEventListener("submit", async (event) => {
    // Empêche le rechargement de la page
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      const response = await fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Connexion réussie !");
        // Stocke le token dans le LocalStorage
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("userId", data.userId);

        // Redirige vers la page d'accueil
        window.location.href = "index.html";
      } else {
        console.log("Identifiants incorrects !");
        errorMessage.textContent =
          "Identifiants incorrects. Veuillez réessayer.";
        errorMessage.style.display = "block";
      }
    } catch (error) {
      console.error("Erreur de connexion :", error);
      errorMessage.textContent =
        "Une erreur est survenue. Réessayez plus tard.";
      errorMessage.style.display = "block";
    }
  });
});
