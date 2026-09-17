# 🌐 Trang Web Cá Nhân - Personal Website

Trang web tĩnh (static site) cá nhân với:
- 📅 **Lịch trình & Dữ liệu cá nhân** - Quản lý sự kiện, lưu localStorage
- 🛠 **Tools & Downloads** - Link cài Windows, App điện thoại, Linux, công cụ hữu ích

## 📁 Cấu trúc thư mục

```
personal-website/
├── index.html              # Trang chủ
├── css/
│   ├── style.css           # CSS chung
│   ├── schedule.css        # CSS trang lịch trình
│   └── tools.css           # CSS trang tools
├── js/
│   ├── main.js             # JS chung (nav, utilities)
│   ├── schedule.js         # JS trang lịch trình
│   └── tools.js            # JS trang tools
├── pages/
│   ├── schedule.html       # Trang lịch trình
│   └── tools.html          # Trang tools & downloads
└── assets/
    └── images/             # Ảnh (nếu có)
```

## 🚀 Deploy miễn phí (3 cách đơn giản)

### Cách 1: GitHub Pages (Khuyên dùng)
1. Tạo repo mới trên GitHub: `your-username.github.io` hoặc tên bất kỳ
2. Upload toàn bộ thư mục `personal-website` lên repo
3. Vào **Settings > Pages**
4. Source: **Deploy from a branch** → Branch: `main` → Folder: `/ (root)`
5. Lưu lại → Chờ 1-2 phút
6. Truy cập: `https://your-username.github.io` hoặc `https://your-username.github.io/repo-name`

### Cách 2: Netlify (Kéo thả)
1. Vào [netlify.com](https://netlify.com) → Đăng ký/Đăng nhập
2. Kéo thả thư mục `personal-website` vào khu vực "Drag and drop"
3. Xong! Netlify cho bạn link `.netlify.app` miễn phí
4. Có thể đổi tên subdomain trong Site settings

### Cách 3: Vercel
1. Vào [vercel.com](https://vercel.com) → Đăng ký/Đăng nhập
2. Import Project → Chọn repo GitHub hoặc upload folder
3. Framework Preset: **Other** → Deploy
4. Xong! Link `.vercel.app` miễn phí

## 💾 Lưu trữ dữ liệu

- **localStorage**: Dữ liệu lịch trình & tools lưu trên trình duyệt của từng người
- **Không cần database/server** - Chạy hoàn toàn client-side
- **Backup/Restore**: Xuất/nhập file JSON từ giao diện web

## ✏️ Tùy chỉnh

### Thay đổi thông tin cá nhân
- Sửa `index.html`: Tên, mô tả, nội dung hero
- Sửa `pages/schedule.html`: Tiêu đề trang lịch trình
- Sửa `pages/tools.html`: Tiêu đề trang tools

### Thêm tools mặc định
Sửa mảng `defaultTools` trong `js/tools.js`

### Thay màu sắc
Sửa biến màu trong `css/style.css`:
```css
/* Màu chính: #3498db (xanh dương) */
/* Gradient hero: #667eea → #764ba2 */
```

## 📱 Tính năng

| Tính năng | Trạng thái |
|-----------|------------|
| Responsive (mobile/desktop) | ✅ |
| Dark mode | ❌ (có thể thêm sau) |
| PWA (cài như app) | ❌ (có thể thêm sau) |
| Đa ngôn ngữ | ❌ |
| Search | ❌ |

## 🔧 Chạy local (test trước khi deploy)

### Cách 1: VS Code Live Server
1. Cài extension "Live Server"
2. Click chuột phải `index.html` → "Open with Live Server"

### Cách 2: Python
```bash
cd personal-website
python -m http.server 8000
# Mở http://localhost:8000
```

### Cách 3: Node.js (npx serve)
```bash
cd personal-website
npx serve .
```

## 📝 License

MIT License - Tự do sử dụng, sửa đổi, chia sẻ.

---

**Lưu ý**: Đây là static site, không có backend. Dữ liệu chỉ lưu trên trình duyệt của từng người (localStorage). Muốn đồng bộ giữa thiết bị cần backend/database (Firebase, Supabase, PocketBase...).