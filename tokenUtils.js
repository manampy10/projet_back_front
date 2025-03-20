// Gestion des tokens JWT

// Fonction pour décoder un token JWT
export function decodeToken(token) {
  try {
    const payloadBase64 = token.split(".")[1]; // Récupérer la partie payload
    const payloadDecoded = atob(payloadBase64); // Décoder Base64 → JSON
    return JSON.parse(payloadDecoded); // Convertir en objet JavaScript
  } catch (error) {
    console.error("Erreur lors du décodage du token :", error);
    return null;
  }
}

// 🔍 Vérifie si le token est encore valide
export function isTokenValid(token) {
  const decodedToken = decodeToken(token);

  if (!decodedToken || !decodedToken.exp) {
    console.warn("Token invalide ou sans expiration.");
    return false;
  }
  //permet de vérifier si un token JWT est encore valide en comparant son expiration (exp) avec l'heure actuelle.
  const currentTimestamp = Math.floor(Date.now() / 1000); // Date actuelle, convertit en secondes UNIX
  return decodedToken.exp > currentTimestamp; // Compare expiration avec maintenant
}

// Récupère le token depuis localStorage
export function getToken() {
  return localStorage.getItem("authToken");
}

//  Supprime le token (déconnexion)
export function removeToken() {
  console.log(" Suppression du token...");
  localStorage.removeItem("authToken");
  localStorage.removeItem("userId");
}
