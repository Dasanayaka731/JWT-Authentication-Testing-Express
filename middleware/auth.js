const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = function (req, res, next) {
  // Checking if the authorization header exists and starts with "bearer"
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("bearer")
  ) {
    // Extracting the token from the authorization header
    const token = req.headers.authorization.split(" ")[1];
    // Checking if the token is null
    if (token == null) res.sendStatus(401); // Sending "Unauthorized" status if the token is null

    // Verifying the token using the secret key from the environment variables
    jwt.verify(token, process.env.TOKEN_KEY, (err, user) => {
      // Checking for errors during token verification
      if (err) res.sendStatus(403); // Sending "Forbidden" status if the token is invalid or expired

      // Attaching the user object decoded from the token to the request object
      req.user = user;
      next(); // Proceeding to the next middleware or route handler
    });
  } else {
    res.sendStatus(401); // Sending "Unauthorized" status if the authorization header is missing or incorrect
  }
};

// This code is a middleware function for authenticating JSON Web Tokens (JWT).
//It checks for the presence of the "authorization" header in the incoming request
//and verifies the JWT token contained in it. If the token is valid, it attaches the decoded user information
//to the request object and proceeds to the next middleware or route handler.
//If the token is missing, null, or invalid, it sends the appropriate HTTP status codes
//(401 for Unauthorized and 403 for Forbidden).
