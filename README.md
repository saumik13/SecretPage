# SecretPage
> Learning Authentiaction using PassportJS
* The packages that I need for authorization are: 
  * express
  * mongoose 
  * body-parser
  * passport 
  * passport-local 
  * passport-local-mongoose
  * express-session 
  
 * And then you need to initialize and session.
 ````javascript
 app.use(passport.initialize());
 app.use(passport.session());
 ````
* Then you need to require and use express-session
 ````javascript
app.use(require("express-session")({
    secret:"My name is Saumik",
    resave:false,
    saveUninitialized:false 
}));
 ````
* And then initialize user and reinitialize user 
```javascript
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
```
* Remember to plugin local mongoose passport to your schema
````javascript
UserSchema.plugin(passportLocalMongoose);
````
---
## Authentication
```javascript
app.post("/register", function (req,res) {
    User.register( new User({ username: req.body.username}, req.body.password, function(err,user){
        if (err){
            console.log("There is an error");
            return res.render("register");
        }else{
            passport.authenticate("local")(req,res,function () {
                res.redirect("/secret");

            })
        }
        })

    )

});
```
Password is the second argument. This means its not going to be inserted into the database, but hashed. It is indicated
that the "local" strategy is going to be used, so just username and password and 
not "facebook", "twitter", etc. 

When using `mongo`, it can be seen that password is not stored in the database's collection, rather a long hash can be seen. 

A __middleware__ is used to check if the user is logged in . 
```javascript
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();//so only now will the next, upcoming route be reached
    }
    res.redirect("/login");
}
```
The function isLoggedIn is a middleware for the `app.get("/secret")` route which checks if the user is logged in. If the user is logged in, `next()`
is executed which means that the route, `"/secret"` will be executed.
If the user is not logged in, he/she will be redirected to the login page. 
