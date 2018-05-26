var middleware = {};
var jwt = require('jsonwebtoken');

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

middleware.verifyToken = function(req, res, next) {
  jwt.verify(req.params.token,'secretkey',(err,dados)=>{
    if(err){
      res.sendStatus(403);
    }else{
     return next();
    }
  })

}

module.exports = middleware;
