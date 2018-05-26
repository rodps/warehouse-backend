module.exports = function(sequelize , DataTypes){
    var produtos_siorg = sequelize.define('produtos_siorg', {
        siorg: {
            type:DataTypes.INTEGER,
            primaryKey: true,
        },
        descricao: DataTypes.STRING(1024)
    });

    return produtos_siorg;
}