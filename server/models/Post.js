const {model, Schema} = require('mongoose');
module.exports = model('Post', new Schema({
    authorId:String,
    body:String,
    likers:{
        type:[String],
        default:[]
    },
    comments:{
        type:[String],
        default:[]
    }
}))