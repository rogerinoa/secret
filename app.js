
require('dotenv').config()
const express = require("express");
const bodyParser =require('body-parser');
const ejs = require("ejs");
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const saltRounds =10;
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

mongoose.connect("mongodb://localhost:27017/userDB",{ useNewUrlParser: true,useUnifiedTopology: true});

const userSchema = new mongoose.Schema( {
  email:String,
  password:String
})


/////////////secret to encrypt ourUser Info this should be done before the mongoose model creation////////////
//here should be the key that is at the .env
///now we can use this secret and encrypt our database schema using the plugin function and passing our secret mesage

const User = new mongoose.model("User",userSchema)


const user1 = new User({
email:'rogerinoa2@gmail.com',
password: 'total'

})
// user1.save()

app.get("/",function(req,res){

  res.render('home')

})
app.get("/login",function(req,res){
  res.render('login');

});
app.get("/register",function(req,res){
  res.render("register");
});


///////////////register post handler//////////////////

app.post("/register",function(req,res){
  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        // Store hash in your password DB.
        const newUser = new User({
          email:req.body.username,
          password:hash
        });
        newUser.save(function(err){
          if(err){
            console.log(err)
          }else{
            res.render("secrets")
          }
        })
    });


})//postregisterend
/////////////////////////////////////////////////////

////////////////loginpost handler////////////////////
app.post("/login",function(req,res){
  const username = req.body.username;
  const password = req.body.password;
  User.findOne({email:username},function(err,foundUser){
    if(err){
      console.log(err)
    }else{
      if(foundUser){
        bcrypt.compare(password,foundUser.password, function(err,result){
          if (result == true){
            res.render("secrets")
          }
        })
        }
      }
    })
})//endpostlogin
/////////////////////////////////////////////////////





app.listen("3000"),function(){
  console.log("Server started on port 3000")
}
