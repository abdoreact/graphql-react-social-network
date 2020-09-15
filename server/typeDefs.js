const {gql} = require("apollo-server-express")
module.exports=gql`
    type User{
        username:String
        email:String
        password:String
        id:ID
        error:String
    }
    type Post{
        author:User
        body:String 
        likes:Int
        id:ID
        comments:[Comment]
    }
    type Comment{
        author:User
        body:String    
        id:ID
    }
    type Query{
        user(username:String):User
        post(id:ID):Post
        currentUser(jwt:String):User
        posts:[Post]
    }
    type Mutation{
        register(username:String, email:String, password:String):User
        login(email:String, password:String):User
        post(author:ID, body:String):Post
        like(post:ID, liker:ID):Int
        comment(post:ID, commenter:ID, body:String):Boolean
    }
`