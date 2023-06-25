// fetch("http://localhost:5678/api/users/login")
const data = { email: "sophie.bluel@test.tld", password: "S0phie" };

async function postJSON(data) {
  try {
    const response = await fetch("http://localhost:5678/api/users/login", {
      method: "POST", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    console.log("Success:", result);
  } catch (error) {
    console.error("Error:", error);
  }
}

postJSON(data);
