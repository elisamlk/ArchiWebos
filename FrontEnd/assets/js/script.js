// Récupérer les catégories
let categoryBtn = document.querySelector(".category-btn");
let filters;

fetch("http://localhost:5678/api/categories")
  .then((response) => response.json())
  .then((data) => {
    data.map((e) => {
      categoryBtn.innerHTML += `<li class="filter" data-category="${e.name}">${e.name}</li>
`;
    });
    filters = document.querySelectorAll(".filter");
    categoryFilter(filters);
  });

// Récupérer les travaux avec fetch et les afficher
let gallery = document.querySelector(".gallery");
fetch("http://localhost:5678/api/works")
  .then((response) => response.json())
  .then((data) =>
    data.map((e) => {
      gallery.innerHTML += ` <figure class="project" data-filter="${e.category.name}">
  <img src="${e.imageUrl}" alt="${e.title}">
  <figcaption>${e.title}</figcaption>
</figure>
`;
    })
  );

function categoryFilter(filters) {
  console.log(filters);
  filters.forEach((filter) => {
    filter.addEventListener("click", function () {
      let selectedFilter = filter.getAttribute("data-category");
      let itemsToHide = document.querySelectorAll(
        `.project:not([data-filter='${selectedFilter}'])`
      );
      let itemsToShow = document.querySelectorAll(
        `.project[data-filter='${selectedFilter}']`
      );

      if (selectedFilter == "tous") {
        itemsToHide = [];
        itemsToShow = document.querySelectorAll(".project[data-filter]");
      }

      itemsToHide.forEach((el) => {
        el.classList.add("hide");
      });

      itemsToShow.forEach((el) => {
        el.classList.remove("hide");
      });
    });
  });
}

//logout
let logButton = document.querySelector(".login");
let token = window.localStorage.getItem("token");
//Si admin est connecté
if (token) {
  // fonction pour se déconnecter
  logout();
  // fonction pour éditer/modifier la page
  change();
  edit();
}

function logout() {
  logButton.textContent = "logout";
  logButton.addEventListener("click", () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    window.location = "index.html";
  });
}

//  <input type="file" />

function change() {
  categoryBtn.classList.add("hide");
  let editBanner = document.querySelector(".edit-banner");
  editBanner.innerHTML += `<i class="fas fa-edit"> Mode édition </i><button class="publish">publier les changements</button>`;
}

function edit() {
  let projectTitle = document.querySelector(".project-title");
  // Création du bouton modifier
  let editButton = document.createElement("button");
  editButton.classList.add("edit-button");
  editButton.textContent = "modifier";
  projectTitle.appendChild(editButton);

  // Ouverture de la modale
  let modal = document.getElementById("modal");
  let closeBtn = document.getElementById("closeBtn");

  editButton.addEventListener("click", () => {
    modal.style.display = "block";
    let modalElement = document.querySelector(".modal-element");
    fetch("http://localhost:5678/api/works")
      .then((response) => response.json())
      .then((data) =>
        data.map((e) => {
          modalElement.innerHTML += ` <figure class="project-modal" >
  <img class="project-img" src="${e.imageUrl}" alt="${e.title}">
  <figcaption>éditer</figcaption>
</figure>
`;
        })
      );
  });

  // Fermeture de la modale
  closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });
}

// fonction modifier
// ajouter les boutons modifier
// addEventlistener --> creer modale, afficher les travaux ( refaire appel à fetch ), créer un nouveau travail
// click créer un nouveau travail, modifier
// proxy server plugin  à installer dans vscode
