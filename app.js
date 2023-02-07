
const express = require("express");
const bodyParser=require("body-parser");
const ejs=require("ejs");
const mongoose=require("mongoose");
const encrypt = require("mongoose-encryption");
require('dotenv').config();

const app =express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set("view engine","ejs");

app.listen(3000,function(){
    console.log("server on 3000")
})

mongoose.connect("mongodb://127.0.0.1:27017/userDB",{useNewUrlParser:true});

const Schema = new mongoose.Schema({
    email:String,
    password:String
});

Schema.plugin(encrypt,{secret:process.env.KEY, encryptedFields:["password"]});

const User = new mongoose.model("User",Schema);


app.get("/",function(req,res){

    res.render("home");
})

app.get("/login",function(req,res){

    res.render("login");
})
app.get("/register",function(req,res){

    res.render("register");
})

app.post("/register",function(req,res){
    const newUser = new User({
        email:req.body.username,
        password:req.body.password
    })
newUser.save(function(err){
    if(err){
        console.log(err)
    }
    else
    res.render("secrets");
})

})

app.post("/login",function(req,res){

const username = req.body.username;
const password = req.body.password;

User.findOne({email:username},function(err,foundUser){
    if(err){
        console.log(err)
    }
    else
    {
        if(foundUser)
        {
            if(foundUser.password === password)
            {
                res.render("secrets");
            }
        }
    }
})

});
