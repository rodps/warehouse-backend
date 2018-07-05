var express = require("express");
var router = express.Router();
var db = require("../models");
var passport = require("passport");
var jwt = require('jsonwebtoken');
const verifyToken = require("../middleware").verifyToken;

router.get("/", verifyToken, (req, res) => {
  res.send(req.dados.usuario);
})

router.get("/users", (req, res) => {
  db.usuarios.findAll().then(users => {
    res.status(200).send(users);
  })
})

router.put("/:id", (req, res) => {
  db.usuarios.update(req.body, {
    where: {id: req.params.id}
  }).then(() => {
    res.sendStatus(200);
  });
});

router.get("/:id", (req, res) => {
  db.usuarios.findById(req.params.id).then(user => {
    res.status(200).json(user);
  }).catch(err => {
    res.status(400).json(err);
  })
});

router.post("/signup",
  passport.authenticate("local-signup"),
  (req, res) => {
    res.sendStatus(201);
  }
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

router.get("/users", (req, res) => {
  models.usuarios.findAll().then(users => {
    res.status(200).send(users);
  })
})


router.get("/users/unverified", (req, res) => {
  models.usuarios.findAll({
    where: {verificado: false}
  }).then(users => {
    res.status(200).send(users);
  })
})


router.get("/logout", (req, res) => {
  req.session.destroy(err => {
    res.redirect("/login");
  });
});

module.exports = router;
