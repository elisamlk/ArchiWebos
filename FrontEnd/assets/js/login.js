// fetch("http://localhost:5678/api/users/login")
// info = { email: "sophie.bluel@test.tld", password: "S0phie" };

let logIn = document.getElementById("submit");

logIn.addEventListener("click", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const user = {
    email: email,
    password: password,
  };

  let result = await fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify(user),
  });

  let response = await result.json();

  if (result.ok) {
    location.href = "../../index.html";
    localStorage.setItem("userId", response.userId);
    localStorage.setItem("token", response.token);
  } else {
    alert("Erreur d'authentification");
  }
});
