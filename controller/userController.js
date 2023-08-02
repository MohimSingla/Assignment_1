const { User } = require('../models/model.js');
const {joiSchemaUserValidator} = require('../validators/joiValidator.js');
const logger = require('../services/loggerService');
const { Sentry } = require('../sentry/sentry.js');

// Response handler to create new user accounts.
// Validators in place to check quality of the data entered.
const registerUser = async (req, res) => {
    logger.info('POST route /auth/register is accessed')
    // Sentry.captureMessage('POST route /auth/register is accessed');
    try{
        const errCheck = joiSchemaUserValidator.validate(req.body).error;
        if(errCheck)
        {
            logger.error(error.message, "An error occured.");
            throw new Error(errCheck);
        }
        const userData = new User(req.body);
        await userData.generateAuthToken();
        logger.info('/auth/register sending 200 success code with relevant data.')
        res.status(200).send("User Created SuccessFully!");
    }
    catch(error){
        Sentry.captureException(error);
        logger.fatal(error.message, "Internal Error");
        logger.info("Sending 400 status code.")
        res.status(400).send(error.message);
    }
};

// Response handler to allow the user to login with correct Username(Email) and password.
// Throws 400 http status in case of mismatching credentials.
const userLogin = async (req, res) => {
    logger.info('POST route /auth/login is accessed')
    try {
        const user = await User.findByCredentials(req.body.userName, req.body.password);
        logger.info("User logged in. Sending relevant information back with 200 status code.")
        res.status(200).send({ user });
    } catch (error) {
        Sentry.captureException(error);
        logger.fatal(error.message, "Sending 400 status code back to user.")
        res.status(400).send("Invalid Request!");
    }
};

module.exports = { registerUser, userLogin }