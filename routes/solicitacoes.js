var express = require("express");
var router = express.Router();
var models = require("../models");
var Sequelize = require("sequelize");
const isLoggedIn = require("../middleware/index").isLoggedIn;
const verifyToken = require("../middleware/index").verifyToken;


//Validar solicitacoes
router.get("/validar", verifyToken, (req, res) => {

  //ADMINISTRADOR REQUISITA TODAS SOLICITACÕES 
  if (req.dados.usuario.adm) {
    models.solicitacoes
      .findAll({
        include: [{
          model: models.usuarios,
          where: { id: Sequelize.col('usuario_id') },
          attributes: ['nome']
        }],
        where: { [Sequelize.Op.or]: [{ status: "ABERTO" }] }
      })
      .then(solicitacoes => {
        let lista = [];
        solicitacoes.forEach(function (element) {
          lista.push({
            nome: element.usuario.nome,
            descricao: element.descricao,
            status: element.status,
            justificativa: element.justificativa,
            id: element.id,
            data: element.createdAt,
            quantidade: element.quantidade
          })

        });
        res.status(200).json(lista);
      })
  } else { //Não adm
    res.sendStatus(403)
  }
});


// LISTAR ok
router.get("/", verifyToken, (req, res) => {

  //ADMINISTRADOR REQUISITA TODAS SOLICITACÕES 
  if (req.dados.usuario.adm) {
    models.solicitacoes
      .findAll({
        include: [{
          model: models.usuarios,
          where: { id: Sequelize.col('usuario_id') },
          attributes: ['nome']
        }],
        where: { [Sequelize.Op.or]: [{ status: "DESERTO" },{ status: "APROVADO" },{ status: "ABERTO" }], }
      })
      .then(solicitacoes => {
        let lista = [];
        solicitacoes.forEach(function (element) {
          lista.push({
            nome: element.usuario.nome,
            descricao: element.descricao,
            status: element.status,
            justificativa: element.justificativa,
            id: element.id,
            data: element.createdAt
          })

        });
        res.status(200).json(lista);
      })
  } else { //Usuario comun então apenas é mostrado as suas solicitações
    models.solicitacoes
      .findAll({
        include: [{
          model: models.usuarios,
          where: { id: Sequelize.col('usuario_id') },
          attributes: ['nome']
        }],
        where: { usuario_id: req.dados.usuario.id }
      })
      .then(solicitacoes => {
        let lista = [];
        solicitacoes.forEach(function (element) {
          lista.push({
            nome: element.usuario.nome,
            descricao: element.descricao,
            status: element.status,
            justificativa: element.justificativa,
            id: element.id,
            data: element.createdAt
          })

        });
        res.status(200).json(lista);
      })
  }
});

// CRIAR ok
router.post("/", verifyToken, (req, res) => {

  models.solicitacoes
    .create({
      status: "ABERTO",
      descricao: req.body.descricao,
      justificativa: req.body.justificativa,
      quantidade: req.body.quantidade,
      usuario_id: req.dados.usuario.id
    })
    .then(solicitacao => {
      res.status(201).json(solicitacao);
    })
    .catch(err => { res.status(400).send(err) })
});


// LISTAR ORÇAMENTOS ok
router.get("/:id/orcamentos", (req, res) => {
  models.orcamentos
    .findAll({
      where: { solicitacao_id: req.params.id }
    })
    .then(orcamentos => {
      res.status(200).json(orcamentos)
    })
    .catch(err => { res.status(400).send(err) })
});


// LISTAR ok
router.get("/:id", verifyToken, (req, res) => {

  models.solicitacoes
    .findAll({
      include: [{
        model: models.usuarios,
        where: { id: Sequelize.col('usuario_id') },
        attributes: ['nome']
      }],
      where: {id : req.params.id}
    })
    .then(solicitacoes => {
      let lista = [];
      solicitacoes.forEach(function (element) {
        lista.push({
          nome: element.usuario.nome,
          descricao: element.descricao,
          status: element.status,
          justificativa: element.justificativa,
          id: element.id,
          data: element.createdAt
        })

      });
      res.status(200).json(lista);
    })
});

/*
router.get("/", (req, res) => {
  models.solicitacoes
    .findAll({
      where : {usuario_id : req.user.id}
    })
    .then(solicitacoes => {
      res.status(200).json(solicitacoes);
    })
    .catch(err => { res.status(400).send(err) })
});



// MOSTRAR ok
router.get("/:id", (req, res) => {
  models.solicitacoes
    .findAll({
      where: {id: req.params.id},
      include: [{
        model: models.usuarios,
        where: {id: Sequelize.col('usuario_id')}
      }]
    })
    .then(solicitacao => {
      res.status(200).json(solicitacao)
    })
    .catch(err => { res.status(400).send(err) })
});

// EDITAR ok
router.put("/:id", (req, res) => {
  models.solicitacoes
    .findById(req.params.id)
    .then(solicitacao => {
      solicitacao
        .update({
          status: req.body.status,
          descricao: req.body.descricao,
          justificativa: req.body.justificativa,
          quantidade: req.body.quantidade
        })
        .then(solicitacaoEditada => {
          res.status(200).send(solicitacaoEditada);
        })
        .catch(err => { res.status(400).send(err) })
    })
    .catch(err => { res.status(400).send(err) })
});

// DELETAR ok
router.delete('/:id', function(req,res) { 
  models.solicitacoes
    .findById(req.params.id)
    .then(solicitacao => {
      solicitacao.destroy()
        .then(destroyed => {
          res.status(200).json(destroyed);
        })
        .catch(err => { res.status(400).send(err) })
    })
    .catch(err => { res.status(400).send(err) })
});

// LISTAR ORÇAMENTOS ok
router.get("/:id/orcamentos", (req, res) => {
  models.orcamentos
    .findAll({
      where: {solicitacao_id: req.params.id}
    })
    .then(orcamentos => { 
      res.status(200).json(orcamentos) 
    })
    .catch(err => { res.status(400).send(err) })
});

// CRIAR ORÇAMENTO ok
router.post("/:id/orcamentos", (req, res) => {
  models.orcamentos
    .create({
      origem: req.body.origem,
      valor: req.body.valor,
      cnpj_fornecedor: req.body.cnpj_fornecedor,
      nome_fornecedor: req.body.nome_fornecedor,
      solicitacao_id: req.params.id
    })
    .then(orcamento => {
      res.status(201).json(orcamento)
    })
    .catch(err => { res.status(400).send(err) })
});

// REMOVER ORÇAMENTO ok
router.delete("/:id/orcamentos/:idOrcamento", (req, res) => {
  models.orcamentos
    .findById(req.params.idOrcamento)
    .then(orcamento => {
      orcamento.destroy()
        .then(destroyed => {
          res.status(200).json(orcamento)
        })
        .catch(err => { res.status(400).send(err) })
    })
  .catch(err => { res.status(400).send(err) })
});
*/

module.exports = router;
