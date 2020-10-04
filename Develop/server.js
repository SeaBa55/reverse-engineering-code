// Requiring necessary npm packages
var express = require("express");
var session = require("express-session");
// Requiring passport strategy configuration.
var passport = require("./config/passport");

// Setting up port and requiring models for syncing
var PORT = process.env.PORT || 8080;
var db = require("./models");

// Creating express app and configuring middleware needed for authentication
var app = express();
app.use(express.urlencoded({ extended: true }));  // for parsing application/x-www-form-urlencoded
app.use(express.json());  // for parsing application/json
app.use(express.static("public"));

// We need to use sessions to keep track of our user's login status
// with this app.use statment, express will know to create a session for our visiting user on the backend, and return the session id (which can be later accessed using passport as a cookie)
app.use(session({ 
  secret: "g4l5k$^@$^fh", // needs to be random or password string to ensure no-one can easily come up with this
  resave: true, 
  saveUninitialized: true
}));

// Initialize passport, which will allow for use of multiple authentication methods, and integrate passport with express session to enable passport authentication to test our user sessions inputs.
app.use(passport.initialize());
app.use(passport.session());

// Requiring our routes
require("./routes/html-routes.js")(app);
require("./routes/api-routes.js")(app);

// Syncing our database and logging a message to the user upon success
db.sequelize.sync().then(function() {
  app.listen(PORT, function() {
    console.log("==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.", PORT, PORT);
  });
});
