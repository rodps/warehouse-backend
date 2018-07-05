var express = require("express");
var router = express.Router();
var models = require("../models");
const verifyToken = require("../middleware/index").verifyToken;

// listar

router.get("/:idSolicitacao", verifyToken, function(req, res) {
  models.orcamentos
    .findAll({
      where: { solicitacao_id: req.params.idSolicitacao }
    })
    .then(orcamentos => {
      res.status(200).json(orcamentos);
    })
    .catch(err => {
      res.status(400).send(err);
    });
});

//criar
router.post("/:idSolicitacao", (req, res) => {
  //var orcamentos = req.body;
  // console.log(orcamentos);

  if (!req.body.id) {
    models.orcamentos
      .create({
        origem: req.body.origem,
        valor: req.body.valor,
        cnpj_fornecedor: req.body.cnpj_fornecedor,
        nome_fornecedor: req.body.nome_fornecedor,
        solicitacao_id: req.params.idSolicitacao
      })
      .then(response => {
        res.status(201).json(response);
      })
      .catch(err => {
        res.status(400).send(err);
      });
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
