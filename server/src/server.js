const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const express = require("express");
const mongoose = require("mongoose");

const { usersRouter } = require("./users/users.router.js");

const cors = require("cors");

exports.Server = class Server {
  constructor() {
    this.app = null;
  }

  async start() {
    this.initServer();
    this.initMiddlewares();
    await this.initDbConnection();
    this.initRoutes();
    this.initErrorHandling();
    this.startListening();
  }

  initServer() {
    this.app = express();
  }

  initMiddlewares() {
    this.app.use(express.json());
    this.app.use(cors({ origin: process.env.ALLOWED_ORIGIN }));
  }

  async initDbConnection() {
    try {
      await mongoose.connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
      });
      console.log("Database connection successful");
    } catch (error) {
      console.log("Database connection failed");
      process.exit(1);
    }
  }

  initRoutes() {
    this.app.use("/users", usersRouter);
  }

  initErrorHandling() {
    this.app.use((err, req, res, next) => {
      const status = err.status || 500;
      return res.status(status).send(err.message);
    });
  }

  startListening() {
    this.app.listen(process.env.PORT, () => {
      console.log("Started listening on port", process.env.PORT);
    });
  }
};
