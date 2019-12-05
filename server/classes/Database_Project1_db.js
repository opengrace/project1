// Import Sequelize
import Sequelize from "sequelize";
import InitSchema from "../models/schema_project1_db";
import UserModel from "../models/Project1_db/UserModel";

// Logging
import Logger from "./Logger";
// Properties
import properties from "../properties.js";

class Database {
  constructor() {}

  /**
   * Init database
   */
  async init() {
    await this.authenticate();
    Logger.info(
      "Database connected at: " +
        properties.project1_db.host +
        ":" +
        properties.project1_db.port +
        "//" +
        properties.project1_db.user +
        "@" +
        properties.project1_db.name
    );

    // Import schema
    InitSchema();

    await UserModel.createAdminUser();

  }

  /**
   * Start database connection
   */
  async authenticate() {
    Logger.info("Authenticating to the databases...");

    const sequelize = new Sequelize(
      properties.project1_db.name,
      properties.project1_db.user,
      properties.project1_db.password,
      {
        host: properties.project1_db.host,
        dialect: properties.project1_db.dialect,
        port: properties.project1_db.port,
        logging: false
      }
    );
    this.dbConnection_project1_db = sequelize;

    try {
      await sequelize.sync();
    } catch (err) {
      // Catch error here
      Logger.error(`Failed connection to the DB`);
      Logger.error(err);
      await new Promise(resolve => setTimeout(resolve, 5000));
      await this.authenticate();
    }
  }

  /**
   * Get connection db
   */
  getConnection() {
    return this.dbConnection_project1_db;
  }
}

export default new Database();
