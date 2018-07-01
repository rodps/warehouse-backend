var express = require("express");
var router = express.Router();
var db = require("../models");
const moment = require('moment');
var Sequelize = require("sequelize");
const Op = Sequelize.Op;
var env = process.env.NODE_ENV || "development";
var config = require("../config/config.json")[env];
var sequelize = new Sequelize(config);
const verifyToken = require("../middleware/index").verifyToken;




router.get('/devolucao', verifyToken, (req, res) => {
    db.movimentacoes.findAll({
        where: {
            usuario_id: req.dados.usuario.id
        }
    }).then(devolucao => {
        res.status(200).send(devolucao)
    }).catch(err => {
        res.status(400).send(err)
    })
})




// RETORNAR UMA LISTA DE SOLICITACOES COM STATUS REQUISTADO "FUNCIONANDO"

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

//DAR  BAIXA NO PRODUTO NO ESTOQUE
router.post("/", (req, res) => {
    //se é um produto unico entao lancar quantidade 1 por 1 com
    let p = req.body;

    if (p.unico) {
        
        let produto = {
            orcamento_id: p.orcamento_id,
            solicitacao_id: p.solicitacao_id,
            quantidade: 1,
            emprestimo: 0
        }
        for (var index = 0; index < p.quantidade; index++) {
            
            db.estoque.create(produto).then(sucess => {
                console.log("Solicitacao única inserida " + sucess)
            }).catch(err => {
                console.log("Não foi possivel inserir o produto" + produto)
                res.status(400).send("Erro na inserção de Produtos unicos:  " + err)
            })
        }
    } else {
    
        let produto = {
            orcamento_id: p.orcamento_id,
            solicitacao_id: p.solicitacao_id,
            quantidade: p.quantidade,
            emprestimo : 1

        }
        console.log(produto)
        db.estoque.create(produto).then(sucess => {
            console.log("Solicitacao inserida " + sucess)

        }).catch(err => {
            //console.log("Não foi possivel inserir o produto montao" + produto)
            res.status(400).send("Erro na inserção de Produtos:  " + err)
        })

    }
    //VERIFICA SE JÁ CHEGOU TODOS OS CHEGOU
    db.solicitacoes.findById(p.solicitacao_id).then(quantidadesol => {
        if (quantidadesol.quantidade - p.quantidade == 0) {
            db.solicitacoes.update({
                status: "COMPRADO",
                quantidade: 0
            }, {
                    where: { id: quantidadesol.id }
                }
            )
        } else {
            db.solicitacoes.update({
                quantidade: quantidadesol.quantidade - p.quantidade
            }, {
                    where: { id: quantidadesol.id }
                }
            )
        }
    }).catch(error => {
        res.status(400).send(error)
    })

    res.status(201).send("Brasil")
});


// //Rota para listar produtos em estoque 
// router.get("/emprestimo", (req, res) => {
//     sequelize.query(
//         'SELECT *  FROM movimentacoes as m, solicitacoes as s '+ 
//             'where m.id in '+
//              '(select max(id) as id from database_development.movimentacoes as m2 where m2.solicitacao_id = m.solicitacao_id) '+
//             ' and m.produto_id = p.siorg',
//              { type: sequelize.QueryTypes.SELECT}
//         ).then(produtos =>{
//             res.send(produtos)
//         }).catch(err => {
//             res.status(400).send("Erro ao tentar listar produtos "+ err)
//         })


// })



// //emprestar produto
// router.post("/emprestimo", (req, res) => {
//     var saida = {}
//     db.movimentacoes.findAll({
//         where: { produto_id: req.body.produto_id },
//         order: Sequelize.literal('id DESC')
//     }).then(produtos => {
//         if (produtos.length > 0) {

//             saida = {
//                 local: "Em estoque",
//                 quantidade_atual: produtos[0].quantidade_atual - req.body.quantidade,
//                 quantidade_lancamento: 0,
//                 quantidade_anterior: produtos[0].quantidade_atual,
//                 produto_id: req.body.produto_id,
//                 tipo: "SAIDA"
//             }
//             db.movimentacoes.create(saida)

//         }
//     })

// });


//DAR ENTRADA NO PRODUTO NO ESTOQUE



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