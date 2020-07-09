# SecretPage
> Learning Authentication using PassportJS
* For this Authentication tutorial (in first person :}), you need a basic knowledge of NodeJS and Express. 
* The packages that you need for authorization are: 
  * express
  * mongoose 
  * body-parser
  * __passport__ 
  * __passport-local__ 
  * __passport-local-mongoose__
  * __express-session__ 

* For a basic authentication application, you need 5 routes: 
  * 2 for register/ signing up
  * 2 for logging in 
  * 1 for signing out 

-----
### The `/register` routes
The __get__ route for register, `javascript app.get("/register")` renders a form which takes in inputs from the user to make a new account. The method of the form is set to `post` and its action set to `"/register"`. The __post__ route is where the main process of account creation takes place. 

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
As it can be seen above, when a new User is created to be registered, its only argument is `req.body.username`. `req.body.password` is not an argument to the new User function; it is the second parameter to the User.register() function. `req.body.password` is not included in the object that is stored in the database; it is hashed and then inserted. If there is any error while doing so, the route will render the registration form and make an exit. If there is no error, `passport.authenticate()` will be called with the argument `("local")` which means only the credentials username and password on the system will be used for registration. Then the user will be redirected to the "__secret__" page; the page that only men with accounts can acceess. *(to make sure that only users with accounts and only those who are signed in can access, middleware is used, which will be discussed later)*

> When using `mongo`, it can be seen that password is not stored in the database's collection, instead, a long `"hash"` can be seen. 

---
### The `/login` routes 
Like the `"/register"` routes, the __get__ route for `/login` renders a form that allows the user to input its credentials. 
The __post__ route is where the authentication takes place with the help of __passport's__ `authenticate()` function. If the credentials entered match with any of those in the database, the user is sent to the `/secret` page. Otherwise, the `/login` page is reloaded. 

```
app.post("/login", passport.authenticate("local",{
    successRedirect:"/secret",
    failureRedirect:"/login"
}),function (req,res) {

});
```
---
## The model
In the user.js file, the Schema (the format) for the data to be stored in the database is declared. A user will only have a password and username. 
```javascript
let UserSchema = new mongoose.Schema({
    username:String,
    password:String
});
```
`UserSchema.plugin(passportLocalMongoose)` means that the Schema created will now include functions that come with the `passport-local-mongoose` package. This is what allows us to use the `remove()` function as shown above in the __post__ route for `"/register"`. 

---
### Preheating the oven
To make sure that the passport functions called in the routes work, the following must be done in the Node application (app.js in our case): 

 * You need to initialize and session.
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
* Remember to plugin local mongoose passport to your schema *(done in the model file, user.js)*
````javascript
UserSchema.plugin(passportLocalMongoose);
````
---
### The middleman
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
