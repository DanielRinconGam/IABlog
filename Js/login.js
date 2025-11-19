const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.querySelector(".nav-links");
menuToggle.addEventListener("click", () => {
  navLinks.classList.toggle("active");
});

document.addEventListener("DOMContentLoaded", () => {

  const token = localStorage.getItem("access_token");
  const registerBtn = document.querySelector(".login-btn");
  const errorMsg = document.getElementById("error-msg");
  const form = document.querySelector("form");

  const publishLink = document.querySelector('a[href="publicar.html"]');
  const myPostsLink = document.querySelector('a[href="myposts.html"]');

  if (!token) {
    if (publishLink) publishLink.style.display = "none";
    if (myPostsLink) myPostsLink.style.display = "none";

  } else {
    if (publishLink) publishLink.style.display = "inline-block";
    if (myPostsLink) myPostsLink.style.display = "inline-block";

    if (registerBtn) {
      registerBtn.textContent = "Cerrar sesión";
      registerBtn.href = "#";
      registerBtn.addEventListener("click", logout);
    }

    const location = window.location.pathname;
    if (location.includes("login.html") || location.includes("register.html")) {
      window.location.href = "home.html";
      return;
    }
  }

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (errorMsg) errorMsg.textContent = "";

    const email = form.querySelector('input[type="email"]').value;
    const password = form.querySelector('input[type="password"]').value;

    const data = { email, password };

    try {
      const response = await fetch("https://api-iablog.onrender.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (!response.ok) {
        if (typeof result.detail === "string") {
          errorMsg.textContent = result.detail;
        } else {
          errorMsg.textContent = "Credenciales incorrectas";
        }
        return;
      }

      localStorage.setItem("access_token", result.access_token);
      localStorage.setItem("token_type", result.token_type);
      localStorage.setItem("user_id", result.user_id);

      window.location.href = "home.html";

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
