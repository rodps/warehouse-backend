function associate(models) {
  const { usuarios, solicitacoes, produtos } = models;
  solicitacoes.belongsTo(usuarios, { foreignKey: "usuario_id" });
  solicitacoes.belongsTo(produtos, { foreignKey: "siorg" });
}

module.exports = function(sequelize, DataTypes) {
  var solicitacoes = sequelize.define("solicitacoes", {
      descricao: DataTypes.STRING(2048),
      status: DataTypes.ENUM(
        "ABERTO",
        "APROVADO",
        "REQUISITADO",
        "COMPRADO",
        "DESERTO",
        "CANCELADO"
      ),
      quantidade: DataTypes.INTEGER,
      justificativa: DataTypes.STRING(500),
      feedback: DataTypes.STRING(1000)
  });

  solicitacoes.associate = associate;
  return solicitacoes;
};
