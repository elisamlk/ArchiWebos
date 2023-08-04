let modal = document.getElementById("modal");
let closeBtn = document.getElementById("closeBtn");
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

  editButton.addEventListener("click", () => {
    modal.style.display = "block";
    let modalElement = document.querySelector(".modal-element");
    modalElement.innerHTML = "";
    fetch("http://localhost:5678/api/works")
      .then((response) => response.json())
      .then((data) =>
        data.map((e) => {
          modalElement.innerHTML += ` <figure class="project-modal" >
  <img class="project-img" src="${e.imageUrl}" alt="${e.title}">
  <figcaption>éditer</figcaption>
  <span id="${e.id}" class="delete">O</span>
</figure>
`;
        })
      )
      .then(() => {
        let arrayDelete = document.querySelectorAll(".delete");
        console.log(arrayDelete);
        arrayDelete.forEach((btnDelete) => {
          btnDelete.addEventListener("click", (e) => {
            let idDeleted = e.target.id;
            let token = localStorage.getItem("token");
            fetch(`http://localhost:5678/api/works/${idDeleted}`, {
              method: `DELETE`,
              headers: {
                "Content-Type": "Application/Json",
                Authorization: `Bearer ${token}`,
              },
            }).then((response) => {
              if (response.ok) {
                console.log("ok");
                gallery = "";
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

                // fonction pour afficher les miniatures et page principale
              } else {
                console.log("erreur");
              }
            });
            //});
            console.log(idDeleted);
          });
        });
      });

    let addWork = document.querySelector(".add-work");
    addWork.addEventListener("click", () => {
      let modalWrapper = document.querySelector(".modal-wrapper");
      let modalContent = document.querySelector(".modal-content");
      modalContent.classList.add("hide");
      let addWorkTitle = document.querySelector(".modal-title");
      addWorkTitle.textContent = "Ajout Photo";
      let addWorkDiv = document.createElement("div");
      addWorkDiv.classList.add("add-work");
      modalWrapper.appendChild(addWorkDiv);
      let addWork = document.createElement("div");
      addWork.classList.add("addWork");
      addWorkDiv.appendChild(addWork);
      let addWorkImg = document.createElement("img");
      addWorkImg.src = "../FrontEnd/assets/images/picture.png";
      addWorkImg.classList.add("add-img");
      addWork.appendChild(addWorkImg);
      let labelElement = document.createElement("label");
      labelElement.classList.add("label");
      labelElement.innerText = "+ Ajout photo";
      labelElement.htmlFor = "input-element";
      addWork.appendChild(labelElement);
      let input = document.createElement("input");
      input.type = "file";
      input.accept = "image";
      input.name = "+ Ajouter photo";
      input.id = "input-element";
      input.classList.add("hide");
      addWork.appendChild(input);
      input.addEventListener("change", (e) => {
        // console.log(e.target.files[0]);
        let fileName = e.target.files[0].name;
        addWorkImg.src = "../FrontEnd/assets/images/" + fileName;
      });
    });
  });

  // Fonction pour ajouter l'image via une requête POST avec l'API fetch
  //const cheminDeLImage = "chemin_vers_votre_image.jpg";
  // function addImage() {

  //   const url = "http://localhost:5678/api/works";

  //   try {
  //     const imageFile = fetch(cheminDeLImage).then((response) =>
  //       response.blob()
  //     );

  //     const formData = new FormData();
  //     formData.append("image", imageFile, "nom_de_l_image.jpg");

  //     const options = {
  //       method: "POST",
  //       body: formData,
  //     };

  //     const response = fetch(url, options);
  //     const data = response.json();

  //     console.log("Réponse du serveur :", data);
  //   } catch (error) {
  //     console.error("Erreur lors de l'ajout de l'image :", error);
  //   }
  // }

  // Fermeture de la modale
  closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });
}
