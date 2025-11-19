const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.querySelector(".nav-links");
menuToggle.addEventListener("click", () => {
  navLinks.classList.toggle("active");
});

document.addEventListener("DOMContentLoaded", () => {

  const token = localStorage.getItem("access_token");
  const loginBtn = document.querySelector(".login-btn");
  const form = document.querySelector(".register-form");
  const errorMsg = document.createElement("div");

  const publishLink = document.querySelector('a[href="publicar.html"]');
  const myPostsLink = document.querySelector('a[href="myposts.html"]');

  errorMsg.id = "error-register";

  const confirmPasswordInput = document.getElementById("confirm-password");
  confirmPasswordInput.parentNode.insertAdjacentElement("afterend", errorMsg);

  if (!token) {
    if (publishLink) publishLink.style.display = "none";
    if (myPostsLink) myPostsLink.style.display = "none";
  } else {
    if (publishLink) publishLink.style.display = "inline-block";
    if (myPostsLink) myPostsLink.style.display = "inline-block";

    if (loginBtn) {
      loginBtn.textContent = "Cerrar sesión";
      loginBtn.href = "#";
      loginBtn.addEventListener("click", logout);
    }

    window.location.href = "home.html";
    return;
  }

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorMsg.textContent = "";

    const nickname = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPass = document.getElementById("confirm-password").value;

    if (nickname.length === 0) {
      errorMsg.textContent = "El nombre de usuario es obligatorio";
      return;
    }

    if (password !== confirmPass) {
      errorMsg.textContent = "Las contraseñas no coinciden";
      return;
    }

    if (!email.includes("@") || !email.includes(".")) {
      errorMsg.textContent = "El email no es válido";
      return;
    }

    const data = { nickname, email, password };

    try {
      const response = await fetch("https://api-iablog.onrender.com/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (!response.ok) {
        if (typeof result.detail === "string") {
          errorMsg.textContent = result.detail;
        } else {
          errorMsg.textContent = "No se pudo registrar";
        }
        return;
      }

      window.location.href = "login.html";

    } catch (error) {
      console.error(error);
      errorMsg.textContent = "Error de conexión con el servidor";
    }

  });

});

window.logout = function () {
  localStorage.removeItem("access_token");
  localStorage.removeItem("token_type");
  localStorage.removeItem("user_id");
  window.location.href = "login.html";
};
