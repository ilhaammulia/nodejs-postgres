import { Sequelize } from "sequelize";

const db = new Sequelize("roadmap-db", "postgres", "", {
  host: "localhost",
  dialect: "postgres",
  port: 5432,
});

export default db;
