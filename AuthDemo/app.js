let express                 = require("express");
let app                     = express();
let mongoose                = require("mongoose");
mongoose.connect("mongodb://localhost/auth_demo_app",{useNewUrlParser: true, useUnifiedTopology: true} );
let bodyParser              = require("body-parser");
let localStrategy           = require("passport-local");
let passportLocalMongoose   = require("passport-local-mongoose");
let User                    = require("./models/user");
let passport                = require("passport");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true})); //This is done for req.body stuff

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

app.use(require("express-session")({
    secret:"My name is Saumik",
    resave:false,
    saveUninitialized:false
}));


passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", function (req,res) {
    res.render("home");

});

app.get("/secret", isLoggedIn, function (req,res) {
    res.render("secret");

});
//Auth routes
//Register route to show the form
app.get("/register", function (req,res) {
    res.render("register");

});
//post route responsible for signup
app.post("/register", function (req,res) {
    req.body.username
    req.body.password
    User.register( new User({ username: req.body.username}), req.body.password, function(err,user){
        if (err){
            console.log("There is an error");
            return res.render("register");
        }else{
            passport.authenticate("local")(req,res,function () {
                res.redirect("/secret");

            })
        }
        })



});
//Two routes for login: one for the form which is a get route and the other is going to post that stuff
//LOGIN ROUTES
app.get("/login", function (req,res) {
    res.render("login");

});
//Second argument is the middleware
//that works between the start and the end of the route
app.post("/login", passport.authenticate("local",{
    successRedirect:"/secret",
    failureRedirect:"/login"
}),function (req,res) {

});

//LOGOUT
app.get("/logout", function (req,res) {
    req.logout();
//    ^^ Passport is destroying the session
    res.redirect("/");

});
//Middleware
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();//so only now will the next, upcoming route be reached
    }
    res.redirect("/login");
}

app.listen(3000, function () {
    console.log("SERVER STARTED");

});