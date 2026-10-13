const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');
const dishPublicController = require('../controllers/dishPublicController');

// [GET] / - Trang chủ
router.get('/', homeController.getHome);

// [GET] /menu - Danh sách món ăn có tìm kiếm ?q=
router.get('/menu', dishPublicController.getDishes);

// [GET] /menu/:id - Chi tiết món ăn
router.get('/menu/:id', dishPublicController.getDishDetail);

// Route tương thích với URL cũ
router.get('/dishes', (req, res) => {
  const query = typeof req.query.q === 'string' && req.query.q.trim()
    ? `?q=${encodeURIComponent(req.query.q)}`
    : '';
  res.redirect(301, `/menu${query}`);
});

router.get('/dishes/:id', (req, res) => {
  res.redirect(301, `/menu/${encodeURIComponent(req.params.id)}`);
});

module.exports = router;
