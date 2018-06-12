var express = require("express");
var router = express.Router();
var db = require("../models");

/**
 * Estoque
 */
router.get("/", (req, res) => {

    db.sequelize.query(
        "SELECT * " +
        "FROM movimentacoes as m1 " +
        "WHERE m1.createdAt = " +
        "( SELECT MAX(createdAt) " +
        "FROM movimentacoes as m2 " +
        "WHERE m2.id = m1.id )", {
            type: sequelize.QueryTypes.SELECT
        }
    ).then(estoque => {
        res.status(200).send(estoque);
    }).catch(err => {
        res.status(400).send(err);
    });
});

/** 
 * Movimentacões
 * 
 * Formato POST:
 * {
 *   id: 1, //da movimentacao anterior (o que esta no estoque)
 *   local: e001,
 *   quantidade: -3,
 *   defeito: false,
 * }
 * 
 */
router.post("/", (req, res) => {

    req.body.forEach(nova_movimentacao => {
        db.movimentacoes
            .findById(nova_movimentacao.id)
            .then(movimentacao => {
                db.movimentacoes
                    .create({
                        local: nova_movimentacao.local,
                        quantidade_atual: movimentacao.quantidade_total,
                        quantidade_saida: nova_movimentacao.quantidade,
                        quantidade_total: movimentacao.quantidade_total + nova_movimentacao.quantidade,
                        defeito: nova_movimentacao.defeito,
                        num_produto: movimentacao.num_produto
                    })
                    .then(movimentacao_criada => {
                        res.status(201).send(movimentacao_criada);
                    })
                    .catch(err => {
                        res.status(400).send(err);
                    });
            });
    });

});