function associate(models){
    const {
        produtos_siorg,
        solicitacoes,
        produto_solicitacoes
    } = models;
    produto_solicitacoes.belongsTo(produtos_siorg, { foreignKey:'produto_siorg_id' });
    produto_solicitacoes.belongsTo(solicitacoes, { foreignKey:'solicitacao_id' });
}

module.exports = function(sequelize , DataTypes){
    var produto_solicitacoes = sequelize.define('produto_solicitacoes', {});
    produto_solicitacoes.associate = associate;
    return produto_solicitacoes;
}