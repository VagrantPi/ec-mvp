module.exports = (sequelize, DataTypes) => sequelize.define('systemUser', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  account: {
    type: DataTypes.STRING(128),
    allowNull: true,
  },
  password: {
    type: DataTypes.STRING(128),
    allowNull: true,
  },
}, {
  timestamps: false,
  tableName: 'systemUser',
  charset: 'utf8',
  collate: 'utf8_unicode_ci',
});
