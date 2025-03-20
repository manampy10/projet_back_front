////////////////////////////////////////////////////////// Étape 1.2 : Filtrage des Travaux par Catégorie //////////////////////////////////////////////////////
export async function loadWorks() {
  const gallery = document.querySelector(".gallery");

  try {
    // Récupérer les travaux depuis l'API
    const response = await fetch("http://localhost:5678/api/works");
    if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);

    const works = await response.json();
    console.log("Travaux récupérés :", works);
    gallery.innerHTML = "";

    // Récupérer les catégories depuis l'API
    const categoryResponse = await fetch(
      "http://localhost:5678/api/categories"
    );
    if (!categoryResponse.ok)
      throw new Error(`Erreur HTTP: ${categoryResponse.status}`);

    const categoriesData = await categoryResponse.json();
    console.log(" Catégories API :", categoriesData);

    // Création d'un ensemble avec les noms des catégories
    const categories = new Set([
      "Tous",
      ...categoriesData.map((cat) => cat.name),
    ]);

    // Affichage initial des travaux
    works.forEach((work) => {
      const figure = document.createElement("figure");
      const img = document.createElement("img");
      const caption = document.createElement("figcaption");

      img.src = work.imageUrl;
      img.alt = work.title;
      caption.textContent = work.title;

      //  Correction : On stocke l'ID de la catégorie dans l'élément figure
      figure.dataset.categoryId = work.categoryId;

      figure.appendChild(img);
      figure.appendChild(caption);
      gallery.appendChild(figure);
    });

    // Générer les filtres
    generateFilters([...categories], works, categoriesData);
  } catch (error) {
    console.error("Erreur lors de la récupération des travaux :", error);
  }
}

//Cette fonction génère dynamiquement les boutons de filtrage qui permettent d'afficher uniquement les travaux appartenant à une catégorie spécifique.
function generateFilters(categories, works, categoriesData) {
  const filtersContainer = document.getElementById("filters-container");

  if (!filtersContainer) {
    console.error(" Conteneur des filtres non trouvé !");
    return;
  }

  //Avant d’ajouter de nouveaux filtres, on supprime les précédents pour éviter un affichage en double.
  filtersContainer.innerHTML = "";

  //Création dynamique des boutons de filtre
  categories.forEach((category) => {
    const button = document.createElement("button");
    button.textContent = category;
    button.classList.add("filter");

    if (category === "Tous") {
      //Au chargement de la page, on veut que "Tous" soit activé par défaut.
      button.classList.add("active");
    }

    button.addEventListener("click", () => {
      document
        .querySelectorAll(".filter")
        .forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      //  Correction : Récupérer l'ID de la catégorie sélectionnée
      //Si l'utilisateur clique sur "Tous", categoryId = null (pas de filtrage).
      const categoryId =
        category === "Tous"
          ? null
          : categoriesData.find((cat) => cat.name === category)?.id;

      console.log(
        ` Catégorie sélectionnée : "${category}" (ID: ${categoryId})`
      );
      filterWorks(categoryId, works);
    });

    filtersContainer.appendChild(button);
  });
}

function filterWorks(categoryId, works) {
  const gallery = document.querySelector(".gallery");
  if (!gallery) {
    console.error("La galerie n'existe pas !");
    return;
  }

  console.log(` Filtrage sur catégorie ID : ${categoryId}`);

  //Avant d'afficher les nouveaux travaux filtrés, on supprime l'ancien affichage pour éviter qu’ils ne s’empilent.
  gallery.innerHTML = "";

  // Correction du filtrage (on compare avec `work.categoryId`)
  const filteredWorks =
    categoryId === null
      ? works
      : works.filter((work) => work.categoryId === categoryId);

  console.log("Travaux après filtrage :", filteredWorks);

  filteredWorks.forEach((work) => {
    const figure = document.createElement("figure");
    const img = document.createElement("img");
    const caption = document.createElement("figcaption");

    img.src = work.imageUrl;
    img.alt = work.title;
    caption.textContent = work.title;

    figure.appendChild(img);
    figure.appendChild(caption);
    gallery.appendChild(figure);
  });
}
////////////////////////////////////////////////////// FIN Étape 1.2 : Filtrage des Travaux par Catégorie //////////////////////////////////////////////////////
// Supprimer un travail de la galerie principale sans recharger la page
export function removeWorkFromGallery(workId) {
  const gallery = document.querySelector(".gallery");
  if (!gallery) {
    console.error("La galerie principale n'existe pas !");
    return;
  }

  // Sélectionner l'élément à supprimer dans la galerie
  const workToRemove = gallery.querySelector(`figure[data-id="${workId}"]`);

  if (workToRemove) {
    workToRemove.remove();
    console.log(`Travail ${workId} supprimé de la galerie principale.`);
  } else {
    console.warn(`Travail ${workId} non trouvé dans la galerie.`);
  }
}

