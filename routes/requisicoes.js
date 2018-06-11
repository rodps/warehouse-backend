var express = require('express');
var router = express.Router();
var models = require("../models");
var Sequelize = require('sequelize');
const Op = Sequelize.Op;
//const isLoggedInAdm = require("../middleware/index").isLoggedInAdm;
const verifyTokenAdm = require("../middleware/index").verifyTokenAdm;
const moment = require('moment');

// LISTAR ok
router.get("/", verifyTokenAdm, (req, res) => {
    models.requisicoes
        .findAll({
            include: [{
                model: models.usuarios,
                where: { id: Sequelize.col('usuario_id') },
                attributes: ['nome']
            }],
            where: { status: 'VALIDA' }
        })
        .then(requisicoes => {
            let lista = [];
            requisicoes.forEach(function (element) {
                lista.push({
                    solicitante: element.usuario.nome,
                    nome: element.nome,
                    numero: element.numero,
                    id: element.id,
                    data: moment(element.createdAt).format('ll')
                })

            });
            res.status(200).json(lista);
        })
        .catch(err => { res.status(400).send(err) })
});

// CRIAR ok
router.post("/", verifyTokenAdm, (req, res) => {
    console.log("entrei")
    models.requisicoes.create({ usuario_id: req.dados.usuario.id, status: "VALIDA", nome: req.body.nome, numero: "Não Definido" }).then((_requisicao) => {
        let id_requisicao = _requisicao.id;
        let lista = []
        req.body.solicitacoes.forEach(function (idSolicitacoes) {
            lista.push({
                requisicao_id: id_requisicao,
                solicitacao_id: idSolicitacoes,
            })
        });
        models.solicitacao_requisicao.bulkCreate(lista).then((lista) => {
            res.status(201).send("Requisicao criada");

        }).catch(ex => {
            res.status(400).send('Não foi possível associar a solicitação com a requisicão ' +
                'no banco de dados.');
        })
    }).catch(ex => {
        console.error(ex);
        res.status(400).send('Não foi possível incluir a requisicao ' +
            'no banco de dados.');
    });

    models.solicitacoes.update({
        status: "REQUISITADO",
    }, {
            where: {
                id: {
                    [Op.in]: req.body.solicitacoes
                }
            }
        }).then(() => {
            console.log('atualizado');
        })
});

// MOSTRAR ok
router.get("/:id", (req, res) => {
    models.solicitacao_requisicao
        .findAll({
            include: [{
                model: models.solicitacoes,
                where: { id: Sequelize.col('requisicao_id') },
                include: [{
                    model: models.usuarios,
                    where: { id: Sequelize.col('usuario_id') },
                    attributes: ['nome']
                }],
            }],
            where: { requisicao_id: req.params.id }
        })
        .then(solicitacoes => {
            let lista = [];
            var i;
            for (i = 0; i < solicitacoes.length; i++) {
                lista.push({
                    nome: solicitacoes[i].solicitaco.usuario.nome,
                    descricao: solicitacoes[i].solicitaco.descricao,
                    status: solicitacoes[i].solicitaco.status,
                    justificativa: solicitacoes[i].solicitaco.justificativa,
                    id: solicitacoes[i].solicitaco.id,
                    data:moment(solicitacoes[i].solicitaco.createdAt).format('ll')

                })
            }
            res.status(200).json(lista);
            //res.status(200).json(solicitacoes[0]);
        })
        .catch(err => { res.status(400).send(err) })
});

//RETORNAR O NUMERO DA REQUISICAO

router.get("/numero/:id", (req, res) => {
    models.requisicoes.findById(req.params.id)
        .then(num => {
            let numero = num.numero
            res.status(200).json(numero);
        }).catch(err => {
            res.status(400).send(err)
        })
});


// EDITAR ok
router.put("/:id", (req, res) => {
    models.requisicoes
        .findById(req.params.id)
        .then(requisicao => {
            requisicao.update({
                //nome: req.body.nome,
                numero: req.body.numero
            }).then(updated => {
                res.status(200).json(updated)
            })
                .catch(err => { res.status(400).send(err) })
        })
        .catch(err => { res.status(400).send(err) })
});

// DELETAR ok
router.delete("/:id", (req, res) => {
    models.requisicoes
        .findById(req.params.id)
        .then(requisicao => {
            requisicao.destroy().then(destroyed => {
                res.status(200).json(requisicao);
            })
                .catch(err => { res.status(400).send(err) })
        })
        .catch(err => { res.status(400).send(err) })
});

// ADD SOLICITAÇÃO(ÕES) ok

/*
router.post("/:id/solicitacoes", (req, res) => {
    let lista = []
    let solicitacoes = req.body.solicitacoes;
    solicitacoes.forEach(solicitacao_id => {
        lista.push({
            requisicao_id: req.params.id,
            solicitacao_id: solicitacao_id,
        })
    })
    models.solicitacao_requisicao
        .bulkCreate(lista)
        .then(adds => {
            res.status(201).json(adds);
        })
        .catch(err => { res.status(400).send(err) })
});
*/
// REMOVER SOLICITAÇÃO ok mas tem que arrumar.
// acho q vai ficar dificil excluir pelo id da tabela de solicitacao_requisicao
// tem q fazer outro select
/*
router.delete("/:id/solicitacoes/:idSolicitacaoRequisicao", (req, res) => {
    models.solicitacao_requisicao
        .findById(req.params.idSolicitacaoRequisicao)
        .then(solicitacao => {
            solicitacao.destroy().then(destroyed => {
                res.status(200).json(destroyed);
            })
                .catch(err => { res.status(400).send(err) })
        })
        .catch(err => { res.status(400).send(err) })
})
*/
router.delete('/excluir/solicitacao/:id', function (req, res) {
    models.solicitacoes.update({
        status: "APROVADO",
    }, {
            where: {
                id: req.params.id
            }
        }).then(() => {
            console.log('Status ATUALIZADO');
        })

    models.solicitacao_requisicao.destroy({
        where: { solicitacao_id: req.params.id }
    }).then(() => {
        console.log('solicitacao _ requisicao remolvida');
    })
    res.status(201).send("Solicitacao remolvida");
});

module.exports = router;