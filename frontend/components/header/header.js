window.addEventListener("scroll", function () {
  let nav = document.querySelector(".nav");
  if (window.scrollY > 200) {
    nav.classList.add("scrolled");
  } else {
    nav.classList.remove("scrolled");
  }
});

let menu = document.querySelector("#menu-icon");
let navbar = document.querySelector(".navbar");
menu.onclick = () => {
  menu.classList.toggle("bx-x");
  navbar.classList.toggle("open");
};

// document.querySelector(".search").addEventListener("mouseenter", function () {
//   document.querySelectorAll(".navbar a").forEach((a) => {
//     a.style.padding = "2rem 2vw";
//   });
// });
const navbarLinks = document.querySelectorAll(".navbar a");
const searchBox = document.querySelector(".search");

searchBox.addEventListener("mouseenter", function () {
  navbarLinks.forEach((a) => {
    if (window.matchMedia("(max-width: 991.98px)").matches) {
      a.style.padding = "2rem 1vw";
    }
  });
});
