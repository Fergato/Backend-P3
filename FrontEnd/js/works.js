let works = window.localStorage.getItem("works");
let categories = window.localStorage.getItem("categories");

//On récupère les catégories via l'api
if (categories === null) {
  let reponse = await fetch("http://localhost:5678/api/categories");
  categories = await reponse.json();
  let valeurCategories = JSON.stringify(categories);
  // on créer l'item "categories" en string
  window.localStorage.setItem("categories", valeurCategories);
} else {
  // reconversion de la string en objet
  categories = JSON.parse(categories);
}

//Récupération des travauw via l'api
async function appelWorks() {
  await fetch("http://localhost:5678/api/works")
    .then((reponse) => reponse.json())
    .then((dataWorks) => {
      //création de la string "works"
      window.localStorage.setItem("works", JSON.stringify(dataWorks));
    });
}
appelWorks();

//Affichage des travaux sur la page principale
function genererWorks(works) {
  // récup element dom pour accueillir les fiches
  const gallery = document.querySelector(".gallery");
  gallery.innerHTML = ""; // on vide le contenu
  const imagesUrl = works.map((work) => work.imageUrl);
  //création d'un element par travaux
  for (let i = 0; i < imagesUrl.length; i++) {
    const article = works[i];

    // création d'une balise dédiée à un des travaux
    const workElement = document.createElement("figure");
    workElement.dataset.id = article.id;
    // création de balise pour chaque élément
    const imageWorks = document.createElement("img");
    imageWorks.src = article.imageUrl;
    imageWorks.alt = article.title;
    const titreWorks = document.createElement("figcaption");
    titreWorks.innerText = article.title;

    // rattachement à la balise gallery
    gallery.appendChild(workElement);
    workElement.appendChild(imageWorks);
    workElement.appendChild(titreWorks);
  }
}

genererWorks(JSON.parse(window.localStorage.getItem("works")));

//generation dynamique des filtres
async function genererFilters() {
  //Création des boutons et selection de la baliste filtres
  const btnTous = document.createElement("button");
  const filtres = document.querySelector(".filtres");
  //Ajout de la classe correspondant à chaque catégories au bouton Tous
  works = JSON.parse(window.localStorage.getItem("works"));
  for (let i = 0; i < works.length; i++) {
    btnTous.classList.add(`${works[i].categoryId}`);
  }
  btnTous.innerText = "Tous"; //création du bouton Tous
  filtres.appendChild(btnTous); //rattachement à son parent
  //Pour chaque categorie création d'un bouton correspondant
  categories.forEach((categorie) => {
    const idFiltres = categorie.id;
    const nomFiltres = categorie.name;
    const btn = document.createElement("button"); //création d'un bouton
    btn.classList.add(`${idFiltres}`); //ajout de la classe correspondante
    btn.innerText = nomFiltres;
    filtres.appendChild(btn); //rattachement au parent
  });
}

genererFilters(categories);

//tri dynamique des travaux
function TrierFiltres() {
  window.addEventListener("click", (e) => {
    //écoute sur click
    // Si la target est un bouton et que son parent à la classe .filtres
    if (e.target.tagName === "BUTTON" && e.target.closest(".filtres")) {
      const categorieFiltre = e.target.classList;
      //récupération des travaux et swap en objet
      works = JSON.parse(window.localStorage.getItem("works"));
      const parent = document.querySelector(".filtres"); //selection du parent
      const enfant = parent.children;
      for (let child of enfant) {
        // supprime la classe "clicked" à tout les enfants de filtres
        child.classList.remove("clicked");
      }
      // On supprime tout le HTML de la gallerie
      document.querySelector(".gallery").innerHTML = "";
      //si la classe est plus longue que 1
      if (categorieFiltre.length > 1) {
        genererWorks(works);
      } else {
        //on filtre les travaux correspondant à la categorie
        const worksFiltered = works.filter(
          (works) => works.categoryId == categorieFiltre
        );
        //affichage des travaux triés
        genererWorks(worksFiltered);
      }
      // On toggle la classe "clicked" à l'élément cliqué
      categorieFiltre.toggle("clicked");
    }
  });
}

TrierFiltres();

// changement du protocole formulaire
let formulaire = document.querySelector("form");
formulaire.addEventListener("submit", (e) => {
  e.preventDefault();
});

//gestion de l'affichage admin
function affichageAdmin() {
  //récupération des balises nécéssaires
  let token = window.localStorage.getItem("token");
  const edition = document.querySelector(".edition");
  const listNav = document.querySelector(".logout");
  const btnModifier = document.querySelector(".modifier");
  const filtres = document.querySelector(".filtres");
  // Si token alors affichage de la page en admin
  if (token) {
    edition.style.display = "flex";
    btnModifier.style.display = "flex";
    filtres.style.display = "none";
    listNav.innerHTML = `<a href="#">Logout</a>`;
  }
  // si click sur logout affichage de la page en vanilla
  listNav.addEventListener("click", () => {
    if (listNav.innerText === "Logout") {
      window.localStorage.removeItem("token"); //suppresion du token
      edition.style.display = "none";
      listNav.innerHTML = `<a href="login.html">login</a>`;
      btnModifier.style.display = "none";
      filtres.style.display = "flex";
      appelWorks();
      genererWorks(JSON.parse(window.localStorage.getItem("works")));
    }
  });
}

