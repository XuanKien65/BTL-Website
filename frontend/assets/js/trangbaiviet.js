// ========================== DỮ LIỆU BAN ĐẦU ==========================
let postId = null;

// ========================== HÀM HỖ TRỢ ==========================
function getCurrentUser(token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return { id: payload.id, role: payload.role };
  } catch {
    return null;
  }
}

// Đợi access token có sẵn
function waitForAccessToken(timeout = 1500) {
  return new Promise((resolve, reject) => {
    const interval = 100;
    let waited = 0;

    const check = () => {
      if (window.currentAccessToken) {
        resolve(window.currentAccessToken);
      } else if (waited >= timeout) {
        reject("Access token timeout");
      } else {
        waited += interval;
        setTimeout(check, interval);
      }
    };

    check();
  });
}

// Kiểm tra xem bài viết hiện tại đã được lưu chưa
function checkIfSaved(postId) {
  const accessToken = window.currentAccessToken;
  if (!accessToken) return;

  fetch("http://localhost:5501/api/saved", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      const savedPosts = data.data;
      const isSaved = savedPosts.some((post) => post.postid === postId);
      const btn = document.getElementById("save-article-btn");

      if (isSaved && btn) {
        btn.classList.add("saved");
        btn.innerHTML = '<i class="fa-solid fa-bookmark"></i>';
      }
    })
    .catch((err) => console.error("Lỗi khi kiểm tra đã lưu:", err));
}
// =======================HÀM CHO ĐĂNG COMMENT=========================
let data = {
  comments: [],
  currentUser: null,
};
// ==== Gọi từ API và lưu vào data.comments ====
function buildNestedComments(flatComments) {
  const map = {};
  const roots = [];

  flatComments.forEach((c) => {
    map[c.cmtid] = { ...c, replies: [] };
  });

  flatComments.forEach((c) => {
    if (c.parentid) {
      if (map[c.parentid]) {
        map[c.parentid].replies.push(map[c.cmtid]);
      }
    } else {
      roots.push(map[c.cmtid]);
    }
  });

  return roots;
}

function appendFrag(frag, parent) {
  const div = document.createElement("div");
  div.appendChild(frag);
  const element = div.firstElementChild;
  parent.appendChild(element);
  return element;
}

async function loadComments(postId) {
  console.log("⏳ Gọi loadComments với postId:", postId);
  try {
    const res = await fetch(
      `http://localhost:5501/api/comments/post/${postId}`
    );
    const result = await res.json();
    console.log(result);
    if (result.success) {
      data.comments = buildNestedComments(result.data);
      initComments();
    }
  } catch (err) {
    console.error("Lỗi khi tải bình luận:", err);
  }
}

async function addComment(body, parentId = null, replyTo = undefined) {
  const token = window.currentAccessToken;
  console.log(window.currentAccessToken);
  if (!token) return alert("Bạn cần đăng nhập!");

  try {
    const res = await fetch(`http://localhost:5501/api/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        content: body,
        postId,
        parentId,
        replyingTo: replyTo,
      }),
    });

    const result = await res.json();
    if (result.success) {
      await loadComments(postId);
    } else {
      alert("❌ Gửi bình luận thất bại");
    }
  } catch (err) {
    console.error("Lỗi gửi bình luận:", err);
  }
}

async function deleteComment(commentObject) {
  const token = window.currentAccessToken;
  if (!token) return alert("Bạn cần đăng nhập!");

  try {
    const res = await fetch(
      `http://localhost:5501/api/comments/${commentObject.cmtid}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (res.ok) {
      await loadComments(postId);
    } else {
      alert("Không thể xoá bình luận.");
    }
  } catch (err) {
    console.error("Lỗi xoá bình luận:", err);
  }
}

function promptDel(commentObject) {
  const modalWrp = document.querySelector(".modal-wrp");
  modalWrp.classList.remove("invisible");

  const yesBtn = modalWrp.querySelector(".yes");
  const noBtn = modalWrp.querySelector(".no");

  // Remove old listeners before adding new ones
  const newYes = yesBtn.cloneNode(true);
  yesBtn.parentNode.replaceChild(newYes, yesBtn);
  const newNo = noBtn.cloneNode(true);
  noBtn.parentNode.replaceChild(newNo, noBtn);

  newYes.addEventListener("click", () => {
    deleteComment(commentObject);
    modalWrp.classList.add("invisible");
  });

  newNo.addEventListener("click", () => {
    modalWrp.classList.add("invisible");
  });
}

