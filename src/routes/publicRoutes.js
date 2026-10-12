const express = require('express');
const router = express.Router();
const dishPublicController = require('../controllers/dishPublicController');

// Điều hướng trang chủ về danh sách món ăn
router.get('/', (req, res) => {
  res.redirect('/dishes');
});

// [GET] /dishes - Danh sách món ăn có tìm kiếm ?q=
router.get('/dishes', dishPublicController.getDishes);

// [GET] /dishes/:id - Chi tiết món ăn
router.get('/dishes/:id', dishPublicController.getDishDetail);

module.exports = router;
