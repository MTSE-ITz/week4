const getHomePage = async (req, res) => {
  return res.render('index.ejs');
};

export { getHomePage };
