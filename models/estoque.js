function associate(models){
    const {
        estoque,
        solicitacoes,
        orcamentos
    } = models;
    estoque.belongsTo(solicitacoes, { foreignKey:'solicitacao_id' });
    estoque.belongsTo(orcamentos, { foreignKey:'orcamento_id' });
    estoque.belongsTo(estoque, {foreignKey:'estoque_pai'});
}

module.exports = function(sequelize , DataTypes){
    var estoque = sequelize.define('estoque', {
        quantidade: DataTypes.INTEGER,
        codigo: DataTypes.STRING,
        emprestimo: DataTypes.BOOLEAN
    });

    estoque.associate = associate;
    return estoque;
}