function spawnReplyInput(parent, parentId, replyTo = undefined) {
  parent.querySelectorAll(".reply-input").forEach((e) => e.remove());
  const inputTemplate = document.querySelector(".reply-input-template");
  const inputNode = inputTemplate.content.cloneNode(true);
  const addedInput = appendFrag(inputNode, parent);
  try {
    const payload = JSON.parse(atob(window.currentAccessToken.split(".")[1]));
    const avatar = addedInput.querySelector(".usr-img");
    if (avatar && payload.avatarurl) {
      avatar.src = payload.avatarurl;
    }
  } catch {
    // fallback
    const avatar = addedInput.querySelector(".usr-img");
    if (avatar) avatar.src = "../assets/img/user-default.jpg";
  }

  addedInput.querySelector(".bu-primary").addEventListener("click", () => {
    const commentBody = addedInput.querySelector(".cmnt-input").value;
    if (commentBody.length === 0) return;
    addComment(commentBody, parentId, replyTo);
  });
}

function createCommentNode(commentObject) {
  const commentTemplate = document.querySelector(".comment-template");
  const frag = commentTemplate.content.cloneNode(true);
  const container = document.createElement("div");
  container.appendChild(frag);
  const node = container.firstElementChild; // Đây mới là phần tử DOM thực sự

  node.querySelector(".usr-name").textContent = commentObject.username;
  node.querySelector(".usr-img").src =
    commentObject.avatarurl || "/default.png";
  node.querySelector(".score-number").textContent = commentObject.score || 0;
  node.querySelector(".cmnt-at").textContent = new Date(
    commentObject.createdat
  ).toLocaleString();
  node.querySelector(".c-body").textContent = commentObject.content;

  if (commentObject.replyingto) {
    node.querySelector(
      ".reply-to"
    ).textContent = `@${commentObject.replyingto}`;
  }

  node.querySelector(".score-plus").addEventListener("click", async () => {
    const token = window.currentAccessToken;
    if (!token) return alert("Bạn cần đăng nhập để vote");

    try {
      const res = await fetch(
        `http://localhost:5501/api/comments/score/${commentObject.cmtid}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ delta: 1 }),
        }
      );

      if (!res.ok) throw new Error("Vote thất bại");
      commentObject.score += 1;
      initComments();
    } catch (err) {
      console.error("Lỗi khi vote:", err);
    }
  });

  node.querySelector(".score-minus").addEventListener("click", async () => {
    const token = window.currentAccessToken;
    if (!token) return alert("Bạn cần đăng nhập để vote");

    try {
      const res = await fetch(
        `http://localhost:5501/api/comments/score/${commentObject.cmtid}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ delta: -1 }),
        }
      );

      if (!res.ok) throw new Error("Vote thất bại");
      commentObject.score = Math.max(0, commentObject.score - 1);
      initComments();
    } catch (err) {
      console.error("Lỗi khi vote:", err);
    }
  });

  const currentUser = getCurrentUser(window.currentAccessToken);
  if (
    currentUser?.id === commentObject.userid ||
    currentUser?.role === "admin"
  ) {
    const wrapper = node.querySelector(".comment");
    wrapper.classList.add("this-user");

    const delBtn = node.querySelector(".delete");
    if (delBtn) {
      delBtn.addEventListener("click", () => promptDel(commentObject));
    }
  } else {
    node.querySelector(".delete")?.remove();
  }

  return node; // ✅ Trả về phần tử DOM đúng
}

function appendComment(parentNode, commentNode, parentId) {
  const appended = appendFrag(commentNode, parentNode); // append xong mới dùng được
  const replyBtn = appended.querySelector(".reply");
  const replyTo = appended.querySelector(".usr-name")?.textContent;

  if (replyBtn) {
    replyBtn.addEventListener("click", () => {
      const replyBox = appended.querySelector(".replies");
      spawnReplyInput(replyBox, parentId, replyTo);
    });
  } else {
    console.log("Không tìm thấy nút Trả lời trong template.");
  }
}

function initComments(
  commentList = data.comments,
  parent = document.querySelector(".comments-wrp")
) {
  parent.innerHTML = "";
  commentList.forEach((comment) => {
    const parentId = comment.parentid || comment.cmtid;
    const node = createCommentNode(comment);
    appendComment(parent, node, parentId);
    if (comment.replies?.length > 0) {
      initComments(comment.replies, node.querySelector(".replies"));
    }
  });
}
function initCommentInputUI() {
  const inputBox = document.querySelector(".reply-input");
  const textarea = inputBox.querySelector(".cmnt-input");
  const button = inputBox.querySelector(".bu-primary");
  const avatar = inputBox.querySelector(".usr-img");

  if (!window.currentAccessToken) {
    textarea.disabled = true;
    textarea.placeholder = "Vui lòng đăng nhập để bình luận...";
    button.disabled = true;
    avatar.src = "../assets/img/user-default.jpg";
    return;
  }

  // Nếu đã đăng nhập, giải mã avatar
  try {
    const payload = JSON.parse(atob(window.currentAccessToken.split(".")[1]));
    console.log(payload);
    if (payload.avatarurl) avatar.src = payload.avatarurl;
  } catch {
    // fallback
    avatar.src = "../assets/img/user-default.jpg";
  }
}

