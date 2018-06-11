var express = require("express");
var router = express.Router();
var models = require("../models");
var middleware = require("../middleware");
const verifyToken = require("../middleware/index").verifyToken;
const verifyTokenAdm = require("../middleware/index").verifyTokenAdm;

// LISTAR ok 
router.get("/",verifyToken, (req, res) => {
  models.produtos
    .findAll()
    .then(allProdutos => {
      res.status(200).json(allProdutos);
    })
    .catch(err => { res.status(400).send(err) })
});

// CRIAR ok
router.post("/",verifyTokenAdm, (req, res) => {
  models.produtos
    .create({
      siorg: req.body.siorg,
      descricao: req.body.descricao
    })
    .then(produto => {
      res.status(201).json(produto);
    })
    .catch(err => { res.status(400).send(err) })
});

// MOSTRAR ok
router.get("/:id",verifyToken, (req, res) => {
  models.produtos
    .findById(req.params.id)
    .then(produto => {
      res.status(200).json(produto);
    })
    .catch(err => { res.status(400).send(err) })
});

// EDITAR ok
router.put("/:id",verifyTokenAdm, (req, res) => {
  models.produtos
    .findById(req.params.id)
    .then(produto => {
      produto.update({
        descricao: req.body.descricao
      })
      .then(produtoEditado => {
          res.status(200).json(produtoEditado);
      })
      .catch(err => { res.status(400).send(err) })
  })
  .catch(err => { res.status(400).send(err) })
});

// DELETAR ok
router.delete("/:id",verifyTokenAdm, (req, res) => {
  models.produtos
    .findById(req.params.id)
    .then(produto => {
      produto.destroy().then(deleted => {
        res.status(200).json(deleted);
      }) 
      .catch(err => { res.status(400).send(err) })
    })
    .catch(err => { res.status(400).send(err) })
});

module.exports = router;
