# Kiểm tra trước khi mở bán – Tam Nông Ăn Gì?

Đánh dấu [x] khi xong. Mục **BẮT BUỘC** chưa xong thì web chạy nhưng thiếu tính năng cốt lõi.

## A. Thông tin thật (BẮT BUỘC)
- [ ] **Tên miền**: hiện đang dùng tên giả định `tamnongangi.com` trong `index.html`, `sitemap.xml`, `robots.txt`, `shoplink.js`, `app.js`, `google-apps-script.gs`. Thay bằng tên miền thật (tìm/thay toàn bộ). Nếu dùng tên miền riêng, tạo file `CNAME` (một dòng: tên miền) ở thư mục gốc; nếu chỉ dùng `*.github.io` thì bỏ qua và sửa các chỗ trên thành địa chỉ github.io.
- [ ] **Liên hệ**: đăng nhập Admin → **Liên hệ**, nhập hotline, Zalo, email. Nút Zalo nổi và mục "Quên mật khẩu" chỉ hiện khi đã có Zalo.
- [ ] **ADMIN_EMAIL** trong `google-apps-script.gs` (đang là `DAN-EMAIL-ADMIN@gmail.com`): không sửa thì email báo đơn không tới.
- [ ] **Khu vực giao hàng**: sửa `const AREAS = [...]` trong `app.js` (đang chỉ có 2 mục) thành danh sách xã/phường thật.

## B. Firebase (BẮT BUỘC)
- [ ] Firestore → Rules: dán toàn bộ `firestore.rules` → Publish.
- [ ] Authentication → Email/Password đã bật; Authorized domains có tên miền thật.
- [ ] Đăng ký tài khoản của bạn trên web, vào Firestore → `users` → đổi `role` thành `admin`.
- [ ] Tạo `settings/app` (qua Admin) trước khi bật chuyển khoản / giảm giá nền tảng.
- [ ] Google Cloud Console → Credentials → giới hạn API key `AIza...` theo tên miền (HTTP referrer). Key này công khai trong web, nên giới hạn là bắt buộc.
- [ ] Đặt cảnh báo ngân sách / theo dõi hạn mức miễn phí Firestore (gói Spark có giới hạn đọc/ghi mỗi ngày).

## C. Apps Script (BẮT BUỘC để có ảnh, báo đơn, đặt lại mật khẩu)
- [ ] Deploy Web app (Execute as: Me, Access: Anyone) → dán URL `/exec` vào `upload-config.js` (`UPLOAD_URL` đang **để trống**: chưa tải ảnh lên được, chưa có email/Zalo báo đơn).
- [ ] Script properties: `ZALO_BOT_TOKEN`, `ZALO_ADMIN_IDS`.
- [ ] Chạy hàm `installTrigger()` một lần (quét trạng thái đơn để đẩy thông báo).
- [ ] Mỗi lần sửa `.gs`: Deploy → Manage deployments → Edit → **New version**.

## D. Tuỳ chọn
- [ ] Thông báo đẩy: dán VAPID key vào `push-config.js`.
- [ ] Bản đồ Goong: dán 2 khóa vào `goong-config.js` và giới hạn tên miền ở account.goong.io.
- [ ] Google Search Console: xác minh tên miền, gửi `sitemap.xml`.

## E. Thử trọn quy trình trước khi mở
1. Khách đăng ký → chọn quán → đặt món (tiền mặt) → thấy đơn ở "Hoạt động".
2. Quán nhận được đơn, shipper nhận đơn → giao xong → khách đánh giá 1–5 sao.
3. Chuyển khoản: khách bấm "Tôi đã chuyển khoản" → Admin xác nhận.
4. Admin: thêm quán, thêm món, tải ảnh, đặt phí ship, tạo mã giảm giá.
5. Mở web trên iPhone Safari và Android Chrome: nút "Tải App", đăng nhập, đặt đơn.
6. Bật chế độ bảo trì → khách không đặt được → tắt lại.

## F. Lưu ý bảo mật còn tồn tại
- Giá món trong đơn do trình duyệt khách gửi lên; luật Firestore chỉ kiểm tra tổng tiền khớp, không đối chiếu giá với thực đơn. Apps Script có `priceWarning` để cảnh báo đơn lệch giá, nên Admin/quán cần xem cảnh báo này khi nhận đơn.
- Không đưa token Zalo, mật khẩu hay khóa dịch vụ vào file nào trong repo; chỉ để trong Script properties.
