module.exports = (sequelize, DataTypes) => sequelize.define('goods', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING(128),
    allowNull: false,
  },
}, {
  timestamps: false,
  tableName: 'goods',
  charset: 'utf8',
  collate: 'utf8_unicode_ci',
});
