function associate(models){
    const {
        solicitacoes,
        estoque
    } = models;
    estoque.belongsTo(solicitacoes, { foreignKey:'solicitacao_id' });
}

module.exports = function(sequelize , DataTypes){
    var estoque = sequelize.define('estoque', {
        numero_produto: DataTypes.STRING,
    });

    estoque.associate = associate;
    return estoque;
}