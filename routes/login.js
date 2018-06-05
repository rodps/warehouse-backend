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
    failureRedirect: "/"
  }), (req,res) =>{
    const usuario = {
      id : req.user.id,
      nome : req.user.nome,
      adm : req.user.adm
    }
    var token = jwt.sign({ usuario }, 'secretkey', (err,token) =>{
      const ret = {
        token : token,
        isAdm : req.user.adm
      }
      res.status(201).json(ret)
    });
  }
);


router.get("/logout", (req, res) => {
  req.session.destroy(err => {
    res.redirect("/login");
  });
});

module.exports = router;
