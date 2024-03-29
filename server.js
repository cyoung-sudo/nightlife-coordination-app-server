//----- Imports
const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config({ path: "./config.env" });
const port = process.env.PORT || 5000;
const dbo = require("./db/conn");
const helmet = require("helmet");
// Session
const session = require("express-session");
// Passport
const passport = require("passport");
require("./configs/passportConfig");

//----- Middleware
app.use(cors());
app.use(express.json());
app.use(helmet());
// Session (needs to be above passport)
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 60000  * 5 } // 5min
}));
// Passport
app.use(passport.initialize());
app.use(passport.session());
 
//----- Routes
app.use(require("./routes/auth"));
app.use(require("./routes/business"));
app.use(require("./routes/user"));
app.use(require("./routes/userBusiness"));
app.use(require("./routes/userSearch"));

//----- Connection
app.listen(port, () => {
  // Connect to DB
  dbo.connectToServer();
  console.log(`Server is running on port: ${port}`);
});