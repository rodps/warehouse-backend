var express = require("express");
var router = express.Router();
var models = require("../models");
const verifyToken = require("../middleware/index").verifyToken;

// listar

<<<<<<< HEAD
router.get("/:idSolicitacao", verifyToken, function(req, res) {
=======
router.get("/:idSolicitacao", function(req, res) {
>>>>>>> master
  models.orcamentos
    .findAll({
      where: { solicitacao_id: req.params.idSolicitacao }
    })
    .then(orcamentos => {
<<<<<<< HEAD
      res.status(200).json(orcamentos);
=======
      res.status(201).send(orcamentos);
>>>>>>> master
    })
    .catch(err => {
      res.status(400).send(err);
    });
});

//criar
router.post("/:idSolicitacao", (req, res) => {
<<<<<<< HEAD
  //var orcamentos = req.body;
  // console.log(orcamentos);
  console.log(req.body.id);
  if (!req.body.id) {
=======
  if (req.body.id) {
    models.orcamentos.findById(req.body.id).then(orcamento => {
      orcamento
        .update({
          origem: req.body.origem,
          valor: req.body.valor,
          cnpj_fornecedor: req.body.cnpj_fornecedor,
          nome_fornecedor: req.body.nome_fornecedor,
          solicitacao_id: req.params.idSolicitacao
        })
        .then(() => {
          res.status(200).send("ok");
        })
        .catch(err => {
          res.status(400).send(err);
        });
    });
  } else {
>>>>>>> master
    models.orcamentos
      .create({
        origem: req.body.origem,
        valor: req.body.valor,
        cnpj_fornecedor: req.body.cnpj_fornecedor,
        nome_fornecedor: req.body.nome_fornecedor,
        solicitacao_id: req.params.idSolicitacao
      })
<<<<<<< HEAD
      .then(response => {
        res.status(201).json(response);
=======
      .then(() => {
        res.status(200).send("ok");
>>>>>>> master
      })
      .catch(err => {
        res.status(400).send(err);
      });
<<<<<<< HEAD
  } else {
    models.orcamentos.findById(req.body.id).then(orcamento => {
      orcamento
        .update({
          origem: req.body.origem,
          valor: req.body.valor,
          cnpj_fornecedor: req.body.cnpj_fornecedor,
          nome_fornecedor: req.body.nome_fornecedor
        })
        .then(response => {
          res.status(200).json(response);
        })
        .catch(err => {
          res.status(400).send(err);
        });
    });
=======
>>>>>>> master
  }
});

//excluir
router.delete("/:id", function(req, res) {
  models.orcamentos
    .destroy({
      where: { id: req.params.id }
    })
    .then(() => {
      res.status(201).send("EXCLUIDO");
    })
    .catch(err => {
      res.status(400).send(err);
    });
});

module.exports = router;
