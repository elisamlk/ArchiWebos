// Récupérer les travaux avec fetch

fetch("http://localhost:5678/api/works")
  .then((response) => response.json())
  .then((data) => console.log(data));