//Cette fonction permet de supprimer un travail en envoyant une requête DELETE à l'API, puis en mettant à jour l'affichage.
// Fonction pour supprimer un travail du backend et de la modale
async function deleteWork(workId, element) {
  const authToken = localStorage.getItem("authToken");

  if (!authToken) {
    console.error("Aucun token d'authentification !");
    return;
  }

  try {
    const response = await fetch(`http://localhost:5678/api/works/${workId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${authToken}` },
    });

    if (!response.ok)
      throw new Error(`Erreur lors de la suppression : ${response.statusText}`);

    console.log(`Image ${workId} supprimée avec succès.`);
    element.remove(); // Supprimer visuellement l'image de la modale

    // Recharge la liste des travaux après suppression (optionnel)
    loadWorksInModal(); // Pour s'assurer que la liste est bien mise à jour

    // Supprimer aussi dans la galerie principale
    removeWorkFromGallery(workId);

    // Recharger la galerie principale immédiatement pour voir les changements
    await loadWorks();
  } catch (error) {
    console.error("Erreur de suppression :", error);
  }
}

//loadWorksInModal() est utilisée pour charger dynamiquement les travaux (works) dans la modale, notamment après un ajout ou une suppression.
// Charger les images dans la modale depuis le backend
export async function loadWorksInModal() {
  const modalGallery = document.querySelector(".modal-gallery");

  if (!modalGallery) {
    console.error("Erreur : la galerie modale est introuvable !");
    return;
  }

  modalGallery.innerHTML = ""; // Nettoyer avant d'ajouter de nouvelles images
  // Réapplique les styles flexbox
  modalGallery.style.display = "flex";
  modalGallery.style.flexWrap = "wrap";
  modalGallery.style.gap = "10px";
  modalGallery.style.justifyContent = "flex-start";
  modalGallery.style.marginBottom = "40px";

  try {
    const response = await fetch("http://localhost:5678/api/works");
    console.log("Statut de la réponse:", response.status);
    const works = await response.json();
    console.log("Données reçues:", works);

    works.forEach((work) => {
      const photoDiv = document.createElement("div");
      photoDiv.classList.add("photo-item");
      photoDiv.dataset.id = work.id; // Stocker l'ID

      const img = document.createElement("img");
      img.src = work.imageUrl;
      img.alt = work.title;

      // Bouton de suppression
      const deleteBtn = document.createElement("button");
      deleteBtn.classList.add("delete-btn");
      deleteBtn.innerHTML = "&#128465;"; // Icône poubelle

      deleteBtn.addEventListener("click", () => deleteWork(work.id, photoDiv));

      photoDiv.appendChild(img);
      photoDiv.appendChild(deleteBtn);
      modalGallery.appendChild(photoDiv);
    });
  } catch (error) {
    console.error("Erreur lors du chargement des images :", error);
  }
}

// Cette fonction est donc utilisée pour afficher dynamiquement work dans une galerie
export function addWorkToGallery(work) {
  const gallery = document.querySelector(".gallery");
  if (!gallery) return;

  const figure = document.createElement("figure");
  figure.dataset.id = work.id;

  const img = document.createElement("img");
  img.src = work.imageUrl;
  img.alt = work.title;

  const figcaption = document.createElement("figcaption");
  figcaption.textContent = work.title;

  figure.appendChild(img);
  figure.appendChild(figcaption);
  gallery.appendChild(figure);
}
