const hamburger = document.getElementById("hamburger");
const menu = document.getElementById("menu");
const links = menu.querySelectorAll("a");

hamburger.addEventListener("click", () => {
  menu.classList.toggle("active");
});

links.forEach(link => {
  link.addEventListener("click", () => {
    menu.classList.remove("active");
  });
});
