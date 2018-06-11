module.exports = function(sequelize , DataTypes){
    var produtos = sequelize.define('produtos', {
        siorg: {
            type:DataTypes.INTEGER,
            primaryKey: true,
        },
        descricao: DataTypes.STRING(1024)
    });

    return produtos;
}