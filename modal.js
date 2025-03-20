import { loadWorksInModal, addWorkToGallery } from "./filters.js";

document.addEventListener("DOMContentLoaded", () => {
  const authToken = localStorage.getItem("authToken"); // Vérifier si l'utilisateur est connecté

  if (!authToken) {
    console.log("Utilisateur non connecté, la modale ne sera pas ajoutée.");
    return; // Ne pas ajouter la modale si l'utilisateur n'est pas connecté
  }

  console.log("777777777777777777 Utilisateur connecté, ajout de la modale.");

  const modalHTML = `
  <div id="modal" class="modal">
    <div class="modal-content">
      <button id="back-button" class="back-arrow" style="display: none">
        <img src="./assets/icons/Vector (2).png" alt="Retour" />
      </button>

      <span class="close">&times;</span>
      <h2>Galerie Photo</h2>

      <!-- Galerie des projets -->
      <div id="photo-gallery" class="modal-gallery">
        <div class="photo-item">
          <img src="../FrontEnd/assets/images/appartement-paris-x.png" alt="Photo 1" />
          <button class="delete-btn">&#128465;</button>
        </div>
        <div class="photo-item">
          <img src="../FrontEnd/assets/images/le-coteau-cassis.png" alt="Photo 2" />
          <button class="delete-btn">&#128465;</button>
        </div>
      </div>

      <!-- Bouton Ajouter une photo -->
        <hr id="gallery-separator" class="modal-separator">
      <button id="add-photo-btn">Ajouter une photo</button>

      <!-- Formulaire d'ajout de photo -->
      <form id="add-work-form">
        <div class="image-upload-container">
          <img src="./assets/icons/Vector (1).png" alt="icons" class="upload-icon" />
          <button type="button" class="upload-button">+ Ajouter photo</button>
          <p class="upload-text">jpg, png : 4mo max</p>
          <input type="file" id="image-upload-input" accept="image/png, image/jpeg" style="display: none" />
        </div>
        <img id="preview-image" style="display: none; max-width: 100%; height: auto; margin-top: 10px" />

         <div class="form-group">
    <label for="title">Titre</label>
    <input type="text" id="title" required />
</div>

<div class="form-group">
    <label for="category">Catégorie</label>
    <select id="category">
        <option value="0">Tous</option>
        <option value="1">Objets</option>
        <option value="2">Appartements</option>
        <option value="3">Hôtels & Restaurants</option>
    </select>
</div>
         <div class="separator"></div>
        <button type="submit" class="submit-button" disabled>Valider</button>
      </form>
    </div>
  </div>
`;

  // Ajouter la modale au body
  document.body.insertAdjacentHTML("beforeend", modalHTML);

  const submitButton = document.querySelector(".submit-button");
  const addPhotoBtn = document.getElementById("add-photo-btn");
  const backButton = document.getElementById("back-button");
  const modalGallery = document.querySelector(".modal-gallery");
  const addPhotoForm = document.getElementById("add-work-form");

  if (
    !submitButton ||
    !addPhotoBtn ||
    !backButton ||
    !modalGallery ||
    !addPhotoForm
  ) {
    console.error("Un ou plusieurs éléments de la modale sont introuvables !");
    return;
  }
  const gallerySeparator = document.getElementById("gallery-separator");

  addPhotoBtn.addEventListener("click", () => {
    modalGallery.style.display = "none";
    addPhotoForm.style.display = "block";
    backButton.style.display = "block";
    addPhotoBtn.style.display = "none";
    document.querySelector(".modal-content h2").textContent = "Ajout Photo";
    // Cacher la ligne séparatrice
    gallerySeparator.style.display = "none";
  });

  backButton.addEventListener("click", () => {
    modalGallery.style.display = "flex"; // Assurer que la galerie utilise flexbox
    modalGallery.style.flexWrap = "wrap"; // Garder les éléments bien positionnés
    modalGallery.style.gap = "10px";
    modalGallery.style.justifyContent = "flex-start";
    modalGallery.style.marginBottom = "40px";
    addPhotoForm.style.display = "none";
    backButton.style.display = "none";
    addPhotoBtn.style.display = "block";

    // Réafficher la ligne de séparation
    document.querySelector(".modal-separator").style.display = "block";
    //Correction ici : Remet le titre en "Galerie Photo"
    document.querySelector(".modal-content h2").textContent = "Galerie Photo";
  });
  // Charger les travaux dans la galerie modale
  loadWorksInModal();
  //  Soumission du formulaire d'ajout
  submitButton.addEventListener("click", async (event) => {
    event.preventDefault();
    const authToken = localStorage.getItem("authToken");

    if (!authToken) {
      console.error("Aucun token d'authentification !");
      return;
    }

    await addWork(authToken);
  });

  // Suppression d'image
  modalGallery.addEventListener("click", async function (event) {
    if (event.target.classList.contains("delete-btn")) {
      const photoItem = event.target.closest(".photo-item");
      const photoId = photoItem.dataset.id;

      if (!photoId) {
        console.error("ID de l'image introuvable.");
        return;
      }

      const token = localStorage.getItem("authToken");
      if (!token) {
        console.error(
          "Aucun token trouvé. L'utilisateur doit être authentifié."
        );
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:5678/api/works/${photoId}`,
          {
            method: "DELETE",
            headers: {
              Accept: "*/*",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(
            `Erreur lors de la suppression : ${response.statusText}`
          );
        }

        console.log(`Image ${photoId} supprimée avec succès.`);
        photoItem.remove();
      } catch (error) {
        console.error("Erreur de suppression :", error);
      }
    }
  });
});

// Cacher le modal au chargement
export function setupModal(authToken) {
  const modal = document.getElementById("modal");
  const closeModal = document.querySelector(".close");
  const editProjectsBtn = document.getElementById("edit-projects");
  const modalGallery = document.querySelector(".modal-gallery");
  const addPhotoForm = document.getElementById("add-work-form");
  const addPhotoBtn = document.getElementById("add-photo-btn");
  const backButton = document.getElementById("back-button");

  if (!modal) return;

  modal.style.display = "none";

  if (authToken && editProjectsBtn) {
    editProjectsBtn.addEventListener("click", (event) => {
      event.preventDefault();
      modal.style.display = "block";
      modalGallery.innerHTML = ""; // Nettoyer avant d'ajouter du contenu
      loadWorksInModal();

      addPhotoForm.style.display = "none";
      backButton.style.display = "none";
      addPhotoBtn.style.display = "block";
    });
  }

  if (closeModal) {
    closeModal.addEventListener("click", () => {
      modal.style.display = "none";
    });
  }

  window.addEventListener("click", (event) => {
    if (event.target === modal) modal.style.display = "none";
  });
}

// Fonction corrigée pour ajouter un projet
export async function addWork(authToken) {
  const formData = new FormData();
  const titleInput = document.getElementById("title");
  const categorySelect = document.getElementById("category");
  const imageInput = document.getElementById("image-upload-input");

  if (
    !titleInput.value.trim() ||
    !categorySelect.value ||
    !imageInput.files[0]
  ) {
    console.log("Merci de remplir tous les champs !");
    return;
  }
  console.log("******************** Données envoyées à l'API :", [
    ...formData.entries(),
  ]);

  const categoryValue = parseInt(categorySelect.value, 10);

  formData.append("title", titleInput.value.trim());
  formData.append("category", categoryValue);
  formData.append("image", imageInput.files[0]);

  try {
    const response = await fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: { Authorization: `Bearer ${authToken}` },
      body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        `Erreur API: ${response.status} - ${JSON.stringify(result, null, 2)}`
      );
    }

    console.log("Travail ajouté avec succès !");
    addWorkToGallery(result);
    //Rafraîchir la galerie de la modale immédiatement
    await loadWorksInModal();
    // Revenir à la galerie après l'ajout
    document.getElementById("add-work-form").style.display = "none";
    document.querySelector(".modal-gallery").style.display = "flex";
    document.getElementById("add-photo-btn").style.display = "block";
    document.getElementById("back-button").style.display = "none";
    document.querySelector(".modal-content h2").textContent = "Galerie Photo";
    document.querySelector(".modal-separator").style.display = "block";
  } catch (error) {
    console.error(" Erreur lors de l'ajout du travail :", error);
  }
}
