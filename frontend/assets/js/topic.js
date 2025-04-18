function loadHeader() {
  return fetch("../../components/header/header.html")
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return res.text();
    })
    .then((html) => {
      const headerPlaceholder = document.getElementById("headernav");
      if (!headerPlaceholder) throw new Error("Không tìm thấy #headernav");
      headerPlaceholder.innerHTML = html;
      return true;
    })
    .catch((error) => {
      console.error("Lỗi khi tải header:", error);
      return false;
    });
}

function loadFooter() {
  return fetch("../../components/footer/footer.html")
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return res.text();
    })
    .then((html) => {
      const footerPlaceholder = document.getElementById("isfooter");
      if (!footerPlaceholder) throw new Error("Không tìm thấy #isfooter");
      footerPlaceholder.innerHTML = html;
      return true;
    })
    .catch((error) => {
      console.error("Lỗi khi tải footer:", error);
      return false;
    });
}

// Hàm xử lý scroll sau khi DOM đã sẵn sàng
function handleScroll() {
  const nav = document.querySelector(".nav");
  if (!nav) return; // Thoát nếu không tìm thấy .nav

  if (window.scrollY > 200) {
    nav.classList.add("scrolled");
  } else {
    nav.classList.remove("scrolled");
  }
}

// Khởi tạo sau khi tất cả đã load xong
document.addEventListener("DOMContentLoaded", () => {
  Promise.all([loadHeader(), loadFooter()])
    .then(() => {
      // Gọi hàm xử lý scroll sau khi header/footer đã tải xong
      handleScroll();

      // Thêm event listener cho scroll
      window.addEventListener("scroll", handleScroll);
    })
    .catch((error) => {
      console.error("Lỗi khi khởi tạo:", error);
    });
});

