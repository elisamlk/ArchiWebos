// Récupérer les travaux avec fetch et les afficher
let gallery = document.querySelector(".gallery");

// fetch("http://localhost:5678/api/works")
//   .then((response) => response.json())
//   .then((data) => console.log(data));

fetch("http://localhost:5678/api/works")
  .then((response) => response.json())
  .then((data) =>
    data.map((e) => {
      gallery.innerHTML += ` <figure data-filter="${e.category.name}">
  <img src="${e.imageUrl}" alt="${e.title}">
  <figcaption>${e.title}</figcaption>
</figure>
`;
    })
  );

  

