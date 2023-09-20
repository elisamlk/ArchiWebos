let modal = document.getElementById("modal");
let closeBtn = document.getElementById("closeBtn");
let gallery = document.querySelector(".gallery");

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
  gallery.innerHTML = "";
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
  editBanner.classList.toggle("edit-banner-display");
  editBanner.innerHTML += `<i class="fas fa-edit"> Mode édition </i><button class="publish">publier les changements</button>`;
}

function edit() {
  let projectTitle = document.querySelector(".project-title");
  let editButton = document.createElement("i");
  editButton.classList.add("fa", "fa-edit");
  editButton.textContent = "modifier";
  projectTitle.appendChild(editButton);

  // Ouverture de la modale

  // AJouter les miniatures dans la modale

  // Ajout des mini
  function showMini() {
    let modalElement = document.querySelector(".modal-element");
    modalElement.innerHTML = "";
    fetch("http://localhost:5678/api/works")
      .then((response) => response.json())
      .then((data) =>
        data.map((e) => {
          modalElement.innerHTML += ` <figure class="project-modal" >
  <img class="project-img" src="${e.imageUrl}" alt="${e.title}">
  <div  class="trash" id="${e.id}">
  <svg xmlns="http://www.w3.org/2000/svg" width="9" height="11" viewBox="0 0 9 11" fill="none">
  <path d="M2.71607 0.35558C2.82455 0.136607 3.04754 0 3.29063 0H5.70938C5.95246 0 6.17545 0.136607 6.28393 0.35558L6.42857 0.642857H8.35714C8.71272 0.642857 9 0.930134 9 1.28571C9 1.64129 8.71272 1.92857 8.35714 1.92857H0.642857C0.287277 1.92857 0 1.64129 0 1.28571C0 0.930134 0.287277 0.642857 0.642857 0.642857H2.57143L2.71607 0.35558ZM0.642857 2.57143H8.35714V9C8.35714 9.70915 7.78058 10.2857 7.07143 10.2857H1.92857C1.21942 10.2857 0.642857 9.70915 0.642857 9V2.57143ZM2.57143 3.85714C2.39464 3.85714 2.25 4.00179 2.25 4.17857V8.67857C2.25 8.85536 2.39464 9 2.57143 9C2.74821 9 2.89286 8.85536 2.89286 8.67857V4.17857C2.89286 4.00179 2.74821 3.85714 2.57143 3.85714ZM4.5 3.85714C4.32321 3.85714 4.17857 4.00179 4.17857 4.17857V8.67857C4.17857 8.85536 4.32321 9 4.5 9C4.67679 9 4.82143 8.85536 4.82143 8.67857V4.17857C4.82143 4.00179 4.67679 3.85714 4.5 3.85714ZM6.42857 3.85714C6.25179 3.85714 6.10714 4.00179 6.10714 4.17857V8.67857C6.10714 8.85536 6.25179 9 6.42857 9C6.60536 9 6.75 8.85536 6.75 8.67857V4.17857C6.75 4.00179 6.60536 3.85714 6.42857 3.85714Z" fill="white"/>
  </svg>
  </div>
  <figcaption  class="delete">éditer</figcaption>

  
</figure>
`;
        })
      )
      .then(() => {
        let arrayDelete = document.querySelectorAll(".trash");
        console.log(arrayDelete);
        arrayDelete.forEach((btnDelete) => {
          btnDelete.addEventListener("click", (e) => {
            e.preventDefault();
            console.log(e);

            let idDeleted = e.target.id;
            console.log(idDeleted);
            let token = localStorage.getItem("token");
            fetch(`http://localhost:5678/api/works/${parseInt(idDeleted)}`, {
              method: `DELETE`,
              headers: {
                "Content-Type": "Application/Json",
                Authorization: `Bearer ${token}`,
              },
            }).then((response) => {
              if (response.ok) {
                showMini();

                console.log("ok");
                modalElement = "";

                addImages();
              } else {
                console.log("erreur");
              }
            });

            console.log(idDeleted);
          });
        });
      });
  }

  let back = document.querySelector(".fa-arrow-left");
  back.addEventListener("click", () => {
    console.log("click");
    showMini();
    initModalMini();
 
    
  });

function initModalMini(){
  let modalWrapper = document.querySelector(".modal-wrapper");
  let form = modalWrapper.querySelector('form');
  modalWrapper.removeChild(form);

  let modalContent = document.querySelector(".modal-content");
      modalContent.classList.remove("hide");

}

let eventOnAir = false;
  function initModal() {
    let addWork = document.querySelector(".add-work-button");
    if(!eventOnAir){
    addWork.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
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

        sendInfo(addWorkImg, inputTitle.value, selectCategory.selectedIndex);
      });
    });
  }
  eventOnAir=true;
  }

  editButton.addEventListener("click", () => {
    modal.style.display = "block";

    showMini();
    initModal();

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
    formData.append("category", selectCategory);
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
      .then((data) => addImages())
      .then((modal.style.display = "none"));
      showMini();
      initModalMini();
     // initModal();
     
  }

  // Fermeture de la modale
  closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
    showMini();
    initModalMini();
  });


}
