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

const data = {
  currentUser: {
    image: {
      png: "./assets/img/image-amyrobson.png",
      webp: "./assets/img/image-amyrobson.webp",
    },
    username: "ggg",
  },
  comments: [
    {
      parent: 0,
      id: 1,
      content:
        "alo alo alo alo alo alo alo alo alo alo alo alo alo locc locc locc locc",
      createdAt: "1 tháng trước",
      score: 12,
      user: {
        image: {
          png: "./assets/img/image-amyrobson.png",
          webp: "./assets/img/image-amyrobson.webp",
        },
        username: "tankin",
      },
      replies: [],
    },
    {
      parent: 0,
      id: 2,
      content:
        "Wow, wo ươ vjv ifd vf dfizuhejsdck djcsjkvfgruvd dscf7redc ufwacndfvfv ubed",
      createdAt: "2 tuần trước",
      score: 5,
      user: {
        image: {
          png: "./assets/img/image-amyrobson.png",
          webp: "./assets/img/image-amyrobson.webp",
        },
        username: "beodan",
      },
      replies: [
        {
          parent: 2,
          id: 1,
          content:
            "bhebcav iejdfnv udjcn uhefjdncs hfdjcsn uhfdjcsn uhfdjnc djbcjfv hùdjcsn",
          createdAt: "1 tuần trước",
          score: 4,
          replyingTo: "beodan",
          user: {
            image: {
              png: "./assets/img/image-amyrobson.png",
              webp: "./assets/img/image-amyrobson.webp",
            },
            username: "dlinh",
          },
        },
        {
          parent: 2,
          id: 1,
          content:
            "uferhfbg fifjbnlkfwiefbfjbbefdnv ehw a eucwdjsap dsuhcj iushic e cdusz cfn  8usdac jf  udcsja  uhdsac jf hui  hidc guhdec  fdhcsnj yeyhud csnj cnhfdvhhfvcc ehfdhvbd",
          createdAt: "2 ngày trước",
          score: 2,
          replyingTo: "dlinh",
          user: {
            image: {
              png: "./assets/img/image-amyrobson.png",
              webp: "./assets/img/image-amyrobson.webp",
            },
            username: "vlinh",
          },
        },
      ],
    },
  ],
};
function appendFrag(frag, parent) {
  var children = [].slice.call(frag.childNodes, 0);
  parent.appendChild(frag);
  //console.log(children);
  return children[1];
}

const addComment = (body, parentId, replyTo = undefined) => {
  let commentParent =
    parentId === 0
      ? data.comments
      : data.comments.filter((c) => c.id == parentId)[0].replies;
  let newComment = {
    parent: parentId,
    id:
      commentParent.length == 0
        ? 1
        : commentParent[commentParent.length - 1].id + 1,
    content: body,
    createdAt: "Bây giờ",
    replyingTo: replyTo,
    score: 0,
    replies: parent == 0 ? [] : undefined,
    user: data.currentUser,
  };
  commentParent.push(newComment);
  initComments();
};
const deleteComment = (commentObject) => {
  if (commentObject.parent == 0) {
    data.comments = data.comments.filter((e) => e != commentObject);
  } else {
    data.comments.filter((e) => e.id === commentObject.parent)[0].replies =
      data.comments
        .filter((e) => e.id === commentObject.parent)[0]
        .replies.filter((e) => e != commentObject);
  }
  initComments();
};

const promptDel = (commentObject) => {
  const modalWrp = document.querySelector(".modal-wrp");
  modalWrp.classList.remove("invisible");
  modalWrp.querySelector(".yes").addEventListener("click", () => {
    deleteComment(commentObject);
    modalWrp.classList.add("invisible");
  });
  modalWrp.querySelector(".no").addEventListener("click", () => {
    modalWrp.classList.add("invisible");
  });
};

