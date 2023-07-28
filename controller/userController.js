const { User } = require('../models/model.js');
const {joiSchemaUserValidator} = require('../validators/joiValidator.js');

// Response handler to create new user accounts.
// Validators in place to check quality of the data entered.
const registerUser = async (req, res) => {
    try{
        const errCheck = joiSchemaUserValidator.validate(req.body).error;
        if(errCheck)
        {
            throw new Error(errCheck);
        }
        const userData = new User(req.body);
        await userData.generateAuthToken();
        res.status(200).send("User Created SuccessFully!");
    }
    catch(error){
        res.status(400).send(error.message);
    }
};

// Response handler to allow the user to login with correct Username(Email) and password.
// Throws 400 http status in case of mismatching credentials.
const userLogin = async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.userName, req.body.password);
        res.send({ user });
    } catch (error) {
        res.status(400).send("Invalid Request!");
    }
};

module.exports = { registerUser, userLogin }