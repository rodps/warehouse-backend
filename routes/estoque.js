var express = require("express");
var router = express.Router();
var db = require("../models");
const moment = require('moment');
var Sequelize = require("sequelize");
const Op = Sequelize.Op;
var env = process.env.NODE_ENV || "development";
var config = require("../config/config.json")[env];
var sequelize = new Sequelize(config);

// RETORNAR UMA LISTA DE SOLICITACOES COM STATUS REQUISTADO
router.get("/requisitado", (req, res) => {

    db.solicitacao_requisicao
        .findAll({
            include: [{
                model: db.solicitacoes,
                where: { id: Sequelize.col('solicitacao_id'), status: "REQUISITADO" }
            }, {
                model: db.requisicoes,
                where: { id: Sequelize.col('requisicao_id') }
            }],
        })
        .then(solicitacoes => {
            let lista = [];
            solicitacoes.forEach(function (element) {
                lista.push({
                    descricao: element.solicitaco.descricao,
                    solicitacao_id: element.solicitaco.id,
                    requisicao_data: moment(element.requisico.createdAt).format('ll'),
                    quantidade: element.solicitaco.quantidade,
                    requisicao_id: element.requisico.id,
                    produto_id: element.solicitaco.siorg
                })

            });
            res.status(200).json(lista);
        })

});


//Rota para listar produtos em estoque 

router.get("/emprestimo", (req, res) => {
    sequelize.query(
        'SELECT *  FROM movimentacoes as m, produtos as p '+ 
            'where m.id in '+
             '(select max(id) as id from database_development.movimentacoes as m2 where m2.produto_id = m.produto_id) '+
            ' and m.produto_id = p.siorg',
             { type: sequelize.QueryTypes.SELECT}
        ).then(produtos =>{
            res.send(produtos)
        }).catch(err => {
            res.status(400).send("Erro ao tentar listar produtos "+ err)
        })

        
})



//emprestar produto
router.post("/emprestimo", (req, res) => {
    var saida = {}
    db.movimentacoes.findAll({
        where: { produto_id: req.body.produto_id },
        order: Sequelize.literal('id DESC')
    }).then(produtos => {
        if (produtos.length > 0) {

            saida = {
                local: "Em estoque",
                quantidade_atual: produtos[0].quantidade_atual - req.body.quantidade,
                quantidade_lancamento: 0,
                quantidade_anterior: produtos[0].quantidade_atual,
                produto_id: req.body.produto_id,
                tipo: "SAIDA"
            }
            db.movimentacoes.create(saida)
            
        }
    })

});


//DAR ENTRADA NO PRODUTO NO ESTOQUE
router.post("/", (req, res) => {
    var entrada = {}
    db.movimentacoes.findAll({
        where: { produto_id: req.body.produto_id },
        order: Sequelize.literal('id DESC')
    }).then(produtos => {
        if (produtos.length > 0) {

            entrada = {
                local: "Em estoque",
                quantidade_atual: produtos[0].quantidade_atual + req.body.quantidade,
                quantidade_lancamento: req.body.quantidade,
                quantidade_anterior: produtos[0].quantidade_atual,
                produto_id: req.body.produto_id,
                tipo: "ENTRADA"
            }
        } else {

            entrada = {
                local: "Em estoque",
                quantidade_atual: req.body.quantidade,
                quantidade_lancamento: req.body.quantidade,
                quantidade_anterior: 0,
                produto_id: req.body.produto_id,
                tipo: "ENTRADA"
            }
            console.log(entrada)

        }

        db.movimentacoes.create(entrada).then(estoque => {
            db.solicitacoes.update({
                status: "COMPRADO",
            }, {
                    where: {
                        id: req.body.solicitacao_id
                    }
                }).then(() => {
                    console.log('atualizado');
                    res.status(201).json(estoque);
                })

        }).catch(err => {
            res.status(400).send("ocorreu um erro na inserção" + err)
        })
    }).catch(err => {
        res.status(400).send("ocorreu um erro na busca" + err)
    }
        )

});








/**
 * Estoque
 */



// router.get("/", (req, res) => {

//     db.sequelize.query(
//         "SELECT * " +
//         "FROM movimentacoes as m1 " +
//         "WHERE m1.createdAt = " +
//         "( SELECT MAX(createdAt) " +
//         "FROM movimentacoes as m2 " +
//         "WHERE m2.id = m1.id )", {
//             type: sequelize.QueryTypes.SELECT
//         }
//     ).then(estoque => {
//         res.status(200).send(estoque);
//     }).catch(err => {
//         res.status(400).send(err);
//     });
// });

// /** 
//  * Movimentacões
//  * 
//  * Formato POST:
//  * {
//  *   id: 1, //da movimentacao anterior (o que esta no estoque)
//  *   local: e001,
//  *   quantidade: -3,
//  *   defeito: false,
//  * }
//  * 
//  */
// router.post("/", (req, res) => {

//     req.body.forEach(nova_movimentacao => {
//         db.movimentacoes
//             .findById(nova_movimentacao.id)
//             .then(movimentacao => {
//                 db.movimentacoes
//                     .create({
//                         local: nova_movimentacao.local,
//                         quantidade_atual: movimentacao.quantidade_total,
//                         quantidade_saida: nova_movimentacao.quantidade,
//                         quantidade_total: movimentacao.quantidade_total + nova_movimentacao.quantidade,
//                         defeito: nova_movimentacao.defeito,
//                         num_produto: movimentacao.num_produto
//                     })
//                     .then(movimentacao_criada => {
//                         res.status(201).send(movimentacao_criada);
//                     })
//                     .catch(err => {
//                         res.status(400).send(err);
//                     });
//             });
//     });

// });


module.exports = router;