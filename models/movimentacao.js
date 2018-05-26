function associate(models){
    const {
        usuarios,
        estoque,
        movimentacao
    } = models;
    movimentacao.belongsTo(usuarios, { foreignKey:'usuario_id' });
    movimentacao.belongsTo(estoque, { foreignKey:'estoque_id' });
}

module.exports = function(sequelize , DataTypes){
    var movimentacao = sequelize.define('movimentacao', {
        local: DataTypes.STRING,
        quantidade_atual: DataTypes.INTEGER,
        quantidade_saida: DataTypes.INTEGER,
        quantidade_total: DataTypes.INTEGER,
        defeito: DataTypes.DATE
    });

    movimentacao.associate = associate;
    return movimentacao;
}