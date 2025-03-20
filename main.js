import { checkAuth } from "./auth.js";
import { loadWorks } from "./filters.js";
import { setupModal } from "./modal.js";
import { setupFormValidation } from "./formValidation.js";

document.addEventListener("DOMContentLoaded", async () => {
  const authToken = localStorage.getItem("authToken");

  checkAuth();
  await loadWorks();

  //  Gérer l'affichage des filtres et du bouton Modifier
  const filtersContainer = document.getElementById("filters-container");
  const editProjectsButton = document.getElementById("edit-projects");

  if (authToken) {
    //  Si l'utilisateur est connecté, cacher les filtres et afficher "Modifier"
    if (filtersContainer) {
      filtersContainer.style.display = "none";
    }
    if (editProjectsButton) {
      editProjectsButton.style.display = "block";
    }

    //  Ajouter le BANDEAU noir "Mode édition"
    addEditModeBanner();
  } else {
    //  Si l'utilisateur n'est pas connecté, afficher les filtres et cacher "Modifier"
    if (editProjectsButton) {
      editProjectsButton.style.display = "none";
    }
    if (filtersContainer) {
      filtersContainer.style.display = "flex";
    }
  }

  setupModal(authToken);
  setupFormValidation();
});

function addEditModeBanner() {
  // Vérifier si le bandeau existe déjà pour éviter les doublons
  if (document.getElementById("edit-mode-banner")) return;

  const editBanner = document.createElement("div");
  editBanner.id = "edit-mode-banner";

  const editIcon = document.createElement("img");
  editIcon.src = "./assets/icons/Vector.png";
  editIcon.alt = "Mode édition";
  editIcon.classList.add("edit-icon");

  const editText = document.createElement("span");
  editText.textContent = " Mode édition";

  editBanner.appendChild(editIcon);
  editBanner.appendChild(editText);
  document.body.prepend(editBanner);

  // Ajoute UNIQUEMENT dans le `body` et PAS dans le modal
  document.body.prepend(editBanner);
}