const articles = [
  {
    img: "https://images2.thanhnien.vn/528068263637045248/2024/12/4/3-17332802768611370004247.jpg",
    title: "Kiếm chục nghìn USD từ game 'tạo bằng vài câu lệnh AI'",
    desc: "Fly Pieter, game 'được tạo đơn giản bằng vài câu lệnh AI', hiện giúp chủ nhân kiếm hơn 50.000 USD mỗi tháng.Fly Pieter, game 'được tạo đơn giản bằng vài câu lệnh AI', hiện giúp chủ nhân kiếm hơn 50.000 USD mỗi thángFly Pieter, game 'được tạo đơn giản bằng vài câu lệnh AI', hiện giúp chủ nhân kiếm hơn 50.000 USD mỗi thángFly Pieter, game 'được tạo đơn giản bằng vài câu lệnh AI', hiện giúp chủ nhân kiếm hơn 50.000 USD mỗi tháng",
    comments: 15,
    date: "15/03/2023",
    time: "2 phút hơn",
  },
  {
    img: "https://example.com/image2.jpg",
    title: "Công nghệ AI có thể thay thế lập trình viên?",
    desc: "Các chuyên gia đang tranh cãi về việc AI có thể thay thế hoàn toàn công việc lập trình viên hay không.",
    comments: 12,
    date: "16/03/2023",
    time: "3 phút",
  },
  {
    img: "https://example.com/image3.jpg",
    title: "Cách kiếm tiền từ lập trình AI",
    desc: "Tổng hợp các cách kiếm tiền hiệu quả từ việc lập trình AI mà bạn có thể áp dụng ngay.",
    comments: 20,
    date: "17/03/2023",
    time: "5 phút",
  },
  {
    img: "https://example.com/image4.jpg",
    title: "Những xu hướng công nghệ nổi bật năm 2024",
    desc: "Cùng điểm qua những công nghệ sẽ thay đổi thế giới trong năm nay.",
    comments: 8,
    date: "18/03/2023",
    time: "4 phút",
  },
  {
    img: "https://example.com/image5.jpg",
    title: "Lập trình viên nên học gì trong năm 2024?",
    desc: "Hướng dẫn những kỹ năng cần thiết giúp lập trình viên phát triển sự nghiệp trong năm nay.",
    comments: 30,
    date: "19/03/2023",
    time: "6 phút",
  },
  {
    img: "https://images2.thanhnien.vn/528068263637045248/2024/12/4/3-17332802768611370004247.jpg",
    title: "Kiếm chục nghìn USD từ game 'tạo bằng vài câu lệnh AI'",
    desc: "Fly Pieter, game 'được tạo đơn giản bằng vài câu lệnh AI', hiện giúp chủ nhân kiếm hơn 50.000 USD mỗi tháng.",
    comments: 15,
    date: "15/03/2023",
    time: "2 phút hơn",
  },
  {
    img: "https://example.com/image2.jpg",
    title: "Công nghệ AI có thể thay thế lập trình viên?",
    desc: "Các chuyên gia đang tranh cãi về việc AI có thể thay thế hoàn toàn công việc lập trình viên hay không.",
    comments: 12,
    date: "16/03/2023",
    time: "3 phút",
  },
  {
    img: "https://example.com/image3.jpg",
    title: "Cách kiếm tiền từ lập trình AI",
    desc: "Tổng hợp các cách kiếm tiền hiệu quả từ việc lập trình AI mà bạn có thể áp dụng ngay.",
    comments: 20,
    date: "17/03/2023",
    time: "5 phút",
  },
  {
    img: "https://example.com/image4.jpg",
    title: "Những xu hướng công nghệ nổi bật năm 2024",
    desc: "Cùng điểm qua những công nghệ sẽ thay đổi thế giới trong năm nay.",
    comments: 8,
    date: "18/03/2023",
    time: "4 phút",
  },
  {
    img: "https://example.com/image5.jpg",
    title: "Lập trình viên nên học gì trong năm 2024?",
    desc: "Hướng dẫn những kỹ năng cần thiết giúp lập trình viên phát triển sự nghiệp trong năm nay.",
    comments: 30,
    date: "19/03/2023",
    time: "6 phút",
  },
  {
    img: "https://example.com/image5.jpg",
    title: "Lập trình viên nên học gì trong năm 2024?",
    desc: "Hướng dẫn những kỹ năng cần thiết giúp lập trình viên phát triển sự nghiệp trong năm nay.",
    comments: 30,
    date: "19/03/2023",
    time: "6 phút",
  },
  {
    img: "https://images2.thanhnien.vn/528068263637045248/2024/12/4/3-17332802768611370004247.jpg",
    title: "Kiếm chục nghìn USD từ game 'tạo bằng vài câu lệnh AI'",
    desc: "Fly Pieter, game 'được tạo đơn giản bằng vài câu lệnh AI', hiện giúp chủ nhân kiếm hơn 50.000 USD mỗi tháng.",
    comments: 15,
    date: "15/03/2023",
    time: "2 phút hơn",
  },
  {
    img: "https://example.com/image2.jpg",
    title: "Công nghệ AI có thể thay thế lập trình viên?",
    desc: "Các chuyên gia đang tranh cãi về việc AI có thể thay thế hoàn toàn công việc lập trình viên hay không.",
    comments: 12,
    date: "16/03/2023",
    time: "3 phút",
  },
  {
    img: "https://example.com/image3.jpg",
    title: "Cách kiếm tiền từ lập trình AI",
    desc: "Tổng hợp các cách kiếm tiền hiệu quả từ việc lập trình AI mà bạn có thể áp dụng ngay.",
    comments: 20,
    date: "17/03/2023",
    time: "5 phút",
  },
  {
    img: "https://example.com/image4.jpg",
    title: "Những xu hướng công nghệ nổi bật năm 2024",
    desc: "Cùng điểm qua những công nghệ sẽ thay đổi thế giới trong năm nay.",
    comments: 8,
    date: "18/03/2023",
    time: "4 phút",
  },
  {
    img: "https://example.com/image5.jpg",
    title: "Lập trình viên nên học gì trong năm 2024?",
    desc: "Hướng dẫn những kỹ năng cần thiết giúp lập trình viên phát triển sự nghiệp trong năm nay.",
    comments: 30,
    date: "19/03/2023",
    time: "6 phút",
  },
  {
    img: "https://example.com/image5.jpg",
    title: "Lập trình viên nên học gì trong năm 2024?",
    desc: "Hướng dẫn những kỹ năng cần thiết giúp lập trình viên phát triển sự nghiệp trong năm nay.",
    comments: 30,
    date: "19/03/2023",
    time: "6 phút",
  },
  {
    img: "https://images2.thanhnien.vn/528068263637045248/2024/12/4/3-17332802768611370004247.jpg",
    title: "Kiếm chục nghìn USD từ game 'tạo bằng vài câu lệnh AI'",
    desc: "Fly Pieter, game 'được tạo đơn giản bằng vài câu lệnh AI', hiện giúp chủ nhân kiếm hơn 50.000 USD mỗi tháng.",
    comments: 15,
    date: "15/03/2023",
    time: "2 phút hơn",
  },
  {
    img: "https://example.com/image2.jpg",
    title: "Công nghệ AI có thể thay thế lập trình viên?",
    desc: "Các chuyên gia đang tranh cãi về việc AI có thể thay thế hoàn toàn công việc lập trình viên hay không.",
    comments: 12,
    date: "16/03/2023",
    time: "3 phút",
  },
  {
    img: "https://example.com/image3.jpg",
    title: "Cách kiếm tiền từ lập trình AI",
    desc: "Tổng hợp các cách kiếm tiền hiệu quả từ việc lập trình AI mà bạn có thể áp dụng ngay.",
    comments: 20,
    date: "17/03/2023",
    time: "5 phút",
  },
  {
    img: "https://example.com/image4.jpg",
    title: "Những xu hướng công nghệ nổi bật năm 2024",
    desc: "Cùng điểm qua những công nghệ sẽ thay đổi thế giới trong năm nay.",
    comments: 8,
    date: "18/03/2023",
    time: "4 phút",
  },
  {
    img: "https://example.com/image5.jpg",
    title: "Lập trình viên nên học gì trong năm 2024?",
    desc: "Hướng dẫn những kỹ năng cần thiết giúp lập trình viên phát triển sự nghiệp trong năm nay.",
    comments: 30,
    date: "19/03/2023",
    time: "6 phút",
  },
  {
    img: "https://example.com/image5.jpg",
    title: "Lập trình viên nên học gì trong năm 2024?",
    desc: "Hướng dẫn những kỹ năng cần thiết giúp lập trình viên phát triển sự nghiệp trong năm nay.",
    comments: 30,
    date: "19/03/2023",
    time: "6 phút",
  },
  {
    img: "https://images2.thanhnien.vn/528068263637045248/2024/12/4/3-17332802768611370004247.jpg",
    title: "Kiếm chục nghìn USD từ game 'tạo bằng vài câu lệnh AI'",
    desc: "Fly Pieter, game 'được tạo đơn giản bằng vài câu lệnh AI', hiện giúp chủ nhân kiếm hơn 50.000 USD mỗi tháng.",
    comments: 15,
    date: "15/03/2023",
    time: "2 phút hơn",
  },
  {
    img: "https://example.com/image2.jpg",
    title: "Công nghệ AI có thể thay thế lập trình viên?",
    desc: "Các chuyên gia đang tranh cãi về việc AI có thể thay thế hoàn toàn công việc lập trình viên hay không.",
    comments: 12,
    date: "16/03/2023",
    time: "3 phút",
  },
  {
    img: "https://example.com/image3.jpg",
    title: "Cách kiếm tiền từ lập trình AI",
    desc: "Tổng hợp các cách kiếm tiền hiệu quả từ việc lập trình AI mà bạn có thể áp dụng ngay.",
    comments: 20,
    date: "17/03/2023",
    time: "5 phút",
  },
  {
    img: "https://example.com/image4.jpg",
    title: "Những xu hướng công nghệ nổi bật năm 2024",
    desc: "Cùng điểm qua những công nghệ sẽ thay đổi thế giới trong năm nay.",
    comments: 8,
    date: "18/03/2023",
    time: "4 phút",
  },
  {
    img: "https://example.com/image5.jpg",
    title: "Lập trình viên nên học gì trong năm 2024?",
    desc: "Hướng dẫn những kỹ năng cần thiết giúp lập trình viên phát triển sự nghiệp trong năm nay.",
    comments: 30,
    date: "19/03/2023",
    time: "6 phút",
  },
  {
    img: "https://example.com/image5.jpg",
    title: "Lập trình viên nên học gì trong năm 2024?",
    desc: "Hướng dẫn những kỹ năng cần thiết giúp lập trình viên phát triển sự nghiệp trong năm nay.",
    comments: 30,
    date: "19/03/2023",
    time: "6 phút",
  },
  {
    img: "https://images2.thanhnien.vn/528068263637045248/2024/12/4/3-17332802768611370004247.jpg",
    title: "Kiếm chục nghìn USD từ game 'tạo bằng vài câu lệnh AI'",
    desc: "Fly Pieter, game 'được tạo đơn giản bằng vài câu lệnh AI', hiện giúp chủ nhân kiếm hơn 50.000 USD mỗi tháng.",
    comments: 15,
    date: "15/03/2023",
    time: "2 phút hơn",
  },
  {
    img: "https://example.com/image2.jpg",
    title: "Công nghệ AI có thể thay thế lập trình viên?",
    desc: "Các chuyên gia đang tranh cãi về việc AI có thể thay thế hoàn toàn công việc lập trình viên hay không.",
    comments: 12,
    date: "16/03/2023",
    time: "3 phút",
  },
  {
    img: "https://example.com/image3.jpg",
    title: "Cách kiếm tiền từ lập trình AI",
    desc: "Tổng hợp các cách kiếm tiền hiệu quả từ việc lập trình AI mà bạn có thể áp dụng ngay.",
    comments: 20,
    date: "17/03/2023",
    time: "5 phút",
  },
  {
    img: "https://example.com/image4.jpg",
    title: "Những xu hướng công nghệ nổi bật năm 2024",
    desc: "Cùng điểm qua những công nghệ sẽ thay đổi thế giới trong năm nay.",
    comments: 8,
    date: "18/03/2023",
    time: "4 phút",
  },
  {
    img: "https://example.com/image5.jpg",
    title: "Lập trình viên nên học gì trong năm 2024?",
    desc: "Hướng dẫn những kỹ năng cần thiết giúp lập trình viên phát triển sự nghiệp trong năm nay.",
    comments: 30,
    date: "19/03/2023",
    time: "6 phút",
  },
  {
    img: "https://example.com/image5.jpg",
    title: "Lập trình viên nên học gì trong năm 2024?",
    desc: "Hướng dẫn những kỹ năng cần thiết giúp lập trình viên phát triển sự nghiệp trong năm nay.",
    comments: 30,
    date: "19/03/2023",
    time: "6 phút",
  },
  {
    img: "https://images2.thanhnien.vn/528068263637045248/2024/12/4/3-17332802768611370004247.jpg",
    title: "Kiếm chục nghìn USD từ game 'tạo bằng vài câu lệnh AI'",
    desc: "Fly Pieter, game 'được tạo đơn giản bằng vài câu lệnh AI', hiện giúp chủ nhân kiếm hơn 50.000 USD mỗi tháng.",
    comments: 15,
    date: "15/03/2023",
    time: "2 phút hơn",
  },
  {
    img: "https://example.com/image2.jpg",
    title: "Công nghệ AI có thể thay thế lập trình viên?",
    desc: "Các chuyên gia đang tranh cãi về việc AI có thể thay thế hoàn toàn công việc lập trình viên hay không.",
    comments: 12,
    date: "16/03/2023",
    time: "3 phút",
  },
  {
    img: "https://example.com/image3.jpg",
    title: "Cách kiếm tiền từ lập trình AI",
    desc: "Tổng hợp các cách kiếm tiền hiệu quả từ việc lập trình AI mà bạn có thể áp dụng ngay.",
    comments: 20,
    date: "17/03/2023",
    time: "5 phút",
  },
  {
    img: "https://example.com/image4.jpg",
    title: "Những xu hướng công nghệ nổi bật năm 2024",
    desc: "Cùng điểm qua những công nghệ sẽ thay đổi thế giới trong năm nay.",
    comments: 8,
    date: "18/03/2023",
    time: "4 phút",
  },
  {
    img: "https://example.com/image5.jpg",
    title: "Lập trình viên nên học gì trong năm 2024?",
    desc: "Hướng dẫn những kỹ năng cần thiết giúp lập trình viên phát triển sự nghiệp trong năm nay.",
    comments: 30,
    date: "19/03/2023",
    time: "6 phút",
  },
  {
    img: "https://example.com/image5.jpg",
    title: "Lập trình viên nên học gì trong năm 2024?",
    desc: "Hướng dẫn những kỹ năng cần thiết giúp lập trình viên phát triển sự nghiệp trong năm nay.",
    comments: 30,
    date: "19/03/2023",
    time: "6 phút",
  },
  {
    img: "https://images2.thanhnien.vn/528068263637045248/2024/12/4/3-17332802768611370004247.jpg",
    title: "Kiếm chục nghìn USD từ game 'tạo bằng vài câu lệnh AI'",
    desc: "Fly Pieter, game 'được tạo đơn giản bằng vài câu lệnh AI', hiện giúp chủ nhân kiếm hơn 50.000 USD mỗi tháng.",
    comments: 15,
    date: "15/03/2023",
    time: "2 phút hơn",
  },
  {
    img: "https://example.com/image2.jpg",
    title: "Công nghệ AI có thể thay thế lập trình viên?",
    desc: "Các chuyên gia đang tranh cãi về việc AI có thể thay thế hoàn toàn công việc lập trình viên hay không.",
    comments: 12,
    date: "16/03/2023",
    time: "3 phút",
  },
  {
    img: "https://example.com/image3.jpg",
    title: "Cách kiếm tiền từ lập trình AI",
    desc: "Tổng hợp các cách kiếm tiền hiệu quả từ việc lập trình AI mà bạn có thể áp dụng ngay.",
    comments: 20,
    date: "17/03/2023",
    time: "5 phút",
  },
  {
    img: "https://example.com/image4.jpg",
    title: "Những xu hướng công nghệ nổi bật năm 2024",
    desc: "Cùng điểm qua những công nghệ sẽ thay đổi thế giới trong năm nay.",
    comments: 8,
    date: "18/03/2023",
    time: "4 phút",
  },
  {
    img: "https://example.com/image5.jpg",
    title: "Lập trình viên nên học gì trong năm 2024?",
    desc: "Hướng dẫn những kỹ năng cần thiết giúp lập trình viên phát triển sự nghiệp trong năm nay.",
    comments: 30,
    date: "19/03/2023",
    time: "6 phút",
  },
  {
    img: "https://example.com/image5.jpg",
    title: "Lập trình viên nên học gì trong năm 2024?",
    desc: "Hướng dẫn những kỹ năng cần thiết giúp lập trình viên phát triển sự nghiệp trong năm nay.",
    comments: 30,
    date: "19/03/2023",
    time: "6 phút",
  },
  {
    img: "https://images2.thanhnien.vn/528068263637045248/2024/12/4/3-17332802768611370004247.jpg",
    title: "Kiếm chục nghìn USD từ game 'tạo bằng vài câu lệnh AI'",
    desc: "Fly Pieter, game 'được tạo đơn giản bằng vài câu lệnh AI', hiện giúp chủ nhân kiếm hơn 50.000 USD mỗi tháng.",
    comments: 15,
    date: "15/03/2023",
    time: "2 phút hơn",
  },
  {
    img: "https://example.com/image2.jpg",
    title: "Công nghệ AI có thể thay thế lập trình viên?",
    desc: "Các chuyên gia đang tranh cãi về việc AI có thể thay thế hoàn toàn công việc lập trình viên hay không.",
    comments: 12,
    date: "16/03/2023",
    time: "3 phút",
  },
  {
    img: "https://example.com/image3.jpg",
    title: "Cách kiếm tiền từ lập trình AI",
    desc: "Tổng hợp các cách kiếm tiền hiệu quả từ việc lập trình AI mà bạn có thể áp dụng ngay.",
    comments: 20,
    date: "17/03/2023",
    time: "5 phút",
  },
  {
    img: "https://example.com/image4.jpg",
    title: "Những xu hướng công nghệ nổi bật năm 2024",
    desc: "Cùng điểm qua những công nghệ sẽ thay đổi thế giới trong năm nay.",
    comments: 8,
    date: "18/03/2023",
    time: "4 phút",
  },
  {
    img: "https://example.com/image5.jpg",
    title: "Lập trình viên nên học gì trong năm 2024?",
    desc: "Hướng dẫn những kỹ năng cần thiết giúp lập trình viên phát triển sự nghiệp trong năm nay.",
    comments: 30,
    date: "19/03/2023",
    time: "6 phút",
  },
  {
    img: "https://example.com/image5.jpg",
    title: "Lập trình viên nên học gì trong năm 2024?",
    desc: "Hướng dẫn những kỹ năng cần thiết giúp lập trình viên phát triển sự nghiệp trong năm nay.",
    comments: 30,
    date: "19/03/2023",
    time: "6 phút",
  },
];

