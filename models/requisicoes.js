function associate(models){
    const {
        usuarios,
        requisicoes
    } = models;
    requisicoes.belongsTo(usuarios, { foreignKey:'usuario_id' });
}

module.exports = function(sequelize , DataTypes){
    var requisicoes = sequelize.define('requisicoes', {
        numero: DataTypes.STRING(50),
        nome: DataTypes.STRING,
        status: DataTypes.ENUM('VALIDA','INVALIDA'),       
    });

    requisicoes.associate = associate;
    return requisicoes;
}