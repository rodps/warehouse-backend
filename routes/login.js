var express = require("express");
var router = express.Router();
var models = require("../models");
var passport = require("passport");
var middleware = require("../middleware");
var jwt = require('jsonwebtoken');

// Front ?
// router.get("/signup", (req, res) => {
//   res.render("autenticacao/signup");
// });

// Front ?
// router.get("/login", (req, res) => {
//   res.render("autenticacao/login");
// });
router.get("/", (req, res) => {
  res.send("padrao")
  
})

router.post("/signup",
  passport.authenticate("local-signup", {
    successRedirect: "/",
    failureRedirect: "/signup"
  })
);


router.post("/login",
  passport.authenticate("local-signin", {
    failureRedirect: "/login"
  }), (req,res) =>{
    const usuario = {
      id : req.user.id,
      nome : req.user.nome
    }
    var token = jwt.sign({ usuario }, 'secretkey', (err,token) =>{
      res.json({
        token : token
      })
    });
  }
);

router.get("/logout", (req, res) => {
  req.session.destroy(err => {
    res.redirect("/login");
  });
});

module.exports = router;
