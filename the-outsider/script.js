window.addEventListener("scroll", function () {
  let nav = document.querySelector(".nav");
  if (window.scrollY > 100) {
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

// searchBox.addEventListener("mouseleave", function () {
//   navbarLinks.forEach((a) => {
//     a.style.padding = "2rem 3vw";
//   });
// });
// searchBox.addEventListener("mouseleave", function () {
//   navbarLinks.forEach((a) => {
//     if (window.matchMedia("(max-width: 991.98px)").matches) {
//       a.style.padding = "2rem 1vw"; // Padding cho tablet
//     } else {
//       a.style.padding = "2rem 2vw"; // Padding cho PC
//     }
//   });
// });
document.addEventListener("DOMContentLoaded", function () {
  const commentInput = document.querySelector(".cmt-input.area");
  const sendButton = document.querySelector(".btn-sent");
  const commentSection = document.querySelector(".comment-section");

  sendButton.addEventListener("click", function () {
    const commentText = commentInput.value.trim();

    if (commentText !== "") {
      // Tạo một div mới để chứa bình luận
      const newComment = document.createElement("div");
      newComment.classList.add("comment-item");

      // Thêm avatar người dùng
      const userAvatar = document.createElement("img");
      userAvatar.src = "./assets/img/Screenshot 2025-03-07 142551.jpg"; // Đường dẫn đến avatar mặc định
      userAvatar.alt = "User Avatar";
      userAvatar.classList.add("user-ava");
      newComment.appendChild(userAvatar);

      // Thêm nội dung bình luận
      const commentContent = document.createElement("div");
      commentContent.classList.add("comment-content");
      commentContent.textContent = commentText;
      newComment.appendChild(commentContent);

      // Thêm bình luận vào phần hiển thị bình luận
      commentSection.appendChild(newComment);

      // Xóa nội dung trong ô nhập bình luận
      commentInput.value = "";
    }
  });
});
