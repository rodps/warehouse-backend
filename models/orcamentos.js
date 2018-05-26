function associate(models){
    const {
        solicitacoes,
        orcamentos
    } = models;
    orcamentos.belongsTo(solicitacoes, { foreignKey:'solicitacao_id', onDelete: 'cascade'});
}

module.exports = function(sequelize , DataTypes){
    var orcamentos = sequelize.define('orcamentos', {
        origem: DataTypes.STRING,
        valor: DataTypes.FLOAT,
        cnpj_fornecedor: DataTypes.STRING,
        nome_fornecedor: DataTypes.STRING,
    });

    orcamentos.associate = associate;
    return orcamentos;
}