const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
  title: {type: String, required: false},
  content: {type: String, required: false}
});


module.exports = mongoose.model('Post', postSchema);
