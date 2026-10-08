import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../db';
import { User } from './User';

export class Game extends Model {
  declare id: number;
  declare userId: number;
  declare articleTitle: string;
  declare articleText: string;
  declare revealedWords: string[];
  declare guesses: number;
  declare startTime: Date;
  declare endTime: Date | null;
  declare status: 'playing' | 'won' | 'abandoned';
}

Game.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    articleTitle: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    articleText: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    revealedWords: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
    },
    guesses: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    startTime: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    endTime: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'playing',
    },
  },
  {
    sequelize,
    modelName: 'Game',
  }
);

User.hasMany(Game, { foreignKey: 'userId' });
Game.belongsTo(User, { foreignKey: 'userId' });
