var express= require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose'); 
var methodOverride = require('method-override');


mongoose.connect("mongodb://localhost/blog_app",{useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(methodOverride("_method"));         


// mongoose.set('useNewUrlParser', true);
// mongoose.set('useFindAndModify', false);
// mongoose.set('useCreateIndex', true);



var blogSchema = new mongoose.Schema({
	title : String,
	image: String,
	body: String,
	created: {type: Date, default: Date.now}
});

const Blog = mongoose.model("Blog", blogSchema);

// Blog.create({
// 	name: "My First Blog" ,
// 	image:"https://cdn.pixabay.com/photo/2015/06/01/09/04/blog-793047_960_720.jpg",
// 	body:"This is a blog post and it's also my first blog"
// 	 }, function(err, camp){
// 	if(err)
// 	console.log(err);
// 	 else
// 	 console.log("blogs have been added");
// 	 console.log(camp);
// 	 });

app.get('/',function(req,res){
	res.redirect('/blogs');
});
app.get('/contact',function(req,res){
	res.render("contact")
});
app.get('/about',function(req,res){
	res.render("about")
});

// app.get('/blogs',function(req,res){
// 	Blog.find({},function(err,allBlogs){
// 		if(err)
// 			console.log(err);
// 		else{
// 			res.render('index', {blog : allBlogs});
// 		}
// 	});
// });

app.get('/blogs', function(req, res) {
	Blog.findOne().maxTimeMS(10000).exec()
	  .then(function(blog) {
		res.render('index', { blog: blog });
	  })
	  .catch(function(err) {
		console.log(err);
		res.status(500).json({ error: "Failed to retrieve blog" });
	  });
  });

app.get('/blogs/new',function(req,res){
	res.render("new");
});



app.post("/addBlogs",function(req, res){
	Blog.create(req.body.blog ,function(err, newBlog){  
		if(err){
			console.log(err);
		}else{
			res.redirect("/blogs");
		}
	});

});
// app.post("/addBlogs", function(req, res) {
// 	var newBlog = new Blog(req.body.blog);
// 	newBlog.save(function(err, savedBlog) {
// 	  if (err) {
// 		console.log(err);
// 		res.status(500).json({ error: "Failed to create blog" });
// 	  } else {
// 		res.status(201).json(savedBlog);
// 	  }
// 	});
//   });

app.get('/blogs/:id',function(req, res){
		Blog.findById(req.params.id, function(err, foundBlog){
			if(err){
				console.log(err);
			}else{
				res.render("show", {blogs : foundBlog});
			}
			});	
});


app.get('/blogs/:id/edit', function(req,res){
	Blog.findById(req.params.id, function(err, editBlog){
		if(err){
			console.log(err);
		}else{
			res.render("edit", {blogs : editBlog});
		}	
	});
});

app.put("/blogs/:id", function(req, res){
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if(err){
           console.log(err);
        } else {
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

app.delete("/blogs/:id", function(req,res){
	Blog.findByIdAndRemove(req.params.id, function(err){
		if(err)
			console.log(err);
		else
			res.redirect('/blogs');
	});
});

app.get('*', function(req,res){
res.send("Sorry!! Page not found");
});

app.listen(3000,function(){
	console.log("server started");
});