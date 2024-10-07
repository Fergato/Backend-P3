const zoneEmail = document.getElementById("email");
const zoneMdp = document.getElementById("mdp");

function envoiFormulaire() {
  const formLogin = document.querySelector(".form-login");
  console.log(formLogin);
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
          // On vérifie s'il existe déjà un élément d'erreur
          let existingErrorTag = document.querySelector(".error");
          if (!existingErrorTag) {
            // On crée un nouvel élément d'erreur uniquement s'il n'existe pas déjà
            let errorTag = document.createElement("p");
            errorTag.innerText = "Erreur dans l’identifiant ou le mot de passe";
            formLogin.appendChild(errorTag);
            errorTag.classList.add("error");
          }
        }
      })
      .then((data) => {
        const token = data.token;
        // Stocker le token dans le localStorage
        window.localStorage.setItem("token", JSON.stringify(token));
        console.log(window.localStorage.getItem("token"));

        window.location.href = "index.html";
      })
      .catch((error) =>
        console.error("erreur lors de la récupération des données")
      );
  });
  //   try {
  //     // Envoi du formulaire au format JSON
  //     const response = await fetch("http://localhost:5678/api/users/login", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: chargeUtile,
  //     });

  //     if (response.ok) {
  //       // Récupération de la réponse de l'API
  //       const reponseJson = await response.json();
  //       const token = JSON.stringify(reponseJson.token);
  //       window.localStorage.setItem("token", token);
  //       if ((window.location = "login.html")) {
  //         window.location.replace("index.html");
  //       }
  //     } else {
  //       alert("Erreur dans l’identifiant ou le mot de passe");
  //       zoneEmail.value = null;
  //       zoneMdp.value = null;
  //     }
  //   } catch (error) {
  //     console.log("request failed");
  //   }
  // });
}
envoiFormulaire();
