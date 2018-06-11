function associate(models){
    const {
        usuarios,
        produtos,
        movimentacoes
    } = models;
    movimentacoes.belongsTo(usuarios, { foreignKey:'usuario_id' });
    movimentacoes.belongsTo(produtos, { foreignKey:'siorg' });
}

module.exports = function(sequelize , DataTypes){
    var movimentacoes = sequelize.define('movimentacoes', {
        local: DataTypes.STRING,
        quantidade_atual: DataTypes.INTEGER,
        quantidade_saida: DataTypes.INTEGER,
        quantidade_total: DataTypes.INTEGER,
        defeito: DataTypes.DATE,
        num_produto: DataTypes.STRING
    });

    movimentacoes.associate = associate;
    return movimentacoes;
}