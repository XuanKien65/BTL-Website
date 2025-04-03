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
];

let currentPage = 1;
const articlesPerPage = 10; // Hiển thị 10 bài mỗi trang
const maxVisiblePages = 4; // Số nút hiển thị trên thanh phân trang
const totalPages = Math.ceil(articles.length / articlesPerPage);

function displayArticles() {
  const list = document.getElementById("articles-list");
  const trend = document.getElementById("articles-trend");

  list.innerHTML = "";

  // Ẩn articles-trend khi sang trang 2 trở đi
  if (currentPage === 1) {
    trend.style.display = "flex"; // Hiện lên khi ở trang 1
  } else {
    trend.style.display = "none"; // Ẩn đi khi ở trang >= 2
  }

  let start = (currentPage - 1) * articlesPerPage;
  let end = start + articlesPerPage;
  let paginatedArticles = articles.slice(start, end);

  paginatedArticles.forEach((article) => {
    let articleItem = document.createElement("li");
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
                <div class="ar-cmt">
                    <span class="material-icons">comment</span>
                    <p>${article.comments} comments</p>
                </div>
                <div class="ar-cmt2">
                    <div class="ar-time">
                        <span class="ar-item">
                            <span class="material-icons"> calendar_month</span>
                            <p>${article.date}</p>
                        </span>
                        <span class="ar-item">
                            <span class="material-icons"> schedule</span>
                            <p>${article.time}</p>
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

  let totalButtons = maxVisiblePages;
  let startPage, endPage;

  if (currentPage === 1) {
    startPage = 1;
    endPage = Math.min(totalPages, totalButtons);
  } else if (currentPage === totalPages) {
    endPage = totalPages;
    startPage = Math.max(1, totalPages - totalButtons + 1);
  } else {
    startPage = Math.max(1, currentPage - Math.floor((totalButtons - 2) / 2));
    endPage = Math.min(totalPages, startPage + totalButtons - 2);
  }

  if (currentPage > 1) {
    let prevBtn = document.createElement("a");
    prevBtn.classList.add("page");
    prevBtn.innerHTML = `<span class="material-icons">chevron_left</span>`;
    prevBtn.onclick = (event) => changePage(event, currentPage - 1);
    pagination.appendChild(prevBtn);
  }

  for (let i = startPage; i <= endPage; i++) {
    let pageBtn = document.createElement("a");
    pageBtn.innerText = i;
    pageBtn.classList.add("page");
    if (i === currentPage) {
      pageBtn.classList.add("active");
    }
    pageBtn.onclick = (event) => changePage(event, i);
    pagination.appendChild(pageBtn);
  }

  if (currentPage < totalPages) {
    let nextBtn = document.createElement("a");
    nextBtn.classList.add("page");
    nextBtn.innerHTML = `<span class="material-icons">chevron_right</span>`;
    nextBtn.onclick = (event) => changePage(event, currentPage + 1);
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
