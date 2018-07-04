var express = require("express");
var router = express.Router();
var models = require("../models");
var passport = require("passport");
var middleware = require("../middleware");
var jwt = require('jsonwebtoken');
const verifyToken = require("../middleware").verifyToken;

router.get("/", verifyToken, (req, res) => {
  res.send(req.dados.usuario);
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
        isAdm : req.user.adm,
        nome : req.user.nome,

      }
      req.dados = ret;
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
