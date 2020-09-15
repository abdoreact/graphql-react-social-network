const jwtsecret=require('../config.json').jwt
const Post=require("../models/Post")
const User=require("../models/User")
const {verify} = require('jsonwebtoken')
const Comment=require('../models/Comment')
module.exports={
    user:async (_, {username}) => {
        const user=await User.findOne({username})
        return{
            username:user.username,
            id:user._id
        }
    },
    currentUser:(_, {jwt}) => {
        return verify(jwt, jwtsecret, async (err, decoded) => {
            if(err){
                return{
                    error:'Error. User not found.'
                }
            }
            const user=await User.findById(decoded.id)
            return{
                username:user.username,
                id:user.id
            }
        })
    },
    posts:async () => {
        const posts=await Post.find()
        return posts.reverse().map(async post => {
            const author=await User.findById(post.authorId)
            return{
                likes:post.likers.length,
                author:{
                    username:author.username,
                    id:author._id
                },
                body:post.body,
                id:post._id
            }
        })
    },
    post:async (_, {id}) => {
        const post = await Post.findById(id)
        const author=await User.findById(post.authorId)
        const comments=await Comment.find()

        return {
            id:post._id,
            likes:post.likers.length,
            author:{
                username:author.username,
                id:author._id
            },
            body:post.body,
            comments:comments.filter(comment => post.comments.includes(comment._id)).map(async comment => {
                const commentAuthor=await User.findById(comment.authorId)
                return {
                    body:comment.body,
                    author:{
                        username:commentAuthor.username,
                        id:commentAuthor._id
                    },
                    id:comment._id
                }
            })
        }
    }
}