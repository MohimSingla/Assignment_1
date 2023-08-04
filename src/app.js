const express = require('express');
const {router} = require('../routes/routes.js');
const expressPinoLogger = require('express-pino-logger');
const logger = require('../services/loggerService');

const app = express();

const path = __dirname + "/../ui";
app.use(express.static(path))

const loggerMidleware = expressPinoLogger({
    logger: logger,
    autoLogging: true,
  });
  app.use(loggerMidleware);

// To Parse incomming requests body data into JSON
app.use(express.json());

// Middleware to incorporate API endpoints
app.use(router);

// Starting up Express Server with error handling
app.listen(3000, (error) => {
    if(error)
    {
        logger.fatal(error, "Unable to start the server.")
        throw new Error(error)
    }
    logger.info("Node server up and running.");
})

