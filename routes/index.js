var express = require("express");
const { route } = require("./campgrounds");
var router  = express.Router();
var passport = require("passport");
var User = require("../models/user");

router.get("/",function(req,res){
    res.render("landing");
  }); 

  // AUTH ROUTES
  
  // show register form
  router.get("/register",function(req,res){
     res.render("register");
  });
  
  // handle sign up logic
  router.post("/register",function(req,res){
    User.register(new User({username : req.body.username}), req.body.password,function(err,user){
      if(err)
      {
        req.flash("error",err.message);
        req.session.save(function () {
        return res.render("register");
      });
      }
      passport.authenticate("local")(req,res,function(){
        req.flash("success","Welcome to YelpCamp " + user.username);
        res.redirect("/campground");
      });
    });
  });
  
  router.get("/login",function(req,res){
    res.render("login");
  });
  
  router.post("/login",passport.authenticate("local",
  { 
    successRedirect:"/campground",
    failureRedirect:"/login"
    
  }),function(req,res){
     
  });
  
  router.get("/logout",function(req,res){
     req.logout();
     req.flash("success","Log out");
     res.redirect("/campground");
  });
  
 

  module.exports = router;