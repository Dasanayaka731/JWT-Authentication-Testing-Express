const express = require("express");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const router = express.Router();
const accessKey = process.env.TOKEN_KEY;
const refreshKey = process.env.REFRESH_KEY;

let refreshTokens = [];
///////////////////////////////
// Route for user login
router.post("/login", (req, res) => {
  const username = req.body.username;
  const user = { name: username };

  // Generating an access token with a short expiration time (10 seconds)
  const accessToken = jwt.sign(user, accessKey, { expiresIn: "10s" });
  // Generating a refresh token with a longer expiration time (24 hours)
  const refreshToken = jwt.sign(user, refreshKey, { expiresIn: "24h" });
  // Storing the refresh token in the server's memory (can be stored in a database as well)
  refreshTokens.push(refreshToken);

  // Sending the access token and refresh token as a response
  res.send({ accessToken, refreshToken });
});
////////////////////////////////
// Route for getting a new access token using a refresh token
router.post("/token", (req, res) => {
  const refreshToken = req.body.refreshToken;

  // Checking if the refresh token is null
  if (refreshToken == null) res.sendStatus(401); // Sending "Unauthorized" status if the refresh token is null

  // Checking if the refresh token is valid and exists in the refreshTokens array
  if (!refreshTokens.includes(refreshToken)) res.sendStatus(403); // Sending "Forbidden" status if the refresh token is invalid or expired

  // Verifying the refresh token and generating a new access token
  jwt.verify(refreshToken, refreshKey, (err, user) => {
    if (err) res.sendStatus(403); // Sending "Forbidden" status if the refresh token is invalid or expired

    // Generating a new access token with a short expiration time (10 seconds)
    const accessToken = jwt.sign({ name: user.name }, accessKey, {
      expiresIn: "10s",
    });

    // Sending the new access token as a response
    res.send({ accessToken });
  });
});
///////////////////////////////////////
// Route for logging out and removing a refresh token
router.delete("/logout", (req, res) => {
  const refreshToken = req.body.refreshToken;

  // Removing the specified refresh token from the refreshTokens array
  refreshTokens = refreshTokens.filter((t) => t !== refreshToken);

  // Sending "No Content" status as a response
  res.sendStatus(204);
});

module.exports = router;
