const { sign } = require("jsonwebtoken");
const User = require("../models/User");
const Post = require("../models/Post");
const jwtsecret = require("../config.json").jwt;
const checkpassword = require("argon2").verify;
const Comment=require("../models/Comment")
module.exports = {
  register: async (_, { username, email, password }) => {
      try {
        const user = await User.create({ username, email, password });
        return { id: sign({ id: user._id }, jwtsecret) };
      } catch (err) {
        console.log(Object.values(err))
        if (err.code == 11000) {
          return { error: "Error. Email or username already in use." };
        }
        return { error: Object.values(err.errors)[0].properties.message };
      }

  },
  login: async (_, { email, password }) => {
    const user = await User.findOne({ email });
    if (!user) {
      return {
        error: "Error. Email not found.",
      };
    }
    if (!(await checkpassword(user.password, password))) {
      return {
        error: "Error. Incorrect password.",
      };
    }
    return {
      id: sign({ id: user._id }, jwtsecret),
    };
  },
  post: async (_, { author, body }) => {
    const user = await User.findById(author);
    const post = await Post.create({ authorId: user._id, body });
    return {
      author: {
        username: user.username,
        id: user._id,
      },
      body,
      id: post._id,
      likes: post.likers
    };
  },
  like: async (_, { post, liker }) => {
    const likedPost=await Post.findById(post)
    if(await User.findById(liker)){
      if(likedPost.likers.includes(liker)){
        likedPost.likers=likedPost.likers.filter(user => liker !== user)
        await likedPost.save()
        return -1
      }
      likedPost.likers.push(liker)
      await likedPost.save()
      return 1
    }
    return 0
  },
  comment: async (_, { post, commenter, body }) => {
    try{
      const commentedPost=await Post.findById(post)
      if(await User.findById(commenter)){
        const comment = await Comment.create({authorId:commenter, body})
        commentedPost.comments = [...commentedPost.comments, comment._id]
        await commentedPost.save()
        return true
      }
    }
    catch(err){
      return false
    }
  },
};
