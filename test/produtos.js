process.env.NODE_ENV = 'test'

var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../app.js');
var should = chai.should();
var Produtos = require('../models').produtos;

chai.use(chaiHttp);

describe('Teste rotas produtos', function() {

    beforeEach(function(done) {
        Produtos.destroy({where: {}}).then(() => { done() });
    });

    it('Deve retornar todos os produtos', function(done) {
        chai.request(server)
        .get('/produtos')
        .end(function(error, res) {
            res.should.have.status(200);
            res.body.should.be.a('array');
            res.body.length.should.be.eql(0);
            done();
        });
    });

    it('Deve retornar o POST do produto criado', function(done) {
 
        var produto = {
            siorg: 12345,
            descricao: 'Produto teste'
        }

        chai.request(server)
        .post('/produtos')
        .send(produto)
        .end(function(error, res) {
            res.should.have.status(201);
            res.body.should.be.a('object');
            res.body.should.have.property('siorg').eql(12345);
            res.body.should.have.property('descricao').eql('Produto teste');
            done();
        });
    });

    it('Deve retornar um produto dado o siorg', function(done) {

        Produtos.create({
            siorg: 12345,
            descricao: 'Produto teste'
        }).then(produto => {
            chai.request(server)
            .get('/produtos/' + produto.siorg)
            .end(function(error, res) {
               res.should.be.a('object');
               res.body.should.have.property('siorg').eql(12345);
               res.body.should.have.property('descricao').eql('Produto teste');;
               done();
            })
        });
    });

    it('Deve atualizar um produto e retorna-lo dado o siorg', function(done){
        Produtos.create({
            siorg: 12345,
            descricao: 'Produto teste'
        }).then(produto => {
                chai.request(server)
                .put('/produtos/' + produto.siorg)
                .send({siorg: 12345, descricao: "produto editado"})
                .end(function(error, res){
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('descricao').eql('produto editado');
                    res.body.should.have.property('siorg').eql(12345);
                    done();
                });
        });
    });

    it('Deve excluir um produto dado o id', function(done){
        Produtos.create({
            siorg: 12345,
            descricao: 'Produto teste'
        }).then(produto => {
                chai.request(server)
                .delete('/produtos/' + produto.siorg)
                .end(function(error, res){
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('siorg').eql(12345);
                  done();
            });
        });
    });
});