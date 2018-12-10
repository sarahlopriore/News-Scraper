var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var CommentSchema = new Schema({
    commentTitle: {
        type: String,
        required: true
    },
    
    commentText: {
        type: String,
        required: true
    }
})

var Comment = mongoose.model("Comment", CommentSchema);


module.exports = Comment;