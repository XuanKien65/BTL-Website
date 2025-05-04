const badWords = [
  "cl",
  "dm",
  "địt",
  "lồn",
  "vcl",
  "cặc",
  "dmm",
  "fuck",
  "shit",
  "bê đê",
  "ngu vl",
  "clm",
  "da đen",
  "nigga",
];

async function isToxicContent(text) {
  const regex = new RegExp(`(${badWords.join("|")})`, "i"); // bỏ \\b
  const matched = regex.test(text);
  console.log("🧪 Kiểm duyệt:", text, "→", matched);
  return matched;
}

module.exports = { isToxicContent };
