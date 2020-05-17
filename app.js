
require('dotenv').config()
const express = require("express");
const bodyParser =require('body-parser');
const ejs = require("ejs");
const mongoose = require("mongoose");
const session =  require('express-session');
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

//then in the function when the user enters the pw in our register we pass it as an arg for our md5 method
//in the post request

const app = express();

/////////here i can see the key of our enviroment variablefrom our .env file
console.log(process.env.API_KEY);

app.use(express.static("public"));
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({
  extended:true
}));

//this line of code should be here not in other place in this code//////
app.use(session({
  secret:"Our little secret.",
  resave:false,
  saveUninitialized: false
}));

///////////////////////////////////////////////////////////////////////
///////////////////here we also need to initialize passport///////////
app.use(passport.initialize());
////////tell out app to use passport to set our session or dealing ith our session/////////
app.use(passport.session());


mongoose.connect("mongodb://localhost:27017/userDB",{ useNewUrlParser: true,useUnifiedTopology: true});
mongoose.set("useCreateIndex",true);

const userSchema = new mongoose.Schema( {
  email:String,
  password:String
});

///////////////////////we need to setup our passportLocalMongoose  as a plugin to our schema /////////
///////this is going to have and salt our passport and save to our mongogdb database/////////
userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model("User",userSchema);

///// toset our passport local configuration// to create our local strategic to our local serialize to our user1 create a unique authentication into the cookie
//////or deserialize is going to identify the user based on the identification we put in our session///
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.get("/",function(req,res){

  res.render('home')

})
app.get("/login",function(req,res){
  res.render('login');

});
app.get("/register",function(req,res){
  res.render("register");
});

app.get("/secrets", function(req, res){
  if(req.isAuthenticated()){
    res.render("secrets");
  }else{
    res.redirect("/login");
  }
});
app.get("/logout",function(req, res){
  req.logout();
  res.redirect("/");

})


///////////////register post handler//////////////////

app.post("/register",function(req,res){
   User.register({username:req.body.username},req.body.password, function(err, user){
     if(err){
       console.log(err);
       res.redirect("/register");

     }else{
       passport.authenticate("local")(req, res, function(){
         res.redirect("/secrets")
       })
     }
   })

})//postregisterend
/////////////////////////////////////////////////////

////////////////loginpost handler////////////////////
app.post("/login",function(req,res){
  const user = new User({
    username:req.body.username,
    password:req.body.password
  });
  //we are going to us passport to login this user an authenticate it
  req.login(user,function(err){
    if(err){
      console.log(err);
    }else{
      passport.authenticate("local")(req, res, function(){
        res.redirect("/secrets")
      })
    }
  })

})//endpostlogin
/////////////////////////////////////////////////////





app.listen("3000"),function(){
  console.log("Server started on port 3000")
}
