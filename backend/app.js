const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Post = require('./models/post')

const app = express();

/* This block of code will fix all depreciation issues with the current versions of mongoose and mongodb */
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

/* Connect to the database, then log to the console if you failed to connect or if you successfully connected */
mongoose.connect('mongodb+srv://Mike:ka2qAJ3MS99XIbwe@cluster0-zyfo6.mongodb.net/test?retryWrites=true&w=majority')
  .then(() => {
    console.log('Connected to database!');
  })
  .catch(() => {
    console.log('Connection failed');
  });

/* This block will set the headers and other prerequisites to use our app with a restful API */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', "*");
  res.setHeader('Access-Control-Allow-Headers', "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader('Access-Control-Allow-Methods', "GET, POST, PATCH, DELETE, OPTIONS, PUT");
  next();
});

/* This middleware is creating a new post, then saving it to the database */
app.post("/api/posts", (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });
  post.save().then(createdPost => {
    res.status(201).json({
      message: 'Success',
      postId: createdPost._id
    });
  });
});

/* This middleware is fetching all posts from the database */
app.get("/api/posts", (req, res, next) => {
  Post.find()
    .then(documents => {
      console.log(documents);
      res.status(200).json({
        message: 'Posts fetched successfully',
        posts: documents
        });
    });
});

/* This middleware will delete a post with the specified id from the database */
app.delete("/api/posts/:id", (req, res, next) => {
  Post.deleteOne({_id: req.params.id}).then(result => {
    console.log(result);
    res.status(200).json({ message: "Post deleted" });
  });
});

/* This middleware will find the desired post by its id, then update the header and body with the new content */
app.post("/api/posts/:id", (req, res, next) => {
  const post = new Post({
    _id: req.params.id,
    title: req.body.title,
    content: req.body.content
  });
  /* this block looks really confusing, but it's saying if the title is empty, then
  make the post only have an id and the content, but if the title is valid then check if the content
  is empty, and if it is then make the post just an id and a title, but if both of them are valid
  then make the post a full post with an id, title, and content */
  const updatedPost = post.title === '' ? { _id: req.params.id, content: req.body.content } :
    post.content === '' ? { _id: req.params.id, title: req.body.title } : { _id: req.params.id, title: req.body.title, content: req.body.content };
  Post.findByIdAndUpdate(req.params.id, updatedPost, () => {}).then(result => {
    console.log(result);
    res.status(201).json({ message: "Post updated" });
  });
});


module.exports = app;