affichageAdmin();

//generation des travaux dans la modal
function genererWorksModal(works) {
  for (let i = 0; i < works.length; i++) {
    const article = works[i];
    // récup element dom pour accueillir les fiches
    const contenu = document.querySelector(".contenu-modal");
    // création d'une balise dédiée à un des travaux
    const workElement = document.createElement("figure");
    workElement.dataset.id = article.id;
    // création de balise pour chaque élément
    const imageWorks = document.createElement("img");
    imageWorks.src = article.imageUrl;
    imageWorks.alt = article.title;

    const trash = document.createElement("button");
    trash.innerHTML = `<i class="fa-solid fa-trash-can" id="trashcan"></i>`;
    // rattachement à la balise gallery
    contenu.appendChild(workElement);
    workElement.appendChild(imageWorks);
    workElement.appendChild(trash);
  }
}

let modalState = null;

//Ouverture de la modal
function openModal() {
  appelWorks(); //récupération des travaux
  //récupération des balises
  const modal = document.querySelector(".modal");
  const contenu = document.querySelector(".contenu-modal");
  const btnClose = document.querySelector(".modal-close");
  const titreModal = document.querySelector(".titre-modal");
  const btnModal = document.querySelector(".btn-modal");
  contenu.innerHTML = ""; // suppresion de tout contenu
  genererWorksModal(JSON.parse(window.localStorage.getItem("works")));

  modal.style.display = null; // affichage de la modal
  modal.removeAttribute("aria-hidden");
  titreModal.innerText = "Galerie photo"; // changement du titre modal
  btnModal.innerText = "Ajouter une photo"; //Changement du texte du bouton
  modalState = modal;
  // si le click est uniquement sur la modal et non ses enfants: fermeture
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });
  btnClose.addEventListener("click", closeModal); //écoute sur le bouton close
}

//Fermeture de la modal
async function closeModal() {
  if (modalState === null) return;
  //récupération des balises
  const contenu = document.querySelector(".contenu-modal");
  const btnModal = document.querySelector(".btn-modal");
  modalState.style.display = "none"; // on cache la modal
  modalState.setAttribute("aria-hidden", "true");
  contenu.innerHTML = ""; // on vide le contenu de la modal
  modalState = null;
  // On repasse la couleur et l'opacité en "vanilla" à la fermeture
  btnModal.style.backgroundColor = "#1d6154";
  btnModal.style.opacity = "1";
  await appelWorks();
  genererWorks(JSON.parse(window.localStorage.getItem("works")));
}

//ecoute sur le bouton modifier
const btnModifier = document.querySelector(".modifier");
btnModifier.addEventListener("click", () => {
  openModal();
  deleteWorks();
});

let formulaireModal;
//Ecoute sur le bouton de la modal
const btnModal = document.querySelector(".btn-modal");
btnModal.addEventListener("click", async () => {
  if (btnModal.innerText === "Ajouter une photo") {
    ajoutPhotoModal(); //ajout du block photo
    formAjout(); //ajout du formulaire
    affichageImgUser(); //affichage de l'img de l'utilisateur
    const form = document.querySelector(".contenu-modal");
    formulaireModal = form;
    switchBtnImage();
    formulaireModal.addEventListener("input", () => {
      checkForm(); //verification du formulaire
    });
  } else {
    if (btnModal.innerText === "Valider") {
      formulaireModalSubmit(); //envoi du formulaire
      // closeModal();
    }
  }
});

//changement du html/css de la modal
function ajoutPhotoModal() {
  //selection des balises
  const contenu = document.querySelector(".contenu-modal");
  const titreModal = document.querySelector(".titre-modal");
  if (btnModal.innerText === "Ajouter une photo") {
    contenu.innerHTML = ""; // on clean le contenu
    titreModal.innerText = "Ajout photo"; // on change le titre
    btnModal.style.backgroundColor = "Grey";
    btnModal.style.opacity = "0.6";
    btnModal.innerText = "Valider";
  }
}

// Ajout du formulaire (changement de syntaxe pour ne pas oublier cette forme)
const formAjout = function () {
  //création et sélection des balises
  const form = document.createElement("form");
  const contenu = document.querySelector(".contenu-modal");
  // Ajout du formulaire
  form.setAttribute("id", "formModal");
  form.innerHTML = `<div class="blockPhoto">
						<i class="fa-regular fa-image"></i>
						<button type="button" class="btnAjout">+ Ajouter photo</button>
						<input type="file" id="hidden" name="image" accept="image/*">
            <img id="previewImage" src="" alt="Image Preview" style="display:none; max-width: 300px;">
						<p>jpg.png : 4mo max</p>
					</div>
					<div class="blockForm">
						<label for="titre">Titre</label>
						<input type="text" name="titre">
						<label for="categorie">Catégorie</label>
						<select id="deroulant" name="categorie">
							<option value="" selected>
					</div>`;
  contenu.innerHTML += form.innerHTML; //on greffe le formulaire sur la modal

  // Pour chaque élément dans categories, ajout d'une option dans le menu déroulant du formulaire
  for (let i = 0; i < categories.length; i++) {
    const deroulant = document.getElementById("deroulant");
    const choix = document.createElement("option");
    choix.value = categories[i].id;
    choix.textContent = categories[i].name;
    deroulant.appendChild(choix); //rattachement au parent
  }
};

