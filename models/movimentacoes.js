function associate(models){
    const {
        usuarios,
        estoque,
        movimentacoes
    } = models;
    movimentacoes.belongsTo(usuarios, { foreignKey:'usuario_id' });
    movimentacoes.belongsTo(estoque, { foreignKey:'estoque_id' });
}

module.exports = function(sequelize , DataTypes){
    var movimentacoes = sequelize.define('movimentacoes', {
        local: DataTypes.STRING,
        quantidade_atual: DataTypes.INTEGER,
        quantidade_lancamento: DataTypes.INTEGER,
        quantidade_anterior: DataTypes.INTEGER,
        defeito: DataTypes.DATE,
        data_movimentacao : DataTypes.DATE,
        num_produto: DataTypes.STRING,
        tipo : DataTypes.ENUM(
        "ENTRADA",
        "SAIDA"
      )
    });

    movimentacoes.associate = associate;
    return movimentacoes;
}