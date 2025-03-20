export function setupFormValidation() {
  const imageInput = document.getElementById("image-upload-input");
  const previewImage = document.getElementById("preview-image");
  const uploadContainer = document.querySelector(".image-upload-container");
  const uploadIcon = document.querySelector(".upload-icon");
  const uploadButton = document.querySelector(".upload-button");
  const uploadText = document.querySelector(".upload-text");
  const submitButton = document.querySelector(".submit-button");
  const titleInput = document.getElementById("title");
  const categorySelect = document.getElementById("category");

  if (
    !imageInput ||
    !previewImage ||
    !submitButton ||
    !titleInput ||
    !categorySelect ||
    !uploadContainer ||
    !uploadIcon ||
    !uploadButton ||
    !uploadText
  ) {
    console.error("Un ou plusieurs éléments ne sont pas trouvés dans le DOM !");
    return;
  }

  // Cacher la valeur par défaut de la catégorie
  categorySelect.value = "";

  // Ouvrir le sélecteur de fichier en cliquant sur la zone d'upload
  const openFileSelector = (event) => {
    //Empêche l'événement de remonter et d'être déclenché plusieurs fois
    event.stopPropagation();
    imageInput.click();
  };

  uploadContainer.addEventListener("click", openFileSelector);
  uploadIcon.addEventListener("click", openFileSelector);
  previewImage.addEventListener("click", openFileSelector);

  // Affichage de l'image sélectionnée
  imageInput.addEventListener("change", (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        previewImage.src = e.target.result;
        previewImage.style.display = "block";
        previewImage.style.maxWidth = "60%"; // Pour garder du fond bleu autour
        previewImage.style.maxHeight = "100%";
        previewImage.style.objectFit = "contain";

        // Ajouter une div englobante pour garder le fond
        let previewWrapper = document.createElement("div");
        previewWrapper.classList.add("image-preview-wrapper");
        previewWrapper.appendChild(previewImage);

        // Remplacer le contenu de l'upload container
        uploadContainer.innerHTML = "";
        uploadContainer.appendChild(previewWrapper);
        //Réinsertion de l'input parce qu'il est vide
        uploadContainer.appendChild(imageInput);
        uploadContainer.classList.add("selected"); // Conserve la mise en page
      };

      reader.readAsDataURL(file);
    }

    checkFormCompletion();
  });

  // Vérification des champs avant d'activer le bouton valider
  function checkFormCompletion() {
    const isTitleFilled = titleInput.value.trim() !== "";
    const isCategorySelected = categorySelect.value !== "";
    const isImageSelected = imageInput.files.length > 0;

    if (isTitleFilled && isCategorySelected && isImageSelected) {
      submitButton.classList.add("active");
      submitButton.removeAttribute("disabled");
    } else {
      submitButton.classList.remove("active");
      submitButton.setAttribute("disabled", "true");
    }
  }

  // Ajout des écouteurs d'événements
  titleInput.addEventListener("input", checkFormCompletion);
  categorySelect.addEventListener("change", checkFormCompletion);
}
