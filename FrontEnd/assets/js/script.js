// Récupérer les travaux avec fetch et les afficher
let gallery = document.querySelector(".gallery");
console.log(gallery);

fetch("http://localhost:5678/api/works")
  .then((response) => response.json())
  .then((data) =>
    data.map((e) => {
      gallery.innerHTML += ` <figure>
  <img src="${e.imageUrl}" alt="${e.title}">
  <figcaption>${e.title}</figcaption>
</figure>
`;
    })
  );

