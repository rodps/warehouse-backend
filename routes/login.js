var express = require("express");
var router = express.Router();
var db = require("../models");
var passport = require("passport");
var jwt = require('jsonwebtoken');
const verifyToken = require("../middleware").verifyToken;

router.get("/", verifyToken, (req, res) => {
  res.send(req.dados.usuario);
})

router.get("/users", verifyToken, (req, res) => {
  db.usuarios.findAll().then(users => {
    res.status(200).send(users);
  })
})

router.put("/verify/:id", verifyToken, (req, res) => {
  db.usuarios.update(req.body, {
    where: {id: req.params.id}
  }).then(() => {
    res.sendStatus(200);
  });
});

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
