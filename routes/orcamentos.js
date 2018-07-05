var express = require("express");
var router = express.Router();
var models = require("../models");

// listar

router.get("/:idSolicitacao", function(req, res) {
  models.orcamentos
    .findAll({
      where: { solicitacao_id: req.params.idSolicitacao }
    })
    .then(orcamentos => {
      res.status(201).send(orcamentos);
    })
    .catch(err => {
      res.status(400).send(err);
    });
});

//criar
router.post("/:idSolicitacao", (req, res) => {
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
    models.orcamentos
      .create({
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
