var express = require("express");
var router = express.Router();
var models = require("../models");
var passport = require("passport");
var middleware = require("../middleware");
var jwt = require('jsonwebtoken');

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
        isAdm : req.user.adm,
        nome : req.user.nome,
      }
      res.status(201).json(ret)
    });
  }
);

router.get("/users", (req, res) => {
  models.usuarios.findAll().then(users => {
    res.status(200).send(users);
  })
});

router.put("/:id", (req, res) => {
  models.usuarios.update(req.body, {
    where: {id: req.params.id}
  }).then(() => {
    res.sendStatus(200);
  });
});

router.get("/users/unverified", (req, res) => {
  models.usuarios.findAll({
    where: {verificado: false}
  }).then(users => {
    res.status(200).send(users);
  })
});

router.get("/logout", (req, res) => {
  req.session.destroy(err => {
    res.redirect("/login");
  });
});

module.exports = router;
