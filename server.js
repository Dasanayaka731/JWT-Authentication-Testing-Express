const express = require("express");
const bodyParser = require("body-parser");
const user = require("./routes/userRouts");
const student = require("./routes/studentRouts");
const auth = require("./middleware/auth");

const app = express();
app.use(bodyParser.json());
app.use("/user", user);
app.use("/student",auth, student);
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
