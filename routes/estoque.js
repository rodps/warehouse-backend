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




router.get("/", (req, res) => {

    sequelize.query(
        ' select produto.descricao as descricao, e.id as estoqueId , m.quantidade_atual as quantidade ' +
        'from (((database_development.movimentacoes as m ' +
        'inner join database_development.estoques as e on m.estoque_id = e.id) ' +
        'inner join database_development.solicitacoes as sol on sol.id = e.solicitacao_id) ' +
        'inner join database_development.produtos as produto on produto.siorg = sol.siorg) ' +
        'where m.id = (select MAX(id) ' +
        'from database_development.movimentacoes as m2 ' +
        ' where m2.estoque_id = m.estoque_id) and m.quantidade_atual > 0 and e.emprestimo = 1;', {
            type: sequelize.QueryTypes.SELECT
        }
    ).then(estoque => {

        res.status(200).send(estoque);
    }).catch(err => {
        res.status(400).send(err);
    });
});




router.get('/devolucao', (req, res) => {

    sequelize.query(

        'select   n.IdProduto as IdProduto, sum(n.Saidas) as Saidas , usuario_id , nome,descricao  ' +
        'from ' +
        '(SELECT m.estoque_id as IdProduto, sum(m.quantidade_lancamento) as Saidas , m.tipo as tipo, m.usuario_id , u.nome,pro.descricao  ' +
        'FROM database_development.movimentacoes as m inner join database_development.usuarios as u on m.usuario_id = u.id  ' +
        'inner join database_development.estoques as e on e.id = m.estoque_id  ' +
        'inner join database_development.solicitacoes as sol on sol.id = e.solicitacao_id ' +
        'inner join database_development.produtos as pro on sol.siorg = pro.siorg  ' +
        'where m.tipo = "SAIDA"  ' +
        'group by m.usuario_id , m.estoque_id  ' +
        'having m.usuario_id  ' +
        'UNION  ' +
        'SELECT m2.estoque_id as IdProduto, sum(m2.quantidade_lancamento) as Saidas , m2.tipo as tipo,m2.usuario_id, u.nome,pro.descricao  ' +
        'FROM database_development.movimentacoes as m2 inner join database_development.usuarios as u on m2.usuario_id = u.id  ' +
        'inner join database_development.estoques as e on e.id = m2.estoque_id  ' +
        'inner join database_development.solicitacoes as sol on sol.id = e.solicitacao_id  ' +
        'inner join database_development.produtos as pro on sol.siorg = pro.siorg ' +
        'where m2.tipo = "ENTRADA" ' +
        'group by m2.usuario_id ,m2.estoque_id  ' +
        'having m2.usuario_id ) as n ' +
        ' group by n.IdProduto , usuario_id having Saidas != 0 '
        , { type: sequelize.QueryTypes.SELECT }).then(listar => {

            for (let index = 0; index < listar.length; index++) {
                if (listar[index].Saidas < 0) {
                    listar[index].Saidas *= -1;
                }

            }

            res.status(200).send(listar)

        })

})

router.get("/historicoUsuario", verifyToken, (req, res) => {
    sequelize.query(
        'select p.descricao as descricao,tipo as tipo,data_movimentacao as data,m.quantidade_lancamento as quantidade,m.id as id ' +
        'from database_development.movimentacoes m inner join database_development.estoques e on m.estoque_id = e.id ' +
        'inner join database_development.solicitacoes as s on e.solicitacao_id = s.id ' +
        'inner join database_development.produtos as p on s.siorg = p.siorg ' +
        'where m.usuario_id = ' + req.dados.usuario.id
        , { type: sequelize.QueryTypes.SELECT }).then(listar => {
            res.status(200).send(listar)
        }).catch (err => {
            res.status(400).send(err);
        })
})

