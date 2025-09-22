export default function placeholderAvatar(name) {
  // Xóa khoảng trắng giữa và chuyển thành chữ thường
  name = name.trim().replace(/\s+/g, "").toLowerCase();
  const baseUrl = "https://avatar.iran.liara.run/username?username=";
  return `${baseUrl}${name}`;
}
