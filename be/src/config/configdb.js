const Sequelize = require('sequelize');

const sequelize = new Sequelize('node_fullstack', 'root', 'root', {
  host: '127.0.0.1',
  port: 4000,
  dialect: 'mysql',
  logging: false
});

let connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection to the database has been established successfully.');
  } catch(error) {
    console.error('Unable to connect to the database:', error);
  }
}

module.exports = connectDB;