//devolver produto
router.post("/devolucao", verifyToken, (req, res) => {
    var entrada = {}
    db.movimentacoes.findAll({
        where: { estoque_id: req.body.estoque_id },
        order: Sequelize.literal('id DESC')
    }).then(produtos => {
        if (produtos.length > 0) {

            entrada = {
                quantidade_lancamento: req.body.quantidade,
                quantidade_atual: produtos[0].quantidade_atual + req.body.quantidade,
                quantidade_anterior: produtos[0].quantidade_atual,
                data_movimentacao: Date.now(),
                estoque_id: req.body.estoque_id,
                tipo: "ENTRADA",
                usuario_id: req.body.usuario_id,

            }
            db.movimentacoes.create(entrada).then(saidaRegistrada => {
                res.status(201).send(entrada)
            })

        } else {
            res.status(400).send("Produto nao existe")
        }
    })


});



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
router.post("/", verifyToken, (req, res) => {
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
                let movimentacao = {
                    local: 'Em estoque',
                    quantidade_atual: 1,
                    quantidade_lancamento: 1,
                    quantidade_anterior: 0,
                    data_movimentacao: Date.now(),
                    //usuario_id: req.dados.usuario.id,
                    estoque_id: sucess.id
                }
                db.movimentacoes.create(movimentacao).then(movimentacao => {
                    console.log("Inserido na movimentação" + movimentacao)
                }).catch(err => {
                    console.log(err);
                })
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
            emprestimo: 1

        }
        db.estoque.create(produto).then(sucess => {
            console.log("Solicitacao inserida " + sucess)
            let movimentacao = {
                local: 'Em estoque',
                quantidade_atual: sucess.quantidade,
                quantidade_lancamento: sucess.quantidade,
                quantidade_anterior: 0,
                data_movimentacao: Date.now(),
                //usuario_id: req.dados.usuario.id,
                estoque_id: sucess.id,
                tipo: "ENTRADA"
            }
            db.movimentacoes.create(movimentacao).then(movimentacao => {
                console.log("Inserido na movimentação" + movimentacao)
            }).catch(err => {
                console.log(err);
            })


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

//emprestar produto
router.post("/emprestimo", verifyToken, (req, res) => {
    var saida = {}
    db.movimentacoes.findAll({
        where: { estoque_id: req.body.estoque_id },
        order: Sequelize.literal('id DESC')
    }).then(produtos => {
        if (produtos.length > 0) {

            saida = {
                local: req.body.local,
                quantidade_lancamento: req.body.quantidade * -1,
                quantidade_atual: produtos[0].quantidade_atual + req.body.quantidade * -1,
                quantidade_anterior: produtos[0].quantidade_atual,
                data_movimentacao: Date.now(),
                estoque_id: req.body.estoque_id,
                tipo: "SAIDA",
                usuario_id: req.dados.usuario.id,

            }
            db.movimentacoes.create(saida).then(saidaRegistrada => {
                res.status(201).send(saida)
            })

        } else {
            res.status(400).send("Produto nao existe")
        }
    })

});


//DAR ENTRADA NO PRODUTO NO ESTOQUE


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
//Rota para listar produtos em estoque 
// router.get("/emprestimo", (req, res) => {
//     // sequelize.query(


//     //     'select s.siorg,s.descricao ,sum(e.quantidade) as quantidade ' +
//     //     'from  database_development.estoques as e ' +
//     //     'inner join  database_development.solicitacoes as s on s.id = e.solicitacao_id ' +
//     //     'where emprestimo = 0 ' +
//     //     'group by s.siorg; ',

//     //     { type: sequelize.QueryTypes.SELECT }

//     }).then(produtos => {
//         res.send(produtos)
//     }).catch(err => {
//         res.status(400).send("Erro ao tentar listar produtos " + err)
//     })


// })

// select idProduto , sum(s.Saidas) as emprestado
// from (
// SELECT m.estoque_id as IdProduto, sum(m.quantidade_lancamento) as Saidas , m.tipo as tipo
// FROM database_development.movimentacoes as m
// where m.tipo = "SAIDA"
// group by m.usuario_id 
// union 
// SELECT m2.estoque_id as IdProduto, sum(m2.quantidade_lancamento) as Saidas , m2.tipo as tipo
// FROM database_development.movimentacoes as m2
// where m2.tipo = "ENTRADA" 
// group by m2.usuario_id 
// ) as s;


// SELECT m.estoque_id as IdProduto, sum(m.quantidade_lancamento) as Saidas , m.tipo as tipo, m.usuario_id
// FROM database_development.movimentacoes as m
// where m.tipo = "SAIDA"
// group by m.usuario_id , m.estoque_id
// having m.usuario_id 
// UNION
// SELECT m2.estoque_id as IdProduto, sum(m2.quantidade_lancamento) as Saidas , m2.tipo as tipo,m2.usuario_id
// FROM database_development.movimentacoes as m2
// where m2.tipo = "ENTRADA" 
// group by m2.usuario_id ,m2.estoque_id
// having m2.usuario_id ;


module.exports = router;