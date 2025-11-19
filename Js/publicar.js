const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.querySelector(".nav-links");
if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("active");
  });
}

function fixImage(url) {
  if (!url) return "https://encycolorpedia.es/9b9b9b.png";
  return url.replace("http://localhost:8000", "https://api-iablog.onrender.com");
}

document.addEventListener("DOMContentLoaded", () => {

  const token = localStorage.getItem("access_token");

  const logoutBtn = document.querySelector(".login-btn");
  const publishLink = document.querySelector('a[href="publicar.html"]');
  const myPostsLink = document.querySelector('a[href="myposts.html"]');

  if (!token) {
    if (publishLink) publishLink.style.display = "none";
    if (myPostsLink) myPostsLink.style.display = "none";
  } else {
    if (publishLink) publishLink.style.display = "inline-block";
    if (myPostsLink) myPostsLink.style.display = "inline-block";

    if (logoutBtn) {
      logoutBtn.textContent = "Cerrar Sesión";
      logoutBtn.href = "#";
      logoutBtn.addEventListener("click", logout);
    }
  }

  if (!token && window.location.pathname.includes("publicar.html")) {
    window.location.href = "login.html";
    return;
  }

  const generateBtn = document.getElementById("send-btn");
  const promptInput = document.getElementById("prompt-input");
  const postCard = document.getElementById("post-card");
  const postTitle = document.getElementById("post-title");
  const postDescription = document.getElementById("post-description");
  const postImg = document.getElementById("post-image");
  const postLink = document.getElementById("post-link");
  const genError = document.getElementById("gen-error");

  if (generateBtn) {
    generateBtn.addEventListener("click", async () => {

      const promptValue = promptInput.value.trim();
      genError.style.display = "none";
      postCard.style.display = "none";

      if (!promptValue) {
        genError.textContent = "Debes escribir una idea primero.";
        genError.style.display = "block";
        return;
      }

      generateBtn.disabled = true;
      generateBtn.textContent = "Generando...";

      try {
        const response = await fetch("https://api-iablog.onrender.com/posts/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ prompt: promptValue })
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error("No se pudo generar blog");
        }

        postTitle.textContent = result.title;
        postDescription.textContent = result.seo_description;

        postImg.src = fixImage(result.images?.[0]?.url);
        postLink.href = `blog.html?id=${result.id}`;

        postCard.style.display = "block";

        generateBtn.textContent = "Generado";

      } catch (error) {
        console.error(error);
        genError.textContent = "No se pudo generar blog";
        genError.style.display = "block";

        generateBtn.disabled = false;
        generateBtn.textContent = "Generar";
      }
    });
  }
});

window.logout = function () {
  localStorage.removeItem("access_token");
  localStorage.removeItem("token_type");
  localStorage.removeItem("user_id");
  window.location.href = "login.html";
};