let currentPage = 1;
const articlesPerPage = 10;
const totalPages = Math.ceil(articles.length / articlesPerPage);

function displayArticles() {
  const list = document.getElementById("articles-list");
  const trend = document.getElementById("articles-trend");

  list.innerHTML = "";

  // Ẩn/hiện articles-trend
  trend.style.display = currentPage === 1 ? "flex" : "none";

  // Hiển thị bài viết cho trang hiện tại
  const start = (currentPage - 1) * articlesPerPage;
  const end = start + articlesPerPage;
  articles.slice(start, end).forEach((article) => {
    const articleItem = document.createElement("li");
    articleItem.classList.add("one-article");
    articleItem.innerHTML = `
      <a href="#" class="article-image">
        <img src="${article.img}" alt="">
      </a>
      <a href="#" class="article-title">
        <h3>${article.title}</h3>
        <div class="article-desc">
          <p>${article.desc}</p>
        </div>
        <div class="ar-cmt2">
          <div class="ar-time">
            <span class="ar-item">
              <span>${article.date}</span>
            </span>
            <span class="ar-item">
              <span>${article.time}</span>
            </span>
          </div>
        </div>
      </a>
    `;
    list.appendChild(articleItem);
  });

  updatePagination();
}

function updatePagination() {
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = "";

  if (totalPages <= 1) return;

  // Nút Previous
  const prevBtn = document.createElement("button");
  prevBtn.className = "prev-btn";
  prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
  prevBtn.disabled = currentPage === 1;
  prevBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (currentPage > 1) changePage(e, currentPage - 1);
  });
  if (currentPage > 1) {
    pagination.appendChild(prevBtn);
  }
  // Các nút trang
  const maxVisiblePages = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  // Đảm bảo luôn hiển thị đủ maxVisiblePages nút nếu có thể
  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    const pageBtn = document.createElement("button");
    pageBtn.className = `page-btn ${i === currentPage ? "active" : ""}`;
    pageBtn.textContent = i;
    pageBtn.addEventListener("click", (e) => {
      e.preventDefault();
      changePage(e, i);
    });
    pagination.appendChild(pageBtn);
  }

  // Nút Next
  const nextBtn = document.createElement("button");
  nextBtn.className = "next-btn";
  nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
  nextBtn.disabled = currentPage === totalPages;
  nextBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (currentPage < totalPages) changePage(e, currentPage + 1);
  });
  if (currentPage < totalPages) {
    pagination.appendChild(nextBtn);
  }
}

