let express                 = require("express");
let app                     = express();
let mongoose                = require("mongoose");
mongoose.connect("mongodb://localhost/auth_demo_app",{useNewUrlParser: true, useUnifiedTopology: true} );
let bodyParser              = require("body-parser");
let localStrategy           = require("passport-local");
let passportLocalMongoose   = require("passport-local-mongoose");
let User                    = require("./models/user")

app.set("view engine", "ejs");
app
app.use(passport.initialize());
app.use(passport.session());

app.get("/", function (req,res) {
    res.render("home");

});

app.get("/secret", function (req,res) {
    res.render("secret");

})

app.listen(3000, function () {
    console.log("SERVER STARTED");

})