// ========================== LƯU / BỎ LƯU BÀI VIẾT ==========================

document
  .getElementById("save-article-btn")
  .addEventListener("click", async function () {
    try {
      const accessToken = window.currentAccessToken;
      console.log(accessToken);
      if (!accessToken) {
        console.error("Access token không tồn tại");
        return;
      }

      const tokenPayload = accessToken.split(".")[1];
      const decodedPayload = JSON.parse(atob(tokenPayload));
      const userId = decodedPayload.id;
      const isSaved = this.classList.toggle("saved");

      if (isSaved) {
        this.innerHTML = '<i class="fa-solid fa-bookmark"></i>';
        const res = await fetch(`http://localhost:5501/api/save/${postId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ userId, postId }),
        });
        if (!res.ok) throw new Error("lỗi lưu bài viết");
      } else {
        this.innerHTML = '<i class="fa-regular fa-bookmark"></i>';
        const res = await fetch(`http://localhost:5501/api/unsave/${postId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (!res.ok) throw new Error("lỗi bỏ lưu bài viết");
      }
    } catch (err) {
      console.error("❌ Lỗi click:", err);
    }
  });

// ========================== CHIA SẺ BÀI VIẾT ==========================

const currentURL = window.location.href;

// Share Facebook
document
  .getElementById("share-facebook")
  ?.addEventListener("click", function (e) {
    e.preventDefault();
    const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      currentURL
    )}`;
    window.open(facebookShareUrl, "_blank", "width=600,height=400");
  });

// Share Zalo
document.getElementById("share-zalo")?.addEventListener("click", function (e) {
  e.preventDefault();
  const zaloShareUrl = `https://zalo.me/share?url=${encodeURIComponent(
    currentURL
  )}`;
  window.open(zaloShareUrl, "_blank", "width=600,height=400");
});

// ========================== DOMContentLoaded ==========================

document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get("slug");
  await loadLatestPosts();

  if (slug) {
    try {
      const res = await fetch(`http://localhost:5501/api/posts/${slug}`);
      const result = await res.json();
      if (result.success) {
        const post = result.data;
        postId = post.postid;
        console.log(post);
        renderCategoryChildren(post.categories);
        // ⚡️ Hiển thị UI ngay
        renderPost(post);
        await loadComments(postId);
        waitForAccessToken(1500)
          .then((token) => {
            initCommentInputUI();
            fetch(`http://localhost:5501/api/posts/${postId}/view`, {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            checkIfSaved(postId);
          })
          .catch(() => {
            console.warn("Không lấy được access token (timeout)");
            document.getElementById("save-article-btn").style.display = "none";
          });
      }
    } catch (err) {
      console.error("Lỗi khi lấy bài viết:", err);
    }
  }

  document
    .querySelector(".reply-input .bu-primary")
    ?.addEventListener("click", () => {
      const commentBody = document.querySelector(
        ".reply-input .cmnt-input"
      ).value;
      if (commentBody.trim().length === 0) return;
      addComment(commentBody);
      document.querySelector(".reply-input .cmnt-input").value = "";
    });
});
function renderPost(post) {
  document.querySelector(".news-title h1").textContent = post.title;
  document.querySelector(".news-detail p").innerHTML = `
    <strong>Tác giả</strong> ${post.authorname}
    <strong>Ngày đăng</strong> ${new Date(post.createdat).toLocaleDateString(
      "vi-VN"
    )}
  `;
  document.querySelector(".news-body").innerHTML = post.content;

  const tagContainer = document.querySelector(".hashtag-container");
  tagContainer.innerHTML = "";
  post.tags.forEach((tag) => {
    const span = document.createElement("span");
    span.className = "hashtag";
    span.textContent = `#${tag}`;
    tagContainer.appendChild(span);
  });
}
// ========================== DANH SÁCH BÀI VIẾT GỢI Ý ==========================
async function renderCategoryChildren(categories) {
  if (!categories || categories.length === 0) return;

  const currentCategory = categories[0];
  const parentId = currentCategory.parent_id || currentCategory.id;

  const isFromChild = !!currentCategory.parent_id;
  const currentCategoryId = currentCategory.id;

  try {
    // Lấy danh sách category con
    const res = await fetch(
      `http://localhost:5501/api/categories?parent_id=${parentId}`
    );
    const result = await res.json();

    if (result.success && Array.isArray(result.data)) {
      // Cập nhật tiêu đề h2
      const heading = document.querySelector(".news-heading");
      if (heading) {
        let parentName = "Chủ đề";

        if (isFromChild) {
          // Gọi API lấy category cha
          const resParent = await fetch(
            `http://localhost:5501/api/categories?parent_id=null`
          );
          const resultParent = await resParent.json();
          if (resultParent.success) {
            const found = resultParent.data.find((c) => c.id === parentId);
            if (found) parentName = found.name;
          }
        } else {
          parentName = currentCategory.name;
        }

        heading.textContent = parentName;
      }

      // Cập nhật danh sách chuyên mục con
      const container = document.querySelector(".news-subject");
      if (!container) return;
      container.innerHTML = "";

      result.data.forEach((cat) => {
        const a = document.createElement("a");
        a.href = "#"; // Ngăn reload
        a.classList.add("tab-link");
        a.dataset.categoryId = cat.id;
        a.dataset.isParent = "false";
        a.dataset.category = cat.slug;
        a.textContent = cat.name;

        container.appendChild(a);
      });
      // Auto-trigger tab cha ngay sau khi render
      const parentTab = document.querySelector(".news-heading.tab-link");
      if (parentTab) {
        parentTab.click();
      }
    }
  } catch (err) {
    console.error("❌ Lỗi khi load chuyên mục con:", err);
  }
}

