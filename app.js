const { static } = require("express");

var express = require("express"),
     app = express(),
     bodyParser = require("body-parser"),
     flash      = require("connect-flash"), 
     mongoose = require("mongoose"),
     passport = require("passport"), 
     methodOverride = require("method-override"),
     LocalStrategy = require("passport-local"),
     Campground = require("./models/campground"),
     Comment = require("./models/comment"),
     User    = require("./models/user"),
     
     seedDB = require("./seeds"); 
     
var commentRoutes     = require("./routes/comments"),
    campgroundRoutes  = require("./routes/campgrounds"),
    indexRoutes        = require("./routes/index");  
 
mongoose.connect("mongodb://localhost/yelp_camp_v6",{useNewUrlParser: true, useUnifiedTopology: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB();    

// passport configuration
app.use(require("express-session")({
 secret:"Once again Rusty wins cutest dog!",
 resave : false,
 saveUninitialized:false
}));
 
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

app.use("/",indexRoutes);
app.use("/campground",campgroundRoutes);
app.use("/campground/:id/comments",commentRoutes);

app.listen(3000,function(){
 console.log("Yelp Camp started");
});
