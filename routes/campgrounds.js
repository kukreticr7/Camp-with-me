var express = require("express"); 
var router  = express.Router();
var Campground = require("../models/campground");
var Comment    = require("../models/comment");
const { findById } = require("../models/comment");
var middleware = require("../middleware");
const middlewareObj = require("../middleware");
  
  //Index - show all campgrounds
  router.get("/",function(req,res){
    Campground.find({} ,function(err , allCampground){
      if(err){
        console.log(err);
      }else {
        res.render("campgrounds/index",{campground : allCampground});
      }
    });
    
  });
  
  // Create - add new campground to db
  router.post("/",middleware.isLoggedIn,function(req,res){
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var desc = req.body.description;
    var author ={
      id : req.user._id,
      username : req.user.username
    }
    var newcamp = {name : name ,price : price, image : image , description : desc, author : author};
    Campground.create(newcamp ,function(err ,newlyCreated ){
      if(err){
        console.log(err);
      }else {
        res.redirect("/campground");
        
      }
    });
  });
  
  //New - show form to create new campground
  router.get("/new",middleware.isLoggedIn,function(req,res){
    res.render("campgrounds/new");
  });
  
  //Show - Shows more info about one campground
  router.get("/:id", function(req,res){
    Campground.findById(req.params.id).populate("comments").exec (function(err,foundCampground){
    if(err || !foundCampground){
     req.flash("error","Campground not found");
     res.redirect("back");
   }else{
     
    res.render("campgrounds/show", {campground : foundCampground});
    }
    });
  });

  //Edit Campground route
  router.get("/:id/edit",middleware.checkCamppgroundOwnership,function(req,res){
      Campground.findById(req.params.id,function(err,foundCampground){
      res.render("campgrounds/edit",{campground:foundCampground});
      });
    });  

 //update route
 router.put("/:id",middleware.checkCamppgroundOwnership,function(req,res){
   Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCampground){
     if(err){
       res.redirect("/campground");
     }else{
       res.redirect("/campground/" + req.params.id) ;
     }
   })
     
 });

 //destroy campground route
 router.delete("/:id",middleware.checkCamppgroundOwnership,function(req,res){
 Campground.findByIdAndRemove(req.params.id,function(err){
   if(err){
      res.redirect("/campground");
   }else{
      res.redirect("/campground");
   }
 })
 });

  
  module.exports = router;