module.exports = function(sequelize, DataTypes) {
  var usuarios = sequelize.define("usuarios", {
    nome: DataTypes.STRING,
    senha: DataTypes.STRING,
    email: DataTypes.STRING,
    departamento: DataTypes.STRING,
    adm: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    verificado: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  });

  return usuarios;
};
