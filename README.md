# Tam Nông Food

App đặt món gồm 4 trang: `index.html` (khách), `shop.html` (quán), `shipper.html` (tài xế), `admin.html` (admin).
Dữ liệu thật chạy trên **Firebase** (miễn phí gói Spark), không cần server hay App Script.

## Cài đặt Firebase (làm 1 lần, ~10 phút)

1. Vào https://console.firebase.google.com → **Add project** → đặt tên → tạo.
2. **Build → Authentication → Get started → Sign-in method → Email/Password → Enable**.
3. **Build → Firestore Database → Create database** → chọn khu vực `asia-southeast1` (Singapore) → *Production mode*.
4. Tab **Rules** của Firestore: xóa nội dung cũ, dán toàn bộ file `firestore.rules` → **Publish**.
5. **Project settings (⚙) → Your apps → Web (`</>`)** → đăng ký app → copy 4 giá trị `apiKey`, `authDomain`, `projectId`, `appId` dán vào `firebase-config.js`.
6. **Authentication → Settings → Authorized domains**: thêm tên miền bạn dùng để đăng nhập (vd `tamnongfood.vercel.app`, `ten.github.io`). `localhost` có sẵn.
7. Mở web bằng một địa chỉ http(s) (GitHub Pages, Vercel, Netlify, hoặc chạy local `python3 -m http.server`). Mở thẳng file bằng `file://` sẽ không chạy được vì dùng ES module.

## Tạo tài khoản admin đầu tiên

Admin không tự đăng ký được (để không ai chiếm quyền). Tạo thủ công 1 lần:

1. **Authentication → Users → Add user**: nhập email + mật khẩu admin. Copy cột **User UID**.
2. **Firestore → Start collection** `users` → Document ID = **UID vừa copy**, thêm các field:
   - `role` (string) = `admin`
   - `approved` (boolean) = `true`
   - `name` (string) = tên bạn, `email` (string) = email admin
3. Vào `admin.html` đăng nhập.

## Tải ảnh lên Google Drive (logo quán, ảnh món)

Ảnh được thu nhỏ rồi gửi qua một Google Apps Script của bạn, script lưu vào thư mục `TamNongFood-Images` trong Drive và trả link ảnh. Chỉ admin/chủ quán đã đăng nhập mới tải được.

1. Vào https://script.google.com → **Dự án mới** → xóa code mẫu, dán toàn bộ file `apps-script/Code.gs`.
2. Sửa 2 dòng đầu: `PROJECT_ID` (vd `tamnongfood-2e8a8`) và `API_KEY` (apiKey trong `firebase-config.js`).
3. Chọn hàm `authorize` ở thanh trên → **Chạy** → cấp quyền cho Drive và truy cập mạng (chọn tài khoản Google → Nâng cao → Đi tới ... → Cho phép).
4. **Triển khai → Tùy chọn triển khai mới → loại Ứng dụng web**: *Thực thi với tư cách: Tôi*, *Người có quyền truy cập: Bất kỳ ai* → Triển khai → copy **URL ứng dụng web** (kết thúc bằng `/exec`).
5. Mở `drive.js`, dán URL vào `UPLOAD_URL`, đưa file lên GitHub.
6. Mỗi lần sửa `Code.gs` phải **Triển khai → Quản lý triển khai → Sửa → Phiên bản mới** thì mới có hiệu lực.

## Cấp quán cho nhà bán hàng

Cách 1 (nhanh nhất): `admin.html` → tab **Tài khoản** → form "Tạo tài khoản nhà bán hàng": nhập họ tên, SĐT, email, mật khẩu, chọn quán → tài khoản dùng được ngay. Gửi email + mật khẩu cho chủ quán.

Cách 2: chủ quán tự đăng ký ở `shop.html`; admin vào tab **Quán**, bấm **Sửa** quán, chọn tài khoản ở mục "Cấp quán cho nhà bán hàng" → Lưu (tài khoản được duyệt luôn). Hoặc vào tab Tài khoản chọn quán và bấm Duyệt.

Admin cũng sửa được món của bất kỳ quán nào: tab **Quán** → nút **Thực đơn**.

## Cách dùng

| Vai trò | Trang | Làm gì |
|---|---|---|
| Khách | `index.html` | Đăng ký / đăng nhập / đăng xuất bằng email, đặt món, xem đơn của chính mình theo thời gian thực |
| Admin | `admin.html` | **Thêm quán, sửa quán** (tên, ảnh, địa chỉ, SĐT, giờ mở cửa, quán hot), mở/đóng, xóa quán; duyệt tài khoản quán/tài xế và gán quán cho chủ quán; xem đơn và thống kê. Nút "Nạp quán mẫu" tạo nhanh 5 quán để thử |
| Chủ quán | `shop.html` | Đăng ký → chờ admin duyệt + gán quán → **thêm / sửa / xóa món**, đánh dấu hết món, mở/đóng cửa, nhận và xử lý đơn |
| Tài xế | `shipper.html` | Đăng ký → chờ admin duyệt → nhận đơn, giao, xem công |

Luồng một chủ quán mới: vào `shop.html` → *Đăng ký tài khoản mới* → admin vào tab **Tài khoản**, chọn quán, bấm **Duyệt** → chủ quán đăng nhập.

## Ghi chú

- Ảnh quán/món dùng **link ảnh** (dán URL). Firebase Storage hiện yêu cầu gói trả phí nên chưa dùng.
- `firestore.rules` đã phân quyền: khách chỉ đọc đơn của mình, chủ quán chỉ sửa `menu`/`open` của quán mình, tài xế chỉ nhận đơn đang chờ, không ai tự nâng quyền được.
- Khi chưa điền `firebase-config.js`, trang khách chạy chế độ demo (dữ liệu mẫu, không đăng nhập được).
