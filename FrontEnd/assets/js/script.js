let modal = document.getElementById("modal");
let closeBtn = document.getElementById("closeBtn");

// Récupérer les catégories
let categoryBtn = document.querySelector(".category-btn");
let filters;
var categoryArray;
fetch("http://localhost:5678/api/categories")
  .then((response) => response.json())
  .then((data) => {
    categoryArray = [...data];
    data.map((e) => {
      categoryBtn.innerHTML += `<li class="filter" data-category="${e.name}">${e.name}</li>
`;
    });
    filters = document.querySelectorAll(".filter");
    categoryFilter(filters);
  });

function addImages() {
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
}

addImages();

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

    let addWork = document.querySelector(".add-work-button");
    addWork.addEventListener("click", () => {
      let modalWrapper = document.querySelector(".modal-wrapper");
      let modalContent = document.querySelector(".modal-content");
      modalContent.classList.add("hide");
      let addWorkTitle = document.querySelector(".modal-title");
      addWorkTitle.textContent = "Ajout Photo";
      let addWorkDiv = document.createElement("form");
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
      let docSize = document.createElement("p");
      docSize.innerText = "jpg, png : 4mo max";
      docSize.classList.add("doc-size");
      addWork.appendChild(docSize);
      input.addEventListener("change", (e) => {
        let fileName = e.target.files[0].name;
        addWorkImg.src = "../FrontEnd/assets/images/" + fileName;
      });

      let title = document.createElement("h4");
      let inputTitle = document.createElement("input");
      let category = document.createElement("h4");
      // let inputCategory = document.createElement("input");
      let selectCategory = document.createElement("select");
      let firstOption = document.createElement("option");
      firstOption.innerText = "Veuillez sélectionner une catégorie";
      selectCategory.appendChild(firstOption);
      categoryArray.forEach((category) => {
        let option = document.createElement("option");
        option.innerText = category.name;
        selectCategory.appendChild(option);
      });

      let validationButton = document.createElement("button");

      title.textContent = "Titre";
      inputTitle.classList.add("input-title");
      category.textContent = "Catégorie";
      selectCategory.classList.add("input-category");
      validationButton.textContent = "Validation";
      validationButton.classList.add("validation-button");

      addWorkDiv.appendChild(title);
      addWorkDiv.appendChild(inputTitle);
      addWorkDiv.appendChild(category);
      addWorkDiv.appendChild(selectCategory);
      addWorkDiv.appendChild(validationButton);

      validationButton.addEventListener("click", (e) => {
        e.preventDefault();
        // console.log(addWorkImg.src);
        // console.log(inputTitle.value);
        // console.log(selectCategory.selectedIndex);
        sendInfo(addWorkImg, inputTitle.value, selectCategory.selectedIndex);
      });
    });
  });

  function sendInfo(addWorkImg, inputTitle, selectCategory) {
    let imageOk = addWorkImg.src.includes("assets/images/picture.png")
      ? false
      : true;
    let inputTitleOk = inputTitle.length > 0 ? true : false;
    let selectCategoryOk = selectCategory === 0 ? false : true;
    if (!imageOk && !inputTitleOk && !selectCategoryOk) {
      alert("Veuillez remplir tous les champs");
    } else {
      sendMethodPost(inputTitle, selectCategory);
    }
  }

  function sendMethodPost(inputTitle, selectCategory) {
    const url = "http://localhost:5678/api/works";
    const form = document.querySelector("form");
    const formData = new FormData();
    let image = document.getElementById("input-element");
    console.log(image);
    formData.append("image", image.files[0]);
    formData.append("title", inputTitle);
    formData.append("category", 1);
    let token = localStorage.getItem("token");

    fetch(url, {
      method: "POST",
      headers: {
        Accept: "Application/Json",
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => (modal.style.display = "none"), addImages());
  }

  // Fermeture de la modale
  closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });
}
