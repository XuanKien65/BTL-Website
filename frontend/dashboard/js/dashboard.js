let usersChart;
let postsChart;


async function initCharts() {
  await getNumUser();
  await getArticleNum();
  await getCateNum();
  await getCmtNum();
}
async function getNumUser() {
  try {
    const token = await getAccessTokenFromRefresh();
    const usersResponse = await fetch("http://localhost:5501/api/users", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!usersResponse.ok) throw new Error("Lỗi khi tải danh sách người dùng");

    let users = await usersResponse.json();
    const userNum = users.data.length;
    initUsersChart(users.data);
    const div = document.querySelector(".users p");
    div.innerHTML = `${userNum}`;
  } catch (err) {}
}
async function getArticleNum() {
  try {
    const data = await fetch(
      "http://localhost:5501/api/posts?status=published"
    );
    if (!data.ok) throw new Error("Lỗi");
    let res = await data.json();
    console.log(res);
    const postNum = res.data.posts.length;
    initPostsChart(res.data.posts);
    const div = document.querySelector(".posts p");
    div.innerHTML = `${postNum}`;
  } catch (err) {}
}
async function getCateNum() {
  try {
    const data = await fetch("http://localhost:5501/api/categories/");
    if (!data.ok) throw new Error("lỗi");
    let res = await data.json();
    const cateNum = res.data.length;
    const div = document.querySelector(".cate p");
    div.innerHTML = `${cateNum}`;
  } catch (err) {}
}
async function getCmtNum() {
  try {
    const token = await getAccessTokenFromRefresh();
    const data = await fetch(
      "http://localhost:5501/api/comments?status=approved",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (!data.ok) throw new Error("lỗi");
    let res = await data.json();
    const cmtNum = res.data.length;
    const div = document.querySelector(".cmt p");
    div.innerHTML = `${cmtNum}`;
  } catch (err) {}
}
function countByMonth(data, dateKey) {
  const monthlyCount = Array(12).fill(0);

  data.forEach((item) => {
    const dateStr = item[dateKey];
    if (dateStr) {
      const date = new Date(dateStr);
      const month = date.getMonth(); // 0–11
      monthlyCount[month]++;
    }
  });

  return monthlyCount; // Trả về đủ 12 tháng
}
const labels = [
  "Tháng 1",
  "Tháng 2",
  "Tháng 3",
  "Tháng 4",
  "Tháng 5",
  "Tháng 6",
  "Tháng 7",
  "Tháng 8",
  "Tháng 9",
  "Tháng 10",
  "Tháng 11",
  "Tháng 12",
];
function initUsersChart(users) {
  const counts = countByMonth(users, "createdat");

  const usersCtx = document.getElementById("usersChart")?.getContext("2d");
  if (usersCtx) {
    usersChart = new Chart(usersCtx, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "Người dùng mới",
            data: counts,
            backgroundColor: "rgba(75, 192, 192, 0.6)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: "top" },
          title: { display: true, text: "Người dùng mới theo tháng" },
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: getGridColor(),
            }
          },
          x: {
            grid: {
              color: getGridColor(),
            }
          }
        }        
      },
    });
  }
}

function initPostsChart(posts) {
  const counts = countByMonth(posts, "createdat");

  const postsCtx = document.getElementById("postsChart")?.getContext("2d");
  if (postsCtx) {
    postsChart = new Chart(postsCtx, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "Bài viết",
            data: counts,
            backgroundColor: "rgba(67, 97, 238, 0.2)",
            borderColor: "rgba(67, 97, 238, 1)",
            borderWidth: 2,
            tension: 0.4,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: "top" },
          title: { display: true, text: "Bài viết theo tháng" },
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: getGridColor(),
            }
          },
          x: {
            grid: {
              color: getGridColor(),
            }
          }
        },        
      },
    });
  }
}

function getGridColor() {
  return document.body.classList.contains("dark-mode") ? "rgba(255, 255, 255, 0.61)" : "rgba(50, 50, 50, 0.23)";
}

function updateChartTheme() {
  if (usersChart) {
    usersChart.options.scales.x.grid.color = getGridColor();
    usersChart.options.scales.y.grid.color = getGridColor();
    usersChart.update();
  }
  if (postsChart) {
    postsChart.options.scales.x.grid.color = getGridColor();
    postsChart.options.scales.y.grid.color = getGridColor();
    postsChart.update();
  }
}
