const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.querySelector(".nav-links");
menuToggle.addEventListener("click", () => {
  navLinks.classList.toggle("active");
});

document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("access_token");
  const authBtn = document.querySelector(".login-btn");

  const publishLink = document.querySelector('a[href="publicar.html"]');
  const myPostsLink = document.querySelector('a[href="myposts.html"]');

  if (!token) {
    if (publishLink) publishLink.style.display = "none";
    if (myPostsLink) myPostsLink.style.display = "none";
  } else {
    if (publishLink) publishLink.style.display = "inline-block";
    if (myPostsLink) myPostsLink.style.display = "inline-block";

    authBtn.textContent = "Cerrar sesión";
    authBtn.href = "#";
    authBtn.addEventListener("click", logout);
  }

  fetchPosts();
});

function limitText(text, max) {
  return text && text.length > max
    ? text.substring(0, max) + "..."
    : text;
}

function fixImageUrl(url) {
  if (!url) return "https://encycolorpedia.es/9b9b9b.png";
  return url.replace("http://localhost:8000", "https://api-iablog.onrender.com");
}

async function fetchPosts() {
  try {
    const response = await fetch("https://api-iablog.onrender.com/posts");
    const posts = await response.json();
    renderPosts(posts);
  } catch (error) {
    console.error("Error al cargar posts:", error);
  }
}

function renderPosts(posts) {
  const container = document.getElementById("blog-grid");
  container.innerHTML = "";

  posts.forEach(post => {
    const title = limitText(post.title, 50);
    const desc = limitText(post.seo_description, 120);
    const image = fixImageUrl(post.images?.[0]?.url);

    const card = `
      <a href="blog.html?id=${post.id}" class="blog-link">
        <article class="blog-card">
          <img src="${image}" alt="Imagen del post" class="blog-img" />
          <h2 class="blog-title">${title}</h2>
          <p class="blog-desc">${desc}</p>
          <p class="blog-more">Ver más →</p>
        </article>
      </a>
    `;

    container.innerHTML += card;
  });
}

window.logout = function () {
  localStorage.removeItem("access_token");
  localStorage.removeItem("token_type");
  localStorage.removeItem("user_id");
  window.location.href = "login.html";
};
