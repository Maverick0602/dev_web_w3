exports.getHome = (req, res) => {
  res.render('public/home', {
    title: 'Restaurantly - Ẩm Thực Thượng Hạng'
  });
};