function changePage(event, page) {
  event.preventDefault();
  if (page >= 1 && page <= totalPages) {
    currentPage = page;
    displayArticles();
    window.scrollTo(0, 0);
  }
}

document.addEventListener("DOMContentLoaded", displayArticles);

// Đảm bảo đồng bộ hoàn toàn khi cuộn
scrollDiv.addEventListener("scroll", function () {
  updateScrollThumb();
  window.requestAnimationFrame(updateScrollThumb); // Đảm bảo mượt mà
});

// Thêm xử lý cuộn khi click vào track
// document.querySelector('.fake-scrollbar-track').addEventListener('click', function(e) {
//   if (e.target !== fakeScrollbarThumb) {
//     const trackRect = this.getBoundingClientRect();
//     const clickPositionPercentage = (e.clientY - trackRect.top) / trackRect.height;
//     scrollDiv.scrollTop = clickPositionPercentage * (scrollDiv.scrollHeight - scrollDiv.clientHeight);
//   }
// });

// Bạn có thể thích
document.addEventListener("DOMContentLoaded", function () {
  new Swiper(".news-slider", {
    slidesPerView: 4, // Giảm số lượng ô hiển thị để tạo khoảng cách tốt hơn
    spaceBetween: 20, // Thêm khoảng cách giữa các ô
    loop: true, // Thêm tính năng loop
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    breakpoints: {
      // Thêm responsive breakpoints
      320: {
        slidesPerView: 1,
        spaceBetween: 10,
      },
      640: {
        slidesPerView: 2,
        spaceBetween: 15,
      },
      768: {
        slidesPerView: 3,
        spaceBetween: 15,
      },
      1024: {
        slidesPerView: 4,
        spaceBetween: 20,
      },
    },
  });
});
