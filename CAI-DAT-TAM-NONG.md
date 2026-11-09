# Tam Nông Ăn Gì? – cài đặt bản sao (từ web Lâm Thao Ăn Gì?)

Bản này giữ nguyên 100% chức năng của Lâm Thao Ăn Gì? (gồm chế độ bảo trì) và dùng GIAO DIỆN của web Tam Nông cũ (header vàng, danh mục, "Hôm nay ăn gì?", "Quán hot", nút quay "Ăn gì?", thanh dưới 4 mục Trang chủ / Hoạt động / Hộp thư / Tài khoản; mục "Quán yêu thích" nằm trong Tài khoản), đã trỏ sẵn tới Firebase project `tamnongfood-2e8a8`.

## Làm theo thứ tự
1. **Firestore Rules**: Firebase Console → Firestore → Rules → dán toàn bộ `firestore.rules` → Publish. (Rules cũ của web Tam Nông sẽ bị thay; dữ liệu đơn/quán cũ kiểu cũ không dùng được nữa.)
2. **Authentication → Sign-in method → Email/Password**: đã bật từ trước thì giữ nguyên. **Settings → Authorized domains**: thêm tên miền mới (github.io hoặc tamnongangi.com).
3. **Đưa toàn bộ thư mục này lên GitHub** (thay nội dung repo tamnongfood cũ).
4. **Tạo admin**: mở web → Đăng ký bằng SĐT của bạn → Firestore → `users` → sửa `role` thành `admin` (xem HUONG-DAN.md). Tài khoản email cũ của web Tam Nông không đăng nhập được bằng SĐT, nên cần đăng ký mới.
5. **Apps Script (ảnh + báo đơn + Zalo)**: tạo Apps Script MỚI, dán `google-apps-script.gs` và `appsscript.json`; sửa `ADMIN_EMAIL`; (để trống `FOLDER_ID` thì tự tạo thư mục `TamNongAnGi-Images`); tài khoản chạy script phải là chủ/Editor của Firebase project; Deploy → Web app → dán URL `/exec` vào `upload-config.js`. Zalo: nhập `ZALO_BOT_TOKEN`, `ZALO_ADMIN_IDS` ở Script properties. Chi tiết trong HUONG-DAN.md.
6. **Thông báo đẩy (tuỳ chọn)**: lấy VAPID key ở Firebase → Cloud Messaging, dán vào `push-config.js`.
7. **Bản đồ Goong (tuỳ chọn)**: dán 2 khóa vào `goong-config.js`; để trống thì dùng OpenStreetMap.

## Những chỗ cần bạn sửa (mình để tạm)
| Việc | File |
|---|---|
| Tên miền `tamnongangi.com` (đang là tên giả định) | `index.html`, `sitemap.xml`, `robots.txt`, `shoplink.js`, `google-apps-script.gs`; tạo file `CNAME` nếu dùng tên miền riêng |
| SĐT/Zalo `0000000000` | `index.html` (nút Zalo), `app.js` (mục Quên mật khẩu); hoặc nhập ở Admin → Liên hệ |
| Danh sách xã/khu vực giao hàng (đang chỉ có 2 mục) | `app.js`, dòng `const AREAS = [...]` |
| `ADMIN_EMAIL` | `google-apps-script.gs` |
| Logo/ảnh chia sẻ có chữ "Lâm Thao Ăn Gì?": `icon-192.png`, `icon-512.png`, `favicon.png`, `og-image.jpg`, `avatar.jpg`, `banner-food.jpg` | thay bằng ảnh Tam Nông |
| Quán/menu mẫu trong code (Phở Bò Tam Nông…) chỉ hiện khi chưa kết nối Firebase | `app.js` |
