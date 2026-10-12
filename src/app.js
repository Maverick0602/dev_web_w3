const path = require('path');
const express = require('express');
const methodOverride = require('method-override');
require('dotenv').config();

const publicRoutes = require('./routes/publicRoutes');
const dishAdminRoutes = require('./routes/dishAdminRoutes');
const chefAdminRoutes = require('./routes/chefAdminRoutes');
const ingredientAdminRoutes = require('./routes/ingredientAdminRoutes');

const app = express();

// Cấu hình View Engine (EJS)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

// Cấu hình Static Files (CSS, hình ảnh)
app.use(express.static(path.join(__dirname, '../public')));

// Parse dữ liệu từ HTML form thuần (application/x-www-form-urlencoded)
app.use(express.urlencoded({ extended: true }));

// Cấu hình method-override để nhận diện ?_method=PATCH và ?_method=DELETE
app.use(methodOverride('_method'));

// Đăng ký routes
app.use('/', publicRoutes);
app.use('/admin', dishAdminRoutes);
app.use('/admin', chefAdminRoutes);
app.use('/admin', ingredientAdminRoutes);

// Xử lý 404 Not Found cho mọi URL không khớp
app.use((req, res) => {
  res.status(404).render('404', {
    title: '404 - Không tìm thấy trang',
    message: 'Trang bạn đang truy cập không tồn tại hoặc đã bị xóa.'
  });
});

// Middleware xử lý lỗi hệ thống tập trung (500)
app.use((err, req, res, next) => {
  console.error('Server Internal Error:', err.message);
  res.status(500).render('404', {
    title: '500 - Lỗi máy chủ',
    message: 'Đã xảy ra sự cố từ máy chủ. Vui lòng thử lại sau.'
  });
});

module.exports = app;