document.addEventListener("click", async function (e) {
  const target = e.target;
  if (!target.classList.contains("tab-link")) return;
  e.preventDefault();

  const categoryId = target.dataset.categoryId;
  const isParent = target.dataset.isParent === "true";
  console.log(isParent);
  if (!categoryId) return;

  // 1. Highlight UI
  document
    .querySelectorAll(".tab-link")
    .forEach((el) => el.classList.remove("active-tab"));
  target.classList.add("active-tab");

  // 2. Gọi API
  let url = "";
  if (isParent) {
    url = `http://localhost:5501/api/posts/by-parent/${categoryId}`;
    try {
      const res = await fetch(url);
      const result = await res.json();
      console.log(result);
      if (Array.isArray(result)) {
        renderPostList(result);
      } else {
        console.warn("Không có bài viết nào.");
      }
    } catch (err) {
      console.error("❌ Lỗi khi tải bài viết theo tab:", err);
    }
  } else {
    console.log(categoryId);
    url = `http://localhost:5501/api/posts?categoryId=${categoryId}`;
    try {
      const res = await fetch(url);
      const result = await res.json();
      console.log(result);
      if (Array.isArray(result.data.posts)) {
        renderPostList(result.data.posts);
      } else {
        console.warn("Không có bài viết nào.");
      }
    } catch (err) {
      console.error("❌ Lỗi khi tải bài viết theo tab:", err);
    }
  }
});

function renderPostList(posts) {
  const container = document.getElementById("postGrid");
  container.innerHTML = "";

  posts.forEach((post) => {
    const imageUrl = post.featuredimage?.startsWith("http")
      ? post.featuredimage
      : `http://localhost:5501${post.featuredimage}`;
    const date = new Date(post.createdat).toLocaleDateString("vi-VN");

    const item = document.createElement("a");
    item.className = "grid__column-2";
    item.href = `/pages/trangbaiviet.html?slug=${post.slug}`;
    item.innerHTML = `
      <div class="news-home-item">
        <div class="news-home-item--img" style="background-image: url('${imageUrl}')"></div>
        <div class="news-home-item--content">
          <h4 class="news-home-item--name">${post.title}</h4>
          <p class="news-home-item--excerpt">${post.excerpt}</p>
          <div class="news-home-item--meta">
            <span class="news-home-item--date">${date}</span>
            <span class="news-home-item--read-time">${post.views} views</span>
          </div>
        </div>
      </div>
    `;
    container.appendChild(item);
  });
}
async function loadLatestPosts() {
  try {
    const res = await fetch("http://localhost:5501/api/posts/latest?limit=10");
    const posts = await res.json();

    const container = document.querySelector(".most-view .news");
    container.innerHTML = "";

    posts.forEach((post) => {
      const imageUrl = post.featuredimage?.startsWith("http")
        ? post.featuredimage
        : `http://localhost:5501${post.featuredimage}`;
      const link = `/pages/trangbaiviet.html?slug=${post.slug}`;

      const item = document.createElement("div");
      item.className = "news n1";
      item.innerHTML = `
        <a href="${link}">
          <div class="article-image">
            <img src="${imageUrl}" alt="" />
          </div>
          <div class="title">${post.title}</div>
        </a>
      `;
      container.appendChild(item);
    });
  } catch (err) {
    console.error("❌ Lỗi khi tải tin mới nhất:", err);
  }
}
