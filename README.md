# Restaurantly - Restaurant SSR Web Application

Ứng dụng web nhà hàng theo mô hình **Server-Side Rendering (SSR)**, được xây dựng bằng **Node.js**, **Express.js**, **EJS**, **Tailwind CSS** và **Prisma ORM**, kết nối PostgreSQL trên Supabase.

Giao diện lấy cảm hứng từ mẫu Restaurantly với chủ đề Dark & Gold Luxury.

## Tính năng

### Kiến trúc

- Backend: Node.js và Express.js.
- View engine: EJS.
- Database và ORM: PostgreSQL (Supabase) với Prisma.
- Mọi thao tác dữ liệu dùng HTML form và server-side rendering.
- Không dùng `fetch`, AJAX hoặc axios cho nghiệp vụ CRUD.
- Hỗ trợ PATCH và DELETE từ form HTML thông qua `method-override`.
- Các thao tác Create, Update, Delete redirect bằng HTTP 303.
- Validation trả HTTP 400 và giữ lại dữ liệu form không hợp lệ.
- Có trang lỗi riêng cho HTTP 404 và HTTP 500.
- Khu vực `/admin` hiện phục vụ mục đích học tập/demo và chưa có authentication/authorization.

### Chức năng public

- `GET /`: Trang chủ nhà hàng.
- `GET /menu`: Danh sách thực đơn.
- `GET /menu?q=phở`: Tìm kiếm món ăn theo tên.
- `GET /menu/:id`: Chi tiết món ăn.
- `/dishes` và `/dishes/:id` vẫn được giữ để redirect tương thích sang route mới.

### Chức năng admin

CRUD đầy đủ cho ba model:

- Dish: `/admin/dishes`
- Chef: `/admin/chefs`
- Ingredient: `/admin/ingredients`

Mỗi model hỗ trợ danh sách, thêm, sửa và xóa có trang xác nhận.

## Cài đặt và chạy

### 1. Cài dependency

```powershell
cd D:\Code_lab\WEB\W3\Block5\dev_web_w3
npm install
```

### 2. Cấu hình biến môi trường

Tạo `.env` từ `.env.example`, sau đó điền connection string PostgreSQL thật của Supabase:

```env
PORT=3000
DATABASE_URL="postgresql://username:password@aws-0-region.pooler.supabase.com:5432/postgres"
```

Không commit hoặc chia sẻ `.env`. Nếu password database đã bị lộ, hãy đổi password trong Supabase.

### 3. Đồng bộ schema

```powershell
npx prisma validate
npx prisma generate
npx prisma db push
```

Trường `Dish.price` là `Int`, biểu diễn giá nguyên bằng VNĐ.

### 4. Nạp dữ liệu mẫu

Seed hiện tại có tác dụng reset dữ liệu trong ba bảng trước khi tạo dữ liệu mẫu. Chỉ chạy trên database development hoặc database đã được backup:

```powershell
$env:ALLOW_DESTRUCTIVE_SEED="true"; npm run prisma:seed
```

Nếu chưa đặt biến xác nhận, lệnh seed sẽ dừng và không xóa dữ liệu.

### 5. Khởi chạy server

```powershell
npm start
```

Hoặc môi trường phát triển với nodemon:

```powershell
npm run dev
```

Mở trình duyệt tại [http://localhost:3000](http://localhost:3000).

## Cấu trúc route public

```text
/                 Trang chủ
/menu             Danh sách và tìm kiếm thực đơn
/menu/:id         Chi tiết món ăn
/dishes           Redirect tương thích sang /menu
/dishes/:id       Redirect tương thích sang /menu/:id
```

## Ghi chú kỹ thuật

- Project dùng `prisma db push` để đồng bộ schema trong phạm vi bài học; hiện chưa sử dụng versioned Prisma migrations.
- `method-override` chỉ chuyển các form POST thành PATCH hoặc DELETE ở phía server.
- Tailwind đang được tải qua CDN cho giao diện; nghiệp vụ dữ liệu vẫn chạy hoàn toàn qua HTML form và SSR.
