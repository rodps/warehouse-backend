var middleware = {};

middleware.isLoggedIn = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

middleware.isLoggedInAdm = function(req, res, next) {
    if (req.isAuthenticated()) {
      if (!req.user.adm) {
        res.redirect("/solicitacoes");
      } else {
        return next();
      }
    }
    res.redirect("/login");
};

module.exports = middleware;
