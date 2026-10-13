# Restaurantly SSR

## Thuyết trình ứng dụng và đối chiếu yêu cầu Block 5

> Ứng dụng quản lý nhà hàng xây dựng bằng Node.js, Express, EJS và Prisma ORM, kết nối PostgreSQL trên Supabase.

---

## 1. Bài toán và mục tiêu

Ứng dụng giải quyết hai nhu cầu chính:

- Khách truy cập xem thực đơn, tìm kiếm món ăn và mở trang chi tiết.
- Quản trị viên quản lý món ăn, đầu bếp và nguyên liệu bằng các form HTML.

Mục tiêu của Block 5 được tích hợp vào project:

- Hiểu luồng Server-Side Rendering từ browser đến database và ngược lại.
- Khai báo model bằng Prisma ORM.
- Đọc dữ liệu qua URL params và query params.
- Ghi dữ liệu qua form HTML và `req.body`.
- Xây dựng CRUD bằng GET, POST, PATCH và DELETE.
- Xử lý validation, 404, 500 và redirect sau thao tác ghi.

---

## 2. Công nghệ sử dụng

| Thành phần | Vai trò |
|---|---|
| Node.js | Môi trường chạy JavaScript phía server |
| Express.js | Web framework, route và middleware |
| EJS | Render HTML phía server |
| Prisma ORM | Khai báo model và truy vấn PostgreSQL |
| Supabase | PostgreSQL database trên cloud |
| `method-override` | Cho phép form HTML gửi PATCH/DELETE |
| HTML form | Gửi dữ liệu theo SSR, không dùng fetch/AJAX cho CRUD |

Cấu trúc chính:

```text
server.js
src/
  app.js
  config/prisma.js
  controllers/
  routes/
views/
  public/
  admin/
  partials/
prisma/
  schema.prisma
  seed.js
public/
  css/style.css
```

---

## 3. Kiến trúc SSR

Luồng xử lý chính:

```text
Browser
  ↓ HTTP request
Express route
  ↓
Controller / handler
  ↓
Prisma ORM
  ↓
PostgreSQL trên Supabase
  ↑
Dữ liệu trả về controller
  ↑
EJS render HTML
  ↑
Browser nhận HTML hoàn chỉnh
```

Phân chia trách nhiệm:

- **Route**: xác định URL và HTTP method.
- **Controller**: đọc request, validate, truy vấn database và chọn response.
- **Prisma**: chuyển thao tác model thành SQL.
- **EJS**: quyết định dữ liệu hiển thị như thế nào.
- **Browser**: nhận HTML và gửi form theo chuẩn HTTP.

---

## 4. Tách trang chủ và thực đơn

Project hiện có ba route public chính:

| Route | Chức năng |
|---|---|
| `GET /` | Trang chủ nhà hàng |
| `GET /menu` | Danh sách và tìm kiếm thực đơn |
| `GET /menu/:id` | Chi tiết món ăn |

Trang chủ và thực đơn đã được tách thành hai view:

```text
views/public/home.ejs
views/public/menu.ejs
views/public/dish-detail.ejs
```

Trang chủ gồm:

- Hero giới thiệu Restaurantly.
- Slogan và định hướng nhà hàng.
- Các lý do chọn nhà hàng.
- Nút chuyển tới thực đơn.

Trang thực đơn gồm:

- Danh sách món lấy từ database.
- Tìm kiếm bằng `GET /menu?q=...`.
- Giá, danh mục và trạng thái món.
- Link tới `/menu/:id`.

Các URL cũ vẫn được hỗ trợ bằng redirect:

```text
/dishes       → /menu
/dishes/:id   → /menu/:id
```

---

## 5. Prisma schema và database

Ba model độc lập trong `prisma/schema.prisma`:

```prisma
model Dish {
  id          Int      @id @default(autoincrement())
  name        String
  description String
  price       Int
  category    String
  available   Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

```prisma
model Chef {
  id        Int      @id @default(autoincrement())
  name      String
  specialty String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

```prisma
model Ingredient {
  id        Int      @id @default(autoincrement())
  name      String
  unit      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

Giá món ăn dùng `Int` vì dữ liệu là giá nguyên bằng VNĐ, tránh sai số của `Float`.

Đồng bộ schema:

```powershell
npx prisma validate
npx prisma generate
npx prisma db push
```

---

## 6. Đọc dữ liệu: danh sách và chi tiết

### Danh sách món

`GET /menu` gọi controller món public:

- Đọc query parameter `q`.
- Chỉ xử lý `q` khi đó là chuỗi.
- Giới hạn query tối đa 100 ký tự.
- Dùng Prisma `findMany`.
- Tìm theo tên món không phân biệt hoa thường.
- Render `views/public/menu.ejs`.

Ví dụ:

```text
/menu
/menu?q=phở
```

### Chi tiết món

`GET /menu/:id` sử dụng path parameter:

```text
/menu/2
```

Controller thực hiện:

1. Parse `id` thành số nguyên.
2. Chặn ID không hợp lệ.
3. Dùng `findUnique` tìm món.
4. Trả 404 nếu không có bản ghi.
5. Render `dish-detail.ejs` nếu tìm thấy.

URL chứa ID giúp trang chi tiết hoạt động đúng khi reload, mở tab mới hoặc chia sẻ liên kết.

---

## 7. CRUD món ăn

Các route quản trị món ăn:

| Method | Route | Chức năng |
|---|---|---|
| GET | `/admin/dishes` | Danh sách món |
| GET | `/admin/dishes/new` | Form thêm |
| POST | `/admin/dishes` | Tạo món |
| GET | `/admin/dishes/:id/edit` | Form sửa |
| PATCH | `/admin/dishes/:id` | Cập nhật món |
| GET | `/admin/dishes/:id/delete` | Xác nhận xóa |
| DELETE | `/admin/dishes/:id` | Xóa món |

Các field được ghi vào database:

```text
name
description
price
category
available
```

Controller không đưa trực tiếp toàn bộ `req.body` vào Prisma mà tạo object whitelist riêng.

---

## 8. CRUD đầu bếp và nguyên liệu

Project áp dụng cùng một mẫu CRUD cho hai model còn lại.

### Chef

```text
/admin/chefs
/admin/chefs/new
/admin/chefs/:id/edit
/admin/chefs/:id/delete
```

Field:

```text
name
specialty
```

### Ingredient

```text
/admin/ingredients
/admin/ingredients/new
/admin/ingredients/:id/edit
/admin/ingredients/:id/delete
```

Field:

```text
name
unit
```

Mỗi đối tượng đều có:

- Danh sách.
- Form thêm.
- Form sửa.
- Trang xác nhận xóa.
- Validation cơ bản.
- Redirect 303 sau khi ghi dữ liệu.

---

## 9. Form HTML và method override

HTML form chỉ hỗ trợ trực tiếp GET và POST. Project dùng method override để biểu diễn PATCH và DELETE.

Form cập nhật:

```html
<form method="POST" action="/admin/dishes/2?_method=PATCH">
```

Form xóa:

```html
<form method="POST" action="/admin/dishes/2?_method=DELETE">
```

Middleware server:

```js
app.use(methodOverride('_method'));
```

Sau middleware, Express có thể khớp với route:

```js
router.patch('/dishes/:id', updateDish);
router.delete('/dishes/:id', deleteDish);
```

Toàn bộ thao tác đi qua trang SSR, không dùng AJAX.

---

## 10. Validation và whitelist

Validation Dish kiểm tra:

- Tên không rỗng.
- Mô tả không rỗng.
- Danh mục không rỗng.
- Giá là số nguyên hữu hạn.
- Giá lớn hơn hoặc bằng 0.

Các giá trị như sau bị từ chối:

```text
"
85000abc
Infinity
-100
```

Khi validation lỗi:

- Response có status `400 Bad Request`.
- Form được render lại.
- Giá trị người dùng nhập được giữ lại.
- Danh sách lỗi được hiển thị bằng EJS.

Whitelist giúp loại bỏ các field không được phép như `id`, `createdAt`, `updatedAt` hoặc field lạ.

---

## 11. POST/Redirect/GET và HTTP 303

Luồng tạo dữ liệu:

```text
Browser POST form
  ↓
Server validate và ghi database
  ↓
Server trả 303 See Other
  ↓
Browser tự GET URL đích
  ↓
Trang danh sách được render
```

Project dùng:

```js
res.redirect(303, '/admin/dishes');
```

Lợi ích:

- Reload trang cuối chỉ gửi lại GET.
- Tránh submit lại POST và tạo bản ghi trùng do refresh.
- URL cuối là URL đọc dữ liệu được.
- Áp dụng cho create, update và delete.

---

## 12. Xử lý lỗi

### HTTP 400

Dùng cho dữ liệu form không hợp lệ.

### HTTP 404

Dùng cho:

- URL không tồn tại.
- ID không phải số.
- ID nhỏ hơn hoặc bằng 0.
- Bản ghi không tồn tại.

### HTTP 500

Middleware lỗi tập trung render `views/500.ejs` và không hiển thị chi tiết database cho người truy cập.

Các lỗi nội bộ được chuyển bằng:

```js
next(error)
```

Phần giao diện 404 và 500 được tách riêng để mã trạng thái và nội dung hiển thị nhất quán.

---

## 13. Seed dữ liệu mẫu

Project có `prisma/seed.js` với dữ liệu mẫu cho:

- 4 đầu bếp.
- 5 nguyên liệu.
- 5 món ăn.

Seed hiện có tính chất reset dữ liệu. Vì vậy project yêu cầu biến xác nhận:

```powershell
$env:ALLOW_DESTRUCTIVE_SEED="true"; npm run prisma:seed
```

Nếu chưa đặt biến này, seed dừng trước khi xóa dữ liệu.

Đây là biện pháp tránh chạy nhầm seed reset trên database đang có dữ liệu.

---

## 14. Đối chiếu yêu cầu đề bài

| Yêu cầu Block 5 | Cách project tích hợp | Trạng thái |
|---|---|---|
| SSR nhiều trang | Express + EJS, route riêng | Đạt |
| Database thật | PostgreSQL Supabase | Đạt |
| ORM | Prisma Client | Đạt |
| Model | Dish, Chef, Ingredient | Đạt |
| URL path param | `/menu/:id` | Đạt |
| Query param | `/menu?q=...` | Đạt |
| Form body | `express.urlencoded` + `req.body` | Đạt |
| Create | POST | Đạt |
| Read | GET | Đạt |
| Update | PATCH qua method override | Đạt |
| Delete | DELETE qua method override | Đạt |
| Không xóa bằng GET | Có trang xác nhận và form DELETE | Đạt |
| Validation | HTTP 400 và sticky form | Đạt |
| 404 | ID/URL không tồn tại | Đạt |
| PRG | HTTP 303 sau ghi | Đạt |
| Không dùng AJAX CRUD | Form HTML và SSR | Đạt |
| Authentication admin | Chưa triển khai | Ngoài phạm vi hiện tại |
| Migration versioned | Dùng `db push` trong block này | Ghi chú |

---

## 15. Demo đề xuất khi thuyết trình

### Phần public

1. Mở `/` và giới thiệu trang chủ riêng.
2. Nhấn “OUR MENU” tới `/menu`.
3. Tìm kiếm `phở` và giải thích query parameter.
4. Mở chi tiết một món tại `/menu/:id`.
5. Reload trang chi tiết để chứng minh URL xác định bản ghi.
6. Mở `/dishes` để minh họa redirect tương thích.

### Phần admin

1. Mở `/admin/dishes`.
2. Thêm món mới bằng form POST.
3. Sửa món bằng form POST + `_method=PATCH`.
4. Xóa món qua trang xác nhận + `_method=DELETE`.
5. Nhập giá sai để minh họa HTTP 400 và sticky form.
6. Lặp lại mẫu CRUD với Chef và Ingredient.

### Phần kỹ thuật

1. Mở `prisma/schema.prisma` giới thiệu model.
2. Mở controller để chỉ ra validation và whitelist.
3. Mở route để chỉ ra HTTP method.
4. Mở `app.js` để chỉ ra body parser và method override.
5. Minh họa flow POST → 303 → GET.

---

## 16. Giới hạn hiện tại

- Khu vực `/admin` chưa có authentication/authorization vì project tập trung vào nội dung SSR, database và ORM của Block 5.
- Project dùng `prisma db push`, chưa có Prisma migrations versioned.
- Tailwind đang tải qua CDN; nghiệp vụ CRUD vẫn không dùng fetch/AJAX.
- Ba model hiện độc lập, chưa có quan hệ Dish–Chef hoặc Dish–Ingredient.

---

## 17. Kết luận

Restaurantly đã tích hợp các kiến thức trọng tâm của Block 5:

- SSR với nhiều URL.
- Database thật và Prisma ORM.
- Path params, query params và form body.
- CRUD nhiều model.
- Method override cho PATCH/DELETE.
- Validation, 404, 500 và sticky form.
- POST/Redirect/GET bằng HTTP 303.

Ứng dụng vừa có phần public để khách xem thực đơn, vừa có phần admin để minh họa đầy đủ luồng quản trị dữ liệu bằng server-rendered HTML.
