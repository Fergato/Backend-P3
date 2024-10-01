const zoneEmail = document.getElementById("email");
const zoneMdp = document.getElementById("mdp");

function envoiFormulaire() {
  const formLogin = document.querySelector(".form-login");
  formLogin.addEventListener("submit", async (e) => {
    e.preventDefault();
    window.localStorage.setItem("email", zoneEmail.value);
    window.localStorage.setItem("password", zoneMdp.value);
    //   Regroupement des valeurs données dans le formulaire dans une unique constante
    const valueForm = {
      email: zoneEmail.value,
      password: zoneMdp.value,
    };
    //   transformation en JSON des valeurs du formulaire
    const chargeUtile = JSON.stringify(valueForm);
    const req = {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
      body: chargeUtile,
    };
    // Effectuer la requête POST avec fetch() pour se connecter
    fetch("http://localhost:5678/api/users/login", req)
      .then((res) => {
        if (res.status === 200) {
          return res.json();
        } else if (res.status !== 200) {
          alert("Erreur dans l’identifiant ou le mot de passe");
          throw new Error("Identifiants invalides");
        }
      })
      .then((data) => {
        const token = data.token;
        // Stocker le token dans le localStorage
        window.localStorage.setItem("token", JSON.stringify(token));
        window.location.href = "index.html";
      })
      .catch((error) => {
        console.error(error); // Gérer les erreurs ici
      });
    zoneEmail.value = "";
    zoneMdp.value = "";
  });
}
envoiFormulaire();
