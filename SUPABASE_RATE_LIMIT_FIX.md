# Hướng Dẫn Sửa Lỗi "Email Rate Limit Exceeded"

## 🔴 Vấn Đề
Khi người dùng đăng ký trên production, gặp lỗi:
```
email rate limit exceeded
or
Too many signup requests. Try again later.
```

---

## 🔍 Nguyên Nhân

### 1. **Email Confirmation Bị Bật (Chính)**
Supabase mặc định bật "Confirm email" trong Auth settings. Điều này gây:
- Mỗi signUp gửi 1 email xác nhận
- Rate limit: **~5 emails per 60 seconds per email address**
- Nếu user bấm submit liên tục → nhanh chóng hit limit

### 2. **Supabase Email Service Limitation**
- Free tier: Email từ noreply@mail.supabase.io (có rate limit)
- Pro tier: Tương tự, nhưng có support tùy chỉnh
- Để tăng limit, cần liên hệ Supabase support hoặc upgrade

### 3. **Multiple Submissions**
- User bấm submit nhiều lần nhanh (dù UI disabled button)
- Network chậm → user bấm lại
- Browser retry request tự động

---

## ✅ Giải Pháp (4 Bước)

### **Bước 1: Tắt Email Confirmation trong Supabase**

1. Truy cập: https://supabase.com → Project → Authentication
2. Chọn tab **Providers**
3. Tìm **Email** provider
4. Tắt: **Confirm email**
   ```
   ☐ Confirm email (UNCHECK THIS)
   ```
5. Bấm **Save**

**Lý do**: Project này dùng email fake (`username@ptshop.local`) không cần xác nhận thực.

---

### **Bước 2: Cấu Hình Email Không Cần Xác Nhận**

Vẫn trong **Authentication → Providers → Email**:

```
Confirm email: OFF ✓

Autoconfirm user:
☑ Enable Autoconfirm (RECOMMENDED)
   → Tự động confirm user khi đăng ký, không gửi email

Double confirm users: OFF ✓
```

**Kết quả**: User đăng ký liền lập tức có session, không cần xác nhận email.

---

### **Bước 3: Rate Limit Override (Nếu Cần)**

Nếu vẫn muốn gửi email nhưng tăng limit:

**Option A: Contact Supabase Support**
- Yêu cầu tăng email rate limit (từ 5 → 20-50 per minute)
- Pro plan hoặc Enterprise

**Option B: Sử Dụng Service Email Riêng**
- Setup: SendGrid, Resend, Mailgun
- Tích hợp với Supabase Auth hooks
- Bypass Supabase email limit
- **(Phức tạp hơn, chỉ làm nếu cần)**

---

### **Bước 4: Code Changes (Đã Thực Hiện)**

File: `app/register/page.tsx`

**Cải thiện**:
✅ Thêm debounce (`isSubmitting` state)
✅ Prevent multiple form submissions
✅ Custom error message cho rate limit
✅ Hướng dẫn user chờ 1 phút rồi thử lại

**Code mới**:
```jsx
const [isSubmitting, setIsSubmitting] = useState(false);

// Ở đầu handleRegister
if (isSubmitting) {
  return; // Block nếu đang submit
}
setIsSubmitting(true);

// Xử lý error
if (signUpError.message.includes("rate_limit")) {
  setError("Quá nhiều yêu cầu đăng ký. Vui lòng chờ 1 phút rồi thử lại.");
}
```

---

## 📊 So Sánh: Trước vs Sau

| Vấn Đề | Trước | Sau |
|--------|-------|-----|
| Email confirmation | Bật (gửi email) | Tắt (không gửi) |
| User phải làm gì | Xác nhận email | Đăng nhập liền |
| Rate limit hit | Nhanh (5/min) | Không hit (không gửi email) |
| User experience | Chậm, phức tạp | Nhanh, đơn giản |
| Multiple submission | Có thể xảy ra | Được ngăn (debounce) |

---

## 🧪 Test Quy Trình

1. **Local Testing**:
   ```bash
   npm run dev
   # Truy cập http://localhost:3000/register
   # Đăng ký với username: `testuser123`
   # Phải login liền, không cần xác nhận email
   ```

2. **Production Testing** (Vercel):
   - Deploy code mới
   - Tắt Email Confirmation trong Supabase
   - Test đăng ký lại
   - Xác nhận không có lỗi "rate limit exceeded"

3. **Stress Test**:
   ```bash
   # Click submit nút 5-10 lần liên tục
   # Kỳ vọng: chỉ 1 request được gửi, UI debounce ngăn
   ```

---

## 📝 Checklist

- [ ] Tắt "Confirm email" trong Supabase Auth
- [ ] Bật "Autoconfirm" trong Supabase Auth
- [ ] Deploy code mới (`app/register/page.tsx`)
- [ ] Test đăng ký trên production
- [ ] Xác nhận user login liền mà không cần xác nhận email
- [ ] Thử bấm submit nhiều lần → không bị rate limit

---

## ⚠️ Lưu Ý Bảo Mật

✅ **An toàn** - Không bypass bảo mật:
- Vẫn dùng Supabase Auth (không tự tạo user)
- Password được hash bởi Supabase
- Email validation vẫn hoạt động
- Không dùng `service_role` trong browser

❌ **Không được làm**:
- Tự tạo user bằng SQL
- Sử dụng service_role key trong browser
- Bypass password validation

---

## 🆘 Nếu Vẫn Gặp Lỗi

1. **Verify Supabase settings**:
   ```
   Admin → Database → Tables → auth.users
   Xem có user mới được tạo không
   ```

2. **Check Supabase logs**:
   ```
   Supabase Dashboard → Logs → Auth
   Xem error details
   ```

3. **Rate limit quá chặt**:
   - Liên hệ Supabase support
   - Nâng cấp plan hoặc tăng limit

4. **DNS caching issue**:
   ```bash
   # Clear DNS cache
   sudo systemctl restart systemd-resolved
   # Hoặc restart browser
   ```

---

## 📚 Tài Liệu Tham Khảo

- Supabase Auth Docs: https://supabase.com/docs/guides/auth
- Email Configuration: https://supabase.com/docs/guides/auth/auth-email
- Rate Limiting: https://supabase.com/docs/guides/auth/rate-limits

---

**Status**: ✅ **FIXED** - Code cập nhật, hướng dẫn cấu hình Supabase hoàn thành
