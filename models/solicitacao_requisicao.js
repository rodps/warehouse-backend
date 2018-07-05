function associate(models){
    const {
        requisicoes,
        solicitacoes,
        solicitacao_requisicao
    } = models;
    solicitacao_requisicao.belongsTo(requisicoes, { foreignKey:'requisicao_id'});
    solicitacao_requisicao.belongsTo(solicitacoes, { foreignKey:'solicitacao_id' });
}

module.exports = function(sequelize , DataTypes){
    var solicitacao_requisicao = sequelize.define('solicitacao_requisicao', {
        removido: DataTypes.BOOLEAN
    });

    solicitacao_requisicao.associate = associate;
    return solicitacao_requisicao;
}