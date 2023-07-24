const jwt = require('jsonwebtoken');

// Middleware function to check wheather the acoount triing the access the API end points is a valid ADMIN account or not.
const adminAuth = async (req, res, next) => {
    try{
        if(!req.header('AuthorizationToken')){
            throw new Error("Authorization key is missing.");
        }
        const token = req.header('AuthorizationToken').replace('Bearer ', '');
        const flagToken = await jwt.verify(token, "generateJsonToken");
        if(flagToken.roleName != "admin") {
            throw new Error("Unauthorized Request. Requested task can only be performed by an ADMIN.");
        }
        next();
    }
    catch(error){
        res.send(error.message);
    }
}

// Middleware function to flag the Unauthorized access to API endpoints. 
// User cannot access the end points without the login JSON Web Token.
const checkUserLoginStatus = async (req, res, next) => {
    try{
        if(!req.header('AuthorizationToken')){
            throw new Error("Authorization key is missing.");
        }
        const token = req.header('AuthorizationToken').replace('Bearer ', '');
        const flagToken = await jwt.verify(token, "generateJsonToken");
        if(flagToken) {
            throw new Error("Unauthorized Request. Kidly Login first.");
        }
        next();
    }
    catch(error){
        res.send(error.message);
    }
}

module.exports = {adminAuth, checkUserLoginStatus};