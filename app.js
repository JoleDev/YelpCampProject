var express     = require ("express"),
    app         = express (),
    bodyParser  = require ("body-parser"),
    mongoose    = require ("mongoose");

//These are default code blocks for various npm packages
app.set ("view engine", "ejs");
app.use (bodyParser.urlencoded ({extended : true}));
mongoose.connect ("mongodb://localhost/yelp_camp");

//Defining campGroungSchema
var campGroungSchema = new mongoose.Schema ({
    name : String,
    image : String,
    description : String
});

var campGround = mongoose.model ("Campground", campGroungSchema);

app.get ("/", function (req, res) {
    res.render ("homePage");
});

// This route will render camp ground name and images from database
app.get ("/campGrounds", function (req, res) {
    campGround.find({}, function (err, campGrounds){
        if (err) {
            console.log(err);
        } else {
            res.render ("campsIndex", {campGrounds : campGrounds});
        }
    });
});

//This is the post route to add new camp grounds, this will add new camp grounds to campgrounds array
app.post ("/campGrounds", function (req, res) {
    var campGroundName = req.body.campGroundName;
    var campGroundImage = req.body.campGroundImage;
    var campGroundDescription = req.body.campGroundDescription;
    var newCampGround = {name : campGroundName, image : campGroundImage, description : campGroundDescription};
    
    campGround.create (newCampGround, function (error, campGround) {
        if (error) {
            console.log ("Something went worng");
            console.log (error);
        } else {
            //Redirecting to the camp grounds page
            console.log (campGround);
            res.redirect ("/campGrounds");
        }
    });
});

//This is the route used to display the form to add new camp grounds
app.get ("/campGrounds/newCamp", function (req, res) {
    res.render ("newCamp");
});

//This is the route used to show camp ground details (Here position of the code is important, For ex. if we put above code
// /campGrounds/newCamp" below this code every time we try to reach /campGrounds/something it will never reach /campGrounds/newCamp
// Instead it will render /campGrounds/:id page as it is literally /campGrounds/anything
app.get ("/campGrounds/:id", function (req, res) {
    campGround.findById (req.params.id, function (err, campGroundReturned) {
        if (err) {
            console.log (err);
        } else {
            res.render ("showCamp", {campGround : campGroundReturned});
        }
    });
});

app.listen (3000, function () {
    console.log ("Yelp Camp Server has initiated");
});