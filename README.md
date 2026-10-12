# 🍽️ Restaurantly - Restaurant SSR Web Application

Ứng dụng web nhà hàng hoàn chỉnh theo mô hình **Server-Side Rendering (SSR thuần túy - Zero Client-Side JS)** được xây dựng bằng **Node.js**, **Express.js**, **EJS**, **Tailwind CSS**, và **Prisma ORM** kết nối **PostgreSQL (Supabase)**.

Giao diện được lấy cảm hứng và thiết kế theo mẫu **Restaurantly** (Dark & Gold Luxury Theme).

---

## 🚀 Tính năng nổi bật

### 1. Kiến trúc & Công nghệ
- **Backend:** Node.js & Express.js.
- **View Engine:** EJS (Embedded JavaScript) kết hợp Tailwind CSS & custom luxury styling.
- **Database & ORM:** PostgreSQL kết nối qua Supabase Pooler, quản lý schema và migrations bằng Prisma ORM.
- **SSR thuần túy (Zero Client JS):** 
  - Không sử dụng `fetch`, `AJAX`, `axios` hay bất kỳ client-side script nào để gửi dữ liệu.
  - Mọi thao tác đều dùng chuẩn HTML `<form>`.
- **HTTP Methods & Method Override:**
  - Hỗ trợ `PATCH` và `DELETE` từ form HTML thông qua `method-override` (`?_method=PATCH`, `?_method=DELETE`).
  - Mọi thao tác ghi (Create, Update, Delete) đều redirect bằng mã **HTTP 303 See Other** để chống duplicate submit.
  - Quy trình xóa có trang xác nhận bảo vệ dữ liệu.
  - Xử lý lỗi validation với mã **HTTP 400 Bad Request** và giữ nguyên giá trị input người dùng (sticky form).
  - Bắt lỗi **HTTP 404 Not Found** với trang thông báo chuyên biệt.
- **Bảo mật:** Whitelist và sanitize từng trường dữ liệu trước khi tương tác với ORM, không in hoặc leak chuỗi `DATABASE_URL`.

### 2. Chức năng Public
- `GET /dishes`: Xem danh sách thực đơn món ăn, hỗ trợ tìm kiếm theo tên món bằng query param `q` (vd: `/dishes?q=phở`).
- `GET /dishes/:id`: Xem chi tiết món ăn (phong cách Specials với đĩa tròn cao cấp).

### 3. Chức năng Quản trị (Admin CRUD)
Xây dựng đầy đủ cụm route quản lý cho cả 3 bảng dữ liệu:
- **Món ăn (Dishes):** `GET /admin/dishes`, `GET /admin/dishes/new`, `POST /admin/dishes`, `GET /admin/dishes/:id/edit`, `PATCH /admin/dishes/:id`, `GET /admin/dishes/:id/delete`, `DELETE /admin/dishes/:id`.
- **Đầu bếp (Chefs):** Đầy đủ 6 route CRUD (`/admin/chefs...`).
- **Nguyên liệu (Ingredients):** Đầy đủ 6 route CRUD (`/admin/ingredients...`).

---

## 🛠️ Hướng dẫn cài đặt và khởi chạy

### 1. Clone repository
```bash
git clone https://github.com/Maverick0602/dev_web_w3.git
cd dev_web_w3
```

### 2. Cài đặt các gói phụ thuộc
```bash
npm install
```

### 3. Cấu hình biến môi trường
Tạo file `.env` từ file `.env.example`:
```env
PORT=3000
DATABASE_URL="postgresql://username:password@aws-0-ap-southeast-2.pooler.supabase.com:5432/postgres"
```

### 4. Đồng bộ Schema và Nạp dữ liệu mẫu
```bash
# Đẩy schema lên database
npx prisma db push

# Nạp dữ liệu mẫu (Seeding)
npm run prisma:seed
```

### 5. Khởi chạy Server
```bash
# Chạy môi trường production
npm start

# Hoặc chạy môi trường phát triển (nodemon)
npm run dev
```

Truy cập ứng dụng tại: [http://localhost:3000](http://localhost:3000)