const spawnReplyInput = (parent, parentId, replyTo = undefined) => {
  if (parent.querySelectorAll(".reply-input")) {
    parent.querySelectorAll(".reply-input").forEach((e) => {
      e.remove();
    });
  }
  const inputTemplate = document.querySelector(".reply-input-template");
  const inputNode = inputTemplate.content.cloneNode(true);
  const addedInput = appendFrag(inputNode, parent);
  addedInput.querySelector(".bu-primary").addEventListener("click", () => {
    let commentBody = addedInput.querySelector(".cmnt-input").value;
    if (commentBody.length == 0) return;
    addComment(commentBody, parentId, replyTo);
  });
};

const createCommentNode = (commentObject) => {
  const commentTemplate = document.querySelector(".comment-template");
  var commentNode = commentTemplate.content.cloneNode(true);
  commentNode.querySelector(".usr-name").textContent =
    commentObject.user.username;
  commentNode.querySelector(".usr-img").src = commentObject.user.image.webp;
  commentNode.querySelector(".score-number").textContent = commentObject.score;
  commentNode.querySelector(".cmnt-at").textContent = commentObject.createdAt;
  commentNode.querySelector(".c-body").textContent = commentObject.content;
  if (commentObject.replyingTo)
    commentNode.querySelector(".reply-to").textContent =
      "@" + commentObject.replyingTo;

  commentNode.querySelector(".score-plus").addEventListener("click", () => {
    commentObject.score++;
    initComments();
  });

  commentNode.querySelector(".score-minus").addEventListener("click", () => {
    commentObject.score--;
    if (commentObject.score < 0) commentObject.score = 0;
    initComments();
  });
  if (commentObject.user.username == data.currentUser.username) {
    commentNode.querySelector(".comment").classList.add("this-user");
    commentNode.querySelector(".delete").addEventListener("click", () => {
      promptDel(commentObject);
    });
    commentNode.querySelector(".edit").addEventListener("click", (e) => {
      const path = e.path[3].querySelector(".c-body");
      if (
        path.getAttribute("contenteditable") == false ||
        path.getAttribute("contenteditable") == null
      ) {
        path.setAttribute("contenteditable", true);
        path.focus();
      } else {
        path.removeAttribute("contenteditable");
      }
    });
    return commentNode;
  }
  return commentNode;
};

const appendComment = (parentNode, commentNode, parentId) => {
  const bu_reply = commentNode.querySelector(".reply");
  // parentNode.appendChild(commentNode);
  const appendedCmnt = appendFrag(commentNode, parentNode);
  const replyTo = appendedCmnt.querySelector(".usr-name").textContent;
  bu_reply.addEventListener("click", () => {
    if (parentNode.classList.contains("replies")) {
      spawnReplyInput(parentNode, parentId, replyTo);
    } else {
      //console.log(appendedCmnt.querySelector(".replies"));
      spawnReplyInput(
        appendedCmnt.querySelector(".replies"),
        parentId,
        replyTo
      );
    }
  });
};

function initComments(
  commentList = data.comments,
  parent = document.querySelector(".comments-wrp")
) {
  parent.innerHTML = "";
  commentList.forEach((element) => {
    var parentId = element.parent == 0 ? element.id : element.parent;
    const comment_node = createCommentNode(element);
    if (element.replies && element.replies.length > 0) {
      initComments(element.replies, comment_node.querySelector(".replies"));
    }
    appendComment(parent, comment_node, parentId);
  });
}

initComments();
const cmntInput = document.querySelector(".reply-input");
cmntInput.querySelector(".bu-primary").addEventListener("click", () => {
  let commentBody = cmntInput.querySelector(".cmnt-input").value;
  if (commentBody.length == 0) return;
  addComment(commentBody, 0);
  cmntInput.querySelector(".cmnt-input").value = "";
});

// luu bai viet
document
  .getElementById("save-article-btn")
  .addEventListener("click", function () {
    const isSaved = this.classList.toggle("saved");

    if (isSaved) {
      this.innerHTML = '<i class="fa-solid fa-bookmark"></i>';
      // Gọi API lưu bài viết
      console.log("Bài viết đã được lưu");
    } else {
      this.innerHTML = '<i class="fa-regular fa-bookmark"></i>';
      // Gọi API bỏ lưu bài viết
      console.log("Bài viết đã bỏ lưu");
    }
  });
