const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.querySelector(".nav-links");
if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("active");
  });
}

document.addEventListener("DOMContentLoaded", () => {

  const token = localStorage.getItem("access_token");
  const logoutBtn = document.querySelector(".login-btn");

  const publishLink = document.querySelector('a[href="publicar.html"]');
  const myPostsLink = document.querySelector('a[href="myposts.html"]');

  if (!token) {
    if (publishLink) publishLink.style.display = "none";
    if (myPostsLink) myPostsLink.style.display = "none";

    if (window.location.pathname.includes("myposts.html")) {
      window.location.href = "login.html";
      return;
    }

  } else {
    if (publishLink) publishLink.style.display = "inline-block";
    if (myPostsLink) myPostsLink.style.display = "inline-block";

    if (logoutBtn) {
      logoutBtn.textContent = "Cerrar Sesión";
      logoutBtn.href = "#";
      logoutBtn.addEventListener("click", logout);
    }
  }

});

window.logout = function () {
  localStorage.removeItem("access_token");
  localStorage.removeItem("token_type");
  localStorage.removeItem("user_id");
  window.location.href = "login.html";
};
