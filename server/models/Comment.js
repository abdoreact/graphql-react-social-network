const {model, Schema} = require("mongoose");
module.exports=model('Comment', new Schema({
    authorId:String,
    body:String
}))