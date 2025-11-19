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
    authBtn.textContent = "Cerrar sesión";
    authBtn.href = "#";
    authBtn.addEventListener("click", logout);

    if (publishLink) publishLink.style.display = "inline-block";
    if (myPostsLink) myPostsLink.style.display = "inline-block";
  }

  loadPost();
});

window.logout = function () {
  localStorage.removeItem("access_token");
  localStorage.removeItem("token_type");
  localStorage.removeItem("user_id");
  window.location.href = "login.html";
};

function getPostId() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

async function loadPost() {
  const id = getPostId();
  if (!id) return;

  try {
    const res = await fetch(`https://api-iablog.onrender.com/posts/${id}`);
    const post = await res.json();

    renderPost(post);

  } catch (err) {
    console.error("Error cargando post:", err);
  }
}

function splitBodyText(text) {
  const words = text.split(" ");
  const length = words.length;
  const partSize = Math.ceil(length / 4);

  const parts = [
    words.slice(0, partSize).join(" "),
    words.slice(partSize, partSize * 2).join(" "),
    words.slice(partSize * 2, partSize * 3).join(" "),
    words.slice(partSize * 3).join(" ")
  ];

  return parts.map(p => p.trim());
}

function fixImage(url) {
  if (!url) return "https://encycolorpedia.es/9b9b9b.png";
  return url.replace("http://localhost:8000", "https://api-iablog.onrender.com");
}

function renderPost(post) {
  const headerImg = document.querySelector(".blog-header-img");
  const titleEl = document.querySelector(".blog-title");
  const contents = document.querySelectorAll(".blog-content");
  const imgsSmall = document.querySelectorAll(".blog-img-small");

  const bodyParts = splitBodyText(post.body);
  const images = post.images?.map(img => fixImage(img.url)) || [];

  titleEl.textContent = post.title;

  contents.forEach((el, i) => {
    el.textContent = bodyParts[i] || "";
  });

  headerImg.src = images[0] || headerImg.src;
  if (imgsSmall[0]) imgsSmall[0].src = images[1] || imgsSmall[0].src;
  if (imgsSmall[1]) imgsSmall[1].src = images[2] || imgsSmall[1].src;
}