//affichage de l'image de l'utilisateur dans le block photo
function affichageImgUser() {
  //récupération des balises
  const imgElement = document.getElementById("previewImage");
  const fichier = document.getElementById("hidden");
  //écoute sur l'input de fichier
  fichier.addEventListener("change", (event) => {
    const file = event.target.files[0]; //récupère le fichier sélectionner par l'utilisateur

    if (!file.type.match("image/jpeg") && !file.type.match("image/png")) {
      alert("Le fichier doit être un JPG ou un PNG.");
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      alert("Le fichier doit être inférieur à 4 Mo.");
      return;
    }

    if (file) {
      const reader = new FileReader(); // nouveau FileReader

      // Quand le fichier est chargé
      reader.onload = (e) => {
        imgElement.src = e.target.result; //la source est le fichier chargé
        imgElement.style.display = "block"; // affichage de l'image
      };
      reader.readAsDataURL(file);
      const blockPhoto = document.querySelector(".blockPhoto");

      //suppression de tout les éléments de blockPhoto qui ne sont pas l'image utilisateur
      Array.from(blockPhoto.children).forEach((child) => {
        if (child !== imgElement && child !== fichier) {
          blockPhoto.removeChild(child);
        }
      });
    }
  });
}

//vérification du formulaire
function checkForm() {
  const inputs = formulaireModal.querySelectorAll("input, select");
  let allFilled = true;

  // Vérification si tous les champs sont remplis
  inputs.forEach((input) => {
    if (!input.value) {
      allFilled = false;
    }
  });

  // Activer/désactiver le bouton en fonction des champs remplis
  if (allFilled === true) {
    btnModal.style.backgroundColor = "#1D6154"; // Change la couleur de fond
    btnModal.style.opacity = "1"; // change l'opacité
  }
}

//Envoi du formulaire de la modal
async function formulaireModalSubmit() {
  //récupération des balises pour le formData
  const img = formulaireModal.querySelector('input[type="file"]');
  const input = formulaireModal.querySelector('input[type="text"]');
  const select = formulaireModal.querySelector("select");
  let token = JSON.parse(window.localStorage.getItem("token"));
  const file = img.files[0];
  const titre = input.value;
  const photoCategory = parseInt(select.value, 10);

  if (!file) {
    alert("Aucun fichier sélectionné.");
    return;
  }

  if (!titre) {
    alert("Veuillez renseigner le titre");
    return;
  }

  if (!photoCategory) {
    alert("Veuillez choisir une catégorie");
    return;
  }

  const formData = new FormData(); //création du formData
  //rattachement des éléments à envoyer
  formData.append("image", file);
  formData.append("title", titre);
  formData.append("category", photoCategory);

  try {
    //Création de la requète
    const req = {
      method: "POST",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    };
    //envoi de la requète
    const request = await fetch("http://localhost:5678/api/works", req);

    if (request.ok) {
      await appelWorks();
      genererWorks(JSON.parse(window.localStorage.getItem("works")));
      closeModal();
    } else {
      console.error("Échec du téléchargement. Statut :", request.status);
    }
  } catch (error) {
    console.error("Erreur lors du téléchargement de l'image :", error);
  }
}

//active le click sur le vrai bouton quand le faux est cliqué
function switchBtnImage() {
  //récupération des balises
  const realBtn = document.getElementById("hidden");
  const customBtn = document.querySelector(".btnAjout");

  customBtn.addEventListener("click", () => {
    realBtn.click();
  });
}

//Suppression des travaux via la modal
function deleteWorks() {
  //sélection de la balise
  const btnTrash = document.querySelectorAll("#trashcan");
  let token = JSON.parse(window.localStorage.getItem("token"));

  btnTrash.forEach((trashBtn) => {
    //ecoute du click sur le bouton trashcan
    trashBtn.addEventListener("click", async (e) => {
      const parent = e.target.closest("figure"); //selection du parent
      const parentId = parent.getAttribute("data-id"); //selection de l'attribut avec l'Id

      try {
        //création de la requète
        const req = {
          method: "DELETE",
          headers: {
            accept: "*/*",
            Authorization: `Bearer ${token}`,
          },
        };
        //envoi de la requète
        const response = await fetch(
          `http://localhost:5678/api/works/${parentId}`,
          req
        );

        if (response.ok) {
          parent.remove();
          closeModal();
        } else {
          console.error("Échec de la suppression :", response.status);
        }
      } catch (error) {
        console.error("Erreur lors de la requête :", error);
      }
    });
  });
}
