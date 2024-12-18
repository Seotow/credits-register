# 🖥️ Tôi đăng ký tín chỉ HaUI
---
**Tác giả:** Nguyễn Trung Hiếu    
**Bản quyền:** Mã nguồn này chỉ được phép sử dụng cho mục đích cá nhân, nghiêm cấm sử dụng cho mục đích thương mại dưới mọi hình thức. Mọi đóng góp đều được hoan nghênh. 🌟

---

# 🚀 Quy trình phát triển
    Pending...
# 📚 Hướng dẫn sử dụng và phát triển mã nguồn

## 🚀 Bước 1: Đăng nhập vào hệ thống

🔗 Truy cập [**sv.haui.edu.vn**](https://sv.haui.edu.vn/) và đăng nhập tài khoản.

---

## ⚙️ Bước 2: Chạy mã để lấy danh sách lớp

1. Mở **Console** bằng tổ hợp phím **Ctrl + Shift + i** (hoặc chuột phải -> Chọn "Inspect").
2. Copy toàn bộ **code trong `creditsRegister.js`** rồi **dán vào Console**, nhấn **Enter** và đợi thông tin hiển thị.
   > ⚠️ Nếu gặp thông báo `"Warning: Don't paste code into..."`  
   👉 Gõ **`allow pasting`** -> **Enter**, sau đó copy lại mã.

🎯 **Thông tin hiển thị sẽ gồm:**
- 📚 **Tên học phần**
- 🆔 **Mã học phần - fid**
- 🧑‍🏫 **Tên giảng viên**
- 🏷️ **IndependentClassID** - Mã lớp ưu tiên
- 🕒 **Giờ học**
- 👥 **Số lượng sinh viên/Số lượng tối đa**
- 🏫 **Cơ sở học**

---

## ✍️ Bước 3: Bắt đầu đăng ký lớp học thôi
### 🤖Đăng ký lớp học theo IndependentClassID

Sử dụng **hàm**:

- **`regist(independentClassID)`**: Đăng ký lớp học. **Ví dụ**:
  
```javascript
regist(216243)
```
- **`removeClass(independentClassID)`**: Hủy đăng ký lớp học. **Ví dụ**:
```javascript
removeClass(216243)
```
---

### 🤖Đăng ký lớp tự động

Sử dụng **hàm tự động đăng ký**:

```javascript
startAutoRegister(fid, independentIdList, interval)
```

- **`fid`**: Mã học phần (lấy từ danh sách lớp học).
- **`independentIdList`**: Danh sách IndependentClassID cần đăng ký tự động.
- **`interval`**: Thời gian kiểm tra lại (mặc định là **100 ms**).

🛠️ **Ví dụ**:

```javascript
startAutoRegister(4794, [214812, 214813, 214814], 100)
```

---

### 🛑 Hủy tự động đăng ký

Sử dụng **hàm**:

```javascript
removeAuto()
```

---

## 🔍 Lưu ý:

- 💾 **Đảm bảo đã đăng nhập** vào hệ thống trước khi chạy mã và có thể sử dụng khi chưa đến thời gian đăng ký (với điều kiện lớp đã được trường mở).
- 🖥️ Thông tin hiển thị trong **Console** của trình duyệt.
- ❌ Đừng hủy lớp nếu đang 1 chiều vì người viết chưa dám thử.
- ✅ **Chương trình tự động dừng** khi lớp đã được đăng ký hoặc khi bạn hủy bằng **`removeAuto()`**.

🎉 **Chúc bạn đăng ký tín thành công!**