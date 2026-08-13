# PTShop Full Starter

## Chức năng
- Trang chủ responsive
- Danh sách dịch vụ
- Đặt đơn
- Supabase Auth
- Hồ sơ + số dư
- Dashboard khách hàng
- Nạp tiền thủ công chờ Admin duyệt
- Lịch sử đơn
- Feedback schema
- Notification schema
- Admin quản lý đơn
- Admin duyệt/từ chối yêu cầu nạp
- Settings và cấu hình Zalo
- RLS cơ bản

## Cài đặt
1. Node.js 18+.
2. `npm install`
3. Tạo Supabase project.
4. Chạy `supabase.sql` trong SQL Editor.
5. Sao chép `.env.example` -> `.env.local`.
6. Điền URL + anon key.
7. `npm run dev`

## Tạo Admin
Tạo tài khoản bằng Supabase Auth, sau đó trong SQL Editor:
update profiles set role='admin' where id='UUID_CUA_TAI_KHOAN';

## Quan trọng về số dư
Không cập nhật `profiles.balance` trực tiếp từ browser khi duyệt tiền. Production nên dùng RPC `security definer` hoặc server route để thực hiện nguyên tử:
1. khóa/kiểm tra deposit pending,
2. cộng balance,
3. tạo transaction,
4. đánh dấu deposit approved,
5. tạo notification,
6. ghi admin_logs.

Bản starter để Admin duyệt trạng thái nhưng cố ý không fake việc xác minh chuyển khoản ngân hàng.

## Deploy
Có thể deploy Next.js lên Vercel. Đặt các biến môi trường trong phần Environment Variables.

## Cần hoàn thiện trước production
- RPC cộng/trừ số dư nguyên tử
- upload ảnh biên lai qua Supabase Storage
- phân trang admin
- rate limiting
- CSRF/abuse protection nếu thêm API riêng
- email/Discord/Zalo notification nếu cần
- cổng thanh toán tự động nếu nhà cung cấp hỗ trợ
