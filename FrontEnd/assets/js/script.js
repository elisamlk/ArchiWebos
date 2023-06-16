// Récupérer les travaux avec fetch et les afficher
let gallery = document.querySelector(".gallery");

fetch("http://localhost:5678/api/works")
  .then((response) => response.json())
  .then((data) => console.log(data));

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

// Filtrer les photos selon le thème

let filters = document.querySelectorAll(".filter");

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
      // el.classList.remove("show");
    });

    itemsToShow.forEach((el) => {
      el.classList.remove("hide");
      // el.classList.add("show");
    });
  });
});
