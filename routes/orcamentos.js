var express = require("express");
var router = express.Router();
var models = require("../models");

// listar

router.get('/:idSolicitacao', function (req, res) {

    models.orcamentos.findAll({
        where: { solicitacao_id: req.params.idSolicitacao }
    }).then((orcamentos) => {
        res.status(201).send(orcamentos);
    })
        .catch(err => { res.status(400).send(err) })

});


//criar
router.post("/:idSolicitacao", (req, res) => {
    //var orcamentos = req.body;
   // console.log(orcamentos);
    models.orcamentos.create({
        origem: req.body.orcamento.origem,
        valor: req.body.orcamento.valor,
        cnpj_fornecedor: req.body.orcamento.cnpj_fornecedor,
        nome_fornecedor: req.body.orcamento.nome_fornecedor,
        solicitacao_id: req.params.idSolicitacao
    }).then(() => {
        res.status(200).send("ok");
    }).catch(err => {
        res.status(400).send(err);
    })

});

//excluir
router.delete('/:id', function (req, res) {

    models.orcamentos.destroy({
        where: { id: req.params.id }
    }).then(() => {
        res.status(201).send("EXCLUIDO");
    })
        .catch(err => { res.status(400).send(err) })

});


module.exports